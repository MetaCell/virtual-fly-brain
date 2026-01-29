import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { ribbonConfiguration } from "../components/configuration/TermInfo/TermInfo";
import configuration from "../components/configuration/TermInfo/configuration.json";
import {
  Box,
  Chip,
  Button,
  Tooltip,
  ButtonGroup,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Table,
  TableBody,
  TableCell,
  Paper,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MediaQuery from "react-responsive";
import {
  ArView,
  Target,
  CylinderOn,
  CylinderOff,
  ArrowDown,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Delete,
  Expand,
  Eye,
  Focus,
  Remove,
  ScatterPlot,
  SkeletonOn,
  SelectOff,
  SkeletonOff,
  EyeOff,
  ArViewOff,
} from "../icons";
import vars from "../theme/variables";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { SimpleTreeView, TreeItem } from '@mui/x-tree-view';
import ListAltIcon from "@mui/icons-material/ListAlt";
import GeneralInformation from "./TermInfo/GeneralInformation";
import Modal from "../shared/modal/Modal";
import { getQueries, updateQueries } from "./../reducers/actions/queries";
import { setQueryComponentOpened } from "./../reducers/actions/globals";
import {
  selectInstance,
  hide3DMesh,
  hide3D,
  show3D,
  show3DMesh,
  removeInstanceByID,
  changeColor,
  show3DSkeleton,
  hide3DSkeleton,
  show3DSkeletonLines,
  show3DSkeletonCylinders,
  zoomToInstance,
} from "./../reducers/actions/instances";
import { updateGraphSelection } from "./../reducers/actions/graph";
import { showComponent } from "./../reducers/actions/layout";
import Ribbon from "@flybase/react-ontology-ribbon";
import { ChromePicker } from "react-color";
import { stylingConfiguration } from "./configuration/VFBGraph/graphConfiguration";
import { widgets } from "./layout/widgets";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import useClickOutside from "./useClickOutside";
import { SKELETON, CYLINDERS, NEURON, RGBAToHexA } from "./../utils/constants";
import "@flybase/react-ontology-ribbon/dist/style.css";
import ReactMarkdown from 'react-markdown';
import { getUpdatedTags, formatTagText } from "../utils/utils";
import { facets_annotations_colors as colors_config } from "./configuration/VFBColors";
import { getInstanceByID } from "../reducers/actions/instances";

const facets_annotations_colors = getUpdatedTags(colors_config);


const {
  whiteColor,
  secondaryBg,
  outlinedBtnTextColor,
  blackColor,
  listHeadingColor,
  headerBorderColor,
  tabActiveColor,
  primaryBg,
} = vars;

const getRibbonData = (query) => {
  let terms = query?.preview_results?.rows?.map((row) => {
    // eslint-disable-next-line no-unused-vars
    const regExp = /\(([^)]+)\)/g;
    return {
      id: row.Neurotransmitter,
      name: (
        <Link underline="none" href="#">
          {row.Neurotransmitter}
        </Link>
      ),
      descendant_terms: [row.Weight],
    };
  });
  return terms;
};

const ribbonTitle = (data) => {
  return data.id + "\n" + "Weight : " + data.descendant_terms[0];
};

const CustomBox = styled(Box)(({ theme }) => ({
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    right: 0,
    zIndex: 5,
    width: "100%",
    height: "100%",
    display: "block",
    pointerEvents: "none",
    background:
      "linear-gradient(270deg, #1A1A1A 0%, rgba(26, 26, 26, 0.00) 26.7%)",
  },
  [theme.breakpoints.down("md")]: {
    "&:after": {
      background: "none",
    },
  },
  [theme.breakpoints.down("lg")]: {
    "&:after": {
      background: "none",
    },
  },
}));

const TableContainerBoxWrapper = styled(Box)(({ theme }) => ({
  overflowX: "auto",
  [theme.breakpoints.down("md")]: {
    "&:before": {
      background: "none",
    },
  },
  [theme.breakpoints.down("lg")]: {
    "&:before": {
      background: "none",
    },
  },
}));

const classes = {
  root: {
    // transition: 'all ease-in-out .3s',
    height: "100%",
    color: whiteColor,
    display: "flex",
    flexDirection: "column",
  },

  header: {
    top: 0,
    background: {
      xs: headerBorderColor,
      md: "transparent",
    },
    borderBottom: {
      lg: "0.0625rem solid #3A3A3A",
    },
    zIndex: 9,
    position: {
      xs: "sticky",
      md: "static",
    },
    mx: {
      xs: -1.5,
      md: 0,
    },
    px: {
      xs: 1.5,
      md: 0,
    },
  },

  heading: {
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: "1.125rem",
    color: listHeadingColor,
  },

  footer: {
    height: "3.75rem",
    background: "#1A1A1A",
    borderTop: `0.0625rem solid ${secondaryBg}`,
    zIndex: 9,
    "& p": {
      fontWeight: 400,
      fontSize: "1rem",
      lineHeight: 1,
      color: outlinedBtnTextColor,
    },
  },

  buttonGroup: {
    "& .MuiButton-root": {
      height: "1.875rem",
      width: "2rem",
      background: {
        xs: primaryBg,
        lg: secondaryBg,
      },
    },
  },

  rectangleIconStyle: {
    width: "20px",
    height: "20px",
    borderRadius: "2px",
    border: "0.829px solid #3A3A3A",
    boxShadow:
      "0px 4.973px 6.631px 0px rgba(0, 0, 0, 0.40) inset, 0px 0px 3.315px 0.829px rgba(0, 0, 0, 0.60) inset",
  },
};

