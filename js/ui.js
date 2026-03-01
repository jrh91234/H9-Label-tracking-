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
    const icon = isSuccess 
        ? '<i class="fa-solid fa-circle-check text-green-500 text-3xl mb-3"></i>' 
        : '<i class="fa-solid fa-circle-exclamation text-yellow-500 text-3xl mb-3"></i>';
        
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

function showRejectPrompt() {
    const html = `
        <div id="reject-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 class="font-bold text-red-600 mb-2">
                    <i class="fa-solid fa-triangle-exclamation"></i> ${t("ระบุสาเหตุที่ปฏิเสธ (NG)") || t("สาเหตุที่ปฏิเสธ:")}
                </h3>
                <input type="text" id="reject-reason" class="w-full border-2 p-3 rounded-lg mb-4 outline-none focus:border-red-500" placeholder="${t("เช่น รูปไม่ชัด, Lot ผิด...")}">
                <div class="flex gap-2">
                    <button onclick="document.getElementById('reject-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold">${t("ยกเลิก")}</button>
                    <button onclick="confirmReject()" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold">${t("ยืนยัน")}</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(() => document.getElementById('reject-reason').focus(), 100);
}

function confirmReject() {
    const reason = document.getElementById('reject-reason').value.trim();
    if (!reason) return showCustomAlert(currentLang === 'EN' ? "Please specify reason" : "กรุณาระบุสาเหตุที่ปฏิเสธ");
    
    document.getElementById('reject-modal').remove();
    executeProcessTicket('rejected', reason);
}

function showChangePasswordModal() {
    const html = `
        <div id="change-password-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 class="font-bold text-blue-600 mb-4 text-xl border-b pb-2">
                    <i class="fa-solid fa-key mr-2"></i>${t("เปลี่ยนรหัสผ่าน")}
                </h3>
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
    
    const btn = document.getElementById('btn-change-password'); 
    btn.innerHTML = `<div class="loader loader-white"></div>`; 
    btn.disabled = true;
    
    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "changePassword", username: currentUser.username, newPassword: newPass }) 
    })
    .then(res => res.json())
    .then(res => { 
        if (res.success) { 
            document.getElementById('change-password-modal').remove(); 
            showCustomAlert(currentLang === 'EN' ? "Password changed successfully" : "เปลี่ยนรหัสผ่านสำเร็จ", true); 
        } else throw new Error(res.error); 
    })
    .catch(err => { 
        showCustomAlert(err.message); 
        btn.innerHTML = `<i class="fa-solid fa-save"></i> ${t("บันทึก")}`; 
        btn.disabled = false; 
    });
}

