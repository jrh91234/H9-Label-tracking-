// ==========================================
// ADMIN USER MANAGEMENT VIEW
// ==========================================
let adminUsersList = [];

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
