import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    createStyles,
    Divider,
    Grid,
    IconButton,
    InputBase,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import RefreshIcon from "@material-ui/icons/Refresh";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import clsx from "clsx";
import React, { useState } from "react";
import useSWR from "swr";
import CustomModal from "./CustomModal";
import Loading from "./Loading";
import User from "./User";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "100%",
            paddingTop: theme.spacing(5),
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
            border: ".1rem solid grey",
            padding: ".1rem .5rem",
        },
        iconButton: {
            padding: 10,
        },
        expand: {
            transform: "rotate(0deg)",
            transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.standard,
            }),
        },
        expandOpen: {
            transform: "rotate(360deg)",
        },
    })
);

export const dateFormate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
};
export const timeFormate = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
};

const Expense = () => {
    const classes = useStyles();
    const [edit, setEdit] = useState(null);
    const [open, setOpen] = React.useState(false);
    const [expanded, setExpanded] = useState(false);
    const [filter, setFilter] = useState("");
    const { data, error, mutate } = useSWR("/api/expense", axios);

    const handleOpen = (e) => {
        setEdit(e);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        mutate();
    };

    const deleteHandler = async (id) => {
        try {
            const res = await axios.delete(`/api/expense?id=${id}`);
            mutate();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
        mutate();
    };

    if (error)
        return (
            <div
                style={{
                    display: "grid",
                    height: "100vh",
                    placeItems: "center",
                }}
            >
                failed to load
            </div>
        );
    if (!data) return <Loading />;

    return (
        <Container maxWidth="lg">
            <Box p={11}>
                <Typography variant="h2" align="center" paragraph>
                    Expense Details
                </Typography>
                <Divider />
            </Box>
            <User />
            <Grid container justify="space-around" spacing={4}>
                <Grid item md={7}>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleOpen(null)}
                    >
                        Add New
                    </Button>
                </Grid>
                <Grid item md={4}>
                    <InputBase
                        className={classes.input}
                        placeholder="Filter"
                        onChange={(e) => setFilter(e.target.value)}
                        value={filter}
                        inputProps={{ "aria-label": "Filter" }}
                    />
                    <IconButton
                        type="submit"
                        className={classes.iconButton}
                        aria-label="search"
                    >
                        <SearchIcon />
                    </IconButton>
                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded,
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="refresh"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid
                container
                justify="space-around"
                spacing={4}
                className={classes.root}
            >
                {data?.data?.expense
                    ?.filter(
                        (str) =>
                            str.description.includes(filter) ||
                            str.comment.includes(filter) ||
                            str.amount.toString().includes(filter)
                    )
                    .map((d) => (
                        <Grid item xs={12} md={3} key={d._id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography
                                        variant="h3"
                                        component="h3"
                                        gutterBottom
                                    >
                                        <strong>{d.description}</strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        gutterBottom
                                    >
                                        <strong>Comment:</strong> {d.comment}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        gutterBottom
                                    >
                                        <strong>Amount:</strong> ${d.amount}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        gutterBottom
                                    >
                                        <strong>updated Time:</strong>{" "}
                                        {timeFormate(d.updatedAt)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        component="p"
                                        gutterBottom
                                    >
                                        <strong>Updated Date:</strong>{" "}
                                        {dateFormate(d.updatedAt)}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton onClick={() => handleOpen(d)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => deleteHandler(d._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <CustomModal
                editedValue={edit}
                open={open}
                handleClose={handleClose}
            />
        </Container>
    );
};

export default Expense;
