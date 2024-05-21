"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDate = formatDate;
function formatDate(d) {
  return "".concat(d.getFullYear()).concat(d.getMonth() + 1).concat(d.getDate(), "-").concat(pad(d.getHours(), 2)).concat(pad(d.getMinutes(), 2)).concat(pad(d.getSeconds(), 2));
}
function pad(num, size) {
  var s = num + "";
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
}
//# sourceMappingURL=utils.js.map