// ==========================================
// CAMERA LOGIC
// ==========================================
async function startCamera() {
    try {
        if (!stream) {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        }
        const video = document.getElementById('video');
        if(video) video.srcObject = stream;
    } catch (err) { 
        console.error("Camera error", err); 
        showCustomAlert("ไม่สามารถเปิดกล้องได้ กรุณาตรวจสอบสิทธิ์การเข้าถึงกล้อง");
    }
}

function stopCamera() {
    if (stream) { 
        stream.getTracks().forEach(track => track.stop()); 
        stream = null; 
    }
}

function captureImage() {
    const video = document.getElementById('video');
    if(!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 800;
    let width = video.videoWidth;
    let height = video.videoHeight;
    
    if (width > MAX_WIDTH) { 
        height = Math.floor(height * (MAX_WIDTH / width)); 
        width = MAX_WIDTH; 
    }
    
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    
    // Image Optimization
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
    capturedImageBase64 = canvas.toDataURL('image/jpeg', 0.70);
    
    stopCamera();
    renderMainApp();

    const base64Data = capturedImageBase64.split(',')[1];
    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "ocr", base64: base64Data })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) handleOCRResult(res.text);
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
function handleOCRResult(rawText) {
    isProcessingOCR = false;
    const targetModel = dbJobs.find(j => j.job === currentSelectedJob)?.targetModel || "";
    
    // เคลียร์ค่าเก่าก่อน
    extractedModel = ""; extractedLot = ""; extractedDate = "";

    if (rawText.includes(targetModel)) extractedModel = targetModel;
    else { let mMatch = rawText.match(/[A-Z0-9-]{6,15}/); if(mMatch) extractedModel = mMatch[0]; }

    let lotMatch = rawText.match(/TH[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d[\s-]*[a-zA-Z][\s-]*\d/i);
    if(lotMatch) {
        extractedLot = lotMatch[0].toUpperCase().replace(/\s+/g, '').replace(/TH(\d{2})(\d{2})(\d)([A-Z])(\d)/, 'TH $1 $2 $3 $4 $5');
    }

    let dateMatch = rawText.match(/\d{2}\/\d{2}\/\d{4}/);
    if(dateMatch) extractedDate = dateMatch[0];

    renderMainApp();
    
    // ตั้งหน่วงเวลาเล็กน้อยเพื่อให้หน้าจอ Render เสร็จก่อนรันตรวจสอบ
    setTimeout(() => {
        runSmartVerification();
    }, 100);
}

function runSmartVerification() {
    const modelEl = document.getElementById('ocr-model');
    const lotEl = document.getElementById('ocr-lot');
    const dateEl = document.getElementById('ocr-date');
    
    // อัปเดตตัวแปร State จากหน้าจอ (กรณีที่ผู้ใช้งานพิมพ์แก้ข้อผิดพลาด AI เอง)
    if (modelEl) extractedModel = modelEl.value.trim();
    if (lotEl) extractedLot = lotEl.value.trim();
    if (dateEl) extractedDate = dateEl.value.trim();

    const model = extractedModel;
    const lot = extractedLot;
    const dateStr = extractedDate;
    const targetModel = dbJobs.find(j => j.job === currentSelectedJob)?.targetModel || "";
    
    let isPass = true; let messages = [];

    if (model === targetModel && model !== "") { 
        messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> Model ถูกต้อง (${targetModel})</span>`); 
    } else { 
        messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> Model ผิด! (ต้องเป็น ${targetModel})</span>`); 
        isPass = false; 
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    
    const targetNow = new Date(now.valueOf());
    const dayNrNow = (now.getDay() + 6) % 7;
    targetNow.setDate(targetNow.getDate() - dayNrNow + 3);
    const firstThursdayNow = targetNow.valueOf();
    targetNow.setMonth(0, 1);
    if (targetNow.getDay() !== 4) { targetNow.setMonth(0, 1 + ((4 - targetNow.getDay()) + 7) % 7); }
    const currentWeek = 1 + Math.ceil((firstThursdayNow - targetNow) / 604800000);
    const expectedLotYear = currentYear % 100;

    let bYear = 0;
    try {
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
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> วันที่ผลิตไม่ใช่วันนี้! (พบ: ${pDate}/${pMonth+1}/${bYear})</span>`);
            isPass = false;
        }
    } catch (e) { 
        messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> วันที่ผลิตผิดฟอร์แมต (DD/MM/YYYY พ.ศ.)</span>`); 
        isPass = false; 
    }

    const lotParts = lot.split(/\s+/);
    if (lotParts.length >= 6 && lotParts[0] === 'TH') {
        const lotYear = parseInt(lotParts[1], 10);
        const lotWeek = parseInt(lotParts[2], 10);
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

        if (lotShift === 'A' || lotShift === 'B') {
            const isShiftMatch = currentUser.name.toUpperCase().includes(lotShift);
            if (isShiftMatch) {
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
    renderMainApp();
}

function retakePhoto() {
    capturedImageBase64 = null; 
    verificationResult = null; 
    isProcessingOCR = false; 
    extractedModel = "";
    extractedLot = "";
    extractedDate = "";
    renderMainApp();
}
