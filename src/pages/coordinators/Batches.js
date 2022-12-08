/*
  Imports
*/
import { Container } from '@material-ui/core';

import Page from '../../components/Page';
import BatchesList from './tables/BatchesList';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import { MadrisaContext } from './context/MadrisaContext';
/*
  Main Working
*/
export default () => {
  const navigate = useNavigate();

  const { madrisa } = useContext(MadrisaContext);

  const pageName = madrisa.code + " Batches";

  /*
    Handlers, Functions
  */
  const handleAdd = () => {
    navigate('./add');
  };


  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>
          {pageName}
        </ListPageTitle>
        <BatchesList batches={madrisa.batches} />
        {!madrisa.blocked && <FloatingAdd tooltip='Start new batch' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
