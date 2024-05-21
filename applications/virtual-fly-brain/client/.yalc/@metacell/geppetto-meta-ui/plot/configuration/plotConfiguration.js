"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTrace = exports.defaultLine = exports.defaultLayout = exports.defaultConfig = void 0;
var defaultConfig = exports.defaultConfig = function defaultConfig() {
  return {
    scrollZoom: false,
    displaylogo: false,
    displayModeBar: false
  };
};
var defaultLine = exports.defaultLine = function defaultLine() {
  return {
    dash: 'solid',
    width: '2',
    color: 'rgb(0, 0, 0)'
  };
};
var defaultTrace = exports.defaultTrace = function defaultTrace() {
  return {
    mode: "lines",
    line: defaultLine(),
    hoverinfo: 'all',
    type: 'scatter'
  };
};
var defaultFont = function defaultFont() {
  return 'Helvetica Neue, Helevtica, sans-serif';
};
var defaultAxisLayout = function defaultAxisLayout() {
  return {
    autorange: false,
    showgrid: false,
    showline: true,
    zeroline: false,
    mirror: true,
    ticklen: 1,
    tickcolor: 'white',
    linecolor: 'white',
    tickfont: {
      family: defaultFont(),
      size: 11,
      color: 'white'
    },
    titlefont: {
      family: defaultFont(),
      size: 12,
      color: 'white'
    },
    ticks: 'outside'
  };
};
var defaultLayout = exports.defaultLayout = function defaultLayout() {
  return {
    autosize: true,
    showgrid: false,
    showlegend: true,
    xaxis: defaultAxisLayout(),
    yaxis: defaultAxisLayout(),
    margin: {
      l: 50,
      r: 10,
      b: 40,
      t: 10
    },
    legend: {
      xanchor: "auto",
      yanchor: "auto",
      font: {
        family: defaultFont(),
        size: 12,
        color: '#fff'
      },
      x: 1
    },
    transition: {
      duration: 0
    },
    frame: {
      duration: 0,
      redraw: false
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    playAll: false,
    hovermode: 'none',
    datarevision: 0
  };
};
//# sourceMappingURL=plotConfiguration.js.map