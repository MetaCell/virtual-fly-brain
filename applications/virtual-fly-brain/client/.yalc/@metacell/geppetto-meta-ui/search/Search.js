"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _SOLRclient = require("./datasources/SOLRclient");
var _datasources = require("./datasources/datasources");
var _styles = require("@material-ui/core/styles");
var _FilterList = _interopRequireDefault(require("@material-ui/icons/FilterList"));
var _core = require("@material-ui/core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } /**
 * @author  Dario Del Piano (dario@metacell.us)
 */
// Global used to sort the results from the sorter function declared in the searchConfiguration

var style = require('./style/search.less');
var globalStyle = {
  inputWrapper: {
    "position": "absolute",
    "paddingLeft": "2.5%",
    "height": "100%",
    "width": "100%",
    "top": "10%"
  },
  searchText: {
    "width": "100vh",
    "zIndex": "1",
    "fontSize": "22px",
    "color": "black",
    "backgroundColor": "white",
    "padding": "12px 20px 12px 20px",
    "border": "3px solid #11bffe",
    "marginRight": "-8px"
  },
  filterIcon: {
    "right": "25px",
    "bottom": "15px",
    "zIndex": "5",
    "cursor": "pointer",
    "fontSize": "25px",
    "position": "absolute",
    "color": "black"
  },
  closeIcon: {
    "position": "relative",
    "color": "#11bffe",
    "bottom": "50px",
    "right": "22px",
    "fontWeight": "bold",
    "fontSize": "20px",
    "cursor": "pointer"
  },
  paperResults: {
    "left": "15%",
    "height": "50%",
    "width": "70%",
    "position": "absolute",
    "textAlign": "center",
    "backgroundColor": "#333333",
    "margin": "10px 10px 10px 10px",
    "padding": "12px 20px 12px 20px",
    "overflow": "scroll",
    "zIndex": "5"
  },
  paperFilters: {
    "minHeight": "280px",
    "minWidth": "240px",
    "position": "absolute",
    "backgroundColor": "#141313",
    "color": "white",
    "overflow": "scroll",
    "zIndex": "6",
    "border": "3px solid #11bffe",
    "fontFamily": "Barlow, Khand, sans-serif",
    "fontSize": "16px",
    "top": "58px",
    "right": "0px",
    "userSelect": "none",
    "-moz-user-select": "none",
    "-khtml-user-select": "none",
    "-webkit-user-select": "none",
    "-o-user-select": "none",
    "&::focus": {
      "outline": "0 !important"
    }
  },
  singleResult: {
    "color": "white",
    "&:hover": {
      "color": "#11bffe",
      "background-color": "#252323"
    }
  },
  main: {
    "position": "absolute",
    "top": "0px",
    "left": "0px",
    "width": "100%",
    "height": "100%",
    "margin": "0",
    "padding": "0",
    "zIndex": "3",
    "backgroundColor": "rgba(51, 51, 51, 0.7)",
    "textAlign": "center",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center"
  }
};

/*
 * Results Functional Component
 * @param data: Array<any>
 * @param closeHandler: Function
 * @param clickHandler: Function
 */

var useStyles = (0, _styles.makeStyles)({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto #11bffe',
      outlineOffset: 2
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5'
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    backgroundColor: '#11bffe',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""'
    },
    'input:hover ~ &': {
      backgroundColor: '#11bffe'
    }
  }
});
function StyledCheckbox(props) {
  var itemState = props.checked;
  switch (itemState) {
    case "disabled":
      return /*#__PURE__*/React.createElement("i", {
        style: {
          cursor: 'pointer',
          paddingTop: '3px',
          paddingLeft: '5px',
          paddingRight: '4px',
          fontSize: '20px'
        },
        className: "fa fa-square",
        onClick: function onClick() {
          props.filterHandler(props.filter);
        }
      });
      break;
    case "positive":
      return /*#__PURE__*/React.createElement("i", {
        style: {
          color: 'green',
          fontSize: '20px',
          cursor: 'pointer',
          paddingTop: '3px',
          paddingLeft: '5px',
          paddingRight: '4px'
        },
        className: "fa fa-plus-square",
        onClick: function onClick() {
          props.filterHandler(props.filter);
        }
      });
      break;
    case "negative":
      return /*#__PURE__*/React.createElement("i", {
        style: {
          color: 'red',
          fontSize: '20px',
          cursor: 'pointer',
          paddingTop: '3px',
          paddingLeft: '5px',
          paddingRight: '4px'
        },
        className: "fa fa-minus-square",
        onClick: function onClick() {
          props.filterHandler(props.filter);
        }
      });
      break;
    default:
      return /*#__PURE__*/React.createElement("i", {
        style: {
          fontSize: '20px',
          cursor: 'pointer',
          paddingTop: '3px',
          paddingLeft: '5px',
          paddingRight: '4px'
        },
        className: "fa fa-square",
        onClick: function onClick() {
          props.filterHandler(props.filter);
        }
      });
      break;
  }
}
var Results = function Results(_ref) {
  var data = _ref.data,
    mapping = _ref.mapping,
    closeHandler = _ref.closeHandler,
    clickHandler = _ref.clickHandler,
    topAnchor = _ref.topAnchor,
    searchStyle = _ref.searchStyle;
  // if data are available we display the list of results
  if (data == undefined || data.length == 0) return null;
  var clone = Object.assign({}, searchStyle.paperResults);
  clone.top = topAnchor.toString() + "px";
  return /*#__PURE__*/React.createElement(_core.Paper, {
    style: searchStyle.paperResults,
    id: "paperResults"
  }, /*#__PURE__*/React.createElement(_core.MenuList, null, data.map(function (item, index) {
    return /*#__PURE__*/React.createElement(_core.MenuItem, {
      style: searchStyle.singleResult,
      key: index,
      onClick: function onClick() {
        clickHandler(item[mapping["id"]]);
        closeHandler(false);
      }
    }, item[mapping["name"]]);
  })));
};

