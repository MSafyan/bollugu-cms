/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';
import Label from 'src/components/misc/Label';
import CenterLoading from 'src/components/misc/CenterLoading';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import classService from 'src/services/ClassService';
import userService from 'src/services/UserService';
import Page from '../../components/Page';
import ResultList from './tables/ResultList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState(0.0);
  const navigate = useNavigate();

  const pageName = 'Result';

  /*
    Handlers, Functions
  */
  const getData = async () => {
    const user = await userService.getLoggedInUser();
    setLoading(true);
    classService
      .getByStudentResult(user.id, 0, 400, user)
      .then((data) => {
        let p = 0;
        console.log("Result to check data", data);
        data.forEach((c) => {
          c.student = c.students[0];
          p += c.student.totalFactor;
        });

        p /= data.length;
        setPercentage(Math.round(p * 100));
        setClasses(data);
      })
      .catch((err) => {
        if (err.response) if (err.response.status === 401) navigate('/logout');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /*
    Use Effect Hooks.
  */
  useEffect(getData, []);

  /*
    Main Design.
  */
  return (
    <Page title={pageName}>
      <Container>
        <ListPageTitle>{pageName}</ListPageTitle>
        {loading ? (
          <CenterLoading />
        ) : (
          <>
            {
              classes.length > 0 ?
                <>
                  <ResultList classes={classes} />
                  <br />
                  <br />
                  <Typography variant="subtitle2">Percent <Label variant="ghost" color={percentage >= 50 ? "success" : "error"}>{percentage}%</Label></Typography>
                </>
                :
                <><Typography>Result is not available yet</Typography></>
            }
          </>
        )}
      </Container>
    </Page>
  );
};
