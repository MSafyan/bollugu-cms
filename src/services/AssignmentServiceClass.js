import qs from 'qs';
import GenericService from './GenericService';
import otherService from './OtherService';

class AssignmentServiceClass extends GenericService {
  constructor() {
    super();
    this.populate = ['submissions.student', 'submissions.file', 'file'];
  }

  extractData(data) {
    const { id, attributes } = data;
    const {
      topic,
      start,
      end,
      description,
      marks,
      file: file_obj,
      submissions: submissions_arr
    } = attributes;

    const submissions = [];
    const submissions_o = [];
    if (submissions_arr && submissions_arr.length > 0) {
      for (const submission of submissions_arr) {
        if (submission.file.data) {
          const file_ = otherService.extractFile(submission.file.data);
          let student = {
            id: submission.student.data.id,
            file: file_
          };
          submissions.push(student);
          submissions_o.push(
            {
              student: student.id,
              file: file_.id
            }
          );
        }
      }
    }

    let file;
    const { data: file_data } = file_obj;
    if (file_data) {
      file = otherService.extractFile(file_data);
    }

    return {
      id,
      topic,
      start,
      end,
      description,
      marks,
      file,
      submissions,
      submissions_o
    };
  }

  fixMissingStudents(students, assignment) {
    students.forEach((s) => {
      const found = assignment.submissions.find((sub) => sub.id == s.id);
      if (found) {
        s.file = found.file;
      }
    });
    assignment.students = students;
    return students;
  }

  assignToStudent(student) {
    student.attendance = [];
    let presentCounter = 0;
    attendance.forEach((c) => {
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

  getOne = (ID) =>
    new Promise((resolve, reject) => {
      const query = qs.stringify({
        populate: this.populate
      });
      this.get(`class-assignments/${ID}?${query}`)
        .then((response) => {
          resolve(this.extractData(response.data));
        })
        .catch((err) => reject(err));
    });

  add = (class_, start, end, file, topic, marks, description) =>
    Promise.resolve(this.post(`class-assignments`, {
      data: {
        class_,
        start,
        end,
        file,
        topic,
        marks,
        description
      }
    }));

  update = (class_, start, end, file, topic, marks, description, aID) =>
    Promise.resolve(this.put(`class-assignments/${aID}`, {
      data: {
        class: class_,
        start,
        end,
        file,
        topic,
        marks,
        description
      }
    }));

  uploadByStudent = (id, submission) =>
    Promise.resolve(this.put(`class-assignments/upload/${id}`, {
      data: {
        ...submission
      }
    }));

  remove = (ID) => this.delete(`class-assignments/${ID}`);

  downloadAllFiles = (ID) =>
    new Promise((resolve, reject) => {
      this.get(`class-assignments/download/${ID}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => reject(err));
    });

}

export default AssignmentServiceClass;
