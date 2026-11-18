/**
 * Quiz Engine & State Management
 * แบบวัดผลการปฐมนิเทศ พนักงานรายวัน (Orientation Exam System)
 * กติกา: ตอบถูกได้ 1 คะแนน, ตอบผิดได้ 0 คะแนน (25 ข้อ คะแนนเต็ม 25)
 * เกณฑ์ผ่าน: 80% ขึ้นไป (20 คะแนนขึ้นไป)
 */

class OrientationQuizEngine {
  constructor() {
    this.questions = [];
    this.activeExamQuestions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = {}; // { questionId: boolean }
    this.currentUser = null; // { empId, fullName, department, attemptNumber }
    
    // Employee database (synced from Google Sheet tab "Name")
    this.employeeDatabase = [];

    // Submissions Log (synced from Google Sheet)
    this.submissionsLog = [];

    // Live Progress Log (Real-time in-progress sync)
    this.liveProgressLog = [];

    this.initDefaultQuestions();
  }

  initDefaultQuestions() {
    this.questions = [
      {
        id: 1,
        question: "วันทำงานปกติของพนักงานรายวันใน 1 สัปดาห์ มีวันทำงาน 6 วัน และมีวันหยุด 1 วัน",
        answer: true,
        explanation: "ถูกต้อง: วันทำงานปกติของพนักงานรายวันคือ 6 วันต่อสัปดาห์ และมีวันหยุดประจำสัปดาห์ 1 วัน"
      },
      {
        id: 2,
        question: "ระยะเวลาในการทดลองงานของพนักงานใหม่คือ 90 วัน โดยนับรวมวันหยุดด้วย",
        answer: true,
        explanation: "ถูกต้อง: ระยะเวลาในการทดลองงานของพนักงานใหม่คือ 90 วัน โดยนับรวมวันหยุดด้วย"
      },
      {
        id: 3,
        question: "บริษัทกำหนดกะในการทำงานของพนักงานรายวันไว้ 3 กะต่อวัน",
        answer: false,
        explanation: "ผิด: บริษัทไม่ได้กำหนดกะในการทำงานของพนักงานรายวันไว้ 3 กะต่อวัน"
      },
      {
        id: 4,
        question: "พนักงานรายวันที่ทำงานในกะเช้าจะต้องทำงาน รวม OT Auto ตั้งแต่เวลา 07.00 – 17.55 น.",
        answer: true,
        explanation: "ถูกต้อง: เวลาทำงานกะเช้ารวม OT Auto คือตั้งแต่เวลา 07.00 – 17.55 น."
      },
      {
        id: 5,
        question: "บริษัทกำหนดให้มีวันหยุดประเพณีของบริษัทไว้ 13 วัน โดยรวมถึงวันแรงงานแห่งชาติด้วย",
        answer: false,
        explanation: "ผิด: จำนวนวันหยุดตามประเพณีของบริษัทไม่ได้กำหนดไว้ 13 วันตามข้อความนี้"
      },
      {
        id: 6,
        question: "พนักงานที่ทำงานในกะกลางคืนจะได้รับค่ากะจำนวน 45 บาทต่อวัน",
        answer: true,
        explanation: "ถูกต้อง: พนักงานที่ปฏิบัติงานในกะกลางคืนจะได้รับเงินค่ากะจำนวน 45 บาทต่อวัน"
      },
      {
        id: 7,
        question: "พนักงานที่ทำงาน 8 ชั่วโมงทำงาน รวม ทำ OT Auto จะได้รับค่าอาหาร 30 บาท",
        answer: true,
        explanation: "ถูกต้อง: พนักงานที่ทำงานครบ 8 ชั่วโมงรวมทำ OT Auto จะได้รับเงินค่าอาหาร 30 บาท"
      },
      {
        id: 8,
        question: "พนักงานรายวันจะได้รับค่าเดินทางวันละ 25 บาท",
        answer: true,
        explanation: "ถูกต้อง: พนักงานรายวันจะได้รับเงินช่วยเหลือค่าเดินทางวันละ 25 บาท"
      },
      {
        id: 9,
        question: "บริษัทจะจ่ายเบี้ยขยันประจำงวด ให้กับพนักงานรายวันที่ไม่ป่วย สาย ลา ขาด โดยจ่ายให้งวดค่าจ้างละ 300 บาท",
        answer: false,
        explanation: "ผิด: อัตราการจ่ายเบี้ยขยันประจำงวดไม่ได้จ่ายงวดค่าจ้างละ 300 บาทตามข้อความนี้"
      },
      {
        id: 10,
        question: "พนักงานทำงานครบทดลองงานถึงจะสามารถสมัคร สวัสดิการกองทุนสำรองเลี้ยงชีพได้",
        answer: false,
        explanation: "ผิด: เงื่อนไขการสมัครกองทุนสำรองเลี้ยงชีพไม่ได้ระบุว่าต้องรอให้ครบทดลองงานตามข้อความนี้"
      },
      {
        id: 11,
        question: "พนักงานรายวันจะมีสิทธิหยุดพักผ่อนประจำปี (พักร้อน) เมื่อทำงานครบทดลองงาน",
        answer: true,
        explanation: "ถูกต้อง: สิทธิวันหยุดพักผ่อนประจำปี (พักร้อน) จะมีสิทธิเมื่อทำงานครบทดลองงาน"
      },
      {
        id: 12,
        question: "พนักงานหญิงตั้งครรภ์ มีสิทธิลาคลอดก่อนและหลังคลอดได้ ครรภ์หนึ่งไม่เกิน 120 วัน โดยบริษัทฯ จ่ายค่า เท่ากับค่าจ้างในวันทำงานตลอดระยะเวลาที่ลา แต่ไม่เกิน 60 วัน",
        answer: true,
        explanation: "ถูกต้อง: สิทธิลาคลอดครรภ์หนึ่งไม่เกิน 120 วัน และบริษัทจ่ายค่าจ้างตลอดระยะเวลาที่ลาแต่ไม่เกิน 60 วัน"
      },
      {
        id: 13,
        question: "พนักงานที่ทำงานครบ 1 ปีขึ้นไป จึงจะสามารถใช้สิทธิการลาสมรสได้เป็นจำนวน 3 วันทำงาน และลาได้ เพียงครั้งเดียว",
        answer: true,
        explanation: "ถูกต้อง: พนักงานที่มีอายุงานครบ 1 ปีขึ้นไป มีสิทธิลาเพื่อสมรสได้ 3 วันทำงาน และใช้สิทธิได้เพียงครั้งเดียว"
      },
      {
        id: 14,
        question: "พนักงานที่ผ่านการทดลองงานแล้วเท่านั้นจึงจะสามารถใช้สิทธิลางานศพได้",
        answer: false,
        explanation: "ผิด: การใช้สิทธิลางานศพ (ฌาปนกิจ) ไม่ได้จำกัดว่าต้องผ่านการทดลองงานแล้วเท่านั้น"
      },
      {
        id: 15,
        question: "พนักงานต้องทำงานครบทดลองงาน ถึงจะเบิกเงินช่วยเหลือค่าการศึกษาบุตรได้",
        answer: false,
        explanation: "ผิด: สิทธิการเบิกเงินช่วยเหลือค่าการศึกษาบุตรไม่ได้กำหนดเงื่อนไขว่าต้องครบทดลองงานตามข้อความนี้"
      },
      {
        id: 16,
        question: "พนักงานทุกคนจะต้องติดบัตรประจำตัวพนักงานตลอดเวลาที่อยู่ในบริเวณบริษัท",
        answer: true,
        explanation: "ถูกต้อง: เพื่อความปลอดภัยและการยืนยันตัวตน พนักงานทุกคนต้องติดบัตรประจำตัวพนักงานตลอดเวลาในบริเวณบริษัท"
      },
      {
        id: 17,
        question: "พนักงานจะสมัครสหกรณ์ออมทรัพย์ของบริษัทต้องทำงานครบทดลองงาน",
        answer: true,
        explanation: "ถูกต้อง: การสมัครสมาชิกสหกรณ์ออมทรัพย์ของบริษัท พนักงานต้องทำงานครบทดลองงานก่อน"
      },
      {
        id: 18,
        question: "พนักงานที่ทำงานล่วงเวลาในวันทำงานปกติ จะได้รับค่าล่วงเวลาเป็นจำนวน 1.5 เท่าของค่าแรงปกติต่อ ชั่วโมงการทำงานล่วงเวลา",
        answer: true,
        explanation: "ถูกต้อง: การทำงานล่วงเวลา (OT) ในวันทำงานปกติ ได้รับค่าตอบแทน 1.5 เท่าของอัตราค่าจ้างปกติต่อชั่วโมง"
      },
      {
        id: 19,
        question: "พนักงานต้อง ส่งซักชุดสม็อกตามตารางที่หัวหน้างานแจ้งไว้พร้อมกับเพื่อนในไลน์ โดยห้ามไม่ให้มาส่งซัก เองคนเดียว",
        answer: true,
        explanation: "ถูกต้อง: การส่งซักชุดสม็อกต้องปฏิบัติตามตารางที่หัวหน้างานแจ้งพร้อมเพื่อนในสายการผลิต ห้ามส่งซักเดี่ยว"
      },
      {
        id: 20,
        question: "พนักงานต้องไม่ย้าย ล๊อกเกอร์เองหากไม่ได้รับอนุญาต และห้ามนำสิ่งของผิดกฎหมายไว้ในตู้ล๊อกเกอร์โดย เด็ดขาด",
        answer: true,
        explanation: "ถูกต้อง: ห้ามย้ายตู้ล็อกเกอร์โดยไม่ได้รับอนุญาต และห้ามนำสิ่งของผิดกฎหมายหรือของต้องห้ามมาเก็บไว้โดยเด็ดขาด"
      },
      {
        id: 21,
        question: "พนักงานที่ขาดงานเป็นเวลา 3 วันทำงานติดต่อกันโดยไม่แจ้งให้บริษัททราบ ถือว่าพ้นสภาพจากการเป็น พนักงานของบริษัท เว้นแต่การขาดงานนั้นมีเหตุผลอันสมควร",
        answer: true,
        explanation: "ถูกต้อง: การละทิ้งหน้าที่หรือขาดงานติดต่อกัน 3 วันทำงานโดยไม่มีเหตุอันสมควรและไม่แจ้ง ถือว่าพ้นสภาพพนักงานตามกฎหมายแรงงานและระเบียบบริษัท"
      },
      {
        id: 22,
        question: "กรณีพนักงานที่ยังไม่ได้รับสิทธิการรักษาพยาบาลตามสิทธิของประกันสังคม หากพนักงานเจ็บป่วยควรเข้า รับการรักษาที่โรงพยาบาลของรัฐบาล เพื่อสามารถเบิกค่ารักษากับบริษัทได้เต็มจำนวน",
        answer: true,
        explanation: "ถูกต้อง: พนักงานที่ยังไม่มีสิทธิประกันสังคม หากเจ็บป่วยควรเข้ารักษาที่โรงพยาบาลรัฐเพื่อเบิกค่ารักษากับบริษัทได้เต็มจำนวนตามระเบียบ"
      },
      {
        id: 23,
        question: "กรณีพนักงานเจ็บป่วยฉุกเฉิน หรือประสบอุบัติเหตุ และไม่ได้เข้ารับการรักษาในโรงพยาบาลตามสิทธิ ประกันสังคม จะต้องทำการแจ้งให้เจ้าหน้าที่การบุคคลทราบโดยทันทีที่สามารถทำได้",
        answer: true,
        explanation: "ถูกต้อง: ต้องรีบประสานและแจ้งเจ้าหน้าที่ฝ่ายบุคคลทันทีที่ทำได้เพื่อดำเนินการประสานสิทธิประโยชน์และการดูแล"
      },
      {
        id: 24,
        question: "PDPA คือ พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล ซึ่งกฎหมายที่ถูกสร้างมาเพื่อป้องกันการละเมิดข้อมูล ส่วนบุคคลของทุกคน รวมถึงการจัดเก็บข้อมูลและนำไปใช้โดยไม่ได้แจ้งให้ทราบ และไม่ได้รับความยินยอม จากเจ้าของข้อมูลเสียก่อน",
        answer: true,
        explanation: "ถูกต้อง: PDPA (Personal Data Protection Act) คุ้มครองข้อมูลส่วนบุคคล ป้องกันการจัดเก็บและนำไปใช้โดยไม่ได้รับความยินยอม"
      },
      {
        id: 25,
        question: "Coporate Code Of Conduct เป็นจริยะธรรมธุรกิจขององค์ร ซึ่งประกอบด้วยเรื่องของ ความสัมพันธ์ต่อ ลูกค้า ความสัมพันธ์ต่อซัพพลายเออร์และผู้รับเหมา ความสัมพันธ์ต่อผู้ถือหุ้นและกลุ่มการเงิน ความสัมพันธ์ ระหว่างบริษัทและพนักงาน และความสัมพันธ์ต่อกลุ่มอื่น ๆ ที่เกี่ยวข้อง",
        answer: true,
        explanation: "ถูกต้อง: Corporate Code of Conduct คือจรรยาบรรณและจริยธรรมธุรกิจที่ครอบคลุมความสัมพันธ์กับผู้มีส่วนได้ส่วนเสียทุกฝ่าย"
      }
    ];
  }

