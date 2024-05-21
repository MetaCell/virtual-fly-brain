"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectionStrategies = void 0;
var selectionStrategies = exports.selectionStrategies = Object.freeze({
  "nearest": function nearest(selectedMap) {
    return [Object.keys(selectedMap).reduce(function (selected, current) {
      if (!selected) {
        return current;
      } else {
        return selectedMap[current].distance < selectedMap[selected].distance ? current : selected;
      }
    }, null)].filter(function (s) {
      return s;
    });
  },
  "farthest": function farthest(selectedMap) {
    return [Object.keys(selectedMap).reduce(function (selected, current) {
      if (!selected) {
        return current;
      } else {
        return selectedMap[current].distance > selectedMap[selected].distance ? current : selected;
      }
    }, null)].filter(function (s) {
      return s;
    });
  },
  "all": function all(selectedMap) {
    return Object.keys(selectedMap);
  }
});
//# sourceMappingURL=SelectionManager.js.map