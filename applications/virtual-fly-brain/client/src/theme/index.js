import vars from "./variables";
import { createTheme } from "@mui/material/styles";
import maximizeIcon from "../assets/viewer/maximize_icon.svg";
import minimizeIcon from "../assets/viewer/minimize_icon.svg";
import closeIcon from "../assets/viewer/close_icon.svg";

const {
  primaryFont,
  whiteColor,
  outlinedBtnBorderColor,
  outlinedBtnTextColor,
  secondaryBg,
  blackColor,
  primaryBg,
  chipPrimaryColor,
  chipSecondaryColor,
  textErrorColor,
  tabActiveColor,
  bottomNavBg,
  btnTextHoverColor,
  listHeadingColor,
  popperShadow,
  filterPopoverShadow,
  filterPopoverBg
} = vars;

let theme = createTheme();

theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: primaryFont,
      letterSpacing: 'normal'
    }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, body {
          font-family: ${primaryFont};
          box-sizing: border-box
        }

        .chrome-picker {
          z-index: 100;
          border-radius: 6px !important;
          background: ${secondaryBg} !important;
        }

        .flexbox-fix label {
          color: ${whiteColor} !important;
        }

        .flexbox-fix input {
          background: ${primaryBg} !important;
          color: ${whiteColor} !important;
          box-shadow: none !important;
          border-radius: 4px !important;
        }
        .flexbox-fix > div:nth-of-type(2) > div:nth-of-type(1) {
          margin-right: 0px !important; 
          margin-top: 2px !important; 
        }
        .flexbox-fix input:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }

        .flexbox-fix svg {
          path {
            fill: ${whiteColor} !important;
          }
        }
        .flexbox-fix svg:hover {
          background: transparent !important;
        }

        .flexlayout__tab_button {
          margin: 0;
          border-radius: 8px 8px 0px 0px;
          padding: 0.25rem 0.5rem;
          margin-right: 0.25rem;
        }
        .flexlayout__tab_button--selected {
          background-color: ${blackColor};
        }
        .flexlayout__tab_button--selected:hover {
          background-color: ${blackColor};
        }
        .flexlayout__tab_button--unselected {
          background-color: transparent;
          border-top: 1px solid ${secondaryBg};
          border-right: 1px solid ${secondaryBg};
          border-left: 1px solid ${secondaryBg};
          border-bottom: 0;
        }
        .flexlayout__tab_button--unselected:hover {
          background-color: transparent;
        }
        .flexlayout__tab_button_content {
          font-size: 0.875rem;
          line-height: 1.125rem;
          color: ${outlinedBtnTextColor};
          font-weight: 400;
          padding: 0;
          font-family: ${primaryFont};
        }
        .flexlayout__tabset_tabbar_inner_tab_container_top {
          border-top: none;
          gap: 0.25rem;
        }
        .flexlayout__tabset_tabbar_outer {
          background-color: transparent;
        }
        .flexlayout__tabset_tabbar_outer_top {
          border-bottom: none;
        }
        .flexlayout__layout {
          border-top: none;
        }
        .flexlayout__tabset {
          background-color: transparent;
        }
        .flexlayout__tab {
          border-radius: 8px;
           background-color: ${blackColor};
          padding: 1rem;
        }
        .flexlayout__tab_toolbar {
          gap: 0.25rem;
          text-align: right;
        }
        .flexlayout__tab_toolbar_button-min {
          background: transparent url(${maximizeIcon}) no-repeat center;
          cursor: pointer;
        }
        .flexlayout__tab_toolbar_button-max {
          background: transparent url(${minimizeIcon}) no-repeat center;
          cursor: pointer;
        }
        .flexlayout__tab_button_trailing {
          background: transparent url(${closeIcon}) no-repeat center !important;
          min-width: 1rem;
          min-height: 1rem;
          margin-left: 0.5rem;
        }
        .customIconFlexLayout:hover {
          color: #c0c0c0;
        }
        .flexlayout__tab_toolbar_button-min:before {
          content: "";
        }
        .flexlayout__tab_toolbar_button-max:before {
          content: "";
        }
        .flexlayout__tab_button_trailing:before {
          content: "";
        }
        .flexlayout__splitter {
          background: transparent;
        }
      `,
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: '0 0 1rem 0'
        }
      }
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '0.25rem 0.5rem',
          '&:hover': {
            backgroundColor: secondaryBg,
            '& .MuiTypography-root': {
              color: whiteColor
            }
          }
        }
      }
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },

    MuiTreeView: {
      styleOverrides: {
        root: {
          '& .MuiTreeItem-root': {
            position: 'relative',
            '&:before': {
              position: 'absolute',
              left: '-10px',
              top: '0px',
              borderLeft: '1px solid #505050',
              borderBottom: '1px solid #505050',
              content: '""',
              width: '8px',
              height: '1em',
              borderBottomLeftRadius: "50%"
            },
            '&:after': {
              position: 'absolute',
              left: '-10px',
              bottom: '0px',
              borderLeft: '1px solid #505050',
              content: '""',
              width: '8px',
              height: '100%'
            },
            '&:last-of-type': {
              '&:after': {
                display: 'none'
              }
            }
          }
        }
      }
    },

    MuiTreeItem: {
      styleOverrides: {
        group: {
          paddingTop: '0.25rem',
          marginLeft: '1.25rem',
        },
        root: {
          position: 'relative',
          padding: 0,
          '&:not([aria-expanded])': {
            '& .MuiTreeItem-iconContainer': {
              position: 'absolute',
              left: '-0.78125rem',
              top: '-0.25rem',
            },
          },
          '&[aria-expanded="true"]': {
            // '&:before': {
            //   content: "''",
            //   position: 'absolute',
            //   left: '0.5rem',
            //   top: '1.25rem',
            //   backgroundColor: primaryBg,
            //   height: 'calc(100% - 1rem)',
            //   width: '0.0625rem',
            // }
          }

        },
        content: {
          padding: '0.125rem 0',
          // cursor: 'auto',

          '&:hover': {
            backgroundColor: 'transparent'
          },

          '&.Mui-selected': {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent'
            },
            '&.Mui-focused': {
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'transparent'
              }
            },
          },
          '&.Mui-focused': {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent'
            }
          },
        },
        iconContainer: {
          marginRight: 0,
          width: 'auto'
        },
        label: {
          paddingLeft: 0,
          userSelect: 'none',
          fontWeight: 400,
          fontSize: '1rem',
          marginLeft: '0.25rem',
          [theme.breakpoints.down('lg')]: {
              fontSize: '0.875rem'
          },
          lineHeight: '125%',
          color: outlinedBtnTextColor,

          '& .MuiTabs-root': {
            minHeight: '1.75rem'
          },

          '& .MuiTab-root': {
            padding: 0,
            minHeight: '1.75rem'
          },

          '& p': {
            lineHeight: '125%',
            fontSize: '1rem',
            [theme.breakpoints.down('lg')]: {
              fontSize: '0.875rem'
          },
            letterSpacing: 'normal'
          },

          '& > div': {
            alignItems: 'center'
          },

          '& > div > p': {
            flex: 1,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow:'hidden',
            position: 'relative',
            '&:after': {
              content: "''",
              position: 'absolute',
              right: 0,
              width: '5.5rem',
              height: '100%',
              background: 'linear-gradient(270deg, #222222 0%, rgba(34, 34, 34, 0) 26.7%)',

              [theme.breakpoints.up('lg')]: {
                background: 'linear-gradient(270deg, #1A1A1A 0%, rgba(26, 26, 26, 0.00) 26.7%)'
              }
            }
          }
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          color: outlinedBtnTextColor,
          borderBottomColor: secondaryBg,
          lineHeight: '150%',
          padding: '0.5rem 0.75rem',
        },
        body: {
        },
        head: {
          background: secondaryBg,
          fontSize: '0.75rem',
        }
      }
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
        }
      }
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border: `0.0625rem solid ${secondaryBg}`,
          borderRadius: '0.5rem'
        }
      }
    },

    MuiCardMedia: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }
      }
    },

    MuiPaginationItem: {
      styleOverrides: {
        previousNext: {
          '&:not(.Mui-disabled)': {
            color: tabActiveColor,
          }
        },
        root: {
          color: listHeadingColor,
          textAlign: 'center',
          fontSize: '0.75rem',
          fontWeight: 500,
          lineHeight: '1rem',
          letterSpacing: '-0.00375rem',
          margin: 0,
          height: '1.25rem',
          padding: '0',
          minWidth: '1.25rem',

          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: tabActiveColor
          }
        }
      }
    },

    MuiPagination: {
      styleOverrides: {
        root: {
          width: '100%',
        },

        ul: {
          justifyContent: 'center',
          gap: '0.5rem',
          '& li': {
            display: 'flex',
            '&:first-of-type': {
              marginRight: 'auto',
            },
            '&:last-of-type': {
              marginLeft: 'auto',
            },
          }
        }
      }
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: secondaryBg,
        }
      }
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0.75rem',
          '&:last-child': {
            paddingBottom: '0.75rem',
          }
        }
      }
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          width: '100%',

          [theme.breakpoints.down('lg')]: {
            minHeight: 'inherit'
          }
        },

        indicator: {
          backgroundColor: tabActiveColor,
        }
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.80)',
          textTransform: 'capitalize',
          fontSize: '0.875rem',
          flex: '2',
          maxWidth: '100%',

          [theme.breakpoints.down('lg')]: {
            padding: 0,
            height: '2.75rem',
            minHeight: 'inherit'
          },

          '&.Mui-selected': {
            color: whiteColor
          },
        }
      }
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          padding: 0,
          color: whiteColor,
          minHeight: 0,
          boxShadow: 'none',

          '&.Mui-expanded': {
            margin: 0,
          },

          '&.Mui-expanded:before': {
            opacity: 1,
            display: 'block !important'
          },

          '&:before': {
            backgroundColor: secondaryBg,
            top: 'auto',
            bottom: 0,
            display: 'block !important'
          },
        }
      }
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 0,
          padding: 0,

          '&.Mui-expanded': {
            minHeight: 0,
          }
        },
        gutters: {
          padding: 0
        },
        contentGutters: {
          padding: 0,
          margin: '1rem 0',
        },
        content: {
          margin: '1rem 0',
          '&.Mui-expanded': {
            margin: '1rem 0',
          },
          '& .MuiTypography-root': {
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: '129%',
            color: outlinedBtnTextColor,
          }
        }
      }
    },

    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          height: '100%',
        },
        grouped: {
          minWidth: '1.75rem',
          padding: 0,
          [theme.breakpoints.down('lg')]: {
            height: '100%',
          },

          '&:not(:last-of-type)': {
            borderColor: blackColor
          }
        }
      }
    },

    MuiDialog: {
      styleOverrides: {
        root: {
          '& div[dir="ltr"][aria-roledescription="carousel"]': {
            position: 'relative'
          },

          '& .react-slideshow-container .nav': {
            zIndex: 10,
            position: 'absolute',
            cursor: 'pointer',
            bottom: '0.5rem',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          },

          '& .react-slideshow-container .nav svg': {
            width: '1.25rem',
            height: '1.25rem'
          },
    
          '& .react-slideshow-container .nav.disabled': {
            opacity: 0.6
          },
    
          '& .react-slideshow-container .nav:first-of-type': {
            left: '40%'
          },
    
          '& .react-slideshow-container .nav:last-of-type': {
            right: '40%'
          },
    
          '& .react-slideshow-container + ul.indicators .each-slideshow-indicator::before': {
            background: whiteColor,
            position: 'static',
            display: 'block',
            width: '0.375rem',
            height: '0.375rem'
          },
    
          '& .react-slideshow-container + ul.indicators li': {
            width: 'auto',
            height: 'auto',
            padding: 0,
            display: 'flex',
    
          },
    
          '& .react-slideshow-container + ul.indicators': {
            margin: 0,
            padding: 0,
            position: 'absolute',
            bottom: '1rem',
            height: 'auto',
            width: '100%',
          }
        },

        paper: {
          overflow: 'visible',
          borderRadius: '0.875rem',
          padding: '0.75rem',
          boxShadow: '0 0.5rem 0.5rem -0.25rem rgba(16, 24, 40, 0.03), 0 1.25rem 1.5rem -0.25rem rgba(16, 24, 40, 0.08)'
        },
      }
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          fontSize: '0.75rem',
          lineHeight: '140%',
          color: whiteColor,
          padding: '0.375rem 0.5rem',

          '&.Mui-selected': {
            background: secondaryBg,
            '&:hover': {
              background: secondaryBg
            }
          },

          '&:hover': {
            background: secondaryBg
          }
        }
      }
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '0.375rem',
          padding: '0.5rem',
          background: bottomNavBg,
          boxShadow: popperShadow,
          backdropFilter: 'blur(0.625rem)',
        },
        list: {
          padding: 0,
          margin: '0 -0.5rem'
        }
      }
    },

    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: '1.125rem',
          fontWeight: 400,
          borderRadius: '0.5rem',
          textTransform: 'none',
          height: '2.125rem'
        },

        text: {
          borderRadius: 0,
          '&:hover': {
            backgroundColor: btnTextHoverColor,
          }
        },

        contained: {
          boxShadow: 'none',
          height: '1.75rem',
          borderRadius: '0.25rem',
          padding: '0 0.5rem'
        },

        containedSecondary: {
          backgroundColor: secondaryBg,
          '&:hover': {
            backgroundColor: secondaryBg,
          }
        },

        containedInfo: {
          backgroundColor: tabActiveColor,
          height: '2rem',
          padding: '0 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: '0.25rem',
          '&:hover': {
            backgroundColor: tabActiveColor,
          }
        },

        outlinedInfo: {
          fontSize: '0.75rem',
          height: '1.75rem',
          borderColor: tabActiveColor,
          letterSpacing: '-0.005em',
          color: tabActiveColor,
          borderRadius: '0.25rem',
          minWidth: '3.5rem',
          padding: 0,
        },

        textError: {
          fontSize: '0.75rem',
          height: '1.75rem',
          letterSpacing: '-0.005em',
          color: textErrorColor,
          borderRadius: '0.25rem',
          minWidth: '3.5rem',
          padding: 0,
        },

        textPrimary: {
          color: outlinedBtnTextColor,

          '&.active': {
            color: whiteColor,
            fontWeight: 500,
          }
        },

        outlined: {
          '& svg': {
            marginRight: '0.5rem'
          }
        },

        outlinedPrimary: {
          border: `0.0625rem solid ${outlinedBtnBorderColor}`,
          color: outlinedBtnTextColor,
          padding: '0 0.75rem',
          '&:hover': {
            borderColor: outlinedBtnBorderColor,
            backgroundColor: secondaryBg,
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

    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
        }
      }
    },

    MuiChip: {
      styleOverrides: {
        deleteIcon: {
          margin: 0,
          fontSize: '0.75rem',
          color: whiteColor,
          marginLeft: '0.25rem',

          '&:hover': {
            color: whiteColor
          }
        },
        root: {
          fontFamily: primaryFont,
          height: '1.5rem',
          padding: '0.1875rem 0.5rem !important',
          fontWeight: 400,
          fontSize: '0.625rem',
          lineHeight: '133%',
          color: whiteColor,

          '&.secondary': {
            borderRadius: '0.25rem'
          },

          '& svg': {
            marginRight: '0.5rem'
          }
        },

        colorPrimary: {
          background: chipPrimaryColor,

          '& .MuiChip-label': {
            color: whiteColor,
            padding: '0 !important',
          }
        },

        colorSecondary: {
          background: chipSecondaryColor
        },

        label: {
          padding: '0 !important',
        },

        colorDefault: {
          background: primaryBg
        },
      }
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },

    MuiListItemText: {
      styleOverrides: {
        root: {
          margin: 0
        },
        primary: {
          fontWeight: 400,
          fontSize: '0.75rem',
          lineHeight: '133%',
          color: outlinedBtnTextColor,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace:'nowrap'
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

          '&:not(:first-of-type)': {
            marginTop: '0.75rem',
            [theme.breakpoints.up('lg')]: {
              marginLeft: '1.5rem',
              marginTop: 0,
            },

          }
        }
      }
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
        },
        label: {
          fontWeight: 400,
          userSelect: 'none',
          fontSize: '0.75rem',
          marginLeft: '0.5rem',
          lineHeight: '133%',
          color: outlinedBtnTextColor,
        }
      }
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: secondaryBg
        },
        arrow: {
          color: secondaryBg
        }
      }
    },

    MuiPopper: {
      styleOverrides: {
        root: {
          maxWidth: '100%',
          '&:not(.MuiTooltip-popper)': {
            zIndex: 99,
            background: bottomNavBg,
            boxShadow: popperShadow,
            backdropFilter: 'blur(0.625rem)',
            borderRadius: '0.375rem',
            width: '23.9375rem',

            '&.menu-popover': {
              marginTop: '0 !important',
              width: '10rem',
              background: filterPopoverBg,
              boxShadow: filterPopoverShadow,
              backdropFilter: 'blur(0.375rem)',
              borderRadius: '0.125rem'
            },

            '&.filter-popover': {
              marginTop: '-1.75rem !important',
              width: '15.5rem',
              background: filterPopoverBg,
              boxShadow: filterPopoverShadow
            }
          }
        }
      }
    }
  },
});

export default theme;
