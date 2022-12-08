/*
  Imports
*/
import { Button, Grid, Pagination, Stack, TextField, Typography } from '@material-ui/core';
import { Children, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import CenterLoading from 'src/components/misc/CenterLoading';
import Dialog from 'src/components/misc/alerts/Dialog';
import Sorting from 'src/components/misc/Sorting';
import StudentAddClassCard from 'src/components/misc/cards/StudentAddClassCard';
import { DefaultAvatar } from 'src/config/settings';
import classService from 'src/services/ClassService';
import notificationService from 'src/services/NotificationService';
import studentService from 'src/services/StudentService';
import ServerError from 'src/components/misc/alerts/ServerError';

const SortingOptions = [
  { value: 'idDESC', option: 'createdAt', order: 'DESC', label: 'Newest' },
  { value: 'idASC', option: 'createdAt', order: 'ASC', label: 'Oldest' }
];

/*
  Main Working
*/
export default ({ class_, getData: loadStudents }) => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState([SortingOptions[0].option, SortingOptions[0].order]);
  const [pages, setPages] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const [searchUsed, setSearchUsed] = useState(false);

  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();

  let searched = false;

  const { batch, students, id: classID } = class_;
  const { id: batchID } = batch;

  /*
    Handlers, Functions
  */

  const selectHandle = (ID, remove) => {
    if (remove) {
      setSelected(selected.filter((value) => value !== ID));
      return;
    }
    setSelected([...selected, ID]);
  };

  const getData = () => {
    if (searched) return;
    setLoading(true);
    studentService
      .searchBatch(
        batchID,
        searchValue,
        page,
        [sort.join(':')],
        [
          'user.image',
          'section.batch.madrisa',
          'classes.marks.marks.student',
          'classes.attendance',
          'classes.course'
        ]
      )
      .then((response) => {
        setSearchUsed(searchValue.length);
        setUsers(response.data);
        setPage(response.meta.pagination.page);
        setPages(response.meta.pagination.pageCount);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleClose = () => {
    setShowAdd(false);
  };

  const handleAddFinal = () => {
    if (selected.length < 1) return;
    classService
      .updateStudents(classID, [...students, ...selected])
      .then(() => {
        selected.forEach((s) => {
          notificationService.addStudent(
            s,
            `${class_.course.name}`,
            `by ${class_.teacher.name} has been assigned to you.`,
            `/student/${class_.name}`
          );
        });

        if (selected.length > 1) {
          notificationService.addTeacher(
            class_.teacher.id,
            `${class_.name}`,
            `has ${selected.length} new students.`,
            `/teacher/${class_.name}/students`
          );
        } else {
          const s = users?.find((u) => u.id == selected[0]);
          if (s)
            notificationService.addTeacher(
              class_.teacher.id,
              `${class_.name}`,
              `has a new student ${s.name} (${s.username}).`,
              `/teacher/${class_.name}/students`
            );
        }
        setSelected([]);
        loadStudents();
      })
      .catch((_error) => {
        //Adding to class error
      })
      .finally(() => setShowAdd(false));
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
    <>
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
      {loading ? (
        <CenterLoading />
      ) : (
        <>
          <Grid container spacing={3}>
            {Children.toArray(
              users.map((student) => {
                const { name, username, image, id } = student;
                const course = class_.course;
                let preReqMissing = false;
                if (course.prereq_id.length > 0) {
                  for (const pre of course.prereq_id) {
                    const studentClass = student.classes.find((c) => c.course?.id == pre);
                    if (!studentClass) {
                      preReqMissing = true;
                      break;
                    } else {
                      if (!studentClass.students.pass || !studentClass.blocked) {
                        preReqMissing = true;
                        break;
                      }
                    }
                  }
                }
                const added = !!students.find((s) => s.id == id);
                const courseAdded = !!student.classes.find(
                  (c) => c.name.slice(0, 14) == class_.name.slice(0, 14)
                );
                let item = {
                  id,
                  name,
                  username,
                  image: image || DefaultAvatar,
                  to: `../../../../students/${username}`,
                  added,
                  courseAdded,
                  selected: false,
                  preReqMissing
                };
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <StudentAddClassCard item={item} onSelection={selectHandle} />
                  </Grid>
                );
              })
            )}
          </Grid>
          <br />
          <Pagination count={pages} page={page} onChange={updatePage} />
        </>
      )}
      <br />
      {selected.length > 0 && (
        <Grid
          container
          spacing={0}
          style={{ paddingBottom: 10, paddingTop: 10, justifyContent: 'space-between' }}
        >
          <Grid>
            <Typography>You have selected {selected.length} student(s)</Typography>
          </Grid>
          <Button
            variant="contained"
            onClick={handleAdd}
            component={RouterLink}
            to="#"
            style={{ marginTop: 40, padding: '0px 45px' }}
            size="large"
          >
            Add
          </Button>
        </Grid>
      )}
      <Dialog
        warning
        buttonText={'Close'}
        buttonText2={'Add'}
        openDialog={showAdd}
        handleButton={handleClose}
        handleButton2={handleAddFinal}
      >
        Are you sure you want to add {selected.length} student(s) to the class?
      </Dialog>

      <ServerError open={!searchUsed && users.length < 1} severity="warning">
        No students found, please add students in current batch
      </ServerError>

      <ServerError open={!!searchUsed && users.length < 1} severity="warning">
        No students found matching your search.
      </ServerError>
    </>
  );
};
