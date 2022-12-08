/*
  Imports
*/
import { Button, Container, Stack, Typography } from '@material-ui/core';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { useContext } from 'react';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import MarksList from './tables/MarksList';
import MarksList2 from './tables/MarksList2';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const reload = useContext(ClassContext).reload;

  const navigate = useNavigate();
  const class_ = useContext(ClassContext).c;

  const tests = class_.marks.filter((m) => m.type === 'Test');
  const assignments = class_.marks.filter((m) => m.type === 'Assignment');
  const mid = class_.marks.filter((m) => m.type === 'Mid');
  const final = class_.marks.filter((m) => m.type === 'Final');

  /*
    Handlers, Functions
  */
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h6" gutterBottom>
            Marks Details
          </Typography>
          <Button variant="contained" component={RouterLink} to="./summary">
            Marks Summary
          </Button>
        </Stack>

        <Typography variant="h6" gutterBottom>
          Assignments
        </Typography>

        <br />

        <MarksList data={assignments} past={class_.blocked} reload={reload} />

        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Tests
        </Typography>

        <br />

        <MarksList data={tests} past={class_.blocked} reload={reload} />
        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Mids
        </Typography>

        <br />

        <MarksList2 data={mid} past={class_.blocked} />
        <br />
        <br />

        <Typography variant="h6" gutterBottom>
          Final
        </Typography>

        <br />

        <MarksList2 data={final} past={class_.blocked} />
        {!class_.blocked && <FloatingAdd tooltip='Add new marks' onClick={handleAdd} />}
      </Container>
    </Page>
  );
};
