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
import Form from './forms/AddAnnouncementForm';

/*
    Main Working
*/
export default () => {
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
    <Page title="Add Announcement">
      <Container maxWidth="xl">
        <ListPageTitleWithLink onClick={toHome}>
          {class_.name}
        </ListPageTitleWithLink>
        <ListPageTitle>
          Add Announcement
        </ListPageTitle>
        <Form classes={class_} />
      </Container>
    </Page >
  );
};
