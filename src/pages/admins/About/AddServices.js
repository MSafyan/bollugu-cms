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
import { useParams, useLocation } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import serviceService from 'src/services/AboutServiceClass';
import AddServiceForm from '../forms/AboutForm';

/*
	Main Working
*/
export default ({ editing }) => {
  /*
	  States, Params, Navigation, Query, Variables.
	*/
  const [item, setItem] = useState(null);
  const id = useParams().id;
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);

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
    <Page title={`${editing ? 'Edit' : 'Add'} About`}>
      <Container maxWidth="xl">
        {!item && id && editing ? (
          <CenterLoading />
        ) : (
          <>
            <ListPageTitle>{editing ? 'Edit' : 'Add'} About</ListPageTitle>
            <AddServiceForm menuItem={item} editing={editing} type={searchParams.get('type')} />
          </>
        )}
      </Container>
    </Page>
  );
};
