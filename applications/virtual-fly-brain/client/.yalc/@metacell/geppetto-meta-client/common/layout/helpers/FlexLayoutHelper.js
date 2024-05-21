"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTabSet = createTabSet;
exports.moveWidget = moveWidget;
var _model = require("../model");
var FlexLayout = _interopRequireWildcard(require("@metacell/geppetto-meta-ui/flex-layout/src/index"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// @ts-ignore

/**
 * Create a new tab set.
 *
 * @param model
 * @param {string} tabsetID the id of the tab set
 * @param position
 * @param weight
 * @private
 */
function createTabSet(model, tabsetID) {
  var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _model.TabsetPosition.RIGHT;
  var weight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 50;
  var rootNode = model.getNodeById("root");
  var tabset = new FlexLayout.TabSetNode(model, {
    id: tabsetID
  });
  switch (position) {
    case _model.TabsetPosition.RIGHT:
      rootNode.getChildren().forEach(function (node) {
        return node._setWeight(100 - weight);
      });
      rootNode._addChild(tabset);
      break;
    case _model.TabsetPosition.LEFT:
      rootNode.getChildren().forEach(function (node) {
        return node._setWeight(100 - weight);
      });
      rootNode._addChild(tabset, 0);
      break;
    case _model.TabsetPosition.BOTTOM:
    case _model.TabsetPosition.TOP:
      {
        tabset._setWeight(80);
        var hrow = new FlexLayout.RowNode(model, {});
        hrow._setWeight(100);
        rootNode.getChildren().forEach(function (child) {
          if (child['getWeight']) {
            var newWeight = child.getWeight() / 2;
            child._setWeight(newWeight);
            hrow._addChild(child);
          }
        });
        if (position === _model.TabsetPosition.BOTTOM) {
          hrow._addChild(tabset);
        } else {
          hrow._addChild(tabset, 0);
        }
        rootNode._removeAll();
        rootNode._addChild(hrow, 0);
      }
  }
}
function moveWidget(model, widget) {
  model.doAction(FlexLayout.Actions.moveNode(widget.id, widget.panelName, FlexLayout.DockLocation.CENTER, widget.pos));
}
//# sourceMappingURL=FlexLayoutHelper.js.map