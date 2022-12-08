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
import { DefaultAvatar } from 'src/config/settings';
import studentService from 'src/services/StudentService';
import teacherService from 'src/services/TeacherService';
import Page from '../../components/Page';
import ServerError from 'src/components/misc/alerts/ServerError';

const SortingOptions = [
  { value: 'idDESC', option: 'createdAt', order: 'DESC', label: 'Newest' },
  { value: 'idASC', option: 'createdAt', order: 'ASC', label: 'Oldest' },
];

/*
  Main Working
*/
export default ({ isTeacher }) => {
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

  /*
    Handlers, Functions
  */
  const getData = () => {
    if (searched)
      return;
    setLoading(true);
    let funcToCall = studentService;
    if (isTeacher)
      funcToCall = teacherService;

    funcToCall
      .search(searchValue, page, [sort.join(":")], isTeacher ? [
        'user.image',
        'madrisas'
      ] : ['user.image',
        'section.batch.madrisa'])
      .then((response) => {
        setSearchUsed(searchValue.length);
        setUsers(response.data);
        setPage(response.meta.pagination.page);
        setPages(response.meta.pagination.pageCount);
      })
      .catch((err) => {
        console.log('error', err);
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageSwtich = () => {
    searched = false;
    getData();
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
  useEffect(handlePageSwtich, [isTeacher]);
  /*
    Main Design
  */
  return (
    <Page title={`${isTeacher ? 'Teacher' : 'Student'} Search`}>
      <Container>
        <ListPageTitle>
          {isTeacher ? 'Teacher' : 'Student'} Search
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
                    const { name, username, image, section, madrisa_code } = student;
                    let code = '-';
                    if (section)
                      code = section.batch.madrisa.code;
                    let item = {
                      name,
                      username,
                      image: image || DefaultAvatar,
                      madrisa: isTeacher ? madrisa_code : code,
                      status: isTeacher ? 'teacher' : 'student',
                      to: `./../${username}`
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
          No {isTeacher ? 'teachers' : 'students'} registered.
        </ServerError>

        <ServerError open={!!searchUsed && users.length < 1} severity="warning">
          No {isTeacher ? 'teachers' : 'students'} found matching your search.
        </ServerError>
      </Container>
    </Page >
  );
};
