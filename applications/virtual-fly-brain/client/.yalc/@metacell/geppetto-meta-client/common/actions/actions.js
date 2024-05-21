"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.websocketDisconnected = exports.waitData = exports.visibilityChanged = exports.stopPersist = exports.stopLogo = exports.spinPersist = exports.spinLogo = exports.showSpinner = exports.showQueryBuilder = exports.showHelp = exports.selectInstance = exports.receivePythonMessage = exports.projectPropertiesSaved = exports.projectMadePublic = exports.projectLoading = exports.projectLoaded = exports.projectDownloaded = exports.projectConfigLoaded = exports.parametersSet = exports.modelLoaded = exports.loadProjectFromUrl = exports.loadProjectFromId = exports.litEntitiesChanged = exports.jupyterGeppettoExtensionReady = exports.instancesCreated = exports.instanceDeleted = exports.hideSpinner = exports.hideQueryBuilder = exports.hideHelp = exports.geppettoInfo = exports.geppettoError = exports.focusChanged = exports.errorWhileExecPythonCommand = exports.disableControls = exports.componentDestroyed = exports.clientActions = exports.backendActions = exports.IMPORT_APPLICATION_STATE = void 0;
// Client actions
var clientActions = {
  SELECT: "SELECTION_CHANGED",
  VISIBILITY_CHANGED: "VISIBILITY_CHANGED",
  FOCUS_CHANGED: "FOCUS_CHANGED",
  PROJECT_LOADING: "PROJECT_LOADING",
  PROJECT_LOADED: "PROJECT_LOADED",
  PROJECT_DOWNLOADED: "PROJECT_DOWNLOADED",
  PROJECT_CONFIG_LOADED: "PROJECT_CONFIG_LOADED",
  PROJECT_LOAD_FROM_ID: "PROJECT_LOAD_FROM_ID",
  PROJECT_LOAD_FROM_URL: "PROJECT_LOAD_FROM_URL",
  MODEL_LOADED: "MODEL_LOADED",
  MODELTREE_POPULATED: "MODELTREE_POPULATED",
  SIMULATIONTREE_POPULATED: "SIMULATIONTREE_POPULATED",
  INSTANCE_ADDED: "INSTANCE_ADDED",
  INSTANCE_DELETED: "INSTANCE_DELETED",
  INSTANCES_CREATED: "INSTANCES_CREATED",
  SHOW_SPINNER: "SHOW_SPINNER",
  HIDE_SPINNER: "HIDE_SPINNER",
  SHOW_HELP: "SHOW_HELP",
  HIDE_HELP: "HIDE_HELP",
  SHOW_QUERYBUILDER: "SHOW_QUERYBUILDER",
  HIDE_QUERYBUILDER: "HIDE_QUERYBUILDER",
  COLOR_SET: "COLOR_SET",
  PROJECT_MADE_PUBLIC: "PROJECT_MADE_PUBLIC",
  LIT_ENTITIES_CHANGED: "LIT_ENTITIES_CHANGED",
  COMPONENT_DESTROYED: "COMPONENT_DESTROYED",
  PROJECT_PROPERTIES_SAVED: "PROJECT_PROPERTIES_SAVED",
  PARAMETERS_SET: "PARAMETERS_SET",
  RECEIVE_PYTHON_MESSAGE: "RECEIVE_PYTHON_MESSAGE",
  WEBSOCKET_DISCONNECTED: "WEBSOCKET_DISCONNECTED",
  ERROR_WHILE_EXEC_PYTHON_COMMAND: "ERROR_WHILE_EXEC_PYTHON_COMMAND",
  SPIN_LOGO: "SPIN_LOGO",
  STOP_LOGO: "STOP_LOGO",
  SPIN_PERSIST: "SPIN_PERSIST",
  STOP_PERSIST: "STOP_PERSIST",
  GEPPETTO_ERROR: "ERROR",
  GEPPETTO_INFO: "INFO",
  JUPYTER_GEPPETTO_EXTENSION_READY: "JUPYTER_GEPPETTO_EXTENSION_READY",
  DISABLE_CONTROLS: "DISABLE_CONTROLS"
};
exports.clientActions = clientActions;
var backendActions = {
  CLIENT_ID: "client_id",
  ERROR_LOADING_SIM: "error_loading_simulation",
  ERROR_LOADING_PROJECT: "error_loading_project",
  ERROR_DOWNLOADING_MODEL: "error_downloading_model",
  ERROR_DOWNLOADING_RESULTS: "error_downloading_results",
  ERROR: "generic_error",
  INFO_MESSAGE: "info_message",
  GEPPETTO_VERSION: "geppetto_version",
  RECONNECTION_ERROR: "reconnection_error",
  USER_PRIVILEGES: "user_privileges",
  PROJECT_LOADED: "project_loaded",
  DOWNLOAD_PROJECT: "download_project",
  MODEL_LOADED: "geppetto_model_loaded",
  PROJECT_PROPS_SAVED: "project_props_saved",
  VARIABLE_FETCHED: "variable_fetched",
  IMPORT_TYPE_RESOLVED: "import_type_resolved",
  IMPORT_VALUE_RESOLVED: "import_value_resolved",
  SET_WATCHED_VARIABLES: "set_watched_variables",
  WATCHED_VARIABLES_SET: "watched_variables_set",
  CLEAR_WATCH: "clear_watch",
  GET_MODEL_TREE: "get_model_tree",
  GET_SIMULATION_TREE: "get_simulation_tree",
  SET_PARAMETERS: "set_parameters",
  NO_FEATURE: "no_feature",
  GET_SUPPORTED_OUTPUTS: "get_supported_outputs",
  RESULTS_UPLOADED: "results_uploaded",
  MODEL_UPLOADED: "model_uploaded",
  UPDATE_MODEL_TREE: "update_model_tree",
  DOWNLOAD_MODEL: "download_model",
  DOWNLOAD_RESULTS: "download_results",
  PROJECT_MADE_PUBLIC: "project_made_public",
  FETCHED: "fetched"
};
exports.backendActions = backendActions;
var IMPORT_APPLICATION_STATE = 'IMPORT_APPLICATION_STATE';
exports.IMPORT_APPLICATION_STATE = IMPORT_APPLICATION_STATE;
var selectInstance = function selectInstance(scope, geometryIdentifier, point) {
  return {
    type: clientActions.SELECT,
    data: {
      scope: scope,
      geometryIdentifier: geometryIdentifier,
      point: point
    }
  };
};
exports.selectInstance = selectInstance;
var visibilityChanged = function visibilityChanged(instance) {
  return {
    type: clientActions.VISIBILITY_CHANGED,
    data: {
      instance: instance
    }
  };
};
exports.visibilityChanged = visibilityChanged;
var focusChanged = function focusChanged(instance) {
  return {
    type: clientActions.FOCUS_CHANGED,
    data: {
      instance: instance
    }
  };
};
exports.focusChanged = focusChanged;
var modelLoaded = function modelLoaded() {
  return {
    type: clientActions.MODEL_LOADED,
    data: {
      model_status: clientActions.MODEL_LOADED
    }
  };
};
exports.modelLoaded = modelLoaded;
var projectLoading = function projectLoading() {
  return {
    type: clientActions.PROJECT_LOADING,
    data: {
      project_status: clientActions.PROJECT_LOADING
    }
  };
};
exports.projectLoading = projectLoading;
var projectLoaded = function projectLoaded() {
  return {
    type: clientActions.PROJECT_LOADED,
    data: {
      project_status: clientActions.PROJECT_LOADED
    }
  };
};
exports.projectLoaded = projectLoaded;
var projectDownloaded = function projectDownloaded() {
  return {
    type: clientActions.PROJECT_DOWNLOADED,
    data: {
      project_status: clientActions.PROJECT_DOWNLOADED
    }
  };
};
exports.projectDownloaded = projectDownloaded;
var projectConfigLoaded = function projectConfigLoaded(configuration) {
  return {
    type: clientActions.PROJECT_CONFIG_LOADED,
    data: configuration
  };
};