/*
 * Filters Functional Component
 * @param filters: Array<any>
 * @param setFilters: Function
 * @param openFilters: Function
 */

var Filters = function Filters(_ref2) {
  var filters = _ref2.filters,
    searchStyle = _ref2.searchStyle,
    setFilters = _ref2.setFilters,
    openFilters = _ref2.openFilters,
    filters_expanded = _ref2.filters_expanded;
  var paperRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)({
      open: filters_expanded,
      top: "0",
      left: "0"
    }),
    _useState2 = _slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];

  // hook for the event listener to detect when we click outside the component
  (0, _react.useEffect)(function () {
    document.addEventListener("click", handleClickOutside, false);
    return function () {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  // function to handle the click outside the filters to close the component
  var handleClickOutside = function handleClickOutside(event) {
    if (paperRef.current && !paperRef.current.contains(event.target)) {
      setState(function () {
        return {
          open: false,
          top: "0px",
          left: "0px"
        };
      });
    }
  };
  var filterHandler = function filterHandler(item) {
    if (item.enabled === undefined) {
      item.enabled = "disabled";
    } else {
      switch (item.enabled) {
        case "disabled":
          item.enabled = "positive";
          break;
        case "positive":
          item.enabled = "negative";
          break;
        case "negative":
          item.enabled = "disabled";
          break;
        default:
          item.enabled = "disabled";
          break;
      }
    }
    if (item.type === 'array') {
      item.values.map(function (singleCheck) {
        singleCheck.enabled = item.enabled;
        setFilters(singleCheck);
      });
    }
    setFilters(item);
    setState(function () {
      return {
        open: true,
        top: state.top,
        left: state.left
      };
    });
  };
  var resetFilters = function resetFilters() {
    filters.map(function (item, index) {
      switch (item.type) {
        case 'string':
          item.enabled = "disabled";
          setFilters(item);
          break;
        case 'array':
          item.enabled = "disabled";
          item.values.map(function (singleCheck) {
            singleCheck.enabled = "disabled";
            setFilters(singleCheck);
          });
          setFilters(item);
          break;
      }
    });
    setState(function () {
      return {
        open: true,
        top: state.top,
        left: state.left
      };
    });
  };

  // If filters are not defined we don't visualise anything
  if (filters == undefined || filters.length == 0) return null;

  // if filters are defined we check if the filter's paper is open and display them
  if (state.open) {
    return /*#__PURE__*/React.createElement("span", {
      ref: paperRef
    }, /*#__PURE__*/React.createElement(_FilterList["default"], {
      style: searchStyle.filterIcon,
      onClick: function onClick(event) {
        // let heightPosition = (event.currentTarget as HTMLDivElement).offsetTop + 15;
        var heightPosition = event.pageY + 30;
        setState(function () {
          return {
            open: false,
            top: heightPosition + "px",
            left: "0px"
          };
        });
      }
    }), /*#__PURE__*/React.createElement(_core.Paper, {
      id: "paperFilters",
      style: searchStyle.paperFilters
    }, /*#__PURE__*/React.createElement(_core.MenuList, null, filters.map(function (item, index) {
      switch (item.type) {
        case 'string':
          return /*#__PURE__*/React.createElement("div", {
            key: index,
            style: {
              textAlign: "left",
              fontSize: "16px",
              height: "25px"
            }
          }, /*#__PURE__*/React.createElement(StyledCheckbox, {
            filter: item,
            checked: item.enabled,
            filterHandler: filterHandler
          }), /*#__PURE__*/React.createElement("span", null, item.filter_name));
          break;
        case 'array':
          return /*#__PURE__*/React.createElement("div", {
            key: index,
            style: {
              textAlign: "left",
              fontSize: "16px",
              height: "25px",
              marginBottom: "5px"
            }
          }, item.disableGlobal === true ? /*#__PURE__*/React.createElement("span", {
            style: {
              paddingLeft: "5px"
            }
          }) : /*#__PURE__*/React.createElement(StyledCheckbox, {
            filter: item,
            checked: item.enabled,
            filterHandler: filterHandler
          }), /*#__PURE__*/React.createElement("span", null, item.filter_name), item.values.map(function (value, innerIndex) {
            return /*#__PURE__*/React.createElement("div", {
              key: index + "_" + innerIndex,
              style: {
                marginTop: "5px",
                marginLeft: "20px",
                height: "25px"
              }
            }, /*#__PURE__*/React.createElement(StyledCheckbox, {
              filter: value,
              checked: value.enabled,
              filterHandler: filterHandler
            }), /*#__PURE__*/React.createElement("span", {
              style: {
                verticalAlign: "middle"
              }
            }, value.filter_name));
          }), /*#__PURE__*/React.createElement("div", {
            style: {
              paddingTop: "18px",
              paddingLeft: "10px"
            }
          }, /*#__PURE__*/React.createElement(_core.Button, {
            style: {
              fontSize: "12px",
              fontFamily: 'Barlow',
              borderRadius: '0px',
              color: 'white',
              borderColor: 'white'
            },
            variant: "outlined",
            onClick: resetFilters
          }, "Clear Filters")));
          break;
        default:
          return /*#__PURE__*/React.createElement("div", {
            key: index,
            style: {
              fontSize: "16px"
            }
          }, "\"Error filter \" + ", item.key, " + \" configuration\"");
          break;
      }
    }))));
  } else {
    return /*#__PURE__*/React.createElement("span", {
      ref: paperRef
    }, /*#__PURE__*/React.createElement(_FilterList["default"], {
      style: searchStyle.filterIcon,
      onClick: function onClick(event) {
        // let heightPosition = (event.currentTarget as HTMLDivElement).offsetTop + 15;
        var heightPosition = event.pageY + 30;
        setState(function () {
          return {
            open: true,
            top: heightPosition + "px",
            left: "0px"
          };
        });
      }
    }));
  }
};

/*
 * Search Component
 * @param datasources: string
 * @param searchConfiguration: any
 * @param datasourceConfiguration: any
 * @param clickHandler: Function
 * @param customDatasourceHandler?: Function
 */
var Search = /*#__PURE__*/function (_Component) {
  function Search(props) {
    var _this;
    _classCallCheck(this, Search);
    _this = _callSuper(this, Search, [props]);

    // Initialise state from props is an antipattern if the source of truth can diverge from the state
    // in our case that is not an issue since we are using the prop only to inialise the state, then
    // the application rely on the state and not on the prop itself (this is for the filters)
    _defineProperty(_this, "results", void 0);
    _defineProperty(_this, "getResults", void 0);
    _defineProperty(_this, "resultsHeight", void 0);
    _defineProperty(_this, "inputRef", void 0);
    // literal object to extract the getter function based on the datasource we pick
    _defineProperty(_this, "getDatasource", _defineProperty(_defineProperty({}, _datasources.DatasourceTypes.CUSTOM, _this.props.customDatasourceHandler), _datasources.DatasourceTypes.SOLRClient, _SOLRclient.getResultsSOLR));
    var initialFilters = props.searchConfiguration.filters !== undefined ? props.searchConfiguration.filters : [];
    _this.state = {
      value: "",
      isOpen: false,
      filters: initialFilters
    };
    _this.results = [];
    _this.resultsHeight = 0;
    _this.openSearch = _this.openSearch.bind(_this);
    _this.setFilters = _this.setFilters.bind(_this);
    _this.escFunction = _this.escFunction.bind(_this);
    _this.handleResize = _this.handleResize.bind(_this);
    _this.handleResults = _this.handleResults.bind(_this);
    _this.handleClickOutside = _this.handleClickOutside.bind(_this);
    return _this;
  }
  _inherits(Search, _Component);
  return _createClass(Search, [{
    key: "openSearch",
    value:
    // handle the component opening / closing
    function openSearch(requestedAction) {
      if (requestedAction !== undefined) {
        this.results = [];
        this.setState({
          isOpen: requestedAction,
          value: ""
        });
      } else {
        this.results = [];
        this.setState({
          isOpen: !this.state.isOpen,
          value: ""
        });
      }
      if (event !== undefined && requestedAction) {
        event.stopPropagation();
      }
    }

    // results handler, the name says everything
  }, {
    key: "handleResults",
    value: function handleResults(status, data, value) {
      switch (status) {
        case "OK":
          if (this.state.value !== value) {
            if (value === "") {
              this.results = [];
            } else {
              this.results = data;
            }
            this.setState({
              value: value
            });
          }
          break;
        case "ERROR":
          break;
        default:
          console.log("This is a case not considered");
      }
    }
  }, {
    key: "setFilters",
    value:
    // update the filters, handler used to trigger the update from the filter component
    function setFilters(filter) {
      var newFilters = this.state.filters.map(function (item) {
        if (item.key === filter.key) {
          return filter;
        } else {
          return item;
        }
      });
      this.setState({
        filters: newFilters
      });
    }
  }, {
    key: "applyFilters",
    value:
    // filter the results when 1 or more than one filter is provided
    function applyFilters() {
      var _this2 = this;
      var allFiltersDisabled = true;
      var newResults = [];
      var filters = this.state.filters.map(function (filter) {
        switch (filter.type) {
          case 'string':
            if (filter.enabled !== undefined && filter.enabled !== 'disabled') {
              allFiltersDisabled = false;
              return filter;
            }
            break;
          case 'array':
            var filtersList = filter.values.filter(function (innerFilter) {
              if (innerFilter.enabled !== undefined && innerFilter.enabled !== 'disabled') {
                allFiltersDisabled = false;
                return true;
              }
              return false;
            });
            if (filtersList.length > 0) {
              var newFilter = _objectSpread({}, filter);
              newFilter.values = filtersList;
              return newFilter;
            }
            break;
          default:
            console.log("Error filter " + filter.key + " configuration");
        }
      }).filter(function (item) {
        return item !== undefined;
      });
      if (allFiltersDisabled) {
        return this.results;
      } else if (this.results.length > 0) {
        newResults = this.results.filter(function (record) {
          var recordToBeAdded = true;
          for (var i = 0; i < filters.length; i++) {
            switch (filters[i].type) {
              case 'string':
                if (recordToBeAdded && filters[i].key !== undefined && record[filters[i].key] !== undefined) {
                  if (filters[i].enabled === "positive" && !(record[filters[i].key].toLowerCase().indexOf(_this2.state.value.toLowerCase()) > -1)) {
                    recordToBeAdded = false;
                  }
                  if (filters[i].enabled === "negative" && record[filters[i].key].toLowerCase().indexOf(_this2.state.value.toLowerCase()) > -1) {
                    recordToBeAdded = false;
                  }
                }
                break;
              case 'array':
                if (record[filters[i].key] !== undefined) {
                  for (var j = 0; j < filters[i].values.length; j++) {
                    if (recordToBeAdded && filters[i].values[j].key !== undefined) {
                      if (filters[i].values[j].enabled === "positive" && !record[filters[i].key].includes(filters[i].values[j].key)) {
                        recordToBeAdded = false;
                      }
                      if (filters[i].values[j].enabled === "negative" && record[filters[i].key].includes(filters[i].values[j].key)) {
                        recordToBeAdded = false;
                      }
                    }
                  }
                }
                break;
              default:
                recordToBeAdded = false;
                console.log("Error filter " + filters[i].key + " configuration");
            }
          }
          return recordToBeAdded;
        });
        return newResults;
      } else {
        return newResults;
      }
    }

    // wrapper to call the getter with all the required params for the generic datasource call.
  }, {
    key: "requestData",
    value: function requestData(e) {
      window.spotlightString = e.target.value;
      this.getResults(e.target.value, this.handleResults, this.props.searchConfiguration.sorter, this.props.datasourceConfiguration);
    }
  }, {
    key: "handleResize",
    value: function handleResize() {
      if (this.refs.inputRef !== undefined) {
        this.resultsHeight = this.refs.inputRef.parentNode.offsetHeight + this.refs.inputRef.parentNode.offsetTop + 10;
        // this setState it's actually an hack to re-render when the browser is resized
        // TODO: the render can be improved to avoid the filter function when this happen
        this.setState({
          value: this.state.value
        });
      }
    }
  }, {
    key: "escFunction",
    value: function escFunction(event) {
      if (event.keyCode === 27) {
        this.openSearch(false);
      }
    }
  }, {
    key: "handleClickOutside",
    value: function handleClickOutside(event) {
      if (this.state.isOpen && this.refs.containerRef && !this.refs.containerRef.contains(event.target)) {
        this.openSearch(false);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.inputRef !== undefined && this.inputRef !== null) {
        this.inputRef.focus();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('keydown', this.escFunction, false);
      window.addEventListener("click", this.handleClickOutside, false);
      if (this.inputRef !== undefined && this.inputRef !== null) {
        this.inputRef.focus();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      window.removeEventListener('keydown', this.escFunction, false);
      window.removeEventListener("click", this.handleClickOutside, false);
    }

    // link the function getResults to the datasource getter that we decided in the prop datasource
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.getResults = this.getDatasource[this.props.datasource];
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      if (!this.state.isOpen) {
        return null;
      }
      var searchStyle = this.props.searchStyle !== undefined ? this.props.searchStyle : globalStyle;
      var filteredResults = this.applyFilters();
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_core.Paper, {
        id: "mainPaper",
        style: searchStyle.main
      }, /*#__PURE__*/React.createElement("div", {
        style: searchStyle.inputWrapper,
        ref: "containerRef"
      }, /*#__PURE__*/React.createElement(_core.Grid, {
        container: true,
        spacing: 3
      }, /*#__PURE__*/React.createElement(_core.Grid, {
        item: true,
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }, /*#__PURE__*/React.createElement(_core.Input, {
        style: searchStyle.searchText,
        type: "text",
        ref: function ref(input) {
          _this3.inputRef = input;
        },
        id: "searchInput",
        autoComplete: "virtualflybrain",
        autoFocus: true,
        onChange: function onChange(e) {
          _this3.resultsHeight = e.currentTarget.offsetTop + 65;
          _this3.requestData(e);
        },
        endAdornment: /*#__PURE__*/React.createElement(_core.InputAdornment, {
          position: "end"
        }, /*#__PURE__*/React.createElement(Filters, {
          filters_expanded: this.props.searchConfiguration.filters_expanded,
          searchStyle: searchStyle,
          filters: this.state.filters,
          setFilters: this.setFilters
        }))
      }), /*#__PURE__*/React.createElement("span", {
        style: searchStyle.closeIcon,
        id: "closeIcon",
        className: "fa fa-times",
        onClick: function onClick() {
          _this3.openSearch(false);
        }
      })), /*#__PURE__*/React.createElement(_core.Grid, {
        item: true,
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12
      }, /*#__PURE__*/React.createElement(Results, {
        data: filteredResults,
        searchStyle: searchStyle,
        mapping: this.props.searchConfiguration.resultsMapping,
        closeHandler: this.openSearch,
        clickHandler: this.props.searchConfiguration.clickHandler,
        topAnchor: this.resultsHeight
      }))))));
    }
  }]);
}(_react.Component);
;
var _default = exports["default"] = Search;
//# sourceMappingURL=Search.js.map