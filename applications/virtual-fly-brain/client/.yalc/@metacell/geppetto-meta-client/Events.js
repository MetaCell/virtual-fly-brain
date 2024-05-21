"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Events = void 0;
/**
 * Events
 *
 * Different types of events that exist
 * 
 * @enum
 */
var Events = {
  Project_loading: "project:loading",
  Project_loaded: "project:loaded",
  Project_downloaded: "project:downloaded",
  Model_loaded: "model:loaded",
  Instance_deleted: "instance:deleted",
  Instances_created: "instances:created",
  Instance_added: "instance:added",
  Show_spinner: "spinner:show",
  Hide_spinner: "spinner:hide",
  Color_set: "color:set",
  Project_made_public: "project_made_public",
  Lit_entities_changed: "lit_entities_changed",
  Component_destroyed: "component_destroyed",
  Project_properties_saved: "project_properties_saved",
  Parameters_set: "parameters_set",
  Receive_Python_Message: "receive_python_message",
  Websocket_disconnected: "websocket_disconnected",
  Error_while_exec_python_command: "error_while_exec_python_command",
  Jupyter_geppetto_extension_ready: "jupyter_geppetto_extension_ready",
  listen: function listen() {}
};
exports.Events = Events;
var _default = Events;
exports["default"] = _default;
//# sourceMappingURL=Events.js.map