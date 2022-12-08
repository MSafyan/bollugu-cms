/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import Dialog from 'src/components/misc/alerts/Dialog';
import adminService from 'src/services/AdminService';
import coordinatorService from 'src/services/CoordinatorService';
import studentService from 'src/services/StudentService';
import teacherService from 'src/services/TeacherService';
import userService from 'src/services/UserService';
import Page from '../../components/Page';
import CoordinatorProfile from './profile/CoordinatorProfile';
import ProfileOptions from './profile/ProfileOptions';
import StudentResult from './profile/StudentResult';
import TeacherProfile from './profile/TeacherProfile';
import UserProfile from './profile/UserProfile';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: '' });
  const [sameUser, setSameUser] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState({});

  const [showDelete, setShowDelete] = useState(false);

  const userType = (useParams().type || '').toLowerCase();
  const userID = useParams().id;

  const isCoordinator = userType == 'coordinators';
  const isTeacher = userType == 'teachers';
  const isStudent = userType == 'students';

  const { name } = user;

  /*
    Handlers, Functions
  */
  const getData = () => {
    userService
      .getLoggedInUser()
      .then((u) => {
        setLoggedInUser(u);
      })
      .catch((_err) => {
        navigate('/404');
      });
    let funcToCall = userService.getLoggedInUser;
    if (userID) {
      setSameUser(false);
      funcToCall = adminService.find;
      switch (userType) {
        case 'coordinators':
          funcToCall = coordinatorService.find;
          break;
        case 'teachers':
          funcToCall = teacherService.find;
          break;
        case 'students':
          funcToCall = studentService.find;
          break;
      }
    }
    funcToCall(userID)
      .then((u) => {
        setUser(u);
      })
      .catch((_err) => {
        navigate('/404');
      })
      .finally(() => setLoading(false));
  };

  const handleLock = () => {
    let toCall = userService.lock;
    if (user.blocked) toCall = userService.unlock;

    toCall(user.u_id)
      .then(getData)
      .catch((_err) => {
        //Error handling lock
      });
  };

  const handleEditStudent = () => {
    navigate(`/coordinator/madaris/${user.section.batch.madrisa.code}/students/${user.section.batch.id}/${user.section.id}/${user.username}/edit`);
  };

  const handleEdit = () => {
    navigate(`./edit`);
  };

  const handleDelete = () => {
    if (isStudent) {
      setShowDelete(true);
    }
  };

  const handleClose = () => {
    setShowDelete(false);
  };

  const handleDeleteFinal = () => {
    studentService.
      remove(user.id)
      .then(() => {
        navigate(-1);
      })
      .catch((_err) => {
        //Error here.
      });
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={sameUser ? 'Your Profile' : `Viewing ${name}`}>
      {loading ? (
        <CenterLoading />
      ) : (
        <Container maxWidth="xl">
          <UserProfile user={user} />
          {isCoordinator && <CoordinatorProfile user={user} />}

          {isStudent && <StudentResult classes={user.classes} />}

          {isTeacher && <TeacherProfile classes={user.classes} user={user} />}

          {isCoordinator && loggedInUser.isAdmin &&
            (
              <ProfileOptions
                user={user}
                handleEdit={handleEdit}
                handleLock={handleLock}
              />
            )
          }

          {isTeacher && loggedInUser.isCoordinator &&
            (
              <ProfileOptions
                user={user}
              />
            )
          }

          {isStudent && loggedInUser.isCoordinator &&
            (
              <ProfileOptions
                user={user}
                handleDelete={handleDelete}
                handleEdit={handleEditStudent}
                handleLock={handleLock}
              />
            )
          }
          {
            isStudent &&
            <Dialog
              error={user.classes.length <= 0}
              warning={user.classes.length > 0}
              buttonText={"Close"}
              buttonText2={user.classes.length > 0 ? '' : 'Remove'}
              openDialog={showDelete}
              handleButton={handleClose}
              handleButton2={handleDeleteFinal}
            >
              {user.classes.length > 0 ? `You can not delete a student who has been assgined to classes, please remove the student from classes first` : `Are you sure you want to remove?`}
            </Dialog>
          }
        </Container>
      )}
    </Page>
  );
};