function exportTicketsToCSV() {
    if (!dbTickets || dbTickets.length === 0) return showCustomAlert(t("ไม่มีข้อมูลสำหรับดาวน์โหลด"));
    
    let csvContent = "\uFEFF"; 
    const headers = [
        "Ticket ID", "Job Order", "Model", "Lot No", t("วันที่ผลิต"), 
        t("จำนวน (Qty)"), t("ผู้สแกน (OP)"), t("สถานะ"), t("ผู้ตรวจ (QC)"), 
        t("เวลาแจ้งเรื่อง"), t("เวลาอนุมัติ"), t("เหตุผล"), t("ลิงก์รูปภาพ")
    ];
    csvContent += headers.join(",") + "\n";
    
    dbTickets.forEach(t => {
        let cleanTime = formatDisplayDate(t.timestamp); 
        let cleanActionTime = formatDisplayDate(t.actionTime);
        let row = [
            `"${t.id}"`, `"${t.jobOrder}"`, `"${t.model}"`, `"${t.lot}"`, 
            `"${t.date}"`, `"${t.qty || '-'}"`, `"${t.operator}"`, `"${t.status}"`, 
            `"${t.qc || '-'}"`, `"${cleanTime}"`, `"${cleanActionTime}"`, 
            `"${t.rejectReason || '-'}"`, `"${t.imageUrl || '-'}"`
        ];
        csvContent += row.join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); 
    link.setAttribute("href", url); 
    link.setAttribute("download", `QC_Backup_${getTodayDateString()}.csv`);
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

function formatDisplayDate(dateStr) { 
    if (!dateStr) return ''; return String(dateStr).replace('T', ' ').replace('.000Z', ''); 
}

function getTodayDateString() { 
    const today = new Date(); return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; 
}

function parseTicketDate(timestampStr) {
    if (!timestampStr) return null;
    if (timestampStr.includes('/')) { 
        const parts = timestampStr.split(' ')[0].split('/'); 
        if (parts.length === 3) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`; 
    } else if (timestampStr.includes('-')) return timestampStr.split('T')[0];
    return null;
}

// ==========================================
// INITIALIZATION & LOGIN
// ==========================================
function render() { 
    if (typeof IS_MAINTENANCE_MODE !== 'undefined' && IS_MAINTENANCE_MODE) {
        renderMaintenance(); return;
    }
    if (!currentUser) renderLogin(); 
    else renderMainApp(); 
}

function renderMaintenance() {
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.innerHTML = `
            <div class="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 fade-in h-full text-center">
                <div class="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <i class="fa-solid fa-person-digging text-5xl text-orange-500"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">${t("ระบบกำลังปิดปรับปรุง")}</h1>
                <p class="text-gray-600 mb-8 text-sm">${t("กำลังดำเนินการอัปเกรดและเพิ่มฟีเจอร์ใหม่<br>กรุณากลับมาใช้งานอีกครั้งในภายหลังครับ")}</p>
                <div class="loader loader-blue"></div>
                <p class="text-xs text-gray-400 mt-8">Smart Label QC System</p>
            </div>
        `;
    }
}

function renderLogin() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <div class="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 p-4 fade-in h-full">
            <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center relative">
                <button onclick="toggleLang()" class="absolute top-4 right-4 text-xs font-bold text-gray-400 hover:text-blue-600 bg-gray-100 px-2 py-1 rounded transition">
                    <i class="fa-solid fa-language"></i> ${currentLang === 'TH' ? 'EN' : 'TH'}
                </button>
                <div class="mb-6 mt-4">
                    <i class="fa-solid fa-shield-check text-5xl text-blue-600 mb-2"></i>
                    <h1 class="text-2xl font-bold text-gray-800">${t("Label QC System")}</h1>
                    <p class="text-sm text-gray-500 mt-1">${t("กรุณาลงชื่อเข้าสู่ระบบ")}</p>
                </div>
                <div class="space-y-4 text-left">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1"><i class="fa-solid fa-user text-gray-400"></i> ${t("Username")}</label>
                        <input type="text" id="login-username" class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="${t("ระบุชื่อผู้ใช้งาน")}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1"><i class="fa-solid fa-lock text-gray-400"></i> ${t("Password")}</label>
                        <input type="password" id="login-password" class="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="${t("ระบุรหัสผ่าน")}">
                    </div>
                    <button onclick="handleLogin()" id="login-btn" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 flex justify-center items-center gap-2">
                        <span>${t("เข้าสู่ระบบ")}</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => { 
        document.getElementById('login-password')?.addEventListener('keypress', e => { 
            if (e.key === 'Enter') handleLogin(); 
        }); 
    }, 100);
}

function handleLogin() {
    const user = document.getElementById('login-username').value.trim(); 
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) return showCustomAlert(currentLang === 'EN' ? "Please enter both Username and Password" : "กรุณากรอก Username และ Password ให้ครบถ้วน");
    
    const btn = document.getElementById('login-btn'); 
    btn.innerHTML = `<div class="loader loader-white"></div> <span>${t("กำลังตรวจสอบ...")}</span>`; 
    btn.disabled = true;
    
    requestNotificationPermission();
    
    fetch(API_URL, { 
        method: 'POST', body: JSON.stringify({ action: "login", username: user, password: pass }) 
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) { 
            currentUser = res.data; currentUser.username = user; 
            localStorage.setItem('qc_app_user', JSON.stringify(currentUser)); 
            currentTab = 'dashboard'; // 🟢 เปลี่ยนหน้าเริ่มต้นเป็น Dashboard 
            currentSelectedJob = null; currentSelectedBatch = null; isDefectMode = false; 
            fetchInitialData(); startAutoFetch(); render(); 
        } else { 
            showCustomAlert(res.error || "Login Failed"); 
            btn.innerHTML = `<span>${t("เข้าสู่ระบบ")}</span>`; btn.disabled = false; 
        }
    })
    .catch(err => { 
        showCustomAlert("Error: " + err.message); 
        btn.innerHTML = `<span>${t("เข้าสู่ระบบ")}</span>`; btn.disabled = false; 
    });
}

function logout() { 
    const html = `
        <div id="logout-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                <i class="fa-solid fa-arrow-right-from-bracket text-red-500 text-5xl mb-4"></i>
                <h3 class="font-bold text-gray-800 text-lg mb-2">${t("ออกจากระบบ")}</h3>
                <p class="text-sm text-gray-600 mb-6">${t("คุณต้องการออกจากระบบใช่หรือไม่?")}</p>
                <div class="flex gap-3">
                    <button onclick="document.getElementById('logout-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">${t("ยกเลิก")}</button>
                    <button onclick="executeLogout()" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center">${t("ยืนยัน")}</button>
                </div>
            </div>
        </div>
    `;
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
    if (event && event.currentTarget) { 
        const icon = event.currentTarget.querySelector('i'); 
        if (icon) { icon.classList.add('fa-spin'); setTimeout(() => { icon.classList.remove('fa-spin'); }, 1000); } 
    }
    if (currentTab === 'admin') fetchUsersList(); else fetchPeriodicData(true); 
}

function fetchInitialData() {
    isLoadingJobs = true;
    Promise.all([
        fetch(`${API_URL}?action=getJobs`).then(res => res.json()).catch(() => []),
        fetch(`${API_URL}?action=getBatches`).then(res => res.json()).catch(() => [])
    ]).then(([jobsData, batchesData]) => {
        dbJobs = jobsData || []; dbBatches = batchesData || []; isLoadingJobs = false;
        
        // 🟢 รีเฟรชหน้าเฉพาะเมื่ออยู่ที่หน้าสแกน หรือ แดชบอร์ด
        if ((currentTab === 'scan' && !currentSelectedJob && !isDefectMode) || currentTab === 'dashboard') {
            renderMainApp();
        }
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
                        new Notification(currentLang === 'EN' ? '🖨️ New Print Alert!' : '🖨️ สัญญาณแจ้งเตือนการปริ้น!', { 
                            body: currentLang === 'EN' ? `${newPrints} new labels printed` : `ฝ่ายผลิตสั่งปริ้นฉลากใหม่จำนวน ${newPrints} รายการ`, 
                            icon: 'https://cdn-icons-png.flaticon.com/512/732/732220.png' 
                        });
                    }
                }
                localStorage.setItem('qc_batch_count', newBatches.length.toString());
            }
            dbBatches = newBatches;
        }
        
        if (forceRender) renderMainApp();
        else {
            if (ticketsChanged && currentTab === 'inbox') updateInboxListUI(); 
            if (ticketsChanged && currentTab === 'dashboard') renderMainApp(); // 🟢 อัปเดต Dashboard
            if (batchesChanged && currentTab === 'scan' && !currentSelectedJob && !isDefectMode) updateBatchDropdownUI();
        }
    }).catch(err => console.error("Error fetching periodic data: ", err));
}

let adminUsersList = [];
function fetchUsersList() {
    const contentDiv = document.getElementById('main-content'); 
    if(contentDiv) contentDiv.innerHTML = `<div class="flex justify-center items-center h-full"><div class="loader loader-blue loader-large"></div></div>`;
    fetch(`${API_URL}?action=getUsers`).then(res => res.json()).then(data => { adminUsersList = data || []; renderMainApp(); }).catch(err => { showCustomAlert(err.message); renderMainApp(); });
}

// ==========================================
// APP ROUTING & UI RENDERING
// ==========================================
function switchTab(tab) {
    if (tab === 'scan' && currentUser.role !== 'operator' && currentUser.role !== 'admin') return showCustomAlert(t("คุณไม่มีสิทธิ์เข้าถึงหน้านี้"), false);
    if (tab === 'admin' && currentUser.role !== 'admin') return showCustomAlert(t("คุณไม่มีสิทธิ์เข้าถึงหน้านี้"), false);
    currentTab = tab; selectedTicket = null;
    if (tab !== 'scan') stopCamera();
    if (tab === 'admin') fetchUsersList(); else renderMainApp();
}

function renderMainApp() {
    const appDiv = document.getElementById('app');
    
    const isFullscreenCamera = currentTab === 'scan' && (currentSelectedJob || isDefectMode) && !capturedImageBase64 && !isProcessingOCR;

    if (isFullscreenCamera) {
        appDiv.innerHTML = `<main class="flex-1 overflow-hidden bg-black relative w-full h-full" id="main-content"></main>`;
    } else {
        appDiv.innerHTML = `
            <div class="flex flex-col md:flex-row h-full w-full bg-gray-100 overflow-hidden">
                
                <!-- 🖥️ Sidebar for PC Laptop -->
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
                            <!-- 🟢 เพิ่มปุ่ม Dashboard ใน Sidebar -->
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

                <!-- 📱 Main Content Area -->
                <div class="flex-1 flex flex-col relative h-full overflow-hidden">
                    
                    <!-- Mobile Header -->
                    <header class="md:hidden bg-white shadow-sm z-20 px-4 py-3 flex justify-between items-center">
                        <div class="flex items-center">
                            <i class="fa-solid fa-shield-check text-blue-600 text-xl mr-2"></i>
                            <span class="font-bold text-lg hidden sm:inline">Label QC</span>
                        </div>
                        <div class="flex items-center space-x-3 sm:space-x-4">
                            <button onclick="toggleLang()" class="text-indigo-500 font-bold px-2 py-1 rounded bg-indigo-50 text-xs">${currentLang}</button>
                            <button onclick="handleRefresh(event)" class="text-blue-500 hover:text-blue-700 transition" title="${t('รีเฟรชข้อมูล')}"><i class="fa-solid fa-rotate"></i></button>
                            <button onclick="showChangePasswordModal()" class="text-gray-400 hover:text-blue-600 transition" title="${t('เปลี่ยนรหัสผ่าน')}"><i class="fa-solid fa-key"></i></button>
                            <div class="text-right ml-1 border-l pl-3 border-gray-200">
                                <div class="font-semibold text-sm text-blue-800">${currentUser.name}</div>
                                <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">${currentUser.role}</div>
                            </div>
                            <button onclick="logout()" class="text-gray-400 hover:text-red-500 transition ml-2"><i class="fa-solid fa-sign-out-alt text-xl"></i></button>
                        </div>
                    </header>

                    <!-- Inner Scrollable Main -->
                    <main class="flex-1 overflow-y-auto relative p-0 md:p-6" id="main-content"></main>

                    <!-- 🟢 Mobile Bottom Nav อัปเดตไอคอน Dashboard -->
                    <nav class="md:hidden bg-white border-t flex justify-around p-2 pb-safe z-20">
                        <button onclick="switchTab('dashboard')" class="flex flex-col items-center p-2 w-full ${currentTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}">
                            <i class="fa-solid fa-chart-pie text-xl mb-1"></i>
                            <span class="text-[10px] font-medium mt-1">${t("แดชบอร์ด")}</span>
                        </button>
                        ${(currentUser.role === 'operator' || currentUser.role === 'admin') ? `
                            <button onclick="switchTab('scan')" class="flex flex-col items-center p-2 w-full ${currentTab === 'scan' ? 'text-blue-600' : 'text-gray-400'}">
                                <i class="fa-solid fa-camera text-xl mb-1"></i>
                                <span class="text-[10px] font-medium mt-1">${t("สแกน Label")}</span>
                            </button>
                        ` : ''}
                        <button onclick="switchTab('inbox')" class="flex flex-col items-center p-2 w-full relative ${currentTab === 'inbox' ? 'text-blue-600' : 'text-gray-400'}">
                            <div class="relative">
                                <i class="fa-solid fa-inbox text-xl mb-1"></i>
                                <div id="nav-inbox-badge-container"></div>
                            </div>
                            <span class="text-[10px] font-medium mt-1">${t("กล่องข้อความ")}</span>
                        </button>
                        ${currentUser.role === 'admin' ? `
                            <button onclick="switchTab('admin')" class="flex flex-col items-center p-2 w-full ${currentTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}">
                                <i class="fa-solid fa-users-cog text-xl mb-1"></i>
                                <span class="text-[10px] font-medium mt-1">${t("จัดการผู้ใช้")}</span>
                            </button>
                        ` : ''}
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
    if (selectedTicket) renderTicketDetail(contentDiv);
    else if (currentTab === 'dashboard') renderDashboardView(contentDiv); // 🟢 เพิ่ม Render Dashboard
    else if (currentTab === 'scan') renderScanView(contentDiv);
    else if (currentTab === 'inbox') renderInboxView(contentDiv);
    else if (currentTab === 'admin') renderAdminView(contentDiv);
}

// ==========================================
// 🟢 DASHBOARD VIEW (หน้าจอภาพรวม)
// ==========================================
function renderDashboardView(container) {
    if (isLoadingJobs) {
        container.innerHTML = `<div class="flex flex-col justify-center items-center h-full"><div class="loader loader-blue loader-large mb-4"></div><p class="text-gray-500 font-bold">${t("⏳ กำลังโหลดแผนจาก API...")}</p></div>`;
        return;
    }

    const todayStr = getTodayDateString();
    
    // คัดกรอง Ticket เฉพาะของวันนี้
    const todayTickets = dbTickets.filter(t => {
        const tDate = parseTicketDate(t.timestamp);
        return tDate === todayStr && t.status !== 'rejected'; // ไม่นับใบที่ถูก Reject กลับ
    });

    let totalPrinted = 0;
    let totalDefect = 0;

    // โครงสร้างรวบรวมข้อมูลราย Job
    const jobStats = {};
    
    // ตั้งต้นโครงสร้างจาก Job ที่มาจากแผน (dbJobs)
    dbJobs.forEach(j => {
        jobStats[j.job] = {
            model: j.targetModel,
            targetQty: j.targetQty || 0,
            actualQty: 0
        };
    });

    // นำ Ticket วันนี้มาบวกยอดเข้าแต่ละ Job
    todayTickets.forEach(tck => {
        const qty = parseInt(tck.qty) || 0;
        
        if (tck.status === 'defect') {
            totalDefect += qty;
        } else {
            totalPrinted += qty;
            
            // ถ้ายอดเป็นของ Job ปัจจุบัน หรือ Job อื่นๆ ที่ถูกปริ้นวันนี้
            const jobKey = tck.jobOrder.replace('[TEST] ', ''); // ตัด Test ออกเพื่อให้บวกยอดถูก
            
            if (jobStats[jobKey]) {
                jobStats[jobKey].actualQty += qty;
            } else if (jobKey !== 'DEFECT') {
                // กรณีเป็น Job ที่ปริ้นวันนี้ แต่ไม่ได้อยู่ในคิว Plan (อาจจะปริ้นซ่อม)
                jobStats[jobKey] = {
                    model: tck.model,
                    targetQty: 0,
                    actualQty: qty
                };
            }
        }
    });

    // สร้าง Card HTML สำหรับแต่ละ Job
    let jobCardsHTML = '';
    const jobKeys = Object.keys(jobStats);
    
    if (jobKeys.length === 0) {
        jobCardsHTML = `<div class="col-span-full text-center text-gray-500 py-8 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">${t("ไม่มีรายการในระบบ")}</div>`;
    } else {
        jobKeys.forEach(key => {
            const stat = jobStats[key];
            const target = stat.targetQty;
            const actual = stat.actualQty;
            
            let percent = target > 0 ? Math.floor((actual / target) * 100) : (actual > 0 ? 100 : 0);
            let barWidth = percent > 100 ? 100 : percent;
            
            let barColor = 'bg-blue-500';
            if (percent >= 100) barColor = 'bg-green-500';
            if (actual === 0) barColor = 'bg-gray-300';

            jobCardsHTML += `
                <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-bold text-gray-800 text-base">${key}</h4>
                            <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">${stat.model}</div>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-black ${percent >= 100 ? 'text-green-600' : 'text-blue-600'}">${actual}</span>
                            <span class="text-xs text-gray-500 block -mt-1">${t("เป้าหมาย:")} ${target > 0 ? target : '-'}</span>
                        </div>
                    </div>
                    
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1 relative overflow-hidden">
                        <div class="${barColor} h-2.5 rounded-full transition-all duration-500" style="width: ${barWidth}%"></div>
                    </div>
                    <div class="text-right text-[10px] font-bold ${percent >= 100 ? 'text-green-600' : 'text-gray-500'}">
                        ${percent}%
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = `
        <div class="max-w-6xl mx-auto fade-in p-4 md:p-2 pb-24 md:pb-6">
            <h2 class="font-bold text-gray-800 text-xl mb-4 flex items-center">
                <i class="fa-solid fa-chart-pie text-blue-500 mr-2"></i> ${t("ภาพรวมการผลิตวันนี้")}
            </h2>
            
            <!-- Summary Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white p-4 md:p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <div class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">${t("ยอดปริ้นทั้งหมด")}</div>
                    <div class="text-3xl font-black text-blue-700">${totalPrinted} <span class="text-sm font-normal text-gray-500">pcs</span></div>
                </div>
                <div class="bg-white p-4 md:p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                    <div class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">${t("งานเสีย (Defect)")}</div>
                    <div class="text-3xl font-black text-red-600">${totalDefect} <span class="text-sm font-normal text-gray-500">pcs</span></div>
                </div>
            </div>
            
            <h3 class="font-bold text-gray-700 mb-3 flex items-center">
                <i class="fa-solid fa-bars-progress mr-2 text-gray-400"></i> ${t("ความคืบหน้าแต่ละ Job Order")}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${jobCardsHTML}
            </div>
        </div>
    `;
}

// ==========================================
// ADMIN USER MANAGEMENT VIEW
// ==========================================
function renderAdminView(container) {
    let html = `
        <div class="max-w-4xl mx-auto fade-in pb-20 p-4">
            <div class="bg-white rounded-xl shadow-sm p-4 mb-6 border-l-4 border-green-500">
                <div class="flex justify-between items-center mb-2">
                    <h2 class="font-bold text-gray-700 text-base">
                        <i class="fa-solid fa-database text-green-500 mr-2"></i> ${t("สำรองข้อมูล (Backup)")}
                    </h2>
                </div>
                <p class="text-xs text-gray-500 mb-3">${t("ดาวน์โหลดประวัติการตรวจสอบล่าสุดออกมาเป็นไฟล์ Excel (CSV)")}</p>
                <button onclick="exportTicketsToCSV()" class="w-full md:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition flex justify-center items-center gap-2">
                    <i class="fa-solid fa-file-excel"></i> ${t("ดาวน์โหลดข้อมูลตั๋ว (CSV)")}
                </button>
            </div>
            
            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                <h2 class="font-bold text-gray-700 text-lg">
                    <i class="fa-solid fa-users-cog text-blue-500 mr-2"></i> ${t("จัดการผู้ใช้")}
                </h2>
                <button onclick="showAddUserModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm font-bold flex items-center gap-2 transition">
                    <i class="fa-solid fa-plus"></i> ${t("เพิ่มผู้ใช้")}
                </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
    `;
    
    if (adminUsersList.length === 0) {
        html += `<div class="col-span-full text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">${t("ไม่มีข้อมูลผู้ใช้งาน")}</div>`;
    }

    adminUsersList.forEach(u => {
        let roleColor = u.role === 'admin' ? 'bg-purple-100 text-purple-800' 
                      : u.role === 'qc' ? 'bg-blue-100 text-blue-800' 
                      : u.role === 'supervisor' ? 'bg-orange-100 text-orange-800' 
                      : 'bg-gray-100 text-gray-800';
                      
        let roleTitle = u.role === 'operator' ? 'OP' : u.role.toUpperCase();
        
        html += `
            <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 ${u.role === 'admin' ? 'border-purple-500' : 'border-blue-500'} flex justify-between items-center transition hover:shadow-md">
                <div>
                    <div class="font-bold text-gray-800 text-base">${u.name}</div>
                    <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <i class="fa-solid fa-user text-gray-400"></i> ${u.username} 
                        <span class="px-2 py-0.5 rounded-md ${roleColor} text-[10px] font-bold tracking-wider">${roleTitle}</span>
                    </div>
                </div>
                <button onclick="confirmDeleteUser('${u.username}')" class="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex justify-center items-center transition shadow-sm border border-red-100" ${u.username === 'admin' ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : `title="${t('ลบถาวร')}"`}>
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    });
    
    html += `</div></div>`; 
    container.innerHTML = html;
}

function showAddUserModal() {
    const html = `
        <div id="add-user-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 class="font-bold text-blue-600 mb-4 text-xl border-b pb-2">
                    <i class="fa-solid fa-user-plus mr-2"></i>${t("เพิ่มผู้ใช้")}
                </h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("ชื่อ-สกุล")} <span class="text-red-500">*</span></label>
                        <input type="text" id="new-user-name" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="${t("เช่น สมชาย ใจดี")}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("Username")} <span class="text-red-500">*</span></label>
                        <input type="text" id="new-user-username" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="${t("ใช้สำหรับล็อกอิน (ห้ามซ้ำ)")}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("Password")} <span class="text-red-500">*</span></label>
                        <input type="password" id="new-user-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="${t("กำหนดรหัสผ่าน")}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("สิทธิ์การใช้งาน (Role)")}</label>
                        <select id="new-user-role" onchange="toggleShiftSelect()" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700">
                            <option value="operator">${t("ฝ่ายผลิต (Operator - ถ่ายรูปฉลาก)")}</option>
                            <option value="qc">${t("หน่วยตรวจสอบ (QC - ตรวจผ่าน/ไม่ผ่าน)")}</option>
                            <option value="supervisor">${t("หัวหน้างาน (Supervisor - ตรวจผ่าน/ไม่ผ่าน)")}</option>
                            <option value="admin">${t("ผู้ดูแลระบบ (Admin - เข้าถึงได้ทุกฟังก์ชัน)")}</option>
                        </select>
                    </div>
                    <div id="shift-container">
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("กะการทำงาน (Shift)")} <span class="text-red-500">*</span></label>
                        <select id="new-user-shift" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700">
                            <option value="A">${t("กะ A")}</option>
                            <option value="B">${t("กะ B")}</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="document.getElementById('add-user-modal').remove()" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition">${t("ยกเลิก")}</button>
                    <button onclick="executeAddUser()" id="btn-add-user" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md flex justify-center items-center gap-2">
                        <i class="fa-solid fa-save"></i> ${t("บันทึก")}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function toggleShiftSelect() {
    const roleEl = document.getElementById('new-user-role'); 
    const shiftContainer = document.getElementById('shift-container');
    if (roleEl && shiftContainer) {
        shiftContainer.style.display = roleEl.value === 'operator' ? 'block' : 'none';
    }
}

function executeAddUser() {
    const name = document.getElementById('new-user-name').value.trim(); 
    const username = document.getElementById('new-user-username').value.trim();
    const password = document.getElementById('new-user-password').value.trim(); 
    const role = document.getElementById('new-user-role').value;
    const shift = document.getElementById('new-user-shift') ? document.getElementById('new-user-shift').value : '';
    
    if (!name || !username || !password) return showCustomAlert(currentLang === 'EN' ? "Please fill all fields" : "กรุณากรอกข้อมูลให้ครบถ้วน");
    
    const btn = document.getElementById('btn-add-user'); 
    btn.innerHTML = `<div class="loader loader-white"></div>`; 
    btn.disabled = true;
    
    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "addUser", payload: { name, username, password, role, shift } }) 
    })
    .then(res => res.json())
    .then(res => { 
        if (res.success) { 
            document.getElementById('add-user-modal').remove(); 
            showCustomAlert(currentLang === 'EN' ? "Account added successfully" : `เพิ่มบัญชี "${name}" เข้าสู่ระบบเรียบร้อย`, true); 
            fetchUsersList(); 
        } else {
            throw new Error(res.error); 
        }
    })
    .catch(err => { 
        showCustomAlert(err.message); 
        btn.innerHTML = `<i class="fa-solid fa-save"></i> ${t("บันทึก")}`; 
        btn.disabled = false; 
    });
}

function confirmDeleteUser(username) {
    const html = `
        <div id="delete-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                <h3 class="font-bold text-gray-800 text-lg mb-2">${t("ยืนยันการลบผู้ใช้?")}</h3>
                <p class="text-sm text-gray-600 mb-6">${t("คุณกำลังจะลบบัญชี")} <span class="font-bold text-red-600">${username}</span><br>${t("การกระทำนี้ไม่สามารถกู้คืนได้")}</p>
                <div class="flex gap-3">
                    <button onclick="document.getElementById('delete-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">${t("ยกเลิก")}</button>
                    <button onclick="executeDeleteUser('${username}')" id="btn-delete-user" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center">
                        <i class="fa-solid fa-trash-can mr-2"></i> ${t("ลบถาวร")}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function executeDeleteUser(username) {
    const btn = document.getElementById('btn-delete-user'); 
    btn.innerHTML = `<div class="loader loader-white"></div>`; 
    btn.disabled = true;
    
    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "deleteUser", username: username }) 
    })
    .then(res => res.json())
    .then(res => { 
        if(res.success) { 
            document.getElementById('delete-modal').remove(); 
            showCustomAlert(currentLang === 'EN' ? "Account deleted successfully" : `ลบบัญชี ${username} ออกจากระบบแล้ว`, true); 
            fetchUsersList(); 
        } else {
            throw new Error(res.error); 
        }
    })
    .catch(err => { 
        showCustomAlert(err.message); 
        document.getElementById('delete-modal').remove(); 
    });
}

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
                return `<option value="${b.batchNo}">${b.batchNo} (File: ${cleanDocName} | ${b.timestamp.split(' ')[1]})</option>`;
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

// ==========================================
// RENDER VIEWS (INBOX - EMAIL STYLE)
// ==========================================
let currentInboxFilter = 'pending'; 
let inboxSearchTerm = ''; 
let inboxStartDate = getTodayDateString(); 
let inboxEndDate = getTodayDateString();   

function setInboxFilter(filter) { 
    currentInboxFilter = filter; 
    updateInboxListUI(); 
}

function executeInboxSearch() { 
    const input = document.getElementById('inbox-search-input'); 
    if (input) { 
        inboxSearchTerm = input.value.trim().toLowerCase(); 
        updateInboxListUI(); 
    } 
}

function executeInboxDateFilter() {
    const startInput = document.getElementById('inbox-start-date'); 
    const endInput = document.getElementById('inbox-end-date');
    if (startInput) inboxStartDate = startInput.value; 
    if (endInput) inboxEndDate = endInput.value; 
    updateInboxListUI(); 
}

function getInboxListHTML() {
    let baseTickets = dbTickets;
    if (currentUser.role !== 'admin') baseTickets = baseTickets.filter(t => !String(t.jobOrder).includes('[TEST]'));
    if (currentUser.role === 'operator') baseTickets = baseTickets.filter(t => t.operator === currentUser.name);

    baseTickets = baseTickets.filter(t => {
        const tDate = parseTicketDate(t.timestamp);
        if (!tDate) return true; 
        if (inboxStartDate && tDate < inboxStartDate) return false;
        if (inboxEndDate && tDate > inboxEndDate) return false;
        return true;
    });

    let displayTickets = baseTickets.filter(t => currentInboxFilter === 'pending' ? t.status === 'pending' : t.status !== 'pending');

    if (inboxSearchTerm) {
        displayTickets = displayTickets.filter(t => 
            t.jobOrder.toLowerCase().includes(inboxSearchTerm) || t.model.toLowerCase().includes(inboxSearchTerm) || t.lot.toLowerCase().includes(inboxSearchTerm)
        );
    }
    
    displayTickets.sort((a, b) => b.id.localeCompare(a.id));

    let html = `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 pb-24 md:pb-6">`;
    if (displayTickets.length === 0) {
        html += `<div class="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300"><i class="fa-regular fa-folder-open text-5xl text-gray-300 mb-3"></i><p class="font-bold text-gray-600">${t("ไม่มีรายการในหมวดหมู่นี้")}</p></div>`;
    }

    displayTickets.forEach(tck => {
        let statusColor = tck.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                        : tck.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' 
                        : tck.status === 'defect' ? 'bg-gray-100 text-gray-800 border-gray-300' 
                        : 'bg-red-100 text-red-800 border-red-300';
                        
        let statusIcon = tck.status === 'pending' ? `<i class="fa-solid fa-clock"></i> ${t('รอตรวจ')}` 
                       : tck.status === 'approved' ? `<i class="fa-solid fa-check-circle"></i> ${t('ผ่าน')}` 
                       : tck.status === 'defect' ? `<i class="fa-solid fa-trash-can"></i> ${t('งานเสีย')}`
                       : `<i class="fa-solid fa-times-circle"></i> ${t('ปฏิเสธ')}`;
                       
        let cleanTime = formatDisplayDate(tck.timestamp).split(' ')[1] || formatDisplayDate(tck.timestamp);
        let jobDisplay = tck.jobOrder.includes('[TEST]') ? `<span class="text-yellow-600 font-bold bg-yellow-100 px-1 rounded mr-1">TEST</span> ${tck.jobOrder.replace('[TEST] ', '')}` : tck.jobOrder;

        html += `
            <div onclick="openTicket('${tck.id}')" class="bg-white rounded-xl shadow-sm p-3 border-l-4 ${tck.status === 'pending' ? 'border-yellow-500' : tck.status === 'approved' ? 'border-green-500' : tck.status === 'defect' ? 'border-gray-500' : 'border-red-500'} cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-inner">
                    <img src="${getDriveImageUrl(tck.imageUrl)}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="flex-1 overflow-hidden">
                    <div class="flex justify-between items-start">
                        <span class="font-bold ${tck.status === 'defect' ? 'text-gray-800' : 'text-blue-800'} text-sm truncate pr-2">${tck.status === 'defect' ? t('แจ้งปัญหาการปริ้น') : jobDisplay}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full border ${statusColor} font-medium flex-shrink-0">${statusIcon}</span>
                    </div>
                    <div class="text-sm font-bold text-gray-800 mt-1 truncate">${tck.status === 'defect' ? `${t('เหตุผล:')} ${tck.rejectReason}` : `Model: ${tck.model}`}</div>
                    <div class="text-[10px] text-gray-500 mt-1 truncate flex items-center gap-1">
                        <i class="fa-solid fa-user-circle"></i> ${tck.operator} • ${cleanTime} ${tck.batchNo ? `• <i class="fa-solid fa-print"></i> ${tck.batchNo}` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

function updateInboxListUI() {
    const listEl = document.getElementById('inbox-ticket-list');
    if (listEl) listEl.innerHTML = getInboxListHTML();
    
    let baseTickets = dbTickets;
    if (currentUser.role !== 'admin') baseTickets = baseTickets.filter(t => !String(t.jobOrder).includes('[TEST]'));
    if (currentUser.role === 'operator') baseTickets = baseTickets.filter(t => t.operator === currentUser.name);
    
    baseTickets = baseTickets.filter(t => {
        const tDate = parseTicketDate(t.timestamp);
        if (!tDate) return true; 
        if (inboxStartDate && tDate < inboxStartDate) return false;
        if (inboxEndDate && tDate > inboxEndDate) return false;
        return true;
    });

    let pendingCount = baseTickets.filter(t => t.status === 'pending').length;
    let processedCount = baseTickets.filter(t => t.status !== 'pending').length;
    
    const badgesContainer = document.getElementById('inbox-filter-badges');
    if (badgesContainer) {
        badgesContainer.innerHTML = `
            <button onclick="setInboxFilter('pending')" class="flex-1 py-2 text-sm font-bold rounded-md transition flex justify-center items-center gap-1.5 ${currentInboxFilter === 'pending' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}">
                ${t("รอตรวจสอบ")} ${pendingCount > 0 ? `<span class="${currentInboxFilter === 'pending' ? 'bg-red-500' : 'bg-gray-400'} text-white text-[10px] px-1.5 py-0.5 rounded-full">${pendingCount}</span>` : ''}
            </button>
            <button onclick="setInboxFilter('processed')" class="flex-1 py-2 text-sm font-bold rounded-md transition flex justify-center items-center gap-1.5 ${currentInboxFilter === 'processed' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}">
                ${t("ดำเนินการแล้ว")} ${processedCount > 0 ? `<span class="${currentInboxFilter === 'processed' ? 'bg-gray-600' : 'bg-gray-400'} text-white text-[10px] px-1.5 py-0.5 rounded-full">${processedCount}</span>` : ''}
            </button>
        `;
    }
}

function renderInboxView(container) {
    let html = `
        <div class="max-w-6xl mx-auto flex flex-col h-full fade-in p-0 md:p-2">
            <div class="bg-white px-4 pt-4 pb-2 shadow-sm md:rounded-xl md:mb-4 z-10 sticky top-0">
                <h2 class="font-bold text-gray-800 text-lg mb-3 flex items-center">
                    <i class="fa-solid fa-envelope-open-text text-blue-500 mr-2 text-xl"></i> ${t("กล่องข้อความ")}
                </h2>
                
                <div class="flex flex-col md:flex-row gap-2 md:gap-4 mb-3">
                    <div class="flex flex-1 gap-2">
                        <div class="flex-1">
                            <label class="block text-[10px] text-gray-500 uppercase font-bold mb-1">${t("ตั้งแต่วันที่")}</label>
                            <input type="date" id="inbox-start-date" value="${inboxStartDate}" onchange="executeInboxDateFilter()" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition">
                        </div>
                        <div class="flex-1">
                            <label class="block text-[10px] text-gray-500 uppercase font-bold mb-1">${t("ถึงวันที่")}</label>
                            <input type="date" id="inbox-end-date" value="${inboxEndDate}" onchange="executeInboxDateFilter()" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition">
                        </div>
                    </div>
                    <div class="relative flex-1 flex gap-2 items-end">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
                            <input type="text" id="inbox-search-input" placeholder="${t("ค้นหา Job, Model, Lot...")}" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition h-[34px]" value="${inboxSearchTerm}" onkeypress="if(event.key === 'Enter') executeInboxSearch()">
                        </div>
                        <button onclick="executeInboxSearch()" class="bg-gray-800 text-white px-4 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-700 transition h-[34px]">${t("ค้นหา")}</button>
                    </div>
                </div>
                
                <div id="inbox-filter-badges" class="flex bg-gray-100 p-1 rounded-lg w-full max-w-sm">
                    <!-- โหลดแท็บจากอัปเดตอัตโนมัติ -->
                </div>
            </div>
            <div id="inbox-ticket-list" class="flex-1 overflow-y-auto p-4 pt-2">
                <!-- โหลดรายการจากอัปเดตอัตโนมัติ -->
            </div>
        </div>
    `;
    container.innerHTML = html;
    updateInboxListUI(); 
}

function openTicket(id) { 
    selectedTicket = dbTickets.find(t => t.id === id); 
    renderMainApp(); 
}

function closeTicket() { 
    selectedTicket = null; 
    renderMainApp(); 
}

function executeProcessTicket(action, reason = "") {
    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "updateTicket", ticketId: selectedTicket.id, status: action, qcName: currentUser.name, reason: reason }) 
    })
    .then(res => res.json())
    .then(res => { 
        if(res.success) { 
            showCustomAlert(t("บันทึกสถานะเรียบร้อย"), true); 
            fetchPeriodicData(true); 
            closeTicket(); 
        } else {
            throw new Error(res.error); 
        }
    })
    .catch(err => showCustomAlert((currentLang==='EN'?"Error: ":"เกิดข้อผิดพลาดในการอัปเดตสถานะ API: ") + err.message));
}

function processTicket(action) {
    if (action === 'rejected') {
        showRejectPrompt();
    } else {
        const actionContainer = document.getElementById('qc-action-buttons');
        if(actionContainer) {
            actionContainer.innerHTML = `<div class="w-full text-center py-3 text-blue-600 font-bold bg-blue-50 rounded-lg"><div class="loader loader-blue mb-2"></div> ${t("กำลังอัปโหลดข้อมูลสู่ Cloud...")}</div>`;
        }
        executeProcessTicket(action);
    }
}

function renderTicketDetail(container) {
    let tck = selectedTicket;
    let statusColor = tck.status === 'pending' ? 'text-yellow-600' : tck.status === 'approved' ? 'text-green-600' : tck.status === 'defect' ? 'text-gray-600' : 'text-red-600';
    let canApprove = (currentUser.role === 'qc' || currentUser.role === 'admin' || currentUser.role === 'supervisor') && tck.status === 'pending';
    let jobDisplay = tck.jobOrder.includes('[TEST]') ? `<span class="text-yellow-600 font-bold bg-yellow-100 px-1 rounded mr-1">TEST</span> ${tck.jobOrder.replace('[TEST] ', '')}` : tck.jobOrder;

    container.innerHTML = `
        <div class="max-w-2xl mx-auto fade-in pb-20 p-4">
            <button onclick="closeTicket()" class="mb-4 text-blue-600 hover:text-blue-800 font-medium">
                <i class="fa-solid fa-arrow-left mr-1"></i> ${t("ย้อนกลับ")}
            </button>
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div class="overflow-hidden pr-2">
                        <h2 class="font-bold text-lg ${tck.status === 'defect' ? 'text-gray-800' : 'text-blue-800'} truncate">${tck.status === 'defect' ? t('แจ้งปัญหาการปริ้น') : jobDisplay}</h2>
                        <span class="text-[10px] text-gray-500 font-mono">Ref: ${tck.id} ${tck.batchNo ? `| Batch: ${tck.batchNo}` : ''}</span>
                    </div>
                    <span class="font-bold ${statusColor} uppercase text-sm flex-shrink-0">${t(tck.status === 'pending' ? 'รอตรวจ' : tck.status === 'approved' ? 'ผ่าน' : tck.status === 'defect' ? 'งานเสีย' : 'ปฏิเสธ')}</span>
                </div>
                
                <div class="p-4 bg-black flex justify-center relative cursor-pointer" onclick="showImageModal('${tck.imageUrl ? getDriveImageUrl(tck.imageUrl, 'w1920') : ''}')" title="คลิกเพื่อขยายรูปภาพ">
                    <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none z-10">
                        <i class="fa-solid fa-magnifying-glass-plus"></i> ${t("ขยาย")}
                    </div>
                    <img src="${getDriveImageUrl(tck.imageUrl)}" class="max-h-80 object-contain rounded border border-gray-700 pointer-events-none" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                </div>
                
                <div class="p-5 space-y-4">
                    ${tck.status === 'defect' ? '' : `
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h3 class="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1">${t("ข้อมูลที่สกัดได้จากฉลาก")}</h3>
                        <div class="grid grid-cols-3 gap-2 text-sm">
                            <div class="text-gray-500">Model:</div><div class="col-span-2 font-bold text-gray-800">${tck.model}</div>
                            <div class="text-gray-500 mt-1">Lot No:</div><div class="col-span-2 font-bold text-gray-800 mt-1">${tck.lot}</div>
                            <div class="text-gray-500 mt-1">${t("วันที่ผลิต")}:</div><div class="col-span-2 font-bold text-gray-800 mt-1">${tck.date}</div>
                            <div class="text-gray-500 mt-1">${t("จำนวน:")}</div><div class="col-span-2 font-bold text-blue-700 mt-1">${tck.qty || '-'}</div>
                        </div>
                    </div>`}
                    
                    <div class="grid grid-cols-2 gap-4 text-xs text-gray-500 border-t pt-4">
                        <div><span class="block font-bold text-gray-700">${t("ส่งเรื่อง (OP):")}</span>${tck.operator} <br> ${formatDisplayDate(tck.timestamp)}</div>
                        ${tck.status !== 'pending' && tck.status !== 'defect' ? `<div><span class="block font-bold text-gray-700">${t("ตรวจสอบ (QC):")}</span>${tck.qc} <br> ${formatDisplayDate(tck.actionTime)}</div>` : ''}
                        ${tck.status === 'defect' ? `<div><span class="block font-bold text-gray-700">${t("จำนวนที่เสีย:")}</span><span class="text-red-600 font-bold text-sm">${tck.qty} ${t("ดวง")}</span></div>` : ''}
                    </div>
                    
                    ${tck.status === 'defect' ? `
                        <div class="bg-gray-100 text-gray-700 p-3 rounded border border-gray-300 text-sm mt-3">
                            <strong>${t("สาเหตุที่ปริ้นเสีย:")}</strong> ${tck.rejectReason}
                        </div>
                    ` : (tck.rejectReason ? `
                        <div class="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm mt-3">
                            <strong>${t("สาเหตุที่ปฏิเสธ:")}</strong> ${tck.rejectReason}
                        </div>
                    ` : '')}
                    
                    ${canApprove ? `
                        <div class="flex flex-col pt-4 border-t mt-4">
                            <div class="text-center text-xs text-gray-500 mb-3 bg-gray-100 p-2 rounded">
                                ${currentLang === 'EN' ? `You are approving this as <strong>${currentUser.name}</strong>` : `คุณกำลังจะตรวจสอบเอกสารนี้ในชื่อ <strong>${currentUser.name}</strong>`}
                            </div>
                            <div id="qc-action-buttons" class="flex gap-3">
                                <button onclick="processTicket('approved')" class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2">
                                    <i class="fa-solid fa-check-circle"></i> ${t("อนุมัติ (PASS)")}
                                </button>
                                <button onclick="processTicket('rejected')" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2">
                                    <i class="fa-solid fa-times-circle"></i> ${t("ปฏิเสธ (NG)")}
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// START APP & AUTH CHECK
// ==========================================
function initApp() {
    if (typeof IS_MAINTENANCE_MODE !== 'undefined' && IS_MAINTENANCE_MODE) {
        render(); return;
    }

    const savedUser = localStorage.getItem('qc_app_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            if (!currentUser || !currentUser.role) throw new Error("Invalid Session Data");
            
            // เปลี่ยนหน้าเริ่มต้นเป็น Dashboard
            currentTab = 'dashboard'; 
            requestNotificationPermission(); 
            fetchInitialData(); 
            startAutoFetch(); 
            
        } catch (e) { 
            localStorage.removeItem('qc_app_user'); 
            currentUser = null; 
        }
    }
    render();
}

window.onload = initApp;
