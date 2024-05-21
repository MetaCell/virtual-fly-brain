"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Rect = _interopRequireDefault(require("./Rect"));
var _DragDrop;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/** @hidden @internal */
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var DragDrop = /*#__PURE__*/function () {
  /** @hidden @internal */
  function DragDrop() {
    _classCallCheck(this, DragDrop);
    /** @hidden @internal */
    _defineProperty(this, "_fDblClick", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_fClick", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_fDragEnd", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_fDragMove", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_fDragStart", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_fDragCancel", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_glass", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_manualGlassManagement", false);
    /** @hidden @internal */
    _defineProperty(this, "_lastClick", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_clickX", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_clickY", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_startX", 0);
    /** @hidden @internal */
    _defineProperty(this, "_startY", 0);
    /** @hidden @internal */
    _defineProperty(this, "_dragDepth", 0);
    /** @hidden @internal */
    _defineProperty(this, "_glassShowing", false);
    /** @hidden @internal */
    _defineProperty(this, "_dragging", false);
    /** @hidden @internal */
    _defineProperty(this, "_active", false);
    // drag and drop is in progress, can be used on ios to prevent body scrolling (see demo)
    /** @hidden @internal */
    _defineProperty(this, "_document", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_rootElement", void 0);
    /** @hidden @internal */
    _defineProperty(this, "_lastEvent", void 0);
    if (canUseDOM) {
      // check for serverside rendering
      this._glass = document.createElement("div");
      this._glass.style.zIndex = "998";
      this._glass.style.backgroundColor = "transparent";
      this._glass.style.outline = "none";
    }
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
    this._onDragCancel = this._onDragCancel.bind(this);
    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this.resizeGlass = this.resizeGlass.bind(this);
    this._lastClick = 0;
    this._clickX = 0;
    this._clickY = 0;
  }

  // if you add the glass pane then you should remove it
  return _createClass(DragDrop, [{
    key: "addGlass",
    value: function addGlass(fCancel) {
      if (!this._glassShowing) {
        var _this$_document$defau;
        if (!this._document) {
          this._document = window.document;
        }
        if (!this._rootElement) {
          this._rootElement = this._document.body;
        }
        this.resizeGlass();
        (_this$_document$defau = this._document.defaultView) === null || _this$_document$defau === void 0 || _this$_document$defau.addEventListener('resize', this.resizeGlass);
        this._document.body.appendChild(this._glass);
        this._glass.tabIndex = -1;
        this._glass.focus();
        this._glass.addEventListener("keydown", this._onKeyPress);
        this._glass.addEventListener("dragenter", this._onDragEnter, {
          passive: false
        });
        this._glass.addEventListener("dragover", this._onMouseMove, {
          passive: false
        });
        this._glass.addEventListener("dragleave", this._onDragLeave, {
          passive: false
        });
        this._glassShowing = true;
        this._fDragCancel = fCancel;
        this._manualGlassManagement = false;
      } else {
        // second call to addGlass (via dragstart)
        this._manualGlassManagement = true;
      }
    }
  }, {
    key: "resizeGlass",
    value: function resizeGlass() {
      var glassRect = _Rect["default"].fromElement(this._rootElement);
      glassRect.positionElement(this._glass, "fixed");
    }
  }, {
    key: "hideGlass",
    value: function hideGlass() {
      if (this._glassShowing) {
        var _defaultView;
        this._document.body.removeChild(this._glass);
        (_defaultView = this._document.defaultView) === null || _defaultView === void 0 || _defaultView.removeEventListener('resize', this.resizeGlass);
        this._glassShowing = false;
        this._document = undefined;
        this._rootElement = undefined;
      }
    }
  }, {
    key: "startDrag",
    value: function startDrag(event, fDragStart, fDragMove, fDragEnd, fDragCancel, fClick, fDblClick, currentDocument, rootElement) {
      // prevent 'duplicate' action (mouse event for same action as previous touch event (a fix for ios))
      if (event && this._lastEvent && this._lastEvent.type.startsWith("touch") && event.type.startsWith("mouse") && event.timeStamp - this._lastEvent.timeStamp < 500) {
        return;
      }
      this._lastEvent = event;
      if (currentDocument) {
        this._document = currentDocument;
      } else {
        this._document = window.document;
      }
      if (rootElement) {
        this._rootElement = rootElement;
      } else {
        this._rootElement = this._document.body;
      }
      var posEvent = this._getLocationEvent(event);
      this.addGlass(fDragCancel);
      if (this._dragging) {
        console.warn("this._dragging true on startDrag should never happen");
      }
      if (event) {
        this._startX = posEvent.clientX;
        this._startY = posEvent.clientY;
        if (!window.matchMedia || window.matchMedia("(pointer: fine)").matches) {
          this._glass.style.cursor = getComputedStyle(event.target).cursor;
        }
        this._stopPropagation(event);
        this._preventDefault(event);
      } else {
        this._startX = 0;
        this._startY = 0;
        this._glass.style.cursor = "default";
      }
      this._dragging = false;
      this._fDragStart = fDragStart;
      this._fDragMove = fDragMove;
      this._fDragEnd = fDragEnd;
      this._fDragCancel = fDragCancel;
      this._fClick = fClick;
      this._fDblClick = fDblClick;
      this._active = true;
      if ((event === null || event === void 0 ? void 0 : event.type) === 'dragenter') {
        this._dragDepth = 1;
        this._rootElement.addEventListener("dragenter", this._onDragEnter, {
          passive: false
        });
        this._rootElement.addEventListener("dragover", this._onMouseMove, {
          passive: false
        });
        this._rootElement.addEventListener("dragleave", this._onDragLeave, {
          passive: false
        });
        this._document.addEventListener("dragend", this._onDragCancel, {
          passive: false
        });
        this._document.addEventListener("drop", this._onMouseUp, {
          passive: false
        });
      } else {
        this._document.addEventListener("mouseup", this._onMouseUp, {
          passive: false
        });
        this._document.addEventListener("mousemove", this._onMouseMove, {
          passive: false
        });
        this._document.addEventListener("touchend", this._onMouseUp, {
          passive: false
        });
        this._document.addEventListener("touchmove", this._onMouseMove, {
          passive: false
        });
      }
    }
  }, {
    key: "isDragging",
    value: function isDragging() {
      return this._dragging;
    }
  }, {
    key: "isActive",
    value: function isActive() {
      return this._active;
    }
  }, {
    key: "toString",
    value: function toString() {
      var rtn = "(DragDrop: " + "startX=" + this._startX + ", startY=" + this._startY + ", dragging=" + this._dragging + ")";
      return rtn;
    }

    /** @hidden @internal */
  }, {
    key: "_onKeyPress",
    value: function _onKeyPress(event) {
      if (event.keyCode === 27) {
        // esc
        this._onDragCancel();
      }
    }

    /** @hidden @internal */
  }, {
    key: "_onDragCancel",
    value: function _onDragCancel() {
      this._rootElement.removeEventListener("dragenter", this._onDragEnter);
      this._rootElement.removeEventListener("dragover", this._onMouseMove);
      this._rootElement.removeEventListener("dragleave", this._onDragLeave);
      this._document.removeEventListener("dragend", this._onDragCancel);
      this._document.removeEventListener("drop", this._onMouseUp);
      this._document.removeEventListener("mousemove", this._onMouseMove);
      this._document.removeEventListener("mouseup", this._onMouseUp);
      this._document.removeEventListener("touchend", this._onMouseUp);
      this._document.removeEventListener("touchmove", this._onMouseMove);
      this.hideGlass();
      if (this._fDragCancel !== undefined) {
        this._fDragCancel(this._dragging);
      }
      this._dragging = false;
      this._active = false;
    }

    /** @hidden @internal */
  }, {
    key: "_getLocationEvent",
    value: function _getLocationEvent(event) {
      var posEvent = event;
      if (event && event.touches) {
        posEvent = event.touches[0];
      }
      return posEvent;
    }

    /** @hidden @internal */
  }, {
    key: "_getLocationEventEnd",
    value: function _getLocationEventEnd(event) {
      var posEvent = event;
      if (event.changedTouches) {
        posEvent = event.changedTouches[0];
      }
      return posEvent;
    }

    /** @hidden @internal */
  }, {
    key: "_stopPropagation",
    value: function _stopPropagation(event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      }
    }

    /** @hidden @internal */
  }, {
    key: "_preventDefault",
    value: function _preventDefault(event) {
      if (event.preventDefault && event.cancelable) {
        event.preventDefault();
      }
      return event;
    }

    /** @hidden @internal */
  }, {
    key: "_onMouseMove",
    value: function _onMouseMove(event) {
      this._lastEvent = event;
      var posEvent = this._getLocationEvent(event);
      this._stopPropagation(event);
      this._preventDefault(event);
      if (!this._dragging && (Math.abs(this._startX - posEvent.clientX) > 5 || Math.abs(this._startY - posEvent.clientY) > 5)) {
        this._dragging = true;
        if (this._fDragStart) {
          this._glass.style.cursor = "move";
          this._dragging = this._fDragStart({
            clientX: this._startX,
            clientY: this._startY
          });
        }
      }
      if (this._dragging) {
        if (this._fDragMove) {
          this._fDragMove(posEvent);
        }
      }
      return false;
    }

    /** @hidden @internal */
  }, {
    key: "_onMouseUp",
    value: function _onMouseUp(event) {
      this._lastEvent = event;
      var posEvent = this._getLocationEventEnd(event);
      this._stopPropagation(event);
      this._preventDefault(event);
      this._active = false;
      this._rootElement.removeEventListener("dragenter", this._onDragEnter);
      this._rootElement.removeEventListener("dragover", this._onMouseMove);
      this._rootElement.removeEventListener("dragleave", this._onDragLeave);
      this._document.removeEventListener("dragend", this._onDragCancel);
      this._document.removeEventListener("drop", this._onMouseUp);
      this._document.removeEventListener("mousemove", this._onMouseMove);
      this._document.removeEventListener("mouseup", this._onMouseUp);
      this._document.removeEventListener("touchend", this._onMouseUp);
      this._document.removeEventListener("touchmove", this._onMouseMove);
      if (!this._manualGlassManagement) {
        this.hideGlass();
      }
      if (this._dragging) {
        this._dragging = false;
        if (this._fDragEnd) {
          this._fDragEnd(event);
        }
        // dump("set dragging = false\n");
      } else {
        if (this._fDragCancel) {
          this._fDragCancel(this._dragging);
        }
        if (Math.abs(this._startX - posEvent.clientX) <= 5 && Math.abs(this._startY - posEvent.clientY) <= 5) {
          var clickTime = new Date().getTime();
          // check for double click
          if (Math.abs(this._clickX - posEvent.clientX) <= 5 && Math.abs(this._clickY - posEvent.clientY) <= 5) {
            if (clickTime - this._lastClick < 500) {
              if (this._fDblClick) {
                this._fDblClick(event);
              }
            }
          }
          if (this._fClick) {
            this._fClick(event);
          }
          this._lastClick = clickTime;
          this._clickX = posEvent.clientX;
          this._clickY = posEvent.clientY;
        }
      }
      return false;
    }

    /** @hidden @internal */
  }, {
    key: "_onDragEnter",
    value: function _onDragEnter(event) {
      this._preventDefault(event);
      this._stopPropagation(event);
      this._dragDepth++;
      return false;
    }

    /** @hidden @internal */
  }, {
    key: "_onDragLeave",
    value: function _onDragLeave(event) {
      this._preventDefault(event);
      this._stopPropagation(event);
      this._dragDepth--;
      if (this._dragDepth <= 0) {
        this._onDragCancel();
      }
      return false;
    }
  }]);
}();
_DragDrop = DragDrop;
_defineProperty(DragDrop, "instance", new _DragDrop());
var _default = exports["default"] = DragDrop;
//# sourceMappingURL=DragDrop.js.map