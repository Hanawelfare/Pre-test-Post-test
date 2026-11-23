/**
 * Main Application Controller & UI Handler
 * แบบวัดผลการปฐมนิเทศ พนักงานรายวัน (Orientation Exam System)
 */

// 📌 Web App URL จาก Google Apps Script สำหรับพนักงานทุกคนใช้งานร่วมกันอัตโนมัติ
const DEFAULT_GS_URL = "https://script.google.com/macros/s/AKfycbx-3oiFjfwjwSaxK36QnZmYXRnuLcUgSYjiAQaHokje4rtslEPQRi-rVezkoKVZcEa7/exec";

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
  const btnExitExam = document.getElementById('btn-exit-exam');

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

  // Dashboard & Socrative Elements
  const dashTotalEmp = document.getElementById('dash-total-emp');
  const dashPassCount = document.getElementById('dash-pass-count');
  const dashFailCount = document.getElementById('dash-fail-count');
  const dashPendingCount = document.getElementById('dash-pending-count');
  const dashSearchInput = document.getElementById('dash-search-input');
  const dashFilterStatus = document.getElementById('dash-filter-status');
  const dashTableHead = document.getElementById('dash-table-head');
  const dashTableBody = document.getElementById('dash-table-body');
  const dashTableFoot = document.getElementById('dash-table-foot');
  const btnRefreshDashboard = document.getElementById('btn-refresh-dashboard');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnResetAllLive = document.getElementById('btn-reset-all-live');
  const socrativeAnalysisGrid = document.getElementById('socrative-analysis-grid');
  const btnViewSummary = document.getElementById('btn-view-summary');
  const btnViewSocrative = document.getElementById('btn-view-socrative');
  const toggleLivePolling = document.getElementById('toggle-live-polling');

  // Modal Employee Detail Elements (Socrative Individual View)
  const modalEmployeeDetail = document.getElementById('modal-employee-detail');
  const btnCloseEmpDetail = document.getElementById('btn-close-emp-detail');
  const btnCloseEmpDetailFooter = document.getElementById('btn-close-emp-detail-footer');
  const btnPrintEmpDetail = document.getElementById('btn-print-emp-detail');
  const modalEmpDetailTitle = document.getElementById('modal-emp-detail-title');
  const modalEmpDetailSubtitle = document.getElementById('modal-emp-detail-subtitle');
  const modalEmpDetailMeta = document.getElementById('modal-emp-detail-meta');
  const modalEmpDetailList = document.getElementById('modal-emp-detail-list');

  let currentDashboardView = 'overview'; // 'overview' or 'socrative'

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
    loadCachedEmployees();
    fetchDataFromGoogleSheet();
    initLivePolling();
  }

  // โหลดรายชื่อพนักงานจาก Cache ท้องถิ่นทันที (0ms Autofill โดยไม่ต้องรอ Network)
  function loadCachedEmployees() {
    try {
      const cached = localStorage.getItem('orientation_cached_employees');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          orientationQuizEngine.updateEmployeeDatabase(parsed);
        }
      }
    } catch(e) {}
  }

  let livePollInterval = null;
  let isFetchingLive = false;
  // ⚡ BroadcastChannel เชื่อมโยงข้ามแท็บ/หน้าต่างแบบเรียลไทม์ทันที 0ms (ไม่ต้องรอ Polling)
  const syncChannel = (typeof BroadcastChannel !== 'undefined') ? new BroadcastChannel('orientation_sync_channel') : null;

  function initLivePolling() {
    if (livePollInterval) clearInterval(livePollInterval);

    // 1. Cloud Polling ตรวจสอบข้อมูลจาก Google Sheet อัตโนมัติทุก 1.5 วินาที (สำหรับใช้งานข้ามอุปกรณ์/มือถือ)
    livePollInterval = setInterval(async () => {
      if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
        if (!toggleLivePolling || toggleLivePolling.checked) {
          if (!isFetchingLive) {
            isFetchingLive = true;
            try {
              await fetchDataFromGoogleSheet(true);
            } finally {
              isFetchingLive = false;
            }
          }
        }
      }
    }, 1500);

    // 2. รับสัญญาณสดทันที 0ms ผ่าน BroadcastChannel (เมื่อเปิดข้อสอบและแดชบอร์ดคนละแท็บ)
    if (syncChannel) {
      syncChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'LIVE_UPDATE' && event.data.liveData) {
          saveLiveSessionLocally(event.data.empId, event.data.liveData);
          const cleanTarget = orientationQuizEngine.cleanEmpId(event.data.empId);
          const existingIdx = orientationQuizEngine.liveProgressLog.findIndex(l => orientationQuizEngine.cleanEmpId(l.empId) === cleanTarget);
          if (existingIdx !== -1) {
            orientationQuizEngine.liveProgressLog[existingIdx] = event.data.liveData;
          } else {
            orientationQuizEngine.liveProgressLog.push(event.data.liveData);
          }
          if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
            renderDashboard();
          }
        } else if (event.data && event.data.type === 'RESET_LIVE') {
          clearLiveSessionLocally(event.data.empId);
          orientationQuizEngine.clearEmployeeLiveProgress(event.data.empId);
          if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
            renderDashboard();
          }
        }
      };
    }

    // 3. รับสัญญาณ Storage Event แบบสดทันทีข้ามแท็บ (0ms Fallback)
    window.addEventListener('storage', (e) => {
      if (e.key === 'orientation_live_ping' || (e.key && e.key.startsWith('orientation_live_'))) {
        if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
          renderDashboard();
        }
      }
    });
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

    // Employee ID Lookup (Instant Autofill 0ms)
    let lookupTimer;
    inputEmpId.addEventListener('input', () => {
      clearTimeout(lookupTimer);
      lookupTimer = setTimeout(performEmpLookup, 20);
    });
    inputEmpId.addEventListener('keyup', performEmpLookup);
    inputEmpId.addEventListener('paste', () => setTimeout(performEmpLookup, 10));
    inputEmpId.addEventListener('change', performEmpLookup);
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
      triggerLiveProgressSync();
    });

    btnSubmitExam.addEventListener('click', submitExamConfirmation);

    if (btnExitExam) {
      btnExitExam.addEventListener('click', handleExitAndResetExam);
    }

    // 🚪 เมื่อพนักงานออกจากหน้าข้อสอบ (ปิดแท็บ / ปิดเบราว์เซอร์ / รีเฟรช / สลับหน้า)
    // ถือว่าออกจากการทำข้อสอบทันที: ให้ระบบลบออกจากสถานะ "กำลังทำ" บนแดชบอร์ดอัตโนมัติ โดยไม่ต้องรอให้กดปุ่ม
    window.addEventListener('pagehide', (e) => {
      // ถ้า e.persisted เป็น true คือเบราว์เซอร์แค่ freeze หน้าเว็บไว้ใน bfcache (เช่น สลับแอปไปแป๊บเดียว) ห้ามล้างข้อมูล
      if (e.persisted) return;
      notifyAutoExitExam();
    });
    window.addEventListener('beforeunload', notifyAutoExitExam);

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

    // Socrative View Switcher Controls
    if (btnViewSummary) {
      btnViewSummary.addEventListener('click', () => {
        currentDashboardView = 'overview';
        btnViewSummary.classList.add('active');
        if (btnViewSocrative) btnViewSocrative.classList.remove('active');
        renderDashboard();
      });
    }

    if (btnViewSocrative) {
      btnViewSocrative.addEventListener('click', () => {
        currentDashboardView = 'socrative';
        btnViewSocrative.classList.add('active');
        if (btnViewSummary) btnViewSummary.classList.remove('active');
        renderDashboard();
      });
    }

    // Modal Employee Detail Controls (Socrative View)
    if (btnCloseEmpDetail) {
      btnCloseEmpDetail.addEventListener('click', () => {
        modalEmployeeDetail.classList.add('hidden');
      });
    }
    if (btnCloseEmpDetailFooter) {
      btnCloseEmpDetailFooter.addEventListener('click', () => {
        modalEmployeeDetail.classList.add('hidden');
      });
    }
    if (btnPrintEmpDetail) {
      btnPrintEmpDetail.addEventListener('click', () => {
        window.print();
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
    if (btnResetAllLive) {
      btnResetAllLive.addEventListener('click', resetAllLiveProgress);
    }

    // Admin Auth Modal
    btnCloseAdminAuth.addEventListener('click', () => {
      modalAdminAuth.classList.add('hidden');
    });

    formAdminAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const p = inputAdminPass.value.trim();
      if (p === ADMIN_PASSWORD || p === "pa2026") {
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

    btnSaveGsUrl.addEventListener('click', async () => {
      googleScriptUrl = inputGsUrl.value.trim() || DEFAULT_GS_URL;
      localStorage.setItem('orientation_test_gs_url', googleScriptUrl);
      btnSaveGsUrl.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...`;
      await fetchDataFromGoogleSheet();
      btnSaveGsUrl.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> บันทึก URL`;
      alert("บันทึก Google Apps Script Web App URL และซิงก์ข้อมูลพนักงานเรียบร้อยแล้วค่ะ");
      modalAdminPanel.classList.add('hidden');
      renderDashboard();
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
          // 🌟 Auto-save และซิงก์ข้อมูลลงระบบทันทีที่เชื่อมต่อสำเร็จ
          googleScriptUrl = testUrl;
          localStorage.setItem('orientation_test_gs_url', testUrl);

          if (Array.isArray(data.employees)) {
            orientationQuizEngine.updateEmployeeDatabase(data.employees);
            try {
              localStorage.setItem('orientation_cached_employees', JSON.stringify(data.employees));
            } catch(e) {}
          }
          if (Array.isArray(data.submissions)) {
            orientationQuizEngine.syncSubmissionsLog(data.submissions);
          }
          if (Array.isArray(data.liveProgress)) {
            orientationQuizEngine.syncLiveProgress(data.liveProgress);
          }

          renderDashboard();
          alert(`เชื่อมต่อสำเร็จและบันทึก URL ให้เรียบร้อยแล้วค่ะ! 🎉\nพบข้อมูลพนักงานในชีท ${data.employees ? data.employees.length : 0} รายการ (ระบบอัปเดตฐานข้อมูลให้ทันที)`);
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
  async function fetchDataFromGoogleSheet(silent = false) {
    if (!googleScriptUrl) return;
    try {
      if (!silent) lookupSpinner.classList.remove('hidden');
      // 🌟 ใส่ cache-buster ป้องกัน Browser แคชผล (Simple Request ปราศจาก Custom Headers เพื่อป้องกันปัญหา CORS บนมือถือ)
      const cacheBuster = Date.now();
      const resp = await fetch(`${googleScriptUrl}?action=getEmployees&sheet=ผลสอบปฐมนิเทศ&_t=${cacheBuster}`);
      const data = await resp.json();
      if (!silent) lookupSpinner.classList.add('hidden');

      if (data.status === 'success') {
        if (Array.isArray(data.employees)) {
          orientationQuizEngine.updateEmployeeDatabase(data.employees);
          try {
            localStorage.setItem('orientation_cached_employees', JSON.stringify(data.employees));
          } catch(e) {}
        }
        if (Array.isArray(data.submissions)) {
          orientationQuizEngine.syncSubmissionsLog(data.submissions);
        }
        if (Array.isArray(data.liveProgress)) {
          orientationQuizEngine.syncLiveProgress(data.liveProgress);
        }
        // 🌟 ถ้าระหว่างที่กำลังดึงข้อมูล มีการกรอกรหัสพนักงานค้างไว้ ให้ Auto-fill ทันทีที่ข้อมูลมาถึง
        if (inputEmpId && inputEmpId.value.trim()) {
          performEmpLookup();
        }
        if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
          renderDashboard();
        }
      }
    } catch (err) {
      if (!silent) lookupSpinner.classList.add('hidden');
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
    triggerLiveProgressSync();
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
        triggerLiveProgressSync();
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

  // ==========================================
  // REAL-TIME LIVE PROGRESS HYBRID SYNC (Local 0ms + Cloud Google Sheets)
  // ==========================================
  function saveLiveSessionLocally(empId, sessionData) {
    if (!empId) return;
    const cleanId = orientationQuizEngine.cleanEmpId(empId);
    try {
      localStorage.setItem('orientation_live_' + cleanId, JSON.stringify(sessionData));
      localStorage.setItem('orientation_live_ping', Date.now().toString());
    } catch(e) {}
  }

  function getLiveSessionLocally(empId) {
    if (!empId) return null;
    const cleanId = orientationQuizEngine.cleanEmpId(empId);
    try {
      const saved = localStorage.getItem('orientation_live_' + cleanId);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return null;
  }

  function clearLiveSessionLocally(empId) {
    if (!empId) return;
    const cleanId = orientationQuizEngine.cleanEmpId(empId);
    try {
      localStorage.removeItem('orientation_live_' + cleanId);
      localStorage.setItem('orientation_live_ping', Date.now().toString());
    } catch(e) {}
  }

  let liveSyncTimeout = null;
  function triggerLiveProgressSync() {
    if (!orientationQuizEngine.currentUser || !orientationQuizEngine.currentUser.empId) return;

    const empId = orientationQuizEngine.currentUser.empId;
    const fullName = orientationQuizEngine.currentUser.fullName || '';
    const department = orientationQuizEngine.currentUser.department || '';
    const attempt = orientationQuizEngine.currentUser.attemptNumber || 1;
    const answeredCount = orientationQuizEngine.getAnsweredCount();
    const scoreResult = orientationQuizEngine.calculateScore();

    // 🌟 1. จัดเรียงคำตอบตามหน้าจอของผู้สอบ (Screen Order 1..25) เพื่อแสดงผลแดชบอร์ดให้ตรงกับที่ทำจริง
    const screenAnswers = scoreResult.details.map((d, idx) => ({
      screenQ: idx + 1,
      screenNumber: idx + 1,
      q: d.questionId,
      questionId: d.questionId,
      questionText: d.questionText || '',
      ans: d.userAnswer,
      correct: d.correctAnswer,
      score: d.itemScore,
      isCorrect: d.isCorrect,
      status: d.status,
      explanation: d.explanation || ''
    }));

    // 🌟 2. จัดเรียงคำตอบตามรหัสโจทย์หลักสูตร (Canonical Order 1..25) สำหรับการวิเคราะห์ Item Analysis
    const sortedDetails = [...scoreResult.details].sort((a, b) => a.questionId - b.questionId);
    const canonicalAnswers = sortedDetails.map(d => ({
      q: d.questionId,
      questionId: d.questionId,
      screenQ: d.screenNumber,
      questionText: d.questionText || '',
      ans: d.userAnswer,
      correct: d.correctAnswer,
      score: d.itemScore,
      isCorrect: d.isCorrect,
      status: d.status,
      explanation: d.explanation || ''
    }));

    const answersMap = {};
    orientationQuizEngine.activeExamQuestions.forEach(q => {
      const val = orientationQuizEngine.userAnswers[q.id];
      if (val !== undefined && val !== null) {
        answersMap[q.id] = val;
      }
    });

    const liveData = {
      empId: empId,
      fullName: fullName,
      department: department,
      attemptNumber: attempt,
      answeredCount: answeredCount,
      currentScore: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      percentage: scoreResult.percentage,
      isPassed: scoreResult.isPassed,
      isSubmitted: false,
      timestamp: new Date().toLocaleTimeString('th-TH'),
      screenAnswers: screenAnswers,
      canonicalAnswers: canonicalAnswers,
      answers: screenAnswers, // ให้ answers ใน Live Data เป็น Screen Order เพื่อให้ตาราง Socrative แสดงเรียง 1..25
      answersMap: answersMap
    };

    // ⚡ 1. อัปเดตเครื่อง Local ทันที (0ms ให้แดชบอร์ดที่เปิดในแท็บอื่น/หน้าต่างอื่นแสดงผลทันที)
    saveLiveSessionLocally(empId, liveData);
    const cleanIdTarget = orientationQuizEngine.cleanEmpId(empId);
    const existIdx = orientationQuizEngine.liveProgressLog.findIndex(l => orientationQuizEngine.cleanEmpId(l.empId) === cleanIdTarget);
    if (existIdx !== -1) {
      orientationQuizEngine.liveProgressLog[existIdx] = liveData;
    } else {
      orientationQuizEngine.liveProgressLog.push(liveData);
    }

    // ⚡ 2. ส่งสัญญาณ Broadcast ทันที (0ms ให้ทุกแท็บที่เปิดแดชบอร์ดอยู่แสดงผลทันที)
    if (syncChannel) {
      syncChannel.postMessage({ type: 'LIVE_UPDATE', empId: empId, liveData: liveData });
    }

    // ⚡ 3. หาก Admin ล็อกอินอยู่ในแท็บนี้และเปิดหน้าแดชบอร์ดอยู่ ให้เรนเดอร์แดชบอร์ดทันที (0ms)
    if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
      renderDashboard();
    }

    // 🌐 4. ส่งขึ้น Google Apps Script เบื้องหลัง (ลด debounce เหลือ 150ms เพื่อความรวดเร็ว)
    clearTimeout(liveSyncTimeout);
    liveSyncTimeout = setTimeout(() => sendLiveProgressSync(liveData), 150);
  }

  async function sendLiveProgressSync(liveData) {
    if (!googleScriptUrl || !liveData) return;

    const payload = {
      action: 'syncLiveProgress',
      ...liveData
    };

    try {
      fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(err => {
        // Non-blocking background catch
      });
    } catch (e) {
      // Non-blocking
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

    // 🌟 1. ลำดับข้อสอบตามหน้าจอ (Screen Order 1..25)
    const screenAnswers = scoreResult.details.map((d, idx) => ({
      screenQ: idx + 1,
      screenNumber: idx + 1,
      q: d.questionId,
      questionId: d.questionId,
      questionText: d.questionText || '',
      ans: d.userAnswer,
      correct: d.correctAnswer,
      score: d.itemScore,
      isCorrect: (d.userAnswer === d.correctAnswer),
      explanation: d.explanation || ''
    }));

    // 🌟 2. จัดเรียงคำตอบข้อ 1 ถึง 25 ตามลำดับ Canonical ID สำหรับส่งออกชีตทางการแนว Socrative
    const sortedDetails = [...scoreResult.details].sort((a, b) => a.questionId - b.questionId);
    const answersPayload = sortedDetails.map(d => ({
      q: d.questionId,
      questionId: d.questionId,
      screenQ: d.screenNumber,
      questionText: d.questionText || '',
      ans: d.userAnswer,
      correct: d.correctAnswer,
      score: d.itemScore,
      isCorrect: (d.userAnswer === d.correctAnswer),
      explanation: d.explanation || ''
    }));

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
      attemptNumber: scoreResult.attemptNumber,
      screenAnswers: screenAnswers,
      canonicalAnswers: answersPayload,
      answers: screenAnswers // ค่าเริ่มต้นให้ answers เป็น screen order
    };
    orientationQuizEngine.recordSubmission(submissionRecord);
    clearLiveSessionLocally(orientationQuizEngine.currentUser.empId);

    renderResultsScreen(scoreResult);
    switchScreen(screenResult);

    // Send payload to Google Sheets (ทั้ง Canonical และ Screen Order)
    await sendResultToGoogleSheets(scoreResult, answersPayload, screenAnswers);
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

  async function sendResultToGoogleSheets(result, answersPayload, screenAnswers) {
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
      answers: answersPayload || result.details.map(d => ({ q: d.questionId, ans: d.userAnswer, score: d.itemScore, isCorrect: d.userAnswer === d.correctAnswer })),
      canonicalAnswers: answersPayload || result.details.map(d => ({ q: d.questionId, ans: d.userAnswer, score: d.itemScore, isCorrect: d.userAnswer === d.correctAnswer })),
      screenAnswers: screenAnswers || result.details.map((d, idx) => ({ screenQ: idx + 1, q: d.questionId, ans: d.userAnswer, isCorrect: d.isCorrect, score: d.itemScore }))
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

  // ==========================================
  // RESET & EXIT HANDLERS (ล้างสถานะเพื่อเริ่มใหม่)
  // ==========================================
  // 🚪 ตรวจจับเมื่อพนักงานออกจากหน้าข้อสอบ (ปิดแท็บ / ปิดเบราว์เซอร์ / รีเฟรช / สลับหน้า)
  // ให้ถือว่าออกจากการทำข้อสอบทันที: ลบออกจากสถานะ "กำลังทำ" บนแดชบอร์ดอัตโนมัติ โดยไม่ต้องรอให้กดปุ่ม
  function notifyAutoExitExam() {
    if (!orientationQuizEngine || !orientationQuizEngine.currentUser || !orientationQuizEngine.currentUser.empId) return;
    if (orientationQuizEngine.isExamSubmitted) return; // ถ้าส่งข้อสอบแล้ว ไม่ต้องรีเซ็ต

    const empId = orientationQuizEngine.currentUser.empId;

    // 1. ล้างสถานะเครื่อง Local ทันที
    clearLiveSessionLocally(empId);
    orientationQuizEngine.clearEmployeeLiveProgress(empId);

    // 2. Broadcast ไปยังแดชบอร์ดแท็บอื่นทันที (0ms)
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'RESET_LIVE', empId: empId });
      } catch(e) {}
    }

    // 3. ส่งคำสั่งรีเซ็ตไปยัง Google Apps Script เบื้องหลัง
    if (googleScriptUrl) {
      const payload = JSON.stringify({ action: 'resetLiveProgress', empId: empId });
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
        navigator.sendBeacon(googleScriptUrl, blob);
      } else {
        fetch(googleScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: payload,
          keepalive: true
        }).catch(() => {});
      }
    }
  }

  function handleExitAndResetExam() {
    if (!orientationQuizEngine.currentUser) {
      switchScreen(screenLogin);
      return;
    }
    const empId = orientationQuizEngine.currentUser.empId;
    const fullName = orientationQuizEngine.currentUser.fullName || empId;

    if (!confirm(`คุณต้องการออกจากห้องสอบและเริ่มใหม่ใช่หรือไม่?\n\n(คำตอบที่ทำไว้จะถูกล้างออก เพื่อให้คุณหรือแอดมินเริ่มทำใหม่ตั้งแต่ข้อแรกได้อย่างสะอาดตา)`)) {
      return;
    }

    // 1. ล้างข้อมูลเครื่อง Local ทันที
    clearLiveSessionLocally(empId);
    orientationQuizEngine.clearEmployeeLiveProgress(empId);
    orientationQuizEngine.currentUser = null;
    orientationQuizEngine.userAnswers = {};

    // 2. แจ้งเตือน Broadcast ไปยังแท็บอื่นแบบ 0ms
    if (syncChannel) {
      syncChannel.postMessage({ type: 'RESET_LIVE', empId: empId });
    }

    // 3. ส่งคำสั่งรีเซ็ตไปยัง Google Apps Script (เบื้องหลัง)
    if (googleScriptUrl) {
      fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'resetLiveProgress', empId: empId })
      }).catch(() => {});
    }

    alert("ออกจากห้องสอบและล้างสถานะข้อสอบเรียบร้อยแล้วค่ะ คุณสามารถเข้าสู่ระบบเพื่อเริ่มทำใหม่ได้ทันที");
    switchScreen(screenLogin);
    inputEmpId.value = '';
    inputFullName.value = '';
    inputDepartment.value = '';
    pastAttemptBanner.classList.add('hidden');
  }

  function resetEmployeeLiveProgress(empId, fullName) {
    if (!empId) return;
    const nameDisplay = fullName || empId;
    if (!confirm(`ต้องการรีเซ็ตสถานะของ "${nameDisplay}" (${empId}) เป็น "เริ่มใหม่" หรือไม่?\n\n(คำตอบที่ค้างอยู่จะถูกล้างออก และสถานะจะกลับเป็นยังไม่ทำ เพื่อให้พนักงานเริ่มทำใหม่ได้)`)) {
      return;
    }

    // 1. ล้าง Local
    clearLiveSessionLocally(empId);
    orientationQuizEngine.clearEmployeeLiveProgress(empId);

    // 2. Broadcast ทันที
    if (syncChannel) {
      syncChannel.postMessage({ type: 'RESET_LIVE', empId: empId });
    }

    // 3. เรนเดอร์แดชบอร์ดทันที (0ms ไม่ต้องรอรีเฟรช)
    if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
      renderDashboard();
    }

    // 4. ส่งไปลบในชีตความคืบหน้าเรียลไทม์
    if (googleScriptUrl) {
      fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'resetLiveProgress', empId: empId })
      }).catch(() => {});
    }
  }

  function resetAllLiveProgress() {
    if (!confirm("คุณต้องการล้างสถานะข้อสอบที่ค้างอยู่ของพนักงานทุกคนหรือไม่?\n\n(สถานะ 'กำลังสอบ' ทั้งหมดจะถูกล้างกลับเป็น 'ยังไม่ทำ' เพื่อให้ทุกคนเริ่มทำใหม่ได้)")) {
      return;
    }

    // 1. ล้าง Local storage ทุกรายการที่ขึ้นต้นด้วย orientation_live_
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('orientation_live_')) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem('orientation_live_ping', Date.now().toString());
    } catch(e) {}

    orientationQuizEngine.clearEmployeeLiveProgress('ALL');

    // 2. Broadcast ทันที
    if (syncChannel) {
      syncChannel.postMessage({ type: 'RESET_LIVE', empId: 'ALL' });
    }

    // 3. เรนเดอร์แดชบอร์ดทันที
    if (isAdminLoggedIn && !screenDashboard.classList.contains('hidden')) {
      renderDashboard();
    }

    // 4. ส่งไปลบในชีต Google Sheets
    if (googleScriptUrl) {
      fetch(googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'resetLiveProgress', empId: 'ALL' })
      }).catch(() => {});
    }

    alert("ล้างสถานะค้างทั้งหมดเรียบร้อยแล้วค่ะ");
  }

  /**
   * DASHBOARD CONTROLLER & SOCRATIVE TABLE RENDERER
   * รองรับ 2 โหมด:
   * 1. ตารางภาพรวม (Overview Mode)
   * 2. ตารางตรวจคำตอบข้อ 1 - 25 สไตล์ Socrative (Socrative Matrix Mode)
   * พร้อม Item Analysis % ความถูกต้องรายข้อ 1 - 25
   */
  function renderDashboard() {
    const search = (dashSearchInput.value || '').trim().toLowerCase();
    const filterStatus = dashFilterStatus.value;

    // 1. รวบรวมรายชื่อพนักงานทั้งหมด
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

    // นำประวัติการส่งข้อสอบมาจับคู่กับพนักงาน
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

    // 2. ประเมินผลสถานะและดึงคำตอบล่าสุดของแต่ละคน
    const evaluatedList = [];
    rosterMap.forEach((person) => {
      const subs = person.submissions;
      const hasTaken = subs.length > 0;

      // ตรวจสอบความคืบหน้าแบบสด (Real-time Live Progress)
      const cleanId = orientationQuizEngine.cleanEmpId(person.empId);
      // 1) เช็คจาก Local Storage (ทำงานทันที 0ms ข้ามแท็บ / เครื่องเดียวกัน)
      const localLive = getLiveSessionLocally(person.empId);
      // 2) เช็คจาก Google Sheet Backend (สำหรับการใช้งานข้ามอุปกรณ์/มือถือ)
      const remoteLive = orientationQuizEngine.getEmployeeLiveProgress(person.empId);
      // 3) เช็คจาก In-memory Session
      let memLive = null;
      if (orientationQuizEngine.currentUser && orientationQuizEngine.currentUser.empId) {
        if (orientationQuizEngine.cleanEmpId(orientationQuizEngine.currentUser.empId) === cleanId) {
          const mScore = orientationQuizEngine.calculateScore();
          const mAnsCount = orientationQuizEngine.getAnsweredCount();
          if (mAnsCount > 0) {
            const mScreenAns = mScore.details.map((d, idx) => ({
              screenQ: idx + 1,
              screenNumber: idx + 1,
              q: d.questionId,
              questionId: d.questionId,
              questionText: d.questionText || '',
              ans: d.userAnswer,
              correct: d.correctAnswer,
              score: d.itemScore,
              isCorrect: d.isCorrect,
              status: d.status,
              explanation: d.explanation || ''
            }));
            const mCanonAns = [...mScore.details].sort((a, b) => a.questionId - b.questionId).map(d => ({
              q: d.questionId,
              questionId: d.questionId,
              screenQ: d.screenNumber,
              questionText: d.questionText || '',
              ans: d.userAnswer,
              correct: d.correctAnswer,
              score: d.itemScore,
              isCorrect: d.isCorrect,
              status: d.status,
              explanation: d.explanation || ''
            }));

            memLive = {
              currentScore: mScore.totalScore,
              maxScore: mScore.maxScore,
              answeredCount: mAnsCount,
              attemptNumber: orientationQuizEngine.currentUser.attemptNumber || (subs.length + 1),
              isSubmitted: false,
              screenAnswers: mScreenAns,
              canonicalAnswers: mCanonAns,
              answers: mScreenAns
            };
          }
        }
      }

      // 🌟 เลือกระเบียนข้อมูลสดที่ใหม่และมีจำนวนข้อที่ตอบมากที่สุด (Most Complete & Recent)
      const candidates = [localLive, remoteLive, memLive].filter(Boolean);
      let liveRec = null;
      if (candidates.length > 0) {
        // เรียงตามจำนวนข้อที่ตอบมากที่สุด (answeredCount) เพื่อให้ได้ข้อมูลสดล่าสุดเสมอ
        candidates.sort((a, b) => (b.answeredCount || 0) - (a.answeredCount || 0));
        liveRec = candidates[0];
      }
      const isLiveActive = liveRec && (!liveRec.isSubmitted);

      let status = 'PENDING';
      let latestScore = null;
      let latestMaxScore = 25;
      let latestPercent = null;
      let latestAttempt = 0;
      let latestTimestamp = '-';
      let latestScreenAnswers = [];
      let latestCanonicalAnswers = [];
      let latestAnswers = [];
      let answeredCount = 0;

      if (isLiveActive) {
        status = 'IN_PROGRESS';
        latestScore = liveRec.currentScore !== undefined ? liveRec.currentScore : 0;
        latestMaxScore = 25;
        latestPercent = Math.round((latestScore / latestMaxScore) * 100);
        latestAttempt = liveRec.attemptNumber || (subs.length + 1);
        answeredCount = liveRec.answeredCount || 0;
        latestTimestamp = `กำลังทำข้อสอบสด (${answeredCount}/25)`;

        let liveScreenAnswers = [];
        let liveCanonicalAnswers = [];

        if (Array.isArray(liveRec.screenAnswers) && liveRec.screenAnswers.length > 0) {
          liveScreenAnswers = liveRec.screenAnswers;
        } else if (Array.isArray(liveRec.answers)) {
          liveScreenAnswers = liveRec.answers;
        }

        if (Array.isArray(liveRec.canonicalAnswers) && liveRec.canonicalAnswers.length > 0) {
          liveCanonicalAnswers = liveRec.canonicalAnswers;
        } else if (Array.isArray(liveScreenAnswers) && liveScreenAnswers.length > 0) {
          liveCanonicalAnswers = [...liveScreenAnswers].filter(a => a && (a.q || a.questionId)).sort((a, b) => (a.q || a.questionId) - (b.q || b.questionId));
        }

        latestScreenAnswers = liveScreenAnswers;
        latestCanonicalAnswers = liveCanonicalAnswers;
        latestAnswers = liveScreenAnswers;
      } else if (hasTaken) {
        const latestSub = subs[0];
        latestScore = latestSub.score;
        latestMaxScore = latestSub.maxScore || 25;
        latestPercent = Math.round((latestScore / latestMaxScore) * 100);
        latestAttempt = subs.length;
        latestTimestamp = latestSub.timestamp || '-';
        answeredCount = 25;

        latestScreenAnswers = Array.isArray(latestSub.screenAnswers) && latestSub.screenAnswers.length > 0 
          ? latestSub.screenAnswers 
          : (Array.isArray(latestSub.answers) ? latestSub.answers : []);
        latestCanonicalAnswers = Array.isArray(latestSub.canonicalAnswers) && latestSub.canonicalAnswers.length > 0 
          ? latestSub.canonicalAnswers 
          : (Array.isArray(latestSub.answers) ? latestSub.answers : []);
        latestAnswers = latestScreenAnswers.length > 0 ? latestScreenAnswers : latestSub.answers;

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
        answeredCount: answeredCount,
        latestTimestamp: latestTimestamp,
        screenAnswers: latestScreenAnswers,
        canonicalAnswers: latestCanonicalAnswers,
        answers: latestScreenAnswers.length > 0 ? latestScreenAnswers : latestAnswers
      });
    });

    // 3. คำนวณภาพรวม 4 เมตริก
    const totalCount = evaluatedList.length;
    const passCount = evaluatedList.filter(e => e.status === 'PASS').length;
    const failCount = evaluatedList.filter(e => e.status === 'FAIL').length;
    const liveCount = evaluatedList.filter(e => e.status === 'IN_PROGRESS').length;
    const pendingCount = evaluatedList.filter(e => e.status === 'PENDING').length;

    const passPct = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : '0.0';
    const failPct = totalCount > 0 ? ((failCount / totalCount) * 100).toFixed(1) : '0.0';
    const pendingPct = totalCount > 0 ? (((pendingCount + liveCount) / totalCount) * 100).toFixed(1) : '0.0';

    dashTotalEmp.textContent = `${totalCount} คน`;
    dashPassCount.textContent = `${passCount} คน (${passPct}%)`;
    dashFailCount.textContent = `${failCount} คน (${failPct}%)`;
    if (liveCount > 0) {
      dashPendingCount.innerHTML = `<span style="color:#0284c7; font-weight:700;"><i class="fa-solid fa-spinner fa-spin"></i> กำลังสอบ ${liveCount} คน</span> | รอ ${pendingCount} คน`;
    } else {
      dashPendingCount.textContent = `${pendingCount} คน (${pendingPct}%)`;
    }

    // 4. สรุปความถูกต้องรายข้อแนว Socrative (Item Analysis)
    renderSocrativeItemAnalysis(evaluatedList);

    // 5. ตัวกรองและการค้นหา
    const filteredList = evaluatedList.filter(item => {
      const matchSearch = !search ||
        (item.empId && item.empId.toLowerCase().includes(search)) ||
        (item.fullName && item.fullName.toLowerCase().includes(search)) ||
        (item.department && item.department.toLowerCase().includes(search));

      const matchFilter = filterStatus === 'ALL' || item.status === filterStatus;

      return matchSearch && matchFilter;
    });

    // 6. แสดงผลตาราง (Overview หรือ Socrative Matrix)
    renderTableViews(filteredList);
  }

  /**
   * 📊 Socrative Item Analysis (% ถูกรายข้อ 1 - 25 ตามโจทย์หลักสูตร Canonical ID)
   */
  function renderSocrativeItemAnalysis(evaluatedList) {
    if (!socrativeAnalysisGrid) return;
    socrativeAnalysisGrid.innerHTML = '';

    const testTakers = evaluatedList.filter(e => e.status !== 'PENDING');
    const takersCount = testTakers.length;

    for (let qId = 1; qId <= 25; qId++) {
      let correct = 0;
      let wrong = 0;
      let answeredCount = 0;

      if (takersCount > 0) {
        testTakers.forEach(t => {
          let ansObj = null;
          if (Array.isArray(t.canonicalAnswers) && t.canonicalAnswers.length > 0) {
            ansObj = t.canonicalAnswers.find(a => (a.q === qId || a.questionId === qId));
          }
          if (!ansObj && Array.isArray(t.answers)) {
            ansObj = t.answers.find(a => (a.q === qId || a.questionId === qId));
          }
          if (!ansObj && Array.isArray(t.screenAnswers)) {
            ansObj = t.screenAnswers.find(a => (a.q === qId || a.questionId === qId));
          }

          if (ansObj && ansObj.ans !== undefined && ansObj.ans !== null) {
            answeredCount++;
            if (ansObj.isCorrect === true || ansObj.score === 1) {
              correct++;
            } else {
              wrong++;
            }
          }
        });
      }

      const pct = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;
      let chipClass = 'chip-na';
      if (answeredCount > 0) {
        if (pct >= 80) chipClass = 'chip-high';
        else if (pct >= 50) chipClass = 'chip-med';
        else chipClass = 'chip-low'; // สีแดงเด่นชัดเมื่อ % ถูกต่ำกว่า 50%
      }

      const qData = orientationQuizEngine.questions.find(q => q.id === qId);
      const qText = qData ? qData.question : `ข้อที่ ${qId}`;
      const qKey = qData ? (qData.answer ? 'ถูก (True)' : 'ผิด (False)') : '-';

      const chip = document.createElement('div');
      chip.className = `socrative-chip ${chipClass}`;
      chip.title = `ข้อ ${qId}: ${qText}\nเฉลย: ${qKey}\nตอบถูก: ${correct}/${answeredCount} คน (${answeredCount > 0 ? pct + '%' : 'ยังไม่มีคนตอบ'})\nคลิกเพื่อดูรายละเอียด`;
      chip.innerHTML = `
        <span class="chip-q-num">ข้อ ${qId}</span>
        <span class="chip-pct">${answeredCount > 0 ? pct + '%' : '-'}</span>
      `;
      chip.addEventListener('click', () => {
        alert(
          `📊 สถิติวิเคราะห์รายข้อตามหลักสูตร - ข้อที่ ${qId}\n\n` +
          `โจทย์ข้อสอบ: ${qText}\n\n` +
          `เฉลยที่ถูกต้อง: ${qKey}\n` +
          `-----------------------------------\n` +
          `จำนวนคนที่ตอบข้อนี้แล้ว: ${answeredCount} คน (จากผู้เข้าสอบ ${takersCount} คน)\n` +
          `ตอบถูกต้อง: ${correct} คน (${pct}%)\n` +
          `ตอบผิด: ${wrong} คน (${100 - pct}%)\n\n` +
          (qData && qData.explanation ? `คำอธิบายเฉลย: ${qData.explanation}` : '')
        );
      });
      socrativeAnalysisGrid.appendChild(chip);
    }
  }

  /**
   * แสดงผลตาราง 2 โหมด: Overview และ Socrative Grid
   */
  function renderTableViews(filteredList) {
    if (!dashTableHead || !dashTableBody) return;

    if (currentDashboardView === 'overview') {
      // 1. Overview Table Header
      dashTableHead.innerHTML = `
        <tr>
          <th>ลำดับ</th>
          <th>รหัสพนักงาน</th>
          <th>ชื่อ - นามสกุล</th>
          <th>แผนก</th>
          <th>สถานะผลสอบ</th>
          <th>คะแนนล่าสุด</th>
          <th>คิดเป็น %</th>
          <th>รอบที่ทำสอบ</th>
          <th>วัน-เวลาที่ส่งล่าสุด</th>
          <th style="text-align:center;">ตรวจคำตอบ 25 ข้อ</th>
        </tr>
      `;
      if (dashTableFoot) dashTableFoot.classList.add('hidden');

      dashTableBody.innerHTML = '';
      if (filteredList.length === 0) {
        dashTableBody.innerHTML = `
          <tr>
            <td colspan="10" class="text-center" style="padding: 2.5rem; color: #64748b;">
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
        } else if (row.status === 'IN_PROGRESS') {
          statusBadge = `<span class="badge-status-live"><i class="fa-solid fa-spinner fa-spin"></i> กำลังสอบ (${row.answeredCount || 0}/25)</span>`;
          scoreText = `<strong style="color:#0284c7;">${row.score}</strong> / ${row.maxScore} <small style="color:#64748b;">(สด)</small>`;
          percentText = `<strong style="color:#0284c7;">${row.percentage}%</strong>`;
          attemptText = `<span class="badge-pill bg-primary-soft">รอบที่ ${row.attemptCount} (กำลังทำ)</span>`;
        } else {
          statusBadge = `<span class="badge-status-pending"><i class="fa-solid fa-clock"></i> ยังไม่เสร็จ / ยังไม่สอบ</span>`;
          scoreText = `<span class="text-muted">-</span>`;
          percentText = `<span class="text-muted">-</span>`;
          attemptText = `<span class="badge-pill bg-neutral">ยังไม่ได้ทำ</span>`;
        }

        let actionBtn = `<span class="text-muted" style="font-size:0.85rem;">-</span>`;
        if (row.status === 'IN_PROGRESS') {
          actionBtn = `
            <div style="display:inline-flex; gap:4px; align-items:center; justify-content:center;">
              <button type="button" class="btn btn-outline btn-sm btn-view-emp-q" data-empid="${row.empId}"><i class="fa-solid fa-file-lines"></i> ดูคำตอบสด</button>
              <button type="button" class="btn btn-outline-danger btn-sm btn-reset-emp-live" data-empid="${row.empId}" data-fullname="${escapeHtml(row.fullName)}" title="รีเซ็ตสถานะเป็นเริ่มใหม่ (ล้างคำตอบที่ค้าง)"><i class="fa-solid fa-rotate-left"></i> รีเซ็ตเริ่มใหม่</button>
            </div>
          `;
        } else if (row.status !== 'PENDING') {
          actionBtn = `<button type="button" class="btn btn-outline btn-sm btn-view-emp-q" data-empid="${row.empId}"><i class="fa-solid fa-file-lines"></i> ตรวจ 25 ข้อ</button>`;
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
          <td style="text-align:center;">${actionBtn}</td>
        `;

        const btnView = tr.querySelector('.btn-view-emp-q');
        if (btnView) {
          btnView.addEventListener('click', () => showEmployeeSocrativeDetail(row));
        }
        const btnReset = tr.querySelector('.btn-reset-emp-live');
        if (btnReset) {
          btnReset.addEventListener('click', (e) => {
            e.stopPropagation();
            resetEmployeeLiveProgress(row.empId, row.fullName);
          });
        }

        dashTableBody.appendChild(tr);
      });

    } else {
      // 2. Socrative Matrix Table View (แสดงรายข้อ 1 - 25 ชัดเจน)
      let headHtml = `
        <tr>
          <th>ลำดับ</th>
          <th>รหัส</th>
          <th>ชื่อ - นามสกุล</th>
          <th>แผนก</th>
          <th>คะแนน</th>
          <th>%</th>
          <th>สถานะ</th>
      `;
      for (let q = 1; q <= 25; q++) {
        headHtml += `<th style="text-align:center; min-width: 44px;" title="ข้อที่ ${q}">ข้อ ${q}</th>`;
      }
      headHtml += `<th style="text-align:center;">ตรวจละเอียด</th></tr>`;
      dashTableHead.innerHTML = headHtml;

      dashTableBody.innerHTML = '';
      if (filteredList.length === 0) {
        dashTableBody.innerHTML = `
          <tr>
            <td colspan="33" class="text-center" style="padding: 2.5rem; color: #64748b;">
              <i class="fa-solid fa-inbox" style="font-size: 2.2rem; display: block; margin-bottom: 0.6rem; color: #94a3b8;"></i>
              ไม่พบข้อมูลตามเงื่อนไขที่เลือก
            </td>
          </tr>
        `;
        if (dashTableFoot) dashTableFoot.classList.add('hidden');
        return;
      }

      // วนลูปสร้างแถวพนักงานแต่ละคนในตาราง Socrative
      filteredList.forEach((row, idx) => {
        const tr = document.createElement('tr');

        let statusBadge = '';
        let scoreText = row.score !== null ? `<strong style="color:#0369a1;">${row.score}</strong>/25` : '-';
        let percentText = row.percentage !== null ? `<strong>${row.percentage}%</strong>` : '-';

        if (row.status === 'PASS') {
          statusBadge = `<span class="badge-status-pass" style="padding:0.2rem 0.5rem; font-size:0.75rem;">ผ่าน</span>`;
        } else if (row.status === 'FAIL') {
          statusBadge = `<span class="badge-status-fail" style="padding:0.2rem 0.5rem; font-size:0.75rem;">ไม่ผ่าน</span>`;
        } else if (row.status === 'IN_PROGRESS') {
          statusBadge = `<span class="badge-status-live" style="padding:0.2rem 0.5rem; font-size:0.75rem;"><i class="fa-solid fa-spinner fa-spin"></i> สด (${row.answeredCount || 0}/25)</span>`;
          scoreText = `<strong style="color:#0284c7;">${row.score}</strong>/25`;
          percentText = `<strong style="color:#0284c7;">${row.percentage}%</strong>`;
        } else {
          statusBadge = `<span class="badge-status-pending" style="padding:0.2rem 0.5rem; font-size:0.75rem;">ยังไม่ทำ</span>`;
        }

        let rowHtml = `
          <td>${idx + 1}</td>
          <td><strong>${row.empId}</strong></td>
          <td style="white-space:nowrap;">${row.fullName}</td>
          <td>${row.department}</td>
          <td>${scoreText}</td>
          <td>${percentText}</td>
          <td>${statusBadge}</td>
        `;

        // สร้างช่องสัญลักษณ์ Socrative สำหรับข้อ 1 - 25 ตามลำดับหน้าจอ (Screen Order 1-25)
        for (let q = 1; q <= 25; q++) {
          let item = null;
          if (Array.isArray(row.screenAnswers)) {
            item = row.screenAnswers.find(a => (a && (a.screenQ === q || a.screenNumber === q)));
          }
          if (!item && Array.isArray(row.answers)) {
            item = row.answers.find(a => (a && (a.screenQ === q || a.screenNumber === q)));
          }
          if (!item && Array.isArray(row.screenAnswers) && row.screenAnswers.length === 25) {
            item = row.screenAnswers[q - 1];
          }

          const hasAnswered = item && item.ans !== undefined && item.ans !== null;

          if (!hasAnswered || row.status === 'PENDING') {
            // ข้อที่ยังไม่ได้ตอบ ให้แสดงเป็นค่าว่าง (Blank) สะอาดตา ไม่ใส่เครื่องหมายใดๆ
            rowHtml += `<td style="text-align:center;"><span class="socrative-cell blank" title="ข้อที่ ${q} บนหน้าจอ: ยังไม่ได้ตอบ">&nbsp;</span></td>`;
          } else {
            const isRight = (item.isCorrect === true || item.score === 1);
            const uAnsStr = item.ans === true ? 'ถูก' : (item.ans === false ? 'ผิด' : '');
            const qTitle = item.questionText ? ` (${item.questionText.slice(0, 30)}...)` : (item.q ? ` (โจทย์ ID: ${item.q})` : '');
            if (isRight) {
              rowHtml += `<td style="text-align:center;"><span class="socrative-cell pass" title="ข้อที่ ${q} บนหน้าจอ: ถูก${qTitle} (ตอบ: ${uAnsStr})">✓</span></td>`;
            } else {
              rowHtml += `<td style="text-align:center;"><span class="socrative-cell fail" title="ข้อที่ ${q} บนหน้าจอ: ผิด${qTitle} (ตอบ: ${uAnsStr})">✗</span></td>`;
            }
          }
        }

        let actionBtn = `<span class="text-muted">-</span>`;
        if (row.status === 'IN_PROGRESS') {
          actionBtn = `
            <div style="display:inline-flex; gap:3px; align-items:center; justify-content:center;">
              <button type="button" class="btn btn-outline btn-sm btn-view-emp-q" data-empid="${row.empId}" title="ดูคำตอบสด"><i class="fa-solid fa-eye"></i></button>
              <button type="button" class="btn btn-outline-danger btn-sm btn-reset-emp-live" data-empid="${row.empId}" data-fullname="${escapeHtml(row.fullName)}" title="รีเซ็ตสถานะเป็นเริ่มใหม่ (ล้างคำตอบที่ค้าง)" style="padding:0.2rem 0.45rem;"><i class="fa-solid fa-rotate-left"></i></button>
            </div>
          `;
        } else if (row.status !== 'PENDING') {
          actionBtn = `<button type="button" class="btn btn-outline btn-sm btn-view-emp-q" data-empid="${row.empId}"><i class="fa-solid fa-eye"></i></button>`;
        }

        rowHtml += `<td style="text-align:center;">${actionBtn}</td>`;
        tr.innerHTML = rowHtml;

        const btnView = tr.querySelector('.btn-view-emp-q');
        if (btnView) {
          btnView.addEventListener('click', () => showEmployeeSocrativeDetail(row));
        }
        const btnReset = tr.querySelector('.btn-reset-emp-live');
        if (btnReset) {
          btnReset.addEventListener('click', (e) => {
            e.stopPropagation();
            resetEmployeeLiveProgress(row.empId, row.fullName);
          });
        }

        dashTableBody.appendChild(tr);
      });

      // 3. แถวสรุปท้ายตารางแนว Socrative (Screen Order Accuracy %)
      if (dashTableFoot) {
        const testTakers = filteredList.filter(e => e.status !== 'PENDING');
        const takersCount = testTakers.length;

        let footHtml = `
          <tr class="socrative-summary-row">
            <td colspan="7" style="text-align:right; font-weight:700; color:#0369a1;">
              <i class="fa-solid fa-chart-column"></i> % ตอบถูกตามลำดับข้อ (Screen Order):
            </td>
        `;

        for (let q = 1; q <= 25; q++) {
          let correct = 0;
          let answeredInSlot = 0;
          if (takersCount > 0) {
            testTakers.forEach(t => {
              let item = null;
              if (Array.isArray(t.screenAnswers) && t.screenAnswers.length >= q) {
                item = t.screenAnswers[q - 1];
              } else if (Array.isArray(t.answers)) {
                item = t.answers.find(a => (a.screenQ === q || a.screenNumber === q)) || t.answers[q - 1];
              }
              if (item && item.ans !== undefined && item.ans !== null) {
                answeredInSlot++;
                if (item.isCorrect === true || item.score === 1) {
                  correct++;
                }
              }
            });
          }
          const pct = answeredInSlot > 0 ? Math.round((correct / answeredInSlot) * 100) : 0;
          let colorStyle = '#94a3b8';
          if (answeredInSlot > 0) {
            if (pct >= 80) colorStyle = '#059669';
            else if (pct >= 50) colorStyle = '#d97706';
            else colorStyle = '#dc2626';
          }
          footHtml += `<td style="text-align:center; font-weight:800; color:${colorStyle};" title="ข้อที่ ${q} บนหน้าจอ: ตอบถูก ${correct}/${answeredInSlot} คน">${answeredInSlot > 0 ? pct + '%' : '-'}</td>`;
        }

        footHtml += `<td></td></tr>`;
        dashTableFoot.innerHTML = footHtml;
        dashTableFoot.classList.remove('hidden');
      }
    }
  }

  /**
   * 👁️ Modal ผลการสอบ 25 ข้อ รายบุคคลแนว Socrative
   */
  function showEmployeeSocrativeDetail(person) {
    if (!modalEmployeeDetail) return;

    modalEmpDetailTitle.innerHTML = `<i class="fa-solid fa-file-lines text-primary"></i> ผลสอบ 25 ข้อแนว Socrative: ${person.fullName}`;
    modalEmpDetailSubtitle.textContent = `รหัสพนักงาน: ${person.empId} | แผนก: ${person.department} | รอบที่ทำ: ครั้งที่ ${person.attemptCount || 1}`;

    const isPassed = person.status === 'PASS';
    const isLive = person.status === 'IN_PROGRESS';
    let statusBadgeHtml = '';
    if (isLive) {
      statusBadgeHtml = `<span class="badge-status-live" style="margin-left:0.75rem; font-size:0.95rem; padding:0.35rem 0.9rem;"><i class="fa-solid fa-spinner fa-spin"></i> กำลังสอบสด (${person.answeredCount || 0}/25)</span>`;
    } else {
      statusBadgeHtml = `<span class="badge-pill ${isPassed ? 'bg-success' : 'bg-danger'}" style="margin-left:0.75rem; font-size:1rem; padding:0.35rem 1rem;">
        ${isPassed ? '✓ ผ่านเกณฑ์ (≥ 80%)' : '✗ ยังไม่ผ่านเกณฑ์'}
      </span>`;
    }

    modalEmpDetailMeta.innerHTML = `
      <div class="emp-detail-score-box">
        <span class="score-big">${person.score !== null ? person.score : 0}</span>
        <span style="font-size:1.4rem; color:#64748b;">/ 25</span>
        ${statusBadgeHtml}
      </div>
      <div>
        <div style="font-size:1.15rem; font-weight:700; color:#0369a1;">คิดเป็น ${person.percentage !== null ? person.percentage : 0}%</div>
        <small class="text-muted">${isLive ? 'สถานะ: กำลังตอบข้อสอบสด' : 'ส่งเมื่อ: ' + (person.latestTimestamp || '-')}</small>
      </div>
    `;

    // ดึงรายการคำตอบ (ถ้ามี Screen Order ให้ใช้ Screen Order แสดงผล)
    modalEmpDetailList.innerHTML = '';
    const screenList = (Array.isArray(person.screenAnswers) && person.screenAnswers.length > 0)
      ? person.screenAnswers
      : (Array.isArray(person.answers) && person.answers.length > 0 && person.answers[0].screenQ !== undefined)
        ? person.answers
        : null;

    if (screenList && screenList.length > 0) {
      screenList.forEach((item, idx) => {
        const screenNum = item.screenNumber || item.screenQ || (idx + 1);
        const qId = item.q || item.questionId || (idx + 1);
        const qData = orientationQuizEngine.questions.find(q => q.id === qId);
        const qText = item.questionText || (qData ? qData.question : `ข้อที่ ${qId}`);
        const qExp = item.explanation || (qData ? qData.explanation : '');
        const qCorrectBool = item.correct !== undefined ? item.correct : (qData ? qData.answer : null);

        const hasAnswered = item.ans !== undefined && item.ans !== null;
        const userAnsVal = item.ans;
        const isCorrect = hasAnswered ? (item.isCorrect === true || item.score === 1) : false;

        const userAnsStr = !hasAnswered ? '<span style="color:#94a3b8; font-style:italic;">- (ยังไม่ได้ตอบ - ว่าง) -</span>' : (userAnsVal === true ? 'ถูก (True)' : 'ผิด (False)');
        const correctAnsStr = qCorrectBool === true ? 'ถูก (True)' : (qCorrectBool === false ? 'ผิด (False)' : '-');

        let cardClass = 'emp-q-row';
        let badgeHtml = '';

        if (!hasAnswered) {
          cardClass += ' pending';
          badgeHtml = `<span class="emp-ans-badge" style="background:#f8fafc; color:#64748b; border:1.5px dashed #cbd5e1;"><i class="fa-regular fa-circle"></i> ยังไม่ได้ตอบ (ว่าง)</span>`;
        } else if (isCorrect) {
          cardClass += ' pass';
          badgeHtml = `<span class="emp-ans-badge correct"><i class="fa-solid fa-circle-check"></i> ตอบถูก (+1 คะแนน)</span>`;
        } else {
          cardClass += ' fail';
          badgeHtml = `<span class="emp-ans-badge wrong"><i class="fa-solid fa-circle-xmark"></i> ตอบผิด (0 คะแนน)</span>`;
        }

        const card = document.createElement('div');
        card.className = cardClass;
        card.innerHTML = `
          <div class="emp-q-header">
            <span style="color:#0369a1; font-weight:700;"><i class="fa-solid fa-desktop"></i> ข้อที่ ${screenNum} บนหน้าจอ <small style="color:#64748b; font-weight:normal;">(รหัสโจทย์หลักสูตร: #${qId})</small></span>
            ${badgeHtml}
          </div>
          <div class="emp-q-text">${escapeHtml(qText)}</div>
          <div class="emp-q-footer">
            <div>
              <strong>คำตอบของพนักงาน:</strong> 
              <span style="font-weight:700; color:${!hasAnswered ? '#64748b' : (isCorrect ? '#059669' : '#dc2626')};">${userAnsStr}</span>
            </div>
            <div>
              <strong>เฉลยที่ถูกต้อง:</strong> 
              <span style="font-weight:700; color:#0369a1;">${correctAnsStr}</span>
            </div>
          </div>
          ${qExp ? `<div style="font-size:0.85rem; color:#64748b; background:#f8fafc; padding:0.4rem 0.75rem; border-radius:4px; border:1px solid #e2e8f0; margin-top:0.35rem;"><i class="fa-solid fa-lightbulb text-warning"></i> <strong>คำอธิบาย:</strong> ${escapeHtml(qExp)}</div>` : ''}
        `;
        modalEmpDetailList.appendChild(card);
      });
    } else {
      // Map answers by question ID
      const answerMap = {};
      (person.canonicalAnswers || person.answers || []).forEach(a => {
        const qId = a.q !== undefined ? a.q : a.questionId;
        if (qId) answerMap[qId] = a;
      });

      orientationQuizEngine.questions.forEach((q, idx) => {
        const qId = q.id;
        const userAnsObj = answerMap[qId];
        const hasAnswered = userAnsObj !== undefined && userAnsObj.ans !== undefined && userAnsObj.ans !== null;
        const userAnsVal = hasAnswered ? userAnsObj.ans : undefined;
        const isCorrect = hasAnswered ? (userAnsObj.isCorrect === true || userAnsObj.score === 1) : false;

        const userAnsStr = !hasAnswered ? '<span style="color:#94a3b8; font-style:italic;">- (ยังไม่ได้ตอบ - ว่าง) -</span>' : (userAnsVal === true ? 'ถูก (True)' : 'ผิด (False)');
        const correctAnsStr = q.answer === true ? 'ถูก (True)' : 'ผิด (False)';

        let cardClass = 'emp-q-row';
        let badgeHtml = '';

        if (!hasAnswered) {
          cardClass += ' pending';
          badgeHtml = `<span class="emp-ans-badge" style="background:#f8fafc; color:#64748b; border:1.5px dashed #cbd5e1;"><i class="fa-regular fa-circle"></i> ยังไม่ได้ตอบ (ว่าง)</span>`;
        } else if (isCorrect) {
          cardClass += ' pass';
          badgeHtml = `<span class="emp-ans-badge correct"><i class="fa-solid fa-circle-check"></i> ตอบถูก (+1 คะแนน)</span>`;
        } else {
          cardClass += ' fail';
          badgeHtml = `<span class="emp-ans-badge wrong"><i class="fa-solid fa-circle-xmark"></i> ตอบผิด (0 คะแนน)</span>`;
        }

        const card = document.createElement('div');
        card.className = cardClass;
        card.innerHTML = `
          <div class="emp-q-header">
            <span style="color:#0369a1; font-weight:700;">ข้อที่ ${idx + 1} (ข้อสอบ ID: ${qId})</span>
            ${badgeHtml}
          </div>
          <div class="emp-q-text">${escapeHtml(q.question)}</div>
          <div class="emp-q-footer">
            <div>
              <strong>คำตอบของพนักงาน:</strong> 
              <span style="font-weight:700; color:${!hasAnswered ? '#64748b' : (isCorrect ? '#059669' : '#dc2626')};">${userAnsStr}</span>
            </div>
            <div>
              <strong>เฉลยที่ถูกต้อง:</strong> 
              <span style="font-weight:700; color:#0369a1;">${correctAnsStr}</span>
            </div>
          </div>
          ${q.explanation ? `<div style="font-size:0.85rem; color:#64748b; background:#f8fafc; padding:0.4rem 0.75rem; border-radius:4px; border:1px solid #e2e8f0; margin-top:0.35rem;"><i class="fa-solid fa-lightbulb text-warning"></i> <strong>คำอธิบาย:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
        `;
        modalEmpDetailList.appendChild(card);
      });
    }

    modalEmployeeDetail.classList.remove('hidden');
  }

  /**
   * 📥 ดาวน์โหลดผลสอบออกมาเป็นไฟล์ CSV รูปแบบแนว Socrative
   * มีคอลัมน์ข้อ 1 - 25 แยกรายข้อ พร้อมสรุป % ถูกต้อง
   */
  function exportDashboardCsv() {
    const search = (dashSearchInput.value || '').trim().toLowerCase();
    const filterStatus = dashFilterStatus.value;

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

    const evaluatedList = [];
    rosterMap.forEach((person) => {
      const subs = person.submissions;
      const hasTaken = subs.length > 0;

      // ตรวจสอบความคืบหน้าแบบสด (Real-time Live Progress)
      const cleanId = orientationQuizEngine.cleanEmpId(person.empId);
      // 1) เช็คจาก Local Storage (ทำงานทันที 0ms ข้ามแท็บ / เครื่องเดียวกัน)
      const localLive = getLiveSessionLocally(person.empId);
      // 2) เช็คจาก Google Sheet Backend (สำหรับการใช้งานข้ามอุปกรณ์/มือถือ)
      const remoteLive = orientationQuizEngine.getEmployeeLiveProgress(person.empId);
      // 3) เช็คจาก In-memory Session
      let memLive = null;
      if (orientationQuizEngine.currentUser && orientationQuizEngine.currentUser.empId) {
        if (orientationQuizEngine.cleanEmpId(orientationQuizEngine.currentUser.empId) === cleanId) {
          const mScore = orientationQuizEngine.calculateScore();
          const mAnsCount = orientationQuizEngine.getAnsweredCount();
          if (mAnsCount > 0) {
            const mScreenAns = mScore.details.map((d, idx) => ({
              screenQ: idx + 1,
              screenNumber: idx + 1,
              q: d.questionId,
              questionId: d.questionId,
              questionText: d.questionText || '',
              ans: d.userAnswer,
              correct: d.correctAnswer,
              score: d.itemScore,
              isCorrect: d.isCorrect,
              status: d.status,
              explanation: d.explanation || ''
            }));
            const mCanonAns = [...mScore.details].sort((a, b) => a.questionId - b.questionId).map(d => ({
              q: d.questionId,
              questionId: d.questionId,
              screenQ: d.screenNumber,
              questionText: d.questionText || '',
              ans: d.userAnswer,
              correct: d.correctAnswer,
              score: d.itemScore,
              isCorrect: d.isCorrect,
              status: d.status,
              explanation: d.explanation || ''
            }));

            memLive = {
              currentScore: mScore.totalScore,
              maxScore: mScore.maxScore,
              answeredCount: mAnsCount,
              attemptNumber: orientationQuizEngine.currentUser.attemptNumber || (subs.length + 1),
              isSubmitted: false,
              screenAnswers: mScreenAns,
              canonicalAnswers: mCanonAns,
              answers: mScreenAns
            };
          }
        }
      }

      // 🌟 เลือกระเบียนข้อมูลสดที่ใหม่และมีจำนวนข้อที่ตอบมากที่สุด (Most Complete & Recent)
      const candidates = [localLive, remoteLive, memLive].filter(Boolean);
      let liveRec = null;
      if (candidates.length > 0) {
        // เรียงตามจำนวนข้อที่ตอบมากที่สุด (answeredCount) เพื่อให้ได้ข้อมูลสดล่าสุดเสมอ
        candidates.sort((a, b) => (b.answeredCount || 0) - (a.answeredCount || 0));
        liveRec = candidates[0];
      }
      const isLiveActive = liveRec && (!liveRec.isSubmitted);

      let status = 'PENDING';
      let latestScore = null;
      let latestMaxScore = 25;
      let latestPercent = null;
      let latestAttempt = 0;
      let latestTimestamp = '-';
      let latestScreenAnswers = [];
      let latestCanonicalAnswers = [];
      let latestAnswers = [];

      if (isLiveActive) {
        status = 'IN_PROGRESS';
        latestScore = liveRec.currentScore !== undefined ? liveRec.currentScore : 0;
        latestMaxScore = 25;
        latestPercent = Math.round((latestScore / latestMaxScore) * 100);
        latestAttempt = liveRec.attemptNumber || (subs.length + 1);
        latestTimestamp = `กำลังทำข้อสอบสด (${liveRec.answeredCount || 0}/25)`;

        let liveScreenAnswers = [];
        let liveCanonicalAnswers = [];

        if (Array.isArray(liveRec.screenAnswers) && liveRec.screenAnswers.length > 0) {
          liveScreenAnswers = liveRec.screenAnswers;
        } else if (Array.isArray(liveRec.answers)) {
          liveScreenAnswers = liveRec.answers;
        }

        if (Array.isArray(liveRec.canonicalAnswers) && liveRec.canonicalAnswers.length > 0) {
          liveCanonicalAnswers = liveRec.canonicalAnswers;
        } else if (Array.isArray(liveScreenAnswers) && liveScreenAnswers.length > 0) {
          liveCanonicalAnswers = [...liveScreenAnswers].filter(a => a && (a.q || a.questionId)).sort((a, b) => (a.q || a.questionId) - (b.q || b.questionId));
        }

        latestScreenAnswers = liveScreenAnswers;
        latestCanonicalAnswers = liveCanonicalAnswers;
        latestAnswers = liveScreenAnswers;
      } else if (hasTaken) {
        const latestSub = subs[0];
        latestScore = latestSub.score;
        latestMaxScore = latestSub.maxScore || 25;
        latestPercent = Math.round((latestScore / latestMaxScore) * 100);
        latestAttempt = subs.length;
        latestTimestamp = latestSub.timestamp || '-';
        latestScreenAnswers = Array.isArray(latestSub.screenAnswers) && latestSub.screenAnswers.length > 0 
          ? latestSub.screenAnswers 
          : (Array.isArray(latestSub.answers) ? latestSub.answers : []);
        latestCanonicalAnswers = Array.isArray(latestSub.canonicalAnswers) && latestSub.canonicalAnswers.length > 0 
          ? latestSub.canonicalAnswers 
          : (Array.isArray(latestSub.answers) ? latestSub.answers : []);
        latestAnswers = latestScreenAnswers.length > 0 ? latestScreenAnswers : latestSub.answers;
        status = latestScore >= 20 ? 'PASS' : 'FAIL';
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
        latestTimestamp: latestTimestamp,
        screenAnswers: latestScreenAnswers,
        canonicalAnswers: latestCanonicalAnswers,
        answers: latestScreenAnswers.length > 0 ? latestScreenAnswers : latestAnswers
      });
    });

    const filtered = evaluatedList.filter(item => {
      const matchSearch = !search ||
        (item.empId && item.empId.toLowerCase().includes(search)) ||
        (item.fullName && item.fullName.toLowerCase().includes(search)) ||
        (item.department && item.department.toLowerCase().includes(search));
      const matchFilter = filterStatus === 'ALL' || item.status === filterStatus;
      return matchSearch && matchFilter;
    });

    if (filtered.length === 0) {
      alert("ไม่มีข้อมูลที่จะส่งออกตามเงื่อนไขที่เลือก");
      return;
    }

    // 1. หัวตารางคอลัมน์แนว Socrative
    let csv = "\uFEFFลำดับ,รหัสพนักงาน,ชื่อ-นามสกุล,แผนก,สถานะผลสอบ,คะแนนล่าสุด,คะแนนเต็ม,คิดเป็น %,รอบที่ทำ,วัน-เวลาล่าสุด";
    for (let q = 1; q <= 25; q++) {
      csv += `,ข้อ ${q}`;
    }
    csv += "\n";

    // 2. แถวโจทย์คำถาม 25 ข้อ (Question Prompts)
    csv += `"โจทย์คำถาม",,,,,,,,,`;
    for (let qId = 1; qId <= 25; qId++) {
      const qObj = orientationQuizEngine.questions.find(q => q.id === qId);
      const text = qObj ? qObj.question.replace(/"/g, '""') : `ข้อ ${qId}`;
      csv += `,"${text}"`;
    }
    csv += "\n";

    // 3. แถวเฉลยที่ถูกต้อง 25 ข้อ (Correct Answer Keys)
    csv += `"เฉลยที่ถูกต้อง",,,,,,,,,`;
    for (let qId = 1; qId <= 25; qId++) {
      const qObj = orientationQuizEngine.questions.find(q => q.id === qId);
      const keyStr = qObj ? (qObj.answer ? 'ถูก (True)' : 'ผิด (False)') : '-';
      csv += `,"${keyStr}"`;
    }
    csv += "\n";

    // 4. แถวข้อมูลพนักงานแต่ละคน
    filtered.forEach((row, i) => {
      const num = i + 1;
      const empId = `="${row.empId}"`; // ป้องกัน Excel แปลงเป็น Scientific notation
      const name = (row.fullName || '').replace(/"/g, '""');
      const dept = (row.department || '').replace(/"/g, '""');
      const status = row.status === 'PASS' ? 'ผ่าน (PASS)' : (row.status === 'FAIL' ? 'ไม่ผ่าน (FAIL)' : (row.status === 'IN_PROGRESS' ? 'กำลังสอบ (Live)' : 'ยังไม่ทำ (PENDING)'));
      const score = row.score !== null ? row.score : '-';
      const pct = row.percentage !== null ? `${row.percentage}%` : '-';
      const attempt = row.attemptCount > 0 ? `ครั้งที่ ${row.attemptCount}` : '-';
      const timestamp = row.latestTimestamp || '-';

      csv += `"${num}","${empId}","${name}","${dept}","${status}","${score}","25","${pct}","${attempt}","${timestamp}"`;

      // ใส่ผลลัพธ์รายข้อ 1 - 25 ตามโจทย์หลักสูตร Canonical ID
      const ansMap = {};
      (row.canonicalAnswers || row.answers || []).forEach(a => {
        const qId = a.q !== undefined ? a.q : a.questionId;
        if (qId) ansMap[qId] = a;
      });

      for (let q = 1; q <= 25; q++) {
        const item = ansMap[q];
        const hasAns = item && item.ans !== undefined && item.ans !== null;
        if (!hasAns || row.status === 'PENDING') {
          csv += `,""`; // ค่าว่าง (Blank)
        } else {
          const isRight = (item.isCorrect === true || item.score === 1);
          const uAns = item.ans === true ? 'ถูก' : (item.ans === false ? 'ผิด' : '');
          if (isRight) {
            csv += `,"✓ ถูก (${uAns})"`;
          } else {
            csv += `,"✗ ผิด (${uAns})"`;
          }
        }
      }
      csv += "\n";
    });

    // 5. แถวสรุปด้านล่างสุดแนว Socrative (% ตอบถูกรายข้อ)
    const testTakers = filtered.filter(e => e.status !== 'PENDING');
    const takersCount = testTakers.length;

    // แถว Class Accuracy %
    csv += `"% ความถูกต้องรายข้อ (Class Accuracy)",,,,,,,,,`;
    for (let q = 1; q <= 25; q++) {
      let correct = 0;
      let answeredCount = 0;
      if (takersCount > 0) {
        testTakers.forEach(t => {
          const list = t.canonicalAnswers || t.answers || [];
          const ansObj = list.find(a => (a.q === q || a.questionId === q));
          if (ansObj && ansObj.ans !== undefined && ansObj.ans !== null) {
            answeredCount++;
            if (ansObj.isCorrect === true || ansObj.score === 1) {
              correct++;
            }
          }
        });
      }
      const pct = answeredCount > 0 ? Math.round((correct / answeredCount) * 100) : 0;
      csv += `,"${answeredCount > 0 ? pct + '%' : '-'}"`;
    }
    csv += "\n";

    // แถวจำนวนคนที่ตอบถูก
    csv += `"จำนวนคนตอบถูกต้อง",,,,,,,,,`;
    for (let q = 1; q <= 25; q++) {
      let correct = 0;
      let answeredCount = 0;
      if (takersCount > 0) {
        testTakers.forEach(t => {
          const list = t.canonicalAnswers || t.answers || [];
          const ansObj = list.find(a => (a.q === q || a.questionId === q));
          if (ansObj && ansObj.ans !== undefined && ansObj.ans !== null) {
            answeredCount++;
            if (ansObj.isCorrect === true || ansObj.score === 1) {
              correct++;
            }
          }
        });
      }
      csv += `,"${correct}/${answeredCount} คน"`;
    }
    csv += "\n";

    // สั่งดาวน์โหลดไฟล์
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orientation_socrative_results_${new Date().toISOString().slice(0, 10)}.csv`;
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

