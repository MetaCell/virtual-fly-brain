"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var THREE = _interopRequireWildcard(require("three"));
var _ami = require("ami.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var HelpersStack = (0, _ami.stackHelperFactory)(THREE);
var CamerasOrthographic = (0, _ami.orthographicCameraFactory)(THREE);
var ControlsTrackball = (0, _ami.trackballControlFactory)(THREE);
var ControlsOrthographic = (0, _ami.trackballOrthoControlFactory)(THREE);
var HelpersLocalizer = (0, _ami.localizerHelperFactory)(THREE);
var dicomViewerUtils = {
  windowResize2D: function windowResize2D(rendererObj) {
    var newWidth = rendererObj.domElement.clientWidth;
    var newHeight = rendererObj.domElement.clientHeight;
    rendererObj.camera.canvas = {
      width: newWidth,
      height: newHeight
    };
    rendererObj.camera.fitBox(2, 1);
    rendererObj.renderer.setSize(newWidth, newHeight);

    /*
     * update info to draw borders properly
     * TODO: Remove once we are sure to remove the dotted line doesn't have any side effect
     * rendererObj.stackHelper.slice.canvasWidth = newWidth;
     * rendererObj.stackHelper.slice.canvasHeight = newHeight;
     */
    rendererObj.stackHelper.slice.canvasWidth = -1;
    rendererObj.stackHelper.slice.canvasHeight = -1;
    rendererObj.localizerHelper.canvasWidth = newWidth;
    rendererObj.localizerHelper.canvasHeight = newHeight;
  },
  windowResize3D: function windowResize3D(rendererObj) {
    var newWidth = rendererObj.domElement.clientWidth;
    var newHeight = rendererObj.domElement.clientHeight;
    rendererObj.camera.aspect = newWidth / newHeight;
    rendererObj.camera.updateProjectionMatrix();
    rendererObj.renderer.setSize(newWidth, newHeight);
  },
  dispose: function dispose(rendererObj) {
    if (rendererObj.stackHelper) {
      rendererObj.stackHelper.dispose();
      if (rendererObj.stackHelper.stack) {
        rendererObj.stackHelper.stack._rawData.length = 0;
        rendererObj.stackHelper.stack._frame.length = 0;
        rendererObj.stackHelper.stack = null;
      }
    }
    if (rendererObj.localizerHelper) {
      if (rendererObj.localizerHelper._mesh) {
        rendererObj.localizerHelper.remove(rendererObj.localizerHelper._mesh);
        rendererObj.localizerHelper._mesh.geometry.dispose();
        rendererObj.localizerHelper._mesh.geometry = null;
        rendererObj.localizerHelper._mesh = null;
      }
    }
  },
  initHelpersStack: function initHelpersStack(rendererObj, stack) {
    if (rendererObj.stackHelper) {
      rendererObj.stackHelper.dispose();
      if (rendererObj.stackHelper.stack) {
        rendererObj.stackHelper.stack._rawData.length = 0;
        rendererObj.stackHelper.stack._frame.length = 0;
        rendererObj.stackHelper.stack = null;
      }
    }
    rendererObj.stackHelper = new HelpersStack(stack);
    rendererObj.stackHelper.bbox.visible = false;
    rendererObj.stackHelper.borderColor = rendererObj.sliceColor;

    /*
     * TODO: Remove once we are sure to remove the dotted line doesn't have any side effect
     * rendererObj.stackHelper.slice.canvasWidth = rendererObj.domElement.clientWidth;
     * rendererObj.stackHelper.slice.canvasHeight = rendererObj.domElement.clientHeight;
     */
    rendererObj.stackHelper.slice.canvasWidth = -1;
    rendererObj.stackHelper.slice.canvasHeight = -1;

    // set camera
    var worldbb = stack.worldBoundingBox();
    var lpsDims = new THREE.Vector3((worldbb[1] - worldbb[0]) / 2, (worldbb[3] - worldbb[2]) / 2, (worldbb[5] - worldbb[4]) / 2);
    var box = {
      center: stack.worldCenter().clone(),
      halfDimensions: new THREE.Vector3(lpsDims.x + 5, lpsDims.y + 5, lpsDims.z + 5)
    };

    // init and zoom
    var canvas = {
      width: rendererObj.domElement.clientWidth,
      height: rendererObj.domElement.clientHeight
    };
    rendererObj.camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
    rendererObj.camera.box = box;
    rendererObj.camera.canvas = canvas;
    rendererObj.camera.orientation = rendererObj.sliceOrientation;
    rendererObj.camera.update();
    rendererObj.camera.fitBox(2, 1);
    rendererObj.stackHelper.orientation = rendererObj.camera.stackOrientation;
    rendererObj.stackHelper.index = Math.floor(rendererObj.stackHelper.orientationMaxIndex / 2);
    rendererObj.scene.add(rendererObj.stackHelper);
  },
  initHelpersLocalizer: function initHelpersLocalizer(rendererObj, stack, referencePlane, localizers) {
    if (rendererObj.localizerHelper) {
      if (rendererObj.localizerHelper._mesh) {
        rendererObj.localizerHelper.remove(rendererObj.localizerHelper._mesh);
        rendererObj.localizerHelper._mesh.geometry.dispose();
        rendererObj.localizerHelper._mesh.geometry = null;
        rendererObj.localizerHelper._mesh = null;
      }
    }
    rendererObj.localizerHelper = new HelpersLocalizer(stack, rendererObj.stackHelper.slice.geometry, referencePlane);
    for (var i = 0; i < localizers.length; i++) {
      rendererObj.localizerHelper['plane' + (i + 1)] = localizers[i].plane;
      rendererObj.localizerHelper['color' + (i + 1)] = localizers[i].color;
    }
    rendererObj.localizerHelper.canvasWidth = rendererObj.domElement.clientWidth;
    rendererObj.localizerHelper.canvasHeight = rendererObj.domElement.clientHeight;
    rendererObj.localizerScene = new THREE.Scene();
    rendererObj.localizerScene.add(rendererObj.localizerHelper);
  },
  updateLocalizer: function updateLocalizer(refObj, targetLocalizersHelpers) {
    var refHelper = refObj.stackHelper;
    var localizerHelper = refObj.localizerHelper;
    var plane = refHelper.slice.cartesianEquation();
    localizerHelper.referencePlane = plane;

    // bit of a hack... works fine for this application
    for (var i = 0; i < targetLocalizersHelpers.length; i++) {
      for (var j = 0; j < 4; j++) {
        var targetPlane = targetLocalizersHelpers[i]['plane' + (j + 1)];
        if (targetPlane && plane.x === targetPlane.x && plane.y === targetPlane.y && plane.z === targetPlane.z) {
          targetLocalizersHelpers[i]['plane' + (j + 1)] = plane;
        }
      }
    }

    // update the geometry will create a new mesh
    localizerHelper.geometry = refHelper.slice.geometry;
  },
  initRenderer2D: function initRenderer2D(rendererObj, parentContainer) {
    // renderer
    rendererObj.domElement = parentContainer.getElementsByClassName(rendererObj.domClass)[0];
    rendererObj.domElement.innerHTML = '';
    rendererObj.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    rendererObj.renderer.autoClear = false;
    rendererObj.renderer.localClippingEnabled = true;
    rendererObj.renderer.setSize(rendererObj.domElement.clientWidth, rendererObj.domElement.clientHeight);
    rendererObj.renderer.setClearColor(0x121212, 1);
    rendererObj.renderer.setPixelRatio(window.devicePixelRatio);
    rendererObj.renderer.domElement.id = rendererObj.targetID;
    rendererObj.domElement.appendChild(rendererObj.renderer.domElement);

    // camera
    rendererObj.camera = new CamerasOrthographic(rendererObj.domElement.clientWidth / -2, rendererObj.domElement.clientWidth / 2, rendererObj.domElement.clientHeight / 2, rendererObj.domElement.clientHeight / -2, 1, 1000);

    // controls
    rendererObj.controls = new ControlsOrthographic(rendererObj.camera, rendererObj.domElement);
    rendererObj.controls.staticMoving = true;
    rendererObj.controls.noRotate = true;
    rendererObj.controls.noPan = true;
    rendererObj.camera.controls = rendererObj.controls;

    // scene
    rendererObj.scene = new THREE.Scene();
  },
  initRenderer3D: function initRenderer3D(renderObj, parentContainer) {
    // renderer
    renderObj.domElement = parentContainer.getElementsByClassName(renderObj.domClass)[0];
    renderObj.domElement.innerHTML = '';
    renderObj.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderObj.renderer.setSize(renderObj.domElement.clientWidth, renderObj.domElement.clientHeight);
    renderObj.renderer.setClearColor(renderObj.color, 1);
    renderObj.renderer.domElement.id = renderObj.targetID;
    renderObj.domElement.appendChild(renderObj.renderer.domElement);

    // camera
    renderObj.camera = new THREE.PerspectiveCamera(45, renderObj.domElement.clientWidth / renderObj.domElement.clientHeight, 0.1, 100000);
    renderObj.camera.position.x = 250;
    renderObj.camera.position.y = 250;
    renderObj.camera.position.z = 250;

    // controls
    renderObj.controls = new ControlsTrackball(renderObj.camera, renderObj.domElement);
    renderObj.controls.rotateSpeed = 5.5;
    renderObj.controls.zoomSpeed = 0.6;
    renderObj.controls.panSpeed = 0.8;
    renderObj.controls.staticMoving = true;
    renderObj.controls.dynamicDampingFactor = 0.3;
    renderObj.controls.minDistance = 80;
    renderObj.controls.maxDistance = 500;

    // scene
    renderObj.scene = new THREE.Scene();

    // light
    renderObj.light = new THREE.DirectionalLight(0xffffff, 1);
    renderObj.light.position.copy(renderObj.camera.position);
    renderObj.scene.add(renderObj.light);
  }
};
var _default = exports["default"] = dicomViewerUtils;
//# sourceMappingURL=DicomViewerUtils.js.map