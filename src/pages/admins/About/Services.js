/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Children, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import ServerError from 'src/components/misc/alerts/ServerError';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ItemCard from 'src/components/misc/cards/AboutCard';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import serviceService from 'src/services/AboutServiceClass';
import Page from '../../../components/Page';
import userService from 'src/services/UserService';
import { Typography } from '@mui/material';

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
  const title = 'About';
  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */

  const aboutItemList = [
    { name: 'background', type: 'background' },
    { name: 'overview', type: 'overview' },
    { name: 'map', type: 'map' },
    { name: 'description', type: 'description' }
  ];
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
                  const {
                    id,
                    phoneNumber,
                    email,
                    tagline,
                    address,
                    countryList,
                    metaDescription,
                    activeBackground,
                    inactiveBackground
                  } = menuItem;
                  let item = {
                    phoneNumber,
                    email,
                    tagline,
                    address,
                    countryList,
                    metaDescription,
                    activeBackground,
                    inactiveBackground,
                    to: `./${id}`
                  };
                  return (
                    <>
                      {aboutItemList.map((_) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            sx={{
                              mt: 3
                            }}
                          >
                            <Typography
                              component="h1"
                              variant="h3"
                              align="center"
                              color="textPrimary"
                            >
                              {_.name}
                            </Typography>
                            <ItemCard item={item} type={_.type} />
                          </Grid>
                        );
                      })}
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
