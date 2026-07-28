/**
 * Quiz Engine & State Management
 * Pre-test & Post-test Examination System
 */

class QuizEngine {
  constructor() {
    this.questions = [];
    this.activeExamQuestions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = {}; // { questionId: boolean (true/false) }
    this.currentUser = null; // { empId, fullName, department, testType }
    
    // Employee database initialized empty (synced 100% with Google Sheet)
    this.employeeDatabase = [];

    // Submissions Log (synced 100% with Google Sheet)
    this.submissionsLog = [];

    this.initDefaultQuestions();
  }

  initDefaultQuestions() {
    this.questions = [
      {
        id: 1,
        question: "หลักขอบเขตทางวินัย คือ หลักอาณาเขต หลักวันและเวลาทำงาน หลักความจำเป็น",
        answer: true,
        explanation: "ถูก: หลักขอบเขตทางวินัย ประกอบด้วย 1. หลักอาณาเขต 2. หลักวันและเวลาทำงาน 3. หลักความจำเป็น"
      },
      {
        id: 2,
        question: "หลักการลงโทษทางวินัย ได้แก่ การกระทำ เจตนา ฐานความผิด เหตุบรรเทาโทษ โทษ",
        answer: true,
        explanation: "ถูก: หลักการลงโทษทางวินัย ได้แก่ การกระทำ เจตนา ฐานความผิด เหตุบรรเทาโทษ และโทษ"
      },
      {
        id: 3,
        question: "การกระทำ มีความหมายถึงการกระทำทางกาย วาจา รวมถึงการงดเว้นกระทำด้วย",
        answer: true,
        explanation: "ถูก: การกระทำ มีความหมายถึงการกระทำทางกาย วาจา รวมถึงการงดเว้นกระทำด้วย"
      },
      {
        id: 4,
        question: "ฐานความผิดมี 2 ประเภทใหญ่คือ ความผิดร้ายแรง และไม่ร้ายแรง",
        answer: true,
        explanation: "ถูก: ฐานความผิดมี 2 ประเภทใหญ่ คือ ความผิดร้ายแรง และความผิดไม่ร้ายแรง"
      },
      {
        id: 5,
        question: "ฉันทาคติ คือความลำเอียงเพราะ ความรัก ชอบ",
        answer: true,
        explanation: "ถูก: ฉันทาคติ คือความลำเอียงเพราะความรัก ความชอบ"
      },
      {
        id: 6,
        question: "อคติ 4 เป็นหลักการพิจารณา ของความเที่ยงธรรม ความไม่ลำเอียง",
        answer: false,
        explanation: "ผิด: อคติ 4 คือความลำเอียง 4 ประการ (ฉันทาคติ โทสาคติ โมหาคติ ภยาคติ) ไม่ใช่หลักความเที่ยงธรรม"
      },
      {
        id: 7,
        question: "นายจ้างที่มีลูกจ้าง 10 คนขึ้นไปต้องมีข้อบังคับเกี่ยวกับการทำงานอย่างน้อย 6 หัวข้อ",
        answer: false,
        explanation: "ผิด: ตามกฎหมายแรงงาน นายจ้างที่มีลูกจ้างรวมกันตั้งแต่ 10 คนขึ้นไป ต้องมีข้อบังคับเกี่ยวกับการทำงานอย่างน้อย 8 หัวข้อ"
      },
      {
        id: 8,
        question: "ข้อบังคับเกี่ยวกับการทำงานของพนักงาน ระบุถึงวินัยและการลงโทษเท่านั้น",
        answer: false,
        explanation: "ผิด: ข้อบังคับเกี่ยวกับการทำงานระบุหัวข้อสำคัญหลายด้าน เช่น วันทำงาน เวลาทำงาน วันหยุด สวัสดิการ การร้องเรียน ฯลฯ ไม่ได้ระบุเฉพาะเรื่องวินัยและการลงโทษเท่านั้น"
      },
      {
        id: 9,
        question: "ในข้อบังคับฯ ของบริษัทมีการแยกความผิดวินัยร้ายแรงไว้ 10 ข้อ",
        answer: false,
        explanation: "ผิด: ในข้อบังคับฯ ของบริษัท ไม่ได้แยกความผิดวินัยร้ายแรงไว้เพียง 10 ข้อ"
      },
      {
        id: 10,
        question: "จากสถิติการลงโทษทางวินัยของบริษัท ความผิดเกี่ยวกับความประพฤติ และความสงบเรียบร้อย เป็นประเภทที่พนักงานทำผิดบ่อยที่สุด",
        answer: false,
        explanation: "ผิด: จากสถิติการลงโทษทางวินัยของบริษัท ความผิดเกี่ยวกับความประพฤติและความสงบเรียบร้อย ไม่ใช่ประเภทที่พนักงานทำผิดบ่อยที่สุด"
      },
      {
        id: 11,
        question: "การกระทำผิดตาม SOPP,ประกาศหน่วยงาน หากอ้างอิงข้อบังคับฯ สามารถลงโทษพนักงานได้",
        answer: true,
        explanation: "ถูก: การกระทำผิดตาม SOPP หรือประกาศหน่วยงาน หากอ้างอิงข้อบังคับฯ สามารถลงโทษพนักงานได้"
      },
      {
        id: 12,
        question: "ข้อบังคับ ให้อำนาจผู้บังคับบัญชาโดยตรง ตักเตือนด้วยวาจา/ลายลักษณ์อักษร พนักงานได้",
        answer: true,
        explanation: "ถูก: ข้อบังคับให้อำนาจผู้บังคับบัญชาโดยตรงในการตักเตือนด้วยวาจาหรือลายลักษณ์อักษรพนักงานได้"
      },
      {
        id: 13,
        question: "การกระทำเดียวผิดหลายกระทง ให้ลงโทษความผิดหนักที่สุดเพียงข้อเดียว",
        answer: true,
        explanation: "ถูก: การกระทำเดียวผิดหลายกระทง ให้ลงโทษความผิดสถานหนักที่สุดเพียงข้อเดียว"
      },
      {
        id: 14,
        question: "การกระทำผิดประเภทเดียวกัน ไม่จำเป็นต้องได้รับมาตรการดำเนินการทางวินัยสถานเดียวกัน",
        answer: true,
        explanation: "ถูก: ขึ้นอยู่กับพฤติการณ์ เหตุบรรเทาโทษ ประวัติ และเจตนาของผู้กระทำผิด"
      },
      {
        id: 15,
        question: "หนังสือเตือนมีอายุ 1 ปี นับแต่วันที่พนักงานกระทำผิด (ไม่ใช่วันออกหนังสือเตือน)",
        answer: true,
        explanation: "ถูก: ตามกฎหมายแรงงาน หนังสือเตือนมีอายุ 1 ปี นับแต่วันที่พนักงานกระทำผิด"
      },
      {
        id: 16,
        question: "เมื่อผู้ถูกกล่าวหารับสารภาพว่ากระทำผิด ผู้บังคับบัญชาโดยตรง ดำเนินการลงโทษได้ทันที",
        answer: false,
        explanation: "ผิด: ต้องดำเนินการตามขั้นตอนและระเบียบของบริษัท รวมถึงปรึกษาฝ่ายทรัพยากรมนุษย์ก่อนดำเนินการลงโทษ"
      },
      {
        id: 17,
        question: "การตักเตือนด้วยวาจา และลายลักษณ์อักษร ทำได้โดยความเห็นชอบจากผู้จัดการฝ่ายขึ้นไป",
        answer: false,
        explanation: "ผิด: ผู้บังคับบัญชาโดยตรงมีอำนาจตักเตือนได้ตามที่ข้อบังคับกำหนด"
      },
      {
        id: 18,
        question: "การลงโทษทางวินัย ผู้บังคับบัญชาและผู้จัดการสามารถดำเนินการได้โดยไม่ต้องบันทึกรายละเอียด และปรึกษาฝ่ายทรัพยากรมนุษย์",
        answer: false,
        explanation: "ผิด: ต้องบันทึกรายละเอียดและปรึกษาฝ่ายทรัพยากรมนุษย์เพื่อความถูกต้องตามขั้นตอน"
      },
      {
        id: 19,
        question: "พนักงานที่กระทำผิดไม่ยอมลงชื่อในหนังสือเตือน หัวหน้างานสามารถอ่านให้ฟัง แล้วลงชื่อเป็นหลักฐานได้",
        answer: false,
        explanation: "ผิด: หากพนักงานไม่ยอมลงชื่อ ต้องมีพยานร่วมรับฟังและลงลายมือชื่อรับรองการแจ้งเตือนตามหลักเกณฑ์"
      },
      {
        id: 20,
        question: "Supervisor ไม่ดำเนินมาตรการทางวินัยกับผู้ใต้บังคับบัญชาที่กระทำผิด ไม่ถือว่างดเว้น/ละเว้น การปฎิบัติหน้าที่",
        answer: false,
        explanation: "ผิด: ถือเป็นการงดเว้น/ละเว้นการปฏิบัติหน้าที่ตามระเบียบและข้อบังคับของบริษัท"
      }
    ];
  }

