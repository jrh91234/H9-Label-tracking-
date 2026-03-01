// ==========================================
// SYSTEM CONFIGURATION (ตั้งค่าระบบ)
// ==========================================
const IS_MAINTENANCE_MODE = false; 
const MAINTENANCE_MESSAGE = "กำลังดำเนินการอัปเกรดและเพิ่มฟีเจอร์ใหม่<br>กรุณากลับมาใช้งานอีกครั้งในภายหลังครับ";

// ==========================================
// MULTI-LANGUAGE SYSTEM (ระบบแปลภาษา)
// ==========================================
let currentLang = localStorage.getItem('qc_lang') || 'TH';

const EN_DICT = {
    "Label QC System": "Label QC System",
    "กรุณาลงชื่อเข้าสู่ระบบ": "Please sign in to your account",
    "Username": "Username",
    "ระบุชื่อผู้ใช้งาน": "Enter username",
    "Password": "Password",
    "ระบุรหัสผ่าน": "Enter password",
    "เข้าสู่ระบบ": "Sign In",
    "กำลังตรวจสอบ...": "Checking...",
    "ระบบกำลังปิดปรับปรุง": "System Maintenance",
    "กำลังดำเนินการอัปเกรดและเพิ่มฟีเจอร์ใหม่<br>กรุณากลับมาใช้งานอีกครั้งในภายหลังครับ": "System is being upgraded.<br>Please try again later.",
    "ออกจากระบบ": "Log Out",
    "คุณต้องการออกจากระบบใช่หรือไม่?": "Are you sure you want to log out?",
    "ยกเลิก": "Cancel",
    "ยืนยัน": "Confirm",
    "รีเฟรชข้อมูล": "Refresh Data",
    "เปลี่ยนรหัสผ่าน": "Change Password",
    "รหัสผ่านใหม่": "New Password",
    "อย่างน้อย 4 ตัวอักษร": "At least 4 characters",
    "ยืนยันรหัสผ่านใหม่": "Confirm New Password",
    "กรอกรหัสผ่านใหม่อีกครั้ง": "Re-enter new password",
    "บันทึก": "Save",
    "สแกน Label": "Scan Label",
    "กล่องข้อความ": "Inbox",
    "แดชบอร์ด": "Dashboard",
    "จัดการผู้ใช้": "Manage Users",
    "เตรียมการสแกน": "Prepare Scan",
    "เลือก Job Order": "Select Job Order",
    "เลือกรหัสเครื่องปริ้น (Batch No)": "Select Printer Batch",
    "สแกนปกติ": "Normal Scan",
    "แจ้งปริ้นเสีย": "Report Defect",
    "ถ่ายรูปหลักฐานงานเสีย": "Take Defect Evidence",
    "โหมดบันทึกงานเสีย": "Defect Recording Mode",
    "ถ่ายใหม่": "Retake",
    "เปลี่ยน": "Change",
    "Job ปัจจุบัน": "Current Job",
    "แจ้งปัญหาการปริ้น": "Report Print Issue",
    "บันทึกข้อมูลงานเสีย (Defect)": "Record Defect Data",
    "จำนวนที่ปริ้นเสีย (ดวง)": "Defect Qty (pcs)",
    "ระบุจำนวน": "Enter quantity",
    "สาเหตุ / อาการเสีย": "Defect Reason / Symptom",
    "เช่น กระดาษติด, หมึกจาง, ปริ้นเทสระบบ...": "e.g. Paper jam, faded ink, test print...",
    "บันทึกข้อมูลงานเสีย": "Save Defect Data",
    "ผลลัพธ์ที่ AI อ่านได้": "AI Reading Result",
    "วันที่ผลิต": "MFG Date",
    "จำนวน (Print Qty)": "Quantity (Print Qty)",
    "กดตรวจสอบความถูกต้อง": "Verify Data",
    "ผลตรวจสอบ: ผ่าน (PASS)": "Result: PASS",
    "ผลตรวจสอบ: พบข้อผิดพลาด (NG)": "Result: ERROR (NG)",
    "ส่งเป็นข้อมูลทดสอบระบบ": "Send as test data",
    "ส่งผลตรวจสอบให้ QC": "Submit to QC",
    "ตั้งแต่วันที่": "From Date",
    "ถึงวันที่": "To Date",
    "ค้นหา": "Search",
    "ค้นหา Job, Model, Lot...": "Search Job, Model, Lot...",
    "รอตรวจสอบ": "Pending",
    "ดำเนินการแล้ว": "Processed",
    "ไม่มีรายการในหมวดหมู่นี้": "No items found",
    "รอตรวจ": "Pending",
    "ผ่าน": "Pass",
    "งานเสีย": "Defect",
    "ปฏิเสธ": "Reject",
    "เหตุผล:": "Reason:",
    "ย้อนกลับ": "Back",
    "ข้อมูลที่สกัดได้จากฉลาก": "Extracted Data",
    "จำนวน:": "Quantity:",
    "ส่งเรื่อง (OP):": "Submitted by (OP):",
    "ตรวจสอบ (QC):": "Checked by (QC):",
    "จำนวนที่เสีย:": "Defect Qty:",
    "ดวง": "pcs",
    "สาเหตุที่ปริ้นเสีย:": "Defect Reason:",
    "สาเหตุที่ปฏิเสธ:": "Reject Reason:",
    "อนุมัติ (PASS)": "Approve (PASS)",
    "ปฏิเสธ (NG)": "Reject (NG)",
    "สำรองข้อมูล (Backup)": "Backup Data",
    "ดาวน์โหลดประวัติการตรวจสอบล่าสุดออกมาเป็นไฟล์ Excel (CSV)": "Download recent inspection history as Excel (CSV)",
    "ดาวน์โหลดข้อมูลตั๋ว (CSV)": "Download Tickets (CSV)",
    "เพิ่มผู้ใช้": "Add User",
    "ชื่อ-สกุล": "Full Name",
    "เช่น สมชาย ใจดี": "e.g. John Doe",
    "ใช้สำหรับล็อกอิน (ห้ามซ้ำ)": "Used for login (Must be unique)",
    "กำหนดรหัสผ่าน": "Set password",
    "สิทธิ์การใช้งาน (Role)": "User Role",
    "ฝ่ายผลิต (Operator - ถ่ายรูปฉลาก)": "Operator - Scan Label",
    "หน่วยตรวจสอบ (QC - ตรวจผ่าน/ไม่ผ่าน)": "QC - Approve/Reject",
    "หัวหน้างาน (Supervisor - ตรวจผ่าน/ไม่ผ่าน)": "Supervisor - Approve/Reject",
    "ผู้ดูแลระบบ (Admin - เข้าถึงได้ทุกฟังก์ชัน)": "Admin - Full Access",
    "กะการทำงาน (Shift)": "Work Shift",
    "กะ A": "Shift A",
    "กะ B": "Shift B",
    "ยืนยันการลบผู้ใช้?": "Confirm Delete User?",
    "คุณกำลังจะลบบัญชี": "You are about to delete account",
    "การกระทำนี้ไม่สามารถกู้คืนได้": "This action cannot be undone",
    "ลบถาวร": "Delete Permanently",
    "ไม่มีข้อมูลผู้ใช้งาน": "No user data",
    "ขยาย": "Expand",
    "กำลังตรวจสอบเครื่องปริ้น...": "Checking printer...",
    "ไม่พบคิวการปริ้น (กรุณาสั่งปริ้นก่อนเข้าแอป)": "No print queue found (Please print first)",
    "-- เลือกเลข Batch ที่เพิ่งปริ้น --": "-- Select printed Batch No --",
    "-- เลือก Job Order --": "-- Select Job Order --",
    "⚠️ ฉุกเฉิน: ไม่พบเลขในระบบ (กรอกเอง)": "⚠️ Emergency: Manual Batch No",
    "รหัสอ้างอิงสร้างอัตโนมัติเนื่องจาก Network ปลายทางขาดการเชื่อมต่อ": "Auto-generated ID due to network disconnection",
    "พิมพ์เลข Batch / อ้างอิงฉุกเฉิน...": "Enter Batch No / Emergency Reference...",
    "❌ ไม่พบ Job Order": "❌ Job Order Not Found",
    "⏳ กำลังโหลดแผนจาก API...": "⏳ Loading Plan from API...",
    "ระบบป้องกันความผิดพลาด: คุณต้องสั่งปริ้นจากเครื่องคอมพิวเตอร์ก่อน จึงจะสามารถเปิดกล้องสแกนได้": "Poka-Yoke: You must print from the computer first before you can open the scanner.",
    "ไม่มีรายการในระบบ": "No items in system",
    "AI กำลังอ่านข้อความ...": "AI is extracting text...",
    "ระบบกำลังสกัดข้อมูลจากรูปภาพ<br>และคำนวณตรวจสอบความถูกต้อง": "Extracting data from image<br>and calculating accuracy...",
    "กำลังอัปโหลดข้อมูลสู่ Cloud...": "Uploading data to Cloud...",
    "ภาพรวมการผลิตวันนี้": "Today's Production Overview",
    "ยอดปริ้นทั้งหมด": "Total Printed",
    "ความคืบหน้าแต่ละ Job Order": "Progress by Job Order",
    "เป้าหมาย:": "Target:"
};

