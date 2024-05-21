"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Manager = void 0;
var _EventManager = _interopRequireDefault(require("./EventManager"));
var _MessageSocket = _interopRequireDefault(require("../communication/MessageSocket"));
var _ModelFactory = _interopRequireDefault(require("@metacell/geppetto-meta-core/ModelFactory"));
var _Resources = _interopRequireDefault(require("@metacell/geppetto-meta-core/Resources"));
var _Instances = _interopRequireDefault(require("@metacell/geppetto-meta-core/Instances"));
var _ModelManager = _interopRequireDefault(require("@metacell/geppetto-meta-core/ModelManager"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var Manager = /*#__PURE__*/function () {
  function Manager() {
    _classCallCheck(this, Manager);
    _defineProperty(this, "augmentInstancesArray", _Instances["default"].augmentInstancesArray);
  }
  _createClass(Manager, [{
    key: "loadProject",
    value:
    /**
     *
     * @param payload
     */
    function loadProject(project, persisted) {
      // we remove anything from any previous loaded project if there was one
      window.Project = project;
      window.Project.readOnly = !persisted;
    }

    /**
     *
     * @param payload
     */
  }, {
    key: "loadModel",
    value: function loadModel(model) {
      _ModelManager["default"].loadModel(model);
      _EventManager["default"].modelLoaded();

      // populate control panel with instances
      _EventManager["default"].instancesCreated(window.Instances);
      console.timeEnd(_Resources["default"].LOADING_PROJECT);
      return window.Model;
    }

    /**
     * Fetch variable
     *
     * @param variableId
     * @param datasourceId
     */
  }, {
    key: "fetchVariables",
    value: function fetchVariables(variableIds, datasourceId, callback) {
      if (!Object.prototype.hasOwnProperty.call(window.Model, variableIds)) {
        var params = {};
        params["projectId"] = Project.getId();
        params["variableId"] = variableIds;
        params["dataSourceId"] = datasourceId;
        var requestID = _MessageSocket["default"].send("fetch_variable", params, callback);
        _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.SPIN_LOGO]();
      } else {
        console.log(_Resources["default"].VARIABLE_ALREADY_EXISTS);
        // the variable already exists, run the callback
        callback();
      }
    }

    /**
     * Fetch variables and instances
     *
     * @param variables
     * @param instances
     * @param worldId
     * @param datasourceId
     */
  }, {
    key: "fetch",
    value: function fetch(variableIds, instanceIds, worldId, datasourceId, callback) {
      var params = {};
      params["projectId"] = Project.getId();
      params["variables"] = variableIds;
      params["instances"] = instanceIds;
      params["worldId"] = worldId;
      params["dataSourceId"] = datasourceId;
      var requestID = _MessageSocket["default"].send("fetch", params, callback);
      _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.SPIN_LOGO]();
    }

    /**
     * Adds fetched variable to model
     *
     * @param rawModel
     */
  }, {
    key: "addVariableToModel",
    value: function addVariableToModel(rawModel) {
      console.time(_Resources["default"].ADDING_VARIABLE);
      var newInstances = _ModelManager["default"].addVariableToModel(rawModel);
      _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.INSTANCES_CREATED](newInstances);
      console.timeEnd(_Resources["default"].ADDING_VARIABLE);
      console.log(_Resources["default"].VARIABLE_ADDED);
    }

    /**
     * Resolve import type
     *
     * @param typePath
     */
  }, {
    key: "resolveImportType",
    value: function resolveImportType(typePaths, callback) {
      if (typeof typePaths == "string") {
        typePaths = [typePaths];
      }
      var params = {};
      params["projectId"] = Project.getId();
      // replace client naming first occurrence - the server doesn't know about it
      var paths = [];
      for (var i = 0; i < typePaths.length; i++) {
        paths.push(typePaths[i].replace(_Resources["default"].MODEL_PREFIX_CLIENT + ".", ''));
      }
      params["paths"] = paths;
      var requestID = _MessageSocket["default"].send("resolve_import_type", params, callback);
      _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.SPIN_LOGO]();
    }

    /**
     * Swap resolved import type with actual type
     *
     * @param rawModel
     */
  }, {
    key: "swapResolvedType",
    value: function swapResolvedType(rawModel) {
      console.time(_Resources["default"].IMPORT_TYPE_RESOLVED);

      // STEP 1: merge model - expect a fully formed Geppetto model to be merged into current one
      var diffReport = _ModelFactory["default"].mergeModel(rawModel, true);
      // STEP 2: add new instances for new types if any
      var newInstances = _ModelFactory["default"].createInstancesFromDiffReport(diffReport);
      // STEP: 3 update components
      _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.INSTANCES_CREATED](newInstances);
      console.timeEnd(_Resources["default"].IMPORT_TYPE_RESOLVED);
      console.log(_Resources["default"].IMPORT_TYPE_RESOLVED);
    }

    /**
     *
     * @param typePath
     * @param callback
     */
  }, {
    key: "resolveImportValue",
    value: function resolveImportValue(typePath, callback) {
      var params = {};
      params["projectId"] = Project.getId();
      // replace client naming first occurrence - the server doesn't know about it
      params["path"] = typePath.replace(_Resources["default"].MODEL_PREFIX_CLIENT + ".", '');
      var requestID = _MessageSocket["default"].send("resolve_import_value", params, callback);
      _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.SPIN_LOGO]();
    }

    /**
     * Swap resolved import value with actual type
     *
     * @param rawModel
     */
  }, {
    key: "swapResolvedValue",
    value: function swapResolvedValue(rawModel) {
      // STEP 1: merge model - expect a fully formed Geppetto model to be merged into current one
      var diffReport = _ModelFactory["default"].mergeValue(rawModel, true);
      console.log(_Resources["default"].IMPORT_VALUE_RESOLVED);
    }

    /**
     * Augments the instances array with some utilities methods for ease of access
     */
  }]);
  return Manager;
}();
exports.Manager = Manager;
var _default = new Manager();
exports["default"] = _default;
//# sourceMappingURL=GeppettoManager.js.map