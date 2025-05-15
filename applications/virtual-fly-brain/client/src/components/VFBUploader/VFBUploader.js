import React from "react";
import { 
  Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel,
  FormGroup, InputLabel, Select, Typography, IconButton, Divider, Box, TextField,
  ListItemIcon, ListItemText, Checkbox, MenuItem, Button, LinearProgress, CircularProgress, Grid
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from '@material-ui/icons/Check';
import InfoIcon from '@material-ui/icons/Info';
import ReplayIcon from '@material-ui/icons/Replay';
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import axios from "axios";
import { DropzoneArea } from "material-ui-dropzone";
import UploadIcon from "../../components/configuration/VFBUploader/upload-icon.png";
import { nanoid } from 'nanoid';
import FileIcon from "../../components/configuration/VFBUploader/file-icon.png";
import { CustomStyle, CustomTheme } from "./styles";

const UNIQUE_ID = "UNIQUE_ID";
const VFBUploader = (props) => {
    const [state, setState] = React.useState({
      open: props.open,
      fileNBLASTURL: "",
      nblastEnabled: false,
      files: [],
      templateSelected: "",
      progress: 100,
      cookies : false,
      error : false,
      uploading : false
    })

  const configuration = require("../../components/configuration/VFBUploader/configuration");
  
  const handleCookieEvent = (event) => {
    setState({ ...state, cookies : event.target.checked })
  }

  const handleCloseDialog = () => {
    props.setBottomNav('');
    setState({...state, open: false });
  }

  const handleDropZoneChange = (files) => {
    setState({...state, files: files });
  }

  const handleFileDelete = () => {
    setState({...state, files: [], nblastEnabled: false });
  }

  const handleTemplateChange = (event) => {
    setState({...state, templateSelected: event.target.value });
  }

  const openDialog = () =>{
    setState({...state, open: true });
  }

  const handleNBLASTAction = () => {
    let newId = "VFBu_" + nanoid(8);
    let url = configuration.nblastURL.replace(UNIQUE_ID, state.templateSelected + "&" + newId);
    var formData = new FormData();
    formData.append("file", state.files[0]);
    formData.append("vfbID", newId);
    formData.append("templateID", state.templateSelected);
    requestUpload(formData, url);
  }

  /**
   * Make axios call to upload to server
   */
   const requestUpload = (formData, url) => {
    let _id = formData.get("vfbID");
    let newURL = window.location.origin + window.location.pathname + "&q=" + _id + "," + configuration.queryType;

    setState({...state, fileNBLASTURL: newURL, uploading : true });
    // window.setCookie(_id, newURL, configuration.cookieStorageDays);

    axios.put(url,
      formData, { headers: { 'Content-Type': configuration.contentType } }
    ).then((response) => {
      setState({...state, uploading : false, fileNBLASTURL : newURL, nblastEnabled: true });
    })
      .catch((error) => {
        setState({...state, error : true, uploading : false });
      });
  }
  
  const getTitleHead = () => {
    return (<Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">{configuration.text.dialogTitle}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">{configuration.text.dialogSubtitle}</Typography>
      </Grid>
    </Grid>);
  }
  
  const getUploaderComponents = () =>{
    const { classes } = props;
    return (
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Typography align="left" variant="h5"> {configuration.text.selectTemplate}</Typography>
          <FormControl fullWidth>
            <Select
              value={state.templateSelected}
              onChange={handleTemplateChange}
              inputProps={{
                name: "template",
                id: "template-selection",
              }}
              color="primary"
              disabled={state.uploading}
            >
              <MenuItem value="Select">
                { state.templateSelected === configuration.text.select
                  ? <ListItemIcon>
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                  : null
                }
                <ListItemText>Select</ListItemText>
              </MenuItem>
              {configuration.templates.map( template => (
                <MenuItem key={template.label} value={template.label}>
                  { state.templateSelected === template.label
                    ? <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                    : null
                  }
                  <ListItemText>{template.label}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography align="left" variant="h5"> {configuration.text.addYourFile}</Typography>
          {state.files.length > 0 ? (
            <Grid className={classes.marginTop} container>
              <Grid item xs={1}>
                <Box mt={1}>
                  <img src={FileIcon} alt="" />
                </Box>
              </Grid>
              <Grid align="left" item xs={10}>
                <Box pt={1}>
                  <Typography align="left" variant="caption">{state.files[0].name}</Typography>
                  <LinearProgress className={classes.vfbColor} variant="buffer" value={state.progress} />
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Box mt={1.5}> 
                  <IconButton disabled={state.uploading} autoFocus size="small" variant="outlined" onClick={handleFileDelete}><DeleteIcon /></IconButton>
                </Box>
              </Grid>
            </Grid>
          )
            : <DropzoneArea
              onChange={handleDropZoneChange}
              onDelete={handleFileDelete}
              acceptedFiles={configuration.acceptedFiles}
              maxFileSize={configuration.maxFileSize}
              filesLimit={configuration.filesLimit}
              dropzoneText={configuration.text.dropZoneMessage}
              Icon={() => <img src={UploadIcon} alt="upload" />}
              showAlerts={["error"]}
              fullWidth
              showPreviewsInDropzone={false}
              dropzoneClass={classes.dropzoneArea}
            />
          }
        </Grid>
        <Box className={classes.cookiesBox} mt={2}>
          <Checkbox inputProps={{ "aria-labelledby": "cookies-store" }} className={classes.checked} onChange={event => handleCookieEvent(event)} checked={state.cookies} />
          <Typography id={"cookies-store"} variant="h5">
            {configuration.text.agreeTerms}
            <a target="_blank" href={configuration.cookiesLearnLink} rel="noreferrer">{configuration.text.learnMore}</a>
          </Typography>
        </Box>
      </Grid>
    );
  }
          
  const getSuccessComponent = () => {
    const { classes } = props;
    return (
      <Grid container>
        <Grid item xs={9}>
          <TextField
            value={state.fileNBLASTURL}
            variant="filled"
            color="primary"
            fullWidth
            InputProps={{ disableUnderline: true, spellCheck: 'false' }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            size="small"
            startIcon={<FileCopyIcon />}
            classes={{ root : classes.nblastButton }}
            onClick={() => { 
              navigator.clipboard.writeText(state.fileNBLASTURL)
            }}
          >
            {configuration.text.copyButtonText}
          </Button>
        </Grid>
        <Grid container className={classes.marginTop}>
          <Grid item xs={2}>
            <InfoIcon fontSize="small"/>
          </Grid>
          <Grid item xs={10}>
            <Typography fullwidth variant="h5">
              {configuration.text.infoMessage}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );  
  }
  
  const getErrorDialog = () => {
    const { classes } = props;
  
    return (
      <Grid container>
        <Grid container justify="center" spacing={1}>
          <Grid item xs={2}>
            <InfoIcon color="error" fontSize="small"/>
          </Grid>
          <Grid item xs={12}>
            <Typography color="error" fullwidth variant="h5">
              {configuration.text.errorDialog}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );  
  }        
          
  const getUploadActions = () => {
    const { classes } = props;

    return (
      <>
        <IconButton size="small" onClick={handleCloseDialog} color="primary" className={classes.customizedButton}>
          <CloseIcon />
        </IconButton> 
        <Grid container spacing={2}>
          { !state.error
            ? !state.nblastEnabled ? (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  disabled={state.files.length == 0 || state.uploading}
                  onClick={handleNBLASTAction}
                  variant="contained"
                  classes={{ root : classes.nblastButton }}
                >
                  {state.uploading ? <CircularProgress color="secondary" size={10} /> : configuration.text.blastButtonText}
                </Button>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Button
                  fullWidth
                  startIcon={<ReplayIcon color="primary" />}
                  onClick={() => setState({...state, fileNBLASTURL : "", nblastEnabled : false, files : [], templateSelected: "" }) }
                  variant="outlined"
                >
                  {configuration.text.restartButtonText}
                </Button>
              </Grid>
            )
            : <Grid item xs={12}>
              <Button
                fullWidth
                variant="outlined"
                classes={{ root : classes.errorButton }}
                startIcon={<ReplayIcon color="error" />}
                onClick={() => setState({...state, fileNBLASTURL : "", error : false, nblastEnabled : false, files : [], templateSelected: "" }) }
              >
                {configuration.text.errorButtonText}
              </Button>
            </Grid>
          }
        </Grid>
      </>
    );  
  }

    return (
      <MuiThemeProvider theme={CustomTheme}>
        <Dialog
          open={state.open}
          onClose={handleCloseDialog}
          aria-labelledby="max-width-dialog-title"
          maxWidth="lg"
          classes={{ root: props.classes.dialog }}
        >
          <DialogTitle
            align="center"
            id="max-width-dialog-title"
            onClose={handleCloseDialog}
          >
            {getTitleHead()}
          </DialogTitle>
          <DialogContent
            style={{ height: "auto", overflow: "hidden" }}
            align="center"
          >
            { !state.error
              ? !state.nblastEnabled ? getUploaderComponents() : getSuccessComponent()
              : getErrorDialog() 
            }
          </DialogContent>
          <Divider fullWidth />
          <DialogActions className={state.error ? props.classes.errorButton : props.classes.vfbColor} align="center">
            {getUploadActions()}
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
}

export default withStyles(CustomStyle)(VFBUploader);
