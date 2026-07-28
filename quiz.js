/**
 * Quiz Engine & State Management Module
 * Pre-test & Post-test Examination System
 */

// Default Question Bank (20 Questions provided by user)
const DEFAULT_QUESTIONS = [
  { id: 1, question: "หลักขอบเขตทางวินัย คือ หลักอาณาเขต หลักวันและเวลาทำงาน หลักความจำเป็น", answer: true, explanation: "ถูกต้อง: ขอบเขตทางวินัยครอบคลุมเรื่องอาณาเขต วันและเวลาทำงาน รวมถึงความจำเป็นทางวินัย" },
  { id: 2, question: "หลักการลงโทษทางวินัย ได้แก่ การกระทำ เจตนา ฐานความผิด เหตุบรรเทาโทษ โทษ", answer: true, explanation: "ถูกต้อง: เป็นหลักการลงโทษทางวินัยที่ต้องพิจารณาองค์ประกอบทั้ง 5 ส่วน" },
  { id: 3, question: "การกระทำ มีความหมายถึงการกระทำทางกาย วาจา รวมถึงการงดเว้นกระทำด้วย", answer: true, explanation: "ถูกต้อง: การกระทำทางวินัยรวมถึงการละเว้นไม่ปฏิบัติหน้าที่ตามที่กำหนดด้วย" },
  { id: 4, question: "ฐานความผิดมี 2 ประเภทใหญ่คือ ความผิดร้ายแรง และไม่ร้ายแรง", answer: true, explanation: "ถูกต้อง: แบ่งความผิดเป็นความผิดร้ายแรงและไม่ร้ายแรงตามระดับความรุนแรง" },
  { id: 5, question: "ฉันทาคติ คือความลำเอียงเพราะ ความรัก ชอบ", answer: true, explanation: "ถูกต้อง: ฉันทาคติ คือความลำเอียงอันเกิดจากความรัก ความพึงพอใจส่วนตัว" },
  { id: 6, question: "อคติ 4 เป็นหลักการพิจารณา ของความเที่ยงธรรม ความไม่ลำเอียง", answer: false, explanation: "ผิด: อคติ 4 หมายถึงความลำเอียง 4 ประการ (ฉันทาคติ โทสาคติ โมหาคติ ภยาคติ) ไม่ใช่หลักความเที่ยงธรรม" },
  { id: 7, question: "นายจ้างที่มีลูกจ้าง 10 คนขึ้นไปต้องมีข้อบังคับเกี่ยวกับการทำงานอย่างน้อย 6 หัวข้อ", answer: false, explanation: "ผิด: ตามกฎหมายแรงงาน ข้อบังคับเกี่ยวกับการทำงานต้องมีอย่างน้อย 8 หัวข้อหลัก" },
  { id: 8, question: "ข้อบังคับเกี่ยวกับการทำงานของพนักงาน ระบุถึงวินัยและการลงโทษเท่านั้น", answer: false, explanation: "ผิด: ข้อบังคับเกี่ยวกับการทำงานต้องระบุวันทำงาน วันหยุด หลักเกณฑ์การทำงาน ค่าจ้าง สวัสดิการ การร้องเรียน ฯลฯ ด้วย" },
  { id: 9, question: "ในข้อบังคับฯ ของบริษัทมีการแยกความผิดวินัยร้ายแรงไว้ 10 ข้อ", answer: false, explanation: "ผิด: ข้อบังคับบริษัทกำหนดหมวดหมู่ความผิดร้ายแรงตามหลักเกณฑ์ที่ระบุในประกาศ/ข้อบังคับเฉพาะ" },
  { id: 10, question: "จากสถิติการลงโทษทางวินัยของบริษัท ความผิดเกี่ยวกับความประพฤติ และความสงบเรียบร้อย เป็นประเภทที่พนักงานทำผิดบ่อยที่สุด", answer: false, explanation: "ผิด: จากสถิติบริษัทไม่ใช่ความผิดเกี่ยวกับความประพฤติและความสงบเรียบร้อยที่พนักงานทำผิดบ่อยที่สุด" },
  { id: 11, question: "การกระทำผิดตาม SOPP,ประกาศหน่วยงาน หากอ้างอิงข้อบังคับฯ สามารถลงโทษพนักงานได้", answer: true, explanation: "ถูกต้อง: หากระบุอ้างอิงเชื่อมโยงกับข้อบังคับเกี่ยวกับการทำงาน สามารถใช้อำนาจลงโทษได้" },
  { id: 12, question: "ข้อบังคับ ให้อำนาจผู้บังคับบัญชาโดยตรง ตักเตือนด้วยวาจา/ลายลักษณ์อักษร พนักงานได้", answer: true, explanation: "ถูกต้อง: ผู้บังคับบัญชาโดยตรงมีอำนาจตักเตือนด้วยวาจาและลายลักษณ์อักษรตามขอบเขตข้อบังคับ" },
  { id: 13, question: "การกระทำเดียวผิดหลายกระทง ให้ลงโทษความผิดหนักที่สุดเพียงข้อเดียว", answer: true, explanation: "ถูกต้อง: หลักการลงโทษทางวินัยกรณีการกระทำเดียวผิดหลายบท ให้ลงโทษบทหนักที่สุด" },
  { id: 14, question: "การกระทำผิดประเภทเดียวกัน ไม่จำเป็นต้องได้รับมาตรการดำเนินการทางวินัยสถานเดียวกัน", answer: true, explanation: "ถูกต้อง: การลงโทษต้องพิจารณาเจตนา พฤติการณ์ เหตุบรรเทาโทษ และประวัติย้อนหลังประกอบด้วย" },
  { id: 15, question: "หนังสือเตือนมีอายุ 1 ปี นับแต่วันที่พนักงานกระทำผิด (ไม่ใช่วันออกหนังสือเตือน)", answer: true, explanation: "ถูกต้อง: อายุหนังสือเตือนนับจากวันที่กระทำผิดตามกฎหมายคุ้มครองแรงงาน" },
  { id: 16, question: "เมื่อผู้ถูกกล่าวหารับสารภาพว่ากระทำผิด ผู้บังคับบัญชาโดยตรง ดำเนินการลงโทษได้ทันที", answer: false, explanation: "ผิด: ต้องมีการสอบสวนข้อเท็จจริงและปฏิบัติตามขั้นตอนมาตรการทางวินัยก่อนลงโทษ" },
  { id: 17, question: "การตักเตือนด้วยวาจา และลายลักษณ์อักษร ทำได้โดยความเห็นชอบจากผู้จัดการฝ่ายขึ้นไป", answer: false, explanation: "ผิด: ผู้บังคับบัญชาโดยตรงตามสายงานมีอำนาจดำเนินการตามข้อบังคับโดยไม่ต้องรอความเห็นชอบจากผู้จัดการฝ่ายทุกกรณี" },
  { id: 18, question: "การลงโทษทางวินัย ผู้บังคับบัญชาและผู้จัดการสามารถดำเนินการได้โดยไม่ต้องบันทึกรายละเอียด และปรึกษาฝ่ายทรัพยากรมนุษย์", answer: false, explanation: "ผิด: จำเป็นต้องมีการบันทึกหลักฐานเป็นลายลักษณ์อักษรและประสานงานกับฝ่าย HR เพื่อความถูกต้องตามขั้นตอน" },
  { id: 19, question: "พนักงานที่กระทำผิดไม่ยอมลงชื่อในหนังสือเตือน หัวหน้างานสามารถอ่านให้ฟัง แล้วลงชื่อเป็นหลักฐานได้", answer: false, explanation: "ผิด: ต้องมีพยานบุคคลร่วมลงชื่อรับรองว่าได้อ่านให้พนักงานฟังแล้ว หรือจัดส่งทางส่งไปรษณีย์ตอบรับ" },
  { id: 20, question: "Supervisor ไม่ดำเนินมาตรการทางวินัยกับผู้ใต้บังคับบัญชาที่กระทำผิด ไม่ถือว่างดเว้น/ละเว้น การปฎิบัติหน้าที่", answer: false, explanation: "ผิด: การละเลยไม่ดำเนินการทางวินัยกับผู้ใต้บังคับบัญชาที่ทำผิด ถือเป็นการงดเว้น/ละเว้นการปฏิบัติหน้าที่ของ Supervisor" }
];

