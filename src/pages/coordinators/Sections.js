/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import { MadrisaContext } from './context/MadrisaContext';
import SectionsList from './tables/SectionsList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const { madrisa, reload } = useContext(MadrisaContext);
  const batchID = useParams().bID;
  const { year, blocked, sections } = madrisa.batches.find((b) => b.id == batchID) ?? {};
  const navigate = useNavigate();
  const pageName = madrisa.code + ' Batch ' + year;

  /*
    Handlers, Functions
  */
  const handleAdd = () => {
    navigate('./add');
  };

  useEffect(() => {
    if (!year)
      navigate('/404');
  }, []);

  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        <SectionsList data={sections} reload={reload} blocked={madrisa.blocked} />
        {(!madrisa.blocked && !blocked) && <FloatingAdd tooltip='Create new sections' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
