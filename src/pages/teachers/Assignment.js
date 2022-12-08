/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import AssignmentList from './tables/AssignmentList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const reload = useContext(ClassContext).reload;

  const navigate = useNavigate();
  const class_ = useContext(ClassContext).c;

  /*
    Handlers, Functions
  */
  const handleAdd = () => {
    navigate('./add');
  };

  const toHome = () => {
    navigate(`/teacher/${class_.name}`);
  };
  /*
    Main Design
  */
  return (
    <Page title={class_.name}>
      <Container>
        <ListPageTitleWithLink onClick={toHome}>{class_.name}</ListPageTitleWithLink>
        <ClassHeader data={class_} />

        <br />
        <br />

        <AssignmentList assignment_data={class_.assignments} reload={reload} past={class_.blocked} />
        {!class_.blocked && <FloatingAdd tooltip='Create new assignment' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
