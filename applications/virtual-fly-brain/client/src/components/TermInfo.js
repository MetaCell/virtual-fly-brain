import { Box, Button, ButtonGroup, Grid, IconButton, Menu, MenuItem, Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles';
import MediaQuery from 'react-responsive';
import { ArView, ArrowDown, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Delete, Expand, Eye, Focus, Line, Remove, ScatterPlot } from "../icons";
import PropTypes from 'prop-types';
import vars from "../theme/variables";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from "@mui/lab";
import ListAltIcon from '@mui/icons-material/ListAlt';
import GeneralInformation from "./TermInfo/GeneralInformation";
import { getInstanceByID, removeInstanceByID } from './../reducers/actions/instances';
import { termInfoById } from "./../reducers/actions/termInfo";
import Ribbon from '@flybase/react-ontology-ribbon';
import '@flybase/react-ontology-ribbon/dist/style.css';

const {
  whiteColor,
  secondaryBg,
  outlinedBtnTextColor,
  blackColor,
  listHeadingColor,
  headerBorderColor,
  primaryBg
} = vars;

const getRibbonData = (query) => {
  let terms = query?.preview_results?.rows?.map( row => (
    { id: row.Neurotransmitter,
      name: row.Neurotransmitter,
      descendant_terms: [row.Weight]
    }
  ));
  console.log("Terms ", terms)
  return terms; 
}

const CustomTableContainer = styled(TableContainer)(
  ({ theme }) => `
  position: relative;
  min-width: 35rem;
  max-width: 43rem;
  border-radius: 0.5rem;
  box-shadow: 0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10);
  &:after {
    content: '';
    position: absolute;
    top: 0;
    z-index: 999;
    display: block;
    height: 100%;
    width: 100%;
    pointer-events: none;
    background: linear-gradient(270deg, #222 0%, rgba(34, 34, 34, 0.00) 26.7%);
  }
`,
);

const CustomBox = styled(Box)(
  ({ theme }) => `
  position: relative;
  &:after {
    content: '';
    position: absolute;
    right: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
    background: linear-gradient(270deg, #1A1A1A 0%, rgba(26, 26, 26, 0.00) 26.7%);
  }
  `
)

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      mt={1}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <>
          {children}
        </>
      )}
    </Box>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TermInfo = ({ open, setOpen }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [value, setValue] = React.useState(0);

  const data = useSelector(state => state.termInfo.termInfoData)
  const error = useSelector(state => state.termInfo.error)
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteId = (id) => {
    removeInstanceByID(id)
  }
  const addId = (id) => {
    getInstanceByID(id);
  }

  const handleTermClick = (term, evt) => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...term.id.matchAll(regExp)].flat();
    termInfoById(matches[0]);
  }

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
      top: 0,
      background: {
        xs: headerBorderColor,
        md: 'transparent'
      },
      borderBottom: {
        lg: '0.0625rem solid #3A3A3A'
      },
      zIndex: 9,
      position: {
        xs: 'sticky',
        md: 'static',
      },
      mx: {
        xs: -1.5,
        md: 0
      },
      px: {
        xs: 1.5,
        md: 0
      }
    },

    heading: {
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: '1.125rem',
      color: listHeadingColor
    },

    footer: {
      height: '3.75rem',
      background: '#1A1A1A',
      borderTop: `0.0625rem solid ${secondaryBg}`,
      zIndex: 9,
      '& p': {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1,
        color: outlinedBtnTextColor,
      }
    },

    buttonGroup: {
      '& .MuiButton-root': {
        height: '1.875rem',
        background: {
          xs: primaryBg,
          lg: secondaryBg
        }
      }
    }
  }

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
          color: outlinedBtnTextColor
        }}
      >
        Term info:
      </Typography>
      {data?.Name} [{data?.Id}]
    </>
  )

  function createData(
    name,
    calories,
    fat,
    carbs,
    protein,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  // FIXME
  useEffect(() => {
    setTermInfoData(data)
  }, [data]);

  useEffect(() => {
    setTermInfoData(data)
  }, [allLoadedInstances])

  return (
    <Box
      sx={{
        ...classes.root,
        width: {
          xs: '100%',
          lg: open ? '34rem' : '2.75rem'
        },
        flex: {
          lg: open ? 1 : 'none !important'
        },
        p: {
          xs: 1.5,
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
        width: '100%',
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
            <Box sx={{ ...classes.header, pb: { xs: 1.5, lg: 2 } }}>
              <Grid container alignItems='flex-start'>
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
                        sm: 3
                      }
                    }}
                  >
                    <Box display='flex' sx={{
                      gap: {
                        xs: 0.5,
                        sm: 1.125,
                      }
                    }}>
                      <Box>
                        <Button
                          sx={{
                            height: '1.875rem',
                            fontSize: '0.75rem',
                            color: outlinedBtnTextColor,
                            background: {
                              xs: primaryBg,
                              lg: secondaryBg
                            }
                          }}
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

            <Box mx={-1.5} px={1.5} sx={{
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
                  <GeneralInformation data={termInfoData} classes={classes} />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Queries ({termInfoData?.Queries?.length}) </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TreeView
                    aria-label="customized"
                    defaultParentIcon={<ArrowRight />}
                    defaultEndIcon={<Line />}
                  >
                    <TreeItem nodeId="1" label={
                      <CustomBox display='flex' flexWrap='wrap'>
                        <Typography>Types of neurons with...</Typography>
                        <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                          <Typography sx={{ pr: 0.5 }}>{termInfoData?.Queries?.reduce((n, {count}) => n + count, 0)}</Typography>
                          <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                        </Box>
                      </CustomBox>
                    }>
                    { termInfoData?.Queries?.map( query => (
                         query.output_format === "table"?
                        (
                          <TreeItem nodeId={query.label} label={
                            <CustomBox display='flex' flexWrap='wrap'>
                              <Typography>{query.label}</Typography>
                              <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                                <Typography sx={{ pr: 0.5 }}>{query.count}</Typography>
                                <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                              </Box>
                            </CustomBox>
                          }>
                          <TreeItem label={
                                <>
                                <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Name</TableCell>
                                      <TableCell>Description</TableCell>
                                      <TableCell>Score</TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                  { query?.preview_results?.rows.map( row => (
                                      <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      >
                                        <TableCell>
                                          <Button
                                            disableRipple
                                            variant="text"
                                            color="info"
                                            sx={{
                                              padding: 0,
                                              minWidth: '0.0625rem',
                                              textAlign: 'left',
                                              display: 'inline-block',

                                              '&:hover': {
                                                backgroundColor: 'transparent'
                                              },

                                              '&:not(:hover)': {
                                                color: 'rgba(255, 255, 255, 0.8)'
                                              }
                                            }}
                                          >
                                            {row.id}
                                          </Button>
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.score}</TableCell>
                                        <TableCell>
                                          { allLoadedInstances?.find( instance => instance.Id === row.id) ?
                                            <Button variant="text" onClick={() => deleteId(row.id)} color="error">Delete</Button>
                                            :
                                            <Button variant="text" onClick={() => addId(row.id)} color="success">Add</Button>
                                          }
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                                </TableContainer>
                                </>
                         } /></TreeItem>) 
                         : 
                         (<TreeItem nodeId={query.label} label={
                            <CustomBox display='flex' flexWrap='wrap'>
                              <Typography>{query.label}</Typography>
                              <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                                <Typography sx={{ pr: 0.5 }}>{query.count}</Typography>
                                <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                              </Box>
                            </CustomBox>
                          }>
                            <Ribbon onTermClick={handleTermClick} data={getRibbonData(query)} />
                          </TreeItem>)
                    ))
                  }
                    </TreeItem>
                  </TreeView>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel2a-header"
                >
                  <Typography>Graphs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    display='flex'
                    flexDirection='column'
                    rowGap={1}
                  >
                    <Box
                      display='flex'
                      alignItems="center"
                    >
                      <Typography sx={{
                        flexGrow: 1, color: outlinedBtnTextColor,
                        fontSize: {
                          xs: '0.875rem',
                          lg: '1rem'
                        }
                      }}>
                        Show location of JRC2018Unisex
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <ScatterPlot />
                      </IconButton>
                    </Box>

                    <Box
                      display='flex'
                      alignItems="center"
                    >
                      <Typography
                        sx={{
                          flexGrow: 1, color: outlinedBtnTextColor,
                          fontSize: {
                            xs: '0.875rem',
                            lg: '1rem'
                          }
                        }}>
                        Show location of JRC2018Unisex
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <ScatterPlot />
                      </IconButton>
                    </Box>
                  </Box>
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
          justifyContent={open ? 'flex-end' : 'center'}
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

export default TermInfo;