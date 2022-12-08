/*
    Imports
*/
import { Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, FormikProvider, useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useNavigate, useParams } from 'react-router-dom';

import Dialog from 'src/components/misc/alerts/Dialog';
import { ContentStyle, FormTheme } from '../../../theme/form-pages';

import LoadingFormButton from 'src/components/misc/Buttons/LoadingFormButton';
import ServerError from 'src/components/misc/alerts/ServerError';
import { AddMarksSchema } from 'src/config/form-schemas';
import marksService from 'src/services/MarksService';
import notificationService from 'src/services/NotificationService';
import { ClassContext } from '../context/ClassContext';
import AddMarksTable from './tables/AddMarksTable.jsx';

/*
    Main Working
*/
export default ({ classes, editing }) => {

    const [serverError, setServerError] = useState('');
    const [openDia, setOpenDia] = useState(false);
    const [openDiaWar, setOpenDiaWar] = useState(false);
    const [marksData, setMarksData] = useState();
    const [editingData, setEditingData] = useState();
    const [finalMarksData, setFinalMarksData] = useState([]);


    const navigate = useNavigate();

    const marksID = useParams().marksID;

    const reload = useContext(ClassContext).reload;


    const dataFromTable = (tableData) => {
        if (editing) {
            if (tableData) {
                let filteredMarksData = finalMarksData.map(obj => tableData.find(o => o.student === obj.student) || obj);
                setMarksData(filteredMarksData);
            }
        }
        else setMarksData(tableData);
    };

    const formik = useFormik({
        initialValues: {
            topic: '',
            type: 'Assignment',
            marks: 0,
        },
        validationSchema: AddMarksSchema,

        onSubmit: () => {
            setSubmitting(true);
            addData();
        }
    });

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, setSubmitting } = formik;

    const addData = () => {

        const marksDataMap = (mark) => { return (mark.obtained >= 0 && mark.obtained <= values.marks); };
        const bol = marksData ?
            marksData.map(marksDataMap) :
            finalMarksData.map(marksDataMap);

        if (bol.includes(false)) {
            setOpenDiaWar(true);
            setSubmitting(false);
            return;
        }
        let FunctionToCall = marksService.addMarks;
        if (marksID)
            FunctionToCall = marksService.update;

        const toDisplayTopic = values.topic.length > 1 ? values.topic : values.type;
        FunctionToCall(classes.id, toDisplayTopic, values.type, values.marks, marksData ? marksData : finalMarksData, marksID)
            .then(() => {

                if (editing) {
                    notificationService.addClass(classes.id, `${classes.teacher.name}`, `updated ${toDisplayTopic} marks for class ${classes.name}.`, `/student/${classes.name}/marks`);
                }
                else {
                    notificationService.addClass(classes.id, `${classes.teacher.name}`, `uploaded ${toDisplayTopic} marks for class ${classes.name}.`, `/student/${classes.name}/marks`);
                    if (values.type == 'Mid' || values.type == 'Final') {
                        classes.batch.madrisa.coordinatorIds.forEach((c) => {
                            notificationService.addCoordinator(c, `${classes.teacher.name}`, `uploaded ${toDisplayTopic} marks for class ${classes.name}.`, `/coordinator/madaris/${classes.batch.madrisa.code}/classes/${classes.name}`);
                        });

                    }
                }
                setOpenDia(true);
            })
            .catch((_err) => {
                setServerError('Something went wrong');
            }).finally();
    };

    const handleediting = () => {
        if (editing) {
            const data = classes.marks.find(o => o.id == marksID);
            const stuData = classes.marks.find(o => o.id == marksID).students;
            let Data = [];
            Data.push(stuData.map((ob) => {
                return { student: ob.sid, obtained: ob.obtained };
            }));
            setFinalMarksData(Data[0]);
            setFieldValue('type', data.type);
            setFieldValue('topic', data.topic);
            setFieldValue('marks', data.total);
            setEditingData(stuData);
        }
    };

    const handleClose = () => {
        setOpenDia(false);
        reload();
        navigate(editing ? "../" : "../");
    };
    const handleCloseWar = () => {
        setOpenDiaWar(false);
    };

    useEffect(handleediting, []);

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>

                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel label="Category">Category</InputLabel>
                            </ThemeProvider>
                            <Select fullWidth
                                {...getFieldProps('type')}
                                error={Boolean(touched.type && errors.type)}
                                disabled={editing}
                            >

                                <MenuItem key='Assignment' value='Assignment'>Assignment</MenuItem>
                                <MenuItem key='Test' value='Test'>Test</MenuItem>
                                <MenuItem key='Mid' value='Mid'>Mid</MenuItem>
                                <MenuItem key='Final' value='Final'>Final</MenuItem>

                            </Select>
                        </Grid>

                        {
                            (values.type == 'Assignment' || values.type == 'Test') &&

                            <Grid item xs={12} sm={6} md={6}>
                                <ThemeProvider theme={FormTheme}>
                                    <InputLabel>Title</InputLabel>
                                </ThemeProvider>
                                <TextField
                                    fullWidth
                                    {...getFieldProps('topic')}
                                    error={Boolean(touched.topic && errors.topic)}
                                    helperText={touched.topic && errors.topic}
                                />
                            </Grid>

                        }
                    </Grid>
                </ContentStyle>
                <ContentStyle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={6}>
                            <ThemeProvider theme={FormTheme}>
                                <InputLabel label="totalMarks">Total Marks</InputLabel>
                            </ThemeProvider>
                            <NumberFormat
                                fullWidth
                                customInput={TextField}
                                {...getFieldProps('marks')}
                                error={Boolean(touched.marks && errors.marks)}
                                helperText={touched.marks && errors.marks}
                            />
                        </Grid>
                    </Grid>
                </ContentStyle>
                {(!editingData && !editing) &&
                    <ContentStyle>
                        <AddMarksTable studentsData={classes.students} dataFromTable={dataFromTable} />
                    </ContentStyle>
                }
                {(editingData && editing) &&
                    <ContentStyle>
                        <AddMarksTable studentsData={classes.students} dataFromTable={dataFromTable} editingData={editingData} />
                    </ContentStyle>
                }


                <Dialog
                    buttonText={"Close"}
                    openDialog={openDia}
                    handleButton={handleClose}
                >
                    Marks are {editing ? 'updated' : 'added'}
                </Dialog >
                <Dialog
                    buttonText={"Close"}
                    openDialog={openDiaWar}
                    handleButton={handleCloseWar}
                    warning={true}
                >
                    Please Enter Correct Marks
                </Dialog >
                <LoadingFormButton loading={isSubmitting}>
                    {editing ? 'Save' : 'Add'}
                </LoadingFormButton>
                <ServerError open={serverError || touched.file && errors.file}>
                    {serverError || touched.file && errors.file}
                </ServerError>
            </Form>
        </FormikProvider >
    );
};



