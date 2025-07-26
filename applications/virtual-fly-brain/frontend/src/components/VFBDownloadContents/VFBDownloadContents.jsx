import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from '@material-ui/core/CircularProgress';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Checkbox, Divider, IconButton } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import configuration from "../../components/configuration/VFBDownloadContents/configuration.json";
import { MuiThemeProvider } from "@material-ui/core/styles";
import axios from "axios";
import { withStyles } from "@material-ui/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import NRRDIcon from "../../components/configuration/VFBDownloadContents/nrrd.png";
import OBJIcon from "../../components/configuration/VFBDownloadContents/obj.png";
import SWCIcon from "../../components/configuration/VFBDownloadContents/swc.png";
import ReferenceIcon from "../../components/configuration/VFBDownloadContents/reference.png";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, connect } from "react-redux";
import { createTheme } from "@material-ui/core/styles";

const iconsMap = {
  obj: OBJIcon,
  swc: SWCIcon,
  reference: ReferenceIcon,
  nrrd: NRRDIcon,
};

const ALL_INSTANCES = { id: "ALL_INSTANCES", name: "All Instances" };

const styles = theme => ({
  downloadButton: { backgroundColor: "#0AB7FE", color: "white !important" },
  downloadErrorButton: { backgroundColor: "#FCE7E7", color: "#E53935", border : "1px solid #E53935" },
  error: { color: "#E53935" },
  errorMessage: { wordWrap: "break-word" },
  downloadButtonText: { color: "white !important" },
  checkedBox: { borderColor: "#0AB7FE" },
  footer: { backgroundColor: "#EEF9FF" },
  errorFooter: { backgroundColor: "#FCE7E7" },
  listItemText: { fontSize: "1em" },
  customizedButton: {
    position: "absolute",
    left: "95%",
    top: "2%",
    backgroundColor: "#F5F5F5",
    color: "gray",
  },
  dialog: {
    overflow: "unset",
    margin: "0 auto",
  },
  dialogContent: { overflow: "hidden" },
  checked: { "&$checked": { color: "#0AB7FE" } },
  "@global": {
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": { backgroundColor: "white" },
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label": { backgroundColor: "white" }
  },
});

const theme = createTheme({
  typography: {
    h2: {
      fontSize: 22,
      fontWeight: 400,
      fontStyle: "normal",
      lineHeight: "26.4px",
      color: "#181818",
      fontFamily: "Barlow",
    },
    h5: {
      fontSize: 11,
      fontWeight: 500,
      fontStyle: "normal",
      lineHeight: "13.2px",
      fontFamily: "Barlow",
      color: "rgba(0, 0, 0, 0.54)",
    },
    subtitle2: {
      fontSize: 11,
      fontWeight: 500,
      fontStyle: "normal",
      lineHeight: "13.2px",
      fontFamily: "Barlow",
      color: "rgba(0, 0, 0, 0.24)",
    },
    error: {
      fontSize: 11,
      fontWeight: 500,
      fontStyle: "normal",
      lineHeight: "13.2px",
      fontFamily: "Barlow",
      color: "#E53935",
    },
    button: {
      fontSize: 11,
      fontWeight: 600,
      fontStyle: "normal",
      lineHeight: "13.2px",
      fontFamily: "Barlow",
      color: "#0AB7FE",
    },
  },
  Button: {
    "&:hover": {
      backgroundColor: "#0AB7FE",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0AB7FE",
    },
  },
});

/**
 * Component to download files contents
 */
