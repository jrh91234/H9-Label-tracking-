// ==========================================
// CUSTOM MODALS
// ==========================================
function showCustomAlert(message, isSuccess = false) {
    const id = 'alert-' + Date.now();
    const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-green-500 text-3xl mb-3"></i>' : '<i class="fa-solid fa-circle-exclamation text-yellow-500 text-3xl mb-3"></i>';
    const html = `
        <div id="${id}" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                ${icon}
                <p class="text-gray-800 mb-6 font-medium">${message}</p>
                <button onclick="document.getElementById('${id}').remove()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold w-full">ตกลง</button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function showRejectPrompt() {
    const html = `
        <div id="reject-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 class="font-bold text-red-600 mb-2"><i class="fa-solid fa-triangle-exclamation"></i> ระบุสาเหตุที่ปฏิเสธ (NG)</h3>
                <input type="text" id="reject-reason" class="w-full border-2 p-3 rounded-lg mb-4 outline-none focus:border-red-500" placeholder="เช่น รูปไม่ชัด, Lot ผิด...">
                <div class="flex gap-2">
                    <button onclick="document.getElementById('reject-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold">ยกเลิก</button>
                    <button onclick="confirmReject()" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold">ยืนยันปฏิเสธ</button>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById('reject-reason').focus(), 100);
}

function confirmReject() {
    const reason = document.getElementById('reject-reason').value.trim();
    if(!reason) return showCustomAlert("กรุณาระบุสาเหตุที่ปฏิเสธ");
    document.getElementById('reject-modal').remove();
    executeProcessTicket('rejected', reason);
}

// ==========================================
// INITIALIZATION & LOGIN
// ==========================================
function render() {
    if (!currentUser) renderLogin();
    else renderMainApp();
}

function renderLogin() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4 fade-in">
            <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
                <div class="mb-6">
                    <i class="fa-solid fa-shield-check text-5xl text-blue-600 mb-2"></i>
                    <h1 class="text-2xl font-bold text-gray-800">Label QC System</h1>
                    <p class="text-sm text-gray-500 mt-1">กรุณาลงชื่อเข้าสู่ระบบ</p>
                </div>
                <div class="space-y-4 text-left">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1"><i class="fa-solid fa-user text-gray-400"></i> Username</label>
                        <input type="text" id="login-username" class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="ระบุชื่อผู้ใช้งาน">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1"><i class="fa-solid fa-lock text-gray-400"></i> Password</label>
                        <input type="password" id="login-password" class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="ระบุรหัสผ่าน">
                    </div>
                    <button onclick="handleLogin()" id="login-btn" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 flex justify-center items-center gap-2">
                        <span>เข้าสู่ระบบ</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById('login-password')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin();
        });
    }, 100);
}

function handleLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) return showCustomAlert("กรุณากรอก Username และ Password ให้ครบถ้วน");

    const btn = document.getElementById('login-btn');
    btn.innerHTML = `<div class="loader loader-white"></div> <span>กำลังตรวจสอบ...</span>`;
    btn.disabled = true;

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "login", username: user, password: pass })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            currentUser = res.data; 
            currentTab = (currentUser.role === 'operator') ? 'scan' : 'inbox';
            currentSelectedJob = null; 
            fetchInitialData();
            render();
        } else {
            showCustomAlert(res.error || "ล็อกอินไม่สำเร็จ");
            btn.innerHTML = `<span>เข้าสู่ระบบ</span>`;
            btn.disabled = false;
        }
    })
    .catch(err => {
        showCustomAlert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์: " + err.message);
        btn.innerHTML = `<span>เข้าสู่ระบบ</span>`;
        btn.disabled = false;
    });
}

function logout() { currentUser = null; stopCamera(); render(); }

// ==========================================
// DATA FETCHING
// ==========================================
function fetchInitialData() {
    isLoadingJobs = true;
    fetch(`${API_URL}?action=getJobs`)
        .then(res => res.json())
        .then(data => {
            dbJobs = data || [];
            isLoadingJobs = false;
            if(currentTab === 'scan' && !currentSelectedJob) renderMainApp();
        })
        .catch(err => {
            console.error("โหลด Job Error:", err);
            isLoadingJobs = false;
            if(currentTab === 'scan' && !currentSelectedJob) renderMainApp();
        });
    fetchTickets();
}

function fetchTickets() {
    fetch(`${API_URL}?action=getTickets`)
        .then(res => res.json())
        .then(data => {
            dbTickets = data || [];
            if(currentTab === 'inbox') renderMainApp();
        })
        .catch(err => console.error("โหลดข้อมูล Inbox ไม่สำเร็จ: ", err));
}

