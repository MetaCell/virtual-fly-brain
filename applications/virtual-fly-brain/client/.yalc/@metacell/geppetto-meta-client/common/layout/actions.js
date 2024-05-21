"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateWidget = exports.updateLayout = exports.setWidgets = exports.setLayout = exports.resetLayout = exports.removeWidgetFromStore = exports.newWidget = exports.minimizeWidget = exports.maximizeWidget = exports.layoutActions = exports.destroyWidget = exports.deleteWidget = exports.addWidgets = exports.addWidget = exports.activateWidget = void 0;
var _model = require("./model");
var _excluded = ["path", "component", "panelName"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var layoutActions = {
  SET_LAYOUT: 'SET_LAYOUT',
  SET_WIDGETS: 'SET_WIDGETS',
  UPDATE_WIDGET: 'UPDATE_WIDGET',
  ACTIVATE_WIDGET: 'ACTIVATE_WIDGET',
  ADD_WIDGET: 'ADD_WIDGET',
  ADD_WIDGETS: 'ADD_WIDGETS',
  RESET_LAYOUT: 'RESET_LAYOUT',
  DESTROY_WIDGET: 'DESTROY_WIDGET',
  REMOVE_WIDGET: 'REMOVE_WIDGET',
  UPDATE_LAYOUT: 'UPDATE_LAYOUT'
};
exports.layoutActions = layoutActions;
var newWidget = function newWidget(_ref) {
  var path = _ref.path,
    component = _ref.component,
    panelName = _ref.panelName,
    others = _objectWithoutProperties(_ref, _excluded);
  return {
    type: layoutActions.ADD_WIDGET,
    data: _objectSpread({
      id: path,
      instancePath: path,
      component: component,
      name: path,
      status: _model.WidgetStatus.ACTIVE,
      panelName: panelName
    }, others)
  };
};
exports.newWidget = newWidget;
var addWidget = function addWidget(widget) {
  return {
    type: layoutActions.ADD_WIDGET,
    data: widget
  };
};
exports.addWidget = addWidget;
var addWidgets = function addWidgets(widgets) {
  return {
    type: layoutActions.ADD_WIDGETS,
    data: widgets
  };
};
exports.addWidgets = addWidgets;
var setWidgets = function setWidgets(widgets) {
  return {
    type: layoutActions.SET_WIDGETS,
    data: widgets
  };
};
exports.setWidgets = setWidgets;
var updateWidget = function updateWidget(newConf) {
  return {
    type: layoutActions.UPDATE_WIDGET,
    data: newConf
  };
};

/**
 * Support action: do not consider as part of the api
 * @param id 
 */
exports.updateWidget = updateWidget;
var setLayout = function setLayout(newLayout) {
  return {
    type: layoutActions.SET_LAYOUT,
    data: newLayout
  };
};
exports.setLayout = setLayout;
var updateLayout = function updateLayout(layout) {
  return {
    type: layoutActions.UPDATE_LAYOUT,
    data: layout
  };
};
exports.updateLayout = updateLayout;
var minimizeWidget = function minimizeWidget(id) {
  return {
    type: layoutActions.UPDATE_WIDGET,
    data: {
      id: id,
      status: _model.WidgetStatus.MINIMIZED
    }
  };
};
exports.minimizeWidget = minimizeWidget;
var maximizeWidget = function maximizeWidget(id) {
  return {
    type: layoutActions.UPDATE_WIDGET,
    data: {
      id: id,
      status: _model.WidgetStatus.MAXIMIZED
    }
  };
};
exports.maximizeWidget = maximizeWidget;
var activateWidget = function activateWidget(id) {
  return {
    type: layoutActions.ACTIVATE_WIDGET,
    data: {
      id: id
    }
  };
};
exports.activateWidget = activateWidget;
var deleteWidget = function deleteWidget(id) {
  return {
    type: layoutActions.DESTROY_WIDGET,
    data: {
      id: id
    }
  };
};
exports.deleteWidget = deleteWidget;
var destroyWidget = deleteWidget;

/**
 * Support action: do not consider as part of the api
 * @param id 
 */
exports.destroyWidget = destroyWidget;
var removeWidgetFromStore = function removeWidgetFromStore(id) {
  return {
    type: layoutActions.REMOVE_WIDGET,
    data: {
      id: id
    }
  };
};
exports.removeWidgetFromStore = removeWidgetFromStore;
var resetLayout = {
  type: layoutActions.RESET_LAYOUT
};
exports.resetLayout = resetLayout;
//# sourceMappingURL=actions.js.map