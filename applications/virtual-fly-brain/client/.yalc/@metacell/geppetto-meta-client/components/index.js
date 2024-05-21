"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadingSpinner = void 0;
var _reactRedux = require("react-redux");
var _actions = require("../common/actions/actions");
var _LoadingSpinner = _interopRequireDefault(require("./interface/LoadingSpinner"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var LoadingSpinner = (0, _reactRedux.connect)(function (state) {
  return {
    spinner: state.client.components.spinner
  };
}, function (dispatch) {
  return {
    showSpinner: function showSpinner(msg) {
      return dispatch((0, _actions.showSpinner)(msg));
    },
    hideSpinner: function hideSpinner() {
      return dispatch((0, _actions.hideSpinner)());
    }
  };
}, null, {
  forwardRef: true
})(_LoadingSpinner["default"]);
exports.LoadingSpinner = LoadingSpinner;
//# sourceMappingURL=index.js.map