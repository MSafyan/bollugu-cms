/*
  Imports
*/
import { Container, Grid } from '@material-ui/core';
import { Children, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import ServerError from 'src/components/misc/alerts/ServerError';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import AddTemplateCard from 'src/components/misc/cards/AddTemplateCard';
import ItemCard from 'src/components/misc/cards/HomeSectionPagesCard';
import ServiceCard from 'src/components/misc/cards/HomeServicePagesCard';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import serviceService from 'src/services/HomeSectionsServiceClass';
import Page from '../../../components/Page';

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
  const title = 'Home Sections ';
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
            {Children.toArray(
              menuItems.map((service) => {
                const { id: serviceId } = service;
                return (
                  <>
                    <Grid container spacing={3} alignItems="stretch" sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={9}>
                        <ServiceCard item={service} />
                      </Grid>
                      <Grid item xs={3}>
                        <AddTemplateCard to={`template/add/${service.id}`} />
                      </Grid>
                      {service.templates.map((template) => {
                        const { id, images_list } = template;
                        let item = {
                          ...template,
                          images_list: images_list?.[0]?.url,
                          to: `template/${id}/edit/${serviceId}`
                        };
                        return (
                          <Grid item xs={12} sm={6} md={4} lg={3}>
                            <ItemCard item={item} />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </>
                );
              })
            )}
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
