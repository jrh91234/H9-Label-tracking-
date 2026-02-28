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
    
    // 🛡️ ซ่อนรายการทดสอบสำหรับคนที่ไม่ใช่ Admin
    if (currentUser.role !== 'admin') {
        pendingTickets = pendingTickets.filter(t => !String(t.jobOrder).includes('[TEST]'));
    }

    if (currentUser.role === 'operator') {
        pendingTickets = pendingTickets.filter(t => t.operator === currentUser.name);
    }

    const pendingCount = pendingTickets.length;

    // อัปเดตตัวเลขแจ้งเตือนบนไอคอนแอป (App Badge)
    if ('setAppBadge' in navigator) {
        if (pendingCount > 0) {
            navigator.setAppBadge(pendingCount).catch(err => console.log("Badge error:", err));
        } else {
            navigator.clearAppBadge().catch(err => console.log("Clear badge error:", err));
        }
    }

    // เด้ง Push Notification เมื่อมีรายการใหม่
    const storedCount = parseInt(localStorage.getItem('qc_pending_count') || '0');
    if (pendingCount > storedCount && currentUser.role !== 'operator') {
        const newItemsCount = pendingCount - storedCount;
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Smart Label QC', {
                body: `มีรายการรอตรวจสอบใหม่ ${newItemsCount} รายการ!`,
                icon: 'https://cdn-icons-png.flaticon.com/512/7516/7516738.png',
                badge: 'https://cdn-icons-png.flaticon.com/512/7516/7516738.png'
            });
        }
    }
    
    localStorage.setItem('qc_pending_count', pendingCount.toString());
}

function startAutoFetch() {
    if (autoFetchInterval) clearInterval(autoFetchInterval);
    // รีเฟรชอัตโนมัติ ทุกๆ 30 วินาที
    autoFetchInterval = setInterval(() => {
        if (currentUser) fetchTickets();
    }, 30000); 
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

// 🛡️ Modal เปลี่ยนรหัสผ่านตัวเอง
function showChangePasswordModal() {
    const html = `
        <div id="change-password-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 class="font-bold text-blue-600 mb-4 text-xl border-b pb-2"><i class="fa-solid fa-key mr-2"></i>เปลี่ยนรหัสผ่าน</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">รหัสผ่านใหม่ <span class="text-red-500">*</span></label>
                        <input type="password" id="new-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="อย่างน้อย 4 ตัวอักษร">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่ <span class="text-red-500">*</span></label>
                        <input type="password" id="confirm-new-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="กรอกรหัสผ่านใหม่อีกครั้ง">
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="document.getElementById('change-password-modal').remove()" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition">ยกเลิก</button>
                    <button onclick="executeChangePassword()" id="btn-change-password" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md flex justify-center items-center gap-2"><i class="fa-solid fa-save"></i> บันทึก</button>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function executeChangePassword() {
    const newPass = document.getElementById('new-password').value.trim();
    const confirmPass = document.getElementById('confirm-new-password').value.trim();

    if (!newPass || !confirmPass) return showCustomAlert("กรุณากรอกรหัสผ่านให้ครบถ้วน");
    if (newPass !== confirmPass) return showCustomAlert("รหัสผ่านใหม่ไม่ตรงกัน");
    if (newPass.length < 4) return showCustomAlert("รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร");

    const btn = document.getElementById('btn-change-password');
    btn.innerHTML = `<div class="loader loader-white"></div>`;
    btn.disabled = true;

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: "changePassword",
            username: currentUser.username, 
            newPassword: newPass
        })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            document.getElementById('change-password-modal').remove();
            showCustomAlert(`เปลี่ยนรหัสผ่านสำเร็จ`, true);
        } else throw new Error(res.error);
    })
    .catch(err => {
        showCustomAlert(err.message);
        btn.innerHTML = `<i class="fa-solid fa-save"></i> บันทึก`;
        btn.disabled = false;
    });
}

// ฟังก์ชันสำหรับแสดงรูปภาพแบบเต็มจอ (HD)
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
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

// แปลงลิงก์ Google Drive ให้แสดงผลผ่าน Thumbnail API ป้องกันรูปแตก
function getDriveImageUrl(url, size = 'w800') {
    if (!url) return 'https://via.placeholder.com/150';
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=${size}`;
    }
    return url;
}

// ตัวจัดการวันที่ 
function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    return String(dateStr).replace('T', ' ').replace('.000Z', '');
}

