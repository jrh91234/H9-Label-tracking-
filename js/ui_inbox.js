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
