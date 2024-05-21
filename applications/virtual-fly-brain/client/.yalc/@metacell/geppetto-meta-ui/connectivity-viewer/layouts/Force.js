"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Force = void 0;
var util = _interopRequireWildcard(require("../../utilities"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// import * as d3 from "d3";
var d3 = require("d3");
var Force = exports.Force = /*#__PURE__*/function () {
  function Force() {
    _classCallCheck(this, Force);
  }
  return _createClass(Force, [{
    key: "draw",
    value: function draw(context) {
      // TODO: 10/20 categories hardcoded in color scales
      var linkTypeScale = d3.scaleOrdinal(d3.schemeCategory10).domain(context.dataset.linkTypes);
      var nodeTypeScale = context.nodeColormap.range ? context.nodeColormap : d3.scaleOrdinal(d3.schemeCategory20);
      var weightScale = d3.scaleLinear().domain(d3.extent(util.pluck(context.dataset.links, 'weight').map(parseFloat)))
      // TODO: think about weight = 0 (do we draw a line?)
      .range([0.5, 4]);
      context.force = d3.forceSimulation().force("charge", d3.forceManyBody().strength(-250)).force("link", d3.forceLink().id(function (d) {
        return d.index;
      })).force("center", d3.forceCenter(context.width / 2, context.height / 2));

      // add encompassing group for the zoom
      var g = context.svg.append("g").attr("class", "everything");
      var link = g.selectAll(".link").data(context.dataset.links).enter().append("line").attr("class", "link").style("stroke", function (d) {
        return linkTypeScale(d.type);
      }).style("stroke-width", function (d) {
        return weightScale(d.weight);
      });
      var node = g.selectAll(".node").data(context.dataset.nodes).enter().append("circle").attr("class", "node").attr("r", 5) // radius
      .style("fill", function (d) {
        return nodeTypeScale(d.type);
      }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
      node.append("title").text(function (d) {
        return d.id;
      });
      function dragstarted(d) {
        if (!d3.event.active) {
          context.force.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }
      function dragended(d) {
        if (!d3.event.active) {
          context.force.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }
      var zoom_handler = d3.zoom().on("zoom", zoom_actions);
      function zoom_actions() {
        g.attr("transform", d3.event.transform);
      }
      zoom_handler(context.svg);
      context.force.nodes(context.dataset.nodes).on("tick", function () {
        link.attr("x1", function (d) {
          return d.source.x;
        }).attr("y1", function (d) {
          return d.source.y;
        }).attr("x2", function (d) {
          return d.target.x;
        }).attr("y2", function (d) {
          return d.target.y;
        });
        node.attr("cx", function (d) {
          return d.x;
        }).attr("cy", function (d) {
          return d.y;
        });
      });
      context.force.force("link").links(context.dataset.links);
    }
  }, {
    key: "getLegends",
    value: function getLegends(context) {
      var nodeTypeScale = context.nodeColormap.range ? context.nodeColormap : d3.scaleOrdinal(d3.schemeCategory20);
      var linkTypeScale = d3.scaleOrdinal(d3.schemeCategory10).domain(context.dataset.linkTypes);
      return [{
        id: 'legend',
        colorScale: nodeTypeScale,
        title: 'Cell Types'
      }, {
        id: 'legend2',
        colorScale: linkTypeScale,
        title: 'Synapse Types'
      }];
    }
  }, {
    key: "getName",
    value: function getName() {
      return "Force";
    }
  }, {
    key: "hasTooltip",
    value: function hasTooltip() {
      return false;
    }
  }, {
    key: "hasToggle",
    value: function hasToggle() {
      return true;
    }
  }, {
    key: "hasSelect",
    value: function hasSelect() {
      return false;
    }
  }]);
}();
//# sourceMappingURL=Force.js.map