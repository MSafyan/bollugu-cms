/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext, useState } from 'react';
import Dialog from 'src/components/misc/alerts/Dialog';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Timeline from 'src/components/misc/Timeline';
import { TrashIcon } from 'src/config/icons';
import announcementService from 'src/services/AnnoucementService';
import Page from '../../components/Page';
import ClassHeader from '../students/header/ClassHeader';
import { ClassContext } from './context/ClassContext';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */

  const [showDelete, setShowDelete] = useState(-1);

  const class_ = useContext(ClassContext).c;
  const reload = useContext(ClassContext).reload;

  const navigate = useNavigate();

  const handleDelete = (ID) => {
    setShowDelete(ID);
  };

  const handleClose = () => {
    setShowDelete(-1);
  };

  const handleDeleteFinal = () => {
    announcementService
      .remove(showDelete)
      .then(reload)
      .catch((_error) => {
        // TODO: handle error here.
      })
      .finally(() => setShowDelete(-1));
  };

  const MORE_MENU = [
    { text: 'Delete', icon: TrashIcon, event: handleDelete, id: 0 }
  ];

  const handleAdd = () => {
    navigate('./add');
  };

  const toHome = () => {
    navigate(`/teacher/${class_.name}`);
  };
  /*
    Main Design
  */

  return (
    <Page title={class_.name}>
      <Container>
        <ListPageTitleWithLink onClick={toHome}>{class_.name}</ListPageTitleWithLink>
        <ClassHeader data={class_} />
        <br />
        <br />
        <Timeline title='Announcements' data={class_.announcements} more={MORE_MENU} />
        <Dialog
          warning
          buttonText={'Close'}
          buttonText2={'Delete'}
          openDialog={showDelete != -1}
          handleButton={handleClose}
          handleButton2={handleDeleteFinal}
        >
          Are you sure you want to delete?
        </Dialog>
        {!class_.blocked && <FloatingAdd tooltip='Make an announcement' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
