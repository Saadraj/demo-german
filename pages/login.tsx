import {
    Box,
    Button,
    Container,
    createStyles,
    Divider,
    FormControl,
    FormHelperText,
    makeStyles,
    Paper,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { loginValidationSchema } from "../validationSchema/login";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
    email: "",
    password: "",
};
const Login = () => {
    const classes = useStyles();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const submitSignUp = async (values: {
        email: string;
        password: string;
    }) => {
        try {
            const validateData = await loginValidationSchema.validate(values);
            const res = await axios.post("/api/login", validateData);
            if (res.data.success) {
                router.push("/");
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    return (
        <Box
            style={{
                backgroundColor: "GrayText",
                height: "100vh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={0}
                    style={{
                        padding: "20px",
                    }}
                >
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
                        initialValues={initialValues}
                        validationSchema={loginValidationSchema}
                        onSubmit={(value) => submitSignUp(value)}
                    >
                        {({ isSubmitting, isValidating }) => (
                            <Form>
                                {errorMessage && (
                                    <Alert
                                        severity="error"
                                        onClose={() => {
                                            setErrorMessage("");
                                        }}
                                    >
                                        {errorMessage}
                                    </Alert>
                                )}
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="email"
                                        placeholder="Email address or phone number"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="email">
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
                                        name="password"
                                        placeholder="Password"
                                        variant="outlined"
                                        type="password"
                                    />
                                    <ErrorMessage name="password">
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
                                        Login
                                    </Button>
                                </FormControl>
                            </Form>
                        )}
                    </Formik>
                    <Typography align="center" gutterBottom>
                        Don&apos;t Have an Account?{" "}
                        <Link href="/signup">
                            <a className={classes.link}>SignUp</a>
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
