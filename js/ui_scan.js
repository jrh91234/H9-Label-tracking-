// ==========================================
// RENDER VIEWS (SCAN)
// ==========================================

function getBatchOptionsHTML() {
    let options = '';
    if (isLoadingJobs) {
        options = `<option value="">${t("กำลังตรวจสอบเครื่องปริ้น...")}</option>`;
    } else {
        if (dbBatches.length === 0) {
            options = `<option value="">❌ ${t("ไม่พบคิวการปริ้น (กรุณาสั่งปริ้นก่อนเข้าแอป)")}</option>`;
        } else {
            options = `<option value="">${t("-- เลือกเลข Batch ที่เพิ่งปริ้น --")}</option>` + dbBatches.map(b => {
                let cleanDocName = b.docName ? b.docName.split('\\').pop().split('/').pop() : 'Unknown';
                let printQtyText = b.printQty ? `| จำนวน: ${b.printQty} ` : ''; // 🟢 แสดงจำนวนดวง
                
                // ตัวอย่าง: B-260301-100000 (ไฟล์: label.pdf | จำนวน: 50 | 10:00:00)
                return `<option value="${b.batchNo}">${b.batchNo} (ไฟล์: ${cleanDocName} ${printQtyText}| ${b.timestamp.split(' ')[1]})</option>`;
            }).join('');
        }
        options += `<option value="MANUAL" class="text-red-600 font-bold">${t("⚠️ ฉุกเฉิน: ไม่พบเลขในระบบ (กรอกเอง)")}</option>`;
    }
    return options;
}

function updateBatchDropdownUI() {
    const select = document.getElementById('batch-selector');
    if (select) {
        const currentVal = select.value;
        select.innerHTML = getBatchOptionsHTML();
        if (currentVal && select.querySelector(`option[value="${currentVal}"]`)) {
            select.value = currentVal;
        }
    }
    const defectBtn = document.getElementById('defect-mode-btn');
    if (defectBtn && dbBatches) {
         defectBtn.disabled = dbBatches.length === 0 && !document.getElementById('manual-batch-input')?.value;
    }
}

window.toggleManualBatchInput = function() {
    const select = document.getElementById('batch-selector');
    const container = document.getElementById('manual-batch-container');
    const input = document.getElementById('manual-batch-input');
    
    if (select && container && input) {
        if (select.value === 'MANUAL') {
            container.style.display = 'block';
            if (!input.value) {
                const d = new Date();
                const y = String(d.getFullYear()).slice(-2);
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const h = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                const sec = String(d.getSeconds()).padStart(2, '0');
                input.value = `B-${y}${m}${day}-${h}${min}${sec} [NET-ERR]`;
            }
        } else {
            container.style.display = 'none';
        }
    }
};

