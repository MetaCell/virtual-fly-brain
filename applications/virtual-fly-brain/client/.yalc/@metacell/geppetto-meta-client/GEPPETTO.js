"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.initGeppetto = initGeppetto;
var _EventsMapping;
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
/**
 *
 * @author Matteo Cantarelli
 * @authot Jesus R Martinez (jesus@metacell.us)
 * @deprecated
 */

var EventManager = require('./common/EventManager')["default"];
var Events = require('./Events')["default"];
var Resources = require('@metacell/geppetto-meta-core/Resources')["default"];
var Manager = require('./common/GeppettoManager')["default"];
var ComponentFactory = require('./components/ComponentFactory')["default"];
var ModelFactory = require('@metacell/geppetto-meta-core/ModelFactory')["default"];
require('./style/less/main.less');

/**
 * Initialise Geppetto
 *
 * @class GEPPETTO
 */
var GEPPETTO = {
  debug: true,
  Resources: Resources,
  Manager: Manager,
  ModelFactory: ModelFactory,
  Events: Events,
  /**
   * @param{String} key - The pressed key
   * @returns {boolean} True if the key is pressed
   */
  isKeyPressed: function isKeyPressed(key) {
    return this.keyboard.pressed(key);
  },
  /**
   * @param msg
   */
  log: function log(msg) {
    var d = new Date();
    var curr_hour = d.getHours();
    var curr_min = d.getMinutes();
    var curr_sec = d.getSeconds();
    var curr_msec = d.getMilliseconds();
    console.debug(curr_hour + ":" + curr_min + ":" + curr_sec + ":" + curr_msec + ' - ' + msg, "");
  },
  /**
   * @param category
   * @param action
   * @param opt_label
   * @param opt_value
   * @param opt_noninteraction
   */
  trackActivity: function trackActivity(category, action, opt_label, opt_value, opt_noninteraction) {
    if (typeof _gaq != 'undefined') {
      _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
    }
  },
  winHeight: function winHeight() {
    return window.innerHeight || (document.documentElement || document.body).clientHeight;
  },
  trigger: function trigger() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length == 0) {
      console.error("Trigger should be provided of the event to trigger");
      return;
    } else {
      var _event = args.shift();
      var handleFn = EventManager.actionsHandler[EventsMapping[_event]];
      if (handleFn) {
        handleFn.apply(void 0, args);
      }
    }
  },
  on: function on(eventName, callback) {
    EventManager.eventsCallback[EventsMapping[eventName]].add(callback);
  },
  off: function off(eventName) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (!eventName && callback) {
      for (var _i = 0, _Object$values = Object.values(EventManager.eventsCallback); _i < _Object$values.length; _i++) {
        var l = _Object$values[_i];
        EventManager.eventsCallback[EventsMapping[l]]["delete"](callback);
      }
    } else if (eventName && !callback) {
      EventManager.eventsCallback[EventsMapping[eventName]].clear();
    } else if (eventName && callback) {
      EventManager.eventsCallback[EventsMapping[eventName]]["delete"](callback);
    } else {
      for (var _i2 = 0, _Object$values2 = Object.values(EventManager.eventsCallback); _i2 < _Object$values2.length; _i2++) {
        var _l = _Object$values2[_i2];
        EventManager.eventsCallback[EventsMapping[_l]].clear(callback);
      }
    }
  }
};
var EventsMapping = (_EventsMapping = {}, _defineProperty(_EventsMapping, Events.Select, EventManager.clientActions.SELECT), _defineProperty(_EventsMapping, Events.Visibility_changed, EventManager.clientActions.VISIBILITY_CHANGED), _defineProperty(_EventsMapping, Events.Focus_changed, EventManager.clientActions.FOCUS_CHANGED), _defineProperty(_EventsMapping, Events.Project_loading, EventManager.clientActions.PROJECT_LOADING), _defineProperty(_EventsMapping, Events.Project_loaded, EventManager.clientActions.PROJECT_LOADED), _defineProperty(_EventsMapping, Events.Project_downloaded, EventManager.clientActions.PROJECT_DOWNLOADED), _defineProperty(_EventsMapping, Events.Model_loaded, EventManager.clientActions.MODEL_LOADED), _defineProperty(_EventsMapping, Events.ModelTree_populated, EventManager.clientActions.MODELTREE_POPULATED), _defineProperty(_EventsMapping, Events.SimulationTree_populated, EventManager.clientActions.SIMULATIONTREE_POPULATED), _defineProperty(_EventsMapping, Events.Instance_deleted, EventManager.clientActions.INSTANCE_DELETED), _defineProperty(_EventsMapping, Events.Instances_created, EventManager.clientActions.INSTANCES_CREATED), _defineProperty(_EventsMapping, Events.Instance_added, EventManager.clientActions.INSTANCE_ADDED), _defineProperty(_EventsMapping, Events.Show_spinner, EventManager.clientActions.SHOW_SPINNER), _defineProperty(_EventsMapping, Events.Hide_spinner, EventManager.clientActions.HIDE_SPINNER), _defineProperty(_EventsMapping, Events.Color_set, EventManager.clientActions.COLOR_SET), _defineProperty(_EventsMapping, Events.Project_made_public, EventManager.clientActions.PROJECT_MADE_PUBLIC), _defineProperty(_EventsMapping, Events.Lit_entities_changed, EventManager.clientActions.LIT_ENTITIES_CHANGED), _defineProperty(_EventsMapping, Events.Component_destroyed, EventManager.clientActions.COMPONENT_DESTROYED), _defineProperty(_EventsMapping, Events.Project_properties_saved, EventManager.clientActions.PROJECT_PROPERTIES_SAVED), _defineProperty(_EventsMapping, Events.Parameters_set, EventManager.clientActions.PARAMETERS_SET), _defineProperty(_EventsMapping, Events.Receive_Python_Message, EventManager.clientActions.RECEIVE_PYTHON_MESSAGE), _defineProperty(_EventsMapping, Events.Websocket_disconnected, EventManager.clientActions.WEBSOCKET_DISCONNECTED), _defineProperty(_EventsMapping, Events.Error_while_exec_python_command, EventManager.clientActions.ERROR_WHILE_EXEC_PYTHON_COMMAND), _defineProperty(_EventsMapping, Events.Jupyter_geppetto_extension_ready, EventManager.clientActions.JUPYTER_GEPPETTO_EXTENSION_READY), _EventsMapping);
function initGeppetto() {
  var useWebsocket = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var loadStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!window.GEPPETTO_CONFIGURATION) {
    window.GEPPETTO_CONFIGURATION = {};
  }
  if (useWebsocket) {
    var WSMain = require('./WebsocketMain')["default"];
    WSMain.init();
    GEPPETTO.MessageSocket = WSMain.socket;
  }
  if (loadStyle) {
    require('./style/less/main.less');
  }
  GEPPETTO.ComponentFactory = ComponentFactory;
  window.GEPPETTO = GEPPETTO;
}
var _default = GEPPETTO;
exports["default"] = _default;
//# sourceMappingURL=GEPPETTO.js.map