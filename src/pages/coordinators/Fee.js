/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import feeService from 'src/services/FeeService';
import userService from 'src/services/UserService';
import Page from '../../components/Page';
import FeeList from './tables/FeeList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [fee, setFee] = useState([]);
  const pageName = 'Fee Status';
  /*
    Handlers, Functions
  */
  const getData = async () => {
    setLoading(true);
    const coordinatorID = (await userService.getLoggedInUser()).id;
    feeService
      .findByCoordinator(coordinatorID)
      .then((data) => {
        setFee(data);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        {loading ? (
          <CenterLoading />
        ) : (
          <FeeList fee={fee} />
        )}
      </Container>
    </Page>
  );
};