// ==========================================
// APP ROUTING & UI RENDERING
// ==========================================
function switchTab(tab) {
    currentTab = tab; selectedTicket = null;
    if (tab !== 'scan') stopCamera();
    renderMainApp();
}

function renderMainApp() {
    const appDiv = document.getElementById('app');
    let pendingCount = dbTickets.filter(t => t.status === 'pending').length;
    const isFullscreenCamera = currentTab === 'scan' && currentSelectedJob && !capturedImageBase64 && !isProcessingOCR;

    if (isFullscreenCamera) {
        appDiv.innerHTML = `<main class="flex-1 overflow-hidden bg-black relative" id="main-content"></main>`;
    } else {
        appDiv.innerHTML = `
            <header class="bg-white shadow-sm z-10 px-4 py-3 flex justify-between items-center">
                <div class="flex items-center">
                    <i class="fa-solid fa-shield-check text-blue-600 text-xl mr-2"></i>
                    <span class="font-bold text-lg hidden sm:inline">Label QC</span>
                </div>
                <div class="flex items-center space-x-4">
                    <button onclick="fetchTickets()" class="text-blue-500 hover:text-blue-700" title="รีเฟรชข้อมูล"><i class="fa-solid fa-rotate"></i></button>
                    <div class="text-right">
                        <div class="font-semibold text-sm text-blue-800">${currentUser.name}</div>
                        <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">${currentUser.role}</div>
                    </div>
                    <button onclick="logout()" class="text-gray-400 hover:text-red-500 transition"><i class="fa-solid fa-sign-out-alt text-xl"></i></button>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto bg-gray-100 p-4 relative" id="main-content"></main>
            <nav class="bg-white border-t flex justify-around p-2 pb-safe">
                ${currentUser.role === 'operator' || currentUser.role === 'admin' ? `
                <button onclick="switchTab('scan')" class="flex flex-col items-center p-2 w-full ${currentTab === 'scan' ? 'text-blue-600' : 'text-gray-400'}">
                    <i class="fa-solid fa-camera text-xl mb-1"></i><span class="text-[10px] font-medium mt-1">สแกน Label</span>
                </button>
                ` : ''}
                <button onclick="switchTab('inbox')" class="flex flex-col items-center p-2 w-full relative ${currentTab === 'inbox' ? 'text-blue-600' : 'text-gray-400'}">
                    <div class="relative">
                        <i class="fa-solid fa-inbox text-xl mb-1"></i>
                        ${pendingCount > 0 ? `<span class="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">${pendingCount}</span>` : ''}
                    </div>
                    <span class="text-[10px] font-medium mt-1">กล่องข้อความ</span>
                </button>
            </nav>
        `;
    }
    renderContent();
}

function renderContent() {
    const contentDiv = document.getElementById('main-content');
    if (selectedTicket) renderTicketDetail(contentDiv);
    else if (currentTab === 'scan') renderScanView(contentDiv);
    else if (currentTab === 'inbox') renderInboxView(contentDiv);
}

