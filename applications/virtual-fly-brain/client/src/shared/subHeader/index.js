import React, { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Popper, Typography } from "@mui/material";
import { AngleLeft, CheckBoxDefault, CheckBoxGreen, CheckBoxRed, CleaningServices, ClearAll, Download, Filter, History, Layers, Query, Search, Undo, Upload } from "../../icons";
import vars from "../../theme/variables";
import MediaQuery from 'react-responsive'
import CustomizedHook from "./autoComplete";

const navArr = [
  {
    id: 0,
    icon: <Upload />,
    name: 'Upload'
  },
  {
    id: 1,
    icon: <Download />,
    name: 'Download'
  },
  {
    id: 2,
    icon: <Query />,
    name: 'Query'
  },
  {
    id: 3,
    icon: <Layers />,
    name: 'Layer'
  },
  {
    id: 3,
    icon: <ClearAll />,
    name: 'Clear all'
  },
  {
    id: 3,
    icon: <History />,
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
  outlinedBtnTextColor
} = vars;

const SubHeader = () => {
  const [focused, setFocused] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState(null);

  const filterhandleClick = (event) => {
    setFilterAnchorEl(filterAnchorEl ? null : event.currentTarget);
  };

  const filterOpen = Boolean(filterAnchorEl);
  const filterId = filterOpen ? 'simple-popper' : undefined;




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




  const [chipInputValues, setChipInputValues] = useState([]);

  return (
    <Box sx={{
      ...classes.root,
      py: {
        xs: 1,
        lg: 0.5
      },
      px: 1.5,
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
            lg: focused ? '0.5rem 0.5rem 0 0' : 2
          },
          pl: {
            lg: 1.5
          },
          py: {
            lg: 0.5
          },
          pr: {
            lg: 0.5
          },
          backgroundColor: {
            lg: focused ? bottomNavBg : searchBoxBg
          },
          boxShadow: {
            lg: focused ? `0 0.25rem 6.25rem ${blackColor}, 0 0 5rem rgba(0, 0, 0, 0.6)` : 'none'
          },
          // backdropFilter: {
          //   lg: focused ? 'blur(0.625rem)' : 'none'
          // }
        }}
        display='flex'
        alignItems='center'>
        {focused ? <AngleLeft style={{ margin: 0 }} size={20} /> : <Search style={{ margin: 0 }} />}

        <Box flexGrow={1} px={1}>
          <CustomizedHook setFocused={setFocused} />
        </Box>
        <MediaQuery minWidth={1200}>
          {focused ? (
            <Box
              flexShrink={0}
              display='flex'
              alignItems='center'
              columnGap='0.25rem'
            >
              <Button
                aria-describedby={filterId}
                onClick={filterhandleClick}
                sx={{
                  ...classes.shortcut,
                  flexShrink: 0,
                  minWidth: '0.065rem',
                  padding: '0 0.25rem',
                  backgroundColor: 'transparent'
                }}
              >
                <Filter />
              </Button>
              <Button
                sx={{
                  ...classes.shortcut,
                  flexShrink: 0,
                  minWidth: '0.0625rem'
                }}
              >
                Esc
              </Button>

              <Popper
                className="filter-popover"
                placement="bottom-end"
                id={filterId}
                open={filterOpen}
                anchorEl={filterAnchorEl}
              >
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  sx={{
                    borderBottom: `0.0625rem solid ${primaryBg}`,
                    padding: '0.75rem',
                    height: '2.5rem',
                  }}
                >
                  <Typography
                    sx={{
                      color: outlinedBtnTextColor,
                      fontSize: '0.75rem',
                      lineHeight: '133%',
                    }}
                  >Filters</Typography>
                  <IconButton size="small" onClick={filterhandleClick}>
                    <Undo />
                  </IconButton>
                </Box>
                <Box p={1.5} sx={{
                  maxHeight: '11.5rem',
                  overflow: 'auto'
                }}>
                  <FormGroup sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 1.5
                  }}>
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Adult" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Larva" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Nervous System" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Anatomy" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Neuron" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Image" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxGreen />} icon={<CheckBoxDefault />} />} label="Split Expression" />
                    <FormControlLabel control={<Checkbox checkedIcon={<CheckBoxRed />} icon={<CheckBoxDefault />} />} label="Expression Pattern" />
                  </FormGroup>
                </Box>
                <Box sx={{
                  borderRadius: '0 0 0.25rem 0.25rem',
                  background: bottomNavBg,
                  borderTop: `0.0625rem solid ${primaryBg}`,
                  backdropFilter: 'blur(0.25rem)',
                  padding: '0.5rem 0.75rem',
                  gap: '1rem',
                  display: 'flex'
                }}>
                  <Button
                    onClick={filterhandleClick}
                    variant="text"
                    sx={{
                      borderRadius: '0.5rem'
                    }}
                  >
                    <CleaningServices
                      style={{ marginRight: '0.25rem' }}
                    />
                    Clean all
                  </Button>
                  <Button
                    onClick={filterhandleClick}
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderColor: tabActiveColor,
                      color: tabActiveColor,
                      '&:hover': {
                        backgroundColor: tabActiveColor,
                        color: whiteColor
                      }
                    }}
                  >
                    Apply filters
                  </Button>
                </Box>
              </Popper>
            </Box>
          ): (
            <Button
              sx={{
                ...classes.shortcut,
                flexShrink: 0,
                minWidth: '0.0625rem'
              }}
            >
              Ctrl + K
            </Button>
          )}

        </MediaQuery>
      </Box>

      <MediaQuery minWidth={1200}>
        <Box
          display='flex'
          flexWrap='wrap'
          sx={classes.nav}
        >
          {navArr.map((item) => (
            <Button
              aria-label={item.name}
              sx={{
                minWidth: '0.0625rem'
              }}
              key={item.id}
            >
              {item.icon}
            </Button>
          ))}
        </Box>
      </MediaQuery>
    </Box>
  )
};

export default SubHeader