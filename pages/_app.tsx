import {
    createMuiTheme,
    CssBaseline,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core";
import React from "react";

function MyApp({ Component, pageProps }) {
    const theme = createMuiTheme({
        typography: {
            htmlFontSize: 16,
            fontSize: 8,
            h5: {
                fontSize: ".3rem",
            },
            button: {
                fontSize: ".1rem",
            },
        },
    });

    return (
        <ThemeProvider theme={responsiveFontSizes(theme)}>
            <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;
