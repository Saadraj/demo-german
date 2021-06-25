import {
    Backdrop,
    Button,
    createStyles,
    Divider,
    Fade,
    FormControl,
    FormHelperText,
    makeStyles,
    Modal,
    Paper,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { expenseValidationSchema } from "../validationSchema/expense";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
                width: "25ch",
            },
        },
        error: {
            color: "tomato",
            paddingLeft: theme.spacing(1),
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
                textDecoration: "underline",
            },
        },
    })
);

const initialValues = {
    description: "",
    amount: 0,
    comment: "",
};

export default function CustomModal({ editedValue, open, handleClose }) {
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState({
        success: false,
        message: "",
    });
    useEffect(() => {
        setErrorMessage({
            success: false,
            message: "",
        });
    }, [open]);

    const submitHandler = async (values: {
        description: "";
        amount: 0;
        comment: "";
    }) => {
        try {
            const validateData = await expenseValidationSchema.validate(values);
            const res = await axios.post("/api/expense", validateData);
            if (res.data.success) {
                setErrorMessage(res.data);
            } else {
                setErrorMessage(res.data);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    const editHandler = async (values: {
        description: "";
        amount: 0;
        comment: "";
    }) => {
        try {
            const validateData = await expenseValidationSchema.validate(values);
            const res = await axios.put(`/api/expense`, validateData);
            if (res.data.success) {
                setErrorMessage(res.data);
            } else {
                setErrorMessage(res.data);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Paper className={classes.paper}>
                    <Typography
                        variant="h3"
                        align="center"
                        color="secondary"
                        gutterBottom
                    >
                        Login
                    </Typography>
                    <Divider variant="middle" />
                    <Formik
                        initialValues={editedValue || initialValues}
                        validationSchema={expenseValidationSchema}
                        onSubmit={
                            Boolean(editedValue) ? editHandler : submitHandler
                        }
                        enableReinitialize
                    >
                        {({ isSubmitting, isValidating }) => (
                            <Form>
                                {errorMessage.message && (
                                    <Alert
                                        severity={
                                            errorMessage.success
                                                ? "success"
                                                : "error"
                                        }
                                        onClose={() => {
                                            setErrorMessage({
                                                message: "",
                                                success: false,
                                            });
                                        }}
                                    >
                                        {errorMessage.message}
                                    </Alert>
                                )}
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="description"
                                        variant="outlined"
                                        label="Description"
                                        multiline
                                        rowsMax={4}
                                    />
                                    <ErrorMessage name="description">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="amount"
                                        label="Amount"
                                        variant="outlined"
                                        type="number"
                                    />
                                    <ErrorMessage name="amount">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="comment"
                                        label="Comment"
                                        variant="outlined"
                                        multiline
                                        rowsMax={4}
                                    />
                                    <ErrorMessage name="comment">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting || isValidating}
                                    >
                                        {Boolean(editedValue)
                                            ? "Update"
                                            : "Save"}
                                    </Button>
                                </FormControl>
                            </Form>
                        )}
                    </Formik>
                </Paper>
            </Fade>
        </Modal>
    );
}
