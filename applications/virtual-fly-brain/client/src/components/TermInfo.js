import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { styled } from '@mui/material/styles';
import {
  Box, Button, Tooltip, ButtonGroup, Grid, IconButton, Menu, MenuItem, Link,
  Table, TableBody, TableCell, Paper, TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import MediaQuery from 'react-responsive';
import {
  ArView, Target, CylinderOn, CylinderOff, ArrowDown, ArrowRight, ChevronDown,
  ChevronLeft, ChevronRight, Delete, Expand, Eye, Focus, Remove,
  ScatterPlot, SkeletonOn, SelectOff, SkeletonOff, EyeOff, ArViewOff
} from "../icons";
import vars from "../theme/variables";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from "@mui/lab";
import ListAltIcon from '@mui/icons-material/ListAlt';
import GeneralInformation from "./TermInfo/GeneralInformation";
import { getQueries, updateQueries } from './../reducers/actions/queries';
import { setQueryComponentOpened } from './../reducers/actions/globals';
import {
  getInstanceByID, selectInstance, hide3DMesh, hide3D, show3D, show3DMesh, removeInstanceByID,
  changeColor, show3DSkeleton, hide3DSkeleton, show3DSkeletonLines, show3DSkeletonCylinders, zoomToInstance
} from './../reducers/actions/instances';
import { updateGraphSelection } from './../reducers/actions/graph';
import { showComponent } from './../reducers/actions/layout';
import Ribbon from '@flybase/react-ontology-ribbon';
import { ChromePicker } from 'react-color';
import { stylingConfiguration } from './configuration/VFBGraph/graphConfiguration';
import { widgets } from "./layout/widgets";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import useClickOutside from "./useClickOutside";
import { SKELETON, CYLINDERS, NEURON, RGBAToHexA } from "./../utils/constants"
import '@flybase/react-ontology-ribbon/dist/style.css';


const {
  whiteColor,
  secondaryBg,
  outlinedBtnTextColor,
  blackColor,
  listHeadingColor,
  headerBorderColor,
  tabActiveColor,
  primaryBg
} = vars;

const getRibbonData = (query) => {

  let terms = query?.preview_results?.rows?.map(row => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...row.Neurotransmitter.matchAll(regExp)].flat();
    return {
      id: row.Neurotransmitter,
      name: <Link underline="none" href="#">{row.Neurotransmitter}</Link>,
      descendant_terms: [row.Weight]
    }
  });
  return terms;
}

const ribbonTitle = (data) => {
  return data.id + "\n" + "Weight : " + data.descendant_terms[0]
}

const CustomBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    right: 0,
    zIndex: 999,
    width: '100%',
    height: '100%',
    display: 'block',
    pointerEvents: 'none',
    background: 'linear-gradient(270deg, #1A1A1A 0%, rgba(26, 26, 26, 0.00) 26.7%)',
  },
  [theme.breakpoints.down('md')]: {
    '&:after': {
      background: 'none',
    },
  },
  [theme.breakpoints.down('lg')]: {
    '&:after': {
      background: 'none',
    },
  }
}));

const TableContainerBoxWrapper = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  '&:before': {
    position: 'absolute',
    content: '""',
    top: 0,
    right: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(270deg, #222 0%, rgba(34, 34, 34, 0.00) 26.7%)',
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  [theme.breakpoints.down('md')]: {
    '&:before': {
      background: 'none',
    },
  },
  [theme.breakpoints.down('lg')]: {
    '&:before': {
      background: 'none',
    },
  },
}))

const ribbonConfiguration = require("../components/configuration/TermInfo/TermInfo").ribbonConfiguration;
const configuration = require("../components/configuration/TermInfo/configuration.json");
const classes = {
  root: {
    // transition: 'all ease-in-out .3s',
    height: '100%',
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
      width: "2rem",
      background: {
        xs: primaryBg,
        lg: secondaryBg
      }
    }
  },

  rectangleIconStyle: {
    width: '20px',
    height: '20px',
    borderRadius: '2px',
    border: '0.829px solid #3A3A3A',
    boxShadow: '0px 4.973px 6.631px 0px rgba(0, 0, 0, 0.40) inset, 0px 0px 3.315px 0.829px rgba(0, 0, 0, 0.60) inset'
  }
}