function renderScanView(container) {
    if (!currentSelectedJob && !isDefectMode) {
        let jobOptions = "";
        let isSelectDisabled = false;

        if (isLoadingJobs) {
            jobOptions = `<option value="">${t("⏳ กำลังโหลดแผนจาก API...")}</option>`;
            isSelectDisabled = true;
        } else {
            if (dbJobs.length === 0) {
                jobOptions = `<option value="">${t("❌ ไม่พบ Job Order")}</option>`;
                isSelectDisabled = true;
            } else {
                jobOptions = `<option value="">${t("-- เลือก Job Order --")}</option>` + dbJobs.map(j => `<option value="${j.job}">${j.job} (Model: ${j.targetModel})</option>`).join('');
            }
        }

        container.innerHTML = `
            <div class="max-w-md mx-auto fade-in mt-10 p-4">
                <div class="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
                    <h2 class="font-bold text-lg text-gray-800 mb-4">
                        <i class="fa-solid fa-clipboard-list text-blue-500 mr-2"></i> 1. ${t("เตรียมการสแกน")}
                    </h2>
                    
                    <p class="text-xs text-gray-500 mb-1">${t("เลือก Job Order")}</p>
                    <select id="job-selector" class="w-full p-3 border rounded-lg bg-gray-50 text-base font-bold mb-4 text-gray-800" ${isSelectDisabled ? 'disabled' : ''}>
                        ${jobOptions}
                    </select>

                    <p class="text-xs text-blue-600 font-bold mb-1">
                        <i class="fa-solid fa-print"></i> ${t("เลือกรหัสเครื่องปริ้น (Batch No)")}
                    </p>
                    <select id="batch-selector" onchange="toggleManualBatchInput()" class="w-full p-3 border-2 border-blue-200 rounded-lg bg-blue-50 text-base font-bold mb-2 text-blue-800" ${isSelectDisabled ? 'disabled' : ''}>
                        ${getBatchOptionsHTML()}
                    </select>
                    
                    <div id="manual-batch-container" style="display: none;" class="mb-6 fade-in">
                        <label class="block text-[10px] text-red-500 uppercase font-bold mb-1"><i class="fa-solid fa-triangle-exclamation"></i> ${t("รหัสอ้างอิงสร้างอัตโนมัติเนื่องจาก Network ปลายทางขาดการเชื่อมต่อ")}</label>
                        <input type="text" id="manual-batch-input" class="w-full p-3 border-2 border-red-300 rounded-lg bg-red-50 text-red-800 font-bold outline-none focus:border-red-500 transition" placeholder="${t("พิมพ์เลข Batch / อ้างอิงฉุกเฉิน...")}">
                    </div>

                    <div class="${isSelectDisabled ? 'mt-6' : ''} grid grid-cols-2 gap-2 mt-2">
                        <button onclick="selectJobAndStartCamera()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 flex flex-col justify-center items-center gap-1" ${isSelectDisabled ? 'disabled' : ''}>
                            <i class="fa-solid fa-camera text-xl"></i> 
                            <span class="text-sm">${t("สแกนปกติ")}</span>
                        </button>
                        <button id="defect-mode-btn" onclick="startDefectMode()" class="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 flex flex-col justify-center items-center gap-1" ${isSelectDisabled ? 'disabled' : ''}>
                            <i class="fa-solid fa-trash-can text-xl"></i> 
                            <span class="text-sm">${t("แจ้งปริ้นเสีย")}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const jobObj = dbJobs.find(j => j.job === currentSelectedJob);
    const targetModel = jobObj ? jobObj.targetModel : "Unknown";

    if (!capturedImageBase64 && !isProcessingOCR) {
        let shutterAction = isDefectMode ? "captureDefectImage()" : "captureImage()";
        let headerText = isDefectMode ? t("ถ่ายรูปหลักฐานงานเสีย") : currentSelectedJob;
        let subText = isDefectMode ? `<i class="fa-solid fa-print"></i> ${t("โหมดบันทึกงานเสีย")}` : `<i class="fa-solid fa-print"></i> ${currentSelectedBatch}`;
        
        container.innerHTML = `
            <div class="fixed inset-0 z-50 bg-black flex flex-col fade-in">
                <div class="absolute top-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/70 to-transparent">
                    <button onclick="changeJob()" class="w-10 h-10 rounded-full bg-white/20 text-white flex justify-center items-center backdrop-blur-sm active:scale-95">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="text-right">
                        <div class="${isDefectMode ? 'text-red-400' : 'text-white'} font-bold text-sm drop-shadow-md">${headerText}</div>
                        <div class="${isDefectMode ? 'text-white' : 'text-blue-300'} text-xs drop-shadow-md">${subText}</div>
                    </div>
                </div>
                <div class="flex-1 w-full h-full flex justify-center items-center relative overflow-hidden">
                    <video id="video" class="w-full h-full object-cover" autoplay playsinline></video>
                    ${!isDefectMode ? `<div class="scanner-line z-10" id="scanner-line"></div>` : ''}
                </div>
                <div class="absolute bottom-0 w-full p-8 flex justify-center items-center z-20 pb-safe bg-gradient-to-t from-black/80 to-transparent">
                    <div class="shutter-btn" onclick="${shutterAction}">
                        <div class="shutter-btn-inner ${isDefectMode ? 'bg-red-500' : 'bg-white'}"></div>
                    </div>
                </div>
            </div>
        `;
        startCamera();
        return;
    }

    const safeModel = typeof extractedModel !== 'undefined' ? extractedModel : '';
    const safeLot = typeof extractedLot !== 'undefined' ? extractedLot : '';
    const safeDate = typeof extractedDate !== 'undefined' ? extractedDate : '';
    const safeQty = typeof extractedQty !== 'undefined' ? extractedQty : ''; 

    let innerContent = '';
    
    if (isDefectMode) {
        innerContent = `
            <div class="space-y-4">
                <h3 class="font-bold text-red-600 text-sm flex items-center border-b pb-2">
                    <i class="fa-solid fa-triangle-exclamation mr-2 text-lg"></i> ${t("บันทึกข้อมูลงานเสีย (Defect)")}
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">${t("จำนวนที่ปริ้นเสีย (ดวง)")} <span class="text-red-500">*</span></label>
                        <input type="number" id="defect-qty" class="w-full border-2 border-red-200 py-2 px-3 rounded-lg font-bold text-gray-800 text-base focus:border-red-500 outline-none transition bg-red-50" placeholder="${t("ระบุจำนวน")}">
                    </div>
                    <div>
                        <label class="block text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">${t("สาเหตุ / อาการเสีย")} <span class="text-red-500">*</span></label>
                        <textarea id="defect-reason" rows="3" class="w-full border-2 border-gray-200 py-2 px-3 rounded-lg text-sm focus:border-red-500 outline-none transition" placeholder="${t("เช่น กระดาษติด, หมึกจาง, ปริ้นเทสระบบ...")}"></textarea>
                    </div>
                </div>
                <div id="submit-action-container">
                    <button onclick="submitDefectToQC()" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition mt-4 flex justify-center items-center gap-2" id="submit-btn">
                        <i class="fa-solid fa-save"></i> ${t("บันทึกข้อมูลงานเสีย")}
                    </button>
                </div>
            </div>
        `;
    } 
    else if (isProcessingOCR) {
        innerContent = `
            <div class="h-full flex flex-col justify-center items-center py-10">
                <div class="loader loader-blue loader-large mb-4"></div>
                <p class="text-blue-600 font-bold mt-4">${t("AI กำลังอ่านข้อความ...")}</p>
                <p class="text-xs text-gray-500 mt-2 text-center">${t("ระบบกำลังสกัดข้อมูลจากรูปภาพ<br>และคำนวณตรวจสอบความถูกต้อง")}</p>
            </div>
        `;
    } else {
        let testModeHtml = currentUser.role === 'admin' ? `
            <div class="mt-4 flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label for="test-mode-toggle" class="text-sm font-bold text-yellow-800 flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-flask text-yellow-600"></i> ${t("ส่งเป็นข้อมูลทดสอบระบบ")}
                </label>
                <input type="checkbox" id="test-mode-toggle" class="w-5 h-5 accent-yellow-600 cursor-pointer">
            </div>
        ` : '';
        
        let verifyHtml = '';
        if (!verificationResult) {
            verifyHtml = `
                <button onclick="runSmartVerification()" class="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow transition mt-6 flex justify-center items-center gap-2">
                    <i class="fa-solid fa-magnifying-glass-check"></i> ${t("กดตรวจสอบความถูกต้อง")}
                </button>
            `;
        } else {
            let msgList = verificationResult.messages.map(m => `<li>${m}</li>`).join('');
            let resultIcon = verificationResult.isPass ? '<i class="fa-solid fa-circle-check mr-2 text-xl"></i>' : '<i class="fa-solid fa-circle-xmark mr-2 text-xl"></i>';
            let resultText = verificationResult.isPass ? t("ผลตรวจสอบ: ผ่าน (PASS)") : t("ผลตรวจสอบ: พบข้อผิดพลาด (NG)");
            verifyHtml = `
                <div class="mt-4 p-4 rounded-xl border-2 ${verificationResult.isPass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                    <h4 class="font-bold text-base mb-3 flex items-center ${verificationResult.isPass ? 'text-green-700' : 'text-red-700'}">
                        ${resultIcon} ${resultText}
                    </h4>
                    <ul class="text-xs space-y-1.5 text-gray-700">${msgList}</ul>
                </div>
                ${testModeHtml}
                <div id="submit-action-container">
                    <button onclick="submitToQC()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" ${!verificationResult.isPass ? 'disabled' : ''} id="submit-btn">
                        <i class="fa-solid fa-paper-plane"></i> ${t("ส่งผลตรวจสอบให้ QC")}
                    </button>
                </div>
            `;
        }

        innerContent = `
            <div class="space-y-4">
                <h3 class="font-bold text-sm text-gray-700 flex items-center border-b pb-2">
                    <i class="fa-solid fa-robot text-blue-500 mr-2 text-lg"></i> ${t("ผลลัพธ์ที่ AI อ่านได้")}
                </h3>
                <div class="space-y-3">
                    <div>
                        <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">1. Model</label>
                        <input type="text" id="ocr-model" class="w-full border-b-2 border-gray-200 py-1 font-bold text-blue-800 text-base focus:border-blue-500 outline-none transition" value="${safeModel}">
                    </div>
                    <div>
                        <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">2. Lot No. (TH YY WW DD Shift Line)</label>
                        <input type="text" id="ocr-lot" class="w-full border-b-2 border-gray-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition uppercase" value="${safeLot}">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">3. ${t("วันที่ผลิต")}</label>
                            <input type="text" id="ocr-date" class="w-full border-b-2 border-gray-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition" value="${safeDate}">
                        </div>
                        <div>
                            <label class="text-[10px] text-blue-600 uppercase font-bold tracking-wider">4. ${t("จำนวน (Print Qty)")} <span class="text-red-500">*</span></label>
                            <input type="number" id="ocr-qty" class="w-full border-b-2 border-blue-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition bg-blue-50 px-2 rounded-t-md" value="${safeQty}" placeholder="${t("ระบุจำนวน")}">
                        </div>
                    </div>
                </div>
                ${verifyHtml}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="max-w-md mx-auto fade-in h-full flex flex-col pb-4 md:pt-4">
            <div class="bg-white rounded-xl shadow-sm md:shadow-md overflow-hidden flex-1 flex flex-col border border-gray-200">
                <div class="p-3 ${isDefectMode ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border-b flex justify-between items-center">
                    <div>
                        <span class="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">
                            ${isDefectMode ? t('โหมดงานเสีย') : t('Job ปัจจุบัน')}
                        </span>
                        <span class="font-bold ${isDefectMode ? 'text-red-800' : 'text-blue-800'} text-sm">
                            ${isDefectMode ? t('แจ้งปัญหาการปริ้น') : currentSelectedJob}
                        </span>
                        <span class="block text-[10px] ${isDefectMode ? 'text-red-600' : 'text-blue-600'} font-bold mt-0.5">
                            <i class="fa-solid fa-print"></i> ${currentSelectedBatch}
                        </span>
                    </div>
                    <button onclick="changeJob()" class="text-[10px] ${isDefectMode ? 'text-red-600 border-red-600' : 'text-blue-600 border-blue-600'} border px-2 py-1 rounded bg-white font-bold h-fit">
                        <i class="fa-solid fa-pen"></i> ${t("เปลี่ยน")}
                    </button>
                </div>
                
                <div class="bg-black flex justify-center items-center h-48 md:h-64 relative border-b cursor-pointer" onclick="if('${capturedImageBase64}') showImageModal('${capturedImageBase64}')" title="คลิกเพื่อขยายรูปภาพ">
                    <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none z-10">
                        <i class="fa-solid fa-magnifying-glass-plus"></i> ${t("ขยาย")}
                    </div>
                    <img src="${capturedImageBase64 || ''}" class="w-full h-full object-contain pointer-events-none" />
                    
                    <button onclick="event.stopPropagation(); retakePhoto()" class="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm border border-white/20 shadow z-10">
                        <i class="fa-solid fa-rotate-right mr-1"></i> ${t("ถ่ายใหม่")}
                    </button>
                </div>
                
                <div class="p-4 bg-white overflow-y-auto flex-1">
                    ${innerContent}
                </div>
            </div>
        </div>
    `;
}

function getSelectedBatchValue() {
    let val = document.getElementById('batch-selector') ? document.getElementById('batch-selector').value : null;
    if (val === 'MANUAL') {
        val = document.getElementById('manual-batch-input') ? document.getElementById('manual-batch-input').value.trim() : "";
    }
    return val;
}

function selectJobAndStartCamera() {
    currentSelectedJob = document.getElementById('job-selector').value;
    currentSelectedBatch = getSelectedBatchValue();

    if(!currentSelectedJob) return showCustomAlert(t("กรุณาเลือก Job Order ก่อนครับ"));
    if(!currentSelectedBatch || currentSelectedBatch.includes('[NET-ERR] ') && currentSelectedBatch.trim() === '[NET-ERR]') return showCustomAlert(t("กรุณาเลือกหรือกรอกเลข Batch อ้างอิง ก่อนครับ"));

    isDefectMode = false;
    renderMainApp();
}

function startDefectMode() {
    currentSelectedBatch = getSelectedBatchValue();
    if(!currentSelectedBatch || currentSelectedBatch.includes('[NET-ERR] ') && currentSelectedBatch.trim() === '[NET-ERR]') return showCustomAlert(t("กรุณาเลือกหรือกรอกเลข Batch อ้างอิงที่ต้องการแจ้งเสียก่อนครับ"));
    
    isDefectMode = true;
    currentSelectedJob = "DEFECT"; 
    renderMainApp();
}

function changeJob() { 
    currentSelectedJob = null; 
    currentSelectedBatch = null;
    capturedImageBase64 = null; 
    verificationResult = null; 
    isProcessingOCR = false;
    isDefectMode = false;
    
    try { 
        extractedModel = ""; extractedLot = ""; extractedDate = ""; extractedQty = ""; 
    } catch(e) {}
    
    stopCamera(); 
    renderMainApp(); 
}

function submitToQC() {
    const qtyInput = document.getElementById('ocr-qty');
    if (qtyInput && !qtyInput.value.trim()) return showCustomAlert(t("กรุณาระบุ 'จำนวน (Print Qty)' ก่อนส่งให้ QC ตรวจสอบ"));

    const isTestMode = document.getElementById('test-mode-toggle') && document.getElementById('test-mode-toggle').checked;
    const finalJobOrder = isTestMode ? `[TEST] ${currentSelectedJob}` : currentSelectedJob;

    const btnContainer = document.getElementById('submit-action-container');
    if(btnContainer) {
        btnContainer.innerHTML = `<div class="w-full text-center py-4 text-blue-600 font-bold bg-blue-50 rounded-lg mt-4 border border-blue-200"><div class="loader loader-blue mb-2"></div> ${t("กำลังอัปโหลดข้อมูลสู่ Cloud...")}</div>`;
    }

    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; 
        let width = img.width; let height = img.height;
        if (width > MAX_WIDTH) { height = Math.floor(height * (MAX_WIDTH / width)); width = MAX_WIDTH; }
        canvas.width = width; canvas.height = height; 
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, width, height);
        
        const reducedImageBase64 = canvas.toDataURL('image/jpeg', 0.6);

        const newTicket = {
            jobOrder: finalJobOrder, model: document.getElementById('ocr-model').value, lot: document.getElementById('ocr-lot').value,
            date: document.getElementById('ocr-date').value, qty: qtyInput ? qtyInput.value.trim() : '', 
            operator: currentUser.name, batchNo: currentSelectedBatch, image: reducedImageBase64
        };

        fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "saveTicket", payload: newTicket }) })
        .then(res => res.json())
        .then(res => {
            if (res.success) { 
                showCustomAlert(t("ส่งข้อมูลให้ QC ตรวจสอบสำเร็จ!"), true); 
                capturedImageBase64 = null; verificationResult = null; fetchPeriodicData(true); switchTab('inbox'); 
            } else throw new Error(res.error);
        })
        .catch(err => {
            showCustomAlert((currentLang==='EN'?"Error saving data: ":"เกิดข้อผิดพลาดในการบันทึก: ") + err.message);
            if(btnContainer) {
                btnContainer.innerHTML = `<button onclick="submitToQC()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 disabled:opacity-50 flex justify-center items-center gap-2" id="submit-btn"><i class="fa-solid fa-paper-plane"></i> ${t("ส่งผลตรวจสอบให้ QC")}</button>`;
            }
        });
    };
    img.src = capturedImageBase64;
}

function submitDefectToQC() {
    const qtyInput = document.getElementById('defect-qty');
    const reasonInput = document.getElementById('defect-reason');

    if (!qtyInput || !qtyInput.value.trim()) return showCustomAlert(t("กรุณาระบุ 'จำนวนที่ปริ้นเสีย'"));
    if (!reasonInput || !reasonInput.value.trim()) return showCustomAlert(t("กรุณาระบุ 'สาเหตุ/อาการเสีย'"));

    const btnContainer = document.getElementById('submit-action-container');
    if(btnContainer) {
        btnContainer.innerHTML = `<div class="w-full text-center py-4 text-red-600 font-bold bg-red-50 rounded-lg mt-4 border border-red-200"><div class="loader loader-blue mb-2" style="border-top-color:#ef4444;"></div> ${t("กำลังอัปโหลดข้อมูลสู่ Cloud...")}</div>`;
    }

    const newTicket = {
        jobOrder: "DEFECT", model: "-", lot: "-", date: "-", qty: qtyInput.value.trim(), 
        operator: currentUser.name, batchNo: currentSelectedBatch, image: capturedImageBase64, defectReason: reasonInput.value.trim()
    };

    fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "saveDefect", payload: newTicket }) })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            showCustomAlert(t("บันทึกข้อมูลงานเสีย (Defect) สำเร็จ!"), true);
            capturedImageBase64 = null; isDefectMode = false; currentSelectedJob = null; currentSelectedBatch = null;
            fetchPeriodicData(true); switchTab('inbox');
        } else throw new Error(res.error);
    })
    .catch(err => {
        showCustomAlert((currentLang==='EN'?"Error saving data: ":"เกิดข้อผิดพลาดในการบันทึก: ") + err.message);
        if(btnContainer) {
            btnContainer.innerHTML = `<button onclick="submitDefectToQC()" class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition mt-4 flex justify-center items-center gap-2" id="submit-btn"><i class="fa-solid fa-save"></i> ${t("บันทึกข้อมูลงานเสีย")}</button>`;
        }
    });
}