// HERE
exports.projectConfigLoaded = projectConfigLoaded;
var instanceDeleted = function instanceDeleted(instancePath) {
  return {
    type: clientActions.INSTANCE_DELETED,
    data: instancePath
  };
};
exports.instanceDeleted = instanceDeleted;
var instancesCreated = function instancesCreated(instances) {
  return {
    type: clientActions.INSTANCES_CREATED,
    data: instances
  };
};
exports.instancesCreated = instancesCreated;
var showQueryBuilder = function showQueryBuilder() {
  return {
    type: clientActions.SHOW_QUERYBUILDER
  };
};
exports.showQueryBuilder = showQueryBuilder;
var hideQueryBuilder = function hideQueryBuilder() {
  return {
    type: clientActions.HIDE_QUERYBUILDER
  };
};
exports.hideQueryBuilder = hideQueryBuilder;
var showSpinner = function showSpinner(message) {
  var offAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return {
    type: clientActions.SHOW_SPINNER,
    data: {
      message: message,
      offAction: offAction
    }
  };
};
exports.showSpinner = showSpinner;
var waitData = showSpinner;
exports.waitData = waitData;
var hideSpinner = function hideSpinner() {
  return {
    type: clientActions.HIDE_SPINNER
  };
};
exports.hideSpinner = hideSpinner;
var showHelp = function showHelp() {
  return {
    type: clientActions.SHOW_HELP
  };
};
exports.showHelp = showHelp;
var hideHelp = function hideHelp() {
  return {
    type: clientActions.HIDE_HELP
  };
};
exports.hideHelp = hideHelp;
var projectMadePublic = function projectMadePublic() {
  return {
    type: clientActions.PROJECT_MADE_PUBLIC
  };
};
exports.projectMadePublic = projectMadePublic;
var litEntitiesChanged = function litEntitiesChanged() {
  return {
    type: clientActions.LIT_ENTITIES_CHANGED
  };
};
exports.litEntitiesChanged = litEntitiesChanged;
var componentDestroyed = function componentDestroyed() {
  return {
    type: clientActions.COMPONENT_DESTROYED
  };
};
exports.componentDestroyed = componentDestroyed;
var projectPropertiesSaved = function projectPropertiesSaved() {
  return {
    type: clientActions.PROJECT_PROPERTIES_SAVED
  };
};
exports.projectPropertiesSaved = projectPropertiesSaved;
var parametersSet = function parametersSet() {
  return {
    type: clientActions.PARAMETERS_SET,
    data: {
      timestamp: new Date().getTime().toString()
    }
  };
};
exports.parametersSet = parametersSet;
var errorWhileExecPythonCommand = function errorWhileExecPythonCommand(data) {
  return {
    type: clientActions.ERROR_WHILE_EXEC_PYTHON_COMMAND,
    data: {
      id: undefined,
      type: "ERROR",
      response: data,
      timestamp: new Date().getTime().toString()
    }
  };
};
exports.errorWhileExecPythonCommand = errorWhileExecPythonCommand;
var websocketDisconnected = function websocketDisconnected() {
  return {
    type: clientActions.WEBSOCKET_DISCONNECTED
  };
};
exports.websocketDisconnected = websocketDisconnected;
var spinLogo = function spinLogo() {
  return {
    type: clientActions.SPIN_LOGO
  };
};
exports.spinLogo = spinLogo;
var stopLogo = function stopLogo() {
  return {
    type: clientActions.STOP_LOGO
  };
};
exports.stopLogo = stopLogo;
var geppettoError = function geppettoError(message) {
  return {
    type: clientActions.GEPPETTO_ERROR,
    data: {
      latestUpdate: new Date().getTime().toString(),
      message: message
    }
  };
};
exports.geppettoError = geppettoError;
var geppettoInfo = function geppettoInfo(message) {
  return {
    type: clientActions.GEPPETTO_INFO,
    data: {
      latestUpdate: new Date().getTime().toString(),
      message: message
    }
  };
};
exports.geppettoInfo = geppettoInfo;
var spinPersist = function spinPersist() {
  return {
    type: clientActions.SPIN_PERSIST
  };
};
exports.spinPersist = spinPersist;
var stopPersist = function stopPersist() {
  return {
    type: clientActions.STOP_PERSIST
  };
};
exports.stopPersist = stopPersist;
var jupyterGeppettoExtensionReady = function jupyterGeppettoExtensionReady() {
  return {
    type: clientActions.JUPYTER_GEPPETTO_EXTENSION_READY
  };
};
exports.jupyterGeppettoExtensionReady = jupyterGeppettoExtensionReady;
var disableControls = function disableControls() {
  return {
    type: clientActions.DISABLE_CONTROLS
  };
};
exports.disableControls = disableControls;
var receivePythonMessage = function receivePythonMessage(data) {
  return {
    type: clientActions.RECEIVE_PYTHON_MESSAGE,
    data: {
      id: data.id,
      type: data.type,
      response: data.response,
      timestamp: new Date().getTime().toString()
    }
  };
};
exports.receivePythonMessage = receivePythonMessage;
var loadProjectFromId = function loadProjectFromId(projectId) {
  return {
    type: clientActions.PROJECT_LOAD_FROM_ID,
    data: projectId
  };
};
exports.loadProjectFromId = loadProjectFromId;
var loadProjectFromUrl = function loadProjectFromUrl(projectUrl) {
  return {
    type: clientActions.PROJECT_LOAD_FROM_URL,
    data: projectUrl
  };
};
exports.loadProjectFromUrl = loadProjectFromUrl;
//# sourceMappingURL=actions.js.map