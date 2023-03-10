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
import { useParams } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import Page from 'src/components/Page';
import serviceService from 'src/services/HomeTopServiceClass';
import AddServiceForm from '../forms/HomeTopPageForm';

/*
	Main Working
*/
export default ({ editing }) => {
  /*
	  States, Params, Navigation, Query, Variables.
	*/
  const [item, setItem] = useState(null);
  const id = useParams().id;

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

  const title = 'Home Top';
  return (
    <Page title={`${editing ? 'Edit' : 'Add'} ${title}`}>
      <Container maxWidth="xl">
        {!item && id && editing ? (
          <CenterLoading />
        ) : (
          <>
            <ListPageTitle>
              {editing ? 'Edit' : 'Add'} {title}
            </ListPageTitle>
            <AddServiceForm menuItem={item} editing={editing} />
          </>
        )}
      </Container>
    </Page>
  );
};
