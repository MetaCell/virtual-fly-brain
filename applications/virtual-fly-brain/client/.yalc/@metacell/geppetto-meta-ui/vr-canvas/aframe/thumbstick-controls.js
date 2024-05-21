"use strict";

var _Events = require("../Events");
var MAX_DELTA = 0.2;
var CLAMP_VELOCITY = 0.00001;
function isEmptyObject(obj) {
  for (var _ in obj) {
    return false;
  }
  return true;
}
var bind = AFRAME.utils.bind;
AFRAME.registerComponent('thumbstick-controls', {
  schema: {
    acceleration: {
      "default": 65
    },
    adAxis: {
      "default": 'x',
      oneOf: ['x', 'y', 'z']
    },
    adEnabled: {
      "default": true
    },
    adInverted: {
      "default": false
    },
    easing: {
      "default": 20
    },
    fly: {
      "default": true
    },
    id: {
      type: 'string'
    },
    wsAxis: {
      "default": 'z',
      oneOf: ['x', 'y', 'z']
    },
    wsEnabled: {
      "default": true
    },
    wsInverted: {
      "default": false
    }
  },
  init: function init() {
    this.thumbstick = {};
    this.position = {};
    this.velocity = new THREE.Vector3();

    // Bind methods and add event listeners.
    this.onBlur = bind(this.onBlur, this);
    this.onFocus = bind(this.onFocus, this);
    this.onThumbstickMovement = bind(this.onThumbstickMovement, this);
    this.onThumbstickStop = bind(this.onThumbstickStop, this);
    this.onVisibilityChange = bind(this.onVisibilityChange, this);
    this.attachVisibilityEventListeners();
    this.getOrientationElement();
  },
  tick: function tick(time, delta) {
    var data = this.data;
    var el = this.el;
    var position = this.position;
    var velocity = this.velocity;
    if (!velocity[data.adAxis] && !velocity[data.wsAxis] && isEmptyObject(this.thumbstick)) {
      return;
    }

    // Update velocity.
    // eslint-disable-next-line no-param-reassign
    delta /= 1000;
    this.updateVelocity(delta);
    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) {
      return;
    }

    // Get movement vector and translate position.
    var currentPosition = el.getAttribute('position');
    var movementVector = this.getMovementVector(delta);
    position.x = currentPosition.x + movementVector.x;
    position.y = currentPosition.y + movementVector.y;
    position.z = currentPosition.z + movementVector.z;
    el.setAttribute('position', position);
  },
  remove: function remove() {
    this.removeThumbstickEventListeners();
    this.removeVisibilityEventListeners();
  },
  play: function play() {
    this.attachThumbstickEventListeners();
  },
  pause: function pause() {
    this.thumbstick = {};
    this.removeThumbstickEventListeners();
  },
  getOrientationElement: function getOrientationElement() {
    // If a orientation element was defined explicitly use it
    if (this.data.orientationEl) {
      this.orientationEl = this.data.orientationEl;
      return;
    }

    // If there is a camera on this element assume its the orientation element
    if (this.el.getAttribute('camera')) {
      this.orientationEl = this.el;
      return;
    }

    // If we still haven't found a camera, search through this elements children
    var childCamera = this.el.querySelector('[camera]');
    if (childCamera) {
      this.orientationEl = childCamera;
      return;
    }

    // No cameras found, just use this element
    this.orientationEl = this.el;
  },
  updateVelocity: function updateVelocity(delta) {
    var adSign;
    var data = this.data;
    var thumbstick = this.thumbstick;
    var velocity = this.velocity;
    var wsSign;
    var adAxis = data.adAxis,
      wsAxis = data.wsAxis,
      acceleration = data.acceleration;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      return;
    }

    // Decay velocity.
    if (velocity[adAxis] !== 0) {
      velocity[adAxis] -= velocity[adAxis] * data.easing * delta;
    }
    if (velocity[wsAxis] !== 0) {
      velocity[wsAxis] -= velocity[wsAxis] * data.easing * delta;
    }

    // Clamp velocity easing.
    if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) {
      velocity[adAxis] = 0;
    }
    if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) {
      velocity[wsAxis] = 0;
    }

    // Update velocity using thumbstick pressed.
    if (data.adEnabled) {
      adSign = data.adInverted ? -1 : 1;
      if (thumbstick.left) {
        velocity[adAxis] -= adSign * acceleration * delta * Math.abs(thumbstick.left);
      }
      if (thumbstick.right) {
        velocity[adAxis] += adSign * acceleration * delta * Math.abs(thumbstick.right);
      }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;
      if (thumbstick.up) {
        velocity[wsAxis] -= wsSign * acceleration * delta * Math.abs(thumbstick.up);
      }
      if (thumbstick.down) {
        velocity[wsAxis] += wsSign * acceleration * delta * Math.abs(thumbstick.down);
      }
    }
  },
  getMovementVector: function () {
    var directionVector = new THREE.Vector3(0, 0, 0);
    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    return function (delta) {
      var rotation = this.orientationEl.getAttribute('rotation'); // this.el.getAttribute('rotation');
      var velocity = this.velocity;
      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) {
        return directionVector;
      }
      var xRotation = this.data.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
      directionVector.applyEuler(rotationEuler);
      return directionVector;
    };
  }(),
  attachVisibilityEventListeners: function attachVisibilityEventListeners() {
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },
  removeVisibilityEventListeners: function removeVisibilityEventListeners() {
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  },
  attachThumbstickEventListeners: function attachThumbstickEventListeners() {
    var el = this.el;
    el.addEventListener(_Events.MOVE_PLAYER, this.onThumbstickMovement);
    el.addEventListener(_Events.STOP_PLAYER, this.onThumbstickStop);
  },
  removeThumbstickEventListeners: function removeThumbstickEventListeners() {
    var el = this.el;
    el.removeEventListener(_Events.MOVE_PLAYER, this.onThumbstickMovement);
    el.removeEventListener(_Events.STOP_PLAYER, this.onThumbstickStop);
  },
  onBlur: function onBlur() {
    this.pause();
  },
  onFocus: function onFocus() {
    this.play();
  },
  onVisibilityChange: function onVisibilityChange() {
    if (document.hidden) {
      this.onBlur();
    } else {
      this.onFocus();
    }
  },
  onThumbstickMovement: function onThumbstickMovement(event) {
    var id = this.data.id;
    var _event$detail = event.detail,
      hand = _event$detail.hand,
      data = _event$detail.data;
    if (hand === "".concat(id, "_rightHand")) {
      if (data.x < 0) {
        this.thumbstick.left = data.x;
      } else if (data.x > 0) {
        this.thumbstick.right = data.x;
      }
      if (data.y < 0) {
        this.thumbstick.up = data.y;
      } else if (data.y > 0) {
        this.thumbstick.down = data.y;
      }
    }
  },
  onThumbstickStop: function onThumbstickStop() {
    this.thumbstick = {};
  }
});
//# sourceMappingURL=thumbstick-controls.js.map