// ดึงค่าวันที่วันนี้รูปแบบ YYYY-MM-DD
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// แปลงวันที่แบบ dd/MM/yyyy HH:mm:ss กลับเป็น YYYY-MM-DD เพื่อใช้เทียบค่า
function parseTicketDate(timestampStr) {
    if (!timestampStr) return null;
    if (timestampStr.includes('/')) {
        const parts = timestampStr.split(' ')[0].split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    } else if (timestampStr.includes('-')) {
         return timestampStr.split('T')[0];
    }
    return null;
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
    
    requestNotificationPermission();

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: "login", username: user, password: pass })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            currentUser = res.data; 
            currentUser.username = user; 
            localStorage.setItem('qc_app_user', JSON.stringify(currentUser)); 
            currentTab = (currentUser.role === 'operator' || currentUser.role === 'admin') ? 'scan' : 'inbox';
            currentSelectedJob = null; 
            
            fetchInitialData();
            startAutoFetch(); 
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

function logout() { 
    const html = `
        <div id="logout-modal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                <i class="fa-solid fa-arrow-right-from-bracket text-red-500 text-5xl mb-4"></i>
                <h3 class="font-bold text-gray-800 text-lg mb-2">ออกจากระบบ</h3>
                <p class="text-sm text-gray-600 mb-6">คุณต้องการออกจากระบบใช่หรือไม่?</p>
                <div class="flex gap-3">
                    <button onclick="document.getElementById('logout-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">ยกเลิก</button>
                    <button onclick="executeLogout()" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center">ยืนยัน</button>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function executeLogout() {
    const modal = document.getElementById('logout-modal');
    if (modal) modal.remove();
    currentUser = null; 
    localStorage.removeItem('qc_app_user');
    if (typeof stopCamera === 'function') stopCamera(); 
    stopAutoFetch(); 
    render(); 
}

// ==========================================
// DATA FETCHING 
// ==========================================

// ฟังก์ชันสร้าง Action ของปุ่ม Refresh
function handleRefresh(event) {
    if (event && event.currentTarget) {
        const icon = event.currentTarget.querySelector('i');
        if (icon) {
            icon.classList.add('fa-spin'); // เพิ่ม Animation หมุน
            // หน่วงเวลาให้หยุดหมุนหลังจาก 1 วินาที
            setTimeout(() => { icon.classList.remove('fa-spin'); }, 1000);
        }
    }
    
    if (currentTab === 'admin') {
        fetchUsersList(); 
    } else {
        fetchInitialData(); 
    }
}

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
            updateBadgeAndNotify(dbTickets); 
            if(currentTab === 'inbox') renderMainApp();
        })
        .catch(err => console.error("โหลดข้อมูล Inbox ไม่สำเร็จ: ", err));
}

let adminUsersList = [];

function fetchUsersList() {
    const contentDiv = document.getElementById('main-content');
    if(contentDiv) contentDiv.innerHTML = `<div class="flex justify-center items-center h-full"><div class="loader loader-blue loader-large"></div></div>`;
    
    fetch(`${API_URL}?action=getUsers`)
        .then(res => res.json())
        .then(data => {
            adminUsersList = data || [];
            renderMainApp();
        })
        .catch(err => {
            showCustomAlert("โหลดข้อมูลผู้ใช้ล้มเหลว: " + err.message);
            renderMainApp();
        });
}

// ==========================================
// APP ROUTING & UI RENDERING
// ==========================================
function switchTab(tab) {
    if (tab === 'scan' && currentUser.role !== 'operator' && currentUser.role !== 'admin') {
        showCustomAlert("คุณไม่มีสิทธิ์เข้าถึงหน้าสแกนฉลาก", false);
        return;
    }
    if (tab === 'admin' && currentUser.role !== 'admin') {
        showCustomAlert("คุณไม่มีสิทธิ์เข้าถึงหน้าจัดการระบบ", false);
        return;
    }

    currentTab = tab; 
    selectedTicket = null;
    
    if (tab !== 'scan') stopCamera();
    
    if (tab === 'admin') {
        fetchUsersList(); 
    } else {
        renderMainApp();
    }
}

function renderMainApp() {
    const appDiv = document.getElementById('app');
    
    let pendingCount = 0;
    if (currentUser) {
        let baseTickets = dbTickets.filter(t => {
            const tDate = parseTicketDate(t.timestamp);
            if (!tDate) return true;
            if (inboxStartDate && tDate < inboxStartDate) return false;
            if (inboxEndDate && tDate > inboxEndDate) return false;
            return true;
        });
        
        // 🛡️ ซ่อนรายการทดสอบสำหรับคนที่ไม่ใช่ Admin
        if (currentUser.role !== 'admin') {
            baseTickets = baseTickets.filter(t => !String(t.jobOrder).includes('[TEST]'));
        }

        if (currentUser.role === 'operator') {
            baseTickets = baseTickets.filter(t => t.operator === currentUser.name);
        }
        pendingCount = baseTickets.filter(t => t.status === 'pending').length;
    }

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
                <div class="flex items-center space-x-3 sm:space-x-4">
                    <!-- 🔄 ปุ่มรีเฟรชที่มี Animation -->
                    <button onclick="handleRefresh(event)" class="text-blue-500 hover:text-blue-700 transition" title="รีเฟรชข้อมูล"><i class="fa-solid fa-rotate"></i></button>
                    <!-- 🔑 ปุ่มแก้ไขรหัสผ่าน -->
                    <button onclick="showChangePasswordModal()" class="text-gray-400 hover:text-blue-600 transition" title="เปลี่ยนรหัสผ่าน"><i class="fa-solid fa-key"></i></button>
                    <div class="text-right ml-1 border-l pl-3 border-gray-200">
                        <div class="font-semibold text-sm text-blue-800">${currentUser.name}</div>
                        <div class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">${currentUser.role}</div>
                    </div>
                    <button onclick="logout()" class="text-gray-400 hover:text-red-500 transition ml-2"><i class="fa-solid fa-sign-out-alt text-xl"></i></button>
                </div>
            </header>
            <main class="flex-1 overflow-y-auto bg-gray-100 relative" id="main-content"></main>
            <nav class="bg-white border-t flex justify-around p-2 pb-safe z-20">
                ${(currentUser.role === 'operator' || currentUser.role === 'admin') ? `
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
                ${currentUser.role === 'admin' ? `
                <button onclick="switchTab('admin')" class="flex flex-col items-center p-2 w-full ${currentTab === 'admin' ? 'text-blue-600' : 'text-gray-400'}">
                    <i class="fa-solid fa-users-cog text-xl mb-1"></i><span class="text-[10px] font-medium mt-1">จัดการผู้ใช้</span>
                </button>
                ` : ''}
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
    else if (currentTab === 'admin') renderAdminView(contentDiv);
}

