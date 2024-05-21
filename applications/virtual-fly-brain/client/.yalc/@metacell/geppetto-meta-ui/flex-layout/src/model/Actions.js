"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Action = _interopRequireDefault(require("./Action"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * The Action creator class for FlexLayout model actions
 */
var Actions = /*#__PURE__*/function () {
  function Actions() {
    _classCallCheck(this, Actions);
  }
  return _createClass(Actions, null, [{
    key: "addNode",
    value:
    /**
     * Adds a tab node to the given tabset node
     * @param json the json for the new tab node e.g {type:"tab", component:"table"}
     * @param toNodeId the new tab node will be added to the tabset with this node id
     * @param location the location where the new tab will be added, one of the DockLocation enum values.
     * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
     * @param select (optional) whether to select the new tab, overriding autoSelectTab
     * @returns {{type: (string|string), json: *, toNode: *, location: (*|string), index: *, select?: boolean}}
     */
    function addNode(json, toNodeId, location, index, select) {
      return new _Action["default"](Actions.ADD_NODE, {
        json: json,
        toNode: toNodeId,
        location: location.getName(),
        index: index,
        select: select
      });
    }

    /**
     * Moves a node (tab or tabset) from one location to another
     * @param fromNodeId the id of the node to move
     * @param toNodeId the id of the node to receive the moved node
     * @param location the location where the moved node will be added, one of the DockLocation enum values.
     * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
     * @param select (optional) whether to select the moved tab(s) in new tabset, overriding autoSelectTab
     * @returns {{type: (string|string), fromNode: *, toNode: *, location: (*|string), index: *}}
     */
  }, {
    key: "moveNode",
    value: function moveNode(fromNodeId, toNodeId, location, index, select) {
      return new _Action["default"](Actions.MOVE_NODE, {
        fromNode: fromNodeId,
        toNode: toNodeId,
        location: location.getName(),
        index: index,
        select: select
      });
    }

    /**
     * Deletes a tab node from the layout
     * @param tabNodeId the id of the node to delete
     * @returns {{type: (string|string), node: *}}
     */
  }, {
    key: "deleteTab",
    value: function deleteTab(tabNodeId) {
      return new _Action["default"](Actions.DELETE_TAB, {
        node: tabNodeId
      });
    }

    /**
     * Change the given nodes tab text
     * @param tabNodeId the id of the node to rename
     * @param text the test of the tab
     * @returns {{type: (string|string), node: *, text: *}}
     */
  }, {
    key: "renameTab",
    value: function renameTab(tabNodeId, text) {
      return new _Action["default"](Actions.RENAME_TAB, {
        node: tabNodeId,
        text: text
      });
    }

    /**
     * Selects the given tab in its parent tabset
     * @param tabNodeId the id of the node to set selected
     * @returns {{type: (string|string), tabNode: *}}
     */
  }, {
    key: "selectTab",
    value: function selectTab(tabNodeId) {
      return new _Action["default"](Actions.SELECT_TAB, {
        tabNode: tabNodeId
      });
    }

    /**
     * Set the given tabset node as the active tabset
     * @param tabsetNodeId the id of the tabset node to set as active
     * @returns {{type: (string|string), tabsetNode: *}}
     */
  }, {
    key: "setActiveTabset",
    value: function setActiveTabset(tabsetNodeId) {
      return new _Action["default"](Actions.SET_ACTIVE_TABSET, {
        tabsetNode: tabsetNodeId
      });
    }

    /**
     * Adjust the splitter between two tabsets
     * @example
     *  Actions.adjustSplit({node1: "1", weight1:30, pixelWidth1:300, node2: "2", weight2:70, pixelWidth2:700});
     *
     * @param splitSpec an object the defines the new split between two tabsets, see example below.
     * @returns {{type: (string|string), node1: *, weight1: *, pixelWidth1: *, node2: *, weight2: *, pixelWidth2: *}}
     */
  }, {
    key: "adjustSplit",
    value: function adjustSplit(splitSpec) {
      var node1 = splitSpec.node1Id;
      var node2 = splitSpec.node2Id;
      return new _Action["default"](Actions.ADJUST_SPLIT, {
        node1: node1,
        weight1: splitSpec.weight1,
        pixelWidth1: splitSpec.pixelWidth1,
        node2: node2,
        weight2: splitSpec.weight2,
        pixelWidth2: splitSpec.pixelWidth2
      });
    }
  }, {
    key: "adjustBorderSplit",
    value: function adjustBorderSplit(nodeId, pos) {
      return new _Action["default"](Actions.ADJUST_BORDER_SPLIT, {
        node: nodeId,
        pos: pos
      });
    }

    /**
     * Maximizes the given tabset
     * @param tabsetNodeId the id of the tabset to maximize
     * @returns {{type: (string|string), node: *}}
     */
  }, {
    key: "maximizeToggle",
    value: function maximizeToggle(tabsetNodeId) {
      return new _Action["default"](Actions.MAXIMIZE_TOGGLE, {
        node: tabsetNodeId
      });
    }

    /**
     * Updates the global model jsone attributes
     * @param attributes the json for the model attributes to update (merge into the existing attributes)
     * @returns {{type: (string|string), json: *}}
     */
  }, {
    key: "updateModelAttributes",
    value: function updateModelAttributes(attributes) {
      return new _Action["default"](Actions.UPDATE_MODEL_ATTRIBUTES, {
        json: attributes
      });
    }

    /**
     * Updates the given nodes json attributes
     * @param nodeId the id of the node to update
     * @param attributes the json attributes to update (merge with the existing attributes)
     * @returns {{type: (string|string), node: *, json: *}}
     */
  }, {
    key: "updateNodeAttributes",
    value: function updateNodeAttributes(nodeId, attributes) {
      return new _Action["default"](Actions.UPDATE_NODE_ATTRIBUTES, {
        node: nodeId,
        json: attributes
      });
    }
  }, {
    key: "floatTab",
    value: function floatTab(nodeId) {
      return new _Action["default"](Actions.FLOAT_TAB, {
        node: nodeId
      });
    }
  }, {
    key: "unFloatTab",
    value: function unFloatTab(nodeId) {
      return new _Action["default"](Actions.UNFLOAT_TAB, {
        node: nodeId
      });
    }
  }]);
}();
_defineProperty(Actions, "ADD_NODE", "FlexLayout_AddNode");
_defineProperty(Actions, "MOVE_NODE", "FlexLayout_MoveNode");
_defineProperty(Actions, "DELETE_TAB", "FlexLayout_DeleteTab");
_defineProperty(Actions, "RENAME_TAB", "FlexLayout_RenameTab");
_defineProperty(Actions, "SELECT_TAB", "FlexLayout_SelectTab");
_defineProperty(Actions, "SET_ACTIVE_TABSET", "FlexLayout_SetActiveTabset");
_defineProperty(Actions, "ADJUST_SPLIT", "FlexLayout_AdjustSplit");
_defineProperty(Actions, "ADJUST_BORDER_SPLIT", "FlexLayout_AdjustBorderSplit");
_defineProperty(Actions, "MAXIMIZE_TOGGLE", "FlexLayout_MaximizeToggle");
_defineProperty(Actions, "UPDATE_MODEL_ATTRIBUTES", "FlexLayout_UpdateModelAttributes");
_defineProperty(Actions, "UPDATE_NODE_ATTRIBUTES", "FlexLayout_UpdateNodeAttributes");
_defineProperty(Actions, "FLOAT_TAB", "FlexLayout_FloatTab");
_defineProperty(Actions, "UNFLOAT_TAB", "FlexLayout_UnFloatTab");
var _default = exports["default"] = Actions;
//# sourceMappingURL=Actions.js.map