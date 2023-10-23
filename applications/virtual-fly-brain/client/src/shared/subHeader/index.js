import React, { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Popper, Typography } from "@mui/material";
import { AngleLeft, CheckBoxDefault, CheckBoxGreen, CheckBoxRed, CleaningServices, ClearAll, Close, Download, Filter, History, Layers, Query, Search, Tick, Undo, Upload } from "../../icons";
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
    id: 3,
    icon: ClearAll,
    name: 'Clear all'
  },
  {
    id: 3,
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
      position: 'relative',
    },

    nav: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
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
        lg: 0.5
      },
      px: {
        lg: 1.5
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
          <SearchBuilder setFocused={setFocused}  bottomNav={bottomNav} setBottomNav={setBottomNav} />
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
          {navArr.map((item, index) => (
            <Button
              aria-label={item.name}
              onClick={() => setBottomNav(index)}
              sx={{
                minWidth: '0.0625rem'
              }}
              key={`${item.id}_${item.name}`}
            >
              <item.icon color={item?.id === bottomNav && tabActiveColor} />
            </Button>
          ))}
        </Box>
      </MediaQuery>
    </Box>
  )
};

export default SubHeader