// ==========================================
// ADMIN USER MANAGEMENT VIEW
// ==========================================
function renderAdminView(container) {
    let html = `
        <div class="max-w-2xl mx-auto fade-in pb-20 p-4">
            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                <h2 class="font-bold text-gray-700 text-lg"><i class="fa-solid fa-users-cog text-blue-500 mr-2"></i> จัดการผู้ใช้งาน</h2>
                <button onclick="showAddUserModal()" class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm font-bold flex items-center gap-2 transition"><i class="fa-solid fa-plus"></i> เพิ่มผู้ใช้</button>
            </div>
            <div class="space-y-3">`;
    
    if (adminUsersList.length === 0) {
        html += `<div class="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">ไม่มีข้อมูลผู้ใช้งาน</div>`;
    }

    adminUsersList.forEach(u => {
        let roleColor = u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        u.role === 'qc' ? 'bg-blue-100 text-blue-800' : 
                        u.role === 'supervisor' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800';
        
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
                <button onclick="confirmDeleteUser('${u.username}')" class="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex justify-center items-center transition shadow-sm border border-red-100" ${u.username === 'admin' ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'title="ลบผู้ใช้"'}>
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function showAddUserModal() {
    const html = `
        <div id="add-user-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 class="font-bold text-blue-600 mb-4 text-xl border-b pb-2"><i class="fa-solid fa-user-plus mr-2"></i>เพิ่มบัญชีผู้ใช้งานใหม่</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">ชื่อ-สกุล <span class="text-red-500">*</span></label>
                        <input type="text" id="new-user-name" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="เช่น สมชาย ใจดี">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Username <span class="text-red-500">*</span></label>
                        <input type="text" id="new-user-username" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="ใช้สำหรับล็อกอิน (ห้ามซ้ำ)">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Password <span class="text-red-500">*</span></label>
                        <input type="password" id="new-user-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" placeholder="กำหนดรหัสผ่าน">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">สิทธิ์การใช้งาน (Role)</label>
                        <select id="new-user-role" onchange="toggleShiftSelect()" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700">
                            <option value="operator">ฝ่ายผลิต (Operator - ถ่ายรูปฉลาก)</option>
                            <option value="qc">หน่วยตรวจสอบ (QC - ตรวจผ่าน/ไม่ผ่าน)</option>
                            <option value="supervisor">หัวหน้างาน (Supervisor - ตรวจผ่าน/ไม่ผ่าน)</option>
                            <option value="admin">ผู้ดูแลระบบ (Admin - เข้าถึงได้ทุกฟังก์ชัน)</option>
                        </select>
                    </div>
                    <div id="shift-container">
                        <label class="block text-sm font-bold text-gray-700 mb-1">กะการทำงาน (Shift) <span class="text-red-500">*</span></label>
                        <select id="new-user-shift" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700">
                            <option value="A">กะ A</option>
                            <option value="B">กะ B</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="document.getElementById('add-user-modal').remove()" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition">ยกเลิก</button>
                    <button onclick="executeAddUser()" id="btn-add-user" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md flex justify-center items-center gap-2"><i class="fa-solid fa-save"></i> บันทึก</button>
                </div>
            </div>
        </div>`;
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

    if (!name || !username || !password) return showCustomAlert("กรุณากรอกข้อมูลให้ครบถ้วน");

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
            showCustomAlert(`เพิ่มบัญชี "${name}" เข้าสู่ระบบเรียบร้อย`, true);
            fetchUsersList();
        } else throw new Error(res.error);
    })
    .catch(err => {
        showCustomAlert(err.message);
        btn.innerHTML = `<i class="fa-solid fa-save"></i> บันทึก`;
        btn.disabled = false;
    });
}