const TermInfo = ({ open, setOpen }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [expanded, setExpanded] = useState({
    "General Information": configuration.sectionsExpanded,
    Queries: configuration.sectionsExpanded,
    Graphs: configuration.sectionsExpanded,
  });
  const [sections,] = useState([
    "General Information",
    "Queries",
    "Graphs",
  ]);
  const data = useSelector((state) => state.instances.focusedInstance);
  const allLoadedInstances = useSelector(
    (state) => state.instances.allLoadedInstances
  );
  const queries = useSelector((state) => state.queries.queries);
  const queryComponentOpened = useSelector(
    (state) => state.globalInfo.queryComponentOpened
  );
  const reduxState = useSelector(state => state);
  const currentTemplate = reduxState.instances.launchTemplate;

  const [termInfoData, setTermInfoData] = useState(data);
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const [currentOpenQuery, setCurrentOpenQuery] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    id: null,
    message: ''
  });
  
  const dispatch = useDispatch();

  const popover = React.useRef();

  const close = React.useCallback(() => setDisplayColorPicker(false), []);
  useClickOutside(popover, close);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDisplayColorPicker(false);
  };

  const handleSection = (event) => {
    handleClose();
    let newState = expanded;
    setExpanded({ ...newState, [event]: !newState[event] });
  };

  const handleExpandAll = (expanded) => {
    let newState = {};
    sections?.forEach((section) => {
      newState[section] = expanded;
    });
    setExpanded(newState);
  };

  const deleteId = () => {
    hide3DMesh(termInfoData?.metadata?.Id);
    removeInstanceByID(termInfoData?.metadata?.Id);
  };

  const addId = (id) => {
    getInstanceByID(
      id,
      true,
      true,
      true
    );
  };

  const handleConfirmAdd = () => {
    if (confirmationModal.id) {
      window.open(
        window.location.origin + '/?id=' + confirmationModal.id,
        '_blank'
      );
    }
    setConfirmationModal({ open: false, id: null, message: '' });
  };

  const handleCancelAdd = () => {
    setConfirmationModal({ open: false, id: null, message: '' });
  };

  const handleVisibility = () => {
    if (
      allLoadedInstances.find(
        (instance) => instance.metadata?.Id == termInfoData?.metadata?.Id
      )?.visible
    ) {
      hide3D(termInfoData?.metadata?.Id);
    } else {
      show3D(termInfoData?.metadata?.Id);
    }
  };

  const handleMeshVisibility = () => {
    if (
      allLoadedInstances.find(
        (instance) => instance.metadata?.Id == termInfoData?.metadata?.Id
      )?.visibleMesh
    ) {
      hide3DMesh(termInfoData?.metadata?.Id);
    } else {
      show3DMesh(termInfoData?.metadata?.Id);
    }
  };

  const handleFocus = () => {
    zoomToInstance(termInfoData?.metadata?.Id);
  };

  const handleSelection = () => {
    selectInstance(termInfoData?.metadata?.Id);
  };

  const handleSkeleton = () => {
    if (
      !allLoadedInstances.find(
        (instance) => instance.metadata?.Id == termInfoData?.metadata?.Id
      )?.skeleton?.skeleton?.visible
    ) {
      show3DSkeleton(termInfoData?.metadata?.Id);
    } else {
      hide3DSkeleton(termInfoData?.metadata?.Id);
    }
  };

  const handleCylinder = () => {
    if (
      !allLoadedInstances.find(
        (instance) => instance.metadata?.Id == termInfoData?.metadata?.Id
      )?.skeleton?.sphere?.visible
    ) {
      show3DSkeletonCylinders(termInfoData?.metadata?.Id);
    } else {
      show3DSkeletonLines(termInfoData?.metadata?.Id);
    }
  };

  const handleTermClick = (term) => {
    const regExp = /\(([^)]+)\)/g;
    const matches = [...term.id.matchAll(regExp)].flat();
    
    setConfirmationModal({
      open: true,
      id: matches[1],
      message: `The image you requested is aligned to another template. Click Load Template to open it in a new tab or Cancel to just view the image metadata.`
    });
  };

  const customColorCalculation = ({
    baseRGB,
    itemData,
  }) => {
    let red = baseRGB[0] * itemData.descendant_terms[0];
    let green = baseRGB[1] * (1 - itemData.descendant_terms[0] / 100);

    return [red, green, baseRGB[2]];
  };

  // const getQueriesLength = (queries) => {
  //   let queriesCount = 0;
  //   queries?.forEach((query) => {
  //     if (query?.count) {
  //       queriesCount = query.count + 1;
  //     }
  //   });

  //   return queriesCount;
  // };

  const openQuery = (id, type) => {
    let updatedQueries = [...queries];
    updatedQueries?.forEach((query) => {
      if (query.queries) {
        Object.keys(query.queries)?.forEach(
          (q) => (query.queries[q].active = false)
        );
      }
    });
    updateQueries(updatedQueries);
    getQueries(id, type);
    dispatch(setQueryComponentOpened(true));
  };

  React.useEffect(() => {
    setToggleReadMore(queryComponentOpened);
  }, [queryComponentOpened]);

  const setToggleMore = (prev, id, type) => {
    const queryKey = `${id}-${type}`;
    
    if (currentOpenQuery === queryKey && toggleReadMore) {
      // Clicking "Show Less" on the currently open query
      setToggleReadMore(false);
      setCurrentOpenQuery(null);
      dispatch(setQueryComponentOpened(false));
    } else {
      // Opening a new query or switching to a different query
      setToggleReadMore(true);
      setCurrentOpenQuery(queryKey);
      openQuery(id, type);
    }
  };

  const handleGraphSelection = (id, selection) => {
    dispatch(
      showComponent(widgets.termContextWidget.id, {
        status: WidgetStatus.ACTIVE,
      })
    );
    updateGraphSelection({ data: { instance: data, selection: selection } });
  };

  const termInfoHeading = (
    <Box display="flex" flexDirection="column">
      <Typography
        sx={{
          fontWeight: 500,
          lineHeight: 1.2,
          fontSize: "1.25rem",
          color: whiteColor,
          wordWrap: "break-word",
          maxWidth: "23ch",
        }}
      >
        {termInfoData?.metadata?.Name}
      </Typography>
      <Typography
        sx={{
          fontWeight: 400,
          lineHeight: 1.2,
          fontSize: "1rem",
          color: outlinedBtnTextColor,
          mt: 0.5,
        }}
      >
        ID: {termInfoData?.metadata?.Id}
      </Typography>
    </Box>
  );

  // FIXME
  useEffect(() => {
    if (
      allLoadedInstances?.find(
        (instance) => instance.metadata?.Id == data?.metadata?.Id
      )
    ) {
      setTermInfoData(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (
      allLoadedInstances?.find(
        (instance) => instance.metadata?.Id == data?.metadata?.Id
      )
    ) {
      setTermInfoData(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLoadedInstances]);

  const getInstance = () => {
    let instance = allLoadedInstances.find(
      (instance) => instance.metadata?.Id == termInfoData?.metadata?.Id
    );
    return instance;
  };

  // Helper to order headers: Name first, then others by order, then Add (empty)
  const getOrderedHeaders = (headers) => {
    const headerArr = Object.entries(headers)
      .map(([key, value]) => ({ key, ...value }))
      .filter(h => h.key !== 'id' && h.key !== 'name');

    headerArr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return [
      { key: 'name', ...headers['name'] },
      ...headerArr,
      { key: 'id', ...headers['id'] }
    ];
  };

  const handleLinkClick = (href, event) => {
    event.preventDefault();

    const idsArray = href.split(',');
    const templateId = idsArray[idsArray.length - 1];
    const currentTemplateId = currentTemplate?.metadata?.Id;

    let isAlignedTemplate = false;
    if (data?.metadata?.Examples && typeof data?.metadata?.Examples === 'object' && Object.keys(data?.metadata?.Examples).length > 0) {
      isAlignedTemplate = !!(data.metadata.Examples[currentTemplateId] && data.metadata.Examples[currentTemplateId].find(e => e.id === templateId));
    } else if (data?.metadata?.Images && Array.isArray(data?.metadata?.Images) && data?.metadata?.Images.length > 0) {
      isAlignedTemplate = !!(data.metadata.Images[currentTemplateId] && data.metadata.Images[currentTemplateId].find(e => e.id === templateId));
    }
    
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
     if (isAlignedTemplate) {
           getInstanceByID(
             templateId, 
             true, 
             true, 
             true
           );
         } else {
           setConfirmationModal({
             open: true,
             id: templateId,
             message: "The image you requested is aligned to another template. Click Load Template to open it in a new tab or Cancel to just view the image metadata."
           });
         }
    }
  };

  // Helper to check if query is a "Neurons with" query with results
  const isNeuronsWithQuery = (q) => {
    return q.label?.startsWith("Neurons with") && 
           q.output_format === "table" && 
           q?.preview_results?.rows?.length > 0;
  };

  // Comparator function to sort queries, moving zero-count queries to the bottom
  const sortByCountDescending = (a, b) => {
    if ((a.count || 0) === 0 && (b.count || 0) !== 0) return 1;
    if ((a.count || 0) !== 0 && (b.count || 0) === 0) return -1;
    return 0;
  };

  // Renderers for each type
  const renderCellContent = (type, value) => {
    switch (type) {
      case 'numeric':
        return <span>{value}</span>;
      case 'tags': {
        if (!value) return null;
        const tags = Array.isArray(value) ? value : value.split('|');
        return tags.map((tag, idx) => (
          <Chip
            key={tag + idx}
            style={{
              fontSize: '0.625rem',
              alignSelf: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width : 'auto',
              height : '1.25rem',
              padding: '0.1875rem 0.5rem',
              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
              color: '#ffffff',
            }}
            label={formatTagText(tag)}
          />
        ));
      }
      case 'markdown':
        return (
          <ReactMarkdown
            components={{
              a: ({ href, children, ...props }) => (
                <span
                  style={{
                    fontSize: '0.875rem',
                    ":hover": {
                      color: tabActiveColor,
                      cursor: 'pointer',
                    }}}
                  onClick={e => handleLinkClick(href, e)}
                  {...props}
                >
                  {children}
                </span>
              ),
              // eslint-disable-next-line no-unused-vars
              img: ({node, ...props}) => (
                <img
                  {...props}
                  style={{ maxWidth: 180, maxHeight: 90, width: 'auto', height: 'auto' }}
                  alt={props.alt}
                />
              ),
            }}
          >
            {value}
          </ReactMarkdown>
        );
      case 'selection_id':
        // This is the Add button column, handled separately.
        return null;
      case 'metadata': {
        if (!value || !Array.isArray(value) || value.length === 0) return null;
        return (
          <Box display="flex" flexDirection="column" gap={0.5}>
            {value.map((pub, idx) => (
              <Box key={idx} display="flex" flexDirection="column" gap={0.25}>
                <Typography sx={{ fontSize: '0.75rem', color: outlinedBtnTextColor }}>
                  {pub.core?.label}
                </Typography>
                <Box display="flex" gap={1}>
                  {pub.FlyBase && (
                    <Link
                      href={`http://flybase.org/reports/${pub.FlyBase}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: '0.625rem', color: tabActiveColor }}
                    >
                      FlyBase
                    </Link>
                  )}
                  {pub.PubMed && (
                    <Link
                      href={`https://pubmed.ncbi.nlm.nih.gov/${pub.PubMed}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: '0.625rem', color: tabActiveColor }}
                    >
                      PubMed
                    </Link>
                  )}
                  {pub.DOI && (
                    <Link
                      href={`https://doi.org/${pub.DOI}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontSize: '0.625rem', color: tabActiveColor }}
                    >
                      DOI
                    </Link>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        );
      }
      default:
        // Handle arrays of strings
        if (Array.isArray(value)) {
          return <span>{value.join(', ')}</span>;
        }
        // Handle objects by converting to JSON string
        if (value && typeof value === 'object') {
          return <span>{JSON.stringify(value)}</span>;
        }
        return <span>{value}</span>;
    }
  };

  return (
    <Box
      sx={{
        ...classes.root,
        width: {
          xs: "100%",
          lg: open ? "34.438rem" : "2.75rem",
        },
        flex: {
          lg: "none !important",
        },
        p: {
          xs: 1.5,
          lg: 0,
        },
        pt: {
          lg: open ? 0 : 4,
        },
        background: {
          lg: blackColor,
        },
        borderColor: {
          lg: secondaryBg,
        },
        borderStyle: {
          lg: "solid",
        },
        borderTopRightRadius: {
          lg: "0.5rem",
        },
        borderWidth: {
          lg: "0.0625rem 0.0625rem 0 0",
        },
      }}
    >
      <Box
        sx={{ width: "100%", height: { lg: "calc(100% - 3.75rem)" } }}
        flexGrow={1}
      >
        {!open ? (
          <Typography
            sx={{
              maxWidth: "10rem",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              transform: "rotate(90deg)",
              fontWeight: 500,
              fontSize: "0.875rem",
              lineHeight: 1,
              color: whiteColor,
            }}
          >
            {termInfoHeading}
          </Typography>
        ) : (
          <Box sx={{ height: { lg: "100%" }, overflow: "auto", p: { lg: 2 } }}>
            <Box sx={{ ...classes.header, pb: { xs: 1.5, lg: 2 } }}>
              <Grid
                container
                alignItems="flex-start"
                sx={{ justifyContent: { lg: "space-between", xs: "flex-end" } }}
              >
                <MediaQuery minWidth={768}>
                  <Grid item xs={12} lg={4.5} sm={6}>
                    <Box>
                      <Typography
                        sx={{
                          maxWidth: "10rem",
                          fontWeight: 500,
                          fontSize: "1.25rem",
                          color: whiteColor,
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        {termInfoHeading}
                      </Typography>
                    </Box>
                  </Grid>
                </MediaQuery>

                <Grid item xs={12} lg={7.5} sm={6}>
                  <Box
                    display="flex"
                    rowGap={1}
                    flexWrap="wrap"
                    sx={{
                      flexDirection: {
                        lg: "column",
                      },
                      alignItems: {
                        lg: "flex-end",
                      },
                      justifyContent: {
                        xs: "space-between",
                        sm: "flex-end",
                      },
                      columnGap: {
                        xs: 1,
                        sm: 3,
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      sx={{
                        gap: {
                          xs: 0.5,
                          sm: 1.125,
                        },
                      }}
                    >
                      <Box>
                        <Button
                          sx={{
                            height: "1.875rem",
                            fontSize: "0.75rem",
                            color: outlinedBtnTextColor,
                            background: {
                              xs: primaryBg,
                              lg: secondaryBg,
                            },
                            "& .MuiButton-endIcon": {
                              width: "1rem",
                              height: "1rem",
                              marginLeft: "0.25rem",
                            },
                          }}
                          variant="contained"
                          color="secondary"
                          id="basic-button"
                          aria-controls={openMenu ? "basic-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={openMenu ? "true" : undefined}
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
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {sections?.map((section) => (
                            <MenuItem
                              id={section}
                              key={section}
                              onClick={(event) =>
                                handleSection(event.target.id)
                              }
                            >
                              {section}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                      <ButtonGroup
                        color="secondary"
                        sx={classes.buttonGroup}
                        variant="contained"
                      >
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

                    <Box
                      sx={{ display: "flex", gap: "6px", alignItems: "center" }}
                    >
                      <div ref={popover}>
                        <Tooltip title={"Edit 3D Canvas Color"}>
                          <Button
                            sx={{
                              width: 75,
                              height: "1.875rem",
                              fontSize: "0.75rem",
                              color: outlinedBtnTextColor,
                              padding: "0.25rem",
                              background: {
                                xs: primaryBg,
                                lg: secondaryBg,
                              },
                              "& .MuiButton-endIcon": {
                                width: "1rem",
                                height: "1rem",
                                marginLeft: "0.25rem",
                              },
                            }}
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              setDisplayColorPicker(!displayColorPicker)
                            }
                            endIcon={<ArrowDown />}
                          >
                            {/* <RectangleIcon sx={{ color: RGBAToHexA(getInstance()?.color) }} /> */}
                            <div
                              style={{
                                ...classes.rectangleIconStyle,
                                background: RGBAToHexA(getInstance()?.color),
                                marginRight: "6px",
                              }}
                            />
                            Edit
                          </Button>
                        </Tooltip>
                        {displayColorPicker ? (
                          <ChromePicker
                            color={{
                              r: getInstance()?.color.r * 255,
                              g: getInstance()?.color.g * 255,
                              b: getInstance()?.color.b * 255,
                              a: getInstance()?.color.a,
                            }}
                            disableAlpha={false}
                            onChangeComplete={(color) => {
                              let rgb;
                              rgb = {
                                r: color.rgb.r / 255,
                                g: color.rgb.g / 255,
                                b: color.rgb.b / 255,
                                a: color.rgb.a,
                              };
                              changeColor(termInfoData?.metadata?.Id, rgb);
                            }}
                            style={{ zIndex: 10 }}
                          />
                        ) : null}
                      </div>
                      <ButtonGroup
                        color="secondary"
                        sx={classes.buttonGroup}
                        variant="contained"
                      >
                        <Tooltip
                          title={getInstance()?.visible ? "Hide" : "Show"}
                        >
                          <Button onClick={() => handleVisibility()}>
                            {getInstance()?.visible ? <EyeOff /> : <Eye />}
                          </Button>
                        </Tooltip>
                        <Tooltip
                          title={
                            getInstance()?.selected ? "Deselect" : "Select"
                          }
                        >
                          <Button onClick={(event) => handleSelection(event)}>
                            {getInstance()?.selected ? (
                              <SelectOff />
                            ) : (
                              <Focus />
                            )}
                          </Button>
                        </Tooltip>
                        <Tooltip title={"Focus on 3D Mesh"}>
                          <Button onClick={(event) => handleFocus(event, true)}>
                            <Target />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          title={
                            getInstance()?.visibleMesh
                              ? "Hide 3D Mesh"
                              : "Show 3D Mesh"
                          }
                        >
                          <Button onClick={() => handleMeshVisibility()}>
                            {getInstance()?.visibleMesh ? (
                              <ArViewOff />
                            ) : (
                              <ArView />
                            )}{" "}
                          </Button>
                        </Tooltip>
                        {termInfoData?.metadata?.SuperTypes?.find(
                          (s) => s.toLowerCase() === NEURON.toLowerCase()
                        ) ? (
                          <Tooltip
                            title={
                              getInstance()?.skeleton?.[SKELETON]?.visible
                                ? "Disable 3D Skeleton"
                                : "Enable 3D Skeleton"
                            }
                          >
                            <Button onClick={(event) => handleSkeleton(event)}>
                              {getInstance()?.skeleton?.[SKELETON]?.visible ? (
                                <SkeletonOff />
                              ) : (
                                <SkeletonOn />
                              )}
                            </Button>
                          </Tooltip>
                        ) : null}
                        {termInfoData?.metadata?.SuperTypes?.find(
                          (s) => s.toLowerCase() === NEURON.toLowerCase()
                        ) ? (
                          <Tooltip
                            title={
                              getInstance()?.skeleton?.[CYLINDERS]?.visible
                                ? "Show 3D Lines Skeleton"
                                : "Show 3D Cylinder Skeleton"
                            }
                          >
                            <Button onClick={(event) => handleCylinder(event)}>
                              {getInstance()?.skeleton?.[CYLINDERS]?.visible ? (
                                <CylinderOff id={SKELETON} />
                              ) : (
                                <CylinderOn id={CYLINDERS} />
                              )}
                            </Button>
                          </Tooltip>
                        ) : null}
                        {termInfoData?.metadata?.IsTemplate != undefined ? (
                          <Tooltip title={"Delete From Term Info"}>
                            <Button
                              disabled={termInfoData?.metadata?.IsTemplate}
                              onClick={() => deleteId()}
                            >
                              <Delete />
                            </Button>
                          </Tooltip>
                        ) : null}
                      </ButtonGroup>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                maxHeight: {
                  lg: "calc(100% - 4.0625rem)",
                },
              }}
            >
              <Accordion
                expanded={expanded[sections[0]]}
                onChange={() => handleSection(sections[0])}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>General Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <GeneralInformation data={termInfoData} classes={classes} showMetadataOnly={false} />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded[sections[1]]}
                onChange={() => handleSection(sections[1])}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Metadata</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <GeneralInformation data={termInfoData} classes={classes} showMetadataOnly={true} />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded[sections[2]]}
                onChange={() => handleSection(sections[2])}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>
                    Queries ({termInfoData?.metadata?.Queries?.length}){" "}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <SimpleTreeView
                    aria-label="customized"
                    defaultParentIcon={<ArrowRight />}
                  >
                    {/* Group queries that start with "Neurons with" */}
                    {termInfoData?.metadata?.Queries?.filter(isNeuronsWithQuery).length > 0 && (
                      <TreeItem
                        itemId="terminfo-neurons-with-queries"
                        sx={{ "&:before": { display: "none" } }}
                        label={
                          <CustomBox display="flex" flexWrap="wrap">
                            <Typography>Types of neurons with</Typography>
                            <Box display="flex" sx={{ zIndex: 6 }} pl={0.5}>
                              <Typography sx={{ pr: 0.5 }}>
                                {termInfoData?.metadata?.Queries?.filter(isNeuronsWithQuery).reduce((n, { count }) => n + (count || 0), 0)}
                              </Typography>
                              <ListAltIcon
                                sx={{ fontSize: "1.25rem", color: "#A0A0A0" }}
                              />
                            </Box>
                          </CustomBox>
                        }
                      >
                        {termInfoData?.metadata?.Queries
                          ?.filter(q => q.label?.startsWith("Neurons with"))
                          .sort(sortByCountDescending)
                          .map((query, index) => {
                          const headers = getOrderedHeaders(query?.preview_results?.headers);
                          return (query.output_format === "table" &&
                          query?.preview_results?.rows?.length > 0 ? (
                            <TreeItem
                              sx={{ "paddingLeft": "1.25rem" }}
                              key={query.label + index}
                              itemId={`query-${index}`}
                              label={
                                <CustomBox display="flex" flexWrap="wrap">
                                  <Typography>{query.label}</Typography>
                                  <Box
                                    display="flex"
                                    sx={{ zIndex: 6 }}
                                    pl={0.5}
                                  >
                                    <Typography sx={{ pr: 0.5 }}>
                                      {query?.count}
                                    </Typography>
                                    <ListAltIcon
                                      sx={{
                                        fontSize: "1.25rem",
                                        color: "#A0A0A0",
                                      }}
                                    />
                                  </Box>
                                </CustomBox>
                              }
                            >
                              <TreeItem
                                itemId={`terminfo-queries-table-${index}`}
                                label={
                                  <>
                                    <TableContainerBoxWrapper>
                                      <TableContainer component={Paper}>
                                        <Table>
                                          <TableHead>
                                            <TableRow>
                                              {headers.slice(0, -1).map(h => (
                                                <TableCell key={h.key}>{h.title}</TableCell>
                                              ))}
                                              <TableCell /> {/* Last header is always empty for Add button */}
                                            </TableRow>
                                          </TableHead>
                                          <TableBody>
                                            {query?.preview_results?.rows.map((row, rowIdx) => {
                                              const isLoaded = allLoadedInstances?.find(
                                                (instance) => instance.metadata?.Id === row.id
                                              );
                                              return ( <TableRow key={row.id + '-' + rowIdx}>
                                                {headers.slice(0, -1).map((h) =>
                                                  (
                                                    <TableCell key={h.key}>
                                                      {renderCellContent(h.type, row[h.key])}
                                                    </TableCell>
                                                  )
                                                )}
                                                <TableCell>
                                                  {isLoaded ? (
                                                    <Button
                                                      variant="text"
                                                      color="error"
                                                      onClick={() => deleteId(row.id)}
                                                    >
                                                      Delete
                                                    </Button>
                                                  ) : (
                                                    <Button
                                                      variant="outlined"
                                                      onClick={() =>
                                                        addId(row.id)
                                                      }
                                                      color="success"
                                                      sx={{
                                                        borderRadius:
                                                          "0.25rem",
                                                        border:
                                                          "1px solid #0AB7FE",
                                                        color: "#0AB7FE",
                                                        "&:hover": {
                                                          border:
                                                            "1px solid #0AB7FE",
                                                        },
                                                      }}
                                                    >
                                                      Add
                                                    </Button>
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            )})}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    </TableContainerBoxWrapper>
                                  </>
                                }
                              />
                              <TreeItem
                                itemId={`toggle-${index}`}
                                label={
                                  <Button
                                    onClick={() =>
                                      setToggleMore(
                                        (prev) => !prev,
                                        termInfoData.metadata?.Id,
                                        query.query
                                      )
                                    }
                                    disableRipple
                                    sx={{
                                      padding: 0,
                                      marginTop: "0.25rem",
                                      height: "auto",
                                      color: tabActiveColor,
                                      "&:hover": { background: "transparent" },
                                    }}
                                  >
                                    {currentOpenQuery === `${termInfoData.metadata?.Id}-${query.query}` && toggleReadMore ? "Show Less" : "See More"}
                                  </Button>
                                }
                              />
                            </TreeItem>
                          ) : query?.preview_results?.rows?.length > 0 ? (
                            <TreeItem
                              sx={{ "paddingLeft": "1.25rem" }}
                              key={query.label}
                              itemId={`query-${index}`}
                              label={
                                <CustomBox display="flex" flexWrap="wrap">
                                  <Typography>{query.label}</Typography>
                                  <Box
                                    display="flex"
                                    sx={{ zIndex: 6 }}
                                    pl={0.5}
                                  >
                                    <Typography sx={{ pr: 0.5 }}>
                                      {query?.preview_results?.rows?.length}
                                    </Typography>
                                    <ListAltIcon
                                      sx={{
                                        fontSize: "1.25rem",
                                        color: "#A0A0A0",
                                      }}
                                    />
                                  </Box>
                                </CustomBox>
                              }
                            >
                              <TreeItem
                                itemId={`ribbon-${index}`}
                                label={
                                  <Box display="flex" justifyContent="start">
                                    <Ribbon
                                      onTermClick={handleTermClick}
                                      data={getRibbonData(query)}
                                      itemTitle={ribbonTitle}
                                      calcHeatColor={customColorCalculation}
                                      baseRGB={ribbonConfiguration.rgbColor}
                                      heatLevels={
                                        ribbonConfiguration.heatLevels
                                      }
                                    />
                                  </Box>
                                }
                              />
                            </TreeItem>
                          ) : (
                            <Box
                              display="flex"
                              alignItems="center"
                              key={index}
                              onClick={() =>
                                openQuery(data.metadata?.Id, query.query)
                              }
                            >
                              <Typography
                                sx={{
                                  paddingLeft: "1.25rem",
                                  flexGrow: 1,
                                  color: outlinedBtnTextColor,
                                  fontSize: {
                                    xs: "0.875rem",
                                    lg: "1rem",
                                  },
                                  "&:hover": { cursor: "pointer" },
                                }}
                              >
                                {query.label}
                              </Typography>
                              <Box
                                display="flex"
                                sx={{ zIndex: 6 }}
                                pl={0.5}
                              >
                                <Typography sx={{ pr: 0.5 }}>
                                  {termInfoData?.metadata?.Queries?.reduce(
                                    (n, { count }) => n + count,
                                    0
                                  )}
                                </Typography>
                                <ListAltIcon
                                  sx={{ fontSize: "1.25rem", color: "#A0A0A0" }}
                                />
                              </Box>
                            </Box>
                          ))
                        })}
                      </TreeItem>
                    )}

                    {/* All other queries under "Other queries" section */}
                    {termInfoData?.metadata?.Queries?.filter(q => !q.label?.startsWith("Neurons with")).length > 0 && (
                      <TreeItem
                        itemId="terminfo-other-queries"
                        sx={{ "&:before": { display: "none" } }}
                        label={
                          <CustomBox display="flex" flexWrap="wrap">
                            <Typography>Other queries</Typography>
                            <Box display="flex" sx={{ zIndex: 6 }} pl={0.5}>
                              <Typography sx={{ pr: 0.5 }}>
                                {termInfoData?.metadata?.Queries?.filter(q => 
                                  !q.label?.startsWith("Neurons with")
                                ).reduce((n, { count }) => n + (count || 0), 0)}
                              </Typography>
                              <ListAltIcon
                                sx={{ fontSize: "1.25rem", color: "#A0A0A0" }}
                              />
                            </Box>
                          </CustomBox>
                        }
                      >
                        {termInfoData?.metadata?.Queries
                          ?.filter(q => !q.label?.startsWith("Neurons with"))
                          .sort(sortByCountDescending)
                          .map((query, index) => {
                      const headers = getOrderedHeaders(query?.preview_results?.headers);
                      return (query.output_format === "table" &&
                      query?.preview_results?.rows?.length > 0 ? (
                        <TreeItem
                          sx={{ "paddingLeft": "1.25rem" }}
                          key={query.label + index}
                          itemId={`query-root-${index}`}
                          label={
                            <CustomBox display="flex" flexWrap="wrap">
                              <Typography>{query.label}</Typography>
                              <Box
                                display="flex"
                                sx={{ zIndex: 6 }}
                                pl={0.5}
                              >
                                <Typography sx={{ pr: 0.5 }}>
                                  {query?.count}
                                </Typography>
                                <ListAltIcon
                                  sx={{
                                    fontSize: "1.25rem",
                                    color: "#A0A0A0",
                                  }}
                                />
                              </Box>
                            </CustomBox>
                          }
                        >
                          <TreeItem
                            itemId={`terminfo-queries-table-root-${index}`}
                            label={
                              <>
                                <TableContainerBoxWrapper>
                                  <TableContainer component={Paper}>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {headers.slice(0, -1).map(h => (
                                            <TableCell key={h.key}>{h.title}</TableCell>
                                          ))}
                                          <TableCell /> {/* Last header is always empty for Add button */}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {query?.preview_results?.rows.map((row, rowIdx) => {
                                          const isLoaded = allLoadedInstances?.find(
                                            (instance) => instance.metadata?.Id === row.id
                                          );
                                          return ( <TableRow key={row.id + '-' + rowIdx}>
                                            {headers.slice(0, -1).map((h) =>
                                              (
                                                <TableCell key={h.key}>
                                                  {renderCellContent(h.type, row[h.key])}
                                                </TableCell>
                                              )
                                            )}
                                            <TableCell>
                                              {isLoaded ? (
                                                <Button
                                                  variant="text"
                                                  color="error"
                                                  onClick={() => deleteId(row.id)}
                                                >
                                                  Delete
                                                </Button>
                                              ) : (
                                                <Button
                                                  variant="outlined"
                                                  onClick={() =>
                                                    addId(row.id)
                                                  }
                                                  color="success"
                                                  sx={{
                                                    borderRadius:
                                                      "0.25rem",
                                                    border:
                                                      "1px solid #0AB7FE",
                                                    color: "#0AB7FE",
                                                    "&:hover": {
                                                      border:
                                                        "1px solid #0AB7FE",
                                                    },
                                                  }}
                                                >
                                                  Add
                                                </Button>
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        )})}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </TableContainerBoxWrapper>
                              </>
                            }
                          />
                          <TreeItem
                            itemId={`toggle-root-${index}`}
                            label={
                              <Button
                                onClick={() =>
                                  setToggleMore(
                                    (prev) => !prev,
                                    termInfoData.metadata?.Id,
                                    query.query
                                  )
                                }
                                disableRipple
                                sx={{
                                  padding: 0,
                                  marginTop: "0.25rem",
                                  height: "auto",
                                  color: tabActiveColor,
                                  "&:hover": { background: "transparent" },
                                }}
                              >
                                {currentOpenQuery === `${termInfoData.metadata?.Id}-${query.query}` && toggleReadMore ? "Show Less" : "See More"}
                              </Button>
                            }
                          />
                        </TreeItem>
                      ) : query?.preview_results?.rows?.length > 0 ? (
                        <TreeItem
                          sx={{ "paddingLeft": "1.25rem" }}
                          key={query.label}
                          itemId={`query-root-${index}`}
                          label={
                            <CustomBox display="flex" flexWrap="wrap">
                              <Typography>{query.label}</Typography>
                              <Box
                                display="flex"
                                sx={{ zIndex: 6 }}
                                pl={0.5}
                              >
                                <Typography sx={{ pr: 0.5 }}>
                                  {query?.count}
                                </Typography>
                                <ListAltIcon
                                  sx={{
                                    fontSize: "1.25rem",
                                    color: "#A0A0A0",
                                  }}
                                />
                              </Box>
                            </CustomBox>
                          }
                        >
                          <TreeItem
                            itemId={`ribbon-root-${index}`}
                            label={
                              <Box display="flex" justifyContent="start">
                                <Ribbon
                                  onTermClick={handleTermClick}
                                  data={getRibbonData(query)}
                                  itemTitle={ribbonTitle}
                                  calcHeatColor={customColorCalculation}
                                  baseRGB={ribbonConfiguration.rgbColor}
                                  heatLevels={
                                    ribbonConfiguration.heatLevels
                                  }
                                />
                              </Box>
                            }
                          />
                        </TreeItem>
                      ) : (
                        <Box
                          display="flex"
                          alignItems="center"
                          key={index}
                          onClick={() =>
                            openQuery(data.metadata?.Id, query.query)
                          }
                        >
                          <Typography
                            sx={{
                              paddingLeft: "1.25rem",
                              flexGrow: 1,
                              color: outlinedBtnTextColor,
                              fontSize: {
                                xs: "0.875rem",
                                lg: "1rem",
                              },
                              "&:hover": { cursor: "pointer" },
                            }}
                          >
                            {query.label}
                          </Typography>
                          <Box
                            display="flex"
                            sx={{ zIndex: 6 }}
                            pl={0.5}
                          >
                            <Typography sx={{ pr: 0.5 }}>
                              {query.count || 0}
                            </Typography>
                            <ListAltIcon
                              sx={{ fontSize: "1.25rem", color: "#A0A0A0" }}
                            />
                          </Box>
                        </Box>
                      ))
                    })}
                      </TreeItem>
                    )}
                  </SimpleTreeView>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded[sections[3]]}
                onChange={() => handleSection(sections[3])}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel2a-header"
                >
                  <Typography>Graphs</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" flexDirection="column" rowGap={1} mb={2}>
                    {stylingConfiguration.dropDownQueries.map((item, index) => (
                      <Box
                        display="flex"
                        alignItems="center"
                        key={index}
                        onClick={() =>
                          handleGraphSelection(data?.metadata?.Id, item)
                        }
                      >
                        <Typography
                          sx={{
                            flexGrow: 1,
                            color: outlinedBtnTextColor,
                            fontSize: {
                              xs: "0.875rem",
                              lg: "1rem",
                              "&:hover": { cursor: "pointer" },
                            },
                          }}
                        >
                          {item.label(data?.metadata?.Name)}
                        </Typography>
                        <IconButton sx={{ p: 0 }}>
                          <ScatterPlot />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        )}
      </Box>

      {/* Confirmation Modal for Adding Instance */}
      <Modal
        open={confirmationModal.open}
        handleClose={handleCancelAdd}
        title="ID not aligned"
        description={confirmationModal.message}
      >
        <Button onClick={handleCancelAdd} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirmAdd} variant="contained">
          Okay
        </Button>
      </Modal>

      <MediaQuery minWidth={1200}>
        <Box
          px={open ? 2 : 0}
          display="flex"
          justifyContent={open ? "flex-end" : "center"}
          alignItems="center"
          sx={classes.footer}
        >
          {open && <Typography>Collapse</Typography>}
          <Button
            onClick={() => setOpen(!open)}
            sx={{
              height: "auto",
              minWidth: "0.0625rem",
              ml: open ? 1 : 0,
              "&:hover": {
                background: "transparent",
              },
            }}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default TermInfo;
