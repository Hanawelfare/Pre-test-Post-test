/**
 * Google Apps Script for Pre-test / Post-test Examination System
 * Link Sheets: https://docs.google.com/spreadsheets/d/1tmgXgn_inkEabJ5LzRLMa-zDLOf7hTW3CxGWKPPdu9I/edit
 */

function doGet(e) {
  var action = e ? e.parameter.action : 'getEmployees';
  
  if (action === 'getEmployees' || !action) {
    return getEmployeesData();
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Pre-Post Test API Service is running."
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("ผลการสอบ") || ss.getSheetByName("Test Results");
    
    // Create sheet if not exists
    if (!sheet) {
      sheet = ss.insertSheet("ผลการสอบ");
      var headers = [
        "วัน-เวลาที่ส่งสอบ", 
        "รหัสพนักงาน", 
        "ชื่อ-นามสกุล", 
        "แผนก", 
        "ประเภทข้อสอบ", 
        "คะแนนที่ได้", 
        "คะแนนเต็ม", 
        "คิดเป็น %", 
        "ผลการสอบ",
        "รายละเอียดตอบคำถาม"
      ];
      sheet.appendRow(headers);
      
      // Style Header
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
    }
    
    var timestamp = new Date();
    var passFailText = data.isPassed ? "ผ่าน (PASS)" : "ไม่ผ่าน (FAIL)";
    var scorePercentage = ((data.score / (data.maxScore || 20)) * 100).toFixed(1) + "%";
    var answersSummary = data.answers ? JSON.stringify(data.answers) : "";
    
    var empIdStr = (data.empId || "").toString().trim();
    
    sheet.appendRow([
      timestamp,
      "'" + empIdStr, // Forced string with apostrophe to keep leading zeros (e.g. '084843)
      data.fullName || "",
      data.department || "",
      data.testType || "Pre-test",
      data.score,
      data.maxScore || 20,
      scorePercentage,
      passFailText,
      answersSummary
    ]);
    
    var lastRow = sheet.getLastRow();
    
    // Format Employee ID Column as Text to preserve leading zeros
    sheet.getRange(lastRow, 2).setNumberFormat("@");
    sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    
    // Highlight Pass/Fail
    var statusCell = sheet.getRange(lastRow, 9);
    if (data.isPassed) {
      statusCell.setBackground("#dcfce7").setFontColor("#166534");
    } else {
      statusCell.setBackground("#fee2e2").setFontColor("#991b1b");
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Recorded test result successfully",
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getEmployeesData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Get Employee Database from "Name" sheet
  var sheet = ss.getSheetByName("Name") || ss.getSheetByName("sheet1") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var employees = [];
  if (data.length > 0) {
    var headers = data[0].map(function(h) { return h.toString().toLowerCase().trim(); });
    
    var empIdCol = -1, nameCol = -1, deptCol = -1;
    headers.forEach(function(h, idx) {
      if (h.includes("รหัส") || h.includes("code") || h.includes("id") || h.includes("emp")) empIdCol = idx;
      else if (h.includes("ชื่อ") || h.includes("name") || h.includes("นามสกุล")) nameCol = idx;
      else if (h.includes("แผนก") || h.includes("ฝ่าย") || h.includes("department") || h.includes("dept")) deptCol = idx;
    });
    
    if (empIdCol === -1) empIdCol = 0;
    if (nameCol === -1) nameCol = 1;
    if (deptCol === -1) deptCol = 2;
    
    var startRow = (headers.some(function(h){ return h.includes("รหัส") || h.includes("ชื่อ"); })) ? 1 : 0;
    
    for (var i = startRow; i < data.length; i++) {
      var row = data[i];
      if (row[empIdCol] !== undefined && row[empIdCol] !== null && row[empIdCol].toString().trim() !== "") {
        var rawId = row[empIdCol].toString().trim();
        
        // If numeric like 84843, pad with leading zeros if 6 digits format
        if (/^\d{1,5}$/.test(rawId)) {
          // pad to 6 digits if needed e.g. 84843 -> 084843
          while (rawId.length < 6) rawId = "0" + rawId;
        }

        employees.push({
          empId: rawId,
          fullName: row[nameCol] ? row[nameCol].toString().trim() : "",
          department: row[deptCol] ? row[deptCol].toString().trim() : ""
        });
      }
    }
  }

  // 2. Also fetch past test submissions from "ผลการสอบ" sheet so all devices know who completed Pre-test!
  var submissions = [];
  var resultsSheet = ss.getSheetByName("ผลการสอบ") || ss.getSheetByName("Test Results");
  if (resultsSheet) {
    var resData = resultsSheet.getDataRange().getValues();
    if (resData.length > 1) {
      for (var j = 1; j < resData.length; j++) {
        var r = resData[j];
        var idVal = r[1] ? r[1].toString().trim() : "";
        if (idVal) {
          submissions.push({
            timestamp: r[0],
            empId: idVal,
            fullName: r[2] || "",
            department: r[3] || "",
            testType: r[4] || "Pre-test",
            score: r[5],
            maxScore: r[6] || 20,
            percentage: r[7],
            isPassed: (r[8] || "").toString().includes("ผ่าน")
          });
        }
      }
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    sheetUsed: sheet.getName(),
    totalFound: employees.length,
    employees: employees,
    submissions: submissions
  })).setMimeType(ContentService.MimeType.JSON);
}
