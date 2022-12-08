/*
    Imports
*/
import { useEffect, useContext } from 'react';
import { Container } from '@material-ui/core';
import { RootStyle } from '../../theme/form-pages';
import Form from './forms/AddAttendanceForm';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import { ClassContext } from './context/ClassContext';
import { useNavigate } from 'react-router-dom';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';

/*
    Main Working
*/
export default ({ editing }) => {
  const class_ = useContext(ClassContext).c;

  const navigate = useNavigate();
  useEffect(() => {
    if (class_.blocked)
      navigate('/404');
  }, []);

  const toHome = () => {
    navigate(`/teacher/${class_.name}`);
  };
  /*
    Main Design
  */
  return (
    <RootStyle title={`${editing ? 'Edit' : 'Add'} Attendance`} >
      <Container maxWidth="xl">
        <ListPageTitleWithLink onClick={toHome}>
          {class_.name}
        </ListPageTitleWithLink>
        <ListPageTitle>
          {editing ? 'Edit ' : 'Add '}Attendance
        </ListPageTitle>
        <Form classes={class_} editing={editing} />
      </Container>
    </RootStyle >
  );
};
