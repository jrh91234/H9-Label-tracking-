// ==========================================
// CONFIGURATION
// ==========================================
// [อัปเดต URL ล่าสุดของ Web App คุณที่นี่เสมอ]
const API_URL = "https://script.google.com/macros/s/AKfycbzW5QPUcGiI-I5xww5d465M8WhBRBO5iog6xtCv5IskedBs9CAm4Q_fszHkxr-f7tCazw/exec";

// ==========================================
// STATE MANAGEMENT (ตัวแปรส่วนกลางทั้งหมด)
// ==========================================
let currentUser = null; 
let dbJobs = []; 
let dbBatches = []; 
let dbTickets = []; 

let currentTab = 'inbox'; 
let selectedTicket = null;
let currentSelectedJob = null;
let currentSelectedBatch = null; 

let stream = null;
let capturedImageBase64 = null;
let verificationResult = null; 
let isProcessingOCR = false;
let isLoadingJobs = false; 

// 🟢 เพิ่มตัวแปรสำหรับโหมดแจ้งงานเสีย
let isDefectMode = false; 

// เพิ่มตัวแปรเพื่อเก็บค่าที่ AI อ่านได้
let extractedModel = "";
let extractedLot = "";
let extractedDate = "";
let extractedQty = "";
