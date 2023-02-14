/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import robotsTxtService from 'src/services/RobotsTxtServiceClass';
import userService from 'src/services/UserService';
import Page from '../../components/Page';
import ItemProfile from './profile/ItemProfile';
import ProfileOptions from './profile/ProfileOptions';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState({ title: '' });

  const { name } = item;

  const ItemID = useParams().id;

  /*
    Handlers, Functions
  */
  const getData = async () => {
    robotsTxtService
      .getOne(ItemID)
      .then(async (u) => {
        setItem(u);
        const user = await userService.getLoggedInUser();
        console.log('User', user, u);
        // if (u.chef != user.chef.id)
        // navigate('/401');
        setLoading(false);
      })
      .catch((_err) => {
        console.log('Error', _err);
        // navigate('/404');
      });
  };

  const handleEdit = () => {
    navigate(`./edit`);
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={`Viewing ${name}`}>
      {loading ? (
        <CenterLoading />
      ) : (
        <Container maxWidth="xl">
          <ItemProfile item={item} />
          <ProfileOptions user={item} handleEdit={handleEdit} />
        </Container>
      )}
    </Page>
  );
};