function renderScanView(container) {
    if (!currentSelectedJob) {
        let jobOptions = "";
        let isSelectDisabled = false;

        if (isLoadingJobs) {
            jobOptions = `<option value="">⏳ กำลังโหลดแผนจาก API...</option>`;
            isSelectDisabled = true;
        } else if (dbJobs.length === 0) {
            jobOptions = `<option value="">❌ ไม่พบ Job Order</option>`;
            isSelectDisabled = true;
        } else {
            jobOptions = `<option value="">-- เลือก Job Order --</option>` + 
                         dbJobs.map(j => `<option value="${j.job}">${j.job} (Model: ${j.targetModel})</option>`).join('');
        }

        container.innerHTML = `
            <div class="max-w-md mx-auto fade-in mt-10">
                <div class="bg-white rounded-xl shadow p-6 border-t-4 border-blue-500">
                    <h2 class="font-bold text-lg text-gray-800 mb-4"><i class="fa-solid fa-clipboard-list text-blue-500 mr-2"></i> 1. เลือก Job Order</h2>
                    <p class="text-xs text-gray-500 mb-3">กรุณาเลือก Job Order ที่คุณกำลังต้องการสแกนฉลาก</p>
                    <select id="job-selector" class="w-full p-3 border rounded-lg bg-gray-50 text-base font-bold mb-6 text-gray-800" ${isSelectDisabled ? 'disabled' : ''}>
                        ${jobOptions}
                    </select>
                    <button onclick="selectJobAndStartCamera()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-50 flex justify-center items-center gap-2" ${isSelectDisabled ? 'disabled' : ''}>
                        <i class="fa-solid fa-camera"></i> ยืนยันและเปิดกล้อง
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const jobObj = dbJobs.find(j => j.job === currentSelectedJob);
    const targetModel = jobObj ? jobObj.targetModel : "Unknown";

    if (!capturedImageBase64 && !isProcessingOCR) {
        container.innerHTML = `
            <div class="fixed inset-0 z-50 bg-black flex flex-col fade-in">
                <div class="absolute top-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/70 to-transparent">
                    <button onclick="changeJob()" class="w-10 h-10 rounded-full bg-white/20 text-white flex justify-center items-center backdrop-blur-sm active:scale-95">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <div class="text-right">
                        <div class="text-white font-bold text-sm drop-shadow-md">${currentSelectedJob}</div>
                        <div class="text-gray-300 text-xs drop-shadow-md">${targetModel}</div>
                    </div>
                </div>
                <div class="flex-1 w-full h-full flex justify-center items-center relative overflow-hidden">
                    <video id="video" class="w-full h-full object-contain" autoplay playsinline></video>
                    <div class="absolute inset-0 pointer-events-none flex justify-center items-center p-8">
                        <div class="w-full max-w-sm aspect-[4/3] border-2 border-white/50 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
                            <div class="absolute top-1/2 left-0 w-full border-t border-red-500/50"></div>
                            <div class="absolute top-0 left-1/2 h-full border-l border-red-500/50"></div>
                        </div>
                    </div>
                    <div class="scanner-line z-10" id="scanner-line"></div>
                </div>
                <div class="absolute bottom-0 w-full p-8 flex justify-center items-center z-20 pb-safe bg-gradient-to-t from-black/80 to-transparent">
                    <div class="shutter-btn" onclick="captureImage()">
                        <div class="shutter-btn-inner"></div>
                    </div>
                </div>
            </div>
        `;
        startCamera();
        return;
    }

    // Safety checks in case state.js is not loaded properly (Cache issue)
    const safeModel = typeof extractedModel !== 'undefined' ? extractedModel : '';
    const safeLot = typeof extractedLot !== 'undefined' ? extractedLot : '';
    const safeDate = typeof extractedDate !== 'undefined' ? extractedDate : '';

    container.innerHTML = `
        <div class="max-w-md mx-auto fade-in h-full flex flex-col pb-4">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div class="p-3 bg-blue-50 border-b flex justify-between items-center">
                    <div>
                        <span class="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Job ปัจจุบัน</span>
                        <span class="font-bold text-blue-800 text-sm">${currentSelectedJob} (${targetModel})</span>
                    </div>
                    <button onclick="changeJob()" class="text-[10px] text-blue-600 border border-blue-600 px-2 py-1 rounded bg-white font-bold"><i class="fa-solid fa-pen"></i> เปลี่ยน</button>
                </div>
                <div class="bg-black flex justify-center items-center h-48 relative border-b">
                    <img src="${capturedImageBase64 || ''}" class="w-full h-full object-contain" />
                    <button onclick="retakePhoto()" class="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm border border-white/20 shadow"><i class="fa-solid fa-rotate-right mr-1"></i> ถ่ายใหม่</button>
                </div>
                <div class="p-4 bg-white overflow-y-auto">
                    ${isProcessingOCR ? `
                        <div class="h-full flex flex-col justify-center items-center py-10">
                            <div class="loader loader-blue loader-large mb-4"></div>
                            <p class="text-blue-600 font-bold mt-4">AI กำลังอ่านข้อความ...</p>
                            <p class="text-xs text-gray-500 mt-2 text-center">ระบบกำลังสกัดข้อมูลจากรูปภาพ<br>และคำนวณตรวจสอบความถูกต้อง</p>
                        </div>
                    ` : `
                        <div class="space-y-4">
                            <h3 class="font-bold text-sm text-gray-700 flex items-center border-b pb-2"><i class="fa-solid fa-robot text-blue-500 mr-2 text-lg"></i> ผลลัพธ์ที่ AI อ่านได้ (ตรวจสอบ/แก้ไข)</h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">1. Model</label>
                                    <input type="text" id="ocr-model" class="w-full border-b-2 border-gray-200 py-1 font-bold text-blue-800 text-base focus:border-blue-500 outline-none transition" value="${safeModel}">
                                </div>
                                <div>
                                    <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">2. Lot No. (TH YY WW DD Shift Line)</label>
                                    <input type="text" id="ocr-lot" class="w-full border-b-2 border-gray-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition uppercase" value="${safeLot}">
                                </div>
                                <div>
                                    <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">3. วันที่ผลิต (รูปแบบ DD/MM/YYYY พ.ศ.)</label>
                                    <input type="text" id="ocr-date" class="w-full border-b-2 border-gray-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition" value="${safeDate}">
                                </div>
                            </div>
                            ${!verificationResult ? `
                                <button onclick="runSmartVerification()" class="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow transition mt-6 flex justify-center items-center gap-2">
                                    <i class="fa-solid fa-magnifying-glass-check"></i> กดตรวจสอบความถูกต้อง
                                </button>
                            ` : `
                                <div class="mt-4 p-4 rounded-xl border-2 ${verificationResult.isPass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                                    <h4 class="font-bold text-base mb-3 flex items-center ${verificationResult.isPass ? 'text-green-700' : 'text-red-700'}">
                                        ${verificationResult.isPass ? '<i class="fa-solid fa-circle-check mr-2 text-xl"></i> ผลตรวจสอบ: ผ่าน (PASS)' : '<i class="fa-solid fa-circle-xmark mr-2 text-xl"></i> ผลตรวจสอบ: พบข้อผิดพลาด (NG)'}
                                    </h4>
                                    <ul class="text-xs space-y-1.5 text-gray-700">${verificationResult.messages.map(m => `<li>${m}</li>`).join('')}</ul>
                                </div>
                                <button onclick="submitToQC()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" ${!verificationResult.isPass ? 'disabled' : ''} id="submit-btn">
                                    <i class="fa-solid fa-paper-plane"></i> ส่งผลตรวจสอบให้ QC
                                </button>
                            `}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

function selectJobAndStartCamera() {
    currentSelectedJob = document.getElementById('job-selector').value;
    if(!currentSelectedJob) return showCustomAlert("กรุณาเลือก Job Order ก่อนครับ");
    renderMainApp();
}

function changeJob() { 
    currentSelectedJob = null; 
    capturedImageBase64 = null; 
    verificationResult = null; 
    isProcessingOCR = false;
    
    // Safely clear state variables if they exist
    try {
        if (typeof extractedModel !== 'undefined') extractedModel = "";
        if (typeof extractedLot !== 'undefined') extractedLot = "";
        if (typeof extractedDate !== 'undefined') extractedDate = "";
    } catch(e) {}
    
    stopCamera(); 
    renderMainApp(); 
}

function submitToQC() {
    const btn = document.getElementById('submit-btn');
    btn.innerHTML = `<div class="loader loader-white"></div> <span>กำลังบันทึก...</span>`;
    btn.disabled = true;

    const newTicket = {
        jobOrder: currentSelectedJob,
        model: document.getElementById('ocr-model').value,
        lot: document.getElementById('ocr-lot').value,
        date: document.getElementById('ocr-date').value,
        operator: currentUser.name,
        image: capturedImageBase64
    };

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "saveTicket", payload: newTicket })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            showCustomAlert(`ส่งข้อมูลให้ QC ตรวจสอบสำเร็จ!`, true);
            capturedImageBase64 = null; verificationResult = null;
            fetchTickets(); switchTab('inbox');
        } else throw new Error(res.error);
    })
    .catch(err => {
        showCustomAlert("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ส่งผลตรวจสอบให้ QC`;
    });
}