function t(text) {
    if (currentLang === 'EN' && EN_DICT[text]) return EN_DICT[text];
    return text;
}

window.toggleLang = function() {
    currentLang = currentLang === 'TH' ? 'EN' : 'TH';
    localStorage.setItem('qc_lang', currentLang);
    render(); 
};

// ==========================================
// NOTIFICATIONS & PWA BADGE LOGIC
// ==========================================
let autoFetchInterval = null;

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

function updateBadgeAndNotify(tickets) {
    if (!currentUser) return;
    
    let pendingTickets = tickets.filter(t => t.status === 'pending');
    
    if (currentUser.role !== 'admin') {
        pendingTickets = pendingTickets.filter(t => !String(t.jobOrder).includes('[TEST]'));
    }
    if (currentUser.role === 'operator') {
        pendingTickets = pendingTickets.filter(t => t.operator === currentUser.name);
    }

    const pendingCount = pendingTickets.length;
    const badgeHtml = `<span class="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">${pendingCount}</span>`;
    
    const navBadgeContainer = document.getElementById('nav-inbox-badge-container');
    const sidebarBadgeContainer = document.getElementById('sidebar-inbox-badge-container');
    
    if (navBadgeContainer) navBadgeContainer.innerHTML = pendingCount > 0 ? badgeHtml : '';
    if (sidebarBadgeContainer) sidebarBadgeContainer.innerHTML = pendingCount > 0 ? badgeHtml : '';
    
    if ('setAppBadge' in navigator) {
        if (pendingCount > 0) navigator.setAppBadge(pendingCount).catch(e => console.log(e));
        else navigator.clearAppBadge().catch(e => console.log(e));
    }

    const storedCount = parseInt(localStorage.getItem('qc_pending_count') || '0');
    if (pendingCount > storedCount && currentUser.role !== 'operator') {
        const newItemsCount = pendingCount - storedCount;
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Smart Label QC', { 
                body: `มีรายการรอตรวจสอบใหม่ ${newItemsCount} รายการ!`, 
                icon: 'https://cdn-icons-png.flaticon.com/512/7516/7516738.png' 
            });
        }
    }
    localStorage.setItem('qc_pending_count', pendingCount.toString());
}

