"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createZipFromRemoteFiles = createZipFromRemoteFiles;
var _jszip = _interopRequireDefault(require("jszip"));
var _fileSaver = _interopRequireDefault(require("file-saver"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function createZipFromRemoteFiles(files, zipName) {
  if (!(files instanceof Array)) {
    files = [files];
  }

  // Convert url to promise, returning uint8 array
  function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
      var oReq = new XMLHttpRequest();
      oReq.open("GET", url, true);
      oReq.responseType = "arraybuffer";
      oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response;
        resolve(new Uint8Array(arrayBuffer));
      };
      oReq.send();
    });
  }

  // Add an entry to zip per file
  var zip = new _jszip["default"]();
  $.each(files, function (i, filePath) {
    zip.file(filePath.split('/').pop(), urlToPromise(filePath), {
      binary: true
    });
  });

  // Send File
  zip.generateAsync({
    type: "blob"
  }).then(function (blob) {
    _fileSaver["default"].saveAs(blob, zipName);
  });
}
//# sourceMappingURL=util.js.map