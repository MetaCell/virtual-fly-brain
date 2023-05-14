import { Box, Button, ButtonGroup, Chip, Grid, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {useSelector, useDispatch} from 'react-redux'
import MediaQuery from 'react-responsive';
import { ArView, ArrowDown, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Delete, Expand, Eye, Focus, Line, Link, Remove } from "../../icons";
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
  blackColor,
  listHeadingColor,
  carouselBg,
  headerBorderColor,
  tabActiveColor
} = vars;

const SideBar = () => {
  const [toggleReadMore, setToggleReadMore] = useState(false);
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
      height: {
        lg: '100%'
      },
      color: whiteColor,
      display: 'flex',
      flexDirection: 'column',
    },

    header: {

    },

    buttonGroup: {

    },

    heading: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
      color: listHeadingColor,
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

  const data = useSelector(state => state.termInfo.termInfoData)
  const error = useSelector(state => state.termInfo.error)

  const [termInfoData, setTermInfoData] = useState(data);

  const termInfoHeading = (
    <>
      <Typography
        component='span'
        sx={{
          fontWeight: 500,
          lineHeight: 1,
          fontSize: '1em',
          mr: 1,
          color: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        Term info:
      </Typography>
      {data?.Name} [{data?.Id}]
    </>
  )

  const MAX_LENGTH = 40;

  // FIXME
  useEffect( () => {
    console.log("term info data : ", data);
    setTermInfoData(data)
  },[data]);

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
      <Box sx={{
        height: {
          lg: 'calc(100% - 3.75rem)'
        },
      }} flexGrow={1}>
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
            height: {
              lg: '100%'
            },
            p: {
              lg: 2
            }
          }}>
            <Box mb={2} sx={classes.header}>
              <Grid container alignItems='center'>
                <MediaQuery minWidth={768}>
                  <Grid item xs={12} lg={7} sm={6}>
                    <Box>
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '1.25rem',
                        color: whiteColor
                      }}>
                        {termInfoHeading}
                      </Typography>
                    </Box>
                  </Grid>
                </MediaQuery>

                <Grid item xs={12} lg={5} sm={6}>
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
                        sm: 'flex-end'
                      },
                      columnGap: {
                        xs: 1,
                        md: 3
                      }
                    }}
                  >
                    <Box display='flex' gap="0.375rem">
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
                          Sections <ArrowDown style={{ marginLeft: '0.375rem' }} />
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

            <Box mx={-2} px={2} sx={{
              overflow: {
                lg: 'auto'
              },
              maxHeight: {
                lg: 'calc(100% - 4.0625rem)'
              }
            }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>General Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container columnSpacing={1.5}>
                    <Grid item xs={12} sm={4} md={5} lg={5}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '14.25rem',
                          background: {
                            xs: carouselBg,
                            lg: headerBorderColor
                          },
                          borderRadius: '0.5rem',
                        }}
                      ></Box>
                    </Grid>
                    <Grid sx={{
                      mt: {
                        xs: 2
                      }
                    }} item xs={12} sm={8} md={7} lg={7}>
                      <Box display='flex' flexDirection='column' rowGap={1}>
                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>Name</Typography>
                          <Typography sx={{
                            ...classes.heading,
                            color: whiteColor,
                            textAlign: 'right'
                          }}>{data?.Name}[{data?.Id}]</Typography>
                        </Box>

                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>Tags</Typography>
                            <Box display='flex' gap={0.5}>
                              {
                                data?.Tags?.map((tag) => <Chip key={tag} color="primary" label={tag} />) 
                              }
                            { data?.Tags?.length > 2 && <Chip label={`+${data?.Tags?.length - 2}`} /> }
                          </Box>
                        </Box>

                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>Classification</Typography>
                          <Typography sx={{
                            ...classes.heading,
                            color: whiteColor,
                            textAlign: 'right'
                          }}>Adult brain</Typography>
                        </Box>

                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>Description</Typography>
                          <Box display='flex' flexDirection='column' alignItems='flex-end'>
                            <Typography sx={{
                              ...classes.heading,
                              color: whiteColor,
                              textAlign: 'right'
                            }}>
                                {toggleReadMore ? data?.Meta?.Description : `${ data?.Meta?.Description?.substr(0, MAX_LENGTH)}...`}
                            </Typography>
                            <Button
                                onClick={() => setToggleReadMore((prev) => !prev)} disableRipple
                              sx={{
                                padding: 0,
                                marginTop: '0.25rem',
                                height: 'auto',
                                color: tabActiveColor
                              }}>
                              {toggleReadMore ? 'Show Less' : 'Read More'}
                            </Button>
                          </Box>
                        </Box>

                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>Source</Typography>
                          <Chip icon={<Link />} label='JRC2018Unisex' />
                        </Box>

                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>License</Typography>
                          <Typography sx={{
                            ...classes.heading,
                            color: whiteColor,
                            textAlign: 'right'
                          }}>CC-BY-NC-SA_4.0</Typography>
                        </Box>

                        <Box display='flex' justifyContent='space-between' columnGap={1}>
                          <Typography sx={classes.heading}>Aligned To</Typography>
                          <Chip icon={<Link />} label='JRC2018Unisex' />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
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
                      defaultParentIcon={<ArrowRight />}
                    // defaultCollapseIcon={<ArrowRight />}
                    // defaultExpandIcon={<ArrowRight />}
                      defaultEndIcon={<Line />}
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

                    <TreeItem nodeId="111" label="Main">
                      <TreeItem nodeId="2222" label="Hello" />
                      <TreeItem nodeId="3333" label="Subtree with children">
                        <TreeItem nodeId="6666" label="Hello" />
                        <TreeItem nodeId="711" label="Sub-subtree with children">
                          <TreeItem nodeId="911" label="Child 1" />
                          <TreeItem nodeId="1011" label="Child 2" />
                          <TreeItem nodeId="1111" label="Child 3" />
                        </TreeItem>
                        <TreeItem nodeId="811" label="Hello" />
                      </TreeItem>
                      <TreeItem nodeId="311" label="Subtree with children">
                        <TreeItem nodeId="611" label="Hello" />
                        <TreeItem nodeId="7111" label="Sub-subtree with children">
                          <TreeItem nodeId="9111" label="Child 1" />
                          <TreeItem nodeId="10111" label="Child 2" />
                          <TreeItem nodeId="11111" label="Child 3" />
                        </TreeItem>
                        <TreeItem nodeId="81111" label="Hello" />
                      </TreeItem>
                      <TreeItem nodeId="41111" label="World" />
                      <TreeItem nodeId="51111" label="Something something" />

                    </TreeItem>
                  </TreeView>
                </AccordionDetails>
              </Accordion>
            </Box>
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