function startAutoFetch() {
    if (autoFetchInterval) clearInterval(autoFetchInterval);
    autoFetchInterval = setInterval(() => { if (currentUser) fetchPeriodicData(false); }, 30000); 
}

function stopAutoFetch() { 
    if (autoFetchInterval) clearInterval(autoFetchInterval); 
}

// ==========================================
// CUSTOM MODALS & HELPERS
// ==========================================
function showCustomAlert(message, isSuccess = false) {
    const id = 'alert-' + Date.now();
    const icon = isSuccess ? '<i class="fa-solid fa-circle-check text-green-500 text-3xl mb-3"></i>' : '<i class="fa-solid fa-circle-exclamation text-yellow-500 text-3xl mb-3"></i>';
    const html = `
        <div id="${id}" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                ${icon}
                <p class="text-gray-800 mb-6 font-medium">${message}</p>
                <button onclick="document.getElementById('${id}').remove()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold w-full">${t("ตกลง") || "OK"}</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function showChangePasswordModal() {
    const html = `
        <div id="change-password-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 class="font-bold text-blue-600 mb-4 text-xl border-b pb-2"><i class="fa-solid fa-key mr-2"></i>${t("เปลี่ยนรหัสผ่าน")}</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("รหัสผ่านใหม่")} <span class="text-red-500">*</span></label>
                        <input type="password" id="new-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="${t("อย่างน้อย 4 ตัวอักษร")}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("ยืนยันรหัสผ่านใหม่")} <span class="text-red-500">*</span></label>
                        <input type="password" id="confirm-new-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="${t("กรอกรหัสผ่านใหม่อีกครั้ง")}">
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="document.getElementById('change-password-modal').remove()" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition">${t("ยกเลิก")}</button>
                    <button onclick="executeChangePassword()" id="btn-change-password" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md flex justify-center items-center gap-2">
                        <i class="fa-solid fa-save"></i> ${t("บันทึก")}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function executeChangePassword() {
    const newPass = document.getElementById('new-password').value.trim();
    const confirmPass = document.getElementById('confirm-new-password').value.trim();
    if (!newPass || !confirmPass) return showCustomAlert(currentLang === 'EN' ? "Please fill all password fields" : "กรุณากรอกรหัสผ่านให้ครบถ้วน");
    if (newPass !== confirmPass) return showCustomAlert(currentLang === 'EN' ? "Passwords do not match" : "รหัสผ่านใหม่ไม่ตรงกัน");
    if (newPass.length < 4) return showCustomAlert(currentLang === 'EN' ? "Password too short" : "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร");
    
    const btn = document.getElementById('btn-change-password'); btn.innerHTML = `<div class="loader loader-white"></div>`; btn.disabled = true;
    
    fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "changePassword", username: currentUser.username, newPassword: newPass }) })
    .then(res => res.json()).then(res => { 
        if (res.success) { document.getElementById('change-password-modal').remove(); showCustomAlert(currentLang === 'EN' ? "Password changed successfully" : "เปลี่ยนรหัสผ่านสำเร็จ", true); } 
        else throw new Error(res.error); 
    }).catch(err => { showCustomAlert(err.message); btn.innerHTML = `<i class="fa-solid fa-save"></i> ${t("บันทึก")}`; btn.disabled = false; });
}

