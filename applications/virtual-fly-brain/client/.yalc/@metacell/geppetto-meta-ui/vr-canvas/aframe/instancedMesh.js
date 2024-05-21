"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/* eslint-disable */
AFRAME.registerComponent('instancedmesh', {
  schema: {
    retainParent: {
      "default": false
    },
    retainChildren: {
      "default": false
    },
    //Not yet implemented
    inheritMat: {
      "default": true
    },
    mergeInstances: {
      "default": false
    },
    //Not yet implemented
    frustumCulled: {
      "default": true
    }
  },
  init: function init() {},
  update: function update() {
    var _this = this;
    var self = this;
    var el = this.el;
    var list = this.el.children;
    var quantity = 0;
    var applyMatrix = function () {
      var position = new THREE.Vector3();
      var rotation = new THREE.Euler();
      var scale = new THREE.Vector3();
      var quaternion = new THREE.Quaternion();
      return function (i, matrix) {
        position.x = el.children[i].object3D.position.x;
        position.y = el.children[i].object3D.position.y;
        position.z = el.children[i].object3D.position.z;
        rotation.x = el.children[i].object3D.rotation.x;
        rotation.y = el.children[i].object3D.rotation.y;
        rotation.z = el.children[i].object3D.rotation.z;
        quaternion.setFromEuler(rotation);
        scale.x = el.children[i].object3D.scale.x;
        scale.y = el.children[i].object3D.scale.y;
        scale.z = el.children[i].object3D.scale.z;
        matrix.compose(position, quaternion, scale);
      }; //High verbosity because imma N00b don´t know how to access matrix on an uninitialized object
    }();
    var _iterator = _createForOfIteratorHelper(list),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        quantity = quantity + 1;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var mesh = this.el.getObject3D('mesh');
    if (!mesh) {
      this.el.addEventListener('model-loaded', function (e) {
        _this.update.call(_this, _this.data);
      });
      return;
    }
    var material = mesh.material.clone();
    mesh.traverse(function (node) {
      if (node.type != 'Mesh') return;
      geometry = node.geometry;
    });
    var amesh = new THREE.InstancedMesh(geometry, material, quantity);
    for (i = 0; i < quantity; i++) {
      matrix = new THREE.Matrix4();
      child = this.el.children[i];
      applyMatrix(i, matrix);
      amesh.setMatrixAt(i, matrix);
    }
    //frustumCulled
    amesh.frustumCulled = this.data.frustumCulled;
    this.el.object3D.add(amesh);
    // retainParent
    if (!self.data.retainParent) {
      this.el.object3D.remove(mesh);
    }
    // inheritMat (Set material attribute to cloned material)
    if (self.data.inheritMat) {
      this.el.components.material.material = material;
    }
  }
});
//# sourceMappingURL=instancedMesh.js.map