/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import menuService from 'src/services/MenuServiceClass';
import studentService from 'src/services/StudentService';
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
  const [item, setItem] = useState({ name: '' });

  const [showDelete, setShowDelete] = useState(false);
  const { name } = item;

  const ItemID = useParams().id;

  /*
    Handlers, Functions
  */
  const getData = async () => {
    menuService
      .getOne(ItemID)
      .then(async (u) => {
        setItem(u);
        const user = await userService.getLoggedInUser();
        console.log("User", user, u)
        // if (u.chef != user.chef.id)
        // navigate('/401');
        setLoading(false);
      })
      .catch((_err) => {
        console.log("Error", _err);
        // navigate('/404');
      });

  };


  const handleEdit = () => {
    navigate(`./edit`);
  };

  const handleDelete = () => {
    if (isStudent) {
      setShowDelete(true);
    }
  };

  const handleClose = () => {
    setShowDelete(false);
  };

  const handleDeleteFinal = () => {
    studentService.
      remove(item.id)
      .then(() => {
        navigate(-1);
      })
      .catch((_err) => {
        //Error here.
      });
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
          <ProfileOptions
            user={item}
            // handleDelete={handleDelete}
            handleEdit={handleEdit}
          />

          {/* <Dialog
              error={item.classes.length <= 0}
              warning={item.classes.length > 0}
              buttonText={"Close"}
              buttonText2={item.classes.length > 0 ? '' : 'Remove'}
              openDialog={showDelete}
              handleButton={handleClose}
              handleButton2={handleDeleteFinal}
            >
              {item.classes.length > 0 ? `You can not delete a student who has been assgined to classes, please remove the student from classes first` : `Are you sure you want to remove?`}
            </Dialog> */}

        </Container>
      )}
    </Page>
  );
};