function exportTicketsToCSV() {
    if (!dbTickets || dbTickets.length === 0) return showCustomAlert(t("ไม่มีข้อมูลสำหรับดาวน์โหลด"));
    let csvContent = "\uFEFF"; 
    const headers = ["Ticket ID", "Job Order", "Model", "Lot No", t("วันที่ผลิต"), t("จำนวน (Qty)"), t("ผู้สแกน (OP)"), t("สถานะ"), t("ผู้ตรวจ (QC)"), t("เวลาแจ้งเรื่อง"), t("เวลาอนุมัติ"), t("เหตุผล"), t("ลิงก์รูปภาพ")];
    csvContent += headers.join(",") + "\n";
    dbTickets.forEach(t => {
        let cleanTime = formatDisplayDate(t.timestamp); let cleanActionTime = formatDisplayDate(t.actionTime);
        let row = [`"${t.id}"`, `"${t.jobOrder}"`, `"${t.model}"`, `"${t.lot}"`, `"${t.date}"`, `"${t.qty || '-'}"`, `"${t.operator}"`, `"${t.status}"`, `"${t.qc || '-'}"`, `"${cleanTime}"`, `"${cleanActionTime}"`, `"${t.rejectReason || '-'}"`, `"${t.imageUrl || '-'}"`];
        csvContent += row.join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.setAttribute("href", url); link.setAttribute("download", `QC_Backup_${getTodayDateString()}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function showImageModal(imageUrl) {
    if (!imageUrl || imageUrl.includes('placeholder')) return;
    const html = `
        <div id="image-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-2 fade-in" onclick="document.getElementById('image-modal').remove()">
            <div class="relative w-full h-full flex justify-center items-center">
                <img src="${imageUrl}" class="max-w-full max-h-full object-contain rounded" onclick="event.stopPropagation()">
                <button onclick="document.getElementById('image-modal').remove()" class="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function getDriveImageUrl(url, size = 'w800') {
    if (!url) return 'https://via.placeholder.com/150';
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=${size}`;
    return url;
}

function formatDisplayDate(dateStr) { if (!dateStr) return ''; return String(dateStr).replace('T', ' ').replace('.000Z', ''); }
function getTodayDateString() { const today = new Date(); return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; }
function parseTicketDate(timestampStr) {
    if (!timestampStr) return null;
    if (timestampStr.includes('/')) { const parts = timestampStr.split(' ')[0].split('/'); if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`; } 
    else if (timestampStr.includes('-')) return timestampStr.split('T')[0];
    return null;
}

// ==========================================
// INITIALIZATION & LOGIN
// ==========================================
function render() { 
    if (typeof IS_MAINTENANCE_MODE !== 'undefined' && IS_MAINTENANCE_MODE) { renderMaintenance(); return; }
    if (!currentUser) renderLogin(); else renderMainApp(); 
}

function renderMaintenance() {
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.innerHTML = `<div class="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 fade-in h-full text-center"><div class="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner"><i class="fa-solid fa-person-digging text-5xl text-orange-500"></i></div><h1 class="text-2xl font-bold text-gray-800 mb-2">${t("ระบบกำลังปิดปรับปรุง")}</h1><p class="text-gray-600 mb-8 text-sm">${t("กำลังดำเนินการอัปเกรดและเพิ่มฟีเจอร์ใหม่<br>กรุณากลับมาใช้งานอีกครั้งในภายหลังครับ")}</p><div class="loader loader-blue"></div><p class="text-xs text-gray-400 mt-8">Smart Label QC System</p></div>`;
    }
}

function renderLogin() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4 fade-in h-full">
            <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
                <button onclick="toggleLang()" class="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-blue-600 bg-gray-100 px-2 py-1 rounded transition"><i class="fa-solid fa-language"></i> ${currentLang === 'TH' ? 'EN' : 'TH'}</button>
                <div class="mb-6 mt-4"><i class="fa-solid fa-shield-check text-5xl text-blue-600 mb-2"></i><h1 class="text-2xl font-bold text-gray-800">${t("Label QC System")}</h1><p class="text-sm text-gray-500 mt-1">${t("กรุณาลงชื่อเข้าสู่ระบบ")}</p></div>
                <div class="space-y-4 text-left">
                    <div><label class="block text-sm font-bold text-gray-700 mb-1"><i class="fa-solid fa-user text-gray-400"></i> ${t("Username")}</label><input type="text" id="login-username" class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="${t("ระบุชื่อผู้ใช้งาน")}"></div>
                    <div><label class="block text-sm font-bold text-gray-700 mb-1"><i class="fa-solid fa-lock text-gray-400"></i> ${t("Password")}</label><input type="password" id="login-password" class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="${t("ระบุรหัสผ่าน")}"></div>
                    <button onclick="handleLogin()" id="login-btn" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 flex justify-center items-center gap-2"><span>${t("เข้าสู่ระบบ")}</span></button>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => { document.getElementById('login-password')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); }); }, 100);
}

