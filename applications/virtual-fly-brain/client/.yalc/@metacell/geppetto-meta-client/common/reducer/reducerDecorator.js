"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducerDecorator = void 0;
var _actions = require("../actions");
var reducerDecorator = function reducerDecorator(subReducer) {
  return function (state, action) {
    if (action.type === _actions.IMPORT_APPLICATION_STATE) {
      state = action.data.redux;
    }
    return subReducer(state, action);
  };
};
exports.reducerDecorator = reducerDecorator;
//# sourceMappingURL=reducerDecorator.js.map