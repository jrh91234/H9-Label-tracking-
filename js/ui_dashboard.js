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
            const jobKey = tck.jobOrder.replace('[TEST] ', ''); 
            
            if (jobStats[jobKey]) {
                jobStats[jobKey].actualQty += qty;
            } else if (jobKey !== 'DEFECT') {
                jobStats[jobKey] = {
                    model: tck.model,
                    targetQty: 0,
                    actualQty: qty
                };
            }
        }
    });

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
            let barColor = percent >= 100 ? 'bg-green-500' : (actual === 0 ? 'bg-gray-300' : 'bg-blue-500');

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
