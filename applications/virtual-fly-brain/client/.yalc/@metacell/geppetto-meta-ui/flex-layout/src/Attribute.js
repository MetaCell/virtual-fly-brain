"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/** @hidden @internal */
var Attribute = /*#__PURE__*/function () {
  function Attribute(name, modelName, defaultValue, alwaysWriteJson) {
    _classCallCheck(this, Attribute);
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "modelName", void 0);
    _defineProperty(this, "defaultValue", void 0);
    _defineProperty(this, "alwaysWriteJson", void 0);
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "required", void 0);
    _defineProperty(this, "fixed", void 0);
    this.name = name;
    this.modelName = modelName;
    this.defaultValue = defaultValue;
    this.alwaysWriteJson = alwaysWriteJson;
    this.required = false;
    this.fixed = false;
    this.type = "any";
  }
  return _createClass(Attribute, [{
    key: "setType",
    value: function setType(value) {
      this.type = value;
      return this;
    }
  }, {
    key: "setRequired",
    value: function setRequired() {
      this.required = true;
      return this;
    }
  }, {
    key: "setFixed",
    value: function setFixed() {
      this.fixed = true;
      return this;
    }
  }]);
}();
/** @hidden @internal */
_defineProperty(Attribute, "NUMBER", "number");
_defineProperty(Attribute, "STRING", "string");
_defineProperty(Attribute, "BOOLEAN", "boolean");
var _default = exports["default"] = Attribute;
//# sourceMappingURL=Attribute.js.map