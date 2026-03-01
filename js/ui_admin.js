// ==========================================
// ADMIN USER MANAGEMENT VIEW
// ==========================================
let adminUsersList = [];
let adminSearchTerm = '';
let adminRoleFilter = 'all';

function fetchUsersList() {
    const contentDiv = document.getElementById('main-content'); 
    if(contentDiv) {
        contentDiv.innerHTML = `<div class="flex justify-center items-center h-full"><div class="loader loader-blue loader-large"></div></div>`;
    }
    fetch(`${API_URL}?action=getUsers`)
        .then(res => res.json())
        .then(data => { 
            adminUsersList = data || []; 
            renderMainApp(); 
        })
        .catch(err => { 
            showCustomAlert(err.message); 
            renderMainApp(); 
        });
}

function setAdminRoleFilter(role) {
    adminRoleFilter = role;
    renderMainApp();
}

function executeAdminSearch() {
    const input = document.getElementById('admin-search-input');
    if (input) {
        adminSearchTerm = input.value.trim().toLowerCase();
        renderMainApp();
    }
}

function renderAdminView(container) {
    // 1. คำนวณสถิติ
    const totalUsers = adminUsersList.length;
    const opCount = adminUsersList.filter(u => u.role === 'operator').length;
    const qcCount = adminUsersList.filter(u => u.role === 'qc').length;
    const supCount = adminUsersList.filter(u => u.role === 'supervisor').length;
    const adminCount = adminUsersList.filter(u => u.role === 'admin').length;

    // 2. กรองข้อมูล
    let displayUsers = adminUsersList;
    if (adminRoleFilter !== 'all') {
        displayUsers = displayUsers.filter(u => u.role === adminRoleFilter);
    }
    if (adminSearchTerm) {
        displayUsers = displayUsers.filter(u => 
            u.name.toLowerCase().includes(adminSearchTerm) || 
            u.username.toLowerCase().includes(adminSearchTerm)
        );
    }

    let html = `
        <div class="max-w-6xl mx-auto fade-in p-4 pb-20 md:p-6 md:pb-6">
            
            <!-- Summary Stats -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div class="bg-white p-3 rounded-xl shadow-sm border-l-4 border-gray-800 flex flex-col justify-center col-span-2 md:col-span-1">
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">${t("ผู้ใช้งานทั้งหมด")}</div>
                    <div class="text-2xl font-black text-gray-800">${totalUsers}</div>
                </div>
                <div class="bg-white p-3 rounded-xl shadow-sm border-l-4 border-gray-400 flex flex-col justify-center">
                    <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Operator</div>
                    <div class="text-xl font-bold text-gray-700">${opCount}</div>
                </div>
                <div class="bg-white p-3 rounded-xl shadow-sm border-l-4 border-blue-400 flex flex-col justify-center">
                    <div class="text-[10px] text-blue-500 font-bold uppercase tracking-wider">QC</div>
                    <div class="text-xl font-bold text-blue-700">${qcCount}</div>
                </div>
                <div class="bg-white p-3 rounded-xl shadow-sm border-l-4 border-orange-400 flex flex-col justify-center">
                    <div class="text-[10px] text-orange-500 font-bold uppercase tracking-wider">Supervisor</div>
                    <div class="text-xl font-bold text-orange-700">${supCount}</div>
                </div>
                <div class="bg-white p-3 rounded-xl shadow-sm border-l-4 border-purple-400 flex flex-col justify-center">
                    <div class="text-[10px] text-purple-500 font-bold uppercase tracking-wider">Admin</div>
                    <div class="text-xl font-bold text-purple-700">${adminCount}</div>
                </div>
            </div>

            <!-- Controls (Search, Filter, Add, Backup) -->
            <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div class="flex-1 w-full md:w-auto flex flex-col md:flex-row gap-2">
                    <div class="relative flex-1 md:max-w-xs">
                        <i class="fa-solid fa-search absolute left-3 top-2.5 text-gray-400"></i>
                        <input type="text" id="admin-search-input" placeholder="${t("ค้นหาชื่อ หรือ Username...")}" class="w-full bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition h-[36px]" value="${adminSearchTerm}" onkeypress="if(event.key === 'Enter') executeAdminSearch()">
                    </div>
                    <select id="admin-role-filter" onchange="setAdminRoleFilter(this.value)" class="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition h-[36px] w-full md:w-auto">
                        <option value="all" ${adminRoleFilter === 'all' ? 'selected' : ''}>${t("ทุกสิทธิ์ (All Roles)")}</option>
                        <option value="operator" ${adminRoleFilter === 'operator' ? 'selected' : ''}>Operator</option>
                        <option value="qc" ${adminRoleFilter === 'qc' ? 'selected' : ''}>QC</option>
                        <option value="supervisor" ${adminRoleFilter === 'supervisor' ? 'selected' : ''}>Supervisor</option>
                        <option value="admin" ${adminRoleFilter === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="flex gap-2 w-full md:w-auto">
                     <button onclick="exportTicketsToCSV()" class="flex-1 md:flex-none px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-sm transition flex justify-center items-center gap-2 h-[36px]" title="${t('สำรองข้อมูลตั๋ว (CSV)')}">
                        <i class="fa-solid fa-file-excel"></i> <span class="hidden md:inline">${t("Backup")}</span>
                    </button>
                    <button onclick="showAddUserModal()" class="flex-[2] md:flex-none bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg shadow-sm font-bold flex justify-center items-center gap-2 transition h-[36px]">
                        <i class="fa-solid fa-user-plus"></i> ${t("เพิ่มผู้ใช้")}
                    </button>
                </div>
            </div>
            
            <!-- User List -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
    `;
    
    if (displayUsers.length === 0) {
        html += `<div class="col-span-full text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-dashed border-gray-300"><i class="fa-solid fa-users-slash text-4xl mb-3 text-gray-300"></i><p>${t("ไม่พบข้อมูลผู้ใช้งานที่ค้นหา")}</p></div>`;
    }

    displayUsers.forEach(u => {
        let roleColor = u.role === 'admin' ? 'bg-purple-100 text-purple-800' 
                      : u.role === 'qc' ? 'bg-blue-100 text-blue-800' 
                      : u.role === 'supervisor' ? 'bg-orange-100 text-orange-800' 
                      : 'bg-gray-100 text-gray-800';
                      
        let roleTitle = u.role === 'operator' ? 'OP' : u.role.toUpperCase();
        let safeUserObj = encodeURIComponent(JSON.stringify(u));
        
        html += `
            <div class="bg-white rounded-xl shadow-sm p-4 border-l-4 ${u.role === 'admin' ? 'border-purple-500' : u.role === 'qc' ? 'border-blue-500' : u.role === 'supervisor' ? 'border-orange-500' : 'border-gray-500'} flex justify-between items-center transition hover:shadow-md group">
                <div class="overflow-hidden pr-2">
                    <div class="font-bold text-gray-800 text-base truncate" title="${u.name}">${u.name}</div>
                    <div class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <i class="fa-solid fa-user text-gray-400"></i> <span class="truncate">${u.username}</span> 
                        <span class="px-2 py-0.5 rounded-md ${roleColor} text-[10px] font-bold tracking-wider flex-shrink-0">${roleTitle}</span>
                    </div>
                </div>
                <div class="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button onclick="showResetPasswordModal('${u.username}')" class="w-8 h-8 rounded bg-yellow-50 text-yellow-600 hover:bg-yellow-100 flex justify-center items-center transition" title="${t('รีเซ็ตรหัสผ่าน')}">
                        <i class="fa-solid fa-key"></i>
                    </button>
                    <button onclick="showEditUserModal('${safeUserObj}')" class="w-8 h-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 flex justify-center items-center transition" title="${t('แก้ไขข้อมูล')}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="confirmDeleteUser('${u.username}')" class="w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-100 flex justify-center items-center transition" ${u.username === 'admin' ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : `title="${t('ลบผู้ใช้')}"`}>
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
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
                    <i class="fa-solid fa-user-plus mr-2"></i>${t("เพิ่มผู้ใช้ใหม่")}
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
                        <select id="new-user-role" onchange="toggleShiftSelect('new-user-role', 'shift-container')" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700">
                            <option value="operator">${t("ฝ่ายผลิต (Operator)")}</option>
                            <option value="qc">${t("หน่วยตรวจสอบ (QC)")}</option>
                            <option value="supervisor">${t("หัวหน้างาน (Supervisor)")}</option>
                            <option value="admin">${t("ผู้ดูแลระบบ (Admin)")}</option>
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

function showEditUserModal(safeUserObjStr) {
    const user = JSON.parse(decodeURIComponent(safeUserObjStr));
    
    // พยายามแกะชื่อและกะออกจากกัน (กรณี Operator ที่มีกะต่อท้าย)
    let displayName = user.name;
    let currentShift = 'A';
    
    if (user.role === 'operator') {
        const shiftMatch = displayName.match(/\s+\(([AB])\)$/i);
        if (shiftMatch) {
            currentShift = shiftMatch[1].toUpperCase();
            displayName = displayName.replace(/\s+\(([AB])\)$/i, '').trim();
        }
    }

    const html = `
        <div id="edit-user-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 class="font-bold text-blue-600 mb-4 text-xl border-b pb-2">
                    <i class="fa-solid fa-user-pen mr-2"></i>${t("แก้ไขข้อมูลผู้ใช้")}
                </h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">Username (อ่านอย่างเดียว)</label>
                        <input type="text" id="edit-user-username" class="w-full border-2 p-2.5 rounded-lg outline-none bg-gray-100 text-gray-500 cursor-not-allowed" value="${user.username}" readonly>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("ชื่อ-สกุล")} <span class="text-red-500">*</span></label>
                        <input type="text" id="edit-user-name" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition" value="${displayName}">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("สิทธิ์การใช้งาน (Role)")}</label>
                        <select id="edit-user-role" onchange="toggleShiftSelect('edit-user-role', 'edit-shift-container')" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700" ${user.username === 'admin' ? 'disabled' : ''}>
                            <option value="operator" ${user.role === 'operator' ? 'selected' : ''}>${t("ฝ่ายผลิต (Operator)")}</option>
                            <option value="qc" ${user.role === 'qc' ? 'selected' : ''}>${t("หน่วยตรวจสอบ (QC)")}</option>
                            <option value="supervisor" ${user.role === 'supervisor' ? 'selected' : ''}>${t("หัวหน้างาน (Supervisor)")}</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>${t("ผู้ดูแลระบบ (Admin)")}</option>
                        </select>
                    </div>
                    <div id="edit-shift-container" style="display: ${user.role === 'operator' ? 'block' : 'none'};">
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("กะการทำงาน (Shift)")} <span class="text-red-500">*</span></label>
                        <select id="edit-user-shift" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-blue-500 transition font-bold text-gray-700">
                            <option value="A" ${currentShift === 'A' ? 'selected' : ''}>${t("กะ A")}</option>
                            <option value="B" ${currentShift === 'B' ? 'selected' : ''}>${t("กะ B")}</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="document.getElementById('edit-user-modal').remove()" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition">${t("ยกเลิก")}</button>
                    <button onclick="executeEditUser()" id="btn-edit-user" class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md flex justify-center items-center gap-2">
                        <i class="fa-solid fa-save"></i> ${t("บันทึกการแก้ไข")}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function showResetPasswordModal(username) {
     const html = `
        <div id="reset-password-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 fade-in">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <h3 class="font-bold text-yellow-600 mb-2 text-xl border-b pb-2">
                    <i class="fa-solid fa-key mr-2"></i>${t("รีเซ็ตรหัสผ่าน")}
                </h3>
                <p class="text-sm text-gray-600 mb-4">สำหรับผู้ใช้ <span class="font-bold text-gray-800">${username}</span></p>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-1">${t("รหัสผ่านใหม่")} <span class="text-red-500">*</span></label>
                        <input type="password" id="admin-reset-password" class="w-full border-2 p-2.5 rounded-lg outline-none focus:border-yellow-500 transition" placeholder="${t("อย่างน้อย 4 ตัวอักษร")}">
                    </div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button onclick="document.getElementById('reset-password-modal').remove()" class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition">${t("ยกเลิก")}</button>
                    <button onclick="executeResetPassword('${username}')" id="btn-reset-password" class="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition shadow-md flex justify-center items-center gap-2">
                        <i class="fa-solid fa-check"></i> ${t("ยืนยันรีเซ็ต")}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function toggleShiftSelect(roleSelectId, shiftContainerId) {
    const roleEl = document.getElementById(roleSelectId); 
    const shiftContainer = document.getElementById(shiftContainerId);
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

function executeEditUser() {
    const username = document.getElementById('edit-user-username').value;
    const name = document.getElementById('edit-user-name').value.trim();
    const role = document.getElementById('edit-user-role').value;
    const shift = document.getElementById('edit-user-shift') ? document.getElementById('edit-user-shift').value : '';

    if (!name) return showCustomAlert(currentLang === 'EN' ? "Please enter name" : "กรุณากรอกชื่อ-สกุล");

    const btn = document.getElementById('btn-edit-user'); 
    btn.innerHTML = `<div class="loader loader-white"></div>`; 
    btn.disabled = true;

    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "editUser", payload: { username, name, role, shift } }) 
    })
    .then(res => res.json())
    .then(res => { 
        if (res.success) { 
            document.getElementById('edit-user-modal').remove(); 
            showCustomAlert(currentLang === 'EN' ? "User updated successfully" : `อัปเดตข้อมูลบัญชีเรียบร้อย`, true); 
            fetchUsersList(); 
        } else {
            throw new Error(res.error); 
        }
    })
    .catch(err => { 
        showCustomAlert(err.message); 
        btn.innerHTML = `<i class="fa-solid fa-save"></i> ${t("บันทึกการแก้ไข")}`; 
        btn.disabled = false; 
    });
}

function executeResetPassword(username) {
    const newPass = document.getElementById('admin-reset-password').value.trim();
    if (!newPass || newPass.length < 4) return showCustomAlert(currentLang === 'EN' ? "Password must be at least 4 characters" : "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร");

    const btn = document.getElementById('btn-reset-password'); 
    btn.innerHTML = `<div class="loader loader-white"></div>`; 
    btn.disabled = true;

    fetch(API_URL, { 
        method: 'POST', 
        body: JSON.stringify({ action: "changePassword", username: username, newPassword: newPass }) 
    })
    .then(res => res.json())
    .then(res => { 
        if(res.success) { 
            document.getElementById('reset-password-modal').remove(); 
            showCustomAlert(currentLang === 'EN' ? `Password reset successfully for ${username}` : `ตั้งรหัสผ่านใหม่ให้บัญชี ${username} สำเร็จ`, true); 
        } else {
            throw new Error(res.error); 
        }
    })
    .catch(err => { 
        showCustomAlert(err.message); 
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${t("ยืนยันรีเซ็ต")}`; 
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
