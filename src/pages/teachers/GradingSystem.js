/*
    Imports
*/
import { useContext } from 'react';
import { Container, Typography } from '@material-ui/core';
import { RootStyle } from '../../theme/form-pages';
import Form from './forms/GradingSystemForm';
import { ClassContext } from './context/ClassContext';
import ListPageTitleWithLink from 'src/components/misc/ListPageTitleWithLink';
import { useNavigate } from 'react-router-dom';

/*
    Main Working
*/
export default () => {
    const navigate = useNavigate();
    const class_ = useContext(ClassContext).c;

    const toHome = () => {
        navigate(`/teacher/${class_.name}`);
    };
    /*
      Main Design
    */
    return (
        <RootStyle title="Grading System">
            <Container maxWidth="xl">
                <ListPageTitleWithLink onClick={toHome}>
                    {class_.name}
                </ListPageTitleWithLink>
                <br />
                <Typography variant="h4" gutterBottom>
                    Grading System
                </Typography>
                <Form past={class_.blocked} />
            </Container>
        </RootStyle >
    );
};
