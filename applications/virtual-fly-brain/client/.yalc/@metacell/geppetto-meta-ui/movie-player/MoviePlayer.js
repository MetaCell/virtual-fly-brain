"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactPlayer = _interopRequireDefault(require("react-player"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var MoviePlayer = exports["default"] = /*#__PURE__*/function (_Component) {
  function MoviePlayer(props) {
    var _this;
    _classCallCheck(this, MoviePlayer);
    _this = _callSuper(this, MoviePlayer, [props]);
    _this.state = {
      play: false,
      volume: 1,
      // can be any value from 0 to 1
      videoURL: "",
      // URL pointing to the file to be played
      loop: false,
      // play video again at end of video
      playbackRate: 1 // playback rate any decimal
    };
    return _this;
  }
  _inherits(MoviePlayer, _Component);
  return _createClass(MoviePlayer, [{
    key: "play",
    value: function play() {
      this.setState({
        play: true
      });
      this.forceUpdate();
    }
  }, {
    key: "pause",
    value: function pause() {
      this.setState({
        play: false
      });
      this.forceUpdate();
    }
  }, {
    key: "loop",
    value: function loop(_loop) {
      this.setState({
        loop: _loop
      });
      this.forceUpdate();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.setState({
        play: false
      });
      this.forceUpdate();
    }
  }, {
    key: "load",
    value: function load(url) {
      this.setState({
        videoURL: url
      });
      this.forceUpdate();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.controls != null || this.props.controls != undefined) {
        var play = this.props.controls.playAtStart != undefined ? this.props.controls.playAtStart : this.state.play;
        var loop = this.props.controls.loop != undefined ? this.props.controls.loop : this.state.loop;
        var volume = this.props.controls.volume != undefined ? this.props.controls.volume : this.state.volume;
        var playbackRate = this.props.controls.playbackRate != undefined ? this.props.controls.playbackRate : this.state.playbackRate;
        this.setState({
          play: play,
          loop: loop,
          volume: volume,
          playbackRate: playbackRate,
          videoURL: this.props.videoURL
        });
      } else {
        this.setState({
          videoURL: this.props.videoURL
        });
      }
      this.forceUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var width = "100%",
        height = "100%";
      if (this.props.width != undefined && this.props.width != null) {
        width = this.props.width;
      }
      if (this.props.height != undefined && this.props.height != null) {
        height = this.props.height;
      }
      return /*#__PURE__*/_react["default"].createElement(_reactPlayer["default"], {
        url: this.state.videoURL,
        playing: this.state.play,
        volume: this.state.volume,
        loop: this.state.loop,
        playbackRate: this.state.playbackRate,
        width: width,
        height: height
      });
    }
  }]);
}(_react.Component);
MoviePlayer.defaultValues = {
  controls: {
    playAtStart: false,
    loop: false,
    volume: 10,
    playbackRate: 1
  },
  width: '800px',
  height: '640px'
};
MoviePlayer.propTypes = {
  /**
   * URL pointing to the video to be rendered in this component.
   */
  videoURL: _propTypes["default"].string.isRequired,
  /**
   * Javascript object with playback settings.
   */
  controls: _propTypes["default"].shape({
    /**
    * Boolean value indicating if video should play at the start. Defaults to false.
    */
    playAtStart: _propTypes["default"].bool,
    /**
    * Boolean value indicating if the video should be played in a loop. Defaults to false.
    */
    loop: _propTypes["default"].bool,
    /**
    * Start volume of the video.
    */
    volume: _propTypes["default"].number,
    /**
    * Playback rate of the video.
    */
    playbackRate: _propTypes["default"].number
  }),
  /**
   * Width of the movie player
   */
  width: _propTypes["default"].string,
  /**
   * Height of the movie player
   */
  height: _propTypes["default"].string
};
//# sourceMappingURL=MoviePlayer.js.map