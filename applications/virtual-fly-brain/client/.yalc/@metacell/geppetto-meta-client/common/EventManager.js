"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.callbacksList = void 0;
var _actions = require("./actions/actions");
var _actions2 = require("./actions");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var callbacksList = {};
exports.callbacksList = callbacksList;
for (var action in _actions.clientActions) {
  callbacksList[action] = new Set();
}

/**
 * Workaround to enable the use of EventManager without requiring a redux store.
 * 
 * EventManager is used across geppetto-core, but not every application has a redux store.
 */
/**
 * @deprecated
 */
var EventManager = /*#__PURE__*/function () {
  function EventManager() {
    var _this = this,
      _defineProperty2;
    _classCallCheck(this, EventManager);
    _defineProperty(this, "store", void 0);
    _defineProperty(this, "initialized", false);
    _defineProperty(this, "clientActions", _actions.clientActions);
    _defineProperty(this, "eventsCallback", callbacksList);
    _defineProperty(this, "actionsHandler", (_defineProperty2 = {}, _defineProperty(_defineProperty2, _actions.clientActions.SELECT, function (scope, geometryIdentifier, point) {
      return _this.store.dispatch((0, _actions2.selectInstance)(scope, geometryIdentifier, point));
    }), _defineProperty(_defineProperty2, _actions.clientActions.VISIBILITY_CHANGED, function (instance) {
      return _this.store.dispatch((0, _actions2.visibilityChanged)(instance));
    }), _defineProperty(_defineProperty2, _actions.clientActions.FOCUS_CHANGED, function (instance) {
      return _this.store.dispatch((0, _actions2.focusChanged)(instance));
    }), _defineProperty(_defineProperty2, _actions.clientActions.MODEL_LOADED, function () {
      return _this.store.dispatch((0, _actions2.modelLoaded)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.PROJECT_LOADING, function () {
      return _this.store.dispatch((0, _actions2.projectLoading)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.PROJECT_LOADED, function () {
      return _this.store.dispatch((0, _actions2.projectLoaded)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.PROJECT_DOWNLOADED, function () {
      return _this.store.dispatch((0, _actions2.projectDownloaded)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.PROJECT_CONFIG_LOADED, function (configuration) {
      return _this.store.dispatch((0, _actions2.projectConfigLoaded)(configuration));
    }), _defineProperty(_defineProperty2, _actions.clientActions.INSTANCE_DELETED, function (instancePath) {
      return _this.store.dispatch((0, _actions2.instanceDeleted)(instancePath));
    }), _defineProperty(_defineProperty2, _actions.clientActions.INSTANCES_CREATED, function (instances) {
      return _this.store.dispatch((0, _actions2.instancesCreated)(instances));
    }), _defineProperty(_defineProperty2, _actions.clientActions.PARAMETERS_SET, function () {
      return _this.store.dispatch((0, _actions2.parametersSet)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.RECEIVE_PYTHON_MESSAGE, function (data) {
      return _this.store.dispatch((0, _actions2.receivePythonMessage)(data));
    }), _defineProperty(_defineProperty2, _actions.clientActions.ERROR_WHILE_EXEC_PYTHON_COMMAND, function (data) {
      return _this.store.dispatch((0, _actions2.errorWhileExecPythonCommand)(data));
    }), _defineProperty(_defineProperty2, _actions.clientActions.WEBSOCKET_DISCONNECTED, function () {
      return _this.store.dispatch((0, _actions2.websocketDisconnected)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.STOP_LOGO, function () {
      return _this.store.dispatch((0, _actions2.stopLogo)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.SPIN_LOGO, function () {
      return _this.store.dispatch((0, _actions2.spinLogo)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.GEPPETTO_ERROR, function (message) {
      return _this.store.dispatch((0, _actions2.geppettoError)(message));
    }), _defineProperty(_defineProperty2, _actions.clientActions.GEPPETTO_INFO, function (message) {
      return _this.store.dispatch((0, _actions2.geppettoInfo)(message));
    }), _defineProperty(_defineProperty2, _actions.clientActions.STOP_PERSIST, function () {
      return _this.store.dispatch((0, _actions2.stopPersist)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.SPIN_PERSIST, function () {
      return _this.store.dispatch((0, _actions2.spinPersist)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.JUPYTER_GEPPETTO_EXTENSION_READY, function () {
      return _this.store.dispatch((0, _actions2.jupyterGeppettoExtensionReady)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.DISABLE_CONTROLS, function () {
      return _this.store.dispatch((0, _actions2.disableControls)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.SHOW_SPINNER, function (message, offAction) {
      _this.store.dispatch((0, _actions2.showSpinner)(message, offAction));
    }), _defineProperty(_defineProperty2, _actions.clientActions.HIDE_SPINNER, function () {
      _this.store.dispatch((0, _actions2.hideSpinner)());
    }), _defineProperty(_defineProperty2, _actions.clientActions.PROJECT_LOAD_FROM_ID, function (projectId) {
      return _this.store.dispatch((0, _actions2.loadProjectFromId)(projectId));
    }), _defineProperty(_defineProperty2, _actions.clientActions.PROJECT_LOAD_FROM_URL, function (projectUrl) {
      return _this.store.dispatch((0, _actions2.loadProjectFromUrl)(projectUrl));
    }), _defineProperty2));
    this.store = {
      dispatch: function dispatch(_) {}
    };
  }
  _createClass(EventManager, [{
    key: "setStore",
    value: function setStore(store) {
      if (this.initialized) {
        throw Error("Cannot set the store more than once");
      }
      this.store = store;
      this.initialized = true;
    }
  }, {
    key: "action",
    value: function action(_action, params) {
      this.store.dispatch({
        type: _action,
        data: _objectSpread({}, params)
      });
    }
  }, {
    key: "select",
    value: function select(scope, geometryIdentifier, point) {
      this.actionsHandler[_actions.clientActions.SELECT](scope, geometryIdentifier, point);
    }
  }, {
    key: "changeVisibility",
    value: function changeVisibility(instance) {
      this.actionsHandler[_actions.clientActions.VISIBILITY_CHANGED](instance);
    }
  }, {
    key: "changeFocus",
    value: function changeFocus(instance) {
      this.actionsHandler[_actions.clientActions.FOCUS_CHANGED](instance);
    }
  }, {
    key: "modelLoaded",
    value: function modelLoaded() {
      this.actionsHandler[_actions.clientActions.MODEL_LOADED]();
    }
  }, {
    key: "loadProjectFromId",
    value: function loadProjectFromId(projectId) {
      this.actionsHandler[_actions.clientActions.PROJECT_LOAD_FROM_ID](projectId);
    }
  }, {
    key: "loadProjectFromUrl",
    value: function loadProjectFromUrl(projectUrl) {
      this.actionsHandler[_actions.clientActions.PROJECT_LOAD_FROM_URL](projectUrl);
    }
  }, {
    key: "projectLoaded",
    value: function projectLoaded() {
      this.actionsHandler[_actions.clientActions.PROJECT_LOADED]();
    }
  }, {
    key: "projectDownloaded",
    value: function projectDownloaded() {
      this.actionsHandler[_actions.clientActions.PROJECT_DOWNLOADED]();
    }
  }, {
    key: "projectConfigLoaded",
    value: function projectConfigLoaded(configuration) {
      this.actionsHandler[_actions.clientActions.PROJECT_CONFIG_LOADED](configuration);
    }
  }, {
    key: "instanceDeleted",
    value: function instanceDeleted(instancePath) {
      this.actionsHandler[_actions.clientActions.INSTANCE_DELETED](instancePath);
    }
  }, {
    key: "instancesCreated",
    value: function instancesCreated(instances) {
      this.actionsHandler[_actions.clientActions.INSTANCES_CREATED](instances);
    }
  }, {
    key: "showQueryBuilder",
    value: function showQueryBuilder() {
      this.actionsHandler[_actions.clientActions.SHOW_QUERYBUILDER]();
    }
  }, {
    key: "hideQueryBuilder",
    value: function hideQueryBuilder() {
      this.actionsHandler[_actions.clientActions.HIDE_QUERYBUILDER]();
    }
  }, {
    key: "showSpinner",
    value: function showSpinner(message) {
      var offAction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.actionsHandler[_actions.clientActions.SHOW_SPINNER](message, offAction);
    }
  }, {
    key: "showHelp",
    value: function showHelp() {
      this.actionsHandler[_actions.clientActions.SHOW_HELP]();
    }
  }, {
    key: "hideHelp",
    value: function hideHelp() {
      this.actionsHandler[_actions.clientActions.HIDE_HELP]();
    }
  }, {
    key: "setColor",
    value: function setColor(parameters) {
      this.actionsHandler[_actions.clientActions.COLOR_SET](parameters);
    }
  }, {
    key: "projectMadePublic",
    value: function projectMadePublic() {
      this.actionsHandler[_actions.clientActions.PROJECT_MADE_PUBLIC]();
    }
  }, {
    key: "litEntitiesChanged",
    value: function litEntitiesChanged() {
      this.actionsHandler[_actions.clientActions.LIT_ENTITIES_CHANGED]();
    }
  }, {
    key: "componentDestroyed",
    value: function componentDestroyed() {
      this.actionsHandler[_actions.clientActions.COMPONENT_DESTROYED]();
    }
  }, {
    key: "projectPropertiesSaved",
    value: function projectPropertiesSaved() {
      this.actionsHandler[_actions.clientActions.PROJECT_PROPERTIES_SAVED]();
    }
  }, {
    key: "parametersSet",
    value: function parametersSet() {
      this.actionsHandler[_actions.clientActions.PARAMETERS_SET]();
    }
  }, {
    key: "receivePythonMessage",
    value: function receivePythonMessage(data) {
      this.actionsHandler[_actions.clientActions.RECEIVE_PYTHON_MESSAGE](data);
    }
  }, {
    key: "errorWhileExecPythonCommand",
    value: function errorWhileExecPythonCommand(data) {
      this.actionsHandler[_actions.clientActions.ERROR_WHILE_EXEC_PYTHON_COMMAND](data);
    }
  }, {
    key: "websocketDisconnected",
    value: function websocketDisconnected() {
      this.actionsHandler[_actions.clientActions.WEBSOCKET_DISCONNECTED]();
    }
  }, {
    key: "stopLogo",
    value: function stopLogo() {
      this.actionsHandler[_actions.clientActions.STOP_LOGO]();
    }
  }, {
    key: "spinLogo",
    value: function spinLogo() {
      this.actionsHandler[_actions.clientActions.SPIN_LOGO]();
    }
  }, {
    key: "geppettoError",
    value: function geppettoError(message) {
      this.actionsHandler[_actions.clientActions.GEPPETTO_ERROR](message);
    }
  }, {
    key: "geppettoInfo",
    value: function geppettoInfo(message) {
      this.actionsHandler[_actions.clientActions.GEPPETTO_INFO](message);
    }
  }, {
    key: "stopPersist",
    value: function stopPersist() {
      this.actionsHandler[_actions.clientActions.STOP_PERSIST]();
    }
  }, {
    key: "spinPersist",
    value: function spinPersist() {
      this.actionsHandler[_actions.clientActions.SPIN_PERSIST]();
    }
  }, {
    key: "jupyterGeppettoExtensionReady",
    value: function jupyterGeppettoExtensionReady() {
      this.actionsHandler[_actions.clientActions.JUPYTER_GEPPETTO_EXTENSION_READY]();
    }
  }, {
    key: "disableControls",
    value: function disableControls() {
      this.actionsHandler[_actions.clientActions.DISABLE_CONTROLS]();
    }

    /**
     * Add a widget to the layout
     * @param widget 
     */
  }, {
    key: "addWidget",
    value: function addWidget(widget) {
      this.store.dispatch((0, _actions2.addWidget)(widget));
    }

    /**
     * Update a widget
     * @param widget 
     */
  }, {
    key: "updateWidget",
    value: function updateWidget(widget) {
      this.store.dispatch((0, _actions2.updateWidget)(widget));
    }

    /**
     * Adds all the widgets to the layout
     * @param widget 
     */
  }, {
    key: "addWidgets",
    value: function addWidgets(widget) {
      this.store.dispatch((0, _actions2.addWidgets)(widget));
    }

    /**
     * Set/replaces widgets to the layout
     * @param widget 
     */
  }, {
    key: "setWidgets",
    value: function setWidgets(widget) {
      this.store.dispatch((0, _actions2.setWidgets)(widget));
    }

    /**
     * Removes a widget from the layout
     * @param widget 
     */
  }, {
    key: "deleteWidget",
    value: function deleteWidget(widgetId) {
      this.store.dispatch((0, _actions2.deleteWidget)(widgetId));
    }

    /**
    * Set widget to minimized status (sugar for update widget)
    * @param widget 
    */
  }, {
    key: "minimizeWidget",
    value: function minimizeWidget(widgetId) {
      this.store.dispatch((0, _actions2.minimizeWidget)(widgetId));
    }

    /**
    * Set widget to maximize status (sugar for update widget)
    * @param widget 
    */
  }, {
    key: "maximizeWidget",
    value: function maximizeWidget(widgetId) {
      this.store.dispatch((0, _actions2.maximizeWidget)(widgetId));
    }

    /**
     * Set widget to active status (sugar for update widget)
     * @param widget 
     */
  }, {
    key: "activateWidget",
    value: function activateWidget(widgetId) {
      this.store.dispatch((0, _actions2.activateWidget)(widgetId));
    }
  }]);
  return EventManager;
}();
var _default = new EventManager();
exports["default"] = _default;
//# sourceMappingURL=EventManager.js.map