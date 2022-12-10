/*
  Imports
*/
import { Container, Grid, Stack, TextField } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { Children, useEffect, useState } from 'react';

import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import ProfileCard from 'src/components/misc/cards/ProfileCard';
import Sorting from 'src/components/misc/Sorting';
import { DefaultAvatar, DefaultFood } from 'src/config/settings';
import teacherService from 'src/services/TeacherService';
import Page from '../../components/Page';
import ServerError from 'src/components/misc/alerts/ServerError';
import menuService from 'src/services/MenuServiceClass';
import ItemCard from 'src/components/misc/cards/ItemCard';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import { useNavigate } from 'react-router-dom';

const SortingOptions = [
  { value: 'idDESC', option: 'createdAt', order: 'DESC', label: 'Newest' },
  { value: 'idASC', option: 'createdAt', order: 'ASC', label: 'Oldest' },
];

/*
  Main Working
*/
export default ({ }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuItems, setmenuItems] = useState([]);
  const [sort, setSort] = useState([SortingOptions[0].option, SortingOptions[0].order]);

  const [searchUsed, setSearchUsed] = useState(false);

  let searched = false;

  const navigate = useNavigate();

  /*
    Handlers, Functions
  */

  const handleAddButton = () => {
    navigate('./add');
  };
  const getData = () => {
    if (searched)
      return;
    setLoading(true);

    menuService
      .getAll(1)
      .then((response) => {
        setSearchUsed(searchValue.length);
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

  const getSort = (sorting, order) => {
    setSort([sorting, order]);
  };



  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (e) => {
    if (e.keyCode == 13) {
      searched = false;
      getData();
    }
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design
  */
  return (
    <Page title={`Menu Items`}>
      <Container>
        <ListPageTitle>
          Menu Items
        </ListPageTitle>

        {
          loading ? <CenterLoading /> :
            <>
              <Grid container spacing={3} alignItems="stretch">
                {
                  Children.toArray(menuItems.map((menuItem) => {
                    const { id, name, price, description, image } = menuItem;

                    let item = {
                      name,
                      price,
                      description,
                      image: image?.url || DefaultFood,
                      to: `./${id}`
                    };
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <ItemCard item={item} />
                      </Grid>
                    );
                  }))
                }
              </Grid>
              <br />
            </>
        }

        <ServerError open={!searchUsed && menuItems.length < 1} severity="warning">
          No menu items.
        </ServerError>

        <ServerError open={!!searchUsed && menuItems.length < 1} severity="warning">
          No menu items found matching your search.
        </ServerError>
        <FloatingAdd tooltip='Add new item' onClick={handleAddButton} />
      </Container>
    </Page >
  );
};
