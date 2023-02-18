/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Children, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import ServerError from 'src/components/misc/alerts/ServerError';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ItemCard from 'src/components/misc/cards/WorkCard';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import serviceService from 'src/services/WorkServiceClass';
import Page from '../../../components/Page';
import userService from 'src/services/UserService';
import { DefaultFood } from 'src/config/settings';

/*
  Main Working
*/
export default ({}) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [loading, setLoading] = useState(false);
  const [menuItems, setmenuItems] = useState([]);

  const navigate = useNavigate();

  /*
    Handlers, Functions
  */

  const handleAddButton = () => {
    navigate('./add');
  };
  const getData = async () => {
    setLoading(true);

    const user = userService.getLoggedInUser();
    serviceService
      .getAll()
      .then((response) => {
        setmenuItems(response);
      })
      .catch((err) => {
        console.log('error', err);
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const title = 'Work';
  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={title}>
      <Container>
        <ListPageTitle>{title}</ListPageTitle>

        {loading ? (
          <CenterLoading />
        ) : (
          <>
            <Grid container spacing={3} alignItems="stretch">
              {Children.toArray(
                menuItems.map((menuItem) => {
                  const { id } = menuItem;
                  let item = {
                    ...menuItem,
                    image: menuItem?.image.url || DefaultFood,
                    to: `./${id}`
                  };
                  return (
                    <>
                      <Grid item xs={12}>
                        <ItemCard item={item} />
                      </Grid>
                    </>
                  );
                })
              )}
            </Grid>
            <br />
            <ServerError open={menuItems.length < 1} severity="warning">
              No {title}.
            </ServerError>
          </>
        )}

        <FloatingAdd tooltip="Add new item" onClick={handleAddButton} />
      </Container>
    </Page>
  );
};
