"use strict";

var React = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _src = _interopRequireWildcard(require("../../src"));
var FlexLayout = _src;
var _Utils = _interopRequireDefault(require("./Utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var fields = ["Name", "Field1", "Field2", "Field3", "Field4", "Field5"];
var App = /*#__PURE__*/function (_React$Component) {
  function App(props) {
    var _this;
    _classCallCheck(this, App);
    _this = _callSuper(this, App, [props]);
    _defineProperty(_this, "loadingLayoutName", void 0);
    _defineProperty(_this, "nextGridIndex", 1);
    _defineProperty(_this, "load", function (jsonText) {
      var json = JSON.parse(jsonText);
      var model = FlexLayout.Model.fromJson(json);
      // model.setOnCreateTabSet((tabNode?: TabNode) => {
      //     console.log("onCreateTabSet " + tabNode);
      //     // return { type: "tabset", name: "Header Text" };
      //     return { type: "tabset" };
      // });

      // you can control where nodes can be dropped
      //model.setOnAllowDrop(this.allowDrop);

      _this.setState({
        layoutFile: _this.loadingLayoutName,
        model: model
      });
    });
    _defineProperty(_this, "allowDrop", function (dragNode, dropInfo) {
      var dropNode = dropInfo.node;

      // prevent non-border tabs dropping into borders
      if (dropNode.getType() == "border" && (dragNode.getParent() == null || dragNode.getParent().getType() != "border")) return false;

      // prevent border tabs dropping into main layout
      if (dropNode.getType() != "border" && dragNode.getParent() != null && dragNode.getParent().getType() == "border") return false;
      return true;
    });
    _defineProperty(_this, "error", function (reason) {
      alert("Error loading json config file: " + _this.loadingLayoutName + "\n" + reason);
    });
    _defineProperty(_this, "onAddDragMouseDown", function (event) {
      event.stopPropagation();
      event.preventDefault();
      if (_this.state.model.getMaximizedTabset() == null) {
        _this.refs.layout.addTabWithDragAndDrop("Add grid<br>(Drag to location)", {
          component: "grid",
          name: "Grid " + _this.nextGridIndex++
        }, _this.onAdded);
        // this.setState({ adding: true });
      }
    });
    _defineProperty(_this, "onAddActiveClick", function (event) {
      if (_this.state.model.getMaximizedTabset() == null) {
        _this.refs.layout.addTabToActiveTabSet({
          component: "grid",
          name: "Grid " + _this.nextGridIndex++
        });
      }
    });
    _defineProperty(_this, "onAddFromTabSetButton", function (node) {
      // if (this.state.model!.getMaximizedTabset() == null) {
      _this.refs.layout.addTabToTabSet(node.getId(), {
        component: "grid",
        name: "Grid " + _this.nextGridIndex++
      });
      // }
    });
    _defineProperty(_this, "onAddIndirectClick", function (event) {
      if (_this.state.model.getMaximizedTabset() == null) {
        _this.refs.layout.addTabWithDragAndDropIndirect("Add grid<br>(Drag to location)", {
          component: "grid",
          name: "Grid " + _this.nextGridIndex++
        }, _this.onAdded);
        _this.setState({
          adding: true
        });
      }
    });
    _defineProperty(_this, "onExternalDrag", function (e) {
      // console.log("onExternaldrag ", e.dataTransfer.types);
      // Check for supported content type
      var validTypes = ["text/uri-list", "text/html", "text/plain"];
      if (e.dataTransfer.types.find(function (t) {
        return validTypes.indexOf(t) !== -1;
      }) === undefined) return undefined;
      // Set dropEffect (icon)
      e.dataTransfer.dropEffect = "link";
      return {
        dragText: "Drag To New Tab",
        json: {
          type: "tab",
          component: "multitype"
        },
        onDrop: function onDrop(node, event) {
          if (!node || !event) return; // aborted drag

          if (node instanceof _src.TabNode && event instanceof DragEvent) {
            var dragEvent = event;
            if (dragEvent.dataTransfer) {
              if (dragEvent.dataTransfer.types.indexOf("text/uri-list") !== -1) {
                var data = dragEvent.dataTransfer.getData("text/uri-list");
                _this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {
                  name: "Url",
                  config: {
                    data: data,
                    type: "url"
                  }
                }));
              } else if (dragEvent.dataTransfer.types.indexOf("text/html") !== -1) {
                var _data = dragEvent.dataTransfer.getData("text/html");
                _this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {
                  name: "Html",
                  config: {
                    data: _data,
                    type: "html"
                  }
                }));
              } else if (dragEvent.dataTransfer.types.indexOf("text/plain") !== -1) {
                var _data2 = dragEvent.dataTransfer.getData("text/plain");
                _this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {
                  name: "Text",
                  config: {
                    data: _data2,
                    type: "text"
                  }
                }));
              }
            }
          }
        }
      };
    });
    _defineProperty(_this, "onShowLayoutClick", function (event) {
      console.log(JSON.stringify(_this.state.model.toJson(), null, "\t"));
    });
    _defineProperty(_this, "onAdded", function () {
      _this.setState({
        adding: false
      });
    });
    _defineProperty(_this, "onTableClick", function (node, event) {
      // console.log("tab: \n" + node._toAttributeString());
      // console.log("tabset: \n" + node.getParent()!._toAttributeString());
    });
    _defineProperty(_this, "onAction", function (action) {
      return action;
    });
    _defineProperty(_this, "factory", function (node) {
      // log lifecycle events
      //node.setEventListener("resize", function(p){console.log("resize");});
      //node.setEventListener("visibility", function(p){console.log("visibility");});
      //node.setEventListener("close", function(p){console.log("close");});

      var component = node.getComponent();
      if (component === "grid") {
        if (node.getExtraData().data == null) {
          // create data in node extra data first time accessed
          node.getExtraData().data = _this.makeFakeData();
        }
        return /*#__PURE__*/React.createElement(SimpleTable, {
          fields: fields,
          onClick: _this.onTableClick.bind(_this, node),
          data: node.getExtraData().data
        });
      } else if (component === "sub") {
        var model = node.getExtraData().model;
        if (model == null) {
          node.getExtraData().model = FlexLayout.Model.fromJson(node.getConfig().model);
          model = node.getExtraData().model;
          // save submodel on save event
          node.setEventListener("save", function (p) {
            _this.state.model.doAction(FlexLayout.Actions.updateNodeAttributes(node.getId(), {
              config: {
                model: node.getExtraData().model.toJson()
              }
            }));
            //  node.getConfig().model = node.getExtraData().model.toJson();
          });
        }
        return /*#__PURE__*/React.createElement(FlexLayout.Layout, {
          model: model,
          factory: _this.factory
        });
      } else if (component === "text") {
        try {
          return /*#__PURE__*/React.createElement("div", {
            dangerouslySetInnerHTML: {
              __html: node.getConfig().text
            }
          });
        } catch (e) {
          console.log(e);
        }
      } else if (component === "multitype") {
        try {
          var config = node.getConfig();
          if (config.type === "url") {
            return /*#__PURE__*/React.createElement("iframe", {
              title: node.getId(),
              src: config.data,
              style: {
                display: "block",
                boxSizing: "border-box"
              },
              width: "100%",
              height: "100%"
            });
          } else if (config.type === "html") {
            return /*#__PURE__*/React.createElement("div", {
              dangerouslySetInnerHTML: {
                __html: config.data
              }
            });
          } else if (config.type === "text") {
            return /*#__PURE__*/React.createElement("textarea", {
              style: {
                position: "absolute",
                width: "100%",
                height: "100%",
                resize: "none",
                boxSizing: "border-box",
                border: "none"
              },
              defaultValue: config.data
            });
          }
        } catch (e) {
          return /*#__PURE__*/React.createElement("div", null, String(e));
        }
      }
      return null;
    });
    _defineProperty(_this, "titleFactory", function (node) {
      if (node.getId() === "custom-tab") {
        // return "(Added by titleFactory) " + node.getName();
        return {
          titleContent: /*#__PURE__*/React.createElement("div", null, "(Added by titleFactory) ", node.getName()),
          name: "the name for custom tab"
        };
      }
      return undefined;
    });
    _defineProperty(_this, "iconFactory", function (node) {
      if (node.getId() === "custom-tab") {
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
          style: {
            marginRight: 3
          }
        }, ":)"));
      }
      return undefined;
    });
    _defineProperty(_this, "onSelectLayout", function (event) {
      var target = event.target;
      _this.loadLayout(target.value);
    });
    _defineProperty(_this, "onReloadFromFile", function (event) {
      _this.loadLayout(_this.state.layoutFile, true);
    });
    _defineProperty(_this, "onThemeChange", function (event) {
      var target = event.target;
      var flexlayout_stylesheet = window.document.getElementById("flexlayout-stylesheet");
      var index = flexlayout_stylesheet.href.lastIndexOf("/");
      var newAddress = flexlayout_stylesheet.href.substr(0, index);
      flexlayout_stylesheet.setAttribute("href", newAddress + "/" + target.value + ".css");
      var page_stylesheet = window.document.getElementById("page-stylesheet");
      page_stylesheet.setAttribute("href", target.value + ".css");
      _this.forceUpdate();
    });
    _defineProperty(_this, "onSizeChange", function (event) {
      var target = event.target;
      _this.setState({
        fontSize: target.value
      });
    });
    _defineProperty(_this, "onRenderTab", function (node, renderValues) {
      // renderValues.content += " *";
      // renderValues.name = "tab " + node.getId(); // name used in overflow menu
      // renderValues.buttons.push(<img src="images/grey_ball.png"/>);
    });
    _defineProperty(_this, "onRenderTabSet", function (node, renderValues) {
      if (_this.state.layoutFile === "default") {
        //renderValues.headerContent = "-- " + renderValues.headerContent + " --";
        //renderValues.buttons.push(<img src="images/grey_ball.png"/>);
        renderValues.stickyButtons.push( /*#__PURE__*/React.createElement("img", {
          src: "images/add.png",
          alt: "Add",
          key: "Add button",
          title: "Add Tab (using onRenderTabSet callback, see Demo)",
          style: {
            marginLeft: 5,
            width: 24,
            height: 24
          },
          onClick: function onClick() {
            return _this.onAddFromTabSetButton(node);
          }
        }));
      }
    });
    _this.state = {
      layoutFile: null,
      model: null,
      adding: false,
      fontSize: "medium"
    };

    // save layout when unloading page
    window.onbeforeunload = function (event) {
      _this.save();
    };
    return _this;
  }
  _inherits(App, _React$Component);
  return _createClass(App, [{
    key: "preventIOSScrollingWhenDragging",
    value: function preventIOSScrollingWhenDragging(e) {
      if (FlexLayout.DragDrop.instance.isActive()) {
        e.preventDefault();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadLayout("default", false);
      document.body.addEventListener("touchmove", this.preventIOSScrollingWhenDragging, {
        passive: false
      });

      // use to generate json typescript interfaces 
      // Model.toTypescriptInterfaces();
    }
  }, {
    key: "save",
    value: function save() {
      var jsonStr = JSON.stringify(this.state.model.toJson(), null, "\t");
      localStorage.setItem(this.state.layoutFile, jsonStr);
    }
  }, {
    key: "loadLayout",
    value: function loadLayout(layoutName, reload) {
      if (this.state.layoutFile !== null) {
        this.save();
      }
      this.loadingLayoutName = layoutName;
      var loaded = false;
      if (!reload) {
        var json = localStorage.getItem(layoutName);
        if (json != null) {
          this.load(json);
          loaded = true;
        }
      }
      if (!loaded) {
        _Utils["default"].downloadFile("layouts/" + layoutName + ".layout", this.load, this.error);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var contents = "loading ...";
      var maximized = false;
      if (this.state.model !== null) {
        maximized = this.state.model.getMaximizedTabset() !== undefined;
        contents = /*#__PURE__*/React.createElement(FlexLayout.Layout, {
          ref: "layout",
          model: this.state.model,
          factory: this.factory,
          font: {
            size: this.state.fontSize
          },
          onAction: this.onAction,
          titleFactory: this.titleFactory,
          iconFactory: this.iconFactory,
          onRenderTab: this.onRenderTab,
          onRenderTabSet: this.onRenderTabSet,
          onExternalDrag: this.onExternalDrag
          // classNameMapper={
          //     className => {
          //         console.log(className);
          //         if (className === "flexlayout__tab_button--selected") {
          //             className = "override__tab_button--selected";
          //         }
          //         return className;
          //     }
          // }
          // i18nMapper = {
          //     (id, param?) => {
          //         if (id === FlexLayout.I18nLabel.Move_Tab) {
          //             return `move this tab: ${param}`;
          //         } else if (id === FlexLayout.I18nLabel.Move_Tabset) {
          //             return `move this tabset`
          //         }
          //         return undefined;
          //     }
          // }
        });
      }
      return /*#__PURE__*/React.createElement("div", {
        className: "app"
      }, /*#__PURE__*/React.createElement("div", {
        className: "toolbar"
      }, /*#__PURE__*/React.createElement("select", {
        onChange: this.onSelectLayout
      }, /*#__PURE__*/React.createElement("option", {
        value: "default"
      }, "Default"), /*#__PURE__*/React.createElement("option", {
        value: "simple"
      }, "Simple"), /*#__PURE__*/React.createElement("option", {
        value: "justsplitters"
      }, "Just Splitters"), /*#__PURE__*/React.createElement("option", {
        value: "sub"
      }, "SubLayout"), /*#__PURE__*/React.createElement("option", {
        value: "complex"
      }, "Complex"), /*#__PURE__*/React.createElement("option", {
        value: "preferred"
      }, "Using Preferred size"), /*#__PURE__*/React.createElement("option", {
        value: "trader"
      }, "Trader")), /*#__PURE__*/React.createElement("button", {
        onClick: this.onReloadFromFile,
        style: {
          marginLeft: 5
        }
      }, "reload from file"), /*#__PURE__*/React.createElement("div", {
        style: {
          flexGrow: 1
        }
      }), /*#__PURE__*/React.createElement("select", {
        style: {
          marginLeft: 5
        },
        onChange: this.onSizeChange,
        defaultValue: "medium"
      }, /*#__PURE__*/React.createElement("option", {
        value: "xx-small"
      }, "Size xx-small"), /*#__PURE__*/React.createElement("option", {
        value: "x-small"
      }, "Size x-small"), /*#__PURE__*/React.createElement("option", {
        value: "small"
      }, "Size small"), /*#__PURE__*/React.createElement("option", {
        value: "medium"
      }, "Size medium"), /*#__PURE__*/React.createElement("option", {
        value: "large"
      }, "Size large"), /*#__PURE__*/React.createElement("option", {
        value: "8px"
      }, "Size 8px"), /*#__PURE__*/React.createElement("option", {
        value: "10px"
      }, "Size 10px"), /*#__PURE__*/React.createElement("option", {
        value: "12px"
      }, "Size 12px"), /*#__PURE__*/React.createElement("option", {
        value: "14px"
      }, "Size 14px"), /*#__PURE__*/React.createElement("option", {
        value: "16px"
      }, "Size 16px"), /*#__PURE__*/React.createElement("option", {
        value: "18px"
      }, "Size 18px"), /*#__PURE__*/React.createElement("option", {
        value: "20px"
      }, "Size 20px"), /*#__PURE__*/React.createElement("option", {
        value: "25px"
      }, "Size 25px"), /*#__PURE__*/React.createElement("option", {
        value: "30px"
      }, "Size 30px"), /*#__PURE__*/React.createElement("option", {
        value: "70%"
      }, "Size 70%"), /*#__PURE__*/React.createElement("option", {
        value: "80%"
      }, "Size 80%"), /*#__PURE__*/React.createElement("option", {
        value: "90%"
      }, "Size 90%"), /*#__PURE__*/React.createElement("option", {
        value: "100%"
      }, "Size 100%"), /*#__PURE__*/React.createElement("option", {
        value: "120%"
      }, "Size 120%"), /*#__PURE__*/React.createElement("option", {
        value: "140%"
      }, "Size 140%"), /*#__PURE__*/React.createElement("option", {
        value: "160%"
      }, "Size 160%"), /*#__PURE__*/React.createElement("option", {
        value: "180%"
      }, "Size 180%"), /*#__PURE__*/React.createElement("option", {
        value: "200%"
      }, "Size 200%")), /*#__PURE__*/React.createElement("select", {
        style: {
          marginLeft: 5
        },
        defaultValue: "gray",
        onChange: this.onThemeChange
      }, /*#__PURE__*/React.createElement("option", {
        value: "light"
      }, "Light"), /*#__PURE__*/React.createElement("option", {
        value: "gray"
      }, "Gray"), /*#__PURE__*/React.createElement("option", {
        value: "dark"
      }, "Dark")), /*#__PURE__*/React.createElement("button", {
        style: {
          marginLeft: 5
        },
        onClick: this.onShowLayoutClick
      }, "Show Layout JSON in Console"), /*#__PURE__*/React.createElement("button", {
        disabled: this.state.adding || maximized,
        style: {
          height: "30px",
          marginLeft: 5,
          border: "none",
          outline: "none",
          backgroundColor: "lightgray"
        },
        title: "Add using Layout.addTabWithDragAndDrop",
        onMouseDown: this.onAddDragMouseDown,
        onTouchStart: this.onAddDragMouseDown
      }, "Add Drag"), /*#__PURE__*/React.createElement("button", {
        disabled: this.state.adding || maximized,
        style: {
          marginLeft: 5
        },
        title: "Add using Layout.addTabToActiveTabSet",
        onClick: this.onAddActiveClick
      }, "Add Active"), /*#__PURE__*/React.createElement("button", {
        disabled: this.state.adding || maximized,
        style: {
          marginLeft: 5
        },
        title: "Add using Layout.addTabWithDragAndDropIndirect",
        onClick: this.onAddIndirectClick
      }, "Add Indirect")), /*#__PURE__*/React.createElement("div", {
        className: "contents"
      }, contents));
    }
  }, {
    key: "makeFakeData",
    value: function makeFakeData() {
      var data = [];
      var r = Math.random() * 50;
      for (var i = 0; i < r; i++) {
        var rec = {};
        rec.Name = this.randomString(5, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        for (var j = 1; j < fields.length; j++) {
          rec[fields[j]] = (1.5 + Math.random() * 2).toFixed(2);
        }
        data.push(rec);
      }
      return data;
    }
  }, {
    key: "randomString",
    value: function randomString(len, chars) {
      var a = [];
      for (var i = 0; i < len; i++) {
        a.push(chars[Math.floor(Math.random() * chars.length)]);
      }
      return a.join("");
    }
  }]);
}(React.Component);
var SimpleTable = /*#__PURE__*/function (_React$Component2) {
  function SimpleTable() {
    _classCallCheck(this, SimpleTable);
    return _callSuper(this, SimpleTable, arguments);
  }
  _inherits(SimpleTable, _React$Component2);
  return _createClass(SimpleTable, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      // if (Math.random()>0.8) throw Error("oppps I crashed");
      var headercells = this.props.fields.map(function (field) {
        return /*#__PURE__*/React.createElement("th", {
          key: field
        }, field);
      });
      var rows = [];
      for (var i = 0; i < this.props.data.length; i++) {
        var row = this.props.fields.map(function (field) {
          return /*#__PURE__*/React.createElement("td", {
            key: field
          }, _this2.props.data[i][field]);
        });
        rows.push( /*#__PURE__*/React.createElement("tr", {
          key: i
        }, row));
      }
      return /*#__PURE__*/React.createElement("table", {
        className: "simple_table",
        onClick: this.props.onClick
      }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, headercells), rows));
    }
  }]);
}(React.Component);
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("container"));
//# sourceMappingURL=App.js.map