function renderInboxView(container) {
    let displayTickets = dbTickets;
    if (currentUser.role === 'operator') {
        displayTickets = dbTickets.filter(t => t.operator === currentUser.name);
    } else {
        displayTickets = [...dbTickets].sort((a, b) => {
            if(a.status === 'pending' && b.status !== 'pending') return -1;
            if(a.status !== 'pending' && b.status === 'pending') return 1;
            return 0;
        });
    }

    let html = `<div class="max-w-2xl mx-auto fade-in"><h2 class="font-bold text-gray-700 mb-4 text-lg"><i class="fa-solid fa-inbox text-blue-500 mr-2"></i> กล่องข้อความ (Inbox)</h2><div class="space-y-3 pb-20">`;
    
    if (displayTickets.length === 0) html += `<div class="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">ไม่มีรายการในระบบ</div>`;

    displayTickets.forEach(t => {
        let statusColor = t.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                          t.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
        let statusIcon = t.status === 'pending' ? '<i class="fa-solid fa-clock"></i> รอตรวจ' : 
                         t.status === 'approved' ? '<i class="fa-solid fa-check-circle"></i> ผ่าน' : '<i class="fa-solid fa-times-circle"></i> ปฏิเสธ';

        html += `
            <div onclick="openTicket('${t.id}')" class="bg-white rounded-xl shadow-sm p-3 border-l-4 ${t.status === 'pending' ? 'border-yellow-500' : t.status === 'approved' ? 'border-green-500' : 'border-red-500'} cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition">
                <div class="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 border"><img src="${t.imageUrl || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover"></div>
                <div class="flex-1 overflow-hidden">
                    <div class="flex justify-between items-start">
                        <span class="font-bold text-blue-800 text-sm truncate pr-2">${t.jobOrder}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full border ${statusColor} font-medium flex-shrink-0">${statusIcon}</span>
                    </div>
                    <div class="text-sm font-bold text-gray-800 mt-1 truncate">Model: ${t.model}</div>
                    <div class="text-[10px] text-gray-500 mt-1 truncate">ส่งโดย: ${t.operator} • ${t.timestamp.split(' ')[1]}</div>
                </div>
            </div>`;
    });
    html += `</div></div>`; container.innerHTML = html;
}

