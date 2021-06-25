import { Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: "grid",
            height: "100vh",
            placeItems: "center",
        },
        loading: {
            paddingLeft: 11,
        },
    })
);

export default function Loading() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <CircularProgress color="secondary" />
                <Typography
                    variant="h4"
                    component="span"
                    className={classes.loading}
                >
                    Loading....
                </Typography>
            </div>
        </div>
    );
}
