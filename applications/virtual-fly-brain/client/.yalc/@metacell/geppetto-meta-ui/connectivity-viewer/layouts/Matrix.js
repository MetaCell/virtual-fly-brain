"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var d3 = require("d3");
var Matrix = exports.Matrix = /*#__PURE__*/function () {
  function Matrix() {
    _classCallCheck(this, Matrix);
    this.leftIndicator = 10;
    this.topIndicator = 10;
    this.order = "id";
  }
  return _createClass(Matrix, [{
    key: "draw",
    value: function draw(context) {
      var matrixDim = context.height < context.width ? context.height : context.width;
      var x = d3.scaleBand().range([0, matrixDim]);
      // Opacity
      var z = d3.scaleLinear().domain([0, 4]).clamp(true);
      // Colors
      var c = d3.scaleOrdinal(d3.schemeCategory10);
      var defaultTooltipText = "Hover the squares to see the connections.";
      var container = context.svg.append("g").attr("transform", "translate(" + this.leftIndicator + "," + this.topIndicator + ")");
      var matrix = [];
      var nodes = context.dataset.nodes;
      var root = context.dataset.root;
      var n = nodes.length;

      // Compute index per node.
      nodes.forEach(function (node, i) {
        node.pre_count = 0;
        node.post_count = 0;
        matrix[i] = d3.range(n).map(function (j) {
          return {
            x: j,
            y: i,
            z: 0
          };
        });
      });

      // Convert links to matrix; count pre / post conns.
      context.dataset.links.forEach(function (link) {
        /*
         * TODO: think about zero weight lines
         * matrix[link.source][link.target].z = link.weight ? link.type : 0;
         */
        matrix[link.source][link.target].z = link.type;
        nodes[link.source].pre_count += 1;
        nodes[link.target].post_count += 1;
      });

      /*
       * Sorting matrix entries.
       * TODO: runtime specified sorting criteria
       */
      var sortOptions = {
        'id': 'By entity name',
        'pre_count': 'By # pre',
        'post_count': 'By # post'
      };
      //  Precompute the orders.
      this.orders = {
        id: d3.range(n).sort(function (a, b) {
          return d3.ascending(nodes[a].id, nodes[b].id);
        }),
        pre_count: d3.range(n).sort(function (a, b) {
          return nodes[b].pre_count - nodes[a].pre_count;
        }),
        post_count: d3.range(n).sort(function (a, b) {
          return nodes[b].post_count - nodes[a].post_count;
        })
        // community: d3.range(n).sort(function(a, b) { return nodes[b].community - nodes[a].community; }),
      };
      // Default sort order.
      x.domain(this.orders[this.order]);

      /*
       * we store the 'conn' key in case we want to
       * eg. conditionally colour the indicator if there
       * are actually connections in that row/column
       */
      var pre = nodes.map(function (x, i) {
        return {
          id: x.id,
          conn: matrix[i].filter(function (d) {
            return d.z;
          }).length > 0
        };
      });
      var matrixT = matrix[0].map(function (col, i) {
        return matrix.map(function (row) {
          return row[i];
        });
      });
      var post = nodes.map(function (x, i) {
        return {
          id: x.id,
          conn: matrixT[i].filter(function (d) {
            return d.z;
          }).length > 0
        };
      });
      var popNameFromId = function popNameFromId(id) {
        return eval(context.props.modelFactory.getAllPotentialInstancesEndingWith(id)[0]).getParent().getName();
      };
      var mouseoverCell = function mouseoverCell(msg) {
        d3.select(this.parentNode.appendChild(this)).transition().duration(100).style('stroke-opacity', 1).style('stroke', 'white').style('stroke-width', 2);
        d3.select("body").style('cursor', 'pointer');
        if (context.tooltipRef.current) {
          context.tooltipRef.current.setState(function () {
            return {
              layoutTooltip: msg
            };
          });
        }
      };
      var mouseoutCell = function mouseoutCell() {
        d3.select(this).transition().duration(100).style('stroke-opacity', 0).style('stroke', 'white');
        d3.select("body").style('cursor', 'default');
        if (context.tooltipRef.current) {
          context.tooltipRef.current.setState(function () {
            return {
              layoutTooltip: defaultTooltipText
            };
          });
        }
      };
      var popIndicator = function popIndicator(pos, colormap, w, h) {
        return function (d, i) {
          d3.select(this).selectAll(".cell").data(d).enter().append("rect").attr("class", "cell").attr(pos, function (d, i) {
            return x(i);
          }).attr("width", w).attr("height", h).attr("title", function (d) {
            return d.id;
          }).style("fill", function (d) {
            return colormap(popNameFromId(d.id));
          }).style("stroke", function (d) {
            return colormap(popNameFromId(d.id));
          }).on("mouseover", function (d) {
            mouseoverCell.apply(this, [popNameFromId(d.id)]);
          }).on("mouseout", function () {
            mouseoutCell.apply(this);
          });
        };
      };
      var rect = container.append("rect").attr("class", "background").attr("width", matrixDim).attr("height", matrixDim);
      var colormap = context.nodeColormap.range ? context.nodeColormap : d3.scaleOrdinal(d3.schemeCategory20);
      var postMargin = parseInt(rect.attr("width")) / pre.length;
      var preMargin = parseInt(rect.attr("height")) / post.length;
      var postPop = container.selectAll(".postPop").data([post]).enter().append("g").attr("class", "postPop").attr("transform", "translate(0," + -this.topIndicator + ")").each(popIndicator("x", colormap, postMargin, 5));
      var prePop = container.selectAll(".prePop").data([pre]).enter().append("g").attr("class", "prePop").attr("transform", "translate(" + -this.leftIndicator + ",0)").each(popIndicator("y", colormap, 5, preMargin));
      var row_ = container.selectAll(".row").data(matrix).enter().append("g").attr("class", "row").attr("transform", function (d, i) {
        return "translate(0," + x(i) + ")";
      }).each(row);
      row_.append("line").attr("x2", context.width);
      var column = container.selectAll(".column").data(matrix).enter().append("g").attr("class", "column").attr("transform", function (d, i) {
        return "translate(" + x(i) + ")rotate(-90)";
      });
      column.append("line").attr("x1", -context.width);

      // Draw squares for each connection
      function row(row) {
        var cell = d3.select(this).selectAll(".cell").data(row.filter(function (d) {
          return d.z;
        })) // only paint conns
        .enter().append("rect").attr("class", "cell").attr("x", function (d) {
          return x(d.x);
        }).attr("width", x.bandwidth()).attr("height", x.bandwidth()).attr("title", function (d) {
          return d.id;
        })
        // .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function (d) {
          return c(d.z);
        }).on("click", function (d) {
          context.props.matrixOnClickHandler();
        }).on("mouseover", function (d) {
          mouseoverCell.apply(this, [nodes[d.y].id + " is connected to " + nodes[d.x].id]);
        }).on("mouseout", function () {
          mouseoutCell.apply(this);
        });
      }
    }
  }, {
    key: "getLegends",
    value: function getLegends(context) {
      var colormap = context.nodeColormap.range ? context.nodeColormap : d3.scaleOrdinal(d3.schemeCategory20);
      return [{
        id: 'legend',
        colorScale: colormap,
        title: null
      }];
    }
  }, {
    key: "getName",
    value: function getName() {
      return "Matrix";
    }
  }, {
    key: "setOrder",
    value: function setOrder(context, value) {
      this.order = value;
      var matrixDim = context.height < context.width ? context.height : context.width;
      var x = d3.scaleBand().range([0, matrixDim]);
      x.domain(this.orders[value]);
      var t = context.svg.transition().duration(2500);
      t.selectAll(".row").delay(function (d, i) {
        return x(i) * 4;
      }).attr("transform", function (d, i) {
        return "translate(0," + x(i) + ")";
      }).selectAll(".cell").delay(function (d) {
        return x(d.x) * 4;
      }).attr("x", function (d) {
        return x(d.x);
      });
      t.selectAll(".postPop .cell").delay(function (d, i) {
        return x(i) * 4;
      }).attr("x", function (d, i) {
        return x(i);
      });
      t.selectAll(".prePop .cell").delay(function (d, i) {
        return x(i) * 4;
      }).attr("y", function (d, i) {
        return x(i);
      });
      t.selectAll(".column").delay(function (d, i) {
        return x(i) * 4;
      }).attr("transform", function (d, i) {
        return "translate(" + x(i) + ")rotate(-90)";
      });
    }
  }, {
    key: "hasTooltip",
    value: function hasTooltip() {
      return true;
    }
  }, {
    key: "hasToggle",
    value: function hasToggle() {
      return true;
    }
  }, {
    key: "hasSelect",
    value: function hasSelect() {
      return true;
    }
  }]);
}();
//# sourceMappingURL=Matrix.js.map