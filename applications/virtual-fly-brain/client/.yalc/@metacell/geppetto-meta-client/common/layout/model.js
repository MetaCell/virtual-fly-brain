"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WidgetStatus = exports.TabsetPosition = void 0;
/*
 * status can be one of:
 *  - ACTIVE: the user can see the tab content.
 *  - MINIMIZED: the tab is minimized.
 *  - HIDDEN:  other tab in the node is currently selected
 *  - MAXIMIZED:  the tab is maximized (only one tab can be maximized simultaneously)
 */
var WidgetStatus;
exports.WidgetStatus = WidgetStatus;
(function (WidgetStatus) {
  WidgetStatus["HIDDEN"] = "HIDDEN";
  WidgetStatus["ACTIVE"] = "ACTIVE";
  WidgetStatus["MAXIMIZED"] = "MAXIMIZED";
  WidgetStatus["MINIMIZED"] = "MINIMIZED";
})(WidgetStatus || (exports.WidgetStatus = WidgetStatus = {}));
var TabsetPosition;
/**
 * Extended Node interface
 */
exports.TabsetPosition = TabsetPosition;
(function (TabsetPosition) {
  TabsetPosition["LEFT"] = "LEFT";
  TabsetPosition["RIGHT"] = "RIGHT";
  TabsetPosition["TOP"] = "TOP";
  TabsetPosition["BOTTOM"] = "BOTTOM";
})(TabsetPosition || (exports.TabsetPosition = TabsetPosition = {}));
//# sourceMappingURL=model.js.map