/*
  Imports
*/
import { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import AlertSnackbar from 'src/components/misc/alerts/AlertSnackbar';
import CenterLoading from 'src/components/misc/CenterLoading';
import { LockIcon } from 'src/config/icons';
import madrisaService from 'src/services/MadrisaService';
import userService from 'src/services/UserService';

/*
    Context Handling
*/

export const MadrisaContext = createContext();

/*
    Main Working
*/
export const MadrisaProvider = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const mID = useParams().mID;

  const populate = [
    'coordinators',
    'batches.sections.students.user.image',
    'batches.sections.students.classes.course',
    'batches.sections.students.classes.marks.marks.student',
    'batches.sections.students.classes.attendance',
    'teachers.user.image',
    'teachers.user.contact',
    'teachers.classes.courses',
    'teachers.classes.batch.madrisa',
    'batches.classes.teacher',
    'batches.classes.course'
  ];

  const navigate = useNavigate();

  const handleData = async (m) => {
    setLoading(true);
    const coordinator = await userService.getLoggedInUser();
    if (m.coordinatorIds.indexOf(coordinator.id) != -1) {
      getLatestBatch(m);
      setData(m);
      setLoading(false);
      return;
    }
    navigate('/401');
  };

  const getData = async () => {
    madrisaService
      .find(mID, populate)
      .then(handleData)
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/401');
        navigate('/404');
      });
  };

  function getLatestBatch(madrisa) {
    madrisa.batch = madrisa.batches[madrisa.batches.length - 1];
    for (const batch of madrisa.batches) {
      const sections = batch.sections;
      batch.students = 0;
      for (const section of sections) {
        batch.students += section.students.length;
      }
      const classes = batch.classes;
      batch.teachers = 0;
      batch.courses = 0;
      const teacherArray = [];
      const courseArray = [];
      for (const t of classes) {
        if (t.teacher)
          if (!teacherArray.find((id) => id == t.teacher.id)) {
            teacherArray.push(t.teacher.id);
            batch.teachers++;
          }
        if (t.course)
          if (!courseArray.find((id) => id == t.course.id)) {
            courseArray.push(t.course.id);
            batch.courses++;
          }
      }
    }
  }

  useEffect(getData, [mID]);
  return (
    <MadrisaContext.Provider value={{ madrisa: data, reload: getData }}>
      {loading ? (
        <CenterLoading />
      ) : (
        <>
          {data && <Outlet />}
          <AlertSnackbar open={data?.blocked} severity="error" icon={LockIcon}>
            {data?.name} is disabled by admin.
          </AlertSnackbar>
        </>
      )}
    </MadrisaContext.Provider>
  );
};
