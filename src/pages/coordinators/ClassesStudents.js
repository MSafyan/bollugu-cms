/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  Imports:
    Our Imports
    Components and Settings
*/
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import { CoordinatorClassContext } from './context/CoordinatiorClassContext';
import { MadrisaContext } from './context/MadrisaContext';
import GradingSystemDetails from './header/GradingSystemDetails';
import ClassesStudentsList from './tables/ClassesStudentsList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { c: class_, reload: reloadClass } = useContext(CoordinatorClassContext);
  const { madrisa, reload: reloadMadrisa } = useContext(MadrisaContext);
  const navigate = useNavigate();

  const pageName = class_.name;

  /*
    Handlers, Functions
  */
  const handleAddButton = () => {
    navigate('./add');
  };

  const reload = () => {
    reloadMadrisa();
    reloadClass();
  };

  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        <ClassesStudentsList blocked={madrisa.blocked} classData={class_} getData={reload} />
        <br />
        <br />
        <br />
        <GradingSystemDetails data={class_} />
        {(!madrisa.blocked && !class_.blocked) && <FloatingAdd tooltip='Add student to class' onClick={handleAddButton} />}
      </Container>
    </Page>
  );
};
