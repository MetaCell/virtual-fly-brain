import React, { useState } from "react";
import { Box, Button, Chip, IconButton, Menu, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import { AddChart, AngleDown, AngleLeft, AngleRight, AngleUp, ClearAll, Delete, Download, Filter, History, Info, Layers, More, OpenInNew, Query, Return, Search, SplitScreen, Upload } from "../../icons";
import vars from "../../theme/variables";
import MediaQuery from 'react-responsive'

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
  primaryBg,
  secondaryBg,
  searchBoxBg,
  whiteColor,
  shortcutBg,
  blackColor,
  searchHeadingColor,
  outlinedBtnBorderColor,
  chipPink,
  chipRed,
  chipGreen,
  chipYellow,
  chipOrange,
  bottomNavBg
} = vars;

const SubHeader = () => {
  const [focused, setFocused] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

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
          zIndex: 9,
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
            lg: 0.25
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
        {focused ? <AngleLeft size={20} /> : <Search />}

        <TextField
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{
            ml: 1
          }}
          fullWidth
          placeholder="Find something..."
          variant="standard"
        />
        <MediaQuery minWidth={1200}>
          {focused ? (
            <Box
              flexShrink={0}
              display='flex'
              alignItems='center'
              columnGap='0.25rem'
            >
              <Button
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

        {focused && (
          <Box sx={{
            borderTop: `0.0625rem solid ${searchBoxBg}`,
            overflow: 'hidden',
            position: 'absolute',
            width: 1,
            top: 36,
            borderRadius: '0 0 0.5rem 0.5rem',
            left: 0,
            background: bottomNavBg,
            backdropFilter: {
              lg: focused ? 'blur(0.625rem)' : 'none'
            }
          }}>
            <Box sx={{
              px: '1rem',
              py: '0.75rem',
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: searchHeadingColor }}>
                I’m looking for...
              </Typography>

              <Box
                mt={1.5}
                sx={{
                  columnGap: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button sx={{
                  px: '0.5rem',
                  py: '0.25rem',
                  backgroundColor: outlinedBtnBorderColor,
                  borderRadius: 1,

                  '&:hover': {
                    backgroundColor: outlinedBtnBorderColor,
                  }
                }}>
                  <AddChart style={{marginRight: '0.5rem'}} />
                  Load results
                  <AngleRight style={{ marginLeft: '0.5rem' }} />
                </Button>

                <Button sx={{
                  px: 1,
                  py: 0.5,
                  backgroundColor: outlinedBtnBorderColor,
                  borderRadius: 1,

                  '&:hover': {
                    backgroundColor: outlinedBtnBorderColor,
                  }
                }}>
                  <SplitScreen style={{ marginRight: '0.5rem' }} />
                  Queries
                  <AngleRight style={{ marginLeft: '0.5rem' }} />
                </Button>
              </Box>
            </Box>

            <Box sx={{
              px: '1rem',
              py: '0.75rem',
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: searchHeadingColor }}>
                Recent search
              </Typography>

              <Box mt={1.5}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',

                  '&:hover': {
                    backgroundColor: secondaryBg
                  }
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: 1,
                    background: searchBoxBg,
                  }}>
                    <Search size={12} />
                  </Box>

                  <Typography variant="body2" sx={{ color: searchHeadingColor, px: 1 }}>
                    A00c_a4
                  </Typography>

                  <Box sx={{
                    ml: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: 0.5
                  }}>
                    <Chip sx={{ backgroundColor: chipPink }} label="Nervous projection bundle" />
                    <Chip sx={{ backgroundColor: chipRed }} label="Larva" />
                    <Chip sx={{ backgroundColor: chipGreen }} label="Anatomy" />
                    <Chip sx={{ backgroundColor: chipOrange }} label="Neuron" />
                    <Chip sx={{ backgroundColor: chipYellow }} label="Nervous system" />
                    <Tooltip
                      placement="bottom-end"
                      arrow
                      title={
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          columnGap: 0.5
                        }}>
                          <Chip sx={{ backgroundColor: chipGreen }} label="Anatomy" />
                          <Chip sx={{ backgroundColor: chipYellow }} label="Nervous system" />
                        </Box>
                      }
                    >
                      <Chip sx={{ backgroundColor: searchBoxBg }} label="+2" />
                    </Tooltip>
                    <IconButton
                      size="small"
                      id="basic-button"
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
                      <More />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={handleClose}>
                        <AddChart style={{ margin: '0 0.375rem 0 0' }} />
                        Load results
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <OpenInNew style={{ margin: '0 0.375rem 0 0' }} />
                        Go to query
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Delete style={{ margin: '0 0.375rem 0 0' }} />
                        Remove from history
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              px: '1rem',
              py: '0.75rem',
            }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: searchHeadingColor }}>
                Suggested results
              </Typography>

              <Box mt={1.5}>
                <Box sx={{
                  p: 0.5,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',

                  '&:hover': {
                    backgroundColor: secondaryBg
                  }
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: 1,
                    background: searchBoxBg,
                  }}>
                    <Search size={12} />
                  </Box>

                  <Typography variant="body2" sx={{ color: searchHeadingColor, px: 1 }}>
                    A0 (anlage in statu nascendi)
                  </Typography>

                  <Box sx={{
                    ml: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    columnGap: 0.5
                  }}>
                    <Chip sx={{ backgroundColor: chipGreen }} label="Anatomy" />
                    <Chip sx={{ backgroundColor: chipYellow }} label="Nervous system" />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              px: '1rem',
              py: '0.75rem',
              height: '2.5rem',
              columnGap: 2,
              display: 'flex',
              alignItems: 'center',
              backdropFilter: 'blur(0.625rem)',
              background: bottomNavBg
            }}>
              <Box
                display='flex'
                alignItems='center'
                columnGap='0.125rem'
              >
                <AngleDown />
                <AngleUp />
                <Typography variant="body2" sx={{ ml: '0.25rem', color: searchHeadingColor }}>
                  Navigate
                </Typography>
              </Box>

              <Box
                display='flex'
                alignItems='center'
                columnGap='0.125rem'
              >
                <Return />
                <Typography variant="body2" sx={{ ml: '0.25rem', color: searchHeadingColor }}>
                  Select
                </Typography>
              </Box>

              <Box
                display='flex'
                alignItems='center'
                columnGap='0.125rem'
              >
                <AngleLeft />
                <Typography variant="body2" sx={{ ml: '0.25rem', color: searchHeadingColor }}>
                  Cancel
                </Typography>
              </Box>

              <Tooltip placement="bottom-end" arrow title="Lorem Ipsum Dolor">
                <Box
                  ml='auto'
                  display='flex'
                  alignItems='center'
                  columnGap='0.125rem'
                >
                  <Info />
                </Box>
              </Tooltip>
            </Box>
          </Box>
        )}
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