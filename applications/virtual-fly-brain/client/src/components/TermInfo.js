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
import { getInstanceByID, selectInstance, hide3DMesh, hide3D, show3D, show3DMesh, removeInstanceByID,
  changeColor, focusInstance, show3DSkeleton, hide3DSkeleton, show3DSkeletonLines, show3DSkeletonCylinders } from './../reducers/actions/instances';
import Ribbon from '@flybase/react-ontology-ribbon';
import { ChromePicker } from 'react-color';
import Link from '@mui/material/Link';
import useClickOutside from "./useClickOutside";
import { SKELETON, CYLINDERS , NEURON , RGBAToHexA} from "./../utils/constants"
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

  let terms = query?.preview_results?.rows?.map( row => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...row.Neurotransmitter.matchAll(regExp)].flat();
    return { id: row.Neurotransmitter,
      name: <Link underline="none" href="#">{row.Neurotransmitter}</Link>,
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
      width : "2rem",
      background: {
        xs: primaryBg,
        lg: secondaryBg
      }
    },
    width : "100%",
    justifyContent : "end"
  }
}

const TermInfo = ({ open, setOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [value, setValue] = useState(0);
  const [ displayColorPicker, setDisplayColorPicker ] = useState(false);
  const [expanded, setExpanded] = useState({ "General Information" : false, "Queries" : false, "Graphs" : false});
  const [sections, setSections] = useState(["General Information", "Queries", "Graphs"])
  const data = useSelector(state => state.instances.focusedInstance)
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
    hide3DMesh(termInfoData?.metadata?.Id)
    removeInstanceByID(termInfoData?.metadata?.Id)
  }

  const addId = (id) => {
    getInstanceByID(id);
  }

  const handleVisibility = () => {
    if ( allLoadedInstances.find( instance => instance.metadata?.Id == termInfoData?.metadata?.Id )?.visible ) {
      hide3D(termInfoData?.metadata?.Id)
    } else {
      show3D(termInfoData?.metadata?.Id)
    }
  }

  const handleMeshVisibility = () => {
    if ( allLoadedInstances.find( instance => instance.metadata?.Id == termInfoData?.metadata?.Id )?.simpleInstance?.visibility ) {
      hide3DMesh(termInfoData?.metadata?.Id)
    } else {
      show3DMesh(termInfoData?.metadata?.Id)
    }
  }

  const handleFocus = (event) => {
    focusInstance(termInfoData?.Id)
  }

  const handleSelection = (event) => {
    selectInstance(termInfoData?.metadata?.Id)
  }

  const handleSkeleton = (event) => {
    if ( !allLoadedInstances.find( instance => instance.metadata?.Id == termInfoData?.metadata?.Id )?.skeleton?.skeleton?.visible ) {
      show3DSkeleton(termInfoData?.metadata?.Id)
    } else {
      hide3DSkeleton(termInfoData?.metadata?.Id)
    }
  }

  const handleCylinder = (event) => {
    if ( !allLoadedInstances.find( instance => instance.metadata?.Id == termInfoData?.metadata?.Id )?.skeleton?.sphere?.visible ) {
      show3DSkeletonCylinders(termInfoData?.metadata?.Id)
    } else {
      show3DSkeletonLines(termInfoData?.metadata?.Id)
    }
  }

  const handleTermClick = (term, evt) => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...term.id.matchAll(regExp)].flat();
    getInstanceByID(matches[1]);
  }

  const customColorCalculation = ({numTerms, baseRGB, heatLevels, itemData }) => {
    let red = baseRGB[0] * itemData.descendant_terms[0];
    let green = (baseRGB[1] )* (1 - (itemData.descendant_terms[0]/100));

    return[red, green, baseRGB[2]];
  }

  const getQueriesLength = (queries) => {
    let queriesCount = 0;
    queries?.forEach( query => {
      if ( query?.preview_results?.rows?.length > 0 ) {
        queriesCount = queriesCount + 1;
      }
    });

    return queriesCount;
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
      {termInfoData?.metadata?.Name} [{termInfoData?.metadata?.Id}]
    </>
  )

  // FIXME
  useEffect(() => {
    if (  allLoadedInstances?.find( instance => instance.metadata?.Id == data?.metadata?.Id ) ) {
      setTermInfoData(data)
    }
  }, [data]);

  useEffect(() => {
    if (  allLoadedInstances?.find( instance => instance.metadata?.Id == data?.metadata?.Id ) ) {
      setTermInfoData(data)
    }
  }, [allLoadedInstances])

  const getInstance = () => {
    let instance = allLoadedInstances.find( instance => instance.metadata?.Id == termInfoData?.metadata?.Id );
    return instance;
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
          lg: 'none !important'
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

                    <Box sx={{ width : '100%'}}>
                      <ButtonGroup ref={popover} color="secondary" sx={classes.buttonGroup} variant="contained">
                        <>
                          <Tooltip title={"Edit 3D Canvas Color"}>
                            <Button
                            sx={{ width: 75 }} 
                            onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                            <RectangleIcon sx={{color : RGBAToHexA( getInstance()?.simpleInstance?.color)}}/><ArrowDown/>
                          </Button>
                          </Tooltip>
                          { displayColorPicker ?
                          <ChromePicker
                            color={getInstance()?.simpleInstance?.color}
                            onChangeComplete={ (color, event) => {
                              let rgb;
                              if ( color.source === "hsv" ){
                                rgb = { r:color.rgb.r/255, g:color.rgb.g/255, b:color.rgb.b/255, a:color.rgb.a }
                                changeColor(termInfoData?.metadata?.Id, rgb)
                                setDisplayColorPicker(false)
                              } else if ( color.source === "hsl" ) {
                                rgb = color.rgb;
                                changeColor(termInfoData?.metadata?.Id, rgb)
                              }                              
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
                        <Tooltip title={getInstance()?.simpleInstance?.visibility ? "Hide 3D Mesh" : "Show 3D Mesh"}>
                          <Button  onClick={(event) => handleMeshVisibility()}>
                          { getInstance()?.simpleInstance?.visibility ? <ArViewOff /> : <ArView /> }                          </Button>
                        </Tooltip>
                        { termInfoData?.metadata?.SuperTypes?.find( s => s === NEURON) ?
                        <Tooltip title={getInstance()?.skeleton?.[SKELETON]?.visible ? "Disable 3D Skeleton" : "Enable 3D Skeleton"}>
                          <Button onClick={(event) => handleSkeleton(event)}>
                            {getInstance()?.skeleton?.[SKELETON]?.visible ? <SkeletonOff /> : <SkeletonOn /> }
                          </Button>
                        </Tooltip>
                        :
                        null}
                        { termInfoData?.metadata?.SuperTypes?.find( s => s === NEURON) ?
                        <Tooltip title={getInstance()?.skeleton?.[CYLINDERS]?.visible ? "Show 3D Lines Skeleton" : "Show 3D Cylinder Skeleton"}>
                          <Button onClick={(event) => handleCylinder(event)}>
                          {getInstance()?.skeleton?.[CYLINDERS]?.visible ? <CylinderOff id={SKELETON} /> : <CylinderOn id={CYLINDERS}/> }
                          </Button>
                        </Tooltip>
                        :
                        null}
                        { termInfoData?.metadata?.IsTemplate != undefined ?
                        <Tooltip title={"Delete From Term Info"}>
                          <Button disabled={termInfoData?.metadata?.IsTemplate} onClick={() => deleteId()}>
                            <Delete />
                          </Button>
                        </Tooltip>
                        :
                        null}
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
                  <Typography>Queries ({getQueriesLength(termInfoData?.metadata?.Queries)}) </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TreeView
                    aria-label="customized"
                    defaultParentIcon={<ArrowRight />}
                    defaultEndIcon={<Line />}
                  >
                    { getQueriesLength(termInfoData?.metadata?.Queries) > 0 ? <TreeItem nodeId="1" label={
                      <CustomBox display='flex' flexWrap='wrap'>
                        <Typography>Types of neurons with...</Typography>
                        <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                          <Typography sx={{ pr: 0.5 }}>{termInfoData?.metadata?.Queries?.reduce((n, {preview_results}) => n + preview_results?.rows?.length, 0)}</Typography>
                          <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                        </Box>
                      </CustomBox>
                    }> 
                    { termInfoData?.metadata?.Queries?.map( query => (
                         query.output_format === "table" && query?.preview_results?.rows?.length > 0 ?
                        (
                          <TreeItem key={query.label} nodeId={query.label} label={
                            <CustomBox display='flex' flexWrap='wrap'>
                              <Typography>{query.label}</Typography>
                              <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                                <Typography sx={{ pr: 0.5 }}>{query?.preview_results?.rows?.length}</Typography>
                                <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                              </Box>
                            </CustomBox>
                          }>
                          <TreeItem label={
                                <>
                                <TableContainer component={Paper}>
                                <Table stickyHeader aria-label="simple table">
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
                                          { allLoadedInstances?.find( instance => instance.metadata?.Id === row.id) ?
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
                         ( query?.preview_results?.rows?.length > 0  ? <TreeItem key={query.label} nodeId={query.label} label={
                            <CustomBox display='flex' flexWrap='wrap'>
                              <Typography>{query.label}</Typography>
                              <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                                <Typography sx={{ pr: 0.5 }}>{query?.preview_results?.rows?.length}</Typography>
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
                          </TreeItem> : null)
                    ))
                  }
                    </TreeItem> : null }
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