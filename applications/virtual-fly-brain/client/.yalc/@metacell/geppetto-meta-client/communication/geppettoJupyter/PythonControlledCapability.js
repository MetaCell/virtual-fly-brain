"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
/**
 *
 * Synched capability
 * @module Widgets/Widget
 * @author Adrian Quintana (adrian@metacell.us)
 * @author Matteo Cantarelli (matteo@metacell.us)
 */
define(function (require) {
  var $ = require('jquery');
  var React = require('react');
  var Utils = require('./GeppettoJupyterUtils');
  module.exports = {
    createPythonControlledComponent: function createPythonControlledComponent(WrappedComponent) {
      if (typeof WrappedComponent !== "function") {
        // Fixes components defined as objects (e.g. Material-ui components)
        var Wrapper = /*#__PURE__*/function (_React$Component) {
          _inherits(Wrapper, _React$Component);
          var _super = _createSuper(Wrapper);
          function Wrapper() {
            _classCallCheck(this, Wrapper);
            return _super.apply(this, arguments);
          }
          _createClass(Wrapper, [{
            key: "render",
            value: function render() {
              return /*#__PURE__*/React.createElement(WrappedComponent, this.props);
            }
          }]);
          return Wrapper;
        }(React.Component);
        WrappedComponent = Wrapper;
      }
      var PythonControlledComponent = /*#__PURE__*/function (_WrappedComponent) {
        _inherits(PythonControlledComponent, _WrappedComponent);
        var _super2 = _createSuper(PythonControlledComponent);
        function PythonControlledComponent(props) {
          var _this;
          _classCallCheck(this, PythonControlledComponent);
          _this = _super2.call(this, props);
          if (_this.state == undefined) {
            _this.state = {};
          }
          _this.state.model = props.model;
          _this.state.componentType = getNameFromWrappedComponent(WrappedComponent);
          _this.id = _this.props.id == undefined ? _this.props.model : _this.props.id;
          _this._isMounted = false;
          return _this;
        }
        _createClass(PythonControlledComponent, [{
          key: "setSyncValueWithPythonHandler",
          value: function setSyncValueWithPythonHandler(handler) {
            this.syncValueWithPython = handler;
          }
        }, {
          key: "connectToPython",
          value: function connectToPython(componentType, model) {
            Utils.execPythonMessage('jupyter_geppetto.ComponentSync(componentType="' + componentType + '",model="' + model + '",id="' + this.id + '").connect()');
          }
        }, {
          key: "disconnectFromPython",
          value: function disconnectFromPython() {
            Utils.execPythonMessage('jupyter_geppetto.remove_component_sync(componentType="' + this.state.componentType + '",model="' + this.id + '")');
          }
        }, {
          key: "componentWillUnmount",
          value: function componentWillUnmount() {
            this._isMounted = false;
            this.disconnectFromPython();
          }
        }, {
          key: "UNSAFE_componentWillReceiveProps",
          value: function UNSAFE_componentWillReceiveProps(nextProps) {
            this.disconnectFromPython();
            this.id = nextProps.id == undefined ? nextProps.model : nextProps.id;
            this.connectToPython(this.state.componentType, nextProps.model);
            if (this.state.value != nextProps.value) {
              this.setState({
                value: nextProps.value === undefined ? '' : nextProps.value
              });
            }
          }
        }, {
          key: "componentDidMount",
          value: function componentDidMount() {
            this._isMounted = true;
            if (this.props.model != undefined) {
              this.connectToPython(this.state.componentType, this.props.model);
            }
            if (this.props.value != undefined) {
              this.setState({
                value: this.props.value
              });
            }
          }
        }]);
        return PythonControlledComponent;
      }(WrappedComponent);
      return PythonControlledComponent;
    },
    createPythonControlledControl: function createPythonControlledControl(WrappedComponent) {
      var PythonControlledComponent = this.createPythonControlledComponent(WrappedComponent);
      var PythonControlledControl = /*#__PURE__*/function (_PythonControlledComp) {
        _inherits(PythonControlledControl, _PythonControlledComp);
        var _super3 = _createSuper(PythonControlledControl);
        function PythonControlledControl(props) {
          var _this2;
          _classCallCheck(this, PythonControlledControl);
          _this2 = _super3.call(this, props);
          _this2.state = $.extend(_this2.state, {
            value: '',
            searchText: '',
            checked: false
          });

          // If a handleChange method is passed as a props it will overwrite the handleChange python controlled capability
          _this2.handleChange = _this2.props.handleChange == undefined ? _this2.handleChange.bind(_assertThisInitialized(_this2)) : _this2.props.handleChange.bind(_assertThisInitialized(_this2));
          _this2.handleUpdateInput = _this2.handleUpdateInput.bind(_assertThisInitialized(_this2));
          _this2.handleUpdateCheckbox = _this2.handleUpdateCheckbox.bind(_assertThisInitialized(_this2));
          return _this2;
        }
        _createClass(PythonControlledControl, [{
          key: "componentDidMount",
          value: function componentDidMount() {
            _get(_getPrototypeOf(PythonControlledControl.prototype), "componentDidMount", this).call(this);
            this.UNRELIABLE_SyncDefaultValueWithPython();
          }

          /*
           * since we don't know when a component will be synched with python,
           * we can't know when to check if this.state.value should be replaced
           * with this.props.default
           */
        }, {
          key: "UNRELIABLE_SyncDefaultValueWithPython",
          value: function UNRELIABLE_SyncDefaultValueWithPython() {
            var _this3 = this;
            var timeInterval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
            var attemps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            if (attemps < 3) {
              setTimeout(function () {
                if (_this3.props["default"] && _this3.state.value === '') {
                  if (_this3.syncValueWithPython) {
                    // this function is added by jupyter_geppetto after the component is synched with python
                    _this3.syncValueWithPython(_this3.props["default"]);
                  } else {
                    _this3.UNRELIABLE_SyncDefaultValueWithPython(timeInterval * 2, attemps + 1);
                  }
                }
              }, timeInterval);
            } else {
              console.warn("Tried to sync default value for ".concat(this.props.model, " and failed after 3 attemps."));
            }
          }
        }, {
          key: "UNSAFE_componentWillReceiveProps",
          value: function UNSAFE_componentWillReceiveProps(nextProps) {
            this.disconnectFromPython();
            this.id = nextProps.id == undefined ? nextProps.model : nextProps.id;
            this.connectToPython(this.state.componentType, nextProps.model);
            if (this.state.searchText != nextProps.searchText && nextProps.searchText != undefined) {
              this.setState({
                searchText: nextProps.searchText
              });
            }
            if (this.state.checked != nextProps.checked && nextProps.checked != undefined) {
              this.setState({
                checked: nextProps.checked
              });
            }
            if (this.state.value != nextProps.value && nextProps.value != undefined) {
              this.setState({
                value: nextProps.value
              });
            }
            if (this.state.model != nextProps.model && nextProps.model != undefined) {
              this.setState({
                model: nextProps.model
              });
            }
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps, prevState) {
            var _this4 = this;
            switch (getNameFromWrappedComponent(WrappedComponent)) {
              case 'AutoComplete':
                if (this.state.searchText !== prevState.searchText && this.props.onChange) {
                  this.props.onChange(this.state.searchText);
                }
                break;
              case 'Checkbox':
                if (this.state.checked !== prevState.checked && this.props.onChange) {
                  this.props.onChange(null, this.state.checked);
                }
                break;
              default:
                if (this.state.value !== prevState.value && this.props.onChange) {
                  this.props.onChange(null, null, this.state.value);
                }
                break;
            }
            if (this.props.validate) {
              this.props.validate(this.state.value).then(function (response) {
                if (_this4.state.errorState !== response.errorMsg) {
                  _this4.setState({
                    errorState: response.errorMsg
                  });
                }
              });
            }
            if (
            /*
             * If the component changes id without unmounting,
             * then default values will never be synched with python
             */
            this.props.model === prevProps.model && this.state.value === '' && this.props["default"]) {
              this.UNRELIABLE_SyncDefaultValueWithPython(1000);
            }
          }
        }, {
          key: "updatePythonValue",
          value: function updatePythonValue(newValue) {
            if (this.props.prePythonSyncProcessing !== undefined) {
              newValue = this.props.prePythonSyncProcessing(newValue);
            }
            // whenever we invoke syncValueWithPython we will propagate the Javascript value of the model to Python
            if (this.syncValueWithPython) {
              // this.syncValueWithPython((event.target.type == 'number') ? parseFloat(this.state.value) : this.state.value, this.props.requirement);
              switch (this.props.realType) {
                case 'float':
                  if (!isNaN(newValue) && newValue !== '') {
                    newValue = parseFloat(newValue);
                  }
                  break;
                case 'dict':
                  if (typeof newValue === 'string') {
                    newValue = JSON.parse(newValue);
                  }
                  break;
                default:
                  break;
              }
              // Don't sync if new value is emtpy string
              if (newValue !== '') {
                this.syncValueWithPython(newValue);
              }
              if (this.props.callback) {
                this.props.callback(newValue, this.oldValue);
              }
              this.oldValue = undefined;
            }
            this.setState({
              value: newValue,
              searchText: newValue,
              checked: newValue
            });
            this.forceUpdate();
          }
        }, {
          key: "triggerUpdate",
          value: function triggerUpdate(updateMethod) {
            // common strategy when triggering processing of a value change, delay it, every time there is a change we reset
            if (this.updateTimer != undefined) {
              clearTimeout(this.updateTimer);
            }
            this.updateTimer = setTimeout(updateMethod, 1000);
          }
          // Default handle (mainly textfields and dropdowns)
        }, {
          key: "handleChange",
          value: function handleChange(event, index, value) {
            var _this5 = this;
            var targetValue = value;
            if (event != null && event.target.value != undefined) {
              targetValue = event.target.value;
            }
            if (this.oldValue === undefined) {
              this.oldValue = this.state.value;
            }
            this.setState({
              value: targetValue
            });
            if (this.props.validate) {
              this.props.validate(targetValue).then(function (response) {
                if (response.errorMsg !== _this5.state.errorMsg) {
                  _this5.setState({
                    errorMsg: response.errorMsg
                  });
                }
              });
            }

            // For textfields value is retrieved from the event. For dropdown value is retrieved from the value
            this.triggerUpdate(function () {
              return _this5.updatePythonValue(targetValue);
            });
          }

          // Autocomplete handle
        }, {
          key: "handleUpdateInput",
          value: function handleUpdateInput(value) {
            var _this6 = this;
            this.triggerUpdate(function () {
              return _this6.updatePythonValue(value);
            });
          }

          // Checkbox
        }, {
          key: "handleUpdateCheckbox",
          value: function handleUpdateCheckbox(event, isInputChecked) {
            this.updatePythonValue(isInputChecked);
          }
        }, {
          key: "render",
          value: function render() {
            var wrappedComponentProps = Object.assign({}, this.props);
            if (wrappedComponentProps.key == undefined) {
              wrappedComponentProps.key = wrappedComponentProps.model;
            }
            if (wrappedComponentProps.id == undefined) {
              wrappedComponentProps.id = wrappedComponentProps.model;
            }
            delete wrappedComponentProps.model;
            delete wrappedComponentProps.handleChange;
            delete wrappedComponentProps.modelName;
            delete wrappedComponentProps.dimensionType;
            delete wrappedComponentProps.noStyle;
            delete wrappedComponentProps.validate;
            delete wrappedComponentProps.prePythonSyncProcessing;
            delete wrappedComponentProps.callback;
            if (wrappedComponentProps.realType == 'func' || wrappedComponentProps.realType == 'float') {
              wrappedComponentProps['helperText'] = this.state.errorMsg;
            }
            if (!getNameFromWrappedComponent(WrappedComponent).includes('ListComponent')) {
              delete wrappedComponentProps.realType;
            }
            switch (getNameFromWrappedComponent(WrappedComponent)) {
              case 'AutoComplete':
                wrappedComponentProps['onUpdateInput'] = this.handleUpdateInput;
                wrappedComponentProps['searchText'] = this.state.searchText;
                break;
              case 'Checkbox':
                wrappedComponentProps['onChange'] = this.handleUpdateCheckbox;
                wrappedComponentProps['checked'] = this.state.checked;
                delete wrappedComponentProps.searchText;
                delete wrappedComponentProps.dataSource;
                delete wrappedComponentProps.floatingLabelText;
                delete wrappedComponentProps.hintText;
                break;
              default:
                wrappedComponentProps['onChange'] = this.handleChange;
                wrappedComponentProps.value = _typeof(this.state.value) === 'object' && this.state.value !== null && !Array.isArray(this.state.value) ? JSON.stringify(this.state.value) : this.state.value;
                // Fix case with multiple values: need to set an empty list in case the value is undefined
                wrappedComponentProps.value = wrappedComponentProps.multiple && wrappedComponentProps.value !== undefined && !wrappedComponentProps.value ? [] : wrappedComponentProps.value;
                delete wrappedComponentProps.searchText;
                delete wrappedComponentProps.dataSource;
                break;
            }
            return /*#__PURE__*/React.createElement(WrappedComponent, wrappedComponentProps);
          }
        }]);
        return PythonControlledControl;
      }(PythonControlledComponent);
      return PythonControlledControl;
    },
    createPythonControlledControlWithPythonDataFetch: function createPythonControlledControlWithPythonDataFetch(WrappedComponent) {
      var PythonControlledComponent = this.createPythonControlledComponent(WrappedComponent);
      var PythonControlledControlWithPythonDataFetch = /*#__PURE__*/function (_PythonControlledComp2) {
        _inherits(PythonControlledControlWithPythonDataFetch, _PythonControlledComp2);
        var _super4 = _createSuper(PythonControlledControlWithPythonDataFetch);
        function PythonControlledControlWithPythonDataFetch(props) {
          var _this7;
          _classCallCheck(this, PythonControlledControlWithPythonDataFetch);
          _this7 = _super4.call(this, props);
          _defineProperty(_assertThisInitialized(_this7), "callPythonMethod", function (value) {
            Utils.evalPythonMessage(_this7.props.method, []).then(function (response) {
              if (_this7._isMounted) {
                if (Object.keys(response).length != 0) {
                  _this7.setState({
                    pythonData: response
                  });
                } else {
                  _this7.setState({
                    pythonData: []
                  });
                }
              }
            });
          });
          _this7.state = _objectSpread(_objectSpread({}, _this7.state), {}, {
            value: [],
            pythonData: []
          });
          // If a handleChange method is passed as a props it will overwrite the handleChange python controlled capability
          _this7.handleChange = _this7.props.handleChange == undefined ? _this7.handleChange.bind(_assertThisInitialized(_this7)) : _this7.props.handleChange.bind(_assertThisInitialized(_this7));
          _this7.callPythonMethod();
          return _this7;
        }
        _createClass(PythonControlledControlWithPythonDataFetch, [{
          key: "UNSAFE_componentWillReceiveProps",
          value: function UNSAFE_componentWillReceiveProps(nextProps) {
            this.disconnectFromPython();
            this.id = nextProps.id == undefined ? nextProps.model : nextProps.id;
            this.connectToPython(this.state.componentType, nextProps.model);
            this.callPythonMethod();
          }

          /*
           * TODO: this function appears defined 2 times
           * I think the last def is picked up, so I am commenting this one
           * componentDidUpdate (prevProps, prevState) {
           *   if (this.state.value != prevState.value && this.props.onChange) {
           *     this.props.onChange(null, null, this.state.value);
           *   }
           * }
           */
        }, {
          key: "updatePythonValue",
          value: function updatePythonValue(newValue) {
            this.setState({
              value: newValue,
              searchText: newValue,
              checked: newValue
            });
            if (this.syncValueWithPython) {
              this.syncValueWithPython(newValue);
            }
            this.forceUpdate();
          }

          // Default handle (mainly textfields and dropdowns)
        }, {
          key: "handleChange",
          value: function handleChange(event, index, value) {
            var targetValue = value;
            if (event != null && event.target.value != undefined) {
              targetValue = event.target.value;
            }
            this.setState({
              value: targetValue
            });
            this.updatePythonValue(targetValue);
          }
        }, {
          key: "compareArrays",
          value: function compareArrays(array1, array2) {
            // if the other array is a falsy value, return
            if (!array1 || !array2) {
              return false;
            }

            // compare lengths - can save a lot of time 
            if (array1.length != array2.length) {
              return false;
            }
            for (var i = 0, l = array1.length; i < l; i++) {
              // Check if we have nested arrays
              if (array1[i] instanceof Array && array2[i] instanceof Array) {
                // recurse into the nested arrays
                if (!array1[i].equals(array2[i])) {
                  return false;
                }
              } else if (array1[i] != array2[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
              }
            }
            return true;
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps, prevState) {
            if (!this.compareArrays(this.state.value, prevState.value)) {
              if ($.isArray(this.state.value)) {
                for (var v in this.state.value) {
                  if (this.state.pythonData.indexOf(this.state.value[v]) < 0) {
                    var newValue = [this.state.value[v]];
                    this.setState({
                      pythonData: this.state.pythonData.concat(newValue)
                    });
                  }
                }
              }
            }
          }
        }, {
          key: "shouldComponentUpdate",
          value: function shouldComponentUpdate(nextProps, nextState) {
            return !this.compareArrays(this.state.pythonData, nextState.pythonData) || !this.compareArrays(this.state.value, nextState.value);
          }
        }, {
          key: "render",
          value: function render() {
            var wrappedComponentProps = Object.assign({}, this.props);
            if (wrappedComponentProps.key == undefined) {
              wrappedComponentProps.key = wrappedComponentProps.model;
            }
            if (wrappedComponentProps.id == undefined) {
              wrappedComponentProps.id = wrappedComponentProps.model;
            }
            wrappedComponentProps.onChange = this.handleChange;
            wrappedComponentProps.value = wrappedComponentProps.multiple && this.state.value !== undefined && !this.state.value ? [] : this.state.value;
            delete wrappedComponentProps.model;
            delete wrappedComponentProps.postProcessItems;
            delete wrappedComponentProps.validate;
            delete wrappedComponentProps.prePythonSyncProcessing;
            delete wrappedComponentProps.updates;
            if (this.props.postProcessItems) {
              var items = this.props.postProcessItems(this.state.pythonData, wrappedComponentProps.value);
            }
            return /*#__PURE__*/React.createElement(WrappedComponent, wrappedComponentProps, items);
          }
        }]);
        return PythonControlledControlWithPythonDataFetch;
      }(PythonControlledComponent);
      return PythonControlledControlWithPythonDataFetch;
    }
  };
});
function getNameFromWrappedComponent(WrappedComponent) {
  return WrappedComponent.name || WrappedComponent.displayName || WrappedComponent.Naked.render.name;
}
//# sourceMappingURL=PythonControlledCapability.js.map