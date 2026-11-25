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
    this.isExamSubmitted = false;
    
    // Employee database (synced from Google Sheet tab "Name")
    this.employeeDatabase = [];

    // Submissions Log (synced from Google Sheet)
    this.submissionsLog = [];

    // Live Progress Log (Real-time in-progress sync)
    this.liveProgressLog = [];

    this.initDefaultQuestions();
    this.initDefaultEmployees();
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

  initDefaultEmployees() {
    this.employeeDatabase = [
      { empId: "090771", fullName: "โสภณ ทองไพจิตร", department: "OP2S" },
      { empId: "090772", fullName: "ณัฐพล ปงแปง", department: "OP4" },
      { empId: "090773", fullName: "พิชญ์รดา กึกกอง", department: "QMSS" },
      { empId: "090774", fullName: "ทิวาณี ประมูลสิน", department: "QMSS" },
      { empId: "090775", fullName: "พีรพรรณ พิลึก", department: "QMSS" },
      { empId: "090776", fullName: "สุภาวรรณ วรรณห้วย", department: "QMSS" },
      { empId: "090777", fullName: "วิมล พิทักษ์", department: "QMSS" },
      { empId: "090778", fullName: "ฐิติกาญจน์ ก้อนแก้ว", department: "OP2S" },
      { empId: "090779", fullName: "สุภนิดา ดีดี", department: "OP2S" },
      { empId: "090780", fullName: "อริสา หล้าเขียว", department: "OP2S" },
      { empId: "090781", fullName: "ณัฐพร จันทะนา", department: "OP2S" },
      { empId: "090782", fullName: "ฉวีวรรณ สุริยะวงค์", department: "OP2S" },
      { empId: "090783", fullName: "วรางคณา สมไผ่", department: "OP3" },
      { empId: "090784", fullName: "นิลลดา สุวรรณ์", department: "OP3" },
      { empId: "090785", fullName: "ชุติกาญจน์ นันชัย", department: "OP3" },
      { empId: "090786", fullName: "สุพัตรา สีมา", department: "OP3" },
      { empId: "090787", fullName: "สุวรรณนรัฐ ผัดเป้า", department: "OP3" },
      { empId: "090788", fullName: "นิศารัตน์ เทียมเย็น", department: "OP3" },
      { empId: "090789", fullName: "กัญญารัตน์ บุญคำ", department: "OP3" },
      { empId: "090790", fullName: "ศิรประภา ก้อนสินธุ์", department: "OP3" },
      { empId: "090791", fullName: "พัชรินทร์ ดุกสุกแก้ว", department: "OP3" },
      { empId: "090792", fullName: "ครองขวัญ มณีนิติกร", department: "OP3" },
      { empId: "090793", fullName: "แสงเดือน ร่มพนาธรรม", department: "OP3" },
      { empId: "090794", fullName: "ณัฐนันท์ ใจคำ", department: "OP3" },
      { empId: "090795", fullName: "ณัฐภัสสร อนุเวช", department: "OP3" },
      { empId: "090796", fullName: "ภูษณิศา ขัดต๊ะ", department: "OP3" },
      { empId: "090797", fullName: "สุชาดา ปาสะละ", department: "OP3" },
      { empId: "090798", fullName: "ณิชาริญ จันทร์อิ่ม", department: "OP3" },
      { empId: "090799", fullName: "นันทิกานต์ ขัดปัญญา", department: "OP3" },
      { empId: "090800", fullName: "มนฤดี ชัยรัตน์", department: "OP3" },
      { empId: "090801", fullName: "สิริยุพา รุ่งธีรกานต์", department: "OP3" },
      { empId: "090802", fullName: "กมลชนก ลีลาวรรธนะ", department: "OP3" },
      { empId: "090803", fullName: "ประภัสสร สุมามาล", department: "OP3" },
      { empId: "090804", fullName: "มณีวรรณ แจ่มจ้า", department: "OP3" },
      { empId: "090805", fullName: "วณัชยา โปธิสิงห์", department: "OP3" }
    ];
  }

  updateEmployeeDatabase(data) {
    if (Array.isArray(data) && data.length > 0) {
      this.employeeDatabase = data;
    }
  }

  cleanEmpId(empId) {
    if (!empId) return '';
    let s = empId.toString().replace(/^'/, '').trim().toUpperCase();
    // แปลงเลขไทย ๐-๙ เป็น 0-9
    const thaiDigits = ['๐','๑','๒','๓','๔','๕','๖','๗','๘','๙'];
    for (let i = 0; i < thaiDigits.length; i++) {
      s = s.split(thaiDigits[i]).join(i.toString());
    }
    // ตัดเลขศูนย์นำหน้า
    return s.replace(/^0+/, '');
  }

  lookupEmployee(empId) {
    if (!empId) return null;
    const rawTrimmed = empId.toString().replace(/^'/, '').trim().toUpperCase();
    const cleanTarget = this.cleanEmpId(empId);
    if (!cleanTarget) return null;

    // 1. ค้นหาจากฐานข้อมูลพนักงานหลัก (แท็บ Name)
    const emp = this.employeeDatabase.find(e => {
      const dbRaw = (e.empId || '').toString().replace(/^'/, '').trim().toUpperCase();
      const dbClean = this.cleanEmpId(e.empId);
      return dbClean === cleanTarget || dbRaw === rawTrimmed;
    });
    if (emp && emp.fullName) return emp;

    // 2. ค้นหาจากประวัติความคืบหน้าสด (Live Progress) กรณีพนักงานทำค้างไว้
    const live = this.liveProgressLog.find(l => {
      const lClean = this.cleanEmpId(l.empId);
      const lRaw = (l.empId || '').toString().replace(/^'/, '').trim().toUpperCase();
      return (lClean === cleanTarget || lRaw === rawTrimmed) && l.fullName && l.fullName.trim() !== 'test';
    });
    if (live && live.fullName) {
      return { empId: live.empId, fullName: live.fullName, department: live.department || '' };
    }

    // 3. ค้นหาจากประวัติการสอบที่เคยส่ง (Submissions Log)
    const sub = this.submissionsLog.find(s => {
      const sClean = this.cleanEmpId(s.empId);
      const sRaw = (s.empId || '').toString().replace(/^'/, '').trim().toUpperCase();
      return (sClean === cleanTarget || sRaw === rawTrimmed) && s.fullName && s.fullName.trim() !== 'test';
    });
    if (sub && sub.fullName) {
      return { empId: sub.empId, fullName: sub.fullName, department: sub.department || '' };
    }

    return null;
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
    if (window.__resetAllActive) {
      this.liveProgressLog = [];
      return;
    }
    if (Array.isArray(fetchedLiveProgress)) {
      const blacklist = window.__recentlyResetEmpIds || new Set();
      this.liveProgressLog = fetchedLiveProgress.filter(l => {
        const cid = this.cleanEmpId(l.empId);
        return !blacklist.has(cid);
      });
    } else {
      this.liveProgressLog = [];
    }
  }

  getEmployeeLiveProgress(empId) {
    if (!empId) return null;
    const target = this.cleanEmpId(empId);
    return this.liveProgressLog.find(l => this.cleanEmpId(l.empId) === target) || null;
  }

  clearEmployeeLiveProgress(empId) {
    if (!empId) return;
    if (empId === 'ALL') {
      this.liveProgressLog = [];
      return;
    }
    const target = this.cleanEmpId(empId);
    this.liveProgressLog = this.liveProgressLog.filter(l => this.cleanEmpId(l.empId) !== target);
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
    this.isExamSubmitted = false;

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

    this.activeExamQuestions.forEach((q, idx) => {
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
        screenIndex: idx,
        screenNumber: idx + 1,
        questionId: q.id,
        questionText: q.question,
        userAnswer: uAns,
        correctAnswer: q.answer,
        isCorrect: (uAns === q.answer),
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
    this.isExamSubmitted = true;
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

