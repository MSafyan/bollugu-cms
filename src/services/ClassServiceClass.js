import qs from 'qs';
import structuredClone from '@ungap/structured-clone';
import batchService from './BatchService';
import courseService from './CourseService';
import teacherService from './TeacherService';
import studentService from './StudentService';
import GenericService from './GenericService';
import marksService from './MarksService';
import attendanceService from './AttendanceService';
import assignmentService from './AssignmentService';
import announcementService from './AnnoucementService';
import courseContentService from './CourseContentService';


class ClassService extends GenericService {
  constructor() {
    super();
    this.populate = [
      'teacher.user.image',
      'course.pre',
      'students.user.image',
      'students.section.batch',
      'batch.madrisa.coordinators',
      'attendances.students',
      'marks.marks.student',
      'assignments.submissions.student',
      'assignments.submissions.file',
      'assignments.file',
      'announcements',
      'contents',
      'contents.file'
    ];
  }

  extractData(data, studentOnly) {
    const { id, attributes } = data;
    const {
      name,
      teacher: teacher_a,
      course: course_a,
      students: students_obj,
      batch: batch_a,
      blocked,
      attendances: attendance_obj,
      marks: marks_obj,
      testWeightage,
      assignmentWeightage,
      midsWeightage,
      finalWeightage,
      attendanceWeightage,
      attendancePercentage,
      assignments: assignments_obj,
      announcements: announcements_obj,
      contents: contents_obj
    } = attributes;

    let students = [];
    if (studentOnly) {

      students.push(structuredClone(studentOnly));

    }
    else if (students_obj) {
      const { data: student_data } = students_obj;
      students = student_data.map((student) => studentService.extractData(student));
    }
    let batch = {};
    if (batch_a) {
      const { data: batch_data } = batch_a;
      if (batch_data) batch = batchService.extractData(batch_data);
    }

    let teacher = {};
    if (teacher_a) {
      const { data: teacher_data } = teacher_a;
      if (teacher_data) teacher = teacherService.extractData(teacher_data);
    }

    let course = {};
    if (course_a) {
      const { data: course_data } = course_a;
      if (course_data) course = courseService.extractData(course_data);
    }

    let attendance = [];
    if (attendance_obj) {
      const { data: attendance_data } = attendance_obj;
      attendance = attendance_data.map((att) => attendanceService.extractData(att));
      students = attendanceService.assignToStudents(students, attendance, attendancePercentage);
    }

    let assignments = [];
    if (assignments_obj) {
      const { data: assignments_data } = assignments_obj;
      for (const element of assignments_data) {
        const assignment = assignmentService.extractData(element);
        students = assignmentService.fixMissingStudents(students, assignment);
        assignments.push(assignment);
      }
    }

    let announcements = [];
    if (announcements_obj) {
      const { data: ann_data } = announcements_obj;
      announcements = ann_data.map((ann) => announcementService.extractData(ann));
    }
    if (announcements.length > 1)
      announcements.sort((a, b) => b.id - a.id);


    let marks = [];
    if (marks_obj) {
      const { data: marks_data } = marks_obj;
      marks = marks_data.map((mark) => marksService.extractData(mark));
      marksService.fixMissingStudents(marks, students);
      const studentsWithMarks = marksService.assignToStudents(
        students,
        marks,
        {
          testWeightage,
          assignmentWeightage,
          midsWeightage,
          finalWeightage,
          attendanceWeightage
        },
        studentOnly
      );
      students = studentsWithMarks;
    }

    const pass = students.filter((student) => student.pass).length;
    const fail = students.filter((student) => !student.pass).length;

    let contents = [];
    if (contents_obj) {
      const { data: con_data } = contents_obj;
      contents = con_data.map((cc) => courseContentService.extractData(cc));
    }

    return {
      id,
      name,
      teacher,
      course,
      batch,
      blocked,
      students,
      attendance,
      marks,
      pass,
      fail,
      testWeightage,
      assignmentWeightage,
      midsWeightage,
      finalWeightage,
      attendanceWeightage,
      attendancePercentage,
      assignments,
      announcements,
      contents
    };
  }