function handleLogin() {
    const user = document.getElementById('login-username').value.trim(); const pass = document.getElementById('login-password').value.trim();
    if (!user || !pass) return showCustomAlert(currentLang === 'EN' ? "Please enter both Username and Password" : "กรุณากรอก Username และ Password ให้ครบถ้วน");
    
    const btn = document.getElementById('login-btn'); btn.innerHTML = `<div class="loader loader-white"></div> <span>${t("กำลังตรวจสอบ...")}</span>`; btn.disabled = true;
    requestNotificationPermission();
    fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: "login", username: user, password: pass }) })
    .then(res => res.json()).then(res => {
        if (res.success) { 
            currentUser = res.data; currentUser.username = user; localStorage.setItem('qc_app_user', JSON.stringify(currentUser)); 
            currentTab = 'dashboard'; currentSelectedJob = null; currentSelectedBatch = null; isDefectMode = false; 
            fetchInitialData(); startAutoFetch(); render(); 
        } else { showCustomAlert(res.error || "Login Failed"); btn.innerHTML = `<span>${t("เข้าสู่ระบบ")}</span>`; btn.disabled = false; }
    })
    .catch(err => { showCustomAlert("Error: " + err.message); btn.innerHTML = `<span>${t("เข้าสู่ระบบ")}</span>`; btn.disabled = false; });
}

