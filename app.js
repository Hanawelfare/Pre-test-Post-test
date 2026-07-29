/**
 * Main Application Controller & UI Handler
 * Pre-test & Post-test Examination System
 */

// 📌 Web App URL จาก Google Apps Script สำหรับ พนักงานทุกคนใช้งานร่วมกันอัตโนมัติ
const DEFAULT_GS_URL = "https://script.google.com/macros/s/AKfycbwvYgRcvzKO7pdGhcGXgrUFF3XW2ENMhhulJlrWJuCHu_pyrVTKMzEWOme_fmVc5L5L/exec";

// 📌 รหัสผ่านผู้ดูแลระบบ (Admin Password)
const ADMIN_PASSWORD = "089151";

document.addEventListener('DOMContentLoaded', () => {
  // Elements Reference
  const screenLogin = document.getElementById('screen-login');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResult = document.getElementById('screen-result');
  const screenAdmin = document.getElementById('screen-admin');

  // Mode Switch Tabs
  const tabEmployeeMode = document.getElementById('tab-employee-mode');
  const tabAdminMode = document.getElementById('tab-admin-mode');
  const viewEmployeeLogin = document.getElementById('view-employee-login');
  const viewAdminLogin = document.getElementById('view-admin-login');

  // Employee Form Elements
  const formLogin = document.getElementById('form-login');
  const inputEmpId = document.getElementById('input-emp-id');
  const inputFullName = document.getElementById('input-fullname');
  const inputDepartment = document.getElementById('input-department');
  const autofillNameTag = document.getElementById('autofill-badge-name');
  const autofillDeptTag = document.getElementById('autofill-badge-dept');
  const lookupSpinner = document.getElementById('lookup-spinner');

  // Test Type Radios & Badges
  const radioPreTest = document.getElementById('radio-pre-test');
  const radioPostTest = document.getElementById('radio-post-test');
  const typePreLabel = document.getElementById('type-pre-label');
  const typePostLabel = document.getElementById('type-post-label');
  const badgePreDone = document.getElementById('badge-pre-done');
  const badgePostDone = document.getElementById('badge-post-done');
  const pretestCompletedNotice = document.getElementById('pretest-completed-notice');

  // Admin Form Elements
  const formAdminLogin = document.getElementById('form-admin-login');
  const inputAdminPass = document.getElementById('input-admin-pass');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const btnAdminOpenEditor = document.getElementById('btn-admin-open-editor');
  
  // Admin Dashboard Filter Elements
  const admTotalTakers = document.getElementById('adm-total-takers');
  const admPassCount = document.getElementById('adm-pass-count');
  const admFailCount = document.getElementById('adm-fail-count');
  const admAvgScore = document.getElementById('adm-avg-score');
  const admMetricsTitle = document.getElementById('adm-metrics-title');

  const admSearchInput = document.getElementById('adm-search-input');
  const admFilterType = document.getElementById('adm-filter-type');
  const admFilterStatus = document.getElementById('adm-filter-status');
  const admTableBody = document.getElementById('adm-table-body');
  const btnAdminExportCsv = document.getElementById('btn-admin-export-csv');

  // Quiz Screen Elements
  const quizUserName = document.getElementById('quiz-user-name');
  const quizUserDept = document.getElementById('quiz-user-dept');
  const quizProgressNum = document.getElementById('quiz-progress-num');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  
  const qNumberLabel = document.getElementById('q-number-label');
  const qStatusTag = document.getElementById('q-status-tag');
  const qTextBody = document.getElementById('q-text-body');
  const qOptionsContainer = document.getElementById('q-options-container');
  const btnClearAnswer = document.getElementById('btn-clear-answer');
  const answeredCountBadge = document.getElementById('answered-count-badge');

  const btnPrevQ = document.getElementById('btn-prev-q');
  const btnNextQ = document.getElementById('btn-next-q');
  const btnSubmitExam = document.getElementById('btn-submit-exam');
  
  const btnToggleMatrix = document.getElementById('btn-toggle-matrix');
  const questionMatrixPanel = document.getElementById('question-matrix-panel');
  const matrixButtonsContainer = document.getElementById('matrix-buttons-container');

  // Result Elements
  const resultStatusIcon = document.getElementById('result-status-icon');
  const resultTitle = document.getElementById('result-title');
  const resultSubtitle = document.getElementById('result-subtitle');
  const resScoreValue = document.getElementById('res-score-value');
  const resScorePercent = document.getElementById('res-score-percent');
  
  const syncStatusBox = document.getElementById('sync-status-box');
  const syncIcon = document.getElementById('sync-icon');
  const syncStatusText = document.getElementById('sync-status-text');

  const statCorrectCount = document.getElementById('stat-correct-count');
  const statWrongCount = document.getElementById('stat-wrong-count');
  const statUnansweredCount = document.getElementById('stat-unanswered-count');
  const statCorrectSub = document.getElementById('stat-correct-sub');
  const statWrongSub = document.getElementById('stat-wrong-sub');
  const statUnansweredSub = document.getElementById('stat-unanswered-sub');
  
  const btnRestartExam = document.getElementById('btn-restart-exam');
  const btnToggleReview = document.getElementById('btn-toggle-review');
  const reviewSection = document.getElementById('review-section');
  const reviewCardsList = document.getElementById('review-cards-list');

  // Settings & Modals
  const btnConfigGs = document.getElementById('btn-config-gs');
  const gsStatusLabel = document.getElementById('gs-status-label');
  const modalGsConfig = document.getElementById('modal-gs-config');
  const btnCloseGsModal = document.getElementById('btn-close-gs-modal');
  const inputGsUrl = document.getElementById('input-gs-url');
  const btnSaveGs = document.getElementById('btn-save-gs');
  const btnTestGs = document.getElementById('btn-test-gs');

  const modalAdminEditor = document.getElementById('modal-admin-editor');
  const btnCloseAdminModal = document.getElementById('btn-close-admin-modal');
  const adminQuestionsList = document.getElementById('admin-questions-list');
  const btnSaveQuestions = document.getElementById('btn-save-questions');
  const btnResetQuestions = document.getElementById('btn-reset-questions');
  const btnExportJson = document.getElementById('btn-export-json');

  // App Configuration State (Defaults to DEFAULT_GS_URL)
  let googleScriptUrl = localStorage.getItem('pre_post_test_gs_url') || DEFAULT_GS_URL;

  // Initialize
  initApp();

  function initApp() {
    updateGsStatusBadge();
    bindEvents();
    fetchEmployeesFromGoogleSheet();

    // Ensure modals and admin config button are hidden on load
    modalGsConfig.classList.add('hidden');
    modalAdminEditor.classList.add('hidden');
    btnConfigGs.classList.add('hidden');
  }

  function updateGsStatusBadge() {
    if (googleScriptUrl) {
      gsStatusLabel.textContent = "Google Sheet Sync Active";
      btnConfigGs.classList.remove('btn-outline');
      btnConfigGs.classList.add('btn-success');
    } else {
      gsStatusLabel.textContent = "ตั้งค่า Google Sheet";
      btnConfigGs.classList.add('btn-outline');
      btnConfigGs.classList.remove('btn-success');
    }
  }

  function bindEvents() {
    // Mode Switch Tabs (Employee vs Admin)
    tabEmployeeMode.addEventListener('click', () => {
      tabEmployeeMode.classList.add('active');
      tabAdminMode.classList.remove('active');
      viewEmployeeLogin.classList.remove('hidden');
      viewAdminLogin.classList.add('hidden');
    });

    tabAdminMode.addEventListener('click', () => {
      tabAdminMode.classList.add('active');
      tabEmployeeMode.classList.remove('active');
      viewAdminLogin.classList.remove('hidden');
      viewEmployeeLogin.classList.add('hidden');
    });

    // Admin Password Login (Password: 089151)
    formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = inputAdminPass.value.trim();
      if (pass === ADMIN_PASSWORD) {
        inputAdminPass.value = '';
        renderAdminDashboard();
        switchScreen(screenAdmin);
      } else {
        alert("รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง!");
      }
    });

    btnAdminLogout.addEventListener('click', () => {
      switchScreen(screenLogin);
    });

    btnAdminOpenEditor.addEventListener('click', () => {
      renderAdminEditorList();
      modalAdminEditor.classList.remove('hidden');
    });

    // Admin Filters & Search
    admSearchInput.addEventListener('input', filterAdminDashboardTable);
    admFilterType.addEventListener('change', filterAdminDashboardTable);
    admFilterStatus.addEventListener('change', filterAdminDashboardTable);
    btnAdminExportCsv.addEventListener('click', exportDashboardCsv);

    // Radio Test Type Styling Toggle
    document.querySelectorAll('input[name="testType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        typePreLabel.classList.toggle('active', e.target.value === 'Pre-test');
        typePostLabel.classList.toggle('active', e.target.value === 'Post-test');
      });
    });

    // Employee ID Auto-fill Lookup on blur / typing pause
    let lookupTimeout;
    inputEmpId.addEventListener('input', () => {
      clearTimeout(lookupTimeout);
      lookupTimeout = setTimeout(performEmpLookup, 400);
    });
    inputEmpId.addEventListener('blur', performEmpLookup);

    // Form Login Submit -> Start Exam
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      startExam();
    });

    // Quiz Controls
    btnPrevQ.addEventListener('click', () => {
      if (quizEngine.currentQuestionIndex > 0) {
        quizEngine.currentQuestionIndex--;
        renderCurrentQuestion();
      }
    });

    btnNextQ.addEventListener('click', () => {
      if (quizEngine.currentQuestionIndex < quizEngine.activeExamQuestions.length - 1) {
        quizEngine.currentQuestionIndex++;
        renderCurrentQuestion();
      }
    });

    btnClearAnswer.addEventListener('click', () => {
      const q = quizEngine.getCurrentQuestion();
      quizEngine.clearAnswer(q.id);
      renderCurrentQuestion();
    });

    btnSubmitExam.addEventListener('click', submitExamConfirmation);

    btnToggleMatrix.addEventListener('click', () => {
      questionMatrixPanel.classList.toggle('hidden');
    });

    // Results Screen Controls
    btnRestartExam.addEventListener('click', () => {
      switchScreen(screenLogin);
    });

    btnToggleReview.addEventListener('click', () => {
      reviewSection.classList.toggle('hidden');
      if (!reviewSection.classList.contains('hidden')) {
        reviewSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // GS Config Modal
    btnConfigGs.addEventListener('click', () => {
      inputGsUrl.value = googleScriptUrl;
      modalGsConfig.classList.remove('hidden');
    });

    btnCloseGsModal.addEventListener('click', () => {
      modalGsConfig.classList.add('hidden');
    });

    btnSaveGs.addEventListener('click', () => {
      googleScriptUrl = inputGsUrl.value.trim() || DEFAULT_GS_URL;
      localStorage.setItem('pre_post_test_gs_url', googleScriptUrl);
      updateGsStatusBadge();
      modalGsConfig.classList.add('hidden');
      alert("บันทึก URL ของ Google Apps Script เรียบร้อยแล้ว");
      fetchEmployeesFromGoogleSheet();
    });

    btnTestGs.addEventListener('click', async () => {
      const testUrl = inputGsUrl.value.trim() || googleScriptUrl;
      if (!testUrl) {
        alert("กรุณาระบุ URL ก่อนทดสอบ");
        return;
      }
      try {
        const resp = await fetch(`${testUrl}?action=getEmployees`);
        const data = await resp.json();
        if (data.status === 'success') {
          alert(`เชื่อมต่อสำเร็จ! พบข้อมูลพนักงาน ${data.employees ? data.employees.length : 0} รายการ`);
        } else {
          alert(`เชื่อมต่อได้ แต่ตอบกลับรูปแบบไม่สมบูรณ์: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}\nโปรดตรวจสอบว่าได้ตั้งค่า Web app เป็น Executed as: Me และ Anyone can access หรือยัง`);
      }
    });

    // Admin Editor Modal
    btnCloseAdminModal.addEventListener('click', () => {
      modalAdminEditor.classList.add('hidden');
    });

    btnSaveQuestions.addEventListener('click', saveAdminQuestions);
    btnResetQuestions.addEventListener('click', () => {
      if (confirm("คุณต้องการคืนค่าคำถามเริ่มต้นทั้ง 20 ข้อใช่หรือไม่?")) {
        quizEngine.resetDefaultQuestions();
        renderAdminEditorList();
        alert("คืนค่าคำถามเริ่มต้นเรียบร้อยแล้ว");
      }
    });

    btnExportJson.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizEngine.questions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "questions.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Employee Auto-fill lookup logic & Pre-test completed detection
  async function performEmpLookup() {
    const empId = inputEmpId.value.trim();
    if (!empId) {
      hideAutofillTags();
      resetPreTestOption();
      return;
    }

    lookupSpinner.classList.remove('hidden');

    // Fetch fresh Google Sheet data on lookup to ensure 100% sync
    await fetchEmployeesFromGoogleSheet();

    const match = quizEngine.lookupEmployee(empId);

    lookupSpinner.classList.add('hidden');
    if (match) {
      inputFullName.value = match.fullName;
      inputDepartment.value = match.department;
      autofillNameTag.classList.remove('hidden');
      autofillDeptTag.classList.remove('hidden');
    } else {
      hideAutofillTags();
    }

    // Check if this employee has already completed Pre-test in Google Sheet
    checkPreTestStatus(empId);
  }

  function checkPreTestStatus(empId) {
    const preDone = quizEngine.hasCompletedPreTest(empId);
    const postDone = quizEngine.hasCompletedPostTest(empId);

    if (preDone) {
      // Disable Pre-test button & grey out
      radioPreTest.disabled = true;
      typePreLabel.style.opacity = '0.55';
      typePreLabel.style.cursor = 'not-allowed';
      badgePreDone.classList.remove('hidden');

      // Auto select Post-test
      radioPostTest.checked = true;
      typePostLabel.classList.add('active');
      typePreLabel.classList.remove('active');
      pretestCompletedNotice.classList.remove('hidden');
    } else {
      resetPreTestOption();
    }

    if (postDone) {
      badgePostDone.classList.remove('hidden');
    } else {
      badgePostDone.classList.add('hidden');
    }
  }

  function resetPreTestOption() {
    radioPreTest.disabled = false;
    typePreLabel.style.opacity = '1';
    typePreLabel.style.cursor = 'pointer';
    badgePreDone.classList.add('hidden');
    pretestCompletedNotice.classList.add('hidden');
    
    radioPreTest.checked = true;
    typePreLabel.classList.add('active');
    typePostLabel.classList.remove('active');
  }

  function hideAutofillTags() {
    autofillNameTag.classList.add('hidden');
    autofillDeptTag.classList.add('hidden');
  }

  async function fetchEmployeesFromGoogleSheet() {
    if (!googleScriptUrl) return;
    try {
      const resp = await fetch(`${googleScriptUrl}?action=getEmployees`);
      const data = await resp.json();
      if (data.status === 'success') {
        if (data.employees) {
          quizEngine.updateEmployeeDatabase(data.employees);
        }
        // 100% sync: Update submissions log directly from Google Sheet
        quizEngine.syncSubmissionsLog(data.submissions || []);
      }
    } catch (e) {
      console.warn("Could not fetch employees from Google Sheet URL", e);
    }
  }

  // Screen Switcher
  function switchScreen(targetScreen) {
    [screenLogin, screenQuiz, screenResult, screenAdmin].forEach(s => s.classList.add('hidden'));
    targetScreen.classList.remove('hidden');

    // 📌 แสดงปุ่ม Google Sheet Sync เฉพาะเวลาที่อยู่ในหน้าผู้ดูแลระบบ (Admin) เท่านั้น
    if (targetScreen === screenAdmin) {
      btnConfigGs.classList.remove('hidden');
    } else {
      btnConfigGs.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Start Exam Flow
  function startExam() {
    const testType = document.querySelector('input[name="testType"]:checked').value;
    const empId = inputEmpId.value.trim();
    const fullName = inputFullName.value.trim();
    const department = inputDepartment.value.trim();

    if (!empId || !fullName || !department) {
      alert("กรุณากรอกข้อมูลรหัสพนักงาน ชื่อ-นามสกุล และแผนกให้ครบถ้วนก่อนเข้าสอบ");
      return;
    }

    const userInfo = { empId, fullName, department, testType };
    quizEngine.startNewExam(userInfo);

    // Set Header User Info
    quizUserName.textContent = fullName;
    quizUserDept.innerHTML = `${department} (รหัส: ${empId}) | <span class="badge-pill ${testType === 'Pre-test' ? 'bg-primary-soft' : 'bg-success'}">${testType}</span>`;

    // Render Matrix Grid
    renderMatrixButtons();

    // Render Question
    renderCurrentQuestion();

    switchScreen(screenQuiz);
  }

  function renderMatrixButtons() {
    matrixButtonsContainer.innerHTML = '';
    quizEngine.activeExamQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-matrix';
      btn.textContent = idx + 1;
      btn.addEventListener('click', () => {
        quizEngine.currentQuestionIndex = idx;
        renderCurrentQuestion();
        questionMatrixPanel.classList.add('hidden');
      });
      matrixButtonsContainer.appendChild(btn);
    });
  }

  function renderCurrentQuestion() {
    const q = quizEngine.getCurrentQuestion();
    const totalQ = quizEngine.activeExamQuestions.length;
    const currIdx = quizEngine.currentQuestionIndex;

    // Update Progress
    quizProgressNum.textContent = `${currIdx + 1} / ${totalQ}`;
    quizProgressFill.style.width = `${((currIdx + 1) / totalQ) * 100}%`;

    // Question Labels
    qNumberLabel.textContent = `ข้อที่ ${currIdx + 1} จาก ${totalQ}`;
    qTextBody.textContent = `${currIdx + 1}. ${q.question}`;

    const isAnswered = quizEngine.userAnswers[q.id] !== undefined;
    if (isAnswered) {
      qStatusTag.className = 'status-answered-tag is-done';
      qStatusTag.innerHTML = `<i class="fa-solid fa-circle-check"></i> ตอบแล้ว`;
      btnClearAnswer.classList.remove('hidden');
    } else {
      qStatusTag.className = 'status-answered-tag';
      qStatusTag.innerHTML = `<i class="fa-regular fa-circle"></i> ยังไม่ได้ตอบ`;
      btnClearAnswer.classList.add('hidden');
    }

    // Render Radio Options
    qOptionsContainer.innerHTML = '';
    q.options.forEach(opt => {
      const optionBtn = document.createElement('div');
      optionBtn.className = 'option-btn';
      if (quizEngine.userAnswers[q.id] === opt.value) {
        optionBtn.classList.add('selected');
      }

      optionBtn.innerHTML = `
        <div class="option-badge">
          ${opt.value ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>'}
        </div>
        <span>${opt.text}</span>
      `;

      optionBtn.addEventListener('click', () => {
        quizEngine.setAnswer(q.id, opt.value);
        renderCurrentQuestion();
        updateMatrixStates();
      });

      qOptionsContainer.appendChild(optionBtn);
    });

    // Update Answered Badge Count
    const count = quizEngine.getAnsweredCount();
    answeredCountBadge.textContent = `ตอบแล้ว ${count}/${totalQ} ข้อ`;

    // Navigation Buttons
    btnPrevQ.disabled = currIdx === 0;
    if (currIdx === totalQ - 1) {
      btnNextQ.classList.add('hidden');
      btnSubmitExam.classList.remove('hidden');
    } else {
      btnNextQ.classList.remove('hidden');
      btnSubmitExam.classList.add('hidden');
    }

    updateMatrixStates();
  }

  function updateMatrixStates() {
    const btns = matrixButtonsContainer.querySelectorAll('.btn-matrix');
    quizEngine.activeExamQuestions.forEach((q, idx) => {
      const btn = btns[idx];
      if (!btn) return;

      btn.classList.remove('current', 'answered');
      if (idx === quizEngine.currentQuestionIndex) {
        btn.classList.add('current');
      }
      if (quizEngine.userAnswers[q.id] !== undefined) {
        btn.classList.add('answered');
      }
    });
  }

  function submitExamConfirmation() {
    const answeredCount = quizEngine.getAnsweredCount();
    const totalQ = quizEngine.activeExamQuestions.length;

    let confirmMsg = `คุณได้ตอบข้อสอบไปแล้ว ${answeredCount} จาก ${totalQ} ข้อ\nต้องการยืนยันการส่งข้อสอบหรือไม่?`;
    if (answeredCount < totalQ) {
      confirmMsg += `\n\n⚠️ มีอีก ${totalQ - answeredCount} ข้อที่คุณยังไม่ได้ตอบ (ข้อที่ไม่ตอบจะได้ 0 คะแนน)`;
    }

    if (confirm(confirmMsg)) {
      processExamSubmission();
    }
  }

  // Calculate score and post to Google Sheets & local log
  async function processExamSubmission() {
    const scoreResult = quizEngine.calculateScore();

    // Record submission entry in local log
    const submissionRecord = {
      timestamp: new Date().toLocaleString('th-TH'),
      empId: quizEngine.currentUser.empId,
      fullName: quizEngine.currentUser.fullName,
      department: quizEngine.currentUser.department,
      testType: quizEngine.currentUser.testType,
      score: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      percentage: scoreResult.percentage,
      isPassed: scoreResult.isPassed
    };
    quizEngine.recordSubmission(submissionRecord);

    renderResultsScreen(scoreResult);
    switchScreen(screenResult);

    // Send payload to Google Sheets
    await sendResultToGoogleSheets(scoreResult);
  }

  function renderResultsScreen(result) {
    if (result.isPassed) {
      resultStatusIcon.className = 'result-badge-icon pass';
      resultStatusIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
      resultTitle.textContent = `ผลการสอบ: ผ่านเกณฑ์ (PASS)`;
      resultSubtitle.textContent = `ยินดีด้วย! คุณผ่านเกณฑ์การทดสอบด้วยคะแนน ${result.totalScore} คะแนน`;
    } else {
      resultStatusIcon.className = 'result-badge-icon fail';
      resultStatusIcon.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
      resultTitle.textContent = `ผลการสอบ: ไม่ผ่านเกณฑ์ (FAIL)`;
      resultSubtitle.textContent = `คุณทำคะแนนได้น้อยกว่าเกณฑ์ที่กำหนด (ต้องได้ ${result.passThreshold} คะแนนขึ้นไป)`;
    }

    resScoreValue.textContent = result.totalScore;
    resScorePercent.textContent = `${result.percentage}%`;

    statCorrectCount.textContent = `${result.correctCount} ข้อ`;
    statWrongCount.textContent = `${result.wrongCount} ข้อ`;
    statUnansweredCount.textContent = `${result.unansweredCount} ข้อ`;

    if (statCorrectSub) statCorrectSub.textContent = `ตอบถูก (+${result.correctCount} คะแนน)`;
    if (statWrongSub) statWrongSub.textContent = `ตอบผิด (-${result.wrongCount} คะแนน)`;
    if (statUnansweredSub) statUnansweredSub.textContent = `ไม่ได้ตอบ (0 คะแนน)`;

    renderReviewSection(result.details);
  }

  function renderReviewSection(details) {
    reviewCardsList.innerHTML = '';
    details.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = `review-item-card ${item.status}`;

      let scoreBadgeHtml = '';
      if (item.status === 'correct') {
        scoreBadgeHtml = `<span class="review-score-badge bg-success">+1 คะแนน</span>`;
      } else if (item.status === 'wrong') {
        scoreBadgeHtml = `<span class="review-score-badge bg-danger">-1 คะแนน</span>`;
      } else {
        scoreBadgeHtml = `<span class="review-score-badge bg-neutral">0 คะแนน (ข้าม)</span>`;
      }

      const formatAnswer = (val) => {
        if (val === true) return '<strong class="text-primary">ถูก</strong>';
        if (val === false) return '<strong class="text-primary">ผิด</strong>';
        return '<span class="text-muted">ไม่ได้ตอบ</span>';
      };

      card.innerHTML = `
        <div class="review-item-header">
          <span class="review-q-num">ข้อที่ ${idx + 1}</span>
          ${scoreBadgeHtml}
        </div>
        <div class="review-q-text">${item.questionText}</div>
        <div class="review-answers-compare">
          <div>คำตอบของคุณ: ${formatAnswer(item.userAnswer)}</div>
          <div>เฉลยที่ถูกต้อง: ${formatAnswer(item.correctAnswer)}</div>
        </div>
        <div class="review-explanation">
          <i class="fa-solid fa-circle-info"></i> <strong>คำอธิบาย:</strong> ${item.explanation}
        </div>
      `;

      reviewCardsList.appendChild(card);
    });
  }

  async function sendResultToGoogleSheets(result) {
    if (!googleScriptUrl) {
      syncStatusBox.className = 'sync-status-bar';
      syncIcon.className = 'fa-solid fa-circle-info';
      syncStatusText.textContent = 'บันทึกผลสอบลงระบบเรียบร้อยแล้ว (แอดมินดูผลได้ใน Admin Portal)';
      return;
    }

    syncStatusBox.className = 'sync-status-bar';
    syncIcon.className = 'fa-solid fa-sync fa-spin';
    syncStatusText.textContent = 'กำลังส่งผลสอบไปยัง Google Sheet เรียบร้อยในแบบ Real-time...';

    const payload = {
      empId: quizEngine.currentUser.empId,
      fullName: quizEngine.currentUser.fullName,
      department: quizEngine.currentUser.department,
      testType: quizEngine.currentUser.testType,
      score: result.totalScore,
      maxScore: result.maxScore,
      isPassed: result.isPassed,
      answers: result.details.map(d => ({ q: d.questionId, ans: d.userAnswer, score: d.itemScore }))
    };

    try {
      const resp = await fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const res = await resp.json();
      if (res.status === 'success') {
        syncStatusBox.className = 'sync-status-bar success';
        syncIcon.className = 'fa-solid fa-circle-check';
        syncStatusText.textContent = 'บันทึกข้อมูลลง Google Sheet เรียบร้อยแล้ว ✓';
      } else {
        throw new Error(res.message || "Unknown error");
      }
    } catch (e) {
      console.error("Google Sheets POST Error:", e);
      syncStatusBox.className = 'sync-status-bar';
      syncIcon.className = 'fa-solid fa-triangle-exclamation text-warning';
      syncStatusText.textContent = 'บันทึกผลการสอบลงระบบแอดมินเรียบร้อยแล้ว';
    }
  }

  // ADMIN DASHBOARD CONTROLLER & RENDERER (STRICT 1 EMP ID = 1 PERSON COUNT & ATTEMPT TRACKING)
  function renderAdminDashboard() {
    filterAdminDashboardTable();
  }

  function filterAdminDashboardTable() {
    const search = admSearchInput.value.trim().toLowerCase();
    const typeFilter = admFilterType.value;
    const statusFilter = admFilterStatus.value;

    // Filter table rows matching current search/filter
    const filteredRows = quizEngine.submissionsLog.filter(item => {
      const matchSearch = !search || 
        (item.empId && item.empId.toLowerCase().includes(search)) ||
        (item.fullName && item.fullName.toLowerCase().includes(search)) ||
        (item.department && item.department.toLowerCase().includes(search));

      const isPass = (typeof item.score === 'number' ? item.score >= 14 : item.isPassed);

      const matchType = typeFilter === 'ALL' || item.testType === typeFilter;
      const matchStatus = statusFilter === 'ALL' || 
        (statusFilter === 'PASS' && isPass) ||
        (statusFilter === 'FAIL' && !isPass);

      return matchSearch && matchType && matchStatus;
    });

    // 📌 Calculate UNIQUE Employee Stats STRICTLY (1 รหัสพนักงาน = 1 คน)
    // Group filtered records STRICTLY by clean employee ID (store latest submission for that employee)
    const uniqueEmpMap = new Map();
    filteredRows.forEach(item => {
      const cleanId = quizEngine.cleanEmpId(item.empId);
      if (!cleanId) return;
      
      // Store latest submission per employee ID
      if (!uniqueEmpMap.has(cleanId)) {
        uniqueEmpMap.set(cleanId, item);
      }
    });

    const uniqueEmployeesList = Array.from(uniqueEmpMap.values());
    const totalUnique = uniqueEmployeesList.length;
    const passCount = uniqueEmployeesList.filter(l => (typeof l.score === 'number' ? l.score >= 14 : l.isPassed)).length;
    const failCount = totalUnique - passCount;
    const passPercent = totalUnique > 0 ? ((passCount / totalUnique) * 100).toFixed(1) : '0.0';
    const failPercent = totalUnique > 0 ? ((failCount / totalUnique) * 100).toFixed(1) : '0.0';
    const avgScore = totalUnique > 0 ? (uniqueEmployeesList.reduce((sum, l) => sum + (l.score || 0), 0) / totalUnique).toFixed(1) : '0.0';

    // Update Header Metric Title Badge
    if (admMetricsTitle) {
      if (typeFilter === 'Pre-test') {
        admMetricsTitle.className = "badge-pill bg-primary-soft text-primary";
        admMetricsTitle.innerHTML = `<i class="fa-solid fa-file-signature"></i> สรุปผล Pre-test (นับ 1 รหัสพนักงาน = 1 คน)`;
      } else if (typeFilter === 'Post-test') {
        admMetricsTitle.className = "badge-pill bg-success text-white";
        admMetricsTitle.innerHTML = `<i class="fa-solid fa-award"></i> สรุปผล Post-test (นับ 1 รหัสพนักงาน = 1 คน)`;
      } else {
        admMetricsTitle.className = "badge-pill bg-primary-soft text-primary";
        admMetricsTitle.innerHTML = `<i class="fa-solid fa-chart-pie"></i> สรุปผลการสอบรวม (นับ 1 รหัสพนักงาน = 1 คน)`;
      }
    }

    // Update Top 4 Metric Cards (Strict 1 Emp ID = 1 Person)
    if (admTotalTakers) admTotalTakers.textContent = `${totalUnique} คน`;
    if (admPassCount) admPassCount.textContent = `${passCount} คน (${passPercent}%)`;
    if (admFailCount) admFailCount.textContent = `${failCount} คน (${failPercent}%)`;
    if (admAvgScore) admAvgScore.textContent = `${avgScore} / 20`;

    renderAdminTableRows(filteredRows);
  }

  function renderAdminTableRows(records) {
    admTableBody.innerHTML = '';
    if (records.length === 0) {
      admTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center" style="padding: 2rem; color: #94a3b8;">
            <i class="fa-solid fa-inbox" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
            ยังไม่มีข้อมูลผลการสอบที่บันทึกไว้ในระบบ
          </td>
        </tr>
      `;
      return;
    }

    records.forEach(rec => {
      const tr = document.createElement('tr');
      // FOOLPROOF SCORE CHECK: Score >= 14 is PASS, Score < 14 is FAIL
      const isPass = (typeof rec.score === 'number' ? rec.score >= 14 : rec.isPassed);
      const calcPercent = (typeof rec.score === 'number' ? Math.round((rec.score / (rec.maxScore || 20)) * 100) : rec.percentage);

      const attemptNum = rec.attemptNumber || 1;
      let attemptBadgeClass = "bg-neutral text-muted";
      let attemptText = `รอบที่ ${attemptNum}`;
      if (isPass) {
        attemptBadgeClass = "bg-success text-white";
        attemptText = `รอบที่ ${attemptNum} (ผ่าน 🎉)`;
      } else if (attemptNum > 1) {
        attemptBadgeClass = "bg-warning text-dark";
        attemptText = `รอบที่ ${attemptNum} (ทำซ้ำ)`;
      }

      const statusBadge = isPass 
        ? `<span class="badge-status-pass">ผ่าน (PASS)</span>`
        : `<span class="badge-status-fail">ไม่ผ่าน (FAIL)</span>`;

      tr.innerHTML = `
        <td>${rec.timestamp || '-'}</td>
        <td><strong>${rec.empId || '-'}</strong></td>
        <td>${rec.fullName || '-'}</td>
        <td>${rec.department || '-'}</td>
        <td><span class="badge-pill ${rec.testType === 'Pre-test' ? 'bg-primary-soft' : 'bg-success'}">${rec.testType}</span></td>
        <td><strong>${rec.score}</strong> / ${rec.maxScore || 20}</td>
        <td>${calcPercent}%</td>
        <td><span class="badge-pill ${attemptBadgeClass}">${attemptText}</span></td>
        <td>${statusBadge}</td>
      `;
      admTableBody.appendChild(tr);
    });
  }

  function exportDashboardCsv() {
    const logs = quizEngine.submissionsLog;
    if (logs.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }

    let csvContent = "\uFEFFวัน-เวลา,รหัสพนักงาน,ชื่อ-นามสกุล,แผนก,ประเภทข้อสอบ,คะแนนที่ได้,คะแนนเต็ม,คิดเป็น %,รอบที่สอบ,ผลการสอบ\n";
    logs.forEach(l => {
      const isPass = (typeof l.score === 'number' ? l.score >= 14 : l.isPassed);
      const calcPercent = (typeof l.score === 'number' ? Math.round((l.score / (l.maxScore || 20)) * 100) : l.percentage);
      const attemptNum = l.attemptNumber || 1;
      csvContent += `"${l.timestamp}","${l.empId}","${l.fullName}","${l.department}","${l.testType}",${l.score},${l.maxScore || 20},"${calcPercent}%","รอบที่ ${attemptNum}","${isPass ? 'ผ่าน' : 'ไม่ผ่าน'}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `test_results_export_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  }

  // Admin Question Editor Modal Renderer
  function renderAdminEditorList() {
    adminQuestionsList.innerHTML = '';
    quizEngine.questions.forEach((q, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-q-item';
      item.innerHTML = `
        <div class="admin-q-item-header">
          <span>ข้อที่ ${idx + 1} (ID: ${q.id})</span>
          <div>
            <label style="font-size: 0.85rem; cursor: pointer;">
              เฉลย: 
              <select class="admin-ans-select" data-id="${q.id}">
                <option value="true" ${q.answer === true ? 'selected' : ''}>ถูก (True)</option>
                <option value="false" ${q.answer === false ? 'selected' : ''}>ผิด (False)</option>
              </select>
            </label>
          </div>
        </div>
        <div style="margin-bottom: 0.5rem;">
          <input type="text" class="admin-q-text" data-id="${q.id}" value="${escapeHtml(q.question)}" style="padding: 0.5rem; font-size: 0.9rem;">
        </div>
        <div>
          <input type="text" class="admin-q-exp" data-id="${q.id}" value="${escapeHtml(q.explanation)}" placeholder="คำอธิบายเฉลย" style="padding: 0.4rem; font-size: 0.8rem; color: #94a3b8;">
        </div>
      `;
      adminQuestionsList.appendChild(item);
    });
  }

  function saveAdminQuestions() {
    const updatedQuestions = [];
    const textInputs = adminQuestionsList.querySelectorAll('.admin-q-text');
    
    textInputs.forEach(input => {
      const qId = parseInt(input.getAttribute('data-id'), 10);
      const textVal = input.value.trim();
      const ansSelect = adminQuestionsList.querySelector(`.admin-ans-select[data-id="${qId}"]`);
      const expInput = adminQuestionsList.querySelector(`.admin-q-exp[data-id="${qId}"]`);

      updatedQuestions.push({
        id: qId,
        question: textVal,
        answer: ansSelect.value === 'true',
        explanation: expInput.value.trim()
      });
    });

    quizEngine.saveQuestions(updatedQuestions);
    modalAdminEditor.classList.add('hidden');
    alert("บันทึกการแก้ไขคำถามและเฉลยเรียบร้อยแล้ว");
  }

  function escapeHtml(text) {
    return text.replace(/"/g, '&quot;');
  }
});