const TermInfo = ({ open, setOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [expanded, setExpanded] = useState({ "General Information": configuration.sectionsExpanded, "Queries": configuration.sectionsExpanded, "Graphs": configuration.sectionsExpanded });
  const [sections, setSections] = useState(["General Information", "Queries", "Graphs"])
  const data = useSelector(state => state.instances.focusedInstance)
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances)
  const queries = useSelector(state => state.queries.queries)
  const queryComponentOpened = useSelector(state => state.globalInfo.queryComponentOpened)

  const [termInfoData, setTermInfoData] = useState(data);
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const dispatch = useDispatch();

  const popover = React.useRef();

  const close = React.useCallback(() => setDisplayColorPicker(false), []);
  useClickOutside(popover, close);

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
    setExpanded({ ...newState, [event]: !newState[event] })
  }

  const handleExpandAll = (expanded) => {
    let newState = {};
    sections?.forEach(section => {
      newState[section] = expanded
    })
    setExpanded(newState)
  }

  const deleteId = (id) => {
    hide3DMesh(termInfoData?.metadata?.Id)
    removeInstanceByID(termInfoData?.metadata?.Id)
  }

  const addId = (id) => {
    getInstanceByID(id, false);
  }

  const handleVisibility = () => {
    if (allLoadedInstances.find(instance => instance.metadata?.Id == termInfoData?.metadata?.Id)?.visible) {
      hide3D(termInfoData?.metadata?.Id)
    } else {
      show3D(termInfoData?.metadata?.Id)
    }
  }

  const handleMeshVisibility = () => {
    if (allLoadedInstances.find(instance => instance.metadata?.Id == termInfoData?.metadata?.Id)?.visibleMesh) {
      hide3DMesh(termInfoData?.metadata?.Id)
    } else {
      show3DMesh(termInfoData?.metadata?.Id)
    }
  }

  const handleFocus = (event) => {
    zoomToInstance(termInfoData?.metadata?.Id)
  }

  const handleSelection = (event) => {
    selectInstance(termInfoData?.metadata?.Id)
  }

  const handleSkeleton = (event) => {
    if (!allLoadedInstances.find(instance => instance.metadata?.Id == termInfoData?.metadata?.Id)?.skeleton?.skeleton?.visible) {
      show3DSkeleton(termInfoData?.metadata?.Id)
    } else {
      hide3DSkeleton(termInfoData?.metadata?.Id)
    }
  }

  const handleCylinder = (event) => {
    if (!allLoadedInstances.find(instance => instance.metadata?.Id == termInfoData?.metadata?.Id)?.skeleton?.sphere?.visible) {
      show3DSkeletonCylinders(termInfoData?.metadata?.Id)
    } else {
      show3DSkeletonLines(termInfoData?.metadata?.Id)
    }
  }

  const handleTermClick = (term, evt) => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...term.id.matchAll(regExp)].flat();
    getInstanceByID(matches[1], false);
  }

  const customColorCalculation = ({ numTerms, baseRGB, heatLevels, itemData }) => {
    let red = baseRGB[0] * itemData.descendant_terms[0];
    let green = (baseRGB[1]) * (1 - (itemData.descendant_terms[0] / 100));

    return [red, green, baseRGB[2]];
  }

  const getQueriesLength = (queries) => {
    let queriesCount = 0;
    queries?.forEach(query => {
      if (query?.count) {
        queriesCount = query.count + 1;
      }
    });

    return queriesCount;
  }

  const openQuery = (id, type) => {
    let updatedQueries = [...queries];
    updatedQueries?.forEach(query => {
      if (query.queries) {
        Object.keys(query.queries)?.forEach(q => query.queries[q].active = false);
      }
    });
    dispatch(setQueryComponentOpened(true));
    updateQueries(updatedQueries);
    getQueries(id, type)
  }

  React.useEffect( () => {
    setToggleReadMore(queryComponentOpened)
  }, [queryComponentOpened])

  const setToggleMore = (prev, id, type) => {
    if (!toggleReadMore) {
      openQuery(id, type)
      setToggleReadMore(prev)
    } else {
      setToggleReadMore(prev)
      dispatch(setQueryComponentOpened(false));
    }
  }

  const handleGraphSelection = (id, selection) => {
    dispatch(showComponent(widgets.termContextWidget.id, { status: WidgetStatus.ACTIVE }))
    updateGraphSelection({ data: { instance: data, selection: selection } })
  }

  const termInfoHeading = (
    <>
      <Typography
        component='span'
        sx={{
          fontWeight: 500,
          lineHeight: 1,
          fontSize: '1.25rem',
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
    if (allLoadedInstances?.find(instance => instance.metadata?.Id == data?.metadata?.Id)) {
      setTermInfoData(data)
    }
  }, [data]);

  useEffect(() => {
    if (allLoadedInstances?.find(instance => instance.metadata?.Id == data?.metadata?.Id)) {
      setTermInfoData(data)
    }
  }, [allLoadedInstances])

  const getInstance = () => {
    let instance = allLoadedInstances.find(instance => instance.metadata?.Id == termInfoData?.metadata?.Id);
    return instance;
  }

  return (
    <Box
      sx={{
        ...classes.root,
        width: {
          xs: '100%',
          lg: open ? '34.438rem' : '2.75rem'
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
        },
      }}
    >
      <Box sx={{ width: '100%', height: { lg: 'calc(100% - 3.75rem)' }}} flexGrow={1}>
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
          }}>{termInfoHeading}</Typography>
        ) : (
          <Box sx={{ height: {lg: '100%'}, p: {lg: 2} }}>
            <Box sx={{ ...classes.header, pb: {xs: 1.5, lg: 2} }}>
              <Grid container alignItems='flex-start' sx={{ justifyContent: {lg: "space-between", xs: "flex-end"} }}>
                <MediaQuery minWidth={768}>
                  <Grid item xs={12} lg={4.5} sm={6}>
                    <Box>
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '1.25rem',
                        color: whiteColor,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center'
                      }}>
                        {termInfoHeading}
                      </Typography>
                    </Box>
                  </Grid>
                </MediaQuery>

                <Grid item xs={12} lg={7.5} sm={6}>
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
                            },
                            '& .MuiButton-endIcon': {
                              width: '1rem',
                              height: '1rem',
                              marginLeft: '0.25rem'
                            }
                          }}
                          variant="contained"
                          color="secondary"
                          id="basic-button"
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClick}
                          endIcon={<ArrowDown />}
                        >
                          Sections
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
                          {sections?.map(section =>
                            <MenuItem id={section} key={section} onClick={(event) => handleSection(event.target.id)}>{section}</MenuItem>
                          )}
                        </Menu>
                      </Box>
                      <ButtonGroup color="secondary" sx={classes.buttonGroup} variant="contained">
                        <Tooltip title={"Expand all sections"}>
                          <Button onClick={() => handleExpandAll(true)}>
                            <Expand />
                          </Button>
                        </Tooltip>
                        <Tooltip title={"Collapse all sections"}>
                          <Button onClick={() => handleExpandAll(false)}>
                            <Remove />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div ref={popover}>
                        <Tooltip title={"Edit 3D Canvas Color"}>
                          <Button
                            sx={{
                              width: 75,
                              height: '1.875rem',
                              fontSize: '0.75rem',
                              color: outlinedBtnTextColor,
                              padding: '0.25rem',
                              background: {
                                xs: primaryBg,
                                lg: secondaryBg
                              },
                              '& .MuiButton-endIcon': {
                                width: '1rem',
                                height: '1rem',
                                marginLeft: '0.25rem'
                              }
                            }}
                            variant="contained"
                            color="secondary"
                            onClick={() => setDisplayColorPicker(!displayColorPicker)}
                            endIcon={<ArrowDown />}
                          >
                            {/* <RectangleIcon sx={{ color: RGBAToHexA(getInstance()?.color) }} /> */}
                            <div style={{ ...classes.rectangleIconStyle, background: RGBAToHexA(getInstance()?.color), marginRight: '6px' }} />
                            Edit
                          </Button>
                        </Tooltip>
                        {displayColorPicker ?
                          <ChromePicker
                            color={getInstance()?.color}
                            disableAlpha={true}
                            onChangeComplete={(color, event) => {
                              let rgb;
                              if (event.target.className == "saturation-black") {
                                rgb = { r: color.rgb.r / 255, g: color.rgb.g / 255, b: color.rgb.b / 255, a: color.rgb.a }
                                changeColor(termInfoData?.metadata?.Id, rgb)
                              }
                            }}
                            style={{ zIndex: 10 }} />
                          : null
                        }
                      </div>
                      <ButtonGroup color="secondary" sx={classes.buttonGroup} variant="contained">
                        <Tooltip title={getInstance()?.visible ? "Hide" : "Show"}>
                          <Button onClick={() => handleVisibility()}>
                            {getInstance()?.visible ? <EyeOff /> : <Eye />}
                          </Button>
                        </Tooltip>
                        <Tooltip title={getInstance()?.selected ? "Deselect" : "Select"}>
                          <Button onClick={(event) => handleSelection(event)}>
                            {getInstance()?.selected ? <SelectOff /> : <Focus />}
                          </Button>
                        </Tooltip>
                        <Tooltip title={"Focus on 3D Mesh"}>
                          <Button onClick={(event) => handleFocus(event, true)}>
                            <Target />
                          </Button>
                        </Tooltip>
                        <Tooltip title={getInstance()?.visibleMesh ? "Hide 3D Mesh" : "Show 3D Mesh"}>
                          <Button onClick={(event) => handleMeshVisibility()}>
                            {getInstance()?.visibleMesh ? <ArViewOff /> : <ArView />}                          </Button>
                        </Tooltip>
                        {termInfoData?.metadata?.SuperTypes?.find(s => s.toLowerCase() === NEURON.toLowerCase()) ?
                          <Tooltip title={getInstance()?.skeleton?.[SKELETON]?.visible ? "Disable 3D Skeleton" : "Enable 3D Skeleton"}>
                            <Button onClick={(event) => handleSkeleton(event)}>
                              {getInstance()?.skeleton?.[SKELETON]?.visible ? <SkeletonOff /> : <SkeletonOn />}
                            </Button>
                          </Tooltip>
                          :
                          null}
                        {termInfoData?.metadata?.SuperTypes?.find(s => s.toLowerCase() === NEURON.toLowerCase()) ?
                          <Tooltip title={getInstance()?.skeleton?.[CYLINDERS]?.visible ? "Show 3D Lines Skeleton" : "Show 3D Cylinder Skeleton"}>
                            <Button onClick={(event) => handleCylinder(event)}>
                              {getInstance()?.skeleton?.[CYLINDERS]?.visible ? <CylinderOff id={SKELETON} /> : <CylinderOn id={CYLINDERS} />}
                            </Button>
                          </Tooltip>
                          :
                          null}
                        {termInfoData?.metadata?.IsTemplate != undefined ?
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

            <Box
              sx={{
                overflow: {
                  lg: 'auto'
                },
                maxHeight: {
                  lg: 'calc(100% - 4.0625rem)'
                }
              }}
            >
              <Accordion expanded={expanded[sections[0]]} onChange={() => handleSection(sections[0])}>
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

              <Accordion expanded={expanded[sections[1]]} onChange={() => handleSection(sections[1])}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Queries ({termInfoData?.metadata?.Queries?.length}) </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TreeView
                    aria-label="customized"
                    defaultParentIcon={<ArrowRight />}
                  >
                    {getQueriesLength(termInfoData?.metadata?.Queries) > 0 ? <TreeItem nodeId="1" sx={{ '&:before': { display: 'none' } }} label={
                      <CustomBox display='flex' flexWrap='wrap'>
                        <Typography>{termInfoData?.metadata?.Queries?.find(q => q.output_format === "table" && q?.preview_results?.rows?.length > 0) ? "Types of neurons with..." : "Queries for ..." + termInfoData?.metadata?.Name}</Typography>
                        <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                          <Typography sx={{ pr: 0.5 }}>{termInfoData?.metadata?.Queries?.reduce((n, { count }) => n + count, 0)}</Typography>
                          <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                        </Box>
                      </CustomBox>
                    }>
                      {termInfoData?.metadata?.Queries?.map((query, index) => (
                        query.output_format === "table" && query?.preview_results?.rows?.length > 0 ?
                          (
                            <TreeItem key={query.label + index} nodeId={query.label} label={
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
                                  <TableContainerBoxWrapper>
                                    <TableContainer component={Paper} sx={{ minWidth: '43.75rem' }}>
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
                                          {query?.preview_results?.rows.map(row => (
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
                                                {allLoadedInstances?.find(instance => instance.metadata?.Id === row.id) ?
                                                  <Button variant="text" onClick={() => deleteId(row.id)} color="error">Delete</Button>
                                                  :
                                                  <Button variant="outlined" onClick={() => addId(row.id)} color="success" sx={{
                                                    borderRadius: '0.25rem',
                                                    border: '1px solid #0AB7FE',
                                                    color: '#0AB7FE',
                                                    '&:hover': {
                                                      border: '1px solid #0AB7FE',
                                                    }
                                                  }}>Add</Button>
                                                }
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </TableContainerBoxWrapper>
                                </>
                              } />
                              <TreeItem label={
                                <Button
                                  onClick={() => setToggleMore((prev) => !prev, termInfoData.metadata?.Id, query.query)}
                                  disableRipple
                                  sx={{
                                    padding: 0,
                                    marginTop: '0.25rem',
                                    height: 'auto',
                                    color: tabActiveColor,
                                    '&:hover': { background: 'transparent' }
                                  }}>
                                  {toggleReadMore ? 'Show Less' : 'See More'}
                                </Button>
                              } />
                            </TreeItem>
                          )
                          :
                          (query?.preview_results?.rows?.length > 0 ?
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
                              } />
                            </TreeItem> :
                            <Box
                              display='flex'
                              alignItems="center"
                              key={index}
                              onClick={() => openQuery(data.metadata?.Id, query.query)}
                            >
                              <Typography sx={{
                                flexGrow: 1, color: outlinedBtnTextColor,
                                fontSize: {
                                  xs: '0.875rem',
                                  lg: '1rem'
                                },
                                "&:hover": { "cursor": "pointer" }
                              }}>
                                {query.label}
                              </Typography>
                              <Box display='flex' sx={{ zIndex: 1000 }} pl={0.5}>
                                <Typography sx={{ pr: 0.5 }}>{termInfoData?.metadata?.Queries?.reduce((n, { count }) => n + count, 0)}</Typography>
                                <ListAltIcon sx={{ fontSize: '1.25rem', color: '#A0A0A0' }} />
                              </Box>
                            </Box>
                          )
                      ))
                      }
                    </TreeItem> : null
                    }
                  </TreeView>
                </AccordionDetails>
              </Accordion>

              <Accordion expanded={expanded[sections[2]]} onChange={() => handleSection(sections[2])}>
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
                    mb={2}
                  >
                    {stylingConfiguration.dropDownQueries.map((item, index) =>
                    (<Box
                      display='flex'
                      alignItems="center"
                      key={index}
                      onClick={() => handleGraphSelection(data.metadata?.Id, item)}
                    >
                      <Typography sx={{
                        flexGrow: 1, color: outlinedBtnTextColor,
                        fontSize: {
                          xs: '0.875rem',
                          lg: '1rem',
                          "&:hover": { "cursor": "pointer" }
                        }
                      }}>
                        {item.label(data.metadata?.Name)}
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <ScatterPlot />
                      </IconButton>
                    </Box>)
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        )}

      </Box>

      <MediaQuery minWidth={1200}>
        <Box
          px={open ? 2 : 0}
          display='flex'
          justifyContent={open ? 'flex-end' : 'center'}
          alignItems='center'
          sx={classes.footer}
        >
          {open && <Typography>Collapse</Typography>}
          <Button
            onClick={() => setOpen(!open)}
            sx={{
              height: 'auto',
              minWidth: '0.0625rem',
              ml: open ? 1 : 0,
              '&:hover': {
                background: 'transparent'
              }
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