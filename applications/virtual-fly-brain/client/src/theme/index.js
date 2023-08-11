import vars from "./variables";
import { createTheme } from "@mui/material/styles";

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
    }
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, body {
          font-family: ${primaryFont};
          box-sizing: border-box
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

    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
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
          whiteSpace: 'nowrap'
        }
      }
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '0.25rem 0.5rem'
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
            marginTop: '-1.5rem !important',

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
    },

    MuiTreeView: {
      styleOverrides: {
        root: {
          '& .MuiTreeItem-root': {
            '&:last-of-type': {
              '&:before': {
                height: 'calc(100% - 2.8125rem)'
              }
            }
          }
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: 0,
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
          marginBottom: '0.5rem'
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
            '&:before': {
              content: "''",
              position: 'absolute',
              left: '0.5rem',
              top: '1.25rem',
              backgroundColor: primaryBg,
              height: 'calc(100% - 1rem)',
              width: '0.0625rem',
            }
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
          lineHeight: '125%',
          color: outlinedBtnTextColor,

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
                background: 'linear-gradient(270deg, #000000 0%, rgba(0, 0, 0, 0) 26.7%)',
              }
            }
          }
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
            margin: 0
          },

          '&.Mui-expanded:before': {
            opacity: 1,
          },

          // '&:first-of-type:before': {
          //   display: 'block'
          // },

          // '&:last-of-type:before': {
          //   display: 'none'
          // },

          '&:before': {
            backgroundColor: secondaryBg,
            // top: 'auto',
            // bottom: 0,
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
          borderRadius: '0.25rem',
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
        paper: {
          overflow: 'visible',
          borderRadius: '0.875rem',
          padding: '0.75rem',
          boxShadow: '0 0.5rem 0.5rem -0.25rem rgba(16, 24, 40, 0.03), 0 1.25rem 1.5rem -0.25rem rgba(16, 24, 40, 0.08)'
        }
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

          '&:hover': {
            background: primaryBg
          }
        }
      }
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          background: secondaryBg,
          boxShadow: '0 1.25rem 1.5rem -0.25rem rgba(16, 24, 40, 0.08), 0 0.5rem 0.5rem -0.25rem rgba(16, 24, 40, 0.03)',
          borderRadius: '0.375rem',
          padding: '0.5rem'
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
          height: '2.125rem',
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
          backgroundColor: primaryBg,
          '&:hover': {
            backgroundColor: primaryBg,
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
          padding: '0 0.5rem',
          fontWeight: 400,
          fontSize: '0.75rem',
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
            color: secondaryBg
          }
        },

        colorSecondary: {
          background: chipSecondaryColor
        },

        label: {
          padding: 0,
        },

        colorDefault: {
          background: secondaryBg
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

    MuiListItemButton: {
      styleOverrides: {
        root: {
          padding: '0.25rem 0.5rem'
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
            marginTop: '-1.5rem !important',

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