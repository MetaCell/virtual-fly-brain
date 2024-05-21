"use strict";

var _Events = require("../Events");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function emitEvent(event, raycaster) {
  if (raycaster.intersectedEls.length > 0) {
    raycaster.intersectedEls[0].emit(event);
  }
}
function emitEventSelected(event, model, detail) {
  var cEvent = new CustomEvent(event, {
    detail: detail
  });
  var toModel = true;
  var _iterator = _createForOfIteratorHelper(model.children),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var child = _step.value;
      if (child.selected) {
        child.dispatchEvent(cEvent);
        toModel = false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (toModel) {
    model.dispatchEvent(cEvent);
  }
}
AFRAME.registerComponent('extended-laser-controls', {
  schema: {
    id: {
      type: 'string'
    }
  },
  init: function init() {
    var el = this.el;
    var raycaster = this.el.components.raycaster;
    var id = this.data.id;
    var camera = document.getElementById("".concat(id, "_camera"));
    var model = document.getElementById("".concat(id, "_model"));
    el.addEventListener('gripdown', function () {
      emitEventSelected('gripdown', model, el.id);
    });
    el.addEventListener('gripup', function () {
      emitEventSelected('gripup', model, el.id);
    });
    el.addEventListener('triggerdown', function () {
      emitEvent('triggerdown', raycaster);
    });
    el.addEventListener('triggerup', function () {
      emitEvent('triggerup', raycaster);
    });
    el.addEventListener(_Events.BRING_CLOSER, function () {
      // TODO: Make it Only works for 1 selected object
      emitEventSelected(_Events.BRING_CLOSER, model, null);
    });
    el.addEventListener(_Events.MOVE_PLAYER, function (evt) {
      var event = new CustomEvent(_Events.MOVE_PLAYER, {
        detail: {
          hand: el.id,
          data: evt.detail
        }
      });
      camera.dispatchEvent(event);
    });
    el.addEventListener(_Events.STOP_PLAYER, function () {
      var event = new CustomEvent(_Events.STOP_PLAYER);
      camera.dispatchEvent(event);
    });
  }
});
//# sourceMappingURL=extended-laser-controls.js.map