/*
	Imports
*/
import { useEffect, useState } from 'react';
/*
	Imports:
		Material UI
*/

import { Container } from '@material-ui/core';
/*
	Imports:
		Our Imports
		Components and Settings
*/
import { useNavigate, useParams } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import serviceService from 'src/services/HomeSectionsServiceClass';
import AddServiceForm from '../forms/HomeServicePageForm';
import { RoutehomeSectionsPage } from 'src/config/routes';

/*
	Main Working
*/
const title = 'Home Sections';
export default ({ editing }) => {
  /*
	  States, Params, Navigation, Query, Variables.
	*/
  const [item, setItem] = useState(null);
  const id = useParams().id;
  const navigate = useNavigate();

  /*
	  Handlers, Functions
	*/

  function getItem() {
    if (id && editing) {
      serviceService
        .getOneService(id)
        .then((data) => {
          setItem(data);
        })
        .catch(() => {
          console.error('Error in getting item', id);
        });
    }
  }

  const handleRemove = () => {
    if (id && editing) {
      serviceService
        .removeService(id)
        .then((data) => {
          navigate(RoutehomeSectionsPage);
        })
        .catch(() => {
          console.error('Error in getting item', id);
        });
    }
  };

  /*
	  Use Effect Hooks.
	*/
  useEffect(() => {
    getItem();
  }, []);

  /*
	  Main Design
	*/
  return (
    <Page title={`${editing ? 'Edit' : 'Add'} ${title}`}>
      <Container maxWidth="xl">
        {!item && id && editing ? (
          <CenterLoading />
        ) : (
          <>
            <ListPageTitle handleRemove={handleRemove} editing={editing}>
              {editing ? 'Edit' : 'Add'} {title}
            </ListPageTitle>
            <AddServiceForm menuItem={item} editing={editing} />
          </>
        )}
      </Container>
    </Page>
  );
};
