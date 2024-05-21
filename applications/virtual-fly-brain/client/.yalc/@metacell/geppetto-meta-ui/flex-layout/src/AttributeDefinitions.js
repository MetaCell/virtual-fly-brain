"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Attribute = _interopRequireDefault(require("./Attribute"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/** @hidden @internal */
var AttributeDefinitions = /*#__PURE__*/function () {
  function AttributeDefinitions() {
    _classCallCheck(this, AttributeDefinitions);
    _defineProperty(this, "attributes", void 0);
    _defineProperty(this, "nameToAttribute", void 0);
    this.attributes = [];
    this.nameToAttribute = {};
  }
  return _createClass(AttributeDefinitions, [{
    key: "addWithAll",
    value: function addWithAll(name, modelName, defaultValue, alwaysWriteJson) {
      var attr = new _Attribute["default"](name, modelName, defaultValue, alwaysWriteJson);
      this.attributes.push(attr);
      this.nameToAttribute[name] = attr;
      return attr;
    }
  }, {
    key: "addInherited",
    value: function addInherited(name, modelName) {
      return this.addWithAll(name, modelName, undefined, false);
    }
  }, {
    key: "add",
    value: function add(name, defaultValue, alwaysWriteJson) {
      return this.addWithAll(name, undefined, defaultValue, alwaysWriteJson);
    }
  }, {
    key: "getAttributes",
    value: function getAttributes() {
      return this.attributes;
    }
  }, {
    key: "getModelName",
    value: function getModelName(name) {
      var conversion = this.nameToAttribute[name];
      if (conversion !== undefined) {
        return conversion.modelName;
      }
      return undefined;
    }
  }, {
    key: "toJson",
    value: function toJson(jsonObj, obj) {
      this.attributes.forEach(function (attr) {
        var fromValue = obj[attr.name];
        if (attr.alwaysWriteJson || fromValue !== attr.defaultValue) {
          jsonObj[attr.name] = fromValue;
        }
      });
    }
  }, {
    key: "fromJson",
    value: function fromJson(jsonObj, obj) {
      this.attributes.forEach(function (attr) {
        var fromValue = jsonObj[attr.name];
        if (fromValue === undefined) {
          obj[attr.name] = attr.defaultValue;
        } else {
          obj[attr.name] = fromValue;
        }
      });
    }
  }, {
    key: "update",
    value: function update(jsonObj, obj) {
      this.attributes.forEach(function (attr) {
        var fromValue = jsonObj[attr.name];
        if (fromValue !== undefined) {
          obj[attr.name] = fromValue;
        }
      });
    }
  }, {
    key: "setDefaults",
    value: function setDefaults(obj) {
      this.attributes.forEach(function (attr) {
        obj[attr.name] = attr.defaultValue;
      });
    }
  }, {
    key: "toTypescriptInterface",
    value: function toTypescriptInterface(name, parentAttributes) {
      var lines = [];
      var sorted = this.attributes.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      // const sorted = this.attributes;
      lines.push("export interface I" + name + "Attributes {");
      for (var i = 0; i < sorted.length; i++) {
        var c = sorted[i];
        var type = c.type;
        var defaultValue = undefined;
        var attr = c;
        var inherited = undefined;
        if (attr.defaultValue !== undefined) {
          defaultValue = attr.defaultValue;
        } else if (attr.modelName !== undefined && parentAttributes !== undefined && parentAttributes.nameToAttribute[attr.modelName] !== undefined) {
          inherited = attr.modelName;
          attr = parentAttributes.nameToAttribute[attr.modelName];
          defaultValue = attr.defaultValue;
          type = attr.type;
        }
        var defValue = JSON.stringify(defaultValue);
        var required = attr.required || attr.fixed ? "" : "?";
        if (c.fixed) {
          lines.push("\t" + c.name + ": " + defValue + ";");
        } else {
          var comment = (defaultValue !== undefined ? "default: " + defValue : "") + (inherited !== undefined ? " - inherited from global " + inherited : "");
          lines.push("\t" + c.name + required + ": " + type + ";" + (comment.length > 0 ? " // " + comment : ""));
        }
      }
      lines.push("}");
      return lines.join("\n");
    }
  }]);
}();
/** @hidden @internal */
var _default = exports["default"] = AttributeDefinitions;
//# sourceMappingURL=AttributeDefinitions.js.map