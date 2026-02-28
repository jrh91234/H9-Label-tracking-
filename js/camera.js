// ==========================================
// CAMERA LOGIC
// ==========================================
let extractedQty = ""; // ตัวแปรสำหรับเก็บค่าจำนวน

async function startCamera() {
    try {
        if (!stream) {
            // ขอสิทธิ์และเปิดกล้องหลัง
            const constraints = {
                video: { 
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                } 
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // พยายามเปิดระบบ Auto Focus (Continuous)
            try {
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                if (capabilities && capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: "continuous" }]
                    });
                }
            } catch (focusErr) {
                console.log("อุปกรณ์ไม่รองรับ Auto Focus หรือเกิดข้อผิดพลาดในการตั้งค่า:", focusErr);
            }
        }
        
        const video = document.getElementById('video');
        if(video) {
            video.srcObject = stream;
            
            // 🟢 [แก้ไข] บังคับให้ Video เล่นทันทีที่โหลดข้อมูลกล้องเสร็จ (แก้ปัญหากล้องดำ)
            video.onloadedmetadata = () => {
                video.play().catch(e => {
                    console.error("ไม่สามารถเล่นวิดีโอได้:", e);
                });
            };
        }
    } catch (err) { 
        console.error("Camera error:", err); 
        // 🟢 [แก้ไข] แจ้งเตือนให้ชัดเจนขึ้นว่าอาจจะเกิดจาก HTTPS หรือไม่ได้ให้สิทธิ์
        showCustomAlert("ไม่สามารถเปิดกล้องได้! กรุณาตรวจสอบว่า:<br>1. คุณได้กดยอมรับสิทธิ์การใช้กล้องแล้ว<br>2. เว็บไซต์นี้ใช้งานผ่าน HTTPS (มีรูปแม่กุญแจ)");
    }
}

function stopCamera() {
    if (stream) { 
        stream.getTracks().forEach(track => track.stop()); 
        stream = null; 
    }
}

async function captureImage() {
    const video = document.getElementById('video');
    if(!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    let width = video.videoWidth;
    let height = video.videoHeight;
    
    canvas.width = width; 
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    
    // Image Optimization (ทำภาพขาวดำ + เพิ่ม Contrast)
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if (gray < 130) gray = gray * 0.7; else gray = Math.min(255, gray * 1.2); 
        data[i] = gray; data[i + 1] = gray; data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);

    const scanner = document.getElementById('scanner-line');
    if(scanner) scanner.style.display = 'block';
    
    isProcessingOCR = true;
    capturedImageBase64 = canvas.toDataURL('image/jpeg', 0.95);
    
    // อ่าน Barcode
    let barcodeText = "";
    if ('BarcodeDetector' in window) {
        try {
            const barcodeDetector = new BarcodeDetector();
            const barcodes = await barcodeDetector.detect(canvas);
            barcodeText = barcodes.map(b => b.rawValue).join(" ");
        } catch (err) {
            console.log("BarcodeDetector error:", err);
        }
    }

    stopCamera();
    renderMainApp();

    const base64Data = capturedImageBase64.split(',')[1];
    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "ocr", base64: base64Data })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            handleOCRResult(res.text + " " + barcodeText);
        }
        else throw new Error(res.error);
    })
    .catch(err => {
        showCustomAlert("การประมวลผล AI ล้มเหลว: " + err.message);
        isProcessingOCR = false; capturedImageBase64 = null; renderMainApp();
    });
}

// ==========================================
// OCR & SMART VERIFICATION
// ==========================================

// ดักจับการพิมพ์เพื่อรัน Auto-detect
document.addEventListener('input', function(e) {
    if (e.target.id === 'ocr-model' || e.target.id === 'ocr-lot' || e.target.id === 'ocr-date' || e.target.id === 'ocr-qty') {
        runSmartVerification(true);
    }
});