  updateEmployeeDatabase(data) {
    if (Array.isArray(data)) {
      this.employeeDatabase = data;
    }
  }

  cleanEmpId(empId) {
    if (!empId) return '';
    return empId.toString().replace(/^'/, '').trim().toUpperCase().replace(/^0+/, '');
  }

  lookupEmployee(empId) {
    if (!empId) return null;
    const target = this.cleanEmpId(empId);
    if (!target) return null;
    return this.employeeDatabase.find(e => {
      const dbId = this.cleanEmpId(e.empId);
      return dbId === target;
    });
  }

  syncSubmissionsLog(fetchedSubmissions) {
    if (Array.isArray(fetchedSubmissions)) {
      // Filter orientation submissions if mixed, or accept all if dedicated
      const orientationSubs = fetchedSubmissions.filter(s => {
        const t = (s.testType || '').toLowerCase();
        // matches 'orientation', 'ปฐมนิเทศ', or empty if all are orientation
        return t.includes('ปฐมนิเทศ') || t.includes('orientation') || t === 'แบบวัดผลการปฐมนิเทศ พนักงานรายวัน';
      });

      // If no specific orientation tags found, but testType is present, keep those explicitly marked or separate
      // If none explicitly marked, we use orientationSubs or empty
      const targetList = orientationSubs.length > 0 ? orientationSubs : fetchedSubmissions.filter(s => (s.testType || '').includes('ปฐมนิเทศ'));

      // Calculate attempt number in chronological order
      const counters = {};
      targetList.forEach(sub => {
        const cleanId = this.cleanEmpId(sub.empId);
        counters[cleanId] = (counters[cleanId] || 0) + 1;
        sub.attemptNumber = counters[cleanId];
      });

      // Store in reverse chronological order (newest first)
      this.submissionsLog = [...targetList].reverse();
    } else {
      this.submissionsLog = [];
    }
  }

  syncLiveProgress(fetchedLiveProgress) {
    if (Array.isArray(fetchedLiveProgress)) {
      this.liveProgressLog = fetchedLiveProgress;
    } else {
      this.liveProgressLog = [];
    }
  }

  getEmployeeLiveProgress(empId) {
    if (!empId) return null;
    const target = this.cleanEmpId(empId);
    return this.liveProgressLog.find(l => this.cleanEmpId(l.empId) === target) || null;
  }

  getEmployeeSubmissions(empId) {
    if (!empId) return [];
    const target = this.cleanEmpId(empId);
    return this.submissionsLog.filter(s => this.cleanEmpId(s.empId) === target);
  }

  getLatestEmployeeSubmission(empId) {
    const subs = this.getEmployeeSubmissions(empId);
    return subs.length > 0 ? subs[0] : null; // newest is at index 0
  }

  startNewExam(userInfo, forceAttemptNumber = null) {
    this.currentUser = { ...userInfo };
    this.userAnswers = {};
    this.currentQuestionIndex = 0;

    // Determine attempt number
    if (forceAttemptNumber !== null) {
      this.currentUser.attemptNumber = forceAttemptNumber;
    } else {
      const pastSubs = this.getEmployeeSubmissions(userInfo.empId);
      this.currentUser.attemptNumber = pastSubs.length + 1;
    }

    // Shuffle questions order (Fisher-Yates Shuffle)
    const shuffled = [...this.questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Choices order is strictly FIXED: True (ถูก) on left, False (ผิด) on right
    this.activeExamQuestions = shuffled.map(q => ({
      ...q,
      options: [
        { text: "ถูก (True)", value: true },
        { text: "ผิด (False)", value: false }
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

  isAllAnswered() {
    return this.getAnsweredCount() === this.activeExamQuestions.length;
  }

  getUnansweredQuestions() {
    const list = [];
    this.activeExamQuestions.forEach((q, idx) => {
      if (this.userAnswers[q.id] === undefined) {
        list.push({
          index: idx,
          questionNumber: idx + 1,
          questionId: q.id,
          questionText: q.question
        });
      }
    });
    return list;
  }

  getNextUnansweredIndex(fromIndex = -1) {
    const total = this.activeExamQuestions.length;
    if (total === 0) return 0;
    
    // Search cyclically forward starting from fromIndex + 1
    for (let step = 1; step <= total; step++) {
      const idx = (fromIndex + step) % total;
      const q = this.activeExamQuestions[idx];
      if (this.userAnswers[q.id] === undefined) {
        return idx;
      }
    }
    return -1; // all answered
  }

  /**
   * เงื่อนไขการคำนวณคะแนนตามที่กำหนด:
   * - ตอบถูกได้ 1 คะแนน
   * - ตอบผิดได้ 0 คะแนน (ไม่ใช่ -1 เหมือนระบบเดิม)
   * - ไม่ตอบได้ 0 คะแนน
   * - คะแนนเต็ม 25 คะแนน
   * - ผลคะแนน 80% ขึ้นไปถือเป็นเกณฑ์ผ่าน (20 คะแนนขึ้นไป)
   */
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
        itemScore = 0; // ตอบผิดได้ 0 คะแนน ตามเงื่อนไขใหม่
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

    const maxScore = this.activeExamQuestions.length; // 25
    const passThresholdPercentage = 80; // 80%
    const passThresholdScore = Math.ceil((maxScore * passThresholdPercentage) / 100); // 20
    const isPassed = totalScore >= passThresholdScore;
    const percentage = Math.round((totalScore / maxScore) * 100);

    return {
      totalScore,
      maxScore,
      correctCount,
      wrongCount,
      unansweredCount,
      percentage,
      isPassed,
      passThresholdPercentage,
      passThresholdScore,
      attemptNumber: this.currentUser ? this.currentUser.attemptNumber : 1,
      details
    };
  }

  recordSubmission(record) {
    const cleanId = this.cleanEmpId(record.empId);
    const existingCount = this.submissionsLog.filter(s => this.cleanEmpId(s.empId) === cleanId).length;
    record.attemptNumber = existingCount + 1;
    this.submissionsLog.unshift(record);
  }

  saveQuestions(newQuestions) {
    this.questions = newQuestions;
  }

  resetDefaultQuestions() {
    this.initDefaultQuestions();
  }
}

// Global Orientation Quiz Engine Instance
window.orientationQuizEngine = new OrientationQuizEngine();

