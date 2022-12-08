/*
  Imports
*/
import { Container, Grid, Stack, TextField } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { Children, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import ProfileCard from 'src/components/misc/cards/ProfileCard';
import Sorting from 'src/components/misc/Sorting';
import { DefaultAvatar } from 'src/config/settings';
import studentService from 'src/services/StudentService';
import Page from '../../components/Page';
import ServerError from 'src/components/misc/alerts/ServerError';

const SortingOptions = [
  { value: 'idDESC', option: 'createdAt', order: 'DESC', label: 'Newest' },
  { value: 'idASC', option: 'createdAt', order: 'ASC', label: 'Oldest' },
];

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState([SortingOptions[0].option, SortingOptions[0].order]);
  const [pages, setPages] = useState(10);
  const [page, setPage] = useState(1);

  const [searchUsed, setSearchUsed] = useState(false);

  let searched = false;
  const madrisaID = useParams().mID;

  /*
    Handlers, Functions
  */
  const getData = () => {
    if (searched)
      return;
    setLoading(true);

    studentService
      .searchInMadrisa(madrisaID, searchValue, page, [sort.join(":")], [
        'user.image',
        'section.batch'
      ])
      .then((response) => {
        setSearchUsed(searchValue.length);
        setUsers(response.data);
        setPage(response.meta.pagination.page);
        setPages(response.meta.pagination.pageCount);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
        console.log('Error', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSort = (sorting, order) => {
    setSort([sorting, order]);
  };

  const updatePage = (_event, value) => {
    setPage(value);
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
  useEffect(getData, [page, sort]);
  /*
    Main Design
  */
  return (
    <Page title='Student'>
      <Container>
        <ListPageTitle>
          Students
        </ListPageTitle>
        <TextField
          fullWidth
          value={searchValue}
          label="Search"
          variant="outlined"
          onChange={handleSearchInput}
          onKeyDown={handleSearch}
        />
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>

            <Sorting onGetSort={getSort} sortingOptions={SortingOptions} />
          </Stack>
        </Stack>
        {
          loading ? <CenterLoading /> :
            <>
              <Grid container spacing={3}>
                {
                  Children.toArray(users.map((student) => {
                    const { name, username, image, section, } = student;
                    let item = {
                      name,
                      username,
                      image: image || DefaultAvatar,
                      madrisa: `${section.batch.year}-${section.name}`,
                      status: 'student',
                      to: `/coordinator/students/${username}`
                    };
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <ProfileCard item={item} />
                      </Grid>
                    );
                  }))
                }
              </Grid>
              <br />
              <Pagination count={pages} page={page} onChange={updatePage} />
            </>
        }
        <ServerError open={!searchUsed && users.length < 1} severity="warning">
          No students in madrisa.
        </ServerError>

        <ServerError open={!!searchUsed && users.length < 1} severity="warning">
          No students found matching your search.
        </ServerError>
      </Container>
    </Page>
  );
};
