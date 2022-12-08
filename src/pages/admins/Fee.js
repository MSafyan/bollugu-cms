/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from '../../components/Page';
import FeeList from './tables/FeeList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();

  /*
    Handlers, Functions
  */
  const handleAddButton = () => {
    navigate('./add');
  };

  /*
    Main Design
  */
  return (
    <Page title="Fee">
      <Container>
        <ListPageTitle>Fee</ListPageTitle>
        <FeeList />
        <FloatingAdd tooltip='Add new fee' onClick={handleAddButton} />
      </Container>
    </Page>
  );
};
