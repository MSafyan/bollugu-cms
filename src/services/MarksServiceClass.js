import GenericService from './GenericService';
import studentService from './StudentService';

class MarksServiceClass extends GenericService {
  extractData(data) {
    const { id, attributes } = data;
    const { topic, type, total, createdAt: time, marks: marks_data } = attributes;
    let marks = {
      id,
      topic,
      type,
      total,
      time
    };
    const students = [];
    if (marks_data) {
      for (const mark of marks_data) {
        const { obtained, student: student_a } = mark;
        if (student_a?.data) {
          let student = studentService.extractData(student_a.data);
          const marks_factor = obtained / total;
          const pass = marks_factor < 0.5 ? false : true;
          student = { obtained, sid: student.id, pass, marks_factor, attempted: true };
          students.push(student);
        }
      }
    }


    marks.students = students;
    return marks;
  }

  fixMissingStudents(marks, students) {
    marks = [...marks];
    students = [...students];
    students.sort((a, b) => a.id - b.sid);
    marks.forEach((mark) => {
      mark.students.sort((a, b) => a.sid - b.sid);
      students.forEach((student) => {
        if (!mark.students.find((student_m) => student_m.sid == student.id)) {
          mark.students.push({ obtained: 0, sid: student.id, pass: false, marks_factor: 0 });
        }
      });
      mark.students.sort((a, b) => a.sid - b.sid);
    });
    return marks;
  }

  assignToStudents(students, marks, weightage) {
    marks = [...marks];
    marks.sort((a, b) => a.type.localeCompare(b.type));
    students = [...students];

    marks.forEach((mark) => {
      mark.students.forEach((student) => {
        const s = students.find((student_m) => student_m.id == student.sid);
        if (s) {
          s.marks.push({ ...mark, ...student });
        }
      });
    });

    students.forEach((student) => {
      this.calculateCurrentResult(student, weightage);
    });
    return students;
  }

  calculateCurrentResult(student, weightage) {
    const {
      testWeightage,
      assignmentWeightage,
      midsWeightage,
      finalWeightage,
      attendanceWeightage
    } = weightage;

    let attendanceFactor = student.attendanceFactor;
    let assginmentsFactors, testFactors, midsFactor, finalFactors;
    let n_a, n_t, n_m, n_f;

    assginmentsFactors = testFactors = midsFactor = finalFactors = n_a = n_t = n_m = n_f = 0;

    student.marks.forEach((mark) => {
      switch (mark.type) {
        case 'Test':
          testFactors += mark.marks_factor;
          n_t++;
          break;
        case 'Assignment':
          assginmentsFactors += mark.marks_factor;
          n_a++;
          break;
        case 'Mid':
          midsFactor += mark.marks_factor;
          n_m++;
          break;
        case 'Final':
          finalFactors += mark.marks_factor;
          n_f++;
          break;
      }
    });

    let totalWeightage = 0;
    if (n_a) {
      totalWeightage += assignmentWeightage;
      assginmentsFactors /= n_a;
      assginmentsFactors *= assignmentWeightage;
    }

    if (n_t) {
      totalWeightage += testWeightage;
      testFactors /= n_t;
      testFactors *= testWeightage;
    }

    if (n_m) {
      totalWeightage += midsWeightage;
      midsFactor /= n_m;
      midsFactor *= midsWeightage;
    }

    if (n_f) {
      totalWeightage += finalWeightage;
      finalFactors /= n_f;
      finalFactors *= finalWeightage;
    }

    if (student.attendance.length > 0) {
      totalWeightage += attendanceWeightage;
      attendanceFactor *= attendanceWeightage;
    }

    let totalFactor = 1;
    if (totalWeightage != 0)
      totalFactor =
        (assginmentsFactors + testFactors + midsFactor + finalFactors + attendanceFactor) /
        totalWeightage;
    totalFactor = parseFloat(totalFactor.toFixed(2));
    student.total = totalWeightage;
    student.totalFactor = totalFactor;

    student.assginmentsFactors = assginmentsFactors;
    student.testFactors = testFactors;
    student.midsFactor = midsFactor;
    student.finalFactors = finalFactors;
    student.attendanceFactors = attendanceFactor;

    student.obtained = Math.round(
      assginmentsFactors + testFactors + midsFactor + finalFactors + attendanceFactor
    );
    student.pass = totalFactor < 0.5 ? false : true;
  }

  remove = (ID) => this.delete(`class-marks/${ID}`);

  addMarks = (class_, topic, type, total, marks, _id) =>
    Promise.resolve(this.post(`class-marks`, {
      data: {
        class_,
        topic,
        type,
        total,
        marks
      }
    }));

  update = (_class_, topic, _type, total, marks, id) =>
    Promise.resolve(this.put(`class-marks/${id}`, {
      data: {
        topic,
        total,
        marks
      }
    }));
}


export default MarksServiceClass;
