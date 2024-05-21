"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adjustSelectedIndex = adjustSelectedIndex;
exports.adjustSelectedIndexAfterDock = adjustSelectedIndexAfterDock;
exports.adjustSelectedIndexAfterFloat = adjustSelectedIndexAfterFloat;
var _TabSetNode = _interopRequireDefault(require("./TabSetNode"));
var _BorderNode = _interopRequireDefault(require("./BorderNode"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/** @hidden @internal */
function adjustSelectedIndexAfterFloat(node) {
  var parent = node.getParent();
  if (parent !== null) {
    if (parent instanceof _TabSetNode["default"]) {
      var found = false;
      var newSelected = 0;
      var children = parent.getChildren();
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child === node) {
          found = true;
        } else {
          if (!child.isFloating()) {
            newSelected = i;
            if (found) break;
          }
        }
      }
      parent._setSelected(newSelected);
    } else if (parent instanceof _BorderNode["default"]) {
      parent._setSelected(-1);
    }
  }
}

/** @hidden @internal */
function adjustSelectedIndexAfterDock(node) {
  var parent = node.getParent();
  if (parent !== null && (parent instanceof _TabSetNode["default"] || parent instanceof _BorderNode["default"])) {
    var children = parent.getChildren();
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child === node) {
        parent._setSelected(i);
        return;
      }
    }
  }
}

/** @hidden @internal */
function adjustSelectedIndex(parent, removedIndex) {
  // for the tabset/border being removed from set the selected index
  if (parent !== undefined && (parent.getType() === _TabSetNode["default"].TYPE || parent.getType() === _BorderNode["default"].TYPE)) {
    var selectedIndex = parent.getSelected();
    if (selectedIndex !== -1) {
      if (removedIndex === selectedIndex && parent.getChildren().length > 0) {
        if (removedIndex >= parent.getChildren().length) {
          // removed last tab; select new last tab
          parent._setSelected(parent.getChildren().length - 1);
        } else {
          // leave selected index as is, selecting next tab after this one
        }
      } else if (removedIndex < selectedIndex) {
        parent._setSelected(selectedIndex - 1);
      } else if (removedIndex > selectedIndex) {
        // leave selected index as is
      } else {
        parent._setSelected(-1);
      }
    }
  }
}
//# sourceMappingURL=Utils.js.map