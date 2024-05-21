"use strict";

var _Events = require("../Events");
function clicked(target, event, detail) {
  var evt = new CustomEvent(_Events.MENU_CLICK, {
    detail: {
      event: event,
      detail: detail
    }
  });
  target.dispatchEvent(evt);
}
AFRAME.registerComponent('menu-interactable', {
  schema: {
    id: {
      type: 'string'
    },
    event: {
      type: 'string'
    },
    evtDetail: {
      type: 'string'
    }
  },
  init: function init() {
    var el = this.el;
    var _this$data = this.data,
      id = _this$data.id,
      event = _this$data.event,
      evtDetail = _this$data.evtDetail;
    this.scene = document.getElementById("".concat(id, "_scene"));
    el.addEventListener('triggerdown', clicked.bind(this, this.scene, event, evtDetail));
    el.addEventListener('click', clicked.bind(this, this.scene, event, evtDetail));
  },
  remove: function remove() {
    var el = this.el;
    el.removeEventListener('click', clicked);
    el.removeEventListener('triggerdown', clicked);
  }
});
//# sourceMappingURL=menu-interactable.js.map