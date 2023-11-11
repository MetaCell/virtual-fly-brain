import { Box, Button,Tooltip, ButtonGroup, Grid, IconButton, Menu, MenuItem, 
  Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow,
   Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles';
import MediaQuery from 'react-responsive';
import { ArView, Target, CylinderOn, CylinderOff, ArrowDown, ArrowRight, ChevronDown,
   ChevronLeft, ChevronRight, Delete, Expand, Eye, Focus,Line, Remove,
    ScatterPlot, SkeletonOn, SelectOff, SkeletonOff, EyeOff, ArViewOff } from "../icons";
import PropTypes from 'prop-types';
import vars from "../theme/variables";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from "@mui/lab";
import ListAltIcon from '@mui/icons-material/ListAlt';
import RectangleIcon from '@mui/icons-material/Rectangle';
import GeneralInformation from "./TermInfo/GeneralInformation";
import { getInstanceByID, selectInstance, hide3DMesh, show3DMesh, 
  changeColor, focusInstance, show3DSkeleton, hide3DSkeleton, show3DSkeletonLines, show3DSkeletonCylinders } from './../reducers/actions/instances';
import { termInfoById } from "./../reducers/actions/termInfo";
import Ribbon from '@flybase/react-ontology-ribbon';
import { ChromePicker } from 'react-color';
import Link from '@mui/material/Link';
import useClickOutside from "./useClickOutside";
import { SKELETON, CYLINDERS } from "./../utils/constants"
import '@flybase/react-ontology-ribbon/dist/style.css';

const NEURON = "Neuron";

const {
  whiteColor,
  secondaryBg,
  outlinedBtnTextColor,
  blackColor,
  listHeadingColor,
  headerBorderColor,
  primaryBg
} = vars;

const RGBAToHexA = (color) => {
  let r =  color?.r?.toString(16);
  let g =  color?.g?.toString(16);
  let b =  color?.b?.toString(16);
  let a = Math.round(color?.a * 255).toString(16);

  if (r?.length == 1)
    r = "0" + r;
  if (g?.length == 1)
    g = "0" + g;
  if (b?.length == 1)
    b = "0" + b;
  if (a?.length == 1)
    a = "0" + a;

  return "#" + r + g + b + a;
}

const getRibbonData = (query) => {
  
  let terms = query?.preview_results?.rows?.map( row => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...row.Neurotransmitter.matchAll(regExp)].flat();
    return { id: row.Neurotransmitter,
      name: <Link underline="none" href={window.location.origin + "/?id=" + matches[0]}>{row.Neurotransmitter}</Link>,
      descendant_terms: [row.Weight]
    }
});
  return terms; 
}

const ribbonTitle = (data) => {
  return data.id + "\n" + "Weight : " + data.descendant_terms[0]
}

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
const ribbonConfiguration = require("../components/configuration/TermInfo/TermInfo").ribbonConfiguration;

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

