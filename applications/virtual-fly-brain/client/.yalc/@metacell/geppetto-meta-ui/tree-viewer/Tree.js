"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
var Tree = /*#__PURE__*/function (_Component) {
  function Tree(props) {
    _classCallCheck(this, Tree);
    return _callSuper(this, Tree, [props]);
  }
  _inherits(Tree, _Component);
  return _createClass(Tree, [{
    key: "render",
    value: function render() {
      return null;
    }
  }]);
}(_react.Component);
var _default = exports["default"] = withStyles(styles)(Tree); // import SortableTree from '@nosferatu500/react-sortable-tree';
// import {
//   toggleExpandedForAll,
//   changeNodeAtPath,
//   walk,
// } from '@nosferatu500/react-sortable-tree';
// import { withStyles } from '@material-ui/core';
// import '@nosferatu500/react-sortable-tree/style.css';
// import PropTypes from 'prop-types';
// const styles = () => ({ treeViewer: { height: '100%' } });
// class Tree extends Component {
//   constructor (props) {
//     super(props);
//     this.updateTreeData = this.updateTreeData.bind(this);
//     this.expandAll = this.expandAll.bind(this);
//     this.collapseAll = this.collapseAll.bind(this);
//     this.state = { treeData: this.props.treeData };
//   }
//   updateTreeData (treeData) {
//     this.setState({ treeData });
//   }
//   expand (expanded) {
//     this.setState({
//       treeData: toggleExpandedForAll({
//         treeData: this.state.treeData,
//         expanded,
//       }),
//     });
//   }
//   expandAll () {
//     this.expand(true);
//   }
//   collapseAll () {
//     this.expand(false);
//   }
//   handleClick (event, rowInfo) {
//     const toggleMode = this.props.toggleMode;
//     let currentTreeData = this.state.treeData;
//     // If node has children, we expand/collapse the node
//     if (
//       rowInfo.node.children != undefined
//       && rowInfo.node.children.length > 0
//     ) {
//       // If parents can be activate, iterate over the whole tree
//       if (this.props.activateParentsNodeOnClick) {
//         walk({
//           treeData: currentTreeData,
//           getNodeKey: ({ treeIndex }) => treeIndex,
//           ignoreCollapsed: true,
//           callback: rowInfoIter => {
//             const isActive = rowInfoIter.treeIndex == rowInfo.treeIndex;
//             /*
//              * If toggleMode just toggle to activate/inactivate selected node and expand/collapse
//              * If non toggle mode inactive all nodes but selected and expand/collapse
//              */
//             if (isActive && toggleMode) {
//               rowInfoIter.node.active = !rowInfoIter.node.active;
//               rowInfoIter.node.expanded = !rowInfoIter.node.expanded;
//               currentTreeData = changeNodeAtPath({
//                 treeData: currentTreeData,
//                 path: rowInfoIter.path,
//                 newNode: rowInfoIter.node,
//                 getNodeKey: ({ treeIndex }) => treeIndex,
//                 ignoreCollapsed: true,
//               });
//             } else if (isActive && !toggleMode) {
//               rowInfoIter.node.active = isActive;
//               rowInfoIter.node.expanded = !rowInfoIter.node.expanded;
//               currentTreeData = changeNodeAtPath({
//                 treeData: currentTreeData,
//                 path: rowInfoIter.path,
//                 newNode: rowInfoIter.node,
//                 getNodeKey: ({ treeIndex }) => treeIndex,
//                 ignoreCollapsed: true,
//               });
//             } else if (isActive != rowInfoIter.node.active && !toggleMode) {
//               rowInfoIter.node.active = isActive;
//               currentTreeData = changeNodeAtPath({
//                 treeData: currentTreeData,
//                 path: rowInfoIter.path,
//                 newNode: rowInfoIter.node,
//                 getNodeKey: ({ treeIndex }) => treeIndex,
//                 ignoreCollapsed: true,
//               });
//             }
//           },
//         });
//       } else {
//         rowInfo.node.expanded = !rowInfo.node.expanded;
//         currentTreeData = changeNodeAtPath({
//           treeData: currentTreeData,
//           path: rowInfo.path,
//           newNode: rowInfo.node,
//           getNodeKey: ({ treeIndex }) => treeIndex,
//           ignoreCollapsed: true,
//         });
//       }
//     } else if (rowInfo.node.children == undefined) {
//       // If node has no children, we select the node
//       walk({
//         treeData: currentTreeData,
//         getNodeKey: ({ treeIndex }) => treeIndex,
//         ignoreCollapsed: true,
//         callback: rowInfoIter => {
//           const isActive = rowInfoIter.treeIndex == rowInfo.treeIndex;
//           /*
//            * If toggleMode just toggle to activate/inactivate selected node
//            * If non toggle mode inactive all nodes but selected
//            */
//           if (isActive && toggleMode) {
//             rowInfoIter.node.active = !rowInfoIter.node.active;
//             currentTreeData = changeNodeAtPath({
//               treeData: currentTreeData,
//               path: rowInfoIter.path,
//               newNode: rowInfoIter.node,
//               getNodeKey: ({ treeIndex }) => treeIndex,
//               ignoreCollapsed: true,
//             });
//           } else if (isActive != rowInfoIter.node.active && !toggleMode) {
//             rowInfoIter.node.active = isActive;
//             currentTreeData = changeNodeAtPath({
//               treeData: currentTreeData,
//               path: rowInfoIter.path,
//               newNode: rowInfoIter.node,
//               getNodeKey: ({ treeIndex }) => treeIndex,
//               ignoreCollapsed: true,
//             });
//           }
//         },
//       });
//     }
//     // Update tree with latest changes
//     this.updateTreeData(currentTreeData);
//     // If there is a callback, we use it
//     if (this.props.handleClick != undefined) {
//       this.props.handleClick(event, rowInfo);
//     }
//   }
//   getNodeProps (rowInfo) {
//     let nodeProps = {};
//     nodeProps['onClick'] = event => this.handleClick(event, rowInfo);
//     if (this.props.getButtons !== undefined) {
//       nodeProps['buttons'] = this.props.getButtons(rowInfo);
//     }
//     if (rowInfo.node.instance !== undefined) {
//       nodeProps['style'] = { cursor: 'pointer' };
//     }
//     if (rowInfo.node.active) {
//       nodeProps['className'] = 'activeNode';
//     }
//     if (this.props.getNodesProps !== undefined) {
//       nodeProps['title'] = this.props.getNodesProps(rowInfo);
//     }
//     return nodeProps;
//   }
//   render () {
//     const {
//       classes,
//       style,
//       searchQuery,
//       onlyExpandSearchedNodes,
//       controls,
//       ...others
//     } = this.props;
//     return (
//       <div className={classes.treeViewer} style={style}>
//         {controls}
//         <SortableTree
//           style={style}
//           treeData={this.state.treeData}
//           canDrag={false}
//           scaffoldBlockPxWidth={22}
//           generateNodeProps={rowInfo => this.getNodeProps(rowInfo)}
//           onChange={treeData => this.updateTreeData(treeData)}
//           searchQuery={searchQuery !== undefined ? searchQuery : null}
//           onlyExpandSearchedNodes={
//             onlyExpandSearchedNodes !== undefined
//               ? onlyExpandSearchedNodes
//               : false
//           }
//           {...others}
//         />
//       </div>
//     );
//   }
// }
// Tree.defaultProps = {
//   toggleMode: false,
//   activateParentsNodeOnClick: true,
//   getNodesProps: () => {},
//   controls: null,
//   onChange: () => {},
//   searchMethod: () => {},
//   searchFocusOffset: 0,
//   searchFinishCallback: () => {},
// }
// Tree.propTypes = {
//   /**
//    * Tree data with the following keys: title, subtitle, expanded, and children
//    */
//   treeData: PropTypes.array.isRequired,
//   /**
//    * Style applied to the container wrapping the tree
//    */
//   style: PropTypes.object.isRequired,
//   /**
//    * Either a fixed row height (number) or a function that returns the height of a row given its index
//    */
//   rowHeight: PropTypes.any.isRequired,
//   /**
//    * Function to handle node's click events
//    */
//   handleClick: PropTypes.func.isRequired,
//   /**
//    * Function to add buttons
//    */
//   getButtons: PropTypes.func.isRequired,
//   /**
//    * Boolean to activate/inactivate selected node
//    */
//   toggleMode: PropTypes.bool,
//   /**
//    * Boolean to allow parents activation or not
//    */
//   activateParentsNodeOnClick: PropTypes.bool,
//   /**
//    * Generate an object with additional props to be passed to the node render
//    */
//   getNodesProps: PropTypes.func,
//   /**
//    * Controls
//    */
//   controls: PropTypes.element,
//   /**
//    * Function to callback when change occurs
//    */
//   onChange: PropTypes.func,
//   /**
//    * Function to define search method
//    */
//   searchMethod: PropTypes.func,
//   /**
//    * Search focus offset. Defaults to zero
//    */
//   searchFocusOffset: PropTypes.number,
//   /**
//    * Function to callback when search results are ready
//    */
//   searchFinishCallback: PropTypes.func,
// };
// export default withStyles(styles)(Tree);
//# sourceMappingURL=Tree.js.map