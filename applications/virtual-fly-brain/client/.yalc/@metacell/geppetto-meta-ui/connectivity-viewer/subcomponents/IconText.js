"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _Icon = _interopRequireDefault(require("@material-ui/core/Icon"));
var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));
var _styles = require("@material-ui/core/styles");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var styles = {
  inline: {
    display: "inline"
  },
  legend: {
    fontSize: "12px",
    fontWeight: "100",
    color: "white"
  },
  gridWrapper: {
    display: "grid",
    gridTemplateColumns: "auto auto",
    columnGap: "5px",
    justifyContent: "start"
  }
};
var _default = exports["default"] = (0, _styles.withStyles)(styles)(function (_ref) {
  var icon = _ref.icon,
    subtitle = _ref.subtitle,
    color = _ref.color,
    width = _ref.width,
    height = _ref.height,
    classes = _ref.classes;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: classes.gridWrapper
  }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
    className: icon,
    style: {
      background: color,
      width: width,
      height: height
    }
  }), /*#__PURE__*/_react["default"].createElement(_Typography["default"], {
    className: classes.legend,
    variant: "subtitle1",
    gutterBottom: true
  }, subtitle));
});
//# sourceMappingURL=IconText.js.map