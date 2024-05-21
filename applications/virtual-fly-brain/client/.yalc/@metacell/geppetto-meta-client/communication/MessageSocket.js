"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MessageSocket = void 0;
var _Resources = _interopRequireDefault(require("@metacell/geppetto-meta-core/Resources"));
var _EventManager = _interopRequireDefault(require("@metacell/geppetto-meta-client/common/EventManager"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var connectionInterval = 300;
var pako = require("pako");
var FileSaver = require('file-saver');
var callbackHandler = {};
var messageTypes = {
  CLIENT_ID: "client_id",
  RECONNECTION_ERROR: "reconnection_error"
};

/**
 * Web socket creation and communication
 */
var MessageSocket = /*#__PURE__*/function () {
  // sets protocol to use for connection

  // flag used to connect using ws protocol if wss failed

  // vars used for reconnection

  function MessageSocket() {
    _classCallCheck(this, MessageSocket);
    _defineProperty(this, "socket", null);
    _defineProperty(this, "clientID", null);
    _defineProperty(this, "nextID", 0);
    _defineProperty(this, "protocol", window.location.protocol === 'https:' ? "wss://" : "ws://");
    _defineProperty(this, "failsafe", false);
    _defineProperty(this, "attempts", 0);
    _defineProperty(this, "host", undefined);
    _defineProperty(this, "projectId", undefined);
    _defineProperty(this, "lostConnectionId", undefined);
    _defineProperty(this, "reconnectionLimit", 10);
    _defineProperty(this, "autoReconnectInterval", 5 * 1000);
    _defineProperty(this, "socketStatus", _Resources["default"].SocketStatus.CLOSE);
    this.connect = this.connect.bind(this);
    this.reconnect = this.reconnect.bind(this);
    this.send = this.send.bind(this);
  }
  _createClass(MessageSocket, [{
    key: "connect",
    value: function connect(host) {
      var _this = this;
      if (this.socket !== null) {
        delete this.socket;
      }
      if ('WebSocket' in window) {
        this.socket = new WebSocket(host);
        this.host = host;
        this.socket.binaryType = "arraybuffer";
      } else if ('MozWebSocket' in window) {
        this.socket = new MozWebSocket(host);
      } else {
        console.log(_Resources["default"].WEBSOCKET_NOT_SUPPORTED, true);
        return;
      }
      this.socket.onopen = function (e) {
        console.log(_Resources["default"].WEBSOCKET_OPENED, true);

        /*
         * attach the handlers once socket is opened on the first connection
         * differently handle the reconnection scenario
         */

        if (_this.lostConnectionId) {
          var parameters = {};
          parameters["connectionID"] = _this.lostConnectionId;
          parameters["projectId"] = _this.projectId;
          _this.send("reconnect", parameters);
          _this.lostConnectionId = undefined;
        }

        // Reset the counter for reconnection
        _this.attempts = 0;
        _this.socketStatus = _Resources["default"].SocketStatus.OPEN;
        console.log("%c WebSocket Status - Opened ", 'background: #444; color: #bada55');
      };
      this.socket.onclose = function (e) {
        switch (e.code) {
          case 1000:
            _this.socketStatus = _Resources["default"].SocketStatus.CLOSE;
            console.log(_Resources["default"].WEBSOCKET_CLOSED, true);
            break;
          default:
            if (_this.lostConnectionId === undefined) {
              _this.lostConnectionId = _this.getClientID();
            }
            _this.reconnect(e);
        }
      };
      this.socket.onmessage = function (msg) {
        var messageData = msg.data;
        if (messageData == "ping") {
          return;
        }

        // if it's a binary (possibly compressed) then determine its type and process it
        if (messageData instanceof ArrayBuffer) {
          _this.processBinaryMessage(messageData);

          // otherwise, for a text message, parse it and notify listeners
        } else {
          // a non compressed message
          _this.parseAndNotify(messageData);
        }
      };

      // Detects problems when connecting to Geppetto server
      this.socket.onerror = function (e) {
        var message = _Resources["default"].SERVER_CONNECTION_ERROR;
        /*
         * Attempt to connect using ws first time wss fails,
         * if ws fails too then don't try again and display info error window
         */
        if (_this.failsafe) {
          _this.protocol = "ws://";
          _this.failsafe = true;
          _this.connect(_this.protocol + window.location.host + '/' + GEPPETTO_CONFIGURATION.contextPath + '/GeppettoServlet');
        } else {
          switch (e.code) {
            case 'ECONNREFUSED':
              console.log("%c WebSocket Status - Open connection error ", 'background: #000; color: red');
              console.log(_Resources["default"].WEBSOCKET_CONNECTION_ERROR, true);
              break;
            case undefined:
              console.log("%c WebSocket Status - Open connection error ", 'background: #000; color: red');
              console.log(_Resources["default"].WEBSOCKET_RECONNECTION, true);
              break;
            default:
              console.log("%c WebSocket Status - Closed ", 'background: #000; color: red');
              _this.socketStatus = _Resources["default"].SocketStatus.CLOSE;
              break;
          }
        }
      };
    }

    /**
     * Attempt to reconnect to the backend
     */
  }, {
    key: "reconnect",
    value: function reconnect(e) {
      var _this2 = this;
      if (this.attempts < this.reconnectionLimit) {
        this.attempts++;
        this.socketStatus = _Resources["default"].SocketStatus.RECONNECTING;
        console.log("WebSocket Status - retry in ".concat(this.autoReconnectInterval, "ms"), e);
        setTimeout(function () {
          console.log("%c WebSocket Status - reconnecting... ", 'background: #444; color: #bada55');
          _this2.connect(_this2.host);
        }, this.autoReconnectInterval);
      } else {
        this.socketStatus = _Resources["default"].SocketStatus.CLOSE;
        console.log(_Resources["default"].WEBSOCKET_CLOSED, true);
        _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.WEBSOCKET_DISCONNECTED]();
      }
    }

    /**
     * Sends messages to the server
     */
  }, {
    key: "send",
    value: function send(command, parameter, callback) {
      if (this.socketStatus === _Resources["default"].SocketStatus.RECONNECTING && command !== "reconnect") {
        _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.STOP_LOGO]();
        return;
      }
      var requestID = this.createRequestID();
      this.waitForConnection(messageTemplate(requestID, command, parameter), connectionInterval);

      // add callback with request id if any
      if (callback != undefined) {
        callbackHandler[requestID] = callback;
      }
      return requestID;
    }
  }, {
    key: "waitForConnection",
    value: function waitForConnection(messageTemplate, interval) {
      if (this.isReady() === 1) {
        this.socket.send(messageTemplate);
      } else if (this.isReady() > 1) {
        // connection is either closing (2) or already closed (3).
        _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.WEBSOCKET_DISCONNECTED]();
      } else {
        // must be in connecting (0) state
        var that = this;
        setTimeout(function () {
          that.waitForConnection(messageTemplate);
        }, interval);
      }
    }
  }, {
    key: "isReady",
    value: function isReady() {
      if (this.socket !== null) {
        return this.socket.readyState;
      } else {
        return 0;
      }
    }
  }, {
    key: "close",
    value: function close() {
      this.socket.close();
      _EventManager["default"].actionsHandler[_EventManager["default"].clientActions.WEBSOCKET_DISCONNECTED]();
    }

    /**
     * Sets the id of the client
     */
  }, {
    key: "setClientID",
    value: function setClientID(id) {
      this.clientID = id;
    }

    /**
     * Sets the id of the client
     */
  }, {
    key: "getClientID",
    value: function getClientID() {
      return this.clientID;
    }
    /**
     * Creates a request id to send with the message to the server
     */
  }, {
    key: "createRequestID",
    value: function createRequestID() {
      return this.clientID + "-" + this.nextID++;
    }
  }, {
    key: "loadProjectFromId",
    value: function loadProjectFromId(projectId) {
      this.send("load_project_from_id", {
        projectId: projectId
      });
    }
  }, {
    key: "loadProjectFromUrl",
    value: function loadProjectFromUrl(projectURL) {
      this.send("load_project_from_url", projectURL);
    }
  }, {
    key: "loadProjectFromContent",
    value: function loadProjectFromContent(content) {
      this.send("load_project_from_content", content);
    }
  }, {
    key: "gzipUncompress",
    value: function gzipUncompress(compressedMessage) {
      var messageBytes = new Uint8Array(compressedMessage);
      var message = pako.ungzip(messageBytes, {
        to: "string"
      });
      return message;
    }

    /**
     * Dispatches through Redux actions all messages received from the socket
     * @param {*} messageData 
     */
  }, {
    key: "parseAndNotify",
    value: function parseAndNotify(messageData) {
      var parsedServerMessage = JSON.parse(messageData);
      console.debug("Received websocket message", parsedServerMessage);
      var payload = JSON.parse(parsedServerMessage.data);
      if (payload[parsedServerMessage.type]) {
        try {
          payload = JSON.parse(payload[parsedServerMessage.type]);
        } catch (e) {
          payload = payload[parsedServerMessage.type];
        }
      }
      switch (parsedServerMessage.type) {
        case messageTypes.CLIENT_ID:
          {
            this.setClientID(payload.clientID);
            break;
          }
        case messageTypes.RECONNECTION_ERROR:
          {
            this.socketStatus = _Resources["default"].SocketStatus.CLOSE;
            break;
          }
        default:
          break;
      }
      _EventManager["default"].store.dispatch({
        type: parsedServerMessage.type,
        data: payload
      });

      // run callback if any
      if (parsedServerMessage.requestID != undefined) {
        if (callbackHandler[parsedServerMessage.requestID] != undefined) {
          callbackHandler[parsedServerMessage.requestID](parsedServerMessage.data);
          delete callbackHandler[parsedServerMessage.requestID];
        }
      }
    }
  }, {
    key: "processBinaryMessage",
    value: function processBinaryMessage(message) {
      var messageBytes = new Uint8Array(message);

      /*
       * if it's a binary message and first byte it's zero then assume it's a compressed json string
       * otherwise is a file and a 'save as' dialog is opened
       */
      if (messageBytes[0] == 0) {
        var message = pako.ungzip(messageBytes.subarray(1), {
          to: "string"
        });
        this.parseAndNotify(message);
      } else {
        var fileNameLength = messageBytes[1];
        var fileName = String.fromCharCode.apply(null, messageBytes.subarray(2, 2 + fileNameLength));
        var blob = new Blob([message]);
        FileSaver.saveAs(blob.slice(2 + fileNameLength), fileName);
      }
    }
  }]);
  return MessageSocket;
}();
/**
 * Template for Geppetto message
 *
 * @param msgtype - message type
 * @param payload - message payload, can be anything
 * @returns JSON stringified object
 */
exports.MessageSocket = MessageSocket;
function messageTemplate(id, msgtype, payload) {
  if (!(typeof payload == 'string' || payload instanceof String)) {
    payload = JSON.stringify(payload);
  }
  var object = {
    requestID: id,
    type: msgtype,
    data: payload
  };
  return JSON.stringify(object);
}
var _default = new MessageSocket();
exports["default"] = _default;
//# sourceMappingURL=MessageSocket.js.map