// Fallback Local Sample Employee Database
const SAMPLE_EMPLOYEES = [
  { empId: "084843", fullName: "สมชาย ใจดี", department: "ฝ่ายทรัพยากรมนุษย์ (HR)" },
  { empId: "84843", fullName: "สมชาย ใจดี", department: "ฝ่ายทรัพยากรมนุษย์ (HR)" },
  { empId: "EMP001", fullName: "สมชาย ใจดี", department: "ฝ่ายทรัพยากรมนุษย์ (HR)" },
  { empId: "EMP002", fullName: "สมศรี มีสุข", department: "ฝ่ายบัญชีและการเงิน" }
];

class QuizEngine {
  constructor() {
    this.questions = this.loadStoredQuestions();
    this.activeExamQuestions = [];
    this.userAnswers = {};
    this.currentQuestionIndex = 0;
    this.currentUser = {
      empId: '',
      fullName: '',
      department: '',
      testType: 'Pre-test'
    };
    this.employeesDatabase = [...SAMPLE_EMPLOYEES];
    this.submissionsLog = this.loadSubmissionsLog();
  }

  loadStoredQuestions() {
    try {
      const saved = localStorage.getItem('pre_post_test_questions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load stored questions, using defaults", e);
    }
    return [...DEFAULT_QUESTIONS];
  }

  saveQuestions(newQuestions) {
    this.questions = newQuestions;
    localStorage.setItem('pre_post_test_questions', JSON.stringify(newQuestions));
  }

  resetDefaultQuestions() {
    this.questions = [...DEFAULT_QUESTIONS];
    localStorage.removeItem('pre_post_test_questions');
    return this.questions;
  }

  loadSubmissionsLog() {
    try {
      const saved = localStorage.getItem('pre_post_test_submissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load submissions log", e);
    }
    return [];
  }

  recordSubmission(record) {
    this.submissionsLog.unshift(record);
    localStorage.setItem('pre_post_test_submissions', JSON.stringify(this.submissionsLog));
  }

  // 100% Sync with Google Sheet: Replace submissionsLog directly with fetched Google Sheet data
  syncSubmissionsLog(fetchedSubmissions) {
    if (Array.isArray(fetchedSubmissions)) {
      this.submissionsLog = [...fetchedSubmissions];
      localStorage.setItem('pre_post_test_submissions', JSON.stringify(this.submissionsLog));
    }
  }

  clearSubmissionsLog() {
    this.submissionsLog = [];
    localStorage.removeItem('pre_post_test_submissions');
  }

  hasCompletedPreTest(empId) {
    if (!empId) return false;
    const raw = empId.toString().trim().toLowerCase();
    const stripped = raw.replace(/^0+/, '');
    
    return this.submissionsLog.some(log => {
      const logRaw = (log.empId || '').toString().trim().toLowerCase();
      const logStripped = logRaw.replace(/^0+/, '');
      return (logRaw === raw || (logStripped.length > 0 && logStripped === stripped)) && log.testType === 'Pre-test';
    });
  }

  hasCompletedPostTest(empId) {
    if (!empId) return false;
    const raw = empId.toString().trim().toLowerCase();
    const stripped = raw.replace(/^0+/, '');
    
    return this.submissionsLog.some(log => {
      const logRaw = (log.empId || '').toString().trim().toLowerCase();
      const logStripped = logRaw.replace(/^0+/, '');
      return (logRaw === raw || (logStripped.length > 0 && logStripped === stripped)) && log.testType === 'Post-test';
    });
  }

  shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  startNewExam(userInfo) {
    this.currentUser = { ...userInfo };
    this.userAnswers = {};
    this.currentQuestionIndex = 0;

    const shuffled = this.shuffleArray(this.questions);
    
    this.activeExamQuestions = shuffled.map(q => {
      return {
        ...q,
        options: [
          { text: "ถูก", value: true },
          { text: "ผิด", value: false }
        ]
      };
    });

    return this.activeExamQuestions;
  }

  setAnswer(questionId, value) {
    this.userAnswers[questionId] = value;
  }

  clearAnswer(questionId) {
    delete this.userAnswers[questionId];
  }

  getCurrentQuestion() {
    return this.activeExamQuestions[this.currentQuestionIndex];
  }

  getAnsweredCount() {
    return Object.keys(this.userAnswers).length;
  }

  calculateScore() {
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    const details = [];

    this.activeExamQuestions.forEach(q => {
      const userAnswer = this.userAnswers[q.id];
      let itemScore = 0;
      let status = 'unanswered';

      if (userAnswer === undefined || userAnswer === null) {
        itemScore = 0;
        unansweredCount++;
        status = 'unanswered';
      } else if (userAnswer === q.answer) {
        itemScore = 1;
        correctCount++;
        status = 'correct';
      } else {
        itemScore = -1;
        wrongCount++;
        status = 'wrong';
      }

      totalScore += itemScore;

      details.push({
        questionId: q.id,
        questionText: q.question,
        userAnswer: userAnswer,
        correctAnswer: q.answer,
        explanation: q.explanation,
        status: status,
        itemScore: itemScore
      });
    });

    const maxScore = this.activeExamQuestions.length;
    const passThreshold = Math.ceil(maxScore * 0.7);
    const isPassed = totalScore >= passThreshold;

    return {
      totalScore,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount,
      percentage: ((totalScore / maxScore) * 100).toFixed(1),
      isPassed,
      passThreshold,
      details
    };
  }

  lookupEmployee(empId) {
    if (!empId) return null;
    const raw = empId.toString().trim().toLowerCase();
    const stripped = raw.replace(/^0+/, '');

    return this.employeesDatabase.find(e => {
      const targetRaw = e.empId.toString().trim().toLowerCase();
      const targetStripped = targetRaw.replace(/^0+/, '');
      return targetRaw === raw || (targetStripped.length > 0 && targetStripped === stripped);
    }) || null;
  }

  updateEmployeeDatabase(newEmployees) {
    if (Array.isArray(newEmployees) && newEmployees.length > 0) {
      this.employeesDatabase = newEmployees;
    }
  }
}

window.quizEngine = new QuizEngine();
