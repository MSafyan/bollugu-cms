/*
  Imports
*/
import { Container } from '@material-ui/core';
import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CenterLoading from 'src/components/misc/CenterLoading';
import FloatingAdd from 'src/components/misc/Buttons/FloatingAdd';
import ListPageTitle from 'src/components/misc/ListPageTitle';
import classService from 'src/services/ClassService';
import Page from '../../components/Page';
import { MadrisaContext } from './context/MadrisaContext';
import ClassesList from './tables/ClassesList';

/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { madrisa } = useContext(MadrisaContext);
  const pageName = madrisa.code + ' Classes';

  const batches = madrisa.batches;

  /*
    Handlers, Functions
  */
  const handleAdd = () => {
    navigate('./add');
  };

  const getData = async () => {
    setLoading(true);
    batches.sort((a, b) => b.year - a.year);
    classService
      .getByMadrisa(madrisa.code, 0, 400, [
        'teacher.user',
        'course',
        'students',
        'students',
        'attendances.students',
        'marks.marks.student',
        'batch'
      ])
      .then((data) => {
        data.sort((a, b) => b.batch.year - a.batch.year);

        let classArray = [];
        batches.forEach((b) => {
          classArray.push(data.filter((_class) => _class.batch.id === b.id));
        });
        setClasses(classArray);
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

          classes.length ?
            <>
              {React.Children.toArray(
                batches.map((b, index) => (
                  <>
                    <ListPageTitle>Batch {b.year}</ListPageTitle>
                    <ClassesList classes={classes[index]} ended={index > 0 || madrisa.blocked} getData={getData} />
                    <br />
                    <br />
                  </>
                ))
              )}
              {!madrisa.blocked && <FloatingAdd tooltip='Create new class' onClick={handleAdd} />}
            </>
            :
            <><Typography>Batch not found</Typography></>
        )}
      </Container>
    </Page>
  );
};