const TermInfo = ({ open, setOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [value, setValue] = useState(0);
  const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
  const [expanded, setExpanded] = useState({ "General Information" : false, "Queries" : false, "Graphs" : false});
  const [sections, setSections] = useState(["General Information", "Queries", "Graphs"])
  const data = useSelector(state => state.termInfo.termInfoData)
  const error = useSelector(state => state.termInfo.error)
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances)
  const [termInfoData, setTermInfoData] = useState(data);

  const popover = React.useRef();

  const close = React.useCallback(() => setDisplayColorPicker(false), []);
  useClickOutside(popover, close);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDisplayColorPicker(false)
  };

  const handleSection = (event) => {
    handleClose();
    let newState = expanded;
    setExpanded({ ...newState, [event] : !newState[event] })
  }

  const handleExpandAll = (expanded) => {
    let newState = {};
    sections?.forEach( section => {
      newState[section] = expanded
    })
    setExpanded(newState)
  }

  const deleteId = (id) => {
    setTermInfoData(null)
  }

  const addId = (id) => {
    getInstanceByID(id);
  }

  const handleVisibility = () => {
    if ( allLoadedInstances.find( instance => instance.Id == termInfoData.Id )?.visible ) {
      hide3DMesh(termInfoData.Id)
    } else {
      show3DMesh(termInfoData.Id)
    }
  }

  const handleMeshVisibility = () => {
    if ( allLoadedInstances.find( instance => instance.Id == termInfoData.Id )?.visible ) {
      hide3DMesh(termInfoData.Id)
    } else {
      show3DMesh(termInfoData.Id)
    }
  }

  const handleFocus = (event) => {
    focusInstance(termInfoData.Id)
  }

  const handleSelection = (event) => {
    selectInstance(termInfoData.Id)
  }

  const handleSkeleton = (event) => {
    if ( !allLoadedInstances.find( instance => instance.Id == termInfoData.Id )?.skeleton?.visible ) {
      show3DSkeleton(termInfoData.Id)
    } else {
      hide3DSkeleton(termInfoData.Id)
    }
  }

  const handleCylinder = (event) => {
    if ( allLoadedInstances.find( instance => instance.Id == termInfoData.Id )?.skeleton?.skeleton?.visible ) {
      show3DSkeletonCylinders(termInfoData.Id)
    } else {
      show3DSkeletonLines(termInfoData.Id)
    }
  }

  const handleTermClick = (term, evt) => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...term.id.matchAll(regExp)].flat();
    termInfoById(matches[0]);
  }

  const customColorCalculation = ({numTerms, baseRGB, heatLevels, itemData }) => {
    let red = baseRGB[0] * itemData.descendant_terms[0];
    let green = (baseRGB[1] )* (1 - (itemData.descendant_terms[0]/100));

    return[red, green, baseRGB[2]];
  }

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
      {termInfoData?.Name} [{termInfoData?.Id}]
    </>
  )

  // FIXME
  useEffect(() => {
    setTermInfoData(data)
  }, [data]);

  useEffect(() => {
    setTermInfoData(data)
  }, [allLoadedInstances])
  

  const getInstance = () => {
    return allLoadedInstances.find( instance => instance.Id == termInfoData?.Id );
  }
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
                          {sections?.map( section =>
                            <MenuItem id={section} key={section} onClick={(event) => handleSection(event.target.id)}>{section}</MenuItem>
                          )}
                        </Menu>
                      </Box>
                      <ButtonGroup color="secondary" sx={classes.buttonGroup} variant="contained">
                      <Tooltip title={"Expand all sections"}>
                        <Button onClick={()=> handleExpandAll(true)}>
                          <Expand />
                        </Button>
                      </Tooltip>
                      <Tooltip title={"Collapse all sections"}>
                        <Button onClick={()=> handleExpandAll(false)}>
                          <Remove/>
                        </Button>
                      </Tooltip>
                      </ButtonGroup>
                    </Box>

                    <Box>
                      <ButtonGroup ref={popover} color="secondary" sx={classes.buttonGroup} variant="contained">
                        <>
                          <Tooltip title={"Edit 3D Canvas Color"}>
                            <Button style={{ width: 75 }} onClick={() => setDisplayColorPicker(!displayColorPicker)}><RectangleIcon sx={{color : RGBAToHexA( getInstance()?.color)}}/>Edit<ArrowDown/></Button>
                          </Tooltip>
                          { displayColorPicker ?
                          <ChromePicker
                            color={termInfoData?.color}
                            onChangeComplete={ (color, event) => {
                              changeColor(termInfoData.Id, color.rgb)
                              termInfoData.color = color.rgb
                              setDisplayColorPicker(true)
                            }}
                            style={{ zIndex: 10 }}/>
                            : null
                          }
                        </>
                        <Tooltip title={ getInstance()?.visible ? "Hide" : "Show"}>
                          <Button onClick={() => handleVisibility()}>
                            {  getInstance()?.visible ? <EyeOff /> : <Eye /> }
                          </Button>
                        </Tooltip>
                        <Tooltip title={ getInstance()?.selected ? "Deselect" : "Select"}>
                          <Button onClick={(event) => handleSelection(event)}>
                            { getInstance()?.selected ? <SelectOff /> : <Focus /> }
                          </Button>
                        </Tooltip>
                        <Tooltip title={"Focus on 3D Mesh"}>
                          <Button onClick={(event) => handleFocus(event, true)}>
                            <Target />
                          </Button>
                        </Tooltip>
                        <Tooltip title={getInstance()?.visible ? "Hide 3D Mesh" : "Show 3D Mesh"}>
                          <Button onClick={(event) => handleMeshVisibility()}>
                          { getInstance()?.visible ? <ArViewOff /> : <ArView /> }                          </Button>
                        </Tooltip>
                        { termInfoData?.SuperTypes?.find( s => s === NEURON) ?
                        <Tooltip title={getInstance()?.skeleton?.visible ? "Disable 3D Skeleton" : "Enable 3D Skeleton"}>
                          <Button onClick={(event) => handleSkeleton(event)}>
                            {getInstance()?.skeleton?.visible ? <SkeletonOff /> : <SkeletonOn /> }
                          </Button>
                        </Tooltip>
                        :
                        null}
                        { termInfoData?.SuperTypes?.find( s => s === NEURON) ?
                        <Tooltip title={getInstance()?.skeleton?.[SKELETON]?.visible ? "Show 3D Cylinder Skeleton" : "Show 3D Lines Skeleton"}>
                          <Button onClick={(event) => handleCylinder(event)}>
                          {getInstance()?.skeleton?.[SKELETON]?.visible ? <CylinderOn id={CYLINDERS}/> : <CylinderOff id={SKELETON} /> }
                          </Button>
                        </Tooltip>
                        :
                        null}
                        <Tooltip title={"Delete From Term Info"}>
                          <Button onClick={() => deleteId()}>
                            <Delete />
                          </Button>
                        </Tooltip>
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
              <Accordion expanded={expanded[sections[0]]} onChange={() =>handleSection(sections[0])}>
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

              <Accordion expanded={expanded[sections[1]]} onChange={() =>handleSection(sections[1])}>
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
                          <TreeItem key={query.label} nodeId={query.label} label={
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
                         (<TreeItem key={query.label} nodeId={query.label} label={
                            <CustomBox display='flex' flexWrap='wrap'>
                              <Typography>{query.label}</Typography>
                              <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                                <Typography sx={{ pr: 0.5 }}>{query.count}</Typography>
                                <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                              </Box>
                            </CustomBox>
                          }>
                            
                          <Box display='flex' justifyContent="start">
                            <Ribbon
                              onTermClick={handleTermClick}
                              data={getRibbonData(query)}
                              itemTitle={ribbonTitle}
                              calcHeatColor={customColorCalculation}
                              baseRGB={ribbonConfiguration.rgbColor}
                              heatLevels={ribbonConfiguration.heatLevels}
                            />
                          </Box>
                          </TreeItem>)
                    ))
                  }
                    </TreeItem>
                  </TreeView>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded[sections[2]]} onChange={() =>handleSection(sections[2])}>
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