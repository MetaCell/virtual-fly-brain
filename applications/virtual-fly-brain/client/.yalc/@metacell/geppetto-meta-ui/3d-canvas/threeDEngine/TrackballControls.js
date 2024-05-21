"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrackballControls = void 0;
var _three = require("three");
function _readOnlyError(name) { throw new TypeError("\"" + name + "\" is read-only"); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var _changeEvent = {
  type: 'change'
};
var _startEvent = {
  type: 'start'
};
var _endEvent = {
  type: 'end'
};
var defaultRotationalSpeed = 1.0;
var TrackballControls = exports.TrackballControls = /*#__PURE__*/function (_EventDispatcher) {
  // @metacell change
  function TrackballControls(object, domElement, handler, config) {
    var _this;
    _classCallCheck(this, TrackballControls);
    // end of @metacell changes

    _this = _callSuper(this, TrackballControls);
    if (domElement === undefined) {
      console.warn('TrackballControls: The second parameter "domElement" is now mandatory.');
    }
    if (domElement === document) {
      console.error('TrackballControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');
    }
    var scope = _this;
    var STATE = {
      NONE: -1,
      ROTATE: 0,
      ZOOM: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_ZOOM_PAN: 4
    };
    _this.object = object;
    _this.domElement = domElement;
    _this.domElement.style.touchAction = 'none'; // disable touch scroll

    // API

    _this.enabled = true;
    _this.screen = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };

    // @metacell change
    var rotationSpeed = config.rotationSpeed,
      zoomSpeed = config.zoomSpeed,
      panSpeed = config.panSpeed;
    _this.rotationSpeed = rotationSpeed ? rotationSpeed : 0.5;
    _this.zoomSpeed = zoomSpeed ? zoomSpeed : 1.2;
    _this.panSpeed = panSpeed ? panSpeed : 0.3;
    // end of @metacell changes

    _this.noRotate = false;
    _this.noZoom = false;
    _this.noPan = false;
    _this.staticMoving = true;
    _this.dynamicDampingFactor = 0.2;
    _this.minDistance = 0;
    _this.maxDistance = Infinity;
    _this.keys = ['KeyA' /* A*/, 'KeyS' /* S*/, 'KeyD' /* D*/];

    // @metacell changes
    _this.logDecimalPlaces = 3;
    _this.cameraByConsoleLock = true;
    _this.cameraChanged = false;
    _this.handler = handler;
    _this.rotationRadius = null;
    // end of @metacell changes

    _this.mouseButtons = {
      LEFT: _three.MOUSE.ROTATE,
      MIDDLE: _three.MOUSE.DOLLY,
      RIGHT: _three.MOUSE.PAN
    };

    // internals

    _this.target = new _three.Vector3();
    var EPS = 0.0001;
    var lastPosition = new _three.Vector3();
    var lastZoom = 1;
    var _state = STATE.NONE,
      // @metacell changes
      _prevState = STATE.NONE,
      // end of @metacell changes
      _keyState = STATE.NONE,
      _touchZoomDistanceStart = 0,
      _touchZoomDistanceEnd = 0,
      _lastAngle = 0;
    var _eye = new _three.Vector3(),
      // @metacell changes
      _movePrev = new _three.Vector3(),
      // end of @metacell changes
      _lastAxis = new _three.Vector3(),
      _zoomStart = new _three.Vector2(),
      _zoomEnd = new _three.Vector2(),
      _panStart = new _three.Vector2(),
      _pointers = [],
      _pointerPositions = {};
    var _panEnd = new _three.Vector2(),
      // @metacell changes
      _moveCurr = new _three.Vector3();
    // end of @metacell changes

    // for reset

    _this.target0 = _this.target.clone();
    _this.position0 = _this.object.position.clone();
    _this.up0 = _this.object.up.clone();
    _this.zoom0 = _this.object.zoom;

    // methods

    _this.handleResize = function () {
      var box = scope.domElement.getBoundingClientRect();
      // adjustments come from similar code in the jquery offset() function
      var d = scope.domElement.ownerDocument.documentElement;
      scope.screen.left = box.left + window.pageXOffset - d.clientLeft;
      scope.screen.top = box.top + window.pageYOffset - d.clientTop;
      scope.screen.width = box.width;
      scope.screen.height = box.height;
    };
    var getMouseOnScreen = function () {
      var vector = new _three.Vector2();
      return function getMouseOnScreen(pageX, pageY) {
        vector.set((pageX - scope.screen.left) / scope.screen.width, (pageY - scope.screen.top) / scope.screen.height);
        return vector;
      };
    }();
    var getMouseOnCircle = function () {
      var vector = new _three.Vector2();
      return function getMouseOnCircle(pageX, pageY) {
        vector.set((pageX - scope.screen.width * 0.5 - scope.screen.left) / (scope.screen.width * 0.5), (scope.screen.height + 2 * (scope.screen.top - pageY)) / scope.screen.width // screen.width intentional
        );
        return vector;
      };
    }();

    // @metacell changes

    _this.unsetCameraByConsoleLock = function () {
      scope.cameraByConsoleLock = false;
    };
    _this.setCameraByConsole = function () {
      var p = scope.object.position.toArray();
      var u = scope.object.rotation.toArray();
      var l = _eye.length();
      this.handler({
        position: {
          x: p[0],
          y: p[1],
          z: p[2]
        },
        rotation: {
          rx: u[0],
          ry: u[1],
          rz: u[2],
          radius: this.rotationRadius
        },
        eyeLength: l
      });
      scope.cameraByConsoleLock = true;
      scope.cameraChanged = false;
    };
    _this.allSteady = function () {
      var u = scope.lastUp;
      var p = scope.lastPosition;
      var nu = scope.object.up.toArray();
      var np = scope.object.position.toArray();
      var threshold = 1 / (10 * scope.logDecimalPlaces);
      var steady = Math.abs(u[0] + u[1] + u[2] - (nu[0] + nu[1] + nu[2])) < threshold && Math.abs(p[0] + p[1] + p[2] - (np[0] + np[1] + np[2])) < threshold;

      /*
       * Console logging is unlocked, this means
       * we had an input event
       */
      if (!scope.cameraByConsoleLock) {
        /*
         * If the camera moved, set cameraChanged
         * if not, keep it
         */
        if (!steady) {
          scope.cameraChanged = true;
        }
      }
      return steady;
    };

    // end of metacell changes

    _this.setRotationalSpeed = function (s) {
      if (s) {
        scope.rotationSpeed = s;
      }
    };
    _this.setZoomSpeed = function (s) {
      if (s) {
        scope.zoomSpeed = s;
      }
    };
    _this.setPanSpeed = function (s) {
      if (s) {
        scope.panSpeed = s;
      }
    };
    _this.resetRotationalSpeed = function () {
      scope.rotationSpeed = defaultRotationalSpeed;
    };
    _this.rotateCamera = function () {
      // @metacell changes
      var axis = new _three.Vector3(),
        // end of @metacell changes
        quaternion = new _three.Quaternion(),
        eyeDirection = new _three.Vector3(),
        objectUpDirection = new _three.Vector3(),
        objectSidewaysDirection = new _three.Vector3(),
        moveDirection = new _three.Vector3();
      return function rotateCamera() {
        // @metacell changes
        if (_moveCurr.z != undefined && _moveCurr.z != 0) {
          moveDirection.set(0, 0, _moveCurr.z - _movePrev.z);
        } else {
          moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
        }
        // end of @metacell changes
        var angle = moveDirection.length();
        if (angle) {
          _eye.copy(scope.object.position).sub(scope.target);
          eyeDirection.copy(_eye).normalize();
          objectUpDirection.copy(scope.object.up).normalize();
          objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();
          objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
          objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);
          moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

          // @metacell changes
          if (_moveCurr.z != undefined && _moveCurr.z != 0) {
            if (_moveCurr.z - _movePrev.z >= 0) {
              axis = new _three.Vector3(0, 0, 1);
            } else {
              axis = new _three.Vector3(0, 0, -1);
            }
          } else {
            axis.crossVectors(moveDirection, _eye).normalize();
          }
          // end of @metacell changes

          angle *= scope.rotationSpeed;
          quaternion.setFromAxisAngle(axis, angle);
          _eye.applyQuaternion(quaternion);
          scope.object.up.applyQuaternion(quaternion);
          _lastAxis.copy(axis);
          _lastAngle = angle;
        } else if (!scope.staticMoving && _lastAngle) {
          _lastAngle *= Math.sqrt(1.0 - scope.dynamicDampingFactor);
          _eye.copy(scope.object.position).sub(scope.target);
          quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
          _eye.applyQuaternion(quaternion);
          scope.object.up.applyQuaternion(quaternion);
        }
        _movePrev.copy(_moveCurr);
      };
    }();
    _this.zoomCamera = function () {
      var factor;
      if (_state === STATE.TOUCH_ZOOM_PAN) {
        factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
        _touchZoomDistanceStart = _touchZoomDistanceEnd;
        if (scope.object.isPerspectiveCamera) {
          _eye.multiplyScalar(factor);
        } else if (scope.object.isOrthographicCamera) {
          scope.object.zoom *= factor;
          scope.object.updateProjectionMatrix();
        } else {
          console.warn('TrackballControls: Unsupported camera type');
        }
      } else {
        factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * scope.zoomSpeed;
        if (factor !== 1.0 && factor > 0.0) {
          if (scope.object.isPerspectiveCamera) {
            _eye.multiplyScalar(factor);
          } else if (scope.object.isOrthographicCamera) {
            scope.object.zoom /= factor;
            scope.object.updateProjectionMatrix();
          } else {
            console.warn('TrackballControls: Unsupported camera type');
          }
        }
        if (scope.staticMoving) {
          _zoomStart.copy(_zoomEnd);
        } else {
          _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
        }
      }
    };
    _this.panCamera = function () {
      var mouseChange = new _three.Vector2(),
        objectUp = new _three.Vector3(),
        pan = new _three.Vector3();
      return function panCamera() {
        mouseChange.copy(_panEnd).sub(_panStart);
        if (mouseChange.lengthSq()) {
          if (scope.object.isOrthographicCamera) {
            var scale_x = (scope.object.right - scope.object.left) / scope.object.zoom / scope.domElement.clientWidth;
            var scale_y = (scope.object.top - scope.object.bottom) / scope.object.zoom / scope.domElement.clientWidth;
            mouseChange.x *= scale_x;
            mouseChange.y *= scale_y;
          }
          mouseChange.multiplyScalar(_eye.length() * scope.panSpeed);
          pan.copy(_eye).cross(scope.object.up).setLength(mouseChange.x);
          pan.add(objectUp.copy(scope.object.up).setLength(mouseChange.y));
          scope.object.position.add(pan);
          scope.target.add(pan);
          if (scope.staticMoving) {
            _panStart.copy(_panEnd);
          } else {
            _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(scope.dynamicDampingFactor));
          }
        }
      };
    }();
    _this.checkDistances = function () {
      if (!scope.noZoom || !scope.noPan) {
        if (_eye.lengthSq() > scope.maxDistance * scope.maxDistance) {
          scope.object.position.addVectors(scope.target, _eye.setLength(scope.maxDistance));
          _zoomStart.copy(_zoomEnd);
        }
        if (_eye.lengthSq() < scope.minDistance * scope.minDistance) {
          scope.object.position.addVectors(scope.target, _eye.setLength(scope.minDistance));
          _zoomStart.copy(_zoomEnd);
        }
      }
    };
    _this.update = function () {
      // @metacell changes
      scope.lastUp = scope.object.up.toArray();
      scope.lastPosition = scope.object.position.toArray();
      // end of @metacell changes

      _eye.subVectors(scope.object.position, scope.target);
      if (!scope.noRotate) {
        scope.rotateCamera();
      }
      if (!scope.noZoom) {
        scope.zoomCamera();
      }
      if (!scope.noPan) {
        scope.panCamera();
      }
      scope.object.position.addVectors(scope.target, _eye);
      if (scope.object.isPerspectiveCamera) {
        scope.checkDistances();
        scope.object.lookAt(scope.target);

        // @metacell changes
        if (lastPosition.distanceToSquared(scope.object.position) > EPS || scope.lastUp.z !== scope.object.up.z) {
          // end of @metacell changes

          lastPosition.copy(scope.object.position);
          scope.dispatchEvent(_changeEvent);
        }
      } else if (scope.object.isOrthographicCamera) {
        scope.object.lookAt(scope.target);
        if (lastPosition.distanceToSquared(scope.object.position) > EPS || lastZoom !== scope.object.zoom) {
          scope.dispatchEvent(_changeEvent);
          lastPosition.copy(scope.object.position);
          lastZoom = scope.object.zoom;
        }
      } else {
        console.warn('TrackballControls: Unsupported camera type');
      }
      // Has the camera stopped moving? (&& has the camera started moving)
      if (scope.allSteady() && scope.cameraChanged) {
        // Log the camera's position
        scope.setCameraByConsole();
      }
    };

    // @metacell changes
    _this.setPosition = function (x, y, z) {
      scope.object.position.set(x, y, z);
      var u = scope.object.rotation.toArray();
      var l = _eye.length();
      scope.setRotation(u[0], u[1], u[2], l);
    };
    _this.setRotation = function (x, y, z, radius) {
      _state = STATE.NONE;
      _prevState = STATE.NONE;
      this.rotationRadius = radius;
      var base = new _three.Vector3(0, 0, -1);
      base.applyEuler(new _three.Euler(x, y, z));
      base.multiplyScalar(radius);
      scope.target.addVectors(scope.object.position, base);
      scope.object.up.copy(scope.up0);
      scope.object.up.applyEuler(new _three.Euler(x, y, z));
      _eye.subVectors(scope.object.position, scope.target);
      scope.object.lookAt(scope.target);
      scope.dispatchEvent(_changeEvent);
      scope.update();
    };
    // end of @metacell changes

    _this.reset = function () {
      _state = STATE.NONE;
      _keyState = STATE.NONE;
      scope.target.copy(scope.target0);
      scope.object.position.copy(scope.position0);
      scope.object.up.copy(scope.up0);
      scope.object.zoom = scope.zoom0;
      scope.object.updateProjectionMatrix();
      _eye.subVectors(scope.object.position, scope.target);
      scope.object.lookAt(scope.target);
      scope.dispatchEvent(_changeEvent);

      // @metacell changes
      scope.update();
      // end of @metacell changes

      lastPosition.copy(scope.object.position);
      lastZoom = scope.object.zoom;

      // @metacell changes
      scope.cameraChanged = true;
      scope.unsetCameraByConsoleLock();
      // end of @metacell changes
    };

    // @metacell changes

    _this.incrementRotationEnd = function (valX, valY, valZ) {
      if (valZ == 0) {
        if (_movePrev.x === 0 && _movePrev.y === 0) {
          // _movePrev = new Vector3(0.1, 0.1, 0.1);
          new _three.Vector2(0.1, 0.1), _readOnlyError("_movePrev");
        }
      }
      var z = !_movePrev.z ? 0 : _movePrev.z;
      _moveCurr = new _three.Vector3(_movePrev.x + valX, _movePrev.y + valY, z + valZ);
      nanToZero(_moveCurr);
      _prevState = _state;
      _state = STATE.ROTATE;
      scope.noRotate = false;
      scope.unsetCameraByConsoleLock();
      scope.update();
    };
    function nanToZero(vector) {
      if (isNaN(vector.x)) {
        vector.x = 0;
      }
      if (isNaN(vector.y)) {
        vector.y = 0;
      }
      if (isNaN(vector.z)) {
        vector.z = 0;
      }
    }
    _this.incrementPanEnd = function (valX, valY) {
      _panEnd = new _three.Vector2(_panStart.x + valX, _panStart.y + valY);
      _prevState = _state;
      _state = STATE.PAN;
      scope.noPan = false;
      scope.unsetCameraByConsoleLock();
      scope.update();
    };
    _this.incrementZoomEnd = function (val) {
      _zoomEnd.y = _zoomStart.y + val;
      _prevState = _state;
      _state = STATE.ZOOM;
      scope.noZoom = false;
      scope.unsetCameraByConsoleLock();
      scope.update();
    };

    // end of @metacell changes

    // listeners

    function onPointerDown(event) {
      if (scope.enabled === false) {
        return;
      }
      if (_pointers.length === 0) {
        scope.domElement.setPointerCapture(event.pointerId);
        scope.domElement.addEventListener('pointermove', onPointerMove);
        scope.domElement.addEventListener('pointerup', onPointerUp);
      }

      //

      addPointer(event);
      if (event.pointerType === 'touch') {
        onTouchStart(event);
      } else {
        onMouseDown(event);
      }
    }
    function onPointerMove(event) {
      if (scope.enabled === false) {
        return;
      }
      if (event.pointerType === 'touch') {
        onTouchMove(event);
      } else {
        onMouseMove(event);
      }
    }
    function onPointerUp(event) {
      if (scope.enabled === false) {
        return;
      }
      if (event.pointerType === 'touch') {
        onTouchEnd(event);
      } else {
        onMouseUp();
      }

      //

      removePointer(event);
      if (_pointers.length === 0) {
        scope.domElement.releasePointerCapture(event.pointerId);
        scope.domElement.removeEventListener('pointermove', onPointerMove);
        scope.domElement.removeEventListener('pointerup', onPointerUp);
      }
    }
    function onPointerCancel(event) {
      removePointer(event);
    }
    function keydown(event) {
      if (scope.enabled === false) {
        return;
      }
      window.removeEventListener('keydown', keydown);
      if (_keyState !== STATE.NONE) {
        return;
      } else if (event.code === scope.keys[STATE.ROTATE] && !scope.noRotate) {
        _keyState = STATE.ROTATE;
      } else if (event.code === scope.keys[STATE.ZOOM] && !scope.noZoom) {
        _keyState = STATE.ZOOM;
      } else if (event.code === scope.keys[STATE.PAN] && !scope.noPan) {
        _keyState = STATE.PAN;
      }
    }
    function keyup() {
      if (scope.enabled === false) {
        return;
      }
      _keyState = STATE.NONE;
      window.addEventListener('keydown', keydown);
    }
    function onMouseDown(event) {
      if (_state === STATE.NONE) {
        switch (event.button) {
          case scope.mouseButtons.LEFT:
            _state = STATE.ROTATE;
            break;
          case scope.mouseButtons.MIDDLE:
            _state = STATE.ZOOM;
            break;
          case scope.mouseButtons.RIGHT:
            _state = STATE.PAN;
            break;
          default:
            _state = STATE.NONE;
        }
      }
      var state = _keyState !== STATE.NONE ? _keyState : _state;
      if (state === STATE.ROTATE && !scope.noRotate) {
        _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
        _movePrev.copy(_moveCurr);
      } else if (state === STATE.ZOOM && !scope.noZoom) {
        _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _zoomEnd.copy(_zoomStart);
      } else if (state === STATE.PAN && !scope.noPan) {
        _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _panEnd.copy(_panStart);
      }
      scope.dispatchEvent(_startEvent);
      // @metacell changes
      scope.update();
      // end of @metacell changes
    }
    function onMouseMove(event) {
      var state = _keyState !== STATE.NONE ? _keyState : _state;
      if (state === STATE.ROTATE && !scope.noRotate) {
        _movePrev.copy(_moveCurr);
        _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
      } else if (state === STATE.ZOOM && !scope.noZoom) {
        _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      } else if (state === STATE.PAN && !scope.noPan) {
        _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      }
      // @metacell changes
      scope.update();
      // end of @metacell changes
    }
    function onMouseUp() {
      _state = STATE.NONE;
      scope.dispatchEvent(_endEvent);

      // @metacell changes
      scope.update();
      scope.unsetCameraByConsoleLock();
      // end of @metacell changes
    }
    function onMouseWheel(event) {
      if (scope.enabled === false) {
        return;
      }
      if (scope.noZoom === true) {
        return;
      }
      event.preventDefault();

      // _zoomEnd.x  = _zoomStart.x ;
      // _zoomEnd.y  = _zoomStart.y ;
      // _zoomEnd.z  = _zoomStart.z ;

      switch (event.deltaMode) {
        case 2:
          // Zoom in pages
          _zoomStart.y -= event.deltaY * 0.025;
          break;
        case 1:
          // Zoom in lines
          _zoomStart.y -= event.deltaY * 0.01;
          break;
        default:
          // undefined, 0, assume pixels
          _zoomStart.y -= event.deltaY * 0.00025;
          break;
      }
      scope.dispatchEvent(_startEvent);
      scope.dispatchEvent(_endEvent);

      // @metacell changes
      scope.update();
      scope.unsetCameraByConsoleLock();
      // end of @metacell changes
    }
    function onTouchStart(event) {
      trackPointer(event);
      switch (_pointers.length) {
        case 1:
          _state = STATE.TOUCH_ROTATE;
          _moveCurr.copy(getMouseOnCircle(_pointers[0].pageX, _pointers[0].pageY));
          _movePrev.copy(_moveCurr);
          break;
        default:
          // 2 or more
          _state = STATE.TOUCH_ZOOM_PAN;
          var dx = _pointers[0].pageX - _pointers[1].pageX;
          var dy = _pointers[0].pageY - _pointers[1].pageY;
          _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);
          var x = (_pointers[0].pageX + _pointers[1].pageX) / 2;
          var y = (_pointers[0].pageY + _pointers[1].pageY) / 2;
          _panStart.copy(getMouseOnScreen(x, y));
          _panEnd.copy(_panStart);
          break;
      }
      scope.dispatchEvent(_startEvent);
      // @metacell changes
      scope.update();
      // end of @metacell changes
    }
    function onTouchMove(event) {
      trackPointer(event);
      switch (_pointers.length) {
        case 1:
          _movePrev.copy(_moveCurr);
          _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
          break;
        default:
          // 2 or more

          var position = getSecondPointerPosition(event);
          var dx = event.pageX - position.x;
          var dy = event.pageY - position.y;
          _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);
          var x = (event.pageX + position.x) / 2;
          var y = (event.pageY + position.y) / 2;
          _panEnd.copy(getMouseOnScreen(x, y));
          break;
      }

      // @metacell changes
      scope.update();
      // end of @metacell changes
    }
    function onTouchEnd(event) {
      switch (_pointers.length) {
        case 0:
          _state = STATE.NONE;
          break;
        case 1:
          _state = STATE.TOUCH_ROTATE;
          _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
          _movePrev.copy(_moveCurr);
          break;
        case 2:
          _state = STATE.TOUCH_ZOOM_PAN;
          _moveCurr.copy(getMouseOnCircle(event.pageX - _movePrev.pageX, event.pageY - _movePrev.pageY));
          _movePrev.copy(_moveCurr);
          break;
      }
      scope.dispatchEvent(_endEvent);

      // @metacell changes
      scope.update();
      scope.unsetCameraByConsoleLock();
      // end of @metacell changes
    }
    function contextmenu(event) {
      if (scope.enabled === false) {
        return;
      }
      event.preventDefault();
      // @metacell changes
      scope.update();
      // end of @metacell changes
    }
    function addPointer(event) {
      _pointers.push(event);
    }
    function removePointer(event) {
      delete _pointerPositions[event.pointerId];
      for (var i = 0; i < _pointers.length; i++) {
        if (_pointers[i].pointerId == event.pointerId) {
          _pointers.splice(i, 1);
          return;
        }
      }
    }
    function trackPointer(event) {
      var position = _pointerPositions[event.pointerId];
      if (position === undefined) {
        position = new _three.Vector2();
        _pointerPositions[event.pointerId] = position;
      }
      position.set(event.pageX, event.pageY);
    }
    function getSecondPointerPosition(event) {
      var pointer = event.pointerId === _pointers[0].pointerId ? _pointers[1] : _pointers[0];
      return _pointerPositions[pointer.pointerId];
    }
    _this.updateOnResize = function () {
      scope.dispatchEvent(_startEvent);
      scope.dispatchEvent(_endEvent);
      scope.update();
      scope.unsetCameraByConsoleLock();
    };
    _this.dispose = function () {
      scope.domElement.removeEventListener('contextmenu', contextmenu);
      scope.domElement.removeEventListener('pointerdown', onPointerDown);
      scope.domElement.removeEventListener('pointercancel', onPointerCancel);
      scope.domElement.removeEventListener('wheel', onMouseWheel);
      scope.domElement.removeEventListener('pointermove', onPointerMove);
      scope.domElement.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
    _this.domElement.addEventListener('contextmenu', contextmenu);
    _this.domElement.addEventListener('pointerdown', onPointerDown);
    _this.domElement.addEventListener('pointercancel', onPointerCancel);
    _this.domElement.addEventListener('wheel', onMouseWheel, {
      passive: false
    });
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    _this.handleResize();

    // force an update at start
    _this.update();
    return _this;
  }
  _inherits(TrackballControls, _EventDispatcher);
  return _createClass(TrackballControls);
}(_three.EventDispatcher);
//# sourceMappingURL=TrackballControls.js.map