function confirmDeleteUser(username) {
    const html = `
        <div id="delete-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
                <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                <h3 class="font-bold text-gray-800 text-lg mb-2">ยืนยันการลบผู้ใช้?</h3>
                <p class="text-sm text-gray-600 mb-6">คุณกำลังจะลบบัญชี <span class="font-bold text-red-600">${username}</span><br>การกระทำนี้ไม่สามารถกู้คืนได้</p>
                <div class="flex gap-3">
                    <button onclick="document.getElementById('delete-modal').remove()" class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition">ยกเลิก</button>
                    <button onclick="executeDeleteUser('${username}')" id="btn-delete-user" class="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center"><i class="fa-solid fa-trash-can mr-2"></i> ลบถาวร</button>
                </div>
            </div>
        </div>`;
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
            showCustomAlert(`ลบบัญชี ${username} ออกจากระบบแล้ว`, true);
            fetchUsersList();
        } else throw new Error(res.error);
    })
    .catch(err => {
        showCustomAlert(err.message);
        document.getElementById('delete-modal').remove();
    });
}

// ==========================================
// RENDER VIEWS (SCAN)
// ==========================================
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
            <div class="max-w-md mx-auto fade-in mt-10 p-4">
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
                    <video id="video" class="w-full h-full object-cover" autoplay playsinline></video>
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

    const safeModel = typeof extractedModel !== 'undefined' ? extractedModel : '';
    const safeLot = typeof extractedLot !== 'undefined' ? extractedLot : '';
    const safeDate = typeof extractedDate !== 'undefined' ? extractedDate : '';
    const safeQty = typeof extractedQty !== 'undefined' ? extractedQty : ''; 

    let verifyHtml = '';
    if (!verificationResult) {
        verifyHtml = `
            <button onclick="runSmartVerification()" class="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow transition mt-6 flex justify-center items-center gap-2">
                <i class="fa-solid fa-magnifying-glass-check"></i> กดตรวจสอบความถูกต้อง
            </button>
        `;
    } else {
        let msgList = verificationResult.messages.map(m => `<li>${m}</li>`).join('');
        verifyHtml = `
            <div class="mt-4 p-4 rounded-xl border-2 ${verificationResult.isPass ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                <h4 class="font-bold text-base mb-3 flex items-center ${verificationResult.isPass ? 'text-green-700' : 'text-red-700'}">
                    ${verificationResult.isPass ? '<i class="fa-solid fa-circle-check mr-2 text-xl"></i> ผลตรวจสอบ: ผ่าน (PASS)' : '<i class="fa-solid fa-circle-xmark mr-2 text-xl"></i> ผลตรวจสอบ: พบข้อผิดพลาด (NG)'}
                </h4>
                <ul class="text-xs space-y-1.5 text-gray-700">${msgList}</ul>
            </div>
            
            <!-- 🛡️ กล่องตัวเลือกโหมดทดสอบ -->
            <div class="mt-4 flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label for="test-mode-toggle" class="text-sm font-bold text-yellow-800 flex items-center gap-2 cursor-pointer">
                    <i class="fa-solid fa-flask text-yellow-600"></i> ส่งเป็นข้อมูลทดสอบระบบ
                </label>
                <input type="checkbox" id="test-mode-toggle" class="w-5 h-5 accent-yellow-600 cursor-pointer">
            </div>

            <div id="submit-action-container">
                <button onclick="submitToQC()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" ${!verificationResult.isPass ? 'disabled' : ''} id="submit-btn">
                    <i class="fa-solid fa-paper-plane"></i> ส่งผลตรวจสอบให้ QC
                </button>
            </div>
        `;
    }

    let innerContent = '';
    if (isProcessingOCR) {
        innerContent = `
            <div class="h-full flex flex-col justify-center items-center py-10">
                <div class="loader loader-blue loader-large mb-4"></div>
                <p class="text-blue-600 font-bold mt-4">AI กำลังอ่านข้อความ...</p>
                <p class="text-xs text-gray-500 mt-2 text-center">ระบบกำลังสกัดข้อมูลจากรูปภาพ<br>และคำนวณตรวจสอบความถูกต้อง</p>
            </div>
        `;
    } else {
        innerContent = `
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
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">3. วันที่ผลิต</label>
                            <input type="text" id="ocr-date" class="w-full border-b-2 border-gray-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition" value="${safeDate}">
                        </div>
                        <div>
                            <label class="text-[10px] text-blue-600 uppercase font-bold tracking-wider">4. จำนวน (Print Qty) <span class="text-red-500">*</span></label>
                            <input type="number" id="ocr-qty" class="w-full border-b-2 border-blue-200 py-1 font-bold text-gray-800 text-base focus:border-blue-500 outline-none transition bg-blue-50 px-2 rounded-t-md" value="${safeQty}" placeholder="ระบุจำนวน">
                        </div>
                    </div>
                </div>
                ${verifyHtml}
            </div>
        `;
    }

    container.innerHTML = `
        <div class="max-w-md mx-auto fade-in h-full flex flex-col pb-4 p-4">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div class="p-3 bg-blue-50 border-b flex justify-between items-center">
                    <div>
                        <span class="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Job ปัจจุบัน</span>
                        <span class="font-bold text-blue-800 text-sm">${currentSelectedJob} (${targetModel})</span>
                    </div>
                    <button onclick="changeJob()" class="text-[10px] text-blue-600 border border-blue-600 px-2 py-1 rounded bg-white font-bold"><i class="fa-solid fa-pen"></i> เปลี่ยน</button>
                </div>
                
                <div class="bg-black flex justify-center items-center h-48 relative border-b cursor-pointer" onclick="if('${capturedImageBase64}') showImageModal('${capturedImageBase64}')" title="คลิกเพื่อขยายรูปภาพ">
                    <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none z-10"><i class="fa-solid fa-magnifying-glass-plus"></i> ขยาย</div>
                    <img src="${capturedImageBase64 || ''}" class="w-full h-full object-contain pointer-events-none" />
                    
                    <button onclick="event.stopPropagation(); retakePhoto()" class="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm border border-white/20 shadow z-10"><i class="fa-solid fa-rotate-right mr-1"></i> ถ่ายใหม่</button>
                </div>
                
                <div class="p-4 bg-white overflow-y-auto">
                    ${innerContent}
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
    
    try {
        if (typeof extractedModel !== 'undefined') extractedModel = "";
        if (typeof extractedLot !== 'undefined') extractedLot = "";
        if (typeof extractedDate !== 'undefined') extractedDate = "";
        if (typeof extractedQty !== 'undefined') extractedQty = ""; 
    } catch(e) {}
    
    stopCamera(); 
    renderMainApp(); 
}

function submitToQC() {
    const qtyInput = document.getElementById('ocr-qty');
    if (qtyInput && !qtyInput.value.trim()) {
        return showCustomAlert("กรุณาระบุ 'จำนวน (Print Qty)' ก่อนส่งให้ QC ตรวจสอบ");
    }

    const isTestMode = document.getElementById('test-mode-toggle') && document.getElementById('test-mode-toggle').checked;
    const finalJobOrder = isTestMode ? `[TEST] ${currentSelectedJob}` : currentSelectedJob;

    const btnContainer = document.getElementById('submit-action-container');
    if(btnContainer) {
        btnContainer.innerHTML = `<div class="w-full text-center py-4 text-blue-600 font-bold bg-blue-50 rounded-lg mt-4 border border-blue-200"><div class="loader loader-blue mb-2"></div> กำลังอัปโหลดข้อมูลสู่ Cloud...</div>`;
    }

    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
            height = Math.floor(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const reducedImageBase64 = canvas.toDataURL('image/jpeg', 0.6);

        const newTicket = {
            jobOrder: finalJobOrder, // ส่ง JobOrder ที่เติม [TEST] หากอยู่ในโหมดทดสอบ
            model: document.getElementById('ocr-model').value,
            lot: document.getElementById('ocr-lot').value,
            date: document.getElementById('ocr-date').value,
            qty: qtyInput ? qtyInput.value.trim() : '', 
            operator: currentUser.name,
            image: reducedImageBase64
        };

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: "saveTicket", payload: newTicket })
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                showCustomAlert(`ส่งข้อมูล${isTestMode ? 'ทดสอบ' : ''}ให้ QC ตรวจสอบสำเร็จ!`, true);
                capturedImageBase64 = null; verificationResult = null;
                fetchTickets(); switchTab('inbox');
            } else throw new Error(res.error);
        })
        .catch(err => {
            showCustomAlert("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
            if(btnContainer) {
                btnContainer.innerHTML = `<button onclick="submitToQC()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2" id="submit-btn"><i class="fa-solid fa-paper-plane"></i> ส่งผลตรวจสอบให้ QC</button>`;
            }
        });
    };
    img.src = capturedImageBase64;
}

// ==========================================
// RENDER VIEWS (INBOX - EMAIL STYLE)
// ==========================================

let currentInboxFilter = 'pending'; // 'pending' | 'processed'
let inboxSearchTerm = '';
let inboxStartDate = getTodayDateString(); 
let inboxEndDate = getTodayDateString();   

function setInboxFilter(filter) {
    currentInboxFilter = filter;
    renderMainApp();
}

function executeInboxSearch() {
    const input = document.getElementById('inbox-search-input');
    if (input) {
        inboxSearchTerm = input.value.trim().toLowerCase();
        renderMainApp();
    }
}

function executeInboxDateFilter() {
    const startInput = document.getElementById('inbox-start-date');
    const endInput = document.getElementById('inbox-end-date');
    if (startInput) inboxStartDate = startInput.value;
    if (endInput) inboxEndDate = endInput.value;
    renderMainApp();
}

function renderInboxView(container) {
    let baseTickets = dbTickets;
    
    // 🛡️ ซ่อนรายการทดสอบสำหรับคนที่ไม่ใช่ Admin
    if (currentUser.role !== 'admin') {
        baseTickets = baseTickets.filter(t => !String(t.jobOrder).includes('[TEST]'));
    }

    if (currentUser.role === 'operator') {
        baseTickets = baseTickets.filter(t => t.operator === currentUser.name);
    }

    // กรองข้อมูลตามช่วงวันที่
    baseTickets = baseTickets.filter(t => {
        const tDate = parseTicketDate(t.timestamp);
        if (!tDate) return true; 
        if (inboxStartDate && tDate < inboxStartDate) return false;
        if (inboxEndDate && tDate > inboxEndDate) return false;
        return true;
    });

    let pendingCount = baseTickets.filter(t => t.status === 'pending').length;
    let processedCount = baseTickets.filter(t => t.status !== 'pending').length;

    let displayTickets = baseTickets.filter(t => currentInboxFilter === 'pending' ? t.status === 'pending' : t.status !== 'pending');

    if (inboxSearchTerm) {
        displayTickets = displayTickets.filter(t => 
            t.jobOrder.toLowerCase().includes(inboxSearchTerm) || 
            t.model.toLowerCase().includes(inboxSearchTerm) ||
            t.lot.toLowerCase().includes(inboxSearchTerm)
        );
    }

    displayTickets.sort((a, b) => b.id.localeCompare(a.id));

    let html = `
        <div class="max-w-2xl mx-auto flex flex-col h-full fade-in">
            <div class="bg-white px-4 pt-4 pb-2 shadow-sm z-10 sticky top-0">
                <h2 class="font-bold text-gray-800 text-lg mb-3 flex items-center">
                    <i class="fa-solid fa-envelope-open-text text-blue-500 mr-2 text-xl"></i> กล่องข้อความ
                </h2>

                <!-- 📅 เลือกช่วงวันที่ -->
                <div class="flex gap-2 mb-3">
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-500 uppercase font-bold mb-1">ตั้งแต่วันที่</label>
                        <input type="date" id="inbox-start-date" value="${inboxStartDate}" onchange="executeInboxDateFilter()" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition">
                    </div>
                    <div class="flex-1">
                        <label class="block text-[10px] text-gray-500 uppercase font-bold mb-1">ถึงวันที่</label>
                        <input type="date" id="inbox-end-date" value="${inboxEndDate}" onchange="executeInboxDateFilter()" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition">
                    </div>
                </div>
                
                <div class="relative flex gap-2 mb-3">
                    <div class="relative flex-1">
                        <i class="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
                        <input type="text" id="inbox-search-input" placeholder="ค้นหา Job, Model, Lot..." 
                               class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                               value="${inboxSearchTerm}" 
                               onkeypress="if(event.key === 'Enter') executeInboxSearch()">
                    </div>
                    <button onclick="executeInboxSearch()" class="bg-gray-800 text-white px-4 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-700 transition">ค้นหา</button>
                </div>

                <div class="flex bg-gray-100 p-1 rounded-lg">
                    <button onclick="setInboxFilter('pending')" class="flex-1 py-2 text-sm font-bold rounded-md transition flex justify-center items-center gap-1.5 ${currentInboxFilter === 'pending' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}">
                        รอตรวจสอบ 
                        ${pendingCount > 0 ? `<span class="${currentInboxFilter === 'pending' ? 'bg-red-500' : 'bg-gray-400'} text-white text-[10px] px-1.5 py-0.5 rounded-full">${pendingCount}</span>` : ''}
                    </button>
                    <button onclick="setInboxFilter('processed')" class="flex-1 py-2 text-sm font-bold rounded-md transition flex justify-center items-center gap-1.5 ${currentInboxFilter === 'processed' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}">
                        ดำเนินการแล้ว
                        ${processedCount > 0 ? `<span class="${currentInboxFilter === 'processed' ? 'bg-gray-600' : 'bg-gray-400'} text-white text-[10px] px-1.5 py-0.5 rounded-full">${processedCount}</span>` : ''}
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
    `;
    
    if (displayTickets.length === 0) {
        html += `
            <div class="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <i class="fa-regular fa-folder-open text-5xl text-gray-300 mb-3"></i>
                <p class="font-bold text-gray-600">ไม่มีรายการในหมวดหมู่นี้</p>
                <p class="text-xs text-gray-400 mt-1">ลองเปลี่ยนช่วงวันที่หรือคำค้นหาดูนะครับ</p>
            </div>
        `;
    }

    displayTickets.forEach(t => {
        let statusColor = t.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 
                          t.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
        let statusIcon = t.status === 'pending' ? '<i class="fa-solid fa-clock"></i> รอตรวจ' : 
                         t.status === 'approved' ? '<i class="fa-solid fa-check-circle"></i> ผ่าน' : '<i class="fa-solid fa-times-circle"></i> ปฏิเสธ';

        let cleanTime = formatDisplayDate(t.timestamp).split(' ')[1] || formatDisplayDate(t.timestamp);

        // ไฮไลต์ให้เห็นว่าเป็นข้อมูลทดสอบ (สำหรับ Admin)
        let jobDisplay = t.jobOrder.includes('[TEST]') ? `<span class="text-yellow-600 font-bold bg-yellow-100 px-1 rounded mr-1">TEST</span> ${t.jobOrder.replace('[TEST] ', '')}` : t.jobOrder;

        html += `
            <div onclick="openTicket('${t.id}')" class="bg-white rounded-xl shadow-sm p-3 border-l-4 ${t.status === 'pending' ? 'border-yellow-500' : t.status === 'approved' ? 'border-green-500' : 'border-red-500'} cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition">
                <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 shadow-inner">
                    <img src="${getDriveImageUrl(t.imageUrl)}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="flex-1 overflow-hidden">
                    <div class="flex justify-between items-start">
                        <span class="font-bold text-blue-800 text-sm truncate pr-2">${jobDisplay}</span>
                        <span class="text-[10px] px-2 py-0.5 rounded-full border ${statusColor} font-medium flex-shrink-0">${statusIcon}</span>
                    </div>
                    <div class="text-sm font-bold text-gray-800 mt-1 truncate">Model: ${t.model}</div>
                    <div class="text-[10px] text-gray-500 mt-1 truncate flex items-center gap-1">
                        <i class="fa-solid fa-user-circle"></i> ${t.operator} • ${cleanTime}
                    </div>
                </div>
            </div>`;
    });
    
    html += `</div></div>`; 
    container.innerHTML = html;
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
        if(res.success) { 
            showCustomAlert(`บันทึกสถานะเรียบร้อย`, true); 
            fetchTickets(); 
            closeTicket(); 
        }
        else throw new Error(res.error);
    })
    .catch(err => showCustomAlert("เกิดข้อผิดพลาดในการอัปเดตสถานะ API: " + err.message));
}

function processTicket(action) {
    if (action === 'rejected') { 
        showRejectPrompt();
    } else {
        const actionContainer = document.getElementById('qc-action-buttons');
        if(actionContainer) {
            actionContainer.innerHTML = `<div class="w-full text-center py-3 text-blue-600 font-bold bg-blue-50 rounded-lg"><div class="loader loader-blue mb-2"></div> กำลังอัปโหลดข้อมูลสู่ Cloud...</div>`;
        }
        executeProcessTicket(action);
    }
}

function renderTicketDetail(container) {
    let t = selectedTicket;
    let statusColor = t.status === 'pending' ? 'text-yellow-600' : t.status === 'approved' ? 'text-green-600' : 'text-red-600';
    let canApprove = (currentUser.role === 'qc' || currentUser.role === 'admin' || currentUser.role === 'supervisor') && t.status === 'pending';
    
    let jobDisplay = t.jobOrder.includes('[TEST]') ? `<span class="text-yellow-600 font-bold bg-yellow-100 px-1 rounded mr-1">TEST</span> ${t.jobOrder.replace('[TEST] ', '')}` : t.jobOrder;

    container.innerHTML = `
        <div class="max-w-2xl mx-auto fade-in pb-20 p-4">
            <button onclick="closeTicket()" class="mb-4 text-blue-600 hover:text-blue-800 font-medium"><i class="fa-solid fa-arrow-left mr-1"></i> ย้อนกลับ</button>
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-4 border-b flex justify-between items-center bg-gray-50">
                    <div class="overflow-hidden pr-2">
                        <h2 class="font-bold text-lg text-blue-800 truncate">${jobDisplay}</h2>
                        <span class="text-[10px] text-gray-500 font-mono">Ref: ${t.id}</span>
                    </div>
                    <span class="font-bold ${statusColor} uppercase text-sm flex-shrink-0">${t.status}</span>
                </div>
                
                <!-- 🛡️ ทำให้พื้นที่รูปภาพสามารถคลิกขยายได้ โดยดึงรูปความละเอียดสูง (w1920) -->
                <div class="p-4 bg-black flex justify-center relative cursor-pointer" onclick="showImageModal('${t.imageUrl ? getDriveImageUrl(t.imageUrl, 'w1920') : ''}')" title="คลิกเพื่อขยายรูปภาพ">
                    <div class="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm pointer-events-none z-10"><i class="fa-solid fa-magnifying-glass-plus"></i> ขยาย</div>
                    <img src="${getDriveImageUrl(t.imageUrl)}" class="max-h-80 object-contain rounded border border-gray-700 pointer-events-none" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                </div>
                
                <div class="p-5 space-y-4">
                    <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <h3 class="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-1">ข้อมูลที่สกัดได้จากฉลาก</h3>
                        <div class="grid grid-cols-3 gap-2 text-sm">
                            <div class="text-gray-500">Model:</div><div class="col-span-2 font-bold text-gray-800">${t.model}</div>
                            <div class="text-gray-500 mt-1">Lot No:</div><div class="col-span-2 font-bold text-gray-800 mt-1">${t.lot}</div>
                            <div class="text-gray-500 mt-1">วันที่ผลิต:</div><div class="col-span-2 font-bold text-gray-800 mt-1">${t.date}</div>
                            <div class="text-gray-500 mt-1">จำนวน:</div><div class="col-span-2 font-bold text-blue-700 mt-1">${t.qty || '-'}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-xs text-gray-500 border-t pt-4">
                        <div><span class="block font-bold text-gray-700">ส่งเรื่อง (OP):</span>${t.operator} <br> ${formatDisplayDate(t.timestamp)}</div>
                        ${t.status !== 'pending' ? `<div><span class="block font-bold text-gray-700">ตรวจสอบ (QC):</span>${t.qc} <br> ${formatDisplayDate(t.actionTime)}</div>` : ''}
                    </div>
                    ${t.rejectReason ? `<div class="bg-red-50 text-red-700 p-3 rounded border border-red-200 text-sm mt-3"><strong>สาเหตุที่ปฏิเสธ:</strong> ${t.rejectReason}</div>` : ''}
                    
                    ${canApprove ? `
                    <div class="flex flex-col pt-4 border-t mt-4">
                        <div class="text-center text-xs text-gray-500 mb-3 bg-gray-100 p-2 rounded">
                            คุณกำลังจะตรวจสอบเอกสารนี้ในชื่อ <strong>${currentUser.name}</strong>
                        </div>
                        <div id="qc-action-buttons" class="flex gap-3">
                            <button onclick="processTicket('approved')" class="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2"><i class="fa-solid fa-check-circle"></i> อนุมัติ (PASS)</button>
                            <button onclick="processTicket('rejected')" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition flex justify-center items-center gap-2"><i class="fa-solid fa-times-circle"></i> ปฏิเสธ (NG)</button>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>`;
}

// ==========================================
// START APP & AUTH CHECK
// ==========================================
function initApp() {
    const savedUser = localStorage.getItem('qc_app_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            if (!currentUser || !currentUser.role) {
                throw new Error("Invalid Session Data");
            }
            
            currentTab = (currentUser.role === 'operator' || currentUser.role === 'admin') ? 'scan' : 'inbox';
            
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
