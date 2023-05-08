import { Box, Button, ButtonGroup, Grid, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import MediaQuery from 'react-responsive';
import { ArView, ArrowDown, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Delete, Expand, Eye, Focus, Remove } from "../../icons";
import vars from "../../theme/variables";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from "@mui/lab";

const {
  whiteColor,
  secondaryBg,
  outlinedBtnTextColor,
  blackColor
} = vars;

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const classes = {
    root: {
      // transition: 'all ease-in-out .3s',
      height: '100%',
      color: whiteColor,
      display: 'flex',
      flexDirection: 'column'
    },

    header: {

    },

    buttonGroup: {

    },

    footer: {
      height: '3.75rem',
      borderTop: `0.0625rem solid ${secondaryBg}`,
      '& p': {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1,
        color: outlinedBtnTextColor,
      }
    },
  }

  const termInfoHeading = (
    <>
      <Typography
        component='span'
        sx={{
          fontWeight: 500,
          lineHeight: 1,
          mr: 1,
          color: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        Term info:
      </Typography>
      JRC2018Unisex [VFB_00101567]
    </>
  )

  return (
    <Box
      sx={{
        ...classes.root,
        width: {
          lg: open ? 'auto' : '2.75rem'
        },
        flex: {
          lg: open ? 1 : 'none !important'
        },
        p: {
          xs: 2,
          lg: 0
        },
        pt: {
          lg: open ? 0 : 4
        },
        background: {
          lg: blackColor
        },
        borderColor: {
          lg: secondaryBg
        },
        borderStyle: {
          lg: 'solid'
        },
        borderTopRightRadius: {
          lg: '0.5rem'
        },
        borderWidth: {
          lg: '0.0625rem 0.0625rem 0 0'
        }
      }}
    >
      <Box flexGrow={1}>
        {!open ? (
          <Typography sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            transform: 'rotate(90deg)',
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1,
            color: whiteColor
          }}>
            {termInfoHeading}
          </Typography>
        ) : (
          <Box sx={{
            p: {
              lg: 2
            }
          }}>
            <Box mb={2} sx={classes.header}>
              <Grid container>
                <MediaQuery minWidth={768}>
                  <Grid item xs={12} lg={6} md={6}>
                    <Box>
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: whiteColor
                      }}>
                        {termInfoHeading}
                      </Typography>
                    </Box>
                  </Grid>
                </MediaQuery>

                <Grid item xs={12} lg={6} md={6}>
                  <Box
                    display='flex'
                    rowGap={1}
                    flexWrap='wrap'
                    sx={{
                      flexDirection: {
                        lg: 'column'
                      },
                      alignItems: {
                        lg: 'flex-end',
                      },
                      justifyContent: {
                        xs: 'space-between',
                        lg: 'flex-end'
                      },
                      columnGap: {
                        xs: 1,
                        md: 3
                      }
                    }}
                  >
                    <Box display='flex' gap="6px">
                      <Box>
                        <Button
                          variant="contained"
                          color="secondary"
                          id="basic-button"
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClick}
                        >
                            Sections <ArrowDown style={{marginLeft: '6px'}} />
                        </Button>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={openMenu}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem onClick={handleClose}>General Information</MenuItem>
                          <MenuItem onClick={handleClose}>Queries</MenuItem>
                        </Menu>
                      </Box>
                      <ButtonGroup color="secondary" sx={classes.buttonGroup} variant="contained">
                        <Button>
                          <Expand />
                        </Button>
                        <Button>
                          <Remove />
                        </Button>
                      </ButtonGroup>
                    </Box>

                    <Box>
                      <ButtonGroup color="secondary" sx={classes.buttonGroup} variant="contained">
                        <Button>
                          <Eye />
                        </Button>
                        <Button>
                          <Focus />
                        </Button>
                        <Button>
                          <ArView />
                        </Button>
                        <Button>
                          <Delete />
                        </Button>
                      </ButtonGroup>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

            </Box>

            <Accordion>
              <AccordionSummary
                  expandIcon={<ChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>General Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Queries (28)</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <TreeView
                aria-label="customized"
                defaultExpanded={['1']}
                defaultCollapseIcon={<Eye />}
                defaultExpandIcon={<ChevronDown />}
                defaultEndIcon={<Remove />}
                sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
              >
                <TreeItem nodeId="1" label="Main">
                  <TreeItem nodeId="2" label="Hello" />
                  <TreeItem nodeId="3" label="Subtree with children">
                    <TreeItem nodeId="6" label="Hello" />
                    <TreeItem nodeId="7" label="Sub-subtree with children">
                      <TreeItem nodeId="9" label="Child 1" />
                      <TreeItem nodeId="10" label="Child 2" />
                      <TreeItem nodeId="11" label="Child 3" />
                    </TreeItem>
                    <TreeItem nodeId="8" label="Hello" />
                  </TreeItem>
                  <TreeItem nodeId="4" label="World" />
                  <TreeItem nodeId="5" label="Something something" />
                </TreeItem>
              </TreeView>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

      </Box>

      <MediaQuery minWidth={1200}>
        <Box
          px={open ? 1 : 0}
          display='flex'
          justifyContent='flex-end'
          alignItems='center'
          sx={classes.footer}
        >
          {open && <Typography>Collapse</Typography>}
          <Button
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              height: 'auto',
              minWidth: '0.0625rem',
              ml: open ? 1 : 0
            }}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </Box>
      </MediaQuery>

    </Box>
  )
};

export default SideBar;