  getClasses(response) {
    const { data } = response;
    return data.map((class_) => this.extractData(class_));
  }

  getAll = (BatchID, page, pageSize, pop) =>
    new Promise((resolve, reject) => {
      this.get(
        `classes?${qs.stringify({
          populate: pop ? pop : this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            batch: {
              id: BatchID
            }
          }
        })}`
      )
        .then((response) => resolve(this.getClasses(response)))
        .catch((err) => reject(err));
    });

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`classes/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  find = (ID, studentOnly, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        filters: {
          name: ID
        }
      });
      this.get(`classes?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data[0], studentOnly));
        })
        .catch((err) => reject(err));
    });

  findByCourse = (ID, page, pageSize, pop) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: pop ? pop : this.populate,
        pagination: {
          page,
          pageSize
        },
        filters: {
          course: {
            code: ID
          }
        }
      });
      this.get(`classes?${query}`)
        .then((response) => resolve(this.getClasses(response)))
        .catch((err) => reject(err));
    });

  addClass = (name, batch, teacher, course, students) =>
    Promise.resolve(this.post(`classes`, {
      data: {
        name,
        batch,
        teacher,
        course,
        students
      }
    }));
  addGradingSystem = (testWeightage, assignmentWeightage, midsWeightage, finalWeightage, attendanceWeightage, attendancePercentage, id) =>
    Promise.resolve(this.put(`classes/${id}`, {
      data: {
        testWeightage, assignmentWeightage, midsWeightage, finalWeightage, attendanceWeightage, attendancePercentage
      }
    }));

  updateClass = (name, batch, teacher, course, _students, id) => {
    return Promise.resolve(this.put(`classes/${id}`, {
      data: {
        name,
        batch,
        teacher,
        course,
      }
    }));
  };

  updateStudents = (id, students) => {
    return Promise.resolve(this.put(`classes/${id}`, {
      data: {
        students
      }
    }));
  };

  lock = (ID) =>
    this.put(`classes/${ID}`, {
      data: { blocked: true }
    });

  unlock = (ID) =>
    this.put(`classes/${ID}`, {
      data: { blocked: false }
    });

  remove = (ID) => new Promise((resolve, reject) => {
    const query = qs.stringify({
      populate: ['students', 'teacher']
    });
    this.delete(`classes/${ID}?${query}`)
      .then((response) => {
        resolve(this.extractData(response.data));
      })
      .catch((err) => reject(err));
  });

  getByMadrisa = (madrisaID, page, pageSize, pop) =>
    new Promise((resolve, reject) => {
      this.get(
        `classes?${qs.stringify({
          populate: pop ? pop : this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            batch: {
              madrisa: {
                $or: [
                  {
                    id: madrisaID
                  },
                  {
                    code: madrisaID
                  }
                ]
              }
            }
          }
        })}`
      )
        .then((response) => resolve(this.getClasses(response)))
        .catch((err) => reject(err));
    });

  getByTeacher = (teacherID, page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `classes?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            teacher: {
              id: teacherID
            }
          }
        })}`
      )
        .then((response) => resolve(this.getClasses(response)))
        .catch((err) => reject(err));
    });

  getByStudent = (studentID, page, pageSize, student) =>
    new Promise((resolve, reject) => {
      this.get(
        `classes?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            students: {
              id: studentID
            }
          }
        })}`
      )
        .then((response) => {
          const { data } = response;
          for (let index = 0; index < data.length; index += 1) {
            data[index] = this.extractData(data[index], student);
          }
          resolve(data);
        })
        .catch((err) => reject(err));
    });

  getByStudentResult = (studentID, page, pageSize) =>
    new Promise((resolve, reject) => {
      this.get(
        `classes?${qs.stringify({
          populate: this.populate,
          pagination: {
            page,
            pageSize
          },
          filters: {
            $and: [
              {
                students: {
                  id: studentID
                }
              },
              {
                marks: {
                  type: 'Final'
                }
              }
            ]

          }
        })}`
      )
        .then((response) => resolve(this.getClasses(response)))
        .catch((err) => reject(err));
    });
}

export default ClassService;
