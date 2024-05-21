"use strict";

var _propTypes = require("prop-types");
var _Events = require("../Events");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable no-underscore-dangle */
function clicked(target, detail) {
  var event = new CustomEvent('mesh_click', {
    detail: detail
  });
  target.dispatchEvent(event);
}
AFRAME.registerComponent('interactable', {
  schema: {
    id: {
      type: 'string'
    },
    reversed: {
      "default": true
    },
    closerDistance: {
      "default": 1
    }
  },
  init: function init() {
    var _this = this;
    var el = this.el;
    var id = this.data.id;
    var scene = document.getElementById("".concat(id, "_scene"));
    var model = document.getElementById("".concat(id, "_model"));
    var camera = document.getElementById("".concat(id, "_camera"));
    this.rhand = false;
    this.lhand = false;
    this.handOldPos = {
      rhand: null,
      lhand: null
    };
    this.baseRotation = {
      rhand: {
        x: 0,
        y: 0,
        z: 0
      },
      lhand: {
        x: 0,
        y: 0,
        z: 0
      }
    };
    this.previousHandRotation = {
      rhand: {
        x: 0,
        y: 0,
        z: 0
      },
      lhand: {
        x: 0,
        y: 0,
        z: 0
      }
    };
    this.originalPosition = null;
    this.parent = null;
    el.addEventListener('mouseenter', function () {
      var event = new CustomEvent('mesh_hover', {
        detail: el
      });
      scene.dispatchEvent(event);
    });
    el.addEventListener('mouseleave', function () {
      var event = new CustomEvent('mesh_hover_leave', {
        detail: el
      });
      scene.dispatchEvent(event);
    });
    el.addEventListener('triggerdown', function () {
      clicked(scene, el);
    });
    el.addEventListener('click', function () {
      clicked(scene, el);
    });
    el.addEventListener('gripdown', function (evt) {
      if (evt.detail === "".concat(id, "_rightHand")) {
        _this.rhand = document.getElementById(evt.detail);
        _this.baseRotation.rhand = el.object3D.rotation;
        _this.previousHandRotation.rhand = _objectSpread({}, _this.rhand.object3D.rotation);
      } else if (evt.detail === "".concat(id, "_leftHand")) {
        _this.lhand = document.getElementById(evt.detail);
        _this.baseRotation.lhand = el.object3D.rotation;
        _this.previousHandRotation.lhand = _objectSpread({}, _this.lhand.object3D.rotation);
      }
    });
    el.addEventListener('gripup', function (evt) {
      /*
       * if (evt.detail === `${id}_rightHand`) {
       *   this.rhand = null;
       * } else if (evt.detail === `${id}_leftHand`) {
       *   this.lhand = null;
       * }
       */
      _this.rhand = null;
      _this.lhand = null;
    });
    el.addEventListener(_Events.BRING_CLOSER, function () {
      var closerDistance = _this.data.closerDistance;
      if (el.selected || el.id === "".concat(id, "_model")) {
        if (_this.originalPosition) {
          if (el.id !== "".concat(id, "_model")) {
            model.object3D.attach(el.object3D);
          }
          el.object3D.position.set(_this.originalPosition.x, _this.originalPosition.y, _this.originalPosition.z);
          _this.originalPosition = null;
        } else {
          _this.originalPosition = _objectSpread({}, el.object3D.position);
          var closerPosition = _this.getCloserPosition(el.object3D, camera.object3D.position, closerDistance);
          scene.object3D.attach(el.object3D);
          el.object3D.position.set(closerPosition.x, closerPosition.y, closerPosition.z);
        }
      }
    });
  },
  getCloserPosition: function getCloserPosition(obj, cameraPos, closerDistance) {
    var bbox = new THREE.Box3().setFromObject(obj);
    var center = bbox.getCenter();
    var position = obj.getWorldPosition();
    var xDiff = position.x - center.x;
    var zDiff = this.getZDist(cameraPos, position, bbox, 'z');
    var yDiff = this.getYDist(cameraPos, position, bbox, 'y');
    var cPos = _objectSpread({}, cameraPos);
    cPos.z -= zDiff + closerDistance;
    cPos.y += yDiff;
    cPos.x += xDiff;
    return cPos;
  },
  tick: function tick() {
    var el = this.el;
    var _this$data = this.data,
      reversed = _this$data.reversed,
      id = _this$data.id;
    if (el.selected || el.id === "".concat(id, "_model")) {
      if (this.rhand && this.lhand) {
        if (this.handOldPos.rhand && this.handOldPos.lhand) {
          if (this.isExpanding()) {
            el.object3D.scale.addScalar(0.001);
          } else {
            el.object3D.scale.addScalar(-0.001);
          }
        }
        this.handOldPos.rhand = _objectSpread({}, this.rhand.object3D.position);
        this.handOldPos.lhand = _objectSpread({}, this.lhand.object3D.position);
      } else if (this.rhand) {
        var rotate = {
          x: this.rhand.object3D.rotation.x - this.previousHandRotation.rhand._x,
          y: this.rhand.object3D.rotation.y - this.previousHandRotation.rhand._y
          // z: this.rhand.object3D.rotation.z - this.previousHandRotation._z,
        };
        if (reversed) {
          rotate = {
            x: rotate.x * -1,
            y: rotate.y * -1,
            z: rotate.z * -1
          };
        }
        el.object3D.rotation.x = this.baseRotation.rhand.x + rotate.x;
        el.object3D.rotation.y = this.baseRotation.rhand.y + rotate.y;
        this.previousHandRotation.rhand = _objectSpread({}, this.rhand.object3D.rotation);
      } else if (this.lhand) {
        var _rotate = {
          // eslint-disable-next-line no-underscore-dangle
          x: this.lhand.object3D.rotation.x - this.previousHandRotation.lhand._x,
          // eslint-disable-next-line no-underscore-dangle
          y: this.lhand.object3D.rotation.y - this.previousHandRotation.lhand._y
          // z: this.rhand.object3D.rotation.z - this.previousHandRotation._z,
        };
        if (reversed) {
          _rotate = {
            x: _rotate.x * -1,
            y: _rotate.y * -1,
            z: _rotate.z * -1
          };
        }
        el.object3D.rotation.x = this.baseRotation.lhand.x + _rotate.x;
        el.object3D.rotation.y = this.baseRotation.lhand.y + _rotate.y;
        this.previousHandRotation.lhand = _objectSpread({}, this.lhand.object3D.rotation);
      }
    }
  },
  isExpanding: function isExpanding() {
    var rightXGrowing = this.rhand.object3D.position.x - this.handOldPos.rhand.x >= 0;
    var leftXDecreasing = this.lhand.object3D.position.x - this.handOldPos.lhand.x <= 0;
    return rightXGrowing && leftXDecreasing;
  },
  getZDist: function getZDist(cameraPos, objPos, objBox, axis) {
    var diff1 = Math.abs(cameraPos[axis] - objBox.min[axis]);
    var diff2 = Math.abs(cameraPos[axis] - objBox.max[axis]);
    var closerDist = diff1 < diff2 ? objBox.min[axis] : objBox.max[axis];
    return Math.abs(objPos[axis] - closerDist);
  },
  getYDist: function getYDist(cameraPos, objPos, objBox, axis) {
    var center = objBox.getCenter();
    var diff = Math.abs(objPos[axis] - center[axis]);
    if (cameraPos[axis] - diff < 0) {
      return objPos[axis] - objBox.min[axis] - cameraPos[axis];
    }
    return diff - cameraPos[axis];
  },
  convertToLocalCoordinates: function convertToLocalCoordinates(newWorldPosition, obj) {
    var localPosition = obj.position;
    var worldPosition = obj.getWorldPosition();
    newWorldPosition.x = newWorldPosition.x * localPosition.x / worldPosition.x;
    newWorldPosition.y = newWorldPosition.y * localPosition.y / worldPosition.y;
    newWorldPosition.z = newWorldPosition.z * localPosition.z / worldPosition.z;
    return newWorldPosition;
  }
});
//# sourceMappingURL=interactable.js.map