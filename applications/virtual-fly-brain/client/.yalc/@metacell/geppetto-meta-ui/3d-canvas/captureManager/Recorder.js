"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Recorder = void 0;
var _utils = require("./utils");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Recorder = exports.Recorder = /*#__PURE__*/function () {
  function Recorder(canvas, recorderOptions) {
    _classCallCheck(this, Recorder);
    this.stream = canvas.captureStream();
    var mediaRecorderOptions = recorderOptions.mediaRecorderOptions,
      blobOptions = recorderOptions.blobOptions;
    this.setupMediaRecorder(mediaRecorderOptions);
    this.recordedBlobs = [];
    this.blobOptions = blobOptions;
    this.ctx = canvas.getContext('webgl');
    this.animationLoop = this.animationLoop.bind(this);
  }
  return _createClass(Recorder, [{
    key: "handleDataAvailable",
    value: function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    }
  }, {
    key: "setupMediaRecorder",
    value: function setupMediaRecorder(options) {
      var _this = this;
      if (options == null) {
        options = {
          mimeType: 'video/webm'
        };
      }
      var mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(this.stream, options);
      } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', e0);
        try {
          options = {
            mimeType: 'video/webm,codecs=vp9'
          };
          mediaRecorder = new MediaRecorder(this.stream, options);
        } catch (e1) {
          console.log('Unable to create MediaRecorder with options Object: ', e1);
          try {
            options = {
              mimeType: 'video/webm,codecs=vp8'
            }; // Chrome 47
            mediaRecorder = new MediaRecorder(this.stream, options);
          } catch (e2) {
            alert('MediaRecorder is not supported by this browser.\n\n' + 'Try Firefox 29 or later, or Chrome 47 or later, ' + 'with Enable experimental Web Platform features enabled from chrome://flags.');
            console.error('Exception while creating MediaRecorder:', e2);
            return;
          }
        }
      }
      mediaRecorder.ondataavailable = function (evt) {
        return _this.handleDataAvailable(evt);
      };
      mediaRecorder.onstart = function () {
        return _this.animationLoop();
      };
      this.mediaRecorder = mediaRecorder;
      this.options = options;
      if (!this.blobOptions) {
        var _options = options,
          mimeType = _options.mimeType;
        this.blobOptions = {
          type: mimeType
        };
      }
    }
  }, {
    key: "startRecording",
    value: function startRecording() {
      this.recordedBlobs = [];
      this.mediaRecorder.start(100);
    }
  }, {
    key: "stopRecording",
    value: function stopRecording(options) {
      this.mediaRecorder.stop();
      return this.getRecordingBlob(options);
    }
  }, {
    key: "download",
    value: function download(filename, options) {
      if (!filename) {
        filename = "CanvasRecording_".concat((0, _utils.formatDate)(new Date()), ".webm");
      }
      var blob = this.getRecordingBlob(options);
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      return blob;
    }
  }, {
    key: "getRecordingBlob",
    value: function getRecordingBlob(options) {
      if (!options) {
        options = this.blobOptions;
      }
      return new Blob(this.recordedBlobs, options);
    }
  }, {
    key: "animationLoop",
    value: function animationLoop() {
      // draw nothing, but still draw
      this.ctx.drawArrays(this.ctx.POINTS, 0, 0);
      if (this.mediaRecorder.state !== "inactive") {
        requestAnimationFrame(this.animationLoop);
      }
    }
  }]);
}();
//# sourceMappingURL=Recorder.js.map