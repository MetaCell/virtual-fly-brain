"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createStore: true
};
Object.defineProperty(exports, "createStore", {
  enumerable: true,
  get: function get() {
    return _store.createStore;
  }
});
var _store = require("./store");
var _layout = require("./layout");
Object.keys(_layout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _layout[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _layout[key];
    }
  });
});
//# sourceMappingURL=index.js.map