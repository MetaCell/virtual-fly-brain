import vars from "./variables";
import { createTheme } from "@mui/material/styles";

const {
  primaryFont,
  whiteColor,
  outlinedBtnBorderColor,
  outlinedBtnTextColor
} = vars;

let theme = createTheme();

theme = createTheme({
  typography: {
    fontFamily: primaryFont,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, body {
          font-family: ${primaryFont}
        }
      `,
    },

    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: '1.125rem',
          fontWeight: 400,
          borderRadius: '0.5rem',
          textTransform: 'none',
          height: '2.125rem',
        },

        outlined: {
          '& svg': {
            marginRight: '0.5rem'
          }
        },

        outlinedPrimary: {
          border: `0.0625rem solid ${outlinedBtnBorderColor}`,
          color: outlinedBtnTextColor,
          '&:hover': {
            borderColor: outlinedBtnBorderColor,
            backgroundColor: outlinedBtnBorderColor,
            color: whiteColor
          }
        }
      },
    },

    MuiInput: {
      styleOverrides: {
        root: {
          color: whiteColor,

          '&::before': {
            display: 'none'
          },

          '&::after': {
            display: 'none'
          },
        },

        input: {
          '&::placeholder': {
            opacity: 0.8,
          },
        }
      }
    },

    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: '1.125rem',
          fontWeight: 400,
          color: whiteColor,

          '&:not(:first-child)': {
            marginTop: '0.75rem',
            [theme.breakpoints.up('lg')]: {
              marginLeft: '1.5rem',
              marginTop: 0,
            },

          }
        }
      }
    }
  },
});

export default theme;