import { createTheme } from '@mui/material/styles';

// Design tokens
// Color: deep pine (#1F3A2E) + warm brass (#B98B33) evoke an upscale
// barbershop/salon hybrid rather than a generic SaaS blue.
// Type: Fraunces (display serif, headings) + Inter (body/UI) +
// IBM Plex Mono (prices, times, tabular data).
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f3a2e',
      light: '#3c5c48',
      dark: '#122720',
      contrastText: '#faf7f2',
    },
    secondary: {
      main: '#b98b33',
      light: '#d9ae5f',
      dark: '#8f6a22',
      contrastText: '#201f1d',
    },
    error: {
      main: '#a63d33',
    },
    warning: {
      main: '#b98b33',
    },
    info: {
      main: '#2b6ca3',
    },
    success: {
      main: '#2f7d4f',
    },
    background: {
      default: '#faf7f2',
      paper: '#fffdf9',
    },
    text: {
      primary: '#201f1d',
      secondary: '#5b5650',
    },
    divider: '#e6dfd0',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    h1: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h2: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h3: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h4: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h5: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    h6: { fontFamily: "'Fraunces', serif", fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 18 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f3a2e',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, backgroundColor: '#f1ece0' },
      },
    },
  },
});

export default theme;

// Shared helper: numeric / data-dense values (prices, durations, clock times)
// are rendered in the mono utility face across the app for a tabular, receipt-like feel.
export const monoFontFamily = "'IBM Plex Mono', monospace";
