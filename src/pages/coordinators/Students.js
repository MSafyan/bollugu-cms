/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import { MadrisaContext } from './context/MadrisaContext';
import StudentsList from './tables/StudentsList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { madrisa, reload } = useContext(MadrisaContext);

  const navigate = useNavigate();

  const sectionID = useParams().sID;

  let section;
  for (const batch of madrisa.batches) {
    section = batch?.sections?.find((s) => s.id == sectionID);
    if (section)
      break;
  }

  const students = section?.students;
  const pageName = `Section ${section.name} students`;

  /*
    Handlers, Functions
  */
  const handleAddButton = () => {
    navigate('./add');
  };


  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        <StudentsList ended={madrisa.batch.blocked || madrisa.blocked} students={students} sections={madrisa.batch.sections} reload={reload} />
        {(!madrisa.blocked && !madrisa.batch.blocked) && <FloatingAdd tooltip="Add new student" onClick={handleAddButton} />}
      </Container>
    </Page>
  );
};
