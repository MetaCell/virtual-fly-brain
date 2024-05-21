"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _reducer = require("../layout/reducer");
Object.keys(_reducer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _reducer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reducer[key];
    }
  });
});
//# sourceMappingURL=geppettoLayout.js.map