function openTicket(id) { selectedTicket = dbTickets.find(t => t.id === id); renderMainApp(); }
function closeTicket() { selectedTicket = null; renderMainApp(); }

function executeProcessTicket(action, reason = "") {
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "updateTicket", ticketId: selectedTicket.id, status: action, qcName: currentUser.name, reason: reason })
    })
    .then(res => res.json())
    .then(res => {
        if(res.success) { showCustomAlert(`บันทึกสถานะเรียบร้อย`, true); fetchTickets(); closeTicket(); }
        else throw new Error(res.error);
    })
    .catch(err => showCustomAlert("เกิดข้อผิดพลาดในการอัปเดตสถานะ API: " + err.message));
}

function processTicket(action) {
    if (action === 'rejected') { 
        showRejectPrompt();
    } else {
        executeProcessTicket(action);
    }
}

function renderTicketDetail(container) {
    let t = selectedTicket;
    let statusColor = t.status === 'pending' ? 'text-yellow-600' : t.status === 'approved' ? 'text-green-600' : 'text-red-600';
    let canApprove = (currentUser.role === 'qc' || currentUser.role === 'admin' || currentUser.role === 'supervisor') && t.status === 'pending';

    container.innerHTML = `
        <div class="max-w-2xl mx-auto fade-in pb-20">
            <button onclick="closeTicket()" class="mb-4 text-blue-600 hover:text-blue-800 font-medium"><i class="fa-solid fa-arrow-left mr-1"></i> ย้อนกลับ</button>
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div class="overflow-hidden pr-2">
                        <h2 class="font-bold text-lg text-blue-800 truncate">${t.jobOrder}</h2>
                        <span class="text-[10px] text-gray-500 font-mono">Ref: ${t.id}</span>
                    </div>
                    <span class="font-bold ${statusColor} uppercase text-sm flex-shrink-0">${t.status}</span>
                </div>
                <div class="p-4 bg-black flex justify-center"><img src="${t.imageUrl || ''}" class="max-h-80 object-contain rounded border border-gray-700"></div>
                <div class="p-5 space-y-4">
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h3 class="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1">ข้อมูลที่สกัดได้จากฉลาก</h3>
                        <div class="grid grid-cols-3 gap-2 text-sm">
                            <div class="text-gray-500">Model:</div><div class="col-span-2 font-bold text-gray-800">${t.model}</div>
                            <div class="text-gray-500 mt-1">Lot No:</div><div class="col-span-2 font-bold text-gray-800 mt-1">${t.lot}</div>
                            <div class="text-gray-500 mt-1">วันที่ผลิต:</div><div class="col-span-2 font-bold text-gray-800 mt-1">${t.date}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-xs text-gray-500 border-t pt-4">
                        <div><span class="block font-bold text-gray-700">ส่งเรื่อง (OP):</span>${t.operator} <br> ${t.timestamp}</div>
                        ${t.status !== 'pending' ? `<div><span class="block font-bold text-gray-700">ตรวจสอบ (QC):</span>${t.qc} <br> ${t.actionTime}</div>` : ''}
                    </div>
                    ${t.rejectReason ? `<div class="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm mt-3"><strong>สาเหตุที่ปฏิเสธ:</strong> ${t.rejectReason}</div>` : ''}
                    
                    ${canApprove ? `
                    <div class="flex gap-3 pt-4 border-t mt-4">
                        <button onclick="processTicket('approved')" class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2"><i class="fa-solid fa-check-circle"></i> อนุมัติ (PASS)</button>
                        <button onclick="processTicket('rejected')" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2"><i class="fa-solid fa-times-circle"></i> ปฏิเสธ (NG)</button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
}

// ==========================================
// START APP
// ==========================================
window.onload = render;
