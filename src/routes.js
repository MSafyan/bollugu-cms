import { Navigate, Outlet, useRoutes } from 'react-router-dom';

import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';


import {
  RouteForgetPass,
  RouteLandingPage,
  RouteResetPass
} from './config/routes';

import AdminAddCoordinator from './pages/admins/AddCoordinator';
import AdminAddCourse from './pages/admins/AddCourse';
import AdminAddFee from './pages/admins/AddFee';
import AdminAddMadrisa from './pages/admins/AddMadrisa';
import AdminBatch from './pages/admins/Classes';
import AdminCoordinators from './pages/admins/Coordinators';
import AdminCourses from './pages/admins/Courses';
import AdminDashboard from './pages/admins/Dashboard';
import AdminFee from './pages/admins/Fee';
import AdminMadaris from './pages/admins/Madaris';
import AdminMadrisa from './pages/admins/Madrisa';
import AdminSearch from './pages/admins/Search';

import AddCourseContent from './pages/general/AddCourseContent';
import CourseContent from './pages/general/CourseContent';
import Dashboard from './pages/general/Dashboard';
import ForgetPassword from './pages/general/ForgetPassword';
import Login from './pages/general/Login';
import Logout from './pages/general/Logout';
import PageError from './pages/general/PageError';
import Profile from './pages/general/Profile';
import ResetPassword from './pages/general/ResetPassword';
import Settings from './pages/general/Settings';

import CoordinatorAddBatch from './pages/coordinators/AddBatch';
import CoordinatorAddClass from './pages/coordinators/AddClass';
import CoordinatorAddClassesStudents from './pages/coordinators/AddClassesStudents';
import CoordinatorAddSection from './pages/coordinators/AddSection';
import CoordinatorAddStudent from './pages/coordinators/AddStudent';
import CoordinatorAddTeacher from './pages/coordinators/AddTeacher';
import CoordinatorBatches from './pages/coordinators/Batches';
import CoordinatorClasses from './pages/coordinators/Classes';
import CoordinatorClassesStudents from './pages/coordinators/ClassesStudents';
import { CoordinatorClassProvider } from './pages/coordinators/context/CoordinatiorClassContext';
import { MadrisaProvider } from './pages/coordinators/context/MadrisaContext';
import CoordinatorCourseClasses from './pages/coordinators/CourseClasses';
import CoordinatorCourses from './pages/coordinators/Courses';
import CoordinatorDashboard from './pages/coordinators/Dashboard';
import CoordinatorFee from './pages/coordinators/Fee';
import CoordinatorMadrisa from './pages/coordinators/Madrisa';
import CoordinatorSections from './pages/coordinators/Sections';
import CoordinatorStudents from './pages/coordinators/Students';
import CoordinatorStudentSearch from './pages/coordinators/StudentSearch';
import CoordinatorTeachers from './pages/coordinators/Teachers';

import TeacherAddAnnouncement from './pages/teachers/AddAnnouncement';
import TeacherAddAssignment from './pages/teachers/AddAssignment';
import TeacherAnn from './pages/teachers/Announcements';
import TeacherAssignment from './pages/teachers/Assignment';
import TeacherAttendance from './pages/teachers/Attendance';
import TeacherClassDetails from './pages/teachers/ClassDetails';
import TeacherClassesStudents from './pages/teachers/ClassesStudents';
import { ClassProvider } from './pages/teachers/context/ClassContext';
import TeacherCourseContent from './pages/teachers/CourseContent';
import TeacherDashboard from './pages/teachers/Dashboard';
import TeacherMarks from './pages/teachers/Marks';
import TeacherMarksSummary from './pages/teachers/MarksSummary';
import TeacherPastClasses from './pages/teachers/PastClasses';
import TeacherViewAssignment from './pages/teachers/ViewAssignment';

import StudentAnnoucements from './pages/students/Announcements';
import StudentAssignments from './pages/students/Assignments';
import StudentAttendance from './pages/students/Attendance';
import StudentClassDetails from './pages/students/ClassDetails';
import { StudentClassProvider } from './pages/students/context/StudentClassContext';
import StudentCourseContent from './pages/students/CourseContent';
import StudentDashboard from './pages/students/Dashboard';
import StudentGradingSystem from './pages/students/GradingSystem';
import StudentMarks from './pages/students/Marks';
import StudentResult from './pages/students/Result';
import AddAttendance from './pages/teachers/AddAttendance';
import AddMarks from './pages/teachers/AddMarks';
import GradingSystem from './pages/teachers/GradingSystem';