  updateEmployeeDatabase(data) {
    if (Array.isArray(data)) {
      this.employeeDatabase = data;
    }
  }

  lookupEmployee(empId) {
    if (!empId) return null;
    const cleanInput = empId.trim().toUpperCase();
    return this.employeeDatabase.find(e => {
      const dbId = (e.empId || '').toString().trim().toUpperCase();
      return dbId === cleanInput || dbId.replace(/^0+/, '') === cleanInput.replace(/^0+/, '');
    });
  }

  syncSubmissionsLog(fetchedSubmissions) {
    if (Array.isArray(fetchedSubmissions)) {
      this.submissionsLog = fetchedSubmissions;
    } else {
      this.submissionsLog = [];
    }
  }

  hasCompletedPreTest(empId) {
    if (!empId) return false;
    const cleanInput = empId.trim().toUpperCase();
    return this.submissionsLog.some(item => {
      const dbId = (item.empId || '').toString().trim().toUpperCase();
      const matchId = (dbId === cleanInput || dbId.replace(/^0+/, '') === cleanInput.replace(/^0+/, ''));
      return matchId && item.testType === 'Pre-test';
    });
  }

  hasCompletedPostTest(empId) {
    if (!empId) return false;
    const cleanInput = empId.trim().toUpperCase();
    return this.submissionsLog.some(item => {
      const dbId = (item.empId || '').toString().trim().toUpperCase();
      const matchId = (dbId === cleanInput || dbId.replace(/^0+/, '') === cleanInput.replace(/^0+/, ''));
      return matchId && item.testType === 'Post-test';
    });
  }