const VFBDownloadContents = (props) => {

  const [state,setState] = React.useState({
    open: props.open,
    typesChecked: [],
    downloadError: false,
    downloading: false,
    selectedVariables: [],
    allVariablesSelectedFlag: false,
    errorMessage : ""
  });

  const configurationOptions = configuration.options;
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances)

  const handleCloseDialog = () => {
    props.setBottomNav('');
    setState({ ...state, open: false });
  }

  const openDialog = () => {
    props.setBottomNav('');
    setState({...state,
      open: true,
      variables : getAllLoadedVariables(),
      downloadError : false,
      downloading : false,
      downloadEnabled : state.typesChecked.length > 0 && state.selectedVariables.length > 0 
    });
  }

  React.useEffect(()=> {
    let vars = getAllLoadedVariables();
    setState({...state, variables : vars})
  }, [allLoadedInstances]);

  const handleDownload = () => {
    if ( state.downloading ) { 
      return;
    }

    let json = { entries: [] };

    state.selectedVariables.map( variable => {
      const filemeta = extractVariableFileMeta(variable);
      json.entries = json.entries.concat(filemeta);
    });

    json.entries.length > 0 ? requestZipDownload(json) : setState({...state, downloadError : true, errorMessage : configuration.text.noEntriesFound });
  }

  /**
   * Extract filemeta from geppetto model, using variable id to find it
   */
  const extractVariableFileMeta = (variable) => {
    let filesArray = [];
    state.typesChecked.map( check => {
      variable.instance[check] 
        && filesArray.push({
          Url: variable.instance[check].replace("www", "v2"),
          ZipPath: variable.id + "/" + variable.id +"_("+ variable.name + ")." + check
        });
    });

    return filesArray;
  }

  /**
   * Get array of all loaded variables in application
   */
  const getAllLoadedVariables = () => {
    let entities = allLoadedInstances;
    var visuals = [];
    for (var i = 0; i < entities.length; i++) {
      if ( entities[i]?.Images ) {
        Object.keys(entities[i]?.Images).forEach( key => {
          const entity = entities[i]?.Images[key][0];
          visuals.push({ id: entity.id, name: entity?.label, instance : entity});
        })
      } 
    }

    return visuals;
  }

  /**
   * Make axios call to download the zip
   */
  const requestZipDownload = (jsonRequest) => {
    setState({...state, downloading: true, downloadEnabled : false });
    // Axios HTTP Post request with post query
    axios({
      method: "post",
      url: configuration.postURL,
      headers: { "content-type": configuration.contentType },
      data: jsonRequest,
      responseType: "arraybuffer",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", configuration.zipName);
        document.body.appendChild(link);
        link.click();
        setTimeout(
          () =>{
            props.setBottomNav('');
            setState({
              ...state,
              downloading: false,
              open: false,
              downloadEnabled : true
            })},
          500
        );
      })
      .catch((error) => {
        setState({
          ...state,
          downloadError: true,
          downloading: false,
          errorMessage : props.classes.errorMessage
        });
      });
  }

  /**
   * Handle checkbox selection of different types to download
   */
  const handleTypeSelection = (value) => {
    const currentIndex = state.typesChecked.indexOf(value);
    const newTypesChecked = [...state.typesChecked];

    if (currentIndex === -1) {
      newTypesChecked.push(value);
    } else {
      newTypesChecked.splice(currentIndex, 1);
    }

    setState({...state, typesChecked: newTypesChecked, downloadEnabled : newTypesChecked.length > 0 && state.selectedVariables.length > 0 });
  }

  /**
   * Get variable by id, trigger by checkbox selection of variables
   */
  const getVariableById = (nodes, id) => {
    let variablesMatched = [];

    if (id === ALL_INSTANCES.id) {
      variablesMatched = nodes;
    } else {
      nodes.forEach(node => {
        if (node.id === id) {
          variablesMatched.push(node);
        }
      });
    }

    return variablesMatched;
  }

  /**
   * Toggle variable selection from checklist
   */
  const toggleVariable = (checked, node) => {
    const allNode = getVariableById(state.variables, node.id);
    let updatedVariables = checked
      ? [...state.selectedVariables, ...allNode]
      : state.selectedVariables.filter(
        value => !allNode.find( node => node.id === value.id )
      );

    updatedVariables = updatedVariables.filter((v, i) => updatedVariables.indexOf(v) === i);
    
    setState({
      ...state,
      selectedVariables: updatedVariables,
      allVariablesSelectedFlag: updatedVariables.length > 0,
      downloadEnabled : state.typesChecked.length > 0 && updatedVariables.length > 0
    });
  }

    return (
      <MuiThemeProvider theme={theme}>
        <Dialog
          open={state.open}
          onClose={handleCloseDialog}
          aria-labelledby="max-width-dialog-title"
          classes={{ root: props.classes.dialog }}
          id="downloadContents"
        >
          <DialogTitle
            id="max-width-dialog-title"
            align="center"
            onClose={handleCloseDialog}
          >
            <Typography variant="h2">{configuration.text.title}</Typography>
          </DialogTitle>
          <DialogContent key="dialog-contents" classes={{ root: props.classes.dialogContent }}>
            { !state.downloadError ? (
              <Grid container textAlign="center" spacing={2}>
                <Grid item xs={12}>
                  <Typography align="left" variant="subtitle2">
                    {configuration.text.typesSubtitle}
                  </Typography>
                </Grid>
                <Grid container textAlign="center" spacing={2}>
                  {Object.keys(configurationOptions).map(key => {
                    const option = configurationOptions[key];
                    const labelId = `checkbox-list-secondary-label-${key}`;
                    return (
                      <Grid key={key} item xs={3}>
                        <Tooltip title={ <h6>{`${option.tooltip}`}</h6> } classes={ { popper: "light" } } placement="top-start" arrow>
                          <Box
                            textAlign="center"
                            className={
                              state.typesChecked.indexOf(key) !== -1
                                ? props.classes.checkedBox
                                : null
                            }
                            p={2}
                            border={1}
                            borderColor="#E5E5E5"
                            key={option.label}
                          >
                            <img src={iconsMap[key]} alt="" />
                            <Typography
                              align="center"
                              variant="h5"
                              id={labelId}
                            >
                              {`${option.label}`}
                            </Typography>
                            <Checkbox
                              onChange={() => handleTypeSelection(key)}
                              checked={state.typesChecked.indexOf(key) !== -1}
                              inputProps={{ "aria-labelledby": labelId }}
                              disabled={state.downloading}
                              disableRipple
                              className={props.classes.checked}
                              id={option.id}
                            />
                          </Box>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                  <Divider fullWidth />
                  {state?.variables?.length > 0 ? (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">
                          {configuration.text.variablesSubtitle}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TreeView
                          defaultCollapseIcon={<ExpandMoreIcon />}
                          defaultExpanded={[ALL_INSTANCES.id]}
                          defaultExpandIcon={<ChevronRightIcon />}
                        >
                          <TreeItem
                            key={ALL_INSTANCES.id}
                            nodeId={ALL_INSTANCES.id}
                            label={
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onClick={e => e.stopPropagation()}
                                    checked={state.allVariablesSelectedFlag}
                                    onChange={event =>
                                      toggleVariable(
                                        event.currentTarget.checked,
                                        ALL_INSTANCES
                                      )
                                    }
                                    disableRipple
                                    className={props.classes.checked}
                                    id={ALL_INSTANCES.id}
                                  />
                                }
                                label={
                                  <Typography variant="h5">
                                    {ALL_INSTANCES.name}
                                  </Typography>
                                }
                                key={ALL_INSTANCES.id}
                              />
                            }
                          >
                            {state?.variables?.map(node => (
                              <TreeItem
                                key={node.id}
                                nodeId={node.id}
                                label={
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        onClick={e => e.stopPropagation()}
                                        checked={state.selectedVariables.some(
                                          item => item.id === node.id
                                        )}
                                        onChange={event =>
                                          toggleVariable(
                                            event.currentTarget.checked,
                                            node
                                          )
                                        }
                                        className={props.classes.checked}
                                        id={"Download_" + node.id}
                                      />
                                    }
                                    label={
                                      <Typography variant="h5">
                                        {node.name}
                                      </Typography>
                                    }
                                    key={node.id}
                                  />
                                }
                              />
                            ))}
                          </TreeItem>
                        </TreeView>
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="h5">{configuration.text.noVariablesSubtitle}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )
              : (
                <Grid className={props.classes.error} container textAlign="center" spacing={4}>
                  <Grid align="center" item xs={12}>
                    <i className="fa fa-info-circle"/>
                  </Grid>  
                  <Grid item xs={12}>
                    <Typography className={props.classes.errorMessage} align="left" variant="error">
                      {state.errorMessage}
                    </Typography>
                  </Grid>
                </Grid>
              )
            }
          </DialogContent>
          <DialogActions>
            <IconButton
              size="small"
              autoFocus
              onClick={handleCloseDialog}
              color="primary"
              className={props.classes.customizedButton}
            >
              <CloseIcon />
            </IconButton>
            { !state.downloadError ? (
              <Grid
                container
                classes={{ root: props.classes.footer }}
                spacing={2}
              >
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={handleCloseDialog}
                    color="primary"
                  >
                    <Typography variant="button">{configuration.text.cancelButton}</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    classes={{ root: props.classes.downloadButton }}
                    disabled={!state.downloadEnabled}
                    onClick={handleDownload}
                    variant="contained"
                    id="downloadContentsButton"
                  >
                    {state.downloading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <Typography
                        classes={{ root: props.classes.downloadButtonText }}
                        variant="button"
                      >
                        {configuration.text.downloadButton}
                      </Typography>
                    )}
                  </Button>
                </Grid>
              </Grid>
            )
              : ( 
                <Grid
                  container
                  classes={{ root: props.classes.errorFooter }}
                  spacing={12}
                >
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      classes={{ root: props.classes.downloadErrorButton }}
                      onClick={() => openDialog()}
                      color="primary"
                    >
                      <Typography classes={{ root: props.classes.error }} variant="button"><i className="fa fa-refresh"/>  {configuration.text.tryAgainButton}</Typography>
                    </Button>
                  </Grid>
                </Grid>
              )
            }
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
}

export default withStyles(styles)(VFBDownloadContents);
