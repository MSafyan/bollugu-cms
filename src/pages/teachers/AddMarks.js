/*
    Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from 'src/components/Page';
import { ClassContext } from './context/ClassContext';
import Form from './forms/AddMarksForm';

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
    <Page title={`${editing ? 'Edit' : 'Add'} Marks`} >
      <Container maxWidth="xl">
        <ListPageTitleWithLink onClick={toHome}>
          {class_.name}
        </ListPageTitleWithLink>
        <ListPageTitle>
          {editing ? 'Edit Marks' : 'Add Marks'}
        </ListPageTitle>
        <Form classes={class_} editing={editing} />
      </Container>
    </Page >
  );
};