function logout() { 
    const html = `<div id="logout-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 fade-in"><div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center"><i class="fa-solid fa-arrow-right-from-bracket text-red-500 text-5xl mb-4"></i><h3 class="font-bold text-gray-800 text-lg mb-2">${t("ออกจากระบบ")}</h3><p class="text-sm text-gray-600 mb-6">${t("คุณต้องการออกจากระบบใช่หรือไม่?")}</p><div class="flex gap-3"><button onclick="document.getElementById('logout-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">${t("ยกเลิก")}</button><button onclick="executeLogout()" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center">${t("ยืนยัน")}</button></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function executeLogout() {
    const modal = document.getElementById('logout-modal'); if (modal) modal.remove();
    currentUser = null; localStorage.removeItem('qc_app_user');
    if (typeof stopCamera === 'function') stopCamera(); stopAutoFetch(); render(); 
}

// ==========================================
// DATA FETCHING 
// ==========================================
function handleRefresh(event) {
    if (event && event.currentTarget) { const icon = event.currentTarget.querySelector('i'); if (icon) { icon.classList.add('fa-spin'); setTimeout(() => { icon.classList.remove('fa-spin'); }, 1000); } }
    if (currentTab === 'admin') fetchUsersList(); else fetchPeriodicData(true); 
}

function fetchInitialData() {
    isLoadingJobs = true;
    Promise.all([
        fetch(`${API_URL}?action=getJobs`).then(res => res.json()).catch(() => []),
        fetch(`${API_URL}?action=getBatches`).then(res => res.json()).catch(() => [])
    ]).then(([jobsData, batchesData]) => {
        dbJobs = jobsData || []; dbBatches = batchesData || []; isLoadingJobs = false;
        if ((currentTab === 'scan' && !currentSelectedJob && !isDefectMode) || currentTab === 'dashboard') renderMainApp();
    });
    fetchTickets();
}

function fetchTickets() {
    fetch(`${API_URL}?action=getTickets`).then(res => res.json()).then(data => {
        dbTickets = data || []; updateBadgeAndNotify(dbTickets); 
        if(currentTab === 'inbox' || currentTab === 'dashboard') renderMainApp();
    }).catch(err => console.error("Error fetching inbox: ", err));
}

function fetchPeriodicData(forceRender = false) {
    Promise.all([
        fetch(`${API_URL}?action=getTickets`).then(res => res.json()).catch(() => null),
        fetch(`${API_URL}?action=getBatches`).then(res => res.json()).catch(() => null)
    ]).then(([ticketsData, batchesData]) => {
        let ticketsChanged = false; let batchesChanged = false;
        if (ticketsData) {
            ticketsChanged = JSON.stringify(dbTickets) !== JSON.stringify(ticketsData);
            dbTickets = ticketsData; updateBadgeAndNotify(dbTickets);
        }
        if (batchesData) {
            const newBatches = batchesData || [];
            batchesChanged = JSON.stringify(dbBatches) !== JSON.stringify(newBatches);
            if (currentUser && (currentUser.role === 'qc' || currentUser.role === 'supervisor' || currentUser.role === 'admin')) {
                const storedBatchCount = parseInt(localStorage.getItem('qc_batch_count') || '0');
                if (newBatches.length > storedBatchCount && autoFetchInterval !== null) {
                    const newPrints = newBatches.length - storedBatchCount;
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification(currentLang === 'EN' ? '🖨️ New Print Alert!' : '🖨️ สัญญาณแจ้งเตือนการปริ้น!', { body: currentLang === 'EN' ? `${newPrints} new labels printed` : `ฝ่ายผลิตสั่งปริ้นฉลากใหม่จำนวน ${newPrints} รายการ`, icon: 'https://cdn-icons-png.flaticon.com/512/732/732220.png' });
                    }
                }
                localStorage.setItem('qc_batch_count', newBatches.length.toString());
            }
            dbBatches = newBatches;
        }
        
        if (forceRender) renderMainApp();
        else {
            if (ticketsChanged && currentTab === 'inbox') { if(typeof updateInboxListUI === 'function') updateInboxListUI(); }
            if (ticketsChanged && currentTab === 'dashboard') renderMainApp();
            if (batchesChanged && currentTab === 'scan' && !currentSelectedJob && !isDefectMode) { if(typeof updateBatchDropdownUI === 'function') updateBatchDropdownUI(); }
        }
    }).catch(err => console.error("Error fetching periodic data: ", err));
}

// ==========================================
// APP ROUTING & UI RENDERING
// ==========================================
function switchTab(tab) {
    if (tab === 'scan' && currentUser.role !== 'operator' && currentUser.role !== 'admin') return showCustomAlert(t("คุณไม่มีสิทธิ์เข้าถึงหน้านี้"), false);
    if (tab === 'admin' && currentUser.role !== 'admin') return showCustomAlert(t("คุณไม่มีสิทธิ์เข้าถึงหน้านี้"), false);
    currentTab = tab; selectedTicket = null;
    if (tab !== 'scan') stopCamera();
    if (tab === 'admin' && typeof fetchUsersList === 'function') fetchUsersList(); else renderMainApp();
}

function renderMainApp() {
    const appDiv = document.getElementById('app');
    const isFullscreenCamera = currentTab === 'scan' && (currentSelectedJob || isDefectMode) && !capturedImageBase64 && !isProcessingOCR;

    if (isFullscreenCamera) {
        appDiv.innerHTML = `<main class="flex-1 overflow-hidden bg-black relative w-full h-full" id="main-content"></main>`;
    } else {
        appDiv.innerHTML = `
            <div class="flex flex-col md:flex-row h-full w-full bg-gray-100 overflow-hidden">
                <aside class="hidden md:flex flex-col w-64 bg-white shadow-xl z-30">
                    <div class="p-6 border-b flex items-center gap-3">
                        <i class="fa-solid fa-shield-check text-blue-600 text-3xl"></i>
                        <span class="font-bold text-xl">${t("Label QC System")}</span>
                    </div>
                    <div class="p-4">
                        <div class="bg-blue-50 p-3 rounded-lg mb-6 border border-blue-100">
                            <div class="font-bold text-blue-800">${currentUser.name}</div>
                            <div class="text-[10px] text-blue-600 uppercase font-bold tracking-wider mt-1">${currentUser.role}</div>
                        </div>
                        <nav class="space-y-2">
                            <button onclick="switchTab('dashboard')" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold transition ${currentTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                                <i class="fa-solid fa-chart-pie w-5 text-center text-lg"></i> ${t("แดชบอร์ด")}
                            </button>
                            ${(currentUser.role === 'operator' || currentUser.role === 'admin') ? `
                            <button onclick="switchTab('scan')" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold transition ${currentTab === 'scan' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                                <i class="fa-solid fa-camera w-5 text-center text-lg"></i> ${t("สแกน Label")}
                            </button>` : ''}
                            <button onclick="switchTab('inbox')" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold transition relative ${currentTab === 'inbox' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                                <i class="fa-solid fa-inbox w-5 text-center text-lg"></i> ${t("กล่องข้อความ")}
                                <div id="sidebar-inbox-badge-container" class="absolute right-3"></div>
                            </button>
                            ${currentUser.role === 'admin' ? `
                            <button onclick="switchTab('admin')" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold transition ${currentTab === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}">
                                <i class="fa-solid fa-users-cog w-5 text-center text-lg"></i> ${t("จัดการผู้ใช้")}
                            </button>` : ''}
                        </nav>
                    </div>
                    <div class="mt-auto p-4 border-t space-y-2">
                        <button onclick="toggleLang()" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition">
                            <i class="fa-solid fa-language w-5 text-center text-indigo-500 text-lg"></i> ${currentLang === 'TH' ? 'English' : 'ภาษาไทย'}
                        </button>
                        <button onclick="showChangePasswordModal()" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition">
                            <i class="fa-solid fa-key w-5 text-center text-yellow-500 text-lg"></i> ${t("เปลี่ยนรหัสผ่าน")}
                        </button>
                        <button onclick="logout()" class="w-full flex items-center gap-3 p-3 rounded-lg font-bold text-red-600 hover:bg-red-50 transition">
                            <i class="fa-solid fa-sign-out-alt w-5 text-center text-lg"></i> ${t("ออกจากระบบ")}
                        </button>
                    </div>
                </aside>
                <div class="flex-1 flex flex-col relative h-full overflow-hidden">
                    <header class="md:hidden bg-white shadow-sm z-20 px-4 py-3 flex justify-between items-center">
                        <div class="flex items-center"><i class="fa-solid fa-shield-check text-blue-600 text-xl mr-2"></i><span class="font-bold text-lg hidden sm:inline">Label QC</span></div>
                        <div class="flex items-center space-x-3 sm:space-x-4">
                            <button onclick="toggleLang()" class="text-indigo-500 font-bold px-2 py-1 rounded bg-indigo-50 text-xs">${currentLang}</button>
                            <button onclick="handleRefresh(event)" class="text-blue-500 hover:text-blue-700 transition" title="${t('รีเฟรชข้อมูล')}"><i class="fa-solid fa-rotate"></i></button>
                            <button onclick="showChangePasswordModal()" class="text-gray-400 hover:text-blue-600 transition" title="${t('เปลี่ยนรหัสผ่าน')}"><i class="fa-solid fa-key"></i></button>
                            <div class="text-right ml-1 border-l pl-3 border-gray-200"><div class="font-semibold text-sm text-blue-800">${currentUser.name}</div><div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">${currentUser.role}</div></div>
                            <button onclick="logout()" class="text-gray-400 hover:text-red-500 transition ml-2"><i class="fa-solid fa-sign-out-alt text-xl"></i></button>
                        </div>
                    </header>
                    <main class="flex-1 overflow-y-auto relative p-0 md:p-6" id="main-content"></main>
                    <nav class="md:hidden bg-white border-t flex justify-around p-2 pb-safe z-20">
                        <button onclick="switchTab('dashboard')" class="flex flex-col items-center p-2 w-full ${currentTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}"><i class="fa-solid fa-chart-pie text-xl mb-1"></i><span class="text-[10px] font-medium mt-1">${t("แดชบอร์ด")}</span></button>
                        ${(currentUser.role === 'operator' || currentUser.role === 'admin') ? `<button onclick="switchTab('scan')" class="flex flex-col items-center p-2 w-full ${currentTab === 'scan' ? 'text-blue-600' : 'text-gray-400'}"><i class="fa-solid fa-camera text-xl mb-1"></i><span class="text-[10px] font-medium mt-1">${t("สแกน Label")}</span></button>` : ''}
                        <button onclick="switchTab('inbox')" class="flex flex-col items-center p-2 w-full relative ${currentTab === 'inbox' ? 'text-blue-600' : 'text-gray-400'}"><div class="relative"><i class="fa-solid fa-inbox text-xl mb-1"></i><div id="nav-inbox-badge-container"></div></div><span class="text-[10px] font-medium mt-1">${t("กล่องข้อความ")}</span></button>
                        ${currentUser.role === 'admin' ? `<button onclick="switchTab('admin')" class="flex flex-col items-center p-2 w-full ${currentTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}"><i class="fa-solid fa-users-cog text-xl mb-1"></i><span class="text-[10px] font-medium mt-1">${t("จัดการผู้ใช้")}</span></button>` : ''}
                    </nav>
                </div>
            </div>
        `;
        updateBadgeAndNotify(dbTickets);
    }
    renderContent();
}

function renderContent() {
    const contentDiv = document.getElementById('main-content');
    if (selectedTicket) { if(typeof renderTicketDetail === 'function') renderTicketDetail(contentDiv); }
    else if (currentTab === 'dashboard') { if(typeof renderDashboardView === 'function') renderDashboardView(contentDiv); }
    else if (currentTab === 'scan') { if(typeof renderScanView === 'function') renderScanView(contentDiv); }
    else if (currentTab === 'inbox') { if(typeof renderInboxView === 'function') renderInboxView(contentDiv); }
    else if (currentTab === 'admin') { if(typeof renderAdminView === 'function') renderAdminView(contentDiv); }
}

// ==========================================
// START APP & AUTH CHECK
// ==========================================
function initApp() {
    if (typeof IS_MAINTENANCE_MODE !== 'undefined' && IS_MAINTENANCE_MODE) { render(); return; }

    const savedUser = localStorage.getItem('qc_app_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            if (!currentUser || !currentUser.role) throw new Error("Invalid Session Data");
            currentTab = 'dashboard'; 
            requestNotificationPermission(); fetchInitialData(); startAutoFetch(); 
        } catch (e) { localStorage.removeItem('qc_app_user'); currentUser = null; }
    }
    render();
}
window.onload = initApp;
