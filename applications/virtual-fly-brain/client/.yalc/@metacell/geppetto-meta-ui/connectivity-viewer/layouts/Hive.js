"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hive = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// import * as d3 from "d3";
var d3 = require("d3");
var Hive = exports.Hive = /*#__PURE__*/function () {
  function Hive(calculateNodeDegrees) {
    _classCallCheck(this, Hive);
    this.calculateNodeDegrees = calculateNodeDegrees;
  }
  return _createClass(Hive, [{
    key: "draw",
    value: function draw(context) {
      if (this.calculateNodeDegrees !== null) {
        context.calculateNodeDegrees(this.calculateNodeDegrees);
      }
      var hiveLink = require("d3-plugins-dist/dist/mbostock/hive/cjs")["default"]();
      var innerRadius = 20;
      var outerRadius = 180;
      var angle = d3.scalePoint().domain(d3.range(context.dataset.nodeTypes.length + 1)).range([0, 2 * Math.PI]);
      var quali_angle = d3.scaleBand().domain(context.dataset.nodeTypes).range([0, 2 * Math.PI]);
      var radius = d3.scaleLinear().range([innerRadius, outerRadius]);
      var linkTypeScale = d3.scaleOrdinal(d3.schemeCategory10).domain(context.dataset.linkTypes);
      var nodeTypeScale = context.nodeColormap.range ? context.nodeColormap : d3.scaleOrdinal(d3.schemeCategory20);
      var nodes = context.dataset.nodes,
        links = [];
      context.dataset.links.forEach(function (li) {
        if (typeof li.target !== "undefined") {
          links.push({
            source: nodes[li.source],
            target: nodes[li.target],
            type: li.type
          });
        }
      });
      var svg = context.svg.append("g").attr("transform", "translate(" + context.width / 2 + "," + context.height / 2 + ")");
      svg.selectAll(".axis").data(d3.range(context.dataset.nodeTypes.length)).enter().append("line").attr("class", "axis").attr("transform", function (d) {
        return "rotate(" + degrees(angle(d)) + ")";
      }).attr("x1", radius.range()[0]).attr("x2", radius.range()[1]).style('stroke', "#000").style('stroke-width', '1.5px');
      svg.selectAll(".link").data(links).enter().append("path").attr("class", "link").attr("d", hiveLink.angle(function (d) {
        return quali_angle(d.type);
      }).radius(function (d) {
        return radius(d.degree);
      })).style("stroke", function (d) {
        return linkTypeScale(d.type);
      }).style('fill', "none").style('stroke-width', '1.5px').style('stroke-opacity', 0.3);
      var node = svg.selectAll(".node").data(nodes).enter().append("circle").attr("class", "node").attr("transform", function (d) {
        return "rotate(" + degrees(quali_angle(d.type)) + ")";
      }).attr("cx", function (d) {
        return radius(d.degree);
      }).attr("r", 5).style("fill", function (d) {
        return nodeTypeScale(d.type);
      });
      node.append("title").text(function (d) {
        return d.id;
      });
      function degrees(radians) {
        return radians / Math.PI * 180 - 90;
      }
    }
  }, {
    key: "getLegends",
    value: function getLegends(context) {
      return [];
    }
  }, {
    key: "getName",
    value: function getName() {
      return "Hive";
    }
  }, {
    key: "hasTooltip",
    value: function hasTooltip() {
      return false;
    }
  }, {
    key: "hasToggle",
    value: function hasToggle() {
      return false;
    }
  }, {
    key: "hasSelect",
    value: function hasSelect() {
      return false;
    }
  }]);
}();
//# sourceMappingURL=Hive.js.map