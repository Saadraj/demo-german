import { Button, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const User = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<any>({});

    useEffect(() => {
        axios
            .get("api/user")
            .then((res) => {
                if (!res.data.success) {
                    router.push("/login");
                } else {
                    setUserInfo(res.data.data);
                }
            })
            .catch((err) => {
                router.push("/login");
            });
    }, []);

    const logOut = async () => {
        await axios.post("api/logout");
        cookie.remove("lm-auth");
        router.push("/login");
    };
    return (
        <Grid container justify="space-between">
            <Grid item>
                <Typography variant="h2" align="center" paragraph>
                    you are logged in as <strong>{userInfo.name}</strong>
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={logOut}
                >
                    logOut
                </Button>
            </Grid>
        </Grid>
    );
};

export default User;
