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
import serviceService from 'src/services/WorkServiceClass';
import AddServiceForm from '../forms/WorkForm';
import { RouteWork } from 'src/config/routes';

/*
	Main Working
*/
const pagetitle = 'Work';
export default ({ editing }) => {
  /*
	  States, Params, Navigation, Query, Variables.
	*/
  const [item, setItem] = useState(null);
  const id = useParams().id;

  const navigate = useNavigate();

  const handleRemove = () => {
    if (id && editing) {
      serviceService
        .remove(id)
        .then((data) => {
          navigate(RouteWork);
        })
        .catch(() => {
          console.error('Error in getting item', id);
        });
    }
  };

  /*
	  Handlers, Functions
	*/

  function getItem() {
    if (id && editing) {
      serviceService
        .getOne(id)
        .then((data) => {
          setItem(data);
        })
        .catch(() => {
          console.error('Error in getting item', id);
        });
    }
  }

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
    <Page title={`${editing ? 'Edit' : 'Add'} ${pagetitle}`}>
      <Container maxWidth="xl">
        {!item && id && editing ? (
          <CenterLoading />
        ) : (
          <>
            <ListPageTitle handleRemove={handleRemove} editing={editing}>
              {editing ? 'Edit' : 'Add'} {pagetitle}
            </ListPageTitle>
            <AddServiceForm menuItem={item} editing={editing} />
          </>
        )}
      </Container>
    </Page>
  );
};
