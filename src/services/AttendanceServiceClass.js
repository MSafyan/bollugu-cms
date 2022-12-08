import GenericService from './GenericService';
import studentService from './StudentService';

class AttendanceServiceClass extends GenericService {
  extractData(data) {
    const { id, attributes } = data;
    const { topic, start, end, students: students_obj } = attributes;

    let students = [];
    if (students_obj) {
      const { data: students_arr } = students_obj;
      students = students_arr.map((student) => {
        return studentService.extractData(student);
      });
    }
    return {
      id,
      topic,
      start,
      end,
      students
    };
  }

  assignToStudents(students, attendance, minimum) {
    attendance = [...attendance];
    attendance.sort((a, b) => (new Date(a.start)).getTime() - (new Date(b.start)).getTime());

    students.forEach(student => {
      this.assignToStudent(student, attendance, minimum);
    });
    return students;
  }

  assignToStudent(student, attendance, minimum) {
    student.attendance = [];
    let presentCounter = 0;
    attendance.forEach(c => {
      let present = false;
      if (c.students.find((s) => s.id == student.id)) {
        presentCounter++;
        present = true;
      }


      let oneClass = {
        id: c.id,
        topic: c.topic,
        start: c.start,
        end: c.end,
        present,
        minimum
      };

      student.attendance.push(oneClass);
    });

    student.presents = presentCounter;
    student.attendanceFactor = 1;
    if (student.attendance.length > 0)
      student.attendanceFactor = presentCounter / student.attendance.length;

    student.attendancePercentage = Math.ceil(student.attendanceFactor * 100);

  }

  remove = (ID) =>
    this.delete(`class-attendances/${ID}`);

  addAttendance = (class_, start, end, topic, students) =>
    Promise.resolve(this.post(`class-attendances`, {
      data: {
        class_,
        start,
        end,
        topic,
        students
      }
    }));

  update = (_class_, start, end, topic, students, id) =>
    Promise.resolve(this.put(`class-attendances/${id}`, {
      data: {
        start,
        end,
        topic,
        students
      }
    }));

}

export default AttendanceServiceClass;
