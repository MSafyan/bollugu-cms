/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Children, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import ServerError from 'src/components/misc/alerts/ServerError';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ItemCard from 'src/components/misc/cards/SitemapCard';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import { DefaultFood } from 'src/config/settings';
import sitemapXmlService from 'src/services/SitemapXmlServiceClass';
import Page from '../../../components/Page';
import userService from 'src/services/UserService';

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
    sitemapXmlService
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

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  const title = 'Sitemap';
  return (
    <Page title={`{title}`}>
      <Container>
        <ListPageTitle>{title}</ListPageTitle>

        {loading ? (
          <CenterLoading />
        ) : (
          <>
            <Grid container spacing={3} alignItems="stretch">
              {Children.toArray(
                menuItems.map((menuItem) => {
                  const { id, title, svg } = menuItem;
                  debugger;

                  let item = {
                    title,
                    svg: svg?.url || DefaultFood,
                    to: `./${id}`
                  };
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <ItemCard item={item} />
                    </Grid>
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
