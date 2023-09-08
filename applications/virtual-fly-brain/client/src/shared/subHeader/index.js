import React, { useState } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { AngleLeft, ClearAll, Download, History, Layers, Query, Search, Upload } from "../../icons";
import vars from "../../theme/variables";
import MediaQuery from 'react-responsive'
import SearchBuilder from "./SearchBuilder";
import { FilterMenu } from "./FilterMenu";

const navArr = [
  {
    id: 0,
    icon: Upload,
    name: 'Upload'
  },
  {
    id: 1,
    icon: Download,
    name: 'Download'
  },
  {
    id: 2,
    icon: Query,
    name: 'Query'
  },
  {
    id: 3,
    icon: Layers,
    name: 'Layer'
  },
  {
    id: 4,
    icon: ClearAll,
    name: 'Clear all'
  },
  {
    id: 5,
    icon: History,
    name: 'Recent'
  },
]

const {
  tabActiveColor,
  primaryBg,
  secondaryBg,
  searchBoxBg,
  whiteColor,
  shortcutBg,
  blackColor,
  bottomNavBg,
  outlinedBtnTextColor,
  headerBorderColor
} = vars;

const SubHeader = ({ setBottomNav, bottomNav }) => {
  const [focused, setFocused] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = {
    root: {
      position: 'relative'
    },

    nav: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      gap: '1rem',
      transform: 'translateY(-50%)'
    },

    shortcut: {
      backgroundColor: shortcutBg,
      borderRadius: 2,
      // width: '4.1875rem',
      height: '1.75rem',
      color: whiteColor,
    }
  };

  return (
    <Box sx={{
      ...classes.root,
      py: {
        // xs: 1,
        lg: 0.75
      },
      px: {
        lg: 2
      },

      borderTop: {
        xs: `0.0625rem solid ${headerBorderColor}`,
        lg: 'none'
      },

      borderColor: {
        xs: focused ? 'transparent' : headerBorderColor,
      },

      backgroundColor: {
        xs: primaryBg,
        lg: secondaryBg
      }
    }}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 99,
          transition: 'all ease-in-out .3s',
          width: {
            lg: focused ? '50rem' : '35rem'
          },
          mx: {
            lg: 'auto'
          },
          borderRadius: {
            xs: focused ? '0.375rem 0.375rem 0 0' : 0,
            lg: focused ? '0.5rem 0.5rem 0 0' : 2
          },
          pl: {
            xs: 1.5,
            lg: 1.5
          },
          py: {
            xs: 1,
            lg: 0.25
          },
          pr: {
            xs: 1.5,
            lg: 0.5
          },
          cursor: 'pointer',
          backgroundColor: {
            xs: focused ? bottomNavBg : primaryBg,
            lg: focused ? bottomNavBg : searchBoxBg
          },
          boxShadow: focused ? `0 0.25rem 6.25rem ${blackColor}, 0 0 5rem rgba(0, 0, 0, 0.6)` : 'none',
        }}

        display='flex'
        alignItems='center'>
        {focused ? <AngleLeft style={{ margin: 0 }} size={20} /> : <Search style={{ margin: 0 }} />}

        <Box flexGrow={1} px={1}>
          <SearchBuilder setFocused={setFocused} />
        </Box>
        <FilterMenu classes={classes} />

        {/* <MediaQuery minWidth={1200}>
          {!focused && (
            <Button
              sx={{
                ...classes.shortcut,
                flexShrink: 0,
                p: 0,
                borderRadius: '0.25rem',
                minWidth: '4.1875rem'
              }}
            >
              Ctrl + K
            </Button>
          )}
        </MediaQuery> */}
      </Box>

      <MediaQuery minWidth={1200}>
        <Box
          display='flex'
          flexWrap='wrap'
          sx={classes.nav}
        >
          {navArr.map((item) => (
            <Tooltip key={`${item.id}_${item.name}`} title={item.name}>
              <Button
                aria-label={ item.name }
                disableRipple
                onClick={() => setBottomNav((prev) => prev === item.id ? null : item.id)}
                sx={{
                  minWidth: '0.0625rem',
                  padding: 0,

                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <item.icon color={item?.id === bottomNav && tabActiveColor} />
              </Button>
            </Tooltip>
          ))}
        </Box>
      </MediaQuery>
    </Box>
  )
};

export default SubHeader