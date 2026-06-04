// ==========================================
// LABEL QC APPROVAL BACKEND (PURE API VERSION)
// ==========================================

var MAIN_SPREADSHEET_ID = "1PYcAatoJ4QX28uQ_LF8dDC6oTiMWbfPs5TZDfGJVa4U";
var QC_LOG_SHEET_NAME = "QC_Label_Log";
var USER_SHEET_NAME = "Users";
var BATCH_SHEET_NAME = "Print_Batches"; 

var TARGET_FOLDER_ID = "19CkFSkAXgivw6Y3aGozibCvjcJZigCaS"; 

// ==========================================
// 1. ROUTER (HTTP GET - ดึงข้อมูล)
// ==========================================
function doGet(e) {
  try {
    var action = e.parameter ? e.parameter.action : null;
    
    if (action === "getJobs") {
        return createJsonResponse(getActiveJobsForQC());
    }
    if (action === "getTickets") {
        var startDate = e.parameter ? e.parameter.startDate : null;
        var endDate = e.parameter ? e.parameter.endDate : null;
        return createJsonResponse(getQCTickets(startDate, endDate));
    }
    if (action === "getUsers") {
        return createJsonResponse(getUsers()); 
    }
    if (action === "getBatches") {
        return createJsonResponse(getActiveBatches()); 
    }
    
    return createJsonResponse({ 
        status: "online", 
        message: "Smart Label QC API is running properly." 
    });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

// ==========================================
// 2. ROUTER (HTTP POST - ส่งข้อมูลเข้า)
// ==========================================
function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var action = requestData.action;

    if (action === "login") {
      var userResult = authenticateUser(requestData.username, requestData.password);
      if (userResult) {
          return createJsonResponse({ success: true, data: userResult });
      } else {
          return createJsonResponse({ success: false, error: "Username หรือ Password ไม่ถูกต้อง" });
      }
    }
    else if (action === "ocr") {
      var text = performOCRFromImage(requestData.base64);
      return createJsonResponse({ success: true, text: text });
    } 
    else if (action === "saveTicket") {
      var result = saveQCTicket(requestData.payload);
      return createJsonResponse({ success: true, data: result });
    } 
    else if (action === "saveDefect") {
      var result = saveDefectTicket(requestData.payload);
      return createJsonResponse({ success: true, data: result });
    }
    else if (action === "updateTicket") {
      var result = updateQCTicketStatus(requestData.ticketId, requestData.status, requestData.qcName, requestData.reason);
      return createJsonResponse({ success: true, data: result });
    }
    else if (action === "addUser") {
      var result = addUser(requestData.payload);
      return createJsonResponse({ success: true, data: result });
    }
    // 🟢 Action ใหม่: สำหรับแก้ไขผู้ใช้งาน
    else if (action === "editUser") {
      var result = editUser(requestData.payload);
      return createJsonResponse({ success: true, data: result });
    }
    else if (action === "deleteUser") {
      var result = deleteUser(requestData.username);
      return createJsonResponse({ success: true, data: result });
    }
    else if (action === "changePassword") {
      var result = changePassword(requestData.username, requestData.newPassword);
      return createJsonResponse({ success: true, data: result });
    }
    else if (action === "createBatch") {
      // 🟢 เพิ่มการรับค่า printQty จาก Python
      var result = createPrintBatch(requestData.batchNo, requestData.docName, requestData.printQty);
      return createJsonResponse({ success: true, data: result });
    }
    
    throw new Error("Unknown action requested: " + action);
  } catch(err) {
    return createJsonResponse({ success: false, error: err.message });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// 3. CORE LOGIC FUNCTIONS 
// ==========================================

function authenticateUser(username, password) {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(USER_SHEET_NAME);
    sheet.appendRow(["Username", "Password", "Role", "Name"]);
    sheet.appendRow(["admin", "1234", "admin", "ผู้ดูแลระบบ"]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#d0e0e3");
  }
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var dbUser = String(data[i][0]).trim();
    var dbPass = String(data[i][1]).trim();
    if (dbUser === String(username).trim() && dbPass === String(password).trim()) {
      return { 
          role: String(data[i][2]).trim().toLowerCase(), 
          name: String(data[i][3]).trim() 
      };
    }
  }
  return null;
}

function getActiveJobsForQC() {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName("Plan");
  if (!sheet) throw new Error("ไม่พบ Sheet ชื่อ 'Plan'");
  
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2) return [];
  
  // 🟢 อ่าน Header แถวแรกสุด และแปลงเป็นตัวพิมพ์เล็กเพื่อค้นหาง่ายขึ้น
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim().toLowerCase(); });
  
  // 🟢 ค้นหา Index ของแต่ละคอลัมน์แบบอัตโนมัติจากชื่อหัวตาราง
  var jobIdx = headers.findIndex(function(h) { return h.includes("job"); });
  var modelIdx = headers.findIndex(function(h) { return h === "model" || h.includes("model"); });
  var qtyIdx = headers.findIndex(function(h) { return h.includes("qty") || h.includes("จำนวน") || h.includes("target"); });
  var progIdx = headers.findIndex(function(h) { return h.includes("progress") || h.includes("ความคืบหน้า"); });
  
  // Fallback: ถ้าใครเผลอเปลี่ยนชื่อหัวคอลัมน์จนหาไม่เจอ ให้ใช้เลข Index เดิมเป็นค่าสำรอง (0-indexed)
  if (jobIdx === -1) jobIdx = 3;  // คอลัมน์ D
  if (modelIdx === -1) modelIdx = 6; // คอลัมน์ G
  if (qtyIdx === -1) qtyIdx = 7;  // คอลัมน์ H
  if (progIdx === -1) progIdx = 10; // คอลัมน์ K
  
  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var activeJobs = [];
  
  data.forEach(function(row) {
    var jobOrder = String(row[jobIdx] || "").trim(); 
    var orderModel = String(row[modelIdx] || "").trim();
    var targetQty = parseInt(row[qtyIdx]) || 0;
    var progress = row[progIdx];              
    
    if (jobOrder !== "" && (progress === "" || parseFloat(progress) < 100)) {
      activeJobs.push({ 
          job: jobOrder, 
          targetModel: orderModel,
          targetQty: targetQty 
      });
    }
  });
  return activeJobs;
}

function performOCRFromImage(base64Data) {
  try {
    var blob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'image/jpeg', "temp_ocr.jpg");
    var resource = { name: blob.getName(), mimeType: MimeType.GOOGLE_DOCS };
    var file = Drive.Files.create(resource, blob);
    var doc = DocumentApp.openById(file.id);
    var text = doc.getBody().getText();
    Drive.Files.remove(file.id);
    return text;
  } catch (e) {
    throw new Error("ระบบ AI OCR เกิดข้อผิดพลาด: " + e.message);
  }
}

function getOrCreateBatchSheet() {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(BATCH_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(BATCH_SHEET_NAME);
    // 🟢 เพิ่มคอลัมน์ PrintQty เข้าไป
    sheet.appendRow(["Timestamp", "BatchNo", "DocName", "Status", "PrintQty"]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#d0e0e3");
  }
  return sheet;
}

function createPrintBatch(batchNo, docName, printQty) {
  var sheet = getOrCreateBatchSheet();
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  var qty = printQty ? printQty : 0;
  // 🟢 บันทึกค่าจำนวนดวงลงในคอลัมน์ที่ 5
  sheet.appendRow(["'" + timestamp, batchNo, docName, "pending", qty]);
  return { success: true };
}

function getActiveBatches() {
  var sheet = getOrCreateBatchSheet();
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 5); // ต้องมีอย่างน้อย 5 คอลัมน์
  if (lastRow < 2) return [];
  
  // 🟢 อ่าน Header แถวแรกสุดของ Sheet Print_Batches
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim().toLowerCase(); });
  
  // 🟢 ค้นหา Index ของคอลัมน์อัตโนมัติ เผื่อวันหลังมีการแทรกคอลัมน์
  var timeIdx = headers.indexOf("timestamp") !== -1 ? headers.indexOf("timestamp") : 0;
  var batchIdx = headers.indexOf("batchno") !== -1 ? headers.indexOf("batchno") : 1;
  var docIdx = headers.indexOf("docname") !== -1 ? headers.indexOf("docname") : 2;
  var statusIdx = headers.indexOf("status") !== -1 ? headers.indexOf("status") : 3;
  var qtyIdx = headers.findIndex(function(h) { return h.includes("printqty") || h.includes("qty"); });
  
  if (qtyIdx === -1) qtyIdx = 4; // ค่าสำรองถ้าหาไม่เจอ
  
  var startRow = Math.max(2, lastRow - 49);
  var data = sheet.getRange(startRow, 1, lastRow - startRow + 1, lastCol).getValues();
  var batches = [];
  
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][statusIdx] === 'pending') {
      batches.push({ 
          batchNo: data[i][batchIdx], 
          docName: data[i][docIdx], 
          timestamp: data[i][timeIdx],
          printQty: data[i][qtyIdx] 
      });
    }
  }
  return batches;
}

function markBatchAsUsed(batchNo) {
  if (!batchNo) return;
  var sheet = getOrCreateBatchSheet();
  if (sheet.getLastRow() < 2) return;
  
  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues(); 
  
  for (var i = data.length - 1; i >= 0; i--) { 
    if (data[i][0] === batchNo) {
      sheet.getRange(i + 2, 4).setValue("used"); 
      break;
    }
  }
}

function markBatchAsDefect(batchNo) {
  if (!batchNo) return;
  var sheet = getOrCreateBatchSheet();
  if (sheet.getLastRow() < 2) return;
  
  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues(); 
  
  for (var i = data.length - 1; i >= 0; i--) { 
    if (data[i][0] === batchNo) {
      sheet.getRange(i + 2, 4).setValue("defect"); 
      break;
    }
  }
}

function markBatchAsPending(batchNo) {
  if (!batchNo) return;
  var sheet = getOrCreateBatchSheet();
  if (sheet.getLastRow() < 2) return;
  
  var data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues(); 
  
  for (var i = data.length - 1; i >= 0; i--) { 
    if (data[i][0] === batchNo) {
      sheet.getRange(i + 2, 4).setValue("pending"); 
      break;
    }
  }
}

function getOrCreateQCSheet() {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(QC_LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(QC_LOG_SHEET_NAME);
    sheet.appendRow(["ID", "Timestamp", "JobOrder", "Model", "Lot", "Date", "Operator", "Status", "QC_Name", "ActionTime", "RejectReason", "ImageUrl", "Qty", "BatchNo"]);
    sheet.getRange("1:1").setFontWeight("bold").setBackground("#d0e0e3");
  }
  return sheet;
}

// ==========================================
// 4. DRIVE STORAGE & TICKET FUNCTIONS
// ==========================================
function saveImageToDrive(base64String, filename) {
  try {
    var mainFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
    var dateNow = new Date();
    var monthFolderName = Utilities.formatDate(dateNow, "GMT+7", "yyyy_MM");
    
    var subFolders = mainFolder.getFoldersByName(monthFolderName);
    var subFolder = subFolders.hasNext() ? subFolders.next() : mainFolder.createFolder(monthFolderName);
    if (!subFolders.hasNext()) subFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var data = base64String.indexOf(',') !== -1 ? base64String.split(',')[1] : base64String;
    var blob = Utilities.newBlob(Utilities.base64Decode(data), 'image/jpeg', filename);
    var file = subFolder.createFile(blob);

    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (e) {
    throw new Error("บันทึกรูปลง Drive ไม่สำเร็จ: " + e.message);
  }
}

function saveQCTicket(data) {
  var sheet = getOrCreateQCSheet();
  var newId = "REQ-" + Utilities.formatDate(new Date(), "GMT+7", "yyMMdd-HHmmss");
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  
  var imageUrl = data.image ? saveImageToDrive(data.image, newId + "_" + data.jobOrder + ".jpg") : "";
  
  sheet.appendRow([
    newId, "'" + timestamp, data.jobOrder, data.model, data.lot, "'" + data.date, 
    data.operator, "pending", "", "", "", imageUrl, data.qty, data.batchNo
  ]);
  
  markBatchAsUsed(data.batchNo);
  
  return { id: newId, status: "success" };
}

function saveDefectTicket(data) {
  var sheet = getOrCreateQCSheet();
  var newId = "ERR-" + Utilities.formatDate(new Date(), "GMT+7", "yyMMdd-HHmmss");
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  
  var imageUrl = data.image ? saveImageToDrive(data.image, newId + "_DEFECT.jpg") : "";
  
  sheet.appendRow([
    newId, "'" + timestamp, data.jobOrder, data.model, data.lot, "'" + data.date, 
    data.operator, "defect", "-", "'" + timestamp, data.defectReason, imageUrl, data.qty, data.batchNo
  ]);
  
  markBatchAsDefect(data.batchNo);
  
  return { id: newId, status: "success" };
}

function getQCTickets(startDate, endDate) {
  var sheet = getOrCreateQCSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  var hasDateFilter = (startDate && endDate);
  var startRow, numRows;

  if (hasDateFilter) {
    startRow = 2;
    numRows = lastRow - 1;
  } else {
    startRow = Math.max(2, lastRow - 49);
    numRows = lastRow - startRow + 1;
  }

  var data = sheet.getRange(startRow, 1, numRows, 14).getValues();

  var parseDateString = function(val, isTimeMode) {
    if (val instanceof Date) return Utilities.formatDate(val, "GMT+7", isTimeMode ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy");
    return val ? String(val) : "";
  };

  var toComparableDate = function(val) {
    if (val instanceof Date) return Utilities.formatDate(val, "GMT+7", "yyyy-MM-dd");
    var s = String(val).replace(/^'/, "");
    if (s.indexOf('/') !== -1) {
      var parts = s.split(' ')[0].split('/');
      if (parts.length === 3) return parts[2] + "-" + ("0" + parts[1]).slice(-2) + "-" + ("0" + parts[0]).slice(-2);
    }
    if (s.indexOf('-') !== -1) return s.split('T')[0];
    return null;
  };

  var tickets = [];
  for (var i = data.length - 1; i >= 0; i--) {
    var row = data[i];

    if (hasDateFilter) {
      var ticketDate = toComparableDate(row[1]);
      if (ticketDate && (ticketDate < startDate || ticketDate > endDate)) continue;
    }

    tickets.push({
      id: row[0],
      timestamp: parseDateString(row[1], true),
      jobOrder: row[2],
      model: row[3],
      lot: row[4],
      date: parseDateString(row[5], false),
      operator: row[6],
      status: row[7],
      qc: row[8],
      actionTime: parseDateString(row[9], true),
      rejectReason: row[10],
      imageUrl: row[11],
      qty: row[12],
      batchNo: row[13]
    });
  }
  return tickets;
}

function updateQCTicketStatus(ticketId, newStatus, qcName, reason) {
  var sheet = getOrCreateQCSheet();
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 14).getValues(); 
  
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === ticketId) {
      if (data[i][7] !== 'pending') throw new Error("❌ รายการนี้ถูกดำเนินการไปแล้วโดยบุคคลอื่น");

      var rowIndex = i + 2;
      var actionTime = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
      
      sheet.getRange(rowIndex, 8).setValue(newStatus); 
      sheet.getRange(rowIndex, 9).setValue(qcName);    
      sheet.getRange(rowIndex, 10).setValue("'" + actionTime);
      if (reason) sheet.getRange(rowIndex, 11).setValue(reason);  
      
      if (newStatus === 'rejected') {
          var batchNo = data[i][13]; 
          if (batchNo) markBatchAsPending(batchNo);
      }
      
      return { success: true };
    }
  }
  throw new Error("Ticket ID Not Found");
}

// ==========================================
// 5. USER MANAGEMENT FUNCTIONS
// ==========================================
function getUsers() {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var users = [];
  
  for (var i = 1; i < data.length; i++) { 
    if(data[i][0] !== "") {
        users.push({ 
            username: String(data[i][0]).trim(), 
            role: String(data[i][2]).trim().toLowerCase(), 
            name: String(data[i][3]).trim() 
        });
    }
  }
  return users;
}

function addUser(payload) {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(payload.username).trim()) {
        throw new Error("Username นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น");
    }
  }
  
  var finalName = payload.name.trim();
  if (payload.role === 'operator' && payload.shift) {
      finalName = finalName + " (" + payload.shift + ")";
  }
  
  sheet.appendRow([payload.username, payload.password, payload.role, finalName]);
  return { success: true };
}

// 🟢 ฟังก์ชันใหม่: สำหรับอัปเดตข้อมูลผู้ใช้งานใน Sheet
function editUser(payload) {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  if (payload.username === 'admin') throw new Error("ไม่สามารถแก้ไขสิทธิ์ของ admin หลักได้");
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(payload.username).trim()) {
      var finalName = payload.name.trim();
      if (payload.role === 'operator' && payload.shift) {
          finalName = finalName + " (" + payload.shift + ")";
      }
      
      // อัปเดต Role (คอลัมน์ C) และ Name (คอลัมน์ D)
      sheet.getRange(i + 1, 3).setValue(payload.role); 
      sheet.getRange(i + 1, 4).setValue(finalName);
      
      return { success: true };
    }
  }
  throw new Error("ไม่พบบัญชีผู้ใช้นี้ในระบบ");
}

function deleteUser(username) {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  if(username === 'admin') throw new Error("ไม่สามารถลบบัญชี admin หลักได้");
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(username).trim()) {
      sheet.deleteRow(i + 1); 
      return { success: true };
    }
  }
  throw new Error("ไม่พบบัญชีผู้ใช้นี้ในระบบ");
}

function changePassword(username, newPassword) {
  var ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  var sheet = ss.getSheetByName(USER_SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(username).trim()) {
      sheet.getRange(i + 1, 2).setValue(newPassword); 
      return { success: true };
    }
  }
  throw new Error("ไม่พบบัญชีผู้ใช้ของคุณในระบบ");
}
