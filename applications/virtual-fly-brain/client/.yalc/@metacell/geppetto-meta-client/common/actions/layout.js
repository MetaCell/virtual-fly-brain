"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _actions = require("../layout/actions");
Object.keys(_actions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _actions[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _actions[key];
    }
  });
});
//# sourceMappingURL=layout.js.map