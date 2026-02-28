// ==========================================
// CONFIGURATION
// ==========================================
// ⚠️ นำ URL ของ Google Apps Script Web App มาใส่ตรงนี้ ⚠️
const API_URL = "https://script.google.com/macros/s/AKfycbzW5QPUcGiI-I5xww5d465M8WhBRBO5iog6xtCv5IskedBs9CAm4Q_fszHkxr-f7tCazw/exec";

// ==========================================
// STATE MANAGEMENT (ตัวแปรส่วนกลางทั้งหมด)
// ==========================================
let currentUser = null; 
let dbJobs = []; 
let dbTickets = []; 

let currentTab = 'inbox'; 
let selectedTicket = null;
let currentSelectedJob = null;

let stream = null;
let capturedImageBase64 = null;
let verificationResult = null; 
let isProcessingOCR = false;
let isLoadingJobs = false; 

// เพิ่มตัวแปรเพื่อเก็บค่าที่ AI อ่านได้
let extractedModel = "";
let extractedLot = "";
let extractedDate = "";
