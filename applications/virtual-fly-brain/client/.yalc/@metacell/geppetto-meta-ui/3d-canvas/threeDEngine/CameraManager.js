"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var THREE = _interopRequireWildcard(require("three"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CameraManager = exports["default"] = /*#__PURE__*/function () {
  function CameraManager(engine, cameraOptions) {
    _classCallCheck(this, CameraManager);
    this.engine = engine;
    this.sceneCenter = new THREE.Vector3();
    this.camera = new THREE.PerspectiveCamera(cameraOptions.angle, cameraOptions.aspect, cameraOptions.near, cameraOptions.far);
    this.engine.scene.add(this.camera);
    this.camera.up = new THREE.Vector3(0, 1, 0);
    this.camera.direction = new THREE.Vector3(0, 0, 1);
    this.camera.lookAt(this.sceneCenter);
    this.baseZoom = cameraOptions.baseZoom;
    this.isFirstRender = true;
    var initialFlip = cameraOptions.initialFlip;
    if (initialFlip && initialFlip.length > 0) {
      this.flipCamera(initialFlip);
    }
  }
  return _createClass(CameraManager, [{
    key: "update",
    value: function update(cameraOptions) {
      var initialPosition = cameraOptions.initialPosition,
        initialRotation = cameraOptions.initialRotation,
        autoRotate = cameraOptions.autoRotate,
        movieFilter = cameraOptions.movieFilter,
        initialZoomTo = cameraOptions.initialZoomTo,
        reset = cameraOptions.reset,
        trackballControls = cameraOptions.trackballControls;
      if (reset || this.isFirstRender && initialPosition === undefined && initialZoomTo === undefined) {
        this.resetCamera(initialPosition, initialRotation, initialZoomTo);
        if (this.isFirstRender) {
          this.isFirstRender = false;
        }
      } else {
        if (initialPosition && this.isFirstRender) {
          this.setCameraPosition(initialPosition.x, initialPosition.y, initialPosition.z);
        }
        if (initialRotation && this.isFirstRender) {
          this.setCameraRotation(initialRotation.rx, initialRotation.ry, initialRotation.rz, initialRotation.radius);
        }
        if (initialZoomTo && Array.isArray(initialZoomTo) && this.isFirstRender) {
          var instances = initialZoomTo.map(function (element) {
            return Instances.getInstance(element);
          });
          if (instances.length > 0) {
            this.zoomTo(instances);
          }
        }
        if (autoRotate) {
          this.autoRotate(movieFilter);
        }
        if (trackballControls) {
          this.setTrackballControlsConfigs(trackballControls);
        }
        if (this.isFirstRender) {
          this.isFirstRender = false;
        }
      }
    }

    /**
     *
     * @param instances
     */
  }, {
    key: "zoomTo",
    value: function zoomTo(instances) {
      this.engine.controls.reset();
      this.zoomToParameters(this.zoomIterator(instances, {}));
    }

    /**
     *
     * @param initalFlip
     */
  }, {
    key: "flipCamera",
    value: function flipCamera(initialFlip) {
      var _iterator = _createForOfIteratorHelper(initialFlip),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var axis = _step.value;
          if (axis.toLowerCase() === 'y') {
            this.flipCameraY();
          } else if (axis.toLowerCase() === 'z') {
            this.flipCameraZ();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Reinitializes the camera with the Y axis flipped
     */
  }, {
    key: "flipCameraY",
    value: function flipCameraY() {
      this.camera.up = new THREE.Vector3(0, -1, 0);
    }

    /**
     * Reinitializes the camera with the Z axis flipped
     */
  }, {
    key: "flipCameraZ",
    value: function flipCameraZ() {
      this.camera.direction = new THREE.Vector3(0, 0, -1);
    }

    /**
     *
     * @param instances
     * @param zoomParameters
     * @returns {*}
     */
  }, {
    key: "zoomIterator",
    value: function zoomIterator(instances, zoomParameters) {
      var that = this;
      for (var i = 0; i < instances.length; i++) {
        var instancePath = instances[i].getInstancePath();
        var mesh = this.engine.meshFactory.meshes[instancePath];
        if (mesh) {
          mesh.traverse(function (object) {
            if (Object.prototype.hasOwnProperty.call(object, 'geometry')) {
              that.addMeshToZoomParameters(object, zoomParameters);
            }
          });
        } else {
          zoomParameters = this.zoomIterator(instances[i].getChildren(), zoomParameters);
        }
      }
      return zoomParameters;
    }

    /**
     *
     * @param mesh
     * @param zoomParameters
     * @returns {*}
     */
  }, {
    key: "addMeshToZoomParameters",
    value: function addMeshToZoomParameters(mesh, zoomParameters) {
      mesh.geometry.computeBoundingBox();
      var bb = mesh.geometry.boundingBox;
      bb.translate(mesh.localToWorld(new THREE.Vector3()));

      // If min and max vectors are null, first values become default min and max
      if (zoomParameters.aabbMin == undefined && zoomParameters.aabbMax == undefined) {
        zoomParameters.aabbMin = bb.min;
        zoomParameters.aabbMax = bb.max;
      } else {
        // Compare other meshes, particles BB's to find min and max
        zoomParameters.aabbMin.x = Math.min(zoomParameters.aabbMin.x, bb.min.x);
        zoomParameters.aabbMin.y = Math.min(zoomParameters.aabbMin.y, bb.min.y);
        zoomParameters.aabbMin.z = Math.min(zoomParameters.aabbMin.z, bb.min.z);
        zoomParameters.aabbMax.x = Math.max(zoomParameters.aabbMax.x, bb.max.x);
        zoomParameters.aabbMax.y = Math.max(zoomParameters.aabbMax.y, bb.max.y);
        zoomParameters.aabbMax.z = Math.max(zoomParameters.aabbMax.z, bb.max.z);
      }
      return zoomParameters;
    }

    /**
     *
     * @param zoomParameters
     */
  }, {
    key: "zoomToParameters",
    value: function zoomToParameters(zoomParameters) {
      // Compute world AABB center
      this.sceneCenter.x = (zoomParameters.aabbMax.x + zoomParameters.aabbMin.x) * 0.5;
      this.sceneCenter.y = (zoomParameters.aabbMax.y + zoomParameters.aabbMin.y) * 0.5;
      this.sceneCenter.z = (zoomParameters.aabbMax.z + zoomParameters.aabbMin.z) * 0.5;
      this.updateCamera(zoomParameters.aabbMax, zoomParameters.aabbMin);
    }
  }, {
    key: "resetCamera",
    value: function resetCamera(position, rotation, zoomTo) {
      var _this = this;
      var applyRotation = function applyRotation(rotation) {
        if (rotation) {
          _this.setCameraRotation(rotation.rx, rotation.ry, rotation.rz, rotation.radius);
        }
      };
      if (zoomTo) {
        var instances = zoomTo.map(function (element) {
          return Instances.getInstance(element);
        });
        if (instances.length > 0) {
          this.zoomTo(instances);
        }
        applyRotation(rotation);
        return;
      }
      if (position) {
        this.setCameraPosition(position.x, position.y, position.z);
        applyRotation(rotation);
        return;
      }
      this.engine.controls.reset();
      var aabbMin = null;
      var aabbMax = null;
      var maxSize = null;
      this.engine.scene.traverse(function (child) {
        if (Object.prototype.hasOwnProperty.call(child, 'geometry') && child.visible === true) {
          child.geometry.computeBoundingBox();
          var bb = child.geometry.boundingBox;
          var size = bb.getSize(new THREE.Vector3()).length();
          bb.translate(child.localToWorld(new THREE.Vector3()));

          /*
           * If min and max vectors are null, first values become
           * default min and max
           */
          if (aabbMin == null && aabbMax == null && maxSize == null) {
            aabbMin = bb.min;
            aabbMax = bb.max;
            maxSize = size;
          } else {
            // Compare other meshes, particles BB's to find min and max
            aabbMin.x = Math.min(aabbMin.x, bb.min.x);
            aabbMin.y = Math.min(aabbMin.y, bb.min.y);
            aabbMin.z = Math.min(aabbMin.z, bb.min.z);
            aabbMax.x = Math.max(aabbMax.x, bb.max.x);
            aabbMax.y = Math.max(aabbMax.y, bb.max.y);
            aabbMax.z = Math.max(aabbMax.z, bb.max.z);
            maxSize = Math.max(maxSize, size);
          }
        }
      });
      if (aabbMin != null && aabbMax != null) {
        // Compute world AABB center
        this.sceneCenter.x = (aabbMax.x + aabbMin.x) * 0.5;
        this.sceneCenter.y = (aabbMax.y + aabbMin.y) * 0.5;
        this.sceneCenter.z = (aabbMax.z + aabbMin.z) * 0.5;
        this.camera.near = maxSize / 100;
        this.camera.far = maxSize * 100;
        this.updateCamera(aabbMax, aabbMin);
      }
      applyRotation(rotation);
    }

    /**
     * Update camera with new position and place to lookat
     * @param aabbMax
     * @param aabbMin
     */
  }, {
    key: "updateCamera",
    value: function updateCamera(aabbMax, aabbMin) {
      // Compute world AABB "radius"
      var diag = new THREE.Vector3();
      diag = diag.subVectors(aabbMax, aabbMin);
      var radius = diag.length() * 0.5;
      this.pointCameraTo(this.sceneCenter);

      // Compute offset needed to move the camera back that much needed to center AABB
      var offset = radius / Math.sin(Math.PI / 180.0 * this.camera.fov * 0.5) / this.baseZoom;
      var dir = this.camera.direction.clone();
      dir.multiplyScalar(offset);

      // Store camera position

      this.camera.position.addVectors(dir, this.engine.controls.target);
      this.camera.updateProjectionMatrix();
    }

    /**
     *  Refocus camera to the center of the new object
     * @param node
     */
  }, {
    key: "pointCameraTo",
    value: function pointCameraTo(node) {
      var COG;
      if (node instanceof THREE.Vector3) {
        COG = node;
      } else {
        COG = this.shapeCenterOfGravity(node);
      }
      var v = new THREE.Vector3();
      v.subVectors(COG, this.engine.controls.target);
      this.camera.position.addVectors(this.camera.position, v);

      // retrieve camera orientation

      this.camera.lookAt(COG);
      this.engine.controls.target.set(COG.x, COG.y, COG.z);
    }

    /**
     *
     * @param obj
     * @returns {*}
     */
  }, {
    key: "shapeCenterOfGravity",
    value: function shapeCenterOfGravity(obj) {
      return this.boundingBox(obj).center();
    }

    /**
     *
     * @param obj
     * @returns {*}
     */
  }, {
    key: "boundingBox",
    value: function boundingBox(obj) {
      if (obj instanceof THREE.Mesh) {
        var geometry = obj.geometry;
        geometry.computeBoundingBox();
        return geometry.boundingBox;
      }
      if (obj instanceof THREE.Object3D) {
        var bb = new THREE.Box3();
        for (var i = 0; i < obj.children.length; i++) {
          bb.union(this.boundingBox(obj.children[i]));
        }
        return bb;
      }
    }

    /**
     * Returns the camera
     * @returns camera
     */
  }, {
    key: "getCamera",
    value: function getCamera() {
      return this.camera;
    }

    /**
     * @param x
     * @param y
     */
  }, {
    key: "incrementCameraPan",
    value: function incrementCameraPan(x, y) {
      this.engine.controls.incrementPanEnd(x, y);
    }

    /**
     * @param x
     * @param y
     * @param z
     */
  }, {
    key: "incrementCameraRotate",
    value: function incrementCameraRotate(x, y, z) {
      this.engine.controls.incrementRotationEnd(x, y, z);
    }

    /**
     * @param z
     */
  }, {
    key: "incrementCameraZoom",
    value: function incrementCameraZoom(z) {
      this.engine.controls.incrementZoomEnd(z);
    }

    /**
     * @param x
     * @param y
     * @param z
     */
  }, {
    key: "setCameraPosition",
    value: function setCameraPosition(x, y, z) {
      this.engine.controls.setPosition(x, y, z);
    }

    /**
     * @param rx
     * @param ry
     * @param rz
     * @param radius
     */
  }, {
    key: "setCameraRotation",
    value: function setCameraRotation(rx, ry, rz, radius) {
      this.engine.controls.setRotation(rx, ry, rz, radius);
    }
  }, {
    key: "setTrackballControlsConfigs",
    value: function setTrackballControlsConfigs(config) {
      var rotationSpeed = config.rotationSpeed,
        zoomSpeed = config.zoomSpeed,
        panSpeed = config.panSpeed;
      this.engine.controls.setRotationalSpeed(rotationSpeed);
      this.engine.controls.setZoomSpeed(zoomSpeed);
      this.engine.controls.setPanSpeed(panSpeed);
    }

    /**
     * Rotate the camera around the selection
     * @movieFilter
     */
  }, {
    key: "autoRotate",
    value: function autoRotate(movieFilter) {
      var that = this;
      if (this.rotate == null) {
        if (movieFilter === undefined || movieFilter === true) {
          this.movieMode(true);
        }
        this.engine.controls.setRotationalSpeed(0.075);
        this.rotate = setInterval(function () {
          that.incrementCameraRotate(0.5, 0);
        }, 25);
      } else {
        if (movieFilter === undefined || movieFilter === true) {
          this.movieMode(false);
        }
        this.engine.controls.resetRotationalSpeed();
        clearInterval(this.rotate);
        this.rotate = null;
      }
    }

    /**
     *
     * @param shaders
     */
  }, {
    key: "movieMode",
    value: function movieMode(shaders) {
      this.engine.configureRenderer(shaders);
    }
  }]);
}();
//# sourceMappingURL=CameraManager.js.map