// ==========================================
// CAMERA LOGIC
// ==========================================
extractedQty = ""; 

async function startCamera() {
    try {
        if (!stream) {
            const constraints = { video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } } };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            try {
                const track = stream.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                if (capabilities && capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
                    await track.applyConstraints({ advanced: [{ focusMode: "continuous" }] });
                }
            } catch (focusErr) { console.log("Focus err:", focusErr); }
        }
        
        const video = document.getElementById('video');
        if(video) {
            video.srcObject = stream;
            video.onloadedmetadata = () => { video.play().catch(e => console.error("Play err:", e)); };
        }
    } catch (err) { 
        showCustomAlert("ไม่สามารถเปิดกล้องได้! กรุณาตรวจสอบว่า:<br>1. คุณได้กดยอมรับสิทธิ์การใช้กล้องแล้ว<br>2. เว็บไซต์นี้ใช้งานผ่าน HTTPS");
    }
}

function stopCamera() {
    if (stream) { stream.getTracks().forEach(track => track.stop()); stream = null; }
}

function captureImage() {
    const video = document.getElementById('video');
    if(!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    let width = video.videoWidth; let height = video.videoHeight;
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0, width, height);
    
    const imageData = ctx.getImageData(0, 0, width, height); const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]; let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        if (gray < 130) gray = gray * 0.7; else gray = Math.min(255, gray * 1.2); 
        data[i] = gray; data[i + 1] = gray; data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);

    const scanner = document.getElementById('scanner-line'); if(scanner) scanner.style.display = 'block';
    
    isProcessingOCR = true;
    capturedImageBase64 = canvas.toDataURL('image/jpeg', 0.95);
    
    stopCamera(); renderMainApp();
    const base64Data = capturedImageBase64.split(',')[1];
    
    fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "ocr", base64: base64Data }) })
    .then(res => res.json())
    .then(res => { if (res.success) handleOCRResult(res.text); else throw new Error(res.error); })
    .catch(err => { showCustomAlert("การประมวลผล AI ล้มเหลว: " + err.message); isProcessingOCR = false; capturedImageBase64 = null; renderMainApp(); });
}

function captureDefectImage() {
    const video = document.getElementById('video');
    if(!video || !video.videoWidth) return;

    const canvas = document.createElement('canvas');
    let width = video.videoWidth; let height = video.videoHeight;
    const MAX_WIDTH = 800;
    if (width > MAX_WIDTH) { height = Math.floor(height * (MAX_WIDTH / width)); width = MAX_WIDTH; }
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(video, 0, 0, width, height);

    capturedImageBase64 = canvas.toDataURL('image/jpeg', 0.8);
    isProcessingOCR = false; 
    
    stopCamera();
    renderMainApp();
}

document.addEventListener('input', function(e) {
    if (!isDefectMode && (e.target.id === 'ocr-model' || e.target.id === 'ocr-lot' || e.target.id === 'ocr-date' || e.target.id === 'ocr-qty')) {
        runSmartVerification(true);
    }
});

function handleOCRResult(rawText) {
    isProcessingOCR = false;
    const jobObj = dbJobs.find(j => j.job === currentSelectedJob);
    const targetModel = jobObj ? jobObj.targetModel : "";
    extractedModel = ""; extractedLot = ""; extractedDate = ""; extractedQty = "";

    if (targetModel !== "" && rawText.includes(targetModel)) extractedModel = targetModel;
    else { let mMatch = rawText.match(/[A-Z0-9-\/]{6,25}/); if(mMatch) extractedModel = mMatch[0]; }

    // 🟢 ตรวจจับ Lot ได้ทั้ง 2 รูปแบบ (แบบเก่า TH 26 11 2 A 1 และแบบใหม่ TH-2026-W11-2-A)
    let lotMatchNew = rawText.match(/TH[\s-]*\d{4}[\s-]*W[\s-]*\d{2}[\s-]*\d[\s-]*[a-zA-Z]/i);
    let lotMatchOld = rawText.match(/TH[\s-]*\d{2}[\s-]*\d{2}[\s-]*\d[\s-]*[a-zA-Z][\s-]*\d/i);

    if (lotMatchNew) {
        // จัดฟอร์แมตแบบใหม่ -> TH-2026-W11-2-A
        let rawLot = lotMatchNew[0].toUpperCase().replace(/[\s-]+/g, ''); 
        extractedLot = rawLot.replace(/TH(\d{4})W(\d{2})(\d)([A-Z])/, 'TH-$1-W$2-$3-$4');
    } else if (lotMatchOld) {
        // จัดฟอร์แมตแบบเก่า -> TH 26 11 2 A 1
        let rawLot = lotMatchOld[0].toUpperCase().replace(/[\s-]+/g, ''); 
        extractedLot = rawLot.replace(/TH(\d{2})(\d{2})(\d)([A-Z])(\d)/, 'TH $1 $2 $3 $4 $5');
    }

    let dateMatch = rawText.match(/\d{2}\/\d{2}\/\d{4}/);
    if(dateMatch) extractedDate = dateMatch[0];

    renderMainApp();
    setTimeout(() => { runSmartVerification(); }, 100);
}

function runSmartVerification(isFromInput = false) {
    if (isDefectMode) return;
    
    const modelEl = document.getElementById('ocr-model'); const lotEl = document.getElementById('ocr-lot');
    const dateEl = document.getElementById('ocr-date'); const qtyEl = document.getElementById('ocr-qty'); 
    if (modelEl) extractedModel = modelEl.value; if (lotEl) extractedLot = lotEl.value;
    if (dateEl) extractedDate = dateEl.value; if (qtyEl) extractedQty = qtyEl.value; 

    const model = extractedModel.trim(); const lot = extractedLot.trim(); const dateStr = extractedDate.trim();
    const jobObj = dbJobs.find(j => j.job === currentSelectedJob);
    const targetModel = jobObj ? jobObj.targetModel : ""; // ถ้ากรอก Job เอง อันนี้จะเป็น ""
    let isPass = true; let messages = [];

    // 🟢 1. เช็ค Model (ปรับรองรับ Job ที่กรอกเอง)
    if (targetModel === "") {
        messages.push(`<span class="text-yellow-600"><i class="fa-solid fa-triangle-exclamation text-xs"></i> Job กรอกเอง: โปรดตรวจสอบ Model ด้วยตาเปล่า</span>`);
    } else if (model === targetModel && model !== "") {
        messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> Model ถูกต้อง (${targetModel})</span>`); 
    } else { 
        messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> Model ผิด! (ต้องเป็น ${targetModel})</span>`); 
        isPass = false; 
    }

    // 🟢 2. กำหนดช่วงวันที่ที่เป็นไปได้ (Production Date) ตามกะการทำงาน
    const now = new Date(); 
    const currentHour = now.getHours();
    
    let possibleDates = [];
    let defaultDate = new Date(now);

    // กะเช้า 08:00 - 17:00 (OT ถึง 22:00)
    // กะดึก 20:00 - 05:00 (OT ถึง 10:00)
    
    if (currentHour < 8) {
        // ช่วง 00:00 - 07:59 (เป็นงานของกะดึกเมื่อวานแน่นอน)
        defaultDate.setDate(defaultDate.getDate() - 1);
        possibleDates.push(new Date(defaultDate));
    } else if (currentHour < 10) {
        // ช่วง 08:00 - 09:59 (เวลาทับซ้อน: อาจจะกะเช้าเริ่มงานวันนี้ หรือกะดึกทำ OT ของเมื่อวาน)
        let yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        possibleDates.push(new Date(now)); // ยอมรับของวันนี้
        possibleDates.push(yesterday);     // ยอมรับของเมื่อวานด้วย
    } else {
        // ช่วง 10:00 - 23:59 (เป็นงานของวันนี้แน่นอน)
        possibleDates.push(new Date(now));
    }

    // 🟢 3. ตรวจสอบ วันที่ผลิต (Date) บนฉลาก (ปรับแก้ไม่ให้บล็อกการส่ง)
    let isDateValid = false;
    let effectiveDate = defaultDate; // จะใช้วันที่นี้ไปคำนวณ Lot (Week/Day) ต่อ

    try {
        if (!dateStr) {
             // ถ้าว่าง ให้แค่เตือน
             messages.push(`<span class="text-yellow-600 font-bold"><i class="fa-solid fa-triangle-exclamation text-xs"></i> ตรวจไม่พบวันที่ผลิตบนฉลาก</span>`);
        } else {
             const dateParts = dateStr.split('/');
             if(dateParts.length !== 3) throw new Error("format");
             
             const pDate = parseInt(dateParts[0], 10);
             const pMonth = parseInt(dateParts[1], 10) - 1;
             const bYear = parseInt(dateParts[2], 10);
             
             if (bYear < 2500 || bYear > 2600 || dateParts[0].length !== 2) throw new Error("format");
             const cYear = bYear - 543;
     
             // ตรวจสอบว่าวันที่บนฉลาก ตรงกับวันใดวันหนึ่งที่เป็นไปได้หรือไม่
             for (let pd of possibleDates) {
                 if (cYear === pd.getFullYear() && pMonth === pd.getMonth() && pDate === pd.getDate()) {
                     isDateValid = true;
                     effectiveDate = pd; // ใช้วันที่ที่แมตช์เจอ ไปใช้คำนวณ Lot
                     break;
                 }
             }
     
             if (isDateValid) {
                 messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> วันที่ผลิตถูกต้อง (ตรงกับกะทำงาน)</span>`);
             } else {
                 // ถ้ามีวันที่แต่อาจจะผิดวัน ก็แค่เตือน
                 messages.push(`<span class="text-yellow-600 font-bold"><i class="fa-solid fa-triangle-exclamation text-xs"></i> วันที่ผลิตอาจจะไม่ตรงกะการทำงานปัจจุบัน (พบ: ${dateStr})</span>`);
             }
        }
    } catch (e) { 
        // ถ้าผิดฟอร์แมต ก็แค่เตือนเช่นกัน
        messages.push(`<span class="text-yellow-600 font-bold"><i class="fa-solid fa-triangle-exclamation text-xs"></i> วันที่ผลิตอาจจะผิดรูปแบบ หรืออ่านค่าไม่ได้</span>`); 
    }

    // 🟢 4. คำนวณสัปดาห์และวันในสัปดาห์ (จาก effectiveDate ที่ผ่านการตรวจสอบแล้ว หรือใช้ defaultDate ถ้าตรวจสอบไม่ผ่าน)
    const currentYear = effectiveDate.getFullYear(); 
    
    let currentDayOfWeek = effectiveDate.getDay(); // 0=อาทิตย์, 1=จันทร์ ... 6=เสาร์
    currentDayOfWeek = currentDayOfWeek + 1; // แปลงให้ 1=อาทิตย์, 2=จันทร์, 7=เสาร์
    
    // คำนวณสัปดาห์โดยใช้วันอาทิตย์เป็นวันแรกของสัปดาห์
    const startOfYear = new Date(effectiveDate.getFullYear(), 0, 1);
    const startOfYearDay = startOfYear.getDay(); // 0=อาทิตย์
    // หาวันอาทิตย์แรกของปี (หรือก่อนปี ถ้า 1 ม.ค. ไม่ใช่วันอาทิตย์)
    const firstSunday = new Date(startOfYear);
    if (startOfYearDay !== 0) {
        firstSunday.setDate(firstSunday.getDate() - startOfYearDay);
    }
    const diffMs = effectiveDate.getTime() - firstSunday.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const currentWeek = Math.floor(diffDays / 7) + 1; 
    const expectedLotYear = currentYear % 100;

    // 🟢 5. ตรวจสอบ Lot No (รองรับ 2 Format แบบชาญฉลาด)
    let isLotValidFormat = false;
    let lotYear = 0, lotWeek = 0, lotDay = 0, lotTeam = "";
    let isNewFormat = false;

    if (lot.includes('-W')) {
        // แตกข้อมูล Lot แบบใหม่: TH-2026-W11-2-A
        const lotParts = lot.split('-');
        if (lotParts.length >= 5 && lotParts[0] === 'TH') {
            lotYear = parseInt(lotParts[1], 10); // เช่น 2026
            lotWeek = parseInt(lotParts[2].replace('W', ''), 10); // เช่น 11
            lotDay = parseInt(lotParts[3], 10); // เช่น 2
            lotTeam = lotParts[4].toUpperCase(); // เช่น A
            isNewFormat = true;
            isLotValidFormat = true;
        }
    } else {
        // แตกข้อมูล Lot แบบเก่า: TH 26 11 2 A 1
        const lotParts = lot.split(/\s+/);
        if (lotParts.length >= 5 && lotParts[0] === 'TH') {
            lotYear = parseInt(lotParts[1], 10); // เช่น 26
            lotWeek = parseInt(lotParts[2], 10);
            lotDay = parseInt(lotParts[3], 10);
            lotTeam = lotParts[4].toUpperCase();
            isLotValidFormat = true;
        }
    }

    if (isLotValidFormat) {
        // ถ้าเป็นแบบใหม่ ให้เทียบกับปีเต็ม (2026) ถ้าเป็นแบบเก่า เทียบกับเลข 2 หลัก (26)
        let targetYearForLot = isNewFormat ? currentYear : expectedLotYear;

        if (lotYear === targetYearForLot) {
            messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> ปีใน Lot (${lotYear}) ถูกต้อง</span>`);
        } else { 
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> ปีใน Lot (${lotYear}) ผิด (ต้องเป็น ${targetYearForLot})</span>`); 
            isPass = false; 
        }
        
        if (lotWeek === currentWeek) {
            messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> สัปดาห์ใน Lot (${lotWeek}) ถูกต้อง</span>`);
        } else { 
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> สัปดาห์ใน Lot (${lotWeek}) ผิด (ต้องเป็น ${currentWeek})</span>`); 
            isPass = false; 
        }
        
        if (lotDay === currentDayOfWeek) {
            messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> วันในสัปดาห์ (${lotDay}) ถูกต้อง</span>`);
        } else { 
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> วันในสัปดาห์ Lot (${lotDay}) ผิด (วันนี้คือวันที่ ${currentDayOfWeek})</span>`); 
            isPass = false; 
        }
        
        // เช็คทีม (A หรือ B)
        if (lotTeam === 'A' || lotTeam === 'B') {
            const isAdmin = typeof currentUser !== 'undefined' && currentUser && currentUser.role === 'admin';
            const isTeamMatch = typeof currentUser !== 'undefined' && currentUser && currentUser.name.toUpperCase().includes(lotTeam);
            if (isAdmin) {
                messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> ทีมใน Lot (${lotTeam}) (อนุญาตสิทธิ์ Admin)</span>`);
            } else if (isTeamMatch) {
                messages.push(`<span class="text-green-600"><i class="fa-solid fa-check text-xs"></i> ทีมใน Lot (${lotTeam}) ตรงกับผู้สแกน</span>`);
            } else { 
                messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> ทีมใน Lot (${lotTeam}) ไม่ตรงกับผู้สแกน</span>`); 
                isPass = false; 
            }
        } else { 
            messages.push(`<span class="text-red-600 font-bold"><i class="fa-solid fa-xmark text-xs"></i> ทีมต้องเป็น A หรือ B (พบ: ${lotTeam})</span>`); 
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
            selectionStart = document.activeElement.selectionStart; selectionEnd = document.activeElement.selectionEnd;
        }
        renderMainApp(); 
        if (activeId) { const el = document.getElementById(activeId); if (el) { el.focus(); try { el.setSelectionRange(selectionStart, selectionEnd); } catch(e){} } }
    } else { renderMainApp(); }
}

function retakePhoto() {
    capturedImageBase64 = null; verificationResult = null; isProcessingOCR = false; 
    extractedModel = ""; extractedLot = ""; extractedDate = ""; extractedQty = "";
    renderMainApp();
}