function handleOCRResult(rawText) {
    isProcessingOCR = false;
    const targetModel = dbJobs.find(j => j.job === currentSelectedJob)?.targetModel || "";
    
    // เคลียร์ค่าทั้งหมด
    extractedModel = ""; extractedLot = ""; extractedDate = ""; extractedQty = "";

    if (rawText.includes(targetModel)) extractedModel = targetModel;
    else { 
        let mMatch = rawText.match(/[A-Z0-9-\/]{6,25}/); 
        if(mMatch) extractedModel = mMatch[0]; 
    }

    let lotMatch = rawText.match(/TH[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d[\s-]*[a-zA-Z][\s-]*\d/i);
    if(lotMatch) {
        extractedLot = lotMatch[0].toUpperCase().replace(/\s+/g, '').replace(/TH(\d{2})(\d{2})(\d)([A-Z])(\d)/, 'TH $1 $2 $3 $4 $5');
    }

    let dateMatch = rawText.match(/\d{2}\/\d{2}\/\d{4}/);
    if(dateMatch) extractedDate = dateMatch[0];

    renderMainApp();
    
    setTimeout(() => {
        runSmartVerification();
    }, 100);
}

function runSmartVerification(isFromInput = false) {
    const modelEl = document.getElementById('ocr-model');
    const lotEl = document.getElementById('ocr-lot');
    const dateEl = document.getElementById('ocr-date');
    const qtyEl = document.getElementById('ocr-qty'); 
    
    // อัปเดตตัวแปร State จากหน้าจอ
    if (modelEl) extractedModel = modelEl.value;
    if (lotEl) extractedLot = lotEl.value;
    if (dateEl) extractedDate = dateEl.value;
    if (qtyEl) extractedQty = qtyEl.value; 

    const model = extractedModel.trim();
    const lot = extractedLot.trim();
    const dateStr = extractedDate.trim();
    const targetModel = dbJobs.find(j => j.job === currentSelectedJob)?.targetModel || "";
    
    let isPass = true; let messages = [];

    // 1. เช็ค Model
    if (model === targetModel && model !== "") { 
        messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> Model ถูกต้อง (${targetModel})</span>`); 
    } else { 
        messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> Model ผิด! (ต้องเป็น ${targetModel})</span>`); 
        isPass = false; 
    }

    // ตัวแปรเวลาปัจจุบัน
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    
    // คำนวณวันในสัปดาห์: 1 = วันอาทิตย์, 2 = วันจันทร์, ..., 7 = วันเสาร์
    let currentDayOfWeek = now.getDay() + 1;
    const dayNames = ["", "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

    // คำนวณ Week ปัจจุบัน
    const targetNow = new Date(now.valueOf());
    const dayNrNow = (now.getDay() + 6) % 7;
    targetNow.setDate(targetNow.getDate() - dayNrNow + 3);
    const firstThursdayNow = targetNow.valueOf();
    targetNow.setMonth(0, 1);
    if (targetNow.getDay() !== 4) { targetNow.setMonth(0, 1 + ((4 - targetNow.getDay()) + 7) % 7); }
    const currentWeek = 1 + Math.ceil((firstThursdayNow - targetNow) / 604800000);
    const expectedLotYear = currentYear % 100;

    // 2. เช็ค Date
    let bYear = 0;
    try {
        if (dateStr === "") {
            messages.push(`<span class="text-yellow-600"><i class="fa-solid fa-triangle-exclamation text-xs"></i> ไม่พบวันที่ผลิต (อนุโลมให้ผ่าน)</span>`);
        } else {
            const dateParts = dateStr.split('/');
            if(dateParts.length !== 3) throw new Error();
            
            const pDate = parseInt(dateParts[0], 10);
            const pMonth = parseInt(dateParts[1], 10) - 1;
            bYear = parseInt(dateParts[2], 10);
            
            if (bYear < 2500 || bYear > 2600 || dateParts[0].length !== 2) throw new Error();
            
            const cYear = bYear - 543;
            if (cYear === currentYear && pMonth === currentMonth && pDate === currentDate) {
                messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> วันที่ผลิตตรงกับวันนี้ (ปัจจุบัน)</span>`);
            } else {
                messages.push(`<span class="text-yellow-600 font-bold"><i class="fa-solid fa-triangle-exclamation text-xs"></i> วันที่ผลิตไม่ใช่วันนี้! (พบ: ${pDate}/${pMonth+1}/${bYear}) - อนุโลมให้ผ่าน</span>`);
            }
        }
    } catch (e) { 
        messages.push(`<span class="text-yellow-600 font-bold"><i class="fa-solid fa-triangle-exclamation text-xs"></i> วันที่ผลิตผิดฟอร์แมต (DD/MM/YYYY พ.ศ.) - อนุโลมให้ผ่าน</span>`); 
    }

    // 3. เช็ค Lot
    const lotParts = lot.split(/\s+/);
    if (lotParts.length >= 6 && lotParts[0] === 'TH') {
        const lotYear = parseInt(lotParts[1], 10);
        const lotWeek = parseInt(lotParts[2], 10);
        const lotDay = parseInt(lotParts[3], 10);
        const lotShift = lotParts[4].toUpperCase();

        if (lotYear === expectedLotYear) {
            messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> ปีใน Lot (${lotYear}) ตรงกับปีปัจจุบัน</span>`);
        } else { 
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> ปีใน Lot (${lotYear}) ไม่ตรงปีปัจจุบัน (${expectedLotYear})</span>`); 
            isPass = false; 
        }

        if (lotWeek === currentWeek) {
            messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> สัปดาห์ใน Lot (${lotWeek}) ตรงสัปดาห์ปัจจุบัน</span>`);
        } else {
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> สัปดาห์ Lot (${lotWeek}) ผิด (สัปดาห์นี้ = ${currentWeek})</span>`);
            isPass = false;
        }

        if (lotDay === currentDayOfWeek) {
            messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> วันในสัปดาห์ (${lotDay}) ตรงกับวันนี้ (วัน${dayNames[currentDayOfWeek]})</span>`);
        } else {
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> วันในสัปดาห์ Lot (${lotDay}) ผิด! (วันนี้คือ ${currentDayOfWeek} = วัน${dayNames[currentDayOfWeek]})</span>`);
            isPass = false;
        }

        if (lotShift === 'A' || lotShift === 'B') {
            const isAdmin = currentUser && currentUser.role === 'admin';
            const isShiftMatch = currentUser && currentUser.name.toUpperCase().includes(lotShift);
            
            if (isAdmin) {
                messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> กะใน Lot (${lotShift}) (อนุญาตสิทธิ์ Admin)</span>`);
            } else if (isShiftMatch) {
                messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> กะใน Lot (${lotShift}) ตรงกับชื่อผู้สแกน</span>`);
            } else {
                messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> กะใน Lot (${lotShift}) ไม่ตรงสิทธิ์ผู้สแกน</span>`);
                isPass = false;
            }
        } else {
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> กะต้องเป็น A หรือ B (พบ: ${lotShift})</span>`);
            isPass = false;
        }
    } else { 
        messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> Lot No ผิดฟอร์แมต หรืออ่านได้ไม่ครบ</span>`); 
        isPass = false; 
    }

    verificationResult = { isPass, messages };

    if (isFromInput) {
        const activeId = document.activeElement ? document.activeElement.id : null;
        let selectionStart = 0, selectionEnd = 0;
        if (activeId && (activeId === 'ocr-model' || activeId === 'ocr-lot' || activeId === 'ocr-date' || activeId === 'ocr-qty')) {
            selectionStart = document.activeElement.selectionStart;
            selectionEnd = document.activeElement.selectionEnd;
        }
        
        renderMainApp(); 
        
        if (activeId) {
            const el = document.getElementById(activeId);
            if (el) {
                el.focus();
                try { el.setSelectionRange(selectionStart, selectionEnd); } catch(e){}
            }
        }
    } else {
        renderMainApp();
    }
}

function retakePhoto() {
    capturedImageBase64 = null; 
    verificationResult = null; 
    isProcessingOCR = false; 
    extractedModel = "";
    extractedLot = "";
    extractedDate = "";
    extractedQty = "";
    renderMainApp();
}