export default function Router() {
  return useRoutes([
    {
      path: '/admin',
      element: <LogoOnlyLayout adminLogin loginPage />,
      children: [{ path: 'login', element: <Login admin /> }]
    },
    {
      path: '/admin',
      element: <DashboardLayout adminLogin />,
      children: [
        { path: 'dashboard', element: <AdminDashboard /> },

        { path: 'profile', element: <Profile /> },
        //{ path: '/tsearch', element: <TeacherSearch /> },
        { path: 'settings', element: <Settings /> },
        {
          path: 'coordinators/:coordinatorID/edit',
          element: <AdminAddCoordinator editing />
        },
        { path: 'coordinators/add', element: <AdminAddCoordinator /> },
        { path: 'coordinators', element: <AdminCoordinators /> },
        { path: 'madaris/add', element: <AdminAddMadrisa /> },
        { path: 'madaris/:mid/edit', element: <AdminAddMadrisa editing /> },
        { path: 'madaris/:mid/:bid', element: <AdminBatch /> },
        { path: 'madaris/:mid', element: <AdminMadrisa /> },

        { path: 'madaris', element: <AdminMadaris /> },
        { path: 'courses/add', element: <AdminAddCourse /> },
        { path: 'courses/:courseID/edit', element: <AdminAddCourse editing /> },
        { path: 'courses/:courseID/add', element: <AddCourseContent /> },
        {
          path: 'courses/:courseID/:courseContentID/edit',
          element: <AddCourseContent editing />
        },
        { path: 'courses/:courseID', element: <CourseContent /> },
        { path: 'courses', element: <AdminCourses /> },
        { path: 'addcourse', element: <AdminAddCourse /> },
        { path: 'students/search', element: <AdminSearch /> },
        { path: 'teachers/search', element: <AdminSearch isTeacher /> },
        { path: ':type/:id', element: <Profile /> },
        { path: 'fee', element: <AdminFee /> },
        { path: 'fee/add', element: <AdminAddFee /> }
      ]
    },
    {
      path: '/coordinator',
      element: <LogoOnlyLayout coordinatorLogin loginPage />,
      children: [{ path: 'login', element: <Login coordinator /> }]
    },
    {
      path: 'coordinator',
      element: <DashboardLayout coordinatorLogin />,
      children: [
        { path: 'dashboard', element: <CoordinatorDashboard /> },
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
        { path: 'fee', element: <CoordinatorFee /> },
        {
          path: 'madaris/:mID',
          element: <MadrisaProvider />,
          children: [
            { path: '', element: <CoordinatorMadrisa /> },
            {
              path: 'search',
              element: (
                <CoordinatorStudentSearch />
              ),
            },
            {
              path: 'courses',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <CoordinatorCourses /> },
                { path: ':courseID', element: <CoordinatorCourseClasses /> }
              ]
            },
            {
              path: 'teachers',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <CoordinatorTeachers /> },
                { path: 'add', element: <CoordinatorAddTeacher /> },
                {
                  path: 'edit/:teacherID',
                  element: <CoordinatorAddTeacher editing />
                }
              ]
            },
            {
              path: 'students',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <CoordinatorBatches /> },
                { path: 'add', element: <CoordinatorAddBatch /> },
                {
                  path: ':bID',
                  element: <Outlet />,
                  children: [
                    { path: '', element: <CoordinatorSections /> },
                    { path: 'add', element: <CoordinatorAddSection /> },
                    {
                      path: ':sID',
                      element: (
                        <>
                          <Outlet />
                        </>
                      ),
                      children: [
                        { path: '', element: <CoordinatorStudents /> },
                        { path: 'add', element: <CoordinatorAddStudent /> },
                        {
                          path: ':studentID/edit',
                          element: <CoordinatorAddStudent editing />
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              path: 'classes',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <CoordinatorClasses /> },
                { path: 'add', element: <CoordinatorAddClass /> },
                {
                  path: ':cID',
                  element: (<CoordinatorClassProvider />),
                  children: [
                    { path: '', element: <CoordinatorClassesStudents /> },
                    { path: 'add', element: <CoordinatorAddClassesStudents /> },
                    { path: 'edit', element: <CoordinatorAddClass editing /> },
                  ]
                }
              ]
            }
          ]
        },
        { path: 'fee', element: <AdminFee /> },
        { path: ':type/:id', element: <Profile /> }
      ]
    },
    {
      path: '/teacher',
      element: <LogoOnlyLayout teacherLogin loginPage />,
      children: [{ path: 'login', element: <Login teacher /> }]
    },
    {
      path: '/teacher',
      element: <DashboardLayout teacherLogin />,
      children: [
        { path: 'dashboard', element: <TeacherDashboard /> },
        { path: 'past', element: <TeacherPastClasses /> },
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
        {
          path: ':cID',
          element: <ClassProvider />,
          children: [
            { path: '', element: <TeacherClassDetails /> },
            {
              path: 'announcements',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <TeacherAnn /> },
                { path: 'add', element: <TeacherAddAnnouncement /> }
              ]
            },
            {
              path: 'students',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [{ path: '', element: <TeacherClassesStudents /> }]
            },
            {
              path: 'attendance',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <TeacherAttendance /> },
                { path: 'add', element: <AddAttendance /> },
                { path: ':attendanceID/edit', element: <AddAttendance editing /> },
              ]
            },
            {
              path: 'marks',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <TeacherMarks /> },
                { path: 'add', element: <AddMarks /> },
                { path: ':marksID/edit', element: <AddMarks editing /> },
                { path: 'summary', element: <TeacherMarksSummary /> }
              ]
            },
            {
              path: 'course-contents',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <TeacherCourseContent /> },
                { path: 'add', element: <AddCourseContent teacher /> },
                {
                  path: ':courseContentID/edit',
                  element: <AddCourseContent editingteacher />
                }
              ]
            },
            {
              path: 'assignments',
              element: (
                <>
                  <Outlet />
                </>
              ),
              children: [
                { path: '', element: <TeacherAssignment /> },
                { path: 'add', element: <TeacherAddAssignment /> },
                { path: ':aID', element: <TeacherViewAssignment /> },
                { path: ':assignmentID/edit', element: <TeacherAddAssignment editing /> }
              ]
            },
            {
              path: 'gradingSystem',
              element: <GradingSystem />
            }
          ]
        },
        { path: 'fee', element: <AdminFee /> },
        { path: ':type/:id', element: <Profile /> }
      ]
    },
    {
      path: 'student',
      element: <LogoOnlyLayout studentLogin loginPage />,
      children: [{ path: 'login', element: <Login student /> }]
    },
    {
      path: 'student',
      element: <DashboardLayout studentLogin />,
      children: [
        { path: 'dashboard', element: <StudentDashboard /> },
        { path: 'result', element: <StudentResult /> },
        { path: 'profile', element: <Profile /> },
        { path: 'settings', element: <Settings /> },
        {
          path: ':cID',
          element: <StudentClassProvider />,
          children: [
            { path: '', element: <StudentClassDetails /> },
            { path: 'attendance', element: <StudentAttendance /> },
            { path: 'gradingsystem', element: <StudentGradingSystem /> },
            { path: 'announcements', element: <StudentAnnoucements /> },
            { path: 'marks', element: <StudentMarks /> },
            { path: 'course-contents', element: <StudentCourseContent /> },
            { path: 'assignments', element: <StudentAssignments /> }
          ]
        },
        { path: 'fee', element: <AdminFee /> },
        { path: ':type/:id', element: <Profile /> }
      ]
    },
    {
      path: RouteLandingPage,
      element: <Dashboard />
    },
    {
      path: RouteLandingPage,
      element: <LogoOnlyLayout />,
      children: [
        { path: 'logout', element: <Logout /> },
        { path: '404', element: <PageError e404 /> },
        { path: '401', element: <PageError /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: RouteForgetPass, element: <ForgetPassword /> },
        { path: RouteResetPass, element: <ResetPassword /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
