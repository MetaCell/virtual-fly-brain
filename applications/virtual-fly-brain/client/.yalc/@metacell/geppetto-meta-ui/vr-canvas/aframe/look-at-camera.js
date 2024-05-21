"use strict";

AFRAME.registerComponent('look-at-camera', {
  schema: {
    id: {
      type: 'string'
    }
  },
  tick: function tick() {
    var el = this.el;
    var id = this.data.id;
    var camera = document.getElementById("".concat(id, "_camera"));
    el.object3D.lookAt(camera.object3D.position);
  }
});
//# sourceMappingURL=look-at-camera.js.map