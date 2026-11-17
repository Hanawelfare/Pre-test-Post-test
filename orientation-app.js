/**
 * Main Application Controller & UI Handler
 * แบบวัดผลการปฐมนิเทศ พนักงานรายวัน (Orientation Exam System)
 */

// 📌 Web App URL จาก Google Apps Script สำหรับพนักงานทุกคนใช้งานร่วมกันอัตโนมัติ
const DEFAULT_GS_URL = "https://script.google.com/macros/s/AKfycbwvYgRcvzKO7pdGhcGXgrUFF3XW2ENMhhulJlrWJuCHu_pyrVTKMzEWOme_fmVc5L5L/exec";

// 📌 รหัสผ่านผู้ดูแลระบบ (Admin Password)
const ADMIN_PASSWORD = "089151";

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Admin Controls
  const btnAdminLoginTrigger = document.getElementById('btn-admin-login-trigger');
  const adminNavGroup = document.getElementById('admin-nav-group');
  const navBtnAdminDash = document.getElementById('nav-btn-admin-dash');
  const navBtnAdminExam = document.getElementById('nav-btn-admin-exam');
  const navBtnAdminSettings = document.getElementById('nav-btn-admin-settings');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const btnAdminDashSettings = document.getElementById('btn-admin-dash-settings');
  const btnAdminDashLogout = document.getElementById('btn-admin-dash-logout');

  const screenLogin = document.getElementById('screen-login');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResult = document.getElementById('screen-result');
  const screenDashboard = document.getElementById('screen-dashboard');

  // Employee Login Form Elements
  const formLogin = document.getElementById('form-login');
  const inputEmpId = document.getElementById('input-emp-id');
  const inputFullName = document.getElementById('input-fullname');
  const inputDepartment = document.getElementById('input-department');
  const autofillNameTag = document.getElementById('autofill-badge-name');
  const autofillDeptTag = document.getElementById('autofill-badge-dept');
  const lookupSpinner = document.getElementById('lookup-spinner');
  const pastAttemptBanner = document.getElementById('past-attempt-banner');
  const pastAttemptText = document.getElementById('past-attempt-text');

  // Quiz Screen Elements
  const quizUserName = document.getElementById('quiz-user-name');
  const quizUserDept = document.getElementById('quiz-user-dept');
  const quizUserEmpId = document.getElementById('quiz-user-empid');
  const quizAttemptBadge = document.getElementById('quiz-attempt-badge');
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

  const matrixButtonsContainer = document.getElementById('matrix-buttons-container');

  // Skipped Questions Tracker Elements
  const trackerSkippedCount = document.getElementById('tracker-skipped-count');
  const trackerStatusPill = document.getElementById('tracker-status-pill');
  const footerSkippedCount = document.getElementById('footer-skipped-count');
  const skippedPillsBar = document.getElementById('skipped-pills-bar');
  const skippedPillsContainer = document.getElementById('skipped-pills-container');
  const skippedPillsLabel = document.getElementById('skipped-pills-label');
  const btnJumpNextSkipped = document.getElementById('btn-jump-next-skipped');
  const btnFooterNextSkipped = document.getElementById('btn-footer-next-skipped');

  // Modal Incomplete Alert Elements
  const modalIncompleteAlert = document.getElementById('modal-incomplete-alert');
  const btnCloseIncompleteModal = document.getElementById('btn-close-incomplete-modal');
  const modalIncAnswered = document.getElementById('modal-inc-answered');
  const modalIncRemaining = document.getElementById('modal-inc-remaining');
  const modalIncPills = document.getElementById('modal-inc-pills');
  const btnModalGoAnswer = document.getElementById('btn-modal-go-answer');

  // Result Screen Elements (Strict: Total Score and % ONLY)
  const resultStatusIcon = document.getElementById('result-status-icon');
  const resultTitle = document.getElementById('result-title');
  const resultSubtitle = document.getElementById('result-subtitle');
  const resScoreValue = document.getElementById('res-score-value');
  const resScorePercent = document.getElementById('res-score-percent');
  const resAttemptInfo = document.getElementById('res-attempt-info');
  const syncStatusBox = document.getElementById('sync-status-box');
  const syncIcon = document.getElementById('sync-icon');
  const syncStatusText = document.getElementById('sync-status-text');

  const btnRetestExam = document.getElementById('btn-retest-exam');
  const retestButtonLabel = document.getElementById('retest-button-label');
  const btnBackHome = document.getElementById('btn-back-home');

  // Dashboard Elements
  const dashTotalEmp = document.getElementById('dash-total-emp');
  const dashPassCount = document.getElementById('dash-pass-count');
  const dashFailCount = document.getElementById('dash-fail-count');
  const dashPendingCount = document.getElementById('dash-pending-count');
  const dashSearchInput = document.getElementById('dash-search-input');
  const dashFilterStatus = document.getElementById('dash-filter-status');
  const dashTableBody = document.getElementById('dash-table-body');
  const btnRefreshDashboard = document.getElementById('btn-refresh-dashboard');
  const btnExportCsv = document.getElementById('btn-export-csv');

  // Admin Modals
  const modalAdminAuth = document.getElementById('modal-admin-auth');
  const btnCloseAdminAuth = document.getElementById('btn-close-admin-auth');
  const formAdminAuth = document.getElementById('form-admin-auth');
  const inputAdminPass = document.getElementById('input-admin-pass');

  const modalAdminPanel = document.getElementById('modal-admin-panel');
  const btnCloseAdminPanel = document.getElementById('btn-close-admin-panel');
  const inputGsUrl = document.getElementById('input-gs-url');
  const btnTestGsUrl = document.getElementById('btn-test-gs-url');
  const btnSaveGsUrl = document.getElementById('btn-save-gs-url');
  const adminQuestionsList = document.getElementById('admin-questions-list');
  const btnResetQuestions = document.getElementById('btn-reset-questions');
  const btnExportJson = document.getElementById('btn-export-json');
  const btnSaveQuestions = document.getElementById('btn-save-questions');

  // App Configuration & State
  let isAdminLoggedIn = false;
  let googleScriptUrl = localStorage.getItem('orientation_test_gs_url') || DEFAULT_GS_URL;

  // Initialize System
  init();

  function init() {
    bindEvents();
    loadCustomQuestionsFromStorage();
    fetchDataFromGoogleSheet();
  }

  function bindEvents() {
    // Admin Login Trigger (Top-Right Navbar Button)
    if (btnAdminLoginTrigger) {
      btnAdminLoginTrigger.addEventListener('click', () => {
        inputAdminPass.value = '';
        modalAdminAuth.classList.remove('hidden');
        inputAdminPass.focus();
      });
    }

    // Admin Navigation Bar Tabs
    if (navBtnAdminDash) {
      navBtnAdminDash.addEventListener('click', () => {
        setAdminNavActive(navBtnAdminDash);
        switchScreen(screenDashboard);
        renderDashboard();
      });
    }

    if (navBtnAdminExam) {
      navBtnAdminExam.addEventListener('click', () => {
        setAdminNavActive(navBtnAdminExam);
        switchScreen(screenLogin);
      });
    }

    if (navBtnAdminSettings) {
      navBtnAdminSettings.addEventListener('click', () => {
        openAdminPanel();
      });
    }

    if (btnAdminLogout) {
      btnAdminLogout.addEventListener('click', handleAdminLogout);
    }

    if (btnAdminDashSettings) {
      btnAdminDashSettings.addEventListener('click', () => {
        openAdminPanel();
      });
    }

    if (btnAdminDashLogout) {
      btnAdminDashLogout.addEventListener('click', handleAdminLogout);
    }

    // Employee ID Lookup
    let lookupTimer;
    inputEmpId.addEventListener('input', () => {
      clearTimeout(lookupTimer);
      lookupTimer = setTimeout(performEmpLookup, 350);
    });
    inputEmpId.addEventListener('blur', performEmpLookup);

    // Form Submit -> Start Exam
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      startExam();
    });

    // Quiz Controls
    btnPrevQ.addEventListener('click', () => {
      if (orientationQuizEngine.currentQuestionIndex > 0) {
        orientationQuizEngine.currentQuestionIndex--;
        renderCurrentQuestion();
      }
    });

    btnNextQ.addEventListener('click', () => {
      if (orientationQuizEngine.currentQuestionIndex < orientationQuizEngine.activeExamQuestions.length - 1) {
        orientationQuizEngine.currentQuestionIndex++;
        renderCurrentQuestion();
      }
    });

    btnClearAnswer.addEventListener('click', () => {
      const q = orientationQuizEngine.getCurrentQuestion();
      orientationQuizEngine.clearAnswer(q.id);
      renderCurrentQuestion();
    });

    btnSubmitExam.addEventListener('click', submitExamConfirmation);

    // Fast Jump to Next Skipped Question
    if (btnJumpNextSkipped) {
      btnJumpNextSkipped.addEventListener('click', jumpToNextSkippedQuestion);
    }
    if (btnFooterNextSkipped) {
      btnFooterNextSkipped.addEventListener('click', jumpToNextSkippedQuestion);
    }

    // Modal Incomplete Alert Controls
    if (btnCloseIncompleteModal) {
      btnCloseIncompleteModal.addEventListener('click', () => {
        modalIncompleteAlert.classList.add('hidden');
      });
    }
    if (btnModalGoAnswer) {
      btnModalGoAnswer.addEventListener('click', () => {
        modalIncompleteAlert.classList.add('hidden');
        jumpToNextSkippedQuestion();
      });
    }

    // Retest Button Action (ทำใหม่ครั้งที่ ...)
    btnRetestExam.addEventListener('click', () => {
      const nextAttempt = (orientationQuizEngine.currentUser.attemptNumber || 1) + 1;
      startExamWithAttempt(nextAttempt);
    });

    // Result Actions
    if (btnBackHome) {
      btnBackHome.addEventListener('click', () => {
        switchScreen(screenLogin);
      });
    }

    // Dashboard Controls
    btnRefreshDashboard.addEventListener('click', async () => {
      btnRefreshDashboard.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังโหลด...`;
      await fetchDataFromGoogleSheet();
      renderDashboard();
      btnRefreshDashboard.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> รีเฟรชข้อมูล`;
    });

    dashSearchInput.addEventListener('input', renderDashboard);
    dashFilterStatus.addEventListener('change', renderDashboard);
    btnExportCsv.addEventListener('click', exportDashboardCsv);

    // Admin Auth Modal
    btnCloseAdminAuth.addEventListener('click', () => {
      modalAdminAuth.classList.add('hidden');
    });

    formAdminAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      if (inputAdminPass.value.trim() === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        modalAdminAuth.classList.add('hidden');
        if (adminNavGroup) adminNavGroup.classList.remove('hidden');
        if (btnAdminLoginTrigger) btnAdminLoginTrigger.classList.add('hidden');
        setAdminNavActive(navBtnAdminDash);
        switchScreen(screenDashboard);
        renderDashboard();
      } else {
        alert("รหัสผ่านผู้ดูแลระบบไม่ถูกต้อง");
        inputAdminPass.value = '';
        inputAdminPass.focus();
      }
    });

    function handleAdminLogout() {
      isAdminLoggedIn = false;
      if (adminNavGroup) adminNavGroup.classList.add('hidden');
      if (btnAdminLoginTrigger) btnAdminLoginTrigger.classList.remove('hidden');
      switchScreen(screenLogin);
    }

    // Admin Panel Modal
    btnCloseAdminPanel.addEventListener('click', () => {
      modalAdminPanel.classList.add('hidden');
    });

    btnSaveGsUrl.addEventListener('click', () => {
      googleScriptUrl = inputGsUrl.value.trim() || DEFAULT_GS_URL;
      localStorage.setItem('orientation_test_gs_url', googleScriptUrl);
      alert("บันทึก Google Apps Script Web App URL เรียบร้อยแล้ว");
      fetchDataFromGoogleSheet();
    });

    btnTestGsUrl.addEventListener('click', async () => {
      const testUrl = inputGsUrl.value.trim() || googleScriptUrl;
      if (!testUrl) {
        alert("กรุณาระบุ URL ก่อนทดสอบ");
        return;
      }
      try {
        btnTestGsUrl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังทดสอบ...`;
        const resp = await fetch(`${testUrl}?action=getEmployees`);
        const data = await resp.json();
        btnTestGsUrl.innerHTML = `<i class="fa-solid fa-plug"></i> ทดสอบการเชื่อมต่อ`;
        if (data.status === 'success') {
          alert(`เชื่อมต่อสำเร็จ!\nพบข้อมูลพนักงานในชีท ${data.employees ? data.employees.length : 0} รายการ`);
        } else {
          alert(`ตอบกลับข้อมูล: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        btnTestGsUrl.innerHTML = `<i class="fa-solid fa-plug"></i> ทดสอบการเชื่อมต่อ`;
        alert(`เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}\nกรุณาตรวจสอบว่าได้ตั้งค่า Web app สิทธิ์ Execute as: Me และ Anyone can access หรือยัง`);
      }
    });

    btnResetQuestions.addEventListener('click', () => {
      if (confirm("ต้องการคืนค่าคำถามและเฉลยกลับเป็นชุดเริ่มต้น 25 ข้อหรือไม่?")) {
        localStorage.removeItem('orientation_custom_questions');
        orientationQuizEngine.resetDefaultQuestions();
        renderAdminEditorList();
        alert("คืนค่าชุดคำถามเริ่มต้น 25 ข้อเรียบร้อยแล้ว");
      }
    });

    btnExportJson.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orientationQuizEngine.questions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "orientation_questions_25.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    btnSaveQuestions.addEventListener('click', saveAdminQuestions);
  }

  function setAdminNavActive(btn) {
    [navBtnAdminDash, navBtnAdminExam, navBtnAdminSettings].forEach(b => {
      if (b) b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
  }

  function switchScreen(screen) {
    // Security check: Only authenticated admin can view dashboard
    if (screen === screenDashboard && !isAdminLoggedIn) {
      alert("แดชบอร์ดนี้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น กรุณาเข้าสู่ระบบ");
      modalAdminAuth.classList.remove('hidden');
      inputAdminPass.value = '';
      inputAdminPass.focus();
      return;
    }

    [screenLogin, screenQuiz, screenResult, screenDashboard].forEach(s => {
      if (s) s.classList.add('hidden');
    });
    if (screen) screen.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Load custom questions if stored in localStorage
  function loadCustomQuestionsFromStorage() {
    try {
      const saved = localStorage.getItem('orientation_custom_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          orientationQuizEngine.saveQuestions(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load stored questions", e);
    }
  }

  // Fetch employees and past submissions from Google Sheet
  async function fetchDataFromGoogleSheet() {
    if (!googleScriptUrl) return;
    try {
      lookupSpinner.classList.remove('hidden');
      const resp = await fetch(`${googleScriptUrl}?action=getEmployees&sheet=ผลสอบปฐมนิเทศ`);
      const data = await resp.json();
      lookupSpinner.classList.add('hidden');

      if (data.status === 'success') {
        if (Array.isArray(data.employees)) {
          orientationQuizEngine.updateEmployeeDatabase(data.employees);
        }
        if (Array.isArray(data.submissions)) {
          orientationQuizEngine.syncSubmissionsLog(data.submissions);
        }
        renderDashboard();
      }
    } catch (err) {
      lookupSpinner.classList.add('hidden');
      console.warn("Error fetching data from Google Sheet:", err);
    }
  }

  // Auto-fill Employee info on typing or blur
  function performEmpLookup() {
    const rawId = inputEmpId.value.trim();
    if (!rawId) {
      autofillNameTag.classList.add('hidden');
      autofillDeptTag.classList.add('hidden');
      pastAttemptBanner.classList.add('hidden');
      return;
    }

    const emp = orientationQuizEngine.lookupEmployee(rawId);
    if (emp) {
      inputFullName.value = emp.fullName || '';
      inputDepartment.value = emp.department || '';
      autofillNameTag.classList.remove('hidden');
      autofillDeptTag.classList.remove('hidden');

      // Check past attempts in orientation exam
      const subs = orientationQuizEngine.getEmployeeSubmissions(rawId);
      if (subs.length > 0) {
        const latest = subs[0];
        const isPassed = latest.score >= 20;
        pastAttemptBanner.classList.remove('hidden');
        pastAttemptText.innerHTML = `คุณเคยทำข้อสอบนี้มาแล้ว <strong>${subs.length} ครั้ง</strong> (คะแนนล่าสุด: <strong>${latest.score}/25 - ${isPassed ? '<span style="color:#059669; font-weight:700;">ผ่าน</span>' : '<span style="color:#dc2626; font-weight:700;">ยังไม่ผ่าน</span>'}</strong>) หากทำครั้งนี้จะเป็น<strong>รอบที่ ${subs.length + 1}</strong>`;
      } else {
        pastAttemptBanner.classList.add('hidden');
      }
    } else {
      autofillNameTag.classList.add('hidden');
      autofillDeptTag.classList.add('hidden');
      pastAttemptBanner.classList.add('hidden');
    }
  }

  // Start Exam
  function startExam() {
    const empId = inputEmpId.value.trim();
    const fullName = inputFullName.value.trim();
    const department = inputDepartment.value.trim();

    if (!empId || !fullName || !department) {
      alert("กรุณาระบุรหัสพนักงาน ชื่อ-นามสกุล และแผนกให้ครบถ้วนก่อนเริ่มทำข้อสอบ");
      return;
    }

    const subs = orientationQuizEngine.getEmployeeSubmissions(empId);
    const attemptNum = subs.length + 1;
    startExamWithAttempt(attemptNum, { empId, fullName, department });
  }

  function startExamWithAttempt(attemptNumber, userInfoOverride = null) {
    const userInfo = userInfoOverride || orientationQuizEngine.currentUser || {
      empId: inputEmpId.value.trim(),
      fullName: inputFullName.value.trim(),
      department: inputDepartment.value.trim()
    };

    orientationQuizEngine.startNewExam(userInfo, attemptNumber);

    // Update Quiz Header
    quizUserName.textContent = userInfo.fullName;
    quizUserDept.textContent = userInfo.department;
    quizUserEmpId.textContent = userInfo.empId;
    quizAttemptBadge.textContent = `รอบที่ ${attemptNumber}`;

    renderMatrixButtons();
    renderCurrentQuestion();
    switchScreen(screenQuiz);
  }

  function renderMatrixButtons() {
    matrixButtonsContainer.innerHTML = '';
    orientationQuizEngine.activeExamQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-matrix';
      btn.textContent = idx + 1;
      btn.setAttribute('title', `ข้อที่ ${idx + 1}`);
      btn.addEventListener('click', () => {
        orientationQuizEngine.currentQuestionIndex = idx;
        renderCurrentQuestion();
      });
      matrixButtonsContainer.appendChild(btn);
    });
  }

  function jumpToNextSkippedQuestion() {
    const nextIdx = orientationQuizEngine.getNextUnansweredIndex(orientationQuizEngine.currentQuestionIndex);
    if (nextIdx !== -1) {
      orientationQuizEngine.currentQuestionIndex = nextIdx;
      renderCurrentQuestion();
    } else {
      alert("ยินดีด้วย! คุณตอบครบทั้ง 25 ข้อแล้วค่ะ สามารถกดส่งข้อสอบได้ทันที");
    }
  }

  function renderCurrentQuestion() {
    const q = orientationQuizEngine.getCurrentQuestion();
    const totalQ = orientationQuizEngine.activeExamQuestions.length; // 25
    const currIdx = orientationQuizEngine.currentQuestionIndex;

    // Progress Bar
    quizProgressNum.textContent = `${currIdx + 1} / ${totalQ}`;
    quizProgressFill.style.width = `${((currIdx + 1) / totalQ) * 100}%`;

    // Question Labels
    qNumberLabel.textContent = `ข้อที่ ${currIdx + 1} จาก ${totalQ}`;
    qTextBody.textContent = `${currIdx + 1}. ${q.question}`;

    const isAnswered = orientationQuizEngine.userAnswers[q.id] !== undefined;
    if (isAnswered) {
      qStatusTag.className = 'status-answered-tag is-done';
      qStatusTag.innerHTML = `<i class="fa-solid fa-circle-check"></i> ตอบแล้ว`;
      btnClearAnswer.classList.remove('hidden');
    } else {
      qStatusTag.className = 'status-answered-tag';
      qStatusTag.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#fbbf24;"></i> ยังไม่ได้ตอบ (ข้าม)`;
      btnClearAnswer.classList.add('hidden');
    }

    // Render Options (True on left, False on right)
    qOptionsContainer.innerHTML = '';
    q.options.forEach(opt => {
      const optionBtn = document.createElement('div');
      optionBtn.className = 'option-btn';
      if (orientationQuizEngine.userAnswers[q.id] === opt.value) {
        optionBtn.classList.add('selected');
      }

      optionBtn.innerHTML = `
        <div class="option-badge">
          ${opt.value ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>'}
        </div>
        <span>${opt.text}</span>
      `;

      optionBtn.addEventListener('click', () => {
        orientationQuizEngine.setAnswer(q.id, opt.value);
        renderCurrentQuestion();
      });

      qOptionsContainer.appendChild(optionBtn);
    });

    // Update Matrix Buttons & Live Skipped Tracker
    updateMatrixAndTracker();

    // Navigation Controls
    btnPrevQ.disabled = currIdx === 0;

    // Check if on last question or all answered
    const allAnswered = orientationQuizEngine.isAllAnswered();
    const answeredCount = orientationQuizEngine.getAnsweredCount();

    if (currIdx === totalQ - 1 || allAnswered) {
      btnSubmitExam.classList.remove('hidden');
      if (allAnswered) {
        btnSubmitExam.className = 'btn btn-success btn-glow';
        btnSubmitExam.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ตรวจและส่งข้อสอบ (ครบ 25 ข้อแล้ว 🎉)`;
      } else {
        btnSubmitExam.className = 'btn btn-outline btn-warning';
        btnSubmitExam.innerHTML = `<i class="fa-solid fa-lock"></i> ส่งข้อสอบ (ตอบแล้ว ${answeredCount}/25 ข้อ)`;
      }
    } else {
      btnSubmitExam.classList.add('hidden');
    }

    if (currIdx === totalQ - 1) {
      btnNextQ.classList.add('hidden');
    } else {
      btnNextQ.classList.remove('hidden');
    }
  }

  function updateMatrixAndTracker() {
    const totalQ = orientationQuizEngine.activeExamQuestions.length;
    const answeredCount = orientationQuizEngine.getAnsweredCount();
    const unanswered = orientationQuizEngine.getUnansweredQuestions();
    const skippedCount = unanswered.length;

    // 1. Update Matrix Buttons States
    const btns = matrixButtonsContainer.querySelectorAll('.btn-matrix');
    orientationQuizEngine.activeExamQuestions.forEach((q, idx) => {
      const btn = btns[idx];
      if (!btn) return;

      btn.classList.remove('current', 'answered', 'skipped');
      if (idx === orientationQuizEngine.currentQuestionIndex) {
        btn.classList.add('current');
      }
      if (orientationQuizEngine.userAnswers[q.id] !== undefined) {
        btn.classList.add('answered');
      } else {
        btn.classList.add('skipped');
      }
    });

    // 2. Update Header Tracker Counts
    if (trackerSkippedCount) trackerSkippedCount.textContent = skippedCount;
    if (footerSkippedCount) footerSkippedCount.textContent = skippedCount;
    if (answeredCountBadge) answeredCountBadge.textContent = `ตอบแล้ว ${answeredCount}/${totalQ} ข้อ`;

    if (trackerStatusPill) {
      if (skippedCount === 0) {
        trackerStatusPill.className = 'badge-pill bg-success text-white';
        trackerStatusPill.innerHTML = `<i class="fa-solid fa-circle-check"></i> ตอบครบทั้ง 25 ข้อแล้ว`;
      } else {
        trackerStatusPill.className = 'badge-pill bg-warning text-dark';
        trackerStatusPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ข้ามไป/ยังไม่ตอบ <strong>${skippedCount}</strong> ข้อ`;
      }
    }

    // 3. Update Skipped Pills Bar
    if (skippedPillsContainer && skippedPillsBar) {
      skippedPillsContainer.innerHTML = '';
      if (skippedCount === 0) {
        skippedPillsBar.classList.add('all-done');
        if (skippedPillsLabel) {
          skippedPillsLabel.innerHTML = `<span style="color:#059669; font-weight:700;"><i class="fa-solid fa-circle-check"></i> ยอดเยี่ยม! ตอบครบทั้ง 25 ข้อแล้ว สามารถกดส่งข้อสอบได้เลยค่ะ</span>`;
        }
        if (btnJumpNextSkipped) btnJumpNextSkipped.classList.add('hidden');
        if (btnFooterNextSkipped) btnFooterNextSkipped.classList.add('hidden');
      } else {
        skippedPillsBar.classList.remove('all-done');
        if (skippedPillsLabel) {
          skippedPillsLabel.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ข้อที่ข้ามไป (คลิกเพื่อวนกลับไปตอบ):`;
        }
        if (btnJumpNextSkipped) btnJumpNextSkipped.classList.remove('hidden');
        if (btnFooterNextSkipped) btnFooterNextSkipped.classList.remove('hidden');

        unanswered.forEach(u => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'btn-skip-pill';
          pill.textContent = `ข้อ ${u.questionNumber}`;
          pill.setAttribute('title', `คลิกเพื่อไปตอบข้อ ${u.questionNumber}`);
          pill.addEventListener('click', () => {
            orientationQuizEngine.currentQuestionIndex = u.index;
            renderCurrentQuestion();
          });
          skippedPillsContainer.appendChild(pill);
        });
      }
    }
  }

  function submitExamConfirmation() {
    const totalQ = orientationQuizEngine.activeExamQuestions.length; // 25
    const answeredCount = orientationQuizEngine.getAnsweredCount();
    const unanswered = orientationQuizEngine.getUnansweredQuestions();

    // STRICT REQUIREMENT: พนักงานจะต้องตอบคำถามให้ครบ 25 ข้อ (ห้ามข้ามส่ง)
    if (answeredCount < totalQ) {
      if (modalIncompleteAlert) {
        modalIncAnswered.textContent = answeredCount;
        modalIncRemaining.textContent = unanswered.length;

        modalIncPills.innerHTML = '';
        unanswered.forEach(u => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'btn-skip-pill';
          pill.textContent = `ข้อ ${u.questionNumber}`;
          pill.addEventListener('click', () => {
            modalIncompleteAlert.classList.add('hidden');
            orientationQuizEngine.currentQuestionIndex = u.index;
            renderCurrentQuestion();
          });
          modalIncPills.appendChild(pill);
        });

        modalIncompleteAlert.classList.remove('hidden');
      } else {
        const missingNums = unanswered.map(u => `ข้อ ${u.questionNumber}`).join(', ');
        alert(
          `⚠️ ยังไม่สามารถส่งข้อสอบได้!\n\n` +
          `พนักงานต้องตอบคำถามให้ครบทั้ง ${totalQ} ข้อก่อนส่งข้อสอบค่ะ\n` +
          `(ขณะนี้ตอบไปแล้ว ${answeredCount}/${totalQ} ข้อ ขาดอีก ${unanswered.length} ข้อ)\n\n` +
          `ข้อที่ข้ามไป: ${missingNums}\n\n` +
          `ระบบจะวนกลับไปที่ข้อที่ข้ามข้อแรกให้ทันที`
        );
        orientationQuizEngine.currentQuestionIndex = unanswered[0].index;
        renderCurrentQuestion();
      }
      return;
    }

    // All 25 answered!
    if (confirm(`คุณได้ตอบข้อสอบครบถ้วนทั้ง 25 ข้อแล้ว 🎉\n\nต้องการยืนยันการตรวจและส่งข้อสอบหรือไม่?`)) {
      processExamSubmission();
    }
  }

  async function processExamSubmission() {
    const scoreResult = orientationQuizEngine.calculateScore();

    // Record submission entry in local log
    const submissionRecord = {
      timestamp: new Date().toLocaleString('th-TH'),
      empId: orientationQuizEngine.currentUser.empId,
      fullName: orientationQuizEngine.currentUser.fullName,
      department: orientationQuizEngine.currentUser.department,
      testType: 'แบบวัดผลการปฐมนิเทศ พนักงานรายวัน',
      score: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      percentage: scoreResult.percentage,
      isPassed: scoreResult.isPassed,
      attemptNumber: scoreResult.attemptNumber
    };
    orientationQuizEngine.recordSubmission(submissionRecord);

    renderResultsScreen(scoreResult);
    switchScreen(screenResult);

    // Send payload to Google Sheets
    await sendResultToGoogleSheets(scoreResult);
  }

  // Result Screen Renderer (Strict: Employee ONLY sees Total Score and %)
  function renderResultsScreen(result) {
    if (result.isPassed) {
      resultStatusIcon.className = 'result-badge-icon pass';
      resultStatusIcon.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
      resultTitle.textContent = `ผลการสอบ: ผ่านเกณฑ์ (PASS) 🎉`;
      resultSubtitle.textContent = `ยินดีด้วย! คุณผ่านเกณฑ์การประเมิน 80% ขึ้นไป (เกณฑ์ผ่าน: 20/25)`;
      resScorePercent.className = 'score-percentage-pill pass';

      // Hide retest button when passed
      btnRetestExam.classList.add('hidden');
    } else {
      resultStatusIcon.className = 'result-badge-icon fail';
      resultStatusIcon.innerHTML = `<i class="fa-solid fa-circle-xmark"></i>`;
      resultTitle.textContent = `ผลการสอบ: ยังไม่ผ่านเกณฑ์ (FAIL) ⚠️`;
      resultSubtitle.textContent = `คุณทำคะแนนได้น้อยกว่าเกณฑ์ 80% (ต้องได้ 20 คะแนนขึ้นไป)`;
      resScorePercent.className = 'score-percentage-pill fail';

      // Show prominent Retest Button: "ทำข้อสอบใหม่ (ครั้งที่ ...)"
      const nextAttempt = result.attemptNumber + 1;
      retestButtonLabel.textContent = `ทำข้อสอบใหม่ (ครั้งที่ ${nextAttempt})`;
      btnRetestExam.classList.remove('hidden');
    }

    resScoreValue.textContent = result.totalScore;
    resScorePercent.textContent = `${result.percentage}%`;
    resAttemptInfo.innerHTML = `รอบที่ทำสอบ: <strong>ครั้งที่ ${result.attemptNumber}</strong> | รหัสพนักงาน: <strong>${orientationQuizEngine.currentUser.empId}</strong>`;
  }

  async function sendResultToGoogleSheets(result) {
    if (!googleScriptUrl) {
      syncStatusBox.className = 'sync-status-bar';
      syncIcon.className = 'fa-solid fa-circle-info';
      syncStatusText.textContent = 'บันทึกผลสอบลงระบบเรียบร้อยแล้ว';
      return;
    }

    syncStatusBox.className = 'sync-status-bar';
    syncIcon.className = 'fa-solid fa-sync fa-spin';
    syncStatusText.textContent = 'กำลังบันทึกผลสอบไปยัง Google Sheet...';

    const payload = {
      sheetName: 'ผลสอบปฐมนิเทศ',
      empId: orientationQuizEngine.currentUser.empId,
      fullName: orientationQuizEngine.currentUser.fullName,
      department: orientationQuizEngine.currentUser.department,
      testType: 'แบบวัดผลการปฐมนิเทศ พนักงานรายวัน',
      score: result.totalScore,
      maxScore: result.maxScore,
      isPassed: result.isPassed,
      attemptNumber: result.attemptNumber,
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
        throw new Error(res.message || "Unknown response");
      }
    } catch (e) {
      console.warn("Google Sheet POST error:", e);
      syncStatusBox.className = 'sync-status-bar';
      syncIcon.className = 'fa-solid fa-circle-check text-primary';
      syncStatusText.textContent = 'บันทึกผลการสอบในระบบสำเร็จแล้ว';
    }
  }

  /**
   * DASHBOARD CONTROLLER & TABLE RENDERER
   * ตรวจสอบสถานะทั้ง 3 กลุ่ม:
   * 1. คนไหนทำข้อสอบผ่าน (PASS)
   * 2. คนไหนยังไม่ผ่าน (FAIL)
   * 3. คนไหนยังไม่เสร็จ / ยังไม่ได้สอบ (PENDING)
   * แอดมินและพนักงานสามารถดูได้แบบโปร่งใส
   */
  function renderDashboard() {
    const search = (dashSearchInput.value || '').trim().toLowerCase();
    const filterStatus = dashFilterStatus.value;

    // 1. Compile roster of all employees
    // Combine employees from sheet "Name" + any who submitted but aren't in Name
    const rosterMap = new Map();

    orientationQuizEngine.employeeDatabase.forEach(emp => {
      const cleanId = orientationQuizEngine.cleanEmpId(emp.empId);
      if (cleanId) {
        rosterMap.set(cleanId, {
          empId: emp.empId,
          fullName: emp.fullName || '',
          department: emp.department || '',
          submissions: []
        });
      }
    });

    // Populate submissions into employee roster
    orientationQuizEngine.submissionsLog.forEach(sub => {
      const cleanId = orientationQuizEngine.cleanEmpId(sub.empId);
      if (!cleanId) return;

      if (!rosterMap.has(cleanId)) {
        rosterMap.set(cleanId, {
          empId: sub.empId,
          fullName: sub.fullName || '',
          department: sub.department || '',
          submissions: []
        });
      }

      rosterMap.get(cleanId).submissions.push(sub);
    });

    // 2. Evaluate status for each person
    const evaluatedList = [];
    rosterMap.forEach((person) => {
      const subs = person.submissions; // chronological or reverse chronological
      const hasTaken = subs.length > 0;

      let status = 'PENDING'; // PENDING, PASS, FAIL
      let latestScore = null;
      let latestMaxScore = 25;
      let latestPercent = null;
      let latestAttempt = 0;
      let latestTimestamp = '-';

      if (hasTaken) {
        // Sort newest first by timestamp if needed, or use sub[0]
        const latestSub = subs[0];
        latestScore = latestSub.score;
        latestMaxScore = latestSub.maxScore || 25;
        latestPercent = Math.round((latestScore / latestMaxScore) * 100);
        latestAttempt = subs.length;
        latestTimestamp = latestSub.timestamp || '-';

        // Check if latest attempt passed (score >= 20)
        if (latestScore >= 20) {
          status = 'PASS';
        } else {
          status = 'FAIL';
        }
      }

      evaluatedList.push({
        empId: person.empId,
        fullName: person.fullName,
        department: person.department,
        status: status,
        score: latestScore,
        maxScore: latestMaxScore,
        percentage: latestPercent,
        attemptCount: latestAttempt,
        latestTimestamp: latestTimestamp
      });
    });

    // 3. Calculate Overall Metrics
    const totalCount = evaluatedList.length;
    const passCount = evaluatedList.filter(e => e.status === 'PASS').length;
    const failCount = evaluatedList.filter(e => e.status === 'FAIL').length;
    const pendingCount = evaluatedList.filter(e => e.status === 'PENDING').length;

    const passPct = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : '0.0';
    const failPct = totalCount > 0 ? ((failCount / totalCount) * 100).toFixed(1) : '0.0';
    const pendingPct = totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(1) : '0.0';

    dashTotalEmp.textContent = `${totalCount} คน`;
    dashPassCount.textContent = `${passCount} คน (${passPct}%)`;
    dashFailCount.textContent = `${failCount} คน (${failPct}%)`;
    dashPendingCount.textContent = `${pendingCount} คน (${pendingPct}%)`;

    // 4. Apply Filters & Search
    const filteredList = evaluatedList.filter(item => {
      const matchSearch = !search ||
        (item.empId && item.empId.toLowerCase().includes(search)) ||
        (item.fullName && item.fullName.toLowerCase().includes(search)) ||
        (item.department && item.department.toLowerCase().includes(search));

      const matchFilter = filterStatus === 'ALL' || item.status === filterStatus;

      return matchSearch && matchFilter;
    });

    // 5. Render Table Rows
    dashTableBody.innerHTML = '';
    if (filteredList.length === 0) {
      dashTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center" style="padding: 2.5rem; color: #64748b;">
            <i class="fa-solid fa-inbox" style="font-size: 2.2rem; display: block; margin-bottom: 0.6rem; color: #94a3b8;"></i>
            ไม่พบข้อมูลตามเงื่อนไขที่เลือก
          </td>
        </tr>
      `;
      return;
    }

    filteredList.forEach((row, idx) => {
      const tr = document.createElement('tr');

      let statusBadge = '';
      let scoreText = '-';
      let percentText = '-';
      let attemptText = '<span class="badge-pill bg-neutral">ยังไม่ทำ</span>';

      if (row.status === 'PASS') {
        statusBadge = `<span class="badge-status-pass"><i class="fa-solid fa-circle-check"></i> ผ่าน (PASS)</span>`;
        scoreText = `<strong style="color:#0369a1;">${row.score}</strong> / ${row.maxScore}`;
        percentText = `<strong style="color:#059669;">${row.percentage}%</strong>`;
        attemptText = `<span class="badge-pill bg-success">รอบที่ ${row.attemptCount} (ผ่าน 🎉)</span>`;
      } else if (row.status === 'FAIL') {
        statusBadge = `<span class="badge-status-fail"><i class="fa-solid fa-circle-xmark"></i> ยังไม่ผ่าน (FAIL)</span>`;
        scoreText = `<strong style="color:#0369a1;">${row.score}</strong> / ${row.maxScore}`;
        percentText = `<strong style="color:#dc2626;">${row.percentage}%</strong>`;
        attemptText = `<span class="badge-pill bg-warning text-dark">รอบที่ ${row.attemptCount} (ต้องทำใหม่)</span>`;
      } else {
        statusBadge = `<span class="badge-status-pending"><i class="fa-solid fa-clock"></i> ยังไม่เสร็จ / ยังไม่สอบ</span>`;
        scoreText = `<span class="text-muted">-</span>`;
        percentText = `<span class="text-muted">-</span>`;
        attemptText = `<span class="badge-pill bg-neutral">ยังไม่ได้ทำ</span>`;
      }

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${row.empId}</strong></td>
        <td>${row.fullName}</td>
        <td>${row.department}</td>
        <td>${statusBadge}</td>
        <td>${scoreText}</td>
        <td>${percentText}</td>
        <td>${attemptText}</td>
        <td>${row.latestTimestamp}</td>
      `;
      dashTableBody.appendChild(tr);
    });
  }

  function exportDashboardCsv() {
    const search = (dashSearchInput.value || '').trim().toLowerCase();
    const filterStatus = dashFilterStatus.value;

    const rows = dashTableBody.querySelectorAll('tr');
    if (!rows || rows.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }

    let csvContent = "\uFEFFลำดับ,รหัสพนักงาน,ชื่อ-นามสกุล,แผนก,สถานะผลสอบ,คะแนนล่าสุด,คะแนนเต็ม,คิดเป็น %,จำนวนครั้งที่ทำ,วัน-เวลาล่าสุด\n";
    
    // Grab all rows
    const allTableRows = dashTableBody.querySelectorAll('tr');
    let count = 0;
    allTableRows.forEach((tr, i) => {
      const cells = tr.querySelectorAll('td');
      if (cells.length >= 9) {
        count++;
        const num = cells[0].textContent.trim();
        const empId = cells[1].textContent.trim();
        const name = cells[2].textContent.trim();
        const dept = cells[3].textContent.trim();
        const status = cells[4].textContent.trim();
        const score = cells[5].textContent.trim();
        const pct = cells[6].textContent.trim();
        const attempt = cells[7].textContent.trim();
        const timestamp = cells[8].textContent.trim();

        csvContent += `"${num}","${empId}","${name}","${dept}","${status}","${score}","25","${pct}","${attempt}","${timestamp}"\n`;
      }
    });

    if (count === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออก");
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orientation_results_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  // Admin Panel Setup & Question Editor
  function openAdminPanel() {
    inputGsUrl.value = googleScriptUrl;
    renderAdminEditorList();
    modalAdminPanel.classList.remove('hidden');
  }

  function renderAdminEditorList() {
    adminQuestionsList.innerHTML = '';
    orientationQuizEngine.questions.forEach((q, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-q-item';
      item.innerHTML = `
        <div class="admin-q-item-header">
          <span>ข้อที่ ${idx + 1} (ID: ${q.id})</span>
          <div>
            <label style="font-size: 0.88rem; cursor: pointer; color: #0369a1; font-weight: 600;">
              เฉลย: 
              <select class="admin-ans-select" data-id="${q.id}" style="padding: 0.3rem 0.6rem; background:#ffffff; color:#0f172a; border:1.5px solid #cbd5e1; border-radius:6px; font-weight: 600;">
                <option value="true" ${q.answer === true ? 'selected' : ''}>ถูก (True)</option>
                <option value="false" ${q.answer === false ? 'selected' : ''}>ผิด (False)</option>
              </select>
            </label>
          </div>
        </div>
        <div style="margin-bottom: 0.6rem;">
          <input type="text" class="admin-q-text" data-id="${q.id}" value="${escapeHtml(q.question)}" style="width:100%; padding: 0.6rem 0.8rem; background:#ffffff; color:#0f172a; border:1.5px solid #cbd5e1; border-radius:6px; font-size: 0.95rem;">
        </div>
        <div>
          <input type="text" class="admin-q-exp" data-id="${q.id}" value="${escapeHtml(q.explanation || '')}" placeholder="คำอธิบายเฉลย" style="width:100%; padding: 0.45rem 0.8rem; background:#ffffff; color:#475569; border:1px solid #e2e8f0; border-radius:6px; font-size: 0.85rem;">
        </div>
      `;
      adminQuestionsList.appendChild(item);
    });
  }

  function saveAdminQuestions() {
    const updated = [];
    const textInputs = adminQuestionsList.querySelectorAll('.admin-q-text');

    textInputs.forEach(input => {
      const qId = parseInt(input.getAttribute('data-id'), 10);
      const textVal = input.value.trim();
      const ansSelect = adminQuestionsList.querySelector(`.admin-ans-select[data-id="${qId}"]`);
      const expInput = adminQuestionsList.querySelector(`.admin-q-exp[data-id="${qId}"]`);

      updated.push({
        id: qId,
        question: textVal,
        answer: ansSelect.value === 'true',
        explanation: expInput ? expInput.value.trim() : ''
      });
    });

    orientationQuizEngine.saveQuestions(updated);
    localStorage.setItem('orientation_custom_questions', JSON.stringify(updated));
    modalAdminPanel.classList.add('hidden');
    alert("บันทึกการแก้ไขคำถามและเฉลย 25 ข้อเรียบร้อยแล้ว");
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/"/g, '&quot;');
  }
});

