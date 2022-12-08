/*
  Imports
*/
import { Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';


import { useContext } from 'react';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import PassFailChart from '../../components/charts/PassFailChart';
import Page from '../../components/Page';
import { ClassContext } from './context/ClassContext';
import ClassHeader from './header/ClassHeader';
import MarksSummaryList from './tables/MarksSummaryList';
/*
  Main Working
*/
export default () => {
  /*
    States, Params, Navigation, Query, Variables.
  */
  const navigate = useNavigate();
  const class_ = useContext(ClassContext).c;
  for (const c of class_.marks) {
    const attempt = c.students.filter((m) => m.attempted);
    const passing = c.students.filter((m) => m.pass);
    const failing = c.students.filter((m) => !m.pass);
    let average = 0;
    let maximum = 0;
    let minimum = Number.MAX_VALUE;
    for (const element of attempt) {
      average += element.obtained;
      if (maximum < element.obtained) {
        maximum = element.obtained;
      }
      if (minimum > element.obtained) {
        minimum = element.obtained;
      }
    }
    average /= attempt.length;
    c.attempted = attempt.length;
    c.passing = passing.length;
    c.failing = failing.length;
    c.average = average.toFixed(1);
    c.maximum = maximum;
    c.minimum = minimum;
  }

  const pass = class_.students.filter((s) => s.pass).length;
  const fail = class_.students.filter((s) => !s.pass).length;

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
        <MarksSummaryList data={class_.marks} />
        <br />
        <br />
        <PassFailChart
          title="Pass/Fail Summary"
          labels={class_.blocked ? ['Passed', 'Failed'] : ['Passing', 'Failing']}
          data={[pass, fail]}
        />
      </Container>
    </Page>
  );
};
