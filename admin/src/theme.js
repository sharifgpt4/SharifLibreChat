import { createTheme } from '@mui/material/styles';
import { blueGrey, lightBlue, grey, red } from "@mui/material/colors";

const openAiTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: lightBlue[700], // Reflects OpenAI's vibrant and techy vibe
            contrastText: grey[50],
        },
        secondary: {
            main: blueGrey[500], // Complements the primary color with subtlety
            contrastText: grey[50],
        },
        error: {
            main: red[400], // For errors, a stark contrast to grab attention
            contrastText: grey[900],
        },
        background: {
            default: grey[900], // A deep grey for the overall background
            paper: grey[800], // A lighter shade for paper elements
        },
        text: {
            primary: grey[50], // Ensures high readability
            secondary: grey[400], // Subdued for less critical text
        },
    },
    typography: {
        fontFamily: `'Inter', sans-serif`,
        h1: { fontSize: '2.125rem', fontWeight: 500, lineHeight: 1.235 },
        h2: { fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.2 },
        h3: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.167 },
        h4: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.235 },
        h5: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.334 },
        h6: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.6 },
        button: { textTransform: 'none', fontWeight: 400 },
        body1: { fontSize: '1rem', lineHeight: 1.5 },
        body2: { fontSize: '0.875rem', lineHeight: 1.43 },
        // Additional customization here
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: { backgroundColor: blueGrey[900] },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    textTransform: 'none',
                },
                contained: {
                    boxShadow: 'none',
                    '&:active': { boxShadow: 'none' },
                    '&:hover': { boxShadow: 'none' },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: { backgroundColor: grey[800], color: grey[50] },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: { fontSize: '0.875rem' },
            },
        },
        // Customizing the Link behavior to better fit dark mode
        MuiLink: {
            styleOverrides: {
                root: {
                    color: lightBlue[400],
                    '&:hover': { color: lightBlue[300] },
                },
            },
        },
        // Adjusting input fields for better visibility and aesthetics in dark mode
        MuiTextField: {
            defaultProps: {
                InputLabelProps: { style: { color: grey[400] } },
                InputProps: { style: { color: grey[50] } },
            },
        },
        // Additional component customizations can be added here
    },
});

export default openAiTheme;