  startNewExam(userInfo) {
    this.currentUser = userInfo;
    this.userAnswers = {};
    this.currentQuestionIndex = 0;
    
    // Shuffle question order (Fisher-Yates Shuffle)
    const shuffled = [...this.questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Choices order is strictly FIXED: True (ถูก) on left, False (ผิด) on right
    this.activeExamQuestions = shuffled.map(q => ({
      ...q,
      options: [
        { text: "ถูก", value: true },
        { text: "ผิด", value: false }
      ]
    }));
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
      const uAns = this.userAnswers[q.id];
      let itemScore = 0;
      let status = 'unanswered';

      if (uAns === undefined) {
        itemScore = 0;
        unansweredCount++;
        status = 'unanswered';
      } else if (uAns === q.answer) {
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
        userAnswer: uAns,
        correctAnswer: q.answer,
        itemScore: itemScore,
        status: status,
        explanation: q.explanation
      });
    });

    const maxScore = this.activeExamQuestions.length; // 20
    const passThreshold = 14; // 70%
    const isPassed = totalScore >= passThreshold;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      totalScore,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount,
      percentage,
      isPassed,
      passThreshold,
      details
    };
  }

  recordSubmission(record) {
    this.submissionsLog.unshift(record);
  }

  saveQuestions(newQuestions) {
    this.questions = newQuestions;
  }

  resetDefaultQuestions() {
    this.initDefaultQuestions();
  }
}

// Global Quiz Engine Instance
window.quizEngine = new QuizEngine();
