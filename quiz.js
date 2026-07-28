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
        answer: false,
        explanation: "ผิด: หลักขอบเขตทางวินัย ประกอบด้วย 1. หลักอาณาเขต 2. หลักวันและเวลาทำงาน 3. หลักหน้าที่ความรับผิดชอบ (ไม่มีหลักความจำเป็น)"
      },
      {
        id: 2,
        question: "กรณีการกระทำผิดนอกวันและเวลาทำงานของบริษัท สามารถถือเป็นความผิดทางวินัยได้ทุกกรณี",
        answer: false,
        explanation: "ผิด: การกระทำผิดนอกวันเวลาทำงานจะถือเป็นความผิดทางวินัยได้เฉพาะกรณีที่ส่งผลกระทบต่อชื่อเสียง ภาพลักษณ์ หรือความปลอดภัยของบริษัทเท่านั้น"
      },
      {
        id: 3,
        question: "การกล่าวเตือนด้วยวาจา เป็นมาตรการทางวินัยที่ไม่ต้องมีการบันทึกไว้เป็นลายลักษณ์อักษร",
        answer: false,
        explanation: "ผิด: แม้จะเป็นการเตือนด้วยวาจา แต่โดยปกติควรมีการบันทึกบันทึกย่อการตักเตือนไว้เป็นหลักฐานในแฟ้มประวัติพนักงาน"
      },
      {
        id: 4,
        question: "หนังสือเตือนเป็นลายลักษณ์อักษรมีอายุบังคับใช้อุทธรณ์ได้ไม่เกิน 1 ปีนับแต่วันที่ออกหนังสือเตือน",
        answer: true,
        explanation: "ถูก: หนังสือเตือนตามกฎหมายแรงงานมีอายุบังคับใช้ 1 ปีนับแต่วันที่พนักงานได้กระทำความผิด"
      },
      {
        id: 5,
        question: "การพักงานเพื่อสอบสวนความผิด สามารถทำได้โดยจ่ายค่าจ้างไม่น้อยกว่าร้อยละ 50 ของค่าจ้างในวันทำงานตลอดระยะเวลาที่พักงาน",
        answer: true,
        explanation: "ถูก: ตาม พ.ร.บ. คุ้มครองแรงงาน นายจ้างสามารถสั่งพักงานเพื่อสอบสวนได้ไม่เกิน 7 วัน และต้องจ่ายเงินไม่น้อยกว่า 50%"
      },
      {
        id: 6,
        question: "พนักงานที่ถูกเลิกจ้างเนื่องจากกระทำความผิดร้ายแรง จะไม่มีสิทธิได้รับค่าชดเชยตามกฎหมายแรงงาน",
        answer: true,
        explanation: "ถูก: ตามมาตรา 119 แห่ง พ.ร.บ.คุ้มครองแรงงาน นายจ้างไม่ต้องจ่ายค่าชดเชยหากพนักงานกระทำความผิดร้ายแรงตามที่กฎหมายระบุ"
      },
      {
        id: 7,
        question: "การจงใจทำให้นายจ้างได้รับความเสียหาย ถือเป็นความผิดร้ายแรงที่สามารถเลิกจ้างได้ทันทีโดยไม่ต้องบอกกล่าวล่วงหน้า",
        answer: true,
        explanation: "ถูก: เป็นความผิดร้ายแรงตามมาตรา 119 (2) นายจ้างมีสิทธิเลิกจ้างได้ทันทีโดยไม่ต้องจ่ายค่าชดเชยและไม่ต้องบอกกล่าวล่วงหน้า"
      },
      {
        id: 8,
        question: "การขาดงานติดต่อกัน 3 วันทำงานโดยไม่มีเหตุอันสมควร ต้องเป็นวันทำงานติดต่อกันเท่านั้นหากมีวันหยุดคั่นจะไม่ถือว่าผิดร้ายแรง",
        answer: true,
        explanation: "ถูก: คำพิพากษาศาลฎีกาวางหลักว่า ขาดงาน 3 วันทำงานติดต่อกัน หมายถึงวันทำงานปกติที่ติดต่อกัน ไม่นับวันหยุดคั่น"
      },
      {
        id: 9,
        question: "การลงโทษทางวินัยสามารถลงโทษซ้ำในความผิดเรื่องเดียวกันได้ หากพบว่าการลงโทษครั้งแรกเบาเกินไป",
        answer: false,
        explanation: "ผิด: หลักกฎหมายซ้ำซ้อน (Double Jeopardy) ห้ามลงโทษซ้ำในความผิดเรื่องเดียวกันเมื่อได้ลงโทษข้อยุติไปแล้ว"
      },
      {
        id: 10,
        question: "พนักงานกระทำความผิดโดยประมาทเลินเล่อเป็นเหตุให้นายจ้างได้รับความเสียหายอย่างร้ายแรง เป็นเหตุเลิกจ้างโดยไม่จ่ายค่าชดเชยได้",
        answer: true,
        explanation: "ถูก: ตามมาตรา 119 (3) ประมาทเลินเล่อเป็นเหตุให้นายจ้างได้รับความเสียหายอย่างร้ายแรง สามารถเลิกจ้างได้ทันที"
      },
      {
        id: 11,
        question: "การทุจริตต่อหน้าที่ หรือกระทำความผิดอาญาโดยจงใจแก่นายจ้าง เป็นเหตุเลิกจ้างที่ไม่ต้องออกหนังสือเตือนก่อน",
        answer: true,
        explanation: "ถูก: การทุจริตต่อหน้าที่เป็นความผิดร้ายแรง นายจ้างสามารถเลิกจ้างได้ทันที"
      },
      {
        id: 12,
        question: "หนังสือเตือนจะต้องระบุข้อเท็จจริงเกี่ยวกับการกระทำผิดและกำหนดเวลาห้ามกระทำผิดซ้ำไว้ชัดเจน",
        answer: true,
        explanation: "ถูก: หนังสือเตือนที่ชอบด้วยกฎหมายต้องระบุการกระทำผิด วันเวลา ข้อบังคับที่ฝ่าฝืน และคำเตือนห้ามซ้ำคำเตือน"
      },
      {
        id: 13,
        question: "การทะเลาะวิวาทในพื้นที่บริษัท ถือเป็นความผิดทางวินัยร้ายแรงทุกกรณีไม่ว่าใครจะเป็นผู้ก่อเหตุก่อนก็ตาม",
        answer: false,
        explanation: "ผิด: ต้องพิจารณาข้อเท็จจริงว่าเป็นการสมัครใจทะเลาะวิวาท หรือเป็นการป้องกันตัวโดยชอบด้วยกฎหมาย"
      },
      {
        id: 14,
        question: "นายจ้างสามารถตัดค่าจ้างของพนักงานเพื่อเป็นการลงโทษทางวินัยได้ หากพนักงานทำสินค้าเสียหาย",
        answer: false,
        explanation: "ผิด: กฎหมายแรงงานห้ามนายจ้างหักค่าจ้างเพื่อเป็นมาตรการลงโทษทางวินัย (ทำได้เพียงให้ชดใช้ค่าเสียหายตามขั้นตอน)"
      },
      {
        id: 15,
        question: "การมาทำงานสายสะสมหลายครั้ง สามารถออกหนังสือเตือนและนำไปสู่การเลิกจ้างได้หากกระทำผิดซ้ำคำเตือนภายใน 1 ปี",
        answer: true,
        explanation: "ถูก: การมาสายเป็นความผิดไม่ร้ายแรง แต่หากมีหนังสือเตือนแล้วกระทำผิดซ้ำเตือนภายใน 1 ปี นายจ้างสามารถเลิกจ้างได้"
      },
      {
        id: 16,
        question: "พนักงานที่ถูกลงโทษตัดเงินงวดสมทบ หรือตัดโบนัส ถือเป็นการลงโทษทางวินัยที่ชอบด้วยกฎหมายเสมอ",
        answer: false,
        explanation: "ผิด: สิทธิในการได้รับโบนัสหรือเงินสมทบขึ้นอยู่กับข้อตกลงสภาพการจ้างและระเบียบบริษัท แต่ต้องไม่ขัดต่อกฎหมายแรงงาน"
      },
      {
        id: 17,
        question: "กรรมการลูกจ้างจะถูกลงโทษทางวินัยหรือเลิกจ้าง ต้องได้รับอนุญาตจากศาลแรงงานก่อนเท่านั้น",
        answer: true,
        explanation: "ถูก: ตาม พ.ร.บ.แรงงานสัมพันธ์ มาตรา 52 นายจ้างจะลงโทษหรือเลิกจ้างกรรมการลูกจ้างไม่ได้ เว้นแต่ศาลแรงงานจะอนุญาต"
      },
      {
        id: 18,
        question: "หากพนักงานกระทำผิดซ้ำคำเตือนในเรื่องเดิมที่เคยได้รับหนังสือเตือนไปแล้วเกิน 1 ปี นายจ้างสามารถเลิกจ้างได้ทันที",
        answer: false,
        explanation: "ผิด: หนังสือเตือนมีอายุ 1 ปี หากพ้น 1 ปีไปแล้ว หนังสือเตือนเดิมหมดอายุ ต้องเริ่มกระบวนการเตือนใหม่"
      },
      {
        id: 19,
        question: "การส่งมอบงานล่าช้าเนื่องจากอุปกรณ์บริษัทขัดข้อง ถือเป็นความผิดทางวินัยฐานละทิ้งหน้าที่",
        answer: false,
        explanation: "ผิด: ไม่ถือเป็นความผิดทางวินัยเพราะขาดองค์ประกอบความเจตนาหรือความบกพร่องของตัวพนักงานเอง"
      },
      {
        id: 20,
        question: "ข้อบังคับเกี่ยวกับการทำงานของบริษัท ต้องประกาศเปิดเผยให้พนักงานทราบในสถานที่ทำงาน",
        answer: true,
        explanation: "ถูก: กฎหมายกำหนดให้นายจ้างต้องปิดประกาศข้อบังคับเกี่ยวกับการทำงานไว้ในที่เปิดเผย ณ สถานที่ทำงานของพนักงาน"
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
