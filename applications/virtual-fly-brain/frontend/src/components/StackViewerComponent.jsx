import React from 'react';
import { Application, Container, Assets, Sprite, Text, TextStyle, utils, extensions, ExtensionType, Texture , Resource, BLEND_MODES } from 'pixi.js';
import { getInstanceByID } from '../reducers/actions/instances';
import ReactResizeDetector from 'react-resize-detector';
import StackViewerButtons from './StackViewerButtons';
import createClass from 'create-react-class';

import SLICE from "../assets/viewer/slice.svg";
import ORTH from "../assets/viewer/orth.svg";
import GLASS from '../assets/viewer/glass.jpg';
import ORTHHOVER from "../assets/viewer/orth_hover.svg";
import SLICEHOVER from '../assets/viewer/slice_hover.svg';

const SLICE_VIEWER_DISPLAY = "sliceViewerDisplay";

const componentToHex = (c) => {
  const hex = (c*255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (color) => {
  return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}

  const Canvas = createClass({
    _isMounted: false,
    _initialized: false,

    getInitialState: function () {
      return {
        buffer: {},
        images: {},
        text: this.props.statusText,
        serverUrl: this.props.serverUrl.replace('http:', window.location.protocol).replace('https:', window.location.protocol),
        color: this.props.color,
        stack: this.props.stack,
        label: this.props.label,
        pit: this.props.pit,
        yaw: this.props.yaw,
        rol: this.props.rol,
        dst: this.props.dst,
        id: this.props.id,
        minDst: -100,
        maxDst: 100,
        tileX: 1025,
        tileY: 1025,
        imageX: 1024,
        imageY: 1024,
        scl: Number(this.props.scl),
        voxelX: this.props.voxelX,
        voxelY: this.props.voxelY,
        voxelZ: this.props.voxelZ,
        visibleTiles: [0],
        stackViewerPlane: false,
        plane: [0, 0, 0, this.props.width, 0, 0, 0, this.props.height, 0, this.props.width, this.props.height, 0],
        planeUpdating: false,
        lastUpdate: 0,
        updating: false,
        numTiles: 1,
        posX: 0,
        posY: 0,
        oldX: 0,
        oldY: 0,
        loadingLabels: false,
        orth: this.props.orth,
        data: {},
        dragOffset: {},
        dragging: false,
        recenter: false,
        txtUpdated: Date.now(),
        txtStay: 3000,
        objects: [],
        hoverTime: Date.now(),
        lastLabelCall: 0,
        bufferRunning: false,
        iBuffer: {},
        imagesUrl: {},
        isMenuOpen: false
      };
    },

    setShiftDown : function(event){
      if(event.keyCode === 16 || event.charCode === 16){
          window.shiftDown = true;
      }
    },

    setShiftUp : function(event){
      if(event.keyCode === 16 || event.charCode === 16){
          window.shiftDown = false;
      }
    },

    /**
     * In this case, componentDidMount is used to grab the canvas container ref, and
     * and hook up the PixiJS renderer
     *
     */
    componentDidMount: function () {
      // signal component mounted (used to avoid calling isMounted() deprecated method)
      this._isMounted = true;

      // console.log('Loading....');

      // Setup PIXI Canvas in componentDidMount
      this.app = new Application({ width : this.props.width, height : this.props.height});
      // this.app.renderer.backgroundColor = '#1a1a1a';
      // maintain full window size
      this.refs.stackCanvas?.getElementsByTagName("canvas")?.length == 0 && this.refs.stackCanvas?.appendChild(this.app.view);

      this.disp = new Container({ width : this.props.width, height : this.props.height});
      this.disp.pivot.x = 0;
      this.disp.pivot.y = 0;
      // Start with a conservative scale that will be updated when proper zoom is calculated
      this.disp.scale.x = 0.1; // Start zoomed out until proper scale is calculated
      this.disp.scale.y = 0.1;
      this.app.stage.addChild(this.disp);
      this.stack = new Container();
      this.stack.pivot.x = 0;
      this.stack.pivot.y = 0;
      this.stack.position.x = 0;
      this.stack.position.y = 0;
      this.state.recenter = true;

      this.createStatusText();

      this.stack.interactive = true;
      this.stack.buttonMode = true;
      this.stack
        // events for drag start
        .on('mousedown', this.onDragStart)
        .on('touchstart', this.onDragStart)
        // events for drag end
        .on('mouseup', this.onDragEnd)
        .on('mouseupoutside', this.onDragEnd)
        .on('touchend', this.onDragEnd)
        .on('touchendoutside', this.onDragEnd)
        // events for drag move
        .on('mousemove', this.onDragMove)
        .on('touchmove', this.onDragMove)
        // events for click (backup handler)
        .on('click', this.onStackClick)
        .on('tap', this.onStackClick);

      this.disp.addChild(this.stack);

      // Configure interaction plugin for newer PIXI.js versions
      if (this.app.renderer.plugins.interaction) {
        this.app.renderer.plugins.interaction.moveWhenInside = true;
      } else if (this.app.renderer.events) {
        this.app.renderer.events.moveWhenInside = true;
      }

      // call metadata from server
      this.callDstRange();
      this.callTileSize();
      this.callImageSize();

      // start the display
      this.createImages();
      this.animate();

      this.callPlaneEdges();

      setTimeout(this.bufferStack, 30000);

      window.addEventListener? document.addEventListener('keydown', this.setShiftDown) : document.attachEvent('keydown', this.setShiftDown);
      window.addEventListener? document.addEventListener('keyup', this.setShiftUp) : document.attachEvent('keyup', this.setShiftUp);

    },

    componentDidUpdate: function () {
      // console.log('Canvas update');
      if (this.app.renderer.width !== Math.floor(this.props.width) || this.app.renderer.height !== Math.floor(this.props.height)) {
        this.app.renderer.resize(this.props.width, this.props.height);
        this.props.onHome();
      }
      this.checkStack();
      this.createImages();
      this.callPlaneEdges();
      this.animate();
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      return shallowCompare(this, nextProps, nextState);

      /**
       * Performs equality by iterating through keys on an object and returning false
       * when any key has values which are not strictly equal between the arguments.
       * Returns true when the values of all keys are strictly equal.
       */
      function shallowEqual (objA, objB) {
        if (objA === objB) {
          return true;
        }

        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
          return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
          return false;
        }

        // Test for A's keys different from B.
        var bHasOwnProperty = hasOwnProperty.bind(objB);
        for (var i = 0; i < keysA.length; i++) {
          if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
          }
          if (keysA[i] === "color") {
            if (JSON.stringify(objA[keysA[i]]) !== JSON.stringify(objB[keysA[i]])) {
              return false;
            }
          }
        }
        return true;
      }

      function shallowCompare (instance, nextProps, nextState) {
        return (
          !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState)
        );
      }
    },


    componentWillUnmount: function () {
      // Properly cleanup PIXI application and WebGL context
      if (this.app) {
        // Remove canvas from DOM
        if (this.refs.stackCanvas && this.app.view && this.app.view.parentNode) {
          this.app.view.parentNode.removeChild(this.app.view);
        }
        
        // Destroy PIXI application and free WebGL context
        this.app.destroy(true, true);
        this.app = null;
      }

      // Cleanup containers
      if (this.disp) {
        this.disp.destroy();
        this.disp = null;
      }
      if (this.stack) {
        this.stack.destroy();
        this.stack = null;
      }

      // Cleanup text buffers
      if (this.state.buffer[-1]) {
        this.state.buffer[-1].destroy();
        this.state.buffer[-1] = null;
      }
      if (this.state.hoverTextBuffer) {
        this.state.hoverTextBuffer.destroy();
        this.state.hoverTextBuffer = null;
      }

      window.addEventListener? document.removeEventListener('keydown', this.setShiftDown, false) : document.attachEvent('keydown', this.setShiftDown);
      window.addEventListener? document.removeEventListener('keyup', this.setShiftUp, false) : document.detachEvent('keyup', this.setShiftUp);

      if (this.props.canvasRef != null && this.props.canvasRef != undefined) {
        this.props.canvasRef.removeObject(this.state.stackViewerPlane);
      }

      // free texture caches
      var textureUrl;
      for (textureUrl in utils.BaseTextureCache) {
        delete utils.BaseTextureCache[textureUrl];
      }
      for (textureUrl in utils.TextureCache) {
        delete utils.TextureCache[textureUrl];
      }

      // signal component is now unmounted
      this._isMounted = false;

      return true;
    },

    callDstRange: function async() {
      var image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[0] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=10.0&dst=0&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0);
      /*
       * this.state.buffer[-1].text = 'Buffering stack...';
       *get distance range;
       */
      let that = this;
      let file = image + '&obj=Wlz-distance-range';
      fetch(file,{ method : "POST", url : file})
        .then(response => 
          response.text()
        )
        .then( data => {
          if (data.indexOf('html') < 0) {
            let result = data.trim().split(':')[1].split(' ');
            let min = Number(result[0]);
            let max = Number(result[1]);
            that.setState({ minDst: min, maxDst: max });
            let extent = { minDst: min, maxDst: max };
            that.props.setExtent(extent);
            //console.log('Stack Depth: ' + ((max - min) / 10.0).toFixed(0));
            that.checkStack();
            that.callPlaneEdges();
            that.state.iBuffer = {};
            that.state.lastUpdate = 0;
            that.bufferStack();
            that.animate();
          }
        })
        .catch(error => {
          console.error("Calling Dst Range error : ", error);
        });
    },

    callTileSize: function () {
      var image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[0] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=1.0&dst=0&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0);

        let that = this;
        let file = image + '&obj=Tile-size';
        fetch(file,{ method : "POST",url : file })
          .then(response => 
            response.text()
          )
        .then( data => {
          if (data.indexOf('html') < 0) {
            let result = data.trim().split(':')[1].split(' ');
            let tileX = Number(result[0]);
            let tileY = Number(result[1]);
            that.setState({ tileX: tileX, tileY: tileY });
            that.checkStack();
            that.callPlaneEdges();
            that.state.iBuffer = {};
            that.state.lastUpdate = 0;
            that.bufferStack();
            that.animate();
          }
        })
        .catch(error => {
          console.error("Calling Tile size error : ", error);
        });
    },

    callImageSize: function () {
      var image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[0] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=10.0&dst=0&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0);
      let that = this;
        let file = image + '&obj=Max-size';
        fetch(file,{ method : "POST", url : file})
          .then(response =>
            response.text()
          )
        .then( data => {
          if (data.indexOf('html') < 0) {
            let result = data.trim().split(':')[1].split(' ');
            let imageX = Math.ceil( Number(result[0] ));
            let imageY = Math.ceil( Number(result[1] ));
            let extent = { imageX: imageX, imageY: imageY };
            that.setState(extent);
            that.props.setExtent(extent);
            that.checkStack();
            that.callPlaneEdges();
            that.state.iBuffer = {};
            that.state.lastUpdate = 0;
            that.bufferStack();
            that.animate();
          }
        })
        .catch(error => {
          console.error("Calling Tile size error : ", error);
        });
    },

    callPlaneEdges: function () {
      if (!this.state.planeUpdating) {
        this.state.planeUpdating = true;
        if (this.stack.width > 1) {
          var coordinates = [];
          var x, y, z;
          // update widget window extents (X,Y):
          if (this.state.orth == 2) {
            x = (this.stack.position.x / this.state.scl) - (this.disp.position.x / (this.disp.scale.x * this.state.scl));
          } else {
            x = -(this.stack.position.x / this.state.scl) - (this.disp.position.x / (this.disp.scale.x * this.state.scl));
          }
          if (this.state.orth == 1) {
            y = (this.stack.position.y / this.state.scl) - (this.disp.position.y / (this.disp.scale.y * this.state.scl));
          } else {
            y = -(this.stack.position.y / this.state.scl) - (this.disp.position.y / (this.disp.scale.y * this.state.scl));
          }
          coordinates[0] = x.toFixed(0);
          coordinates[1] = y.toFixed(0);
          x = x + (this.app.renderer.width / (this.disp.scale.x * this.state.scl));
          y = y + (this.app.renderer.height / (this.disp.scale.y * this.state.scl));
          coordinates[2] = x.toFixed(0);
          coordinates[3] = y.toFixed(0);
          if (this.state.orth == 0) { // frontal
            this.state.plane[0] = coordinates[0];
            this.state.plane[1] = coordinates[1];
            this.state.plane[3] = coordinates[2];
            this.state.plane[4] = coordinates[1];
            this.state.plane[6] = coordinates[0];
            this.state.plane[7] = coordinates[3];
            this.state.plane[9] = coordinates[2];
            this.state.plane[10] = coordinates[3];
          } else if (this.state.orth == 1) { // transverse
            this.state.plane[0] = coordinates[0];
            this.state.plane[2] = coordinates[1];
            this.state.plane[3] = coordinates[2];
            this.state.plane[5] = coordinates[1];
            this.state.plane[6] = coordinates[0];
            this.state.plane[8] = coordinates[3];
            this.state.plane[9] = coordinates[2];
            this.state.plane[11] = coordinates[3];
          } else if (this.state.orth == 2) { // sagittal
            this.state.plane[1] = coordinates[1];
            this.state.plane[2] = coordinates[0];
            this.state.plane[4] = coordinates[1];
            this.state.plane[5] = coordinates[2];
            this.state.plane[7] = coordinates[3];
            this.state.plane[8] = coordinates[0];
            this.state.plane[10] = coordinates[3];
            this.state.plane[11] = coordinates[2];
          }
        }
        // Pass Z coordinates
        z = ((this.state.dst - ((this.state.minDst / 10.0) * this.state.scl)) / this.state.scl);
        if (this.state.orth == 0) { // frontal
          this.state.plane[2] = z;
          this.state.plane[5] = z;
          this.state.plane[8] = z;
          this.state.plane[11] = z;
        } else if (this.state.orth == 1) { // transverse
          this.state.plane[1] = z;
          this.state.plane[4] = z;
          this.state.plane[7] = z;
          this.state.plane[10] = z;
        } else if (this.state.orth == 2) { // sagittal
          this.state.plane[0] = z;
          this.state.plane[3] = z;
          this.state.plane[6] = z;
          this.state.plane[9] = z;
        }
        this.passPlane();
      }
    },

    passPlane: function () {
      if (this.state.stackViewerPlane) {
          let data = {
            data : { 
              vert1 : [ parseInt(this.state.plane[0]), parseInt(this.state.plane[1]), parseInt(this.state.plane[2])],
              vert2: [ parseInt(this.state.plane[3]), parseInt(this.state.plane[4]), parseInt(this.state.plane[5]) ],
              vert3 : [ parseInt(this.state.plane[6]), parseInt(this.state.plane[7]), parseInt(this.state.plane[8]) ],
              vert4 : [ parseInt(this.state.plane[9]), parseInt(this.state.plane[10]), parseInt(this.state.plane[11])]
             },
             id : SLICE_VIEWER_DISPLAY,
             textureUrl :  GLASS,
             visible : this.props.slice
          };
          this.state.stackViewerPlane = true;
          this.props.modifySliceDisplay(data)
      } else {
        if (this.props.slice) {
          let data = {
            data : { 
              vert1 : [ parseInt(this.state.plane[0]), parseInt(this.state.plane[1]), parseInt(this.state.plane[2])],
              vert2: [ parseInt(this.state.plane[3]), parseInt(this.state.plane[4]), parseInt(this.state.plane[5]) ],
              vert3 : [ parseInt(this.state.plane[6]), parseInt(this.state.plane[7]), parseInt(this.state.plane[8]) ],
              vert4 : [ parseInt(this.state.plane[9]), parseInt(this.state.plane[10]), parseInt(this.state.plane[11])]
             },
             id : SLICE_VIEWER_DISPLAY,
             textureUrl :  GLASS,
             visible : true
          };
          this.state.stackViewerPlane = true;
          this.props.showSliceDisplay(data)
        }
        if (this.state.stackViewerPlane) {
          this.state.stackViewerPlane = true;
        }
        this.checkStack();
      }
      if (this.disp.width > 0 && this.props.slice) {
        this.state.stackViewerPlane = true;
      }
      this.state.planeUpdating = false;
    },

    callObjects: function () {

      var j, result;
      var that = this;
      var isSelected = false;
      [this.state.stack[0]]?.forEach( (item,i) => {
        (function (i, that) {
          var image = that.state.serverUrl.toString() + '?wlz=' + item + '&sel=0,255,255,255&mod=zeta&fxp=' + that.props.fxp.join(',') + '&scl=' + Number(that.state.scl).toFixed(1) + '&dst=' + Number(that.state.dst).toFixed(1) + '&pit=' + Number(that.state.pit).toFixed(0) + '&yaw=' + Number(that.state.yaw).toFixed(0) + '&rol=' + Number(that.state.rol).toFixed(0);
          // get image size;
          let file = image + '&prl=-1,' + that.state.posX.toFixed(0) + ',' + that.state.posY.toFixed(0) + '&obj=Wlz-foreground-objects';
            fetch(file,{ method : "POST", url : file})
              .then(response =>
                response.text()
              )
            .then( data => {
              result = data.trim().split(':')[1].trim().split(' ');
                if (result !== '') {
                  for (j in result) {
                    if (result[j].trim() !== '') {
                      var index = Number(result[j]);
                      if (i !== 0 || index !== 0) { // don't select template
                        if (index == 0 ) {
                          if ( !isSelected && (!window.shiftDown || window.shiftDown === undefined)){
                            //console.log(that.state.label[i] + ' clicked');
                            try {
                              getInstanceByID(that.props.templateDomainIds[index], true, true, true);
                              that.setStatusText(that.state.label[i] + ' selected');
                              isSelected = true;
                            } catch (err) {
                              console.log("Error selecting: " + that.state.id[i][Number(result[j])]);
                              console.log(err.message);
                            }
                          }
                          break;
                        } else {
                          if (typeof that.props.templateDomainIds !== 'undefined' && typeof that.props.templateDomainNames !== 'undefined' && typeof that.props.templateDomainIds[index] !== 'undefined' && typeof that.props.templateDomainNames[index] !== 'undefined' && that.props.templateDomainIds[index] !== null && that.props.templateDomainNames[index] !== null) {
                            if (!isSelected && window.shiftDown ) {
                              try {
                                getInstanceByID(that.props.templateDomainIds[index], true, true, true, true);
                                // selectInstance(that.props.templateDomainIds[index]);
                                //console.log(that.props.templateDomainNames[index] + ' clicked');
                                that.setStatusText(that.props.templateDomainNames[index] + ' selected');
                                break;
                              // eslint-disable-next-line no-unused-vars
                              } catch (_ignore) {
                                //console.log(that.props.templateDomainNames[index] + ' requested');
                                that.setStatusText(that.props.templateDomainNames[index] + ' requested');
                                if (window.shiftDown) {
                                  //console.log('Adding ' + that.props.templateDomainNames[index]);
                                  that.setStatusText('Adding ' + that.props.templateDomainNames[index]);
                                  isSelected = true;
                                  break;
                                } else {
                                  that.setStatusText(that.props.templateDomainNames[index] + ' (⇧click to add)');
                                  break;
                                }
                              }
                            } else if ( !window.shiftDown || window.shiftDown === undefined ){
                              try {
                                getInstanceByID(that.props.templateDomainTypeIds[index], false, true, false, false);
                                that.setStatusText(that.props.templateDomainNames[index] + ' selected');
                                break;
                              // eslint-disable-next-line no-unused-vars
                              } catch (ignore) {
                                console.log(that.props.templateDomainTypeIds[index] + ' requested');
                                that.setStatusText(that.props.templateDomainNames[index] + ' requested');
                              }
                            }
                          } else {
                            console.log('Index not listed: ' + result[j]);
                          }
                        }
                      }
                    }
                  }
                }
                // update slice view
                that.checkStack();
            })
            .catch(error => {
              that.state.loadingLabels = false;
              console.error("Calling Objects", error);
            });
        })(i, that);
      });
    },

    loadProgressHandler : function (loader) {
      this.setStatusText('Buffering stack ' + loader.progress.toFixed(1) + "%");
    },

    setup : function (images) {
      images.forEach ( ( k, index) => {
        this.state.iBuffer[index] = k;
      });
      // console.log('Buffered ' + (1000 - buffMax).toString() + ' tiles');
      if (this._isMounted === true && this._initialized === false) {
        // this.props.canvasRef.resetCamera();
        this._initialized = true;
        this.props.onHome();
      }
      if (this.state.text?.indexOf('Buffering stack') > -1) {
        this.state.buffer[-1].text = '';
      }
      this.state.bufferRunning = false;
      this.state.lastUpdate = Date.now();
      this.animate();
    },

    listObjects: function () {
      if (!this.state.loadingLabels || this.state.lastLabelCall < (Date.now() - 500)) {
        this.state.lastLabelCall = Date.now();
        this.state.objects = [];
        var j, result;
        var that = this;
        var callX = that.state.posX.toFixed(0), callY = that.state.posY.toFixed(0);

        [this.state.stack[0]]?.forEach( (item, i) => {
          (function (i, that) {
            if (i == 0) {
              that.state.loadingLabels = true;
            }
            var image = that.state.serverUrl.toString() + '?wlz=' + item + '&sel=0,255,255,255&mod=zeta&fxp=' + that.props.fxp.join(',') + '&scl=' + Number(that.state.scl).toFixed(1) + '&dst=' + Number(that.state.dst).toFixed(1) + '&pit=' + Number(that.state.pit).toFixed(0) + '&yaw=' + Number(that.state.yaw).toFixed(0) + '&rol=' + Number(that.state.rol).toFixed(0);
            let file = image + '&prl=-1,' + callX + ',' + callY + '&obj=Wlz-foreground-objects';
            fetch(file,{ method : "POST", url : file})
              .then(response =>
                response.text()
              )
            .then( data => {
              result = data.trim().split(':')[1].trim().split(' ');
                if (result !== '') {
                  for (j in result) {
                    if (result[j].trim() !== '') {
                      var index = Number(result[j]);
                      if (i !== 0 || index !== 0) { // don't select template
                        if (index == 0) {
                          if (!window.shiftDown || window.shiftDown === undefined ) {
                            let updatedObjects = [...that.state.objects];
                            if ( !updatedObjects?.find( o => o === that.state.label[i] ) ){
                              updatedObjects.push(that.props.templateDomainNames[index]);
                            }
                            that.setState({ objects : updatedObjects})
                            that.state.objects = updatedObjects
                          }
                        } else {
                          if (typeof that.props.templateDomainIds !== 'undefined' && typeof that.props.templateDomainNames !== 'undefined' && typeof that.props.templateDomainIds[index] !== 'undefined' && typeof that.props.templateDomainNames[index] !== 'undefined' && that.props.templateDomainNames[index] !== null) {
                            let updatedObjects = [...that.state.objects];
                            if ( !updatedObjects?.find( o => o === that.props.templateDomainNames[index] ) ){
                              updatedObjects.push(that.props.templateDomainNames[index]);
                            }
                            that.setState({ objects : updatedObjects})
                            that.state.objects = updatedObjects
                            break;
                          }
                        }
                      }
                    }
                  }
                  var list = that.state.objects?.filter((el, index, arr) => {
                    return index === arr.indexOf(el);
                  }).sort();
                  var objects = '';
                  if (window.shiftDown) {
                    objects = 'Click to add: ';
                  }
                  for (j in list) {
                    objects = objects + list[j] + '\n';
                  }
                  if (objects !== '' && i == 0) {
                    that.setHoverText(callX,callY,list[0]);
                  } else {
                    that.clearHoverText();
                  }
                }
                // update slice view
                if (i == 0) {
                  that.state.loadingLabels = false;
                }
            })
            .catch(error => {
              that.state.loadingLabels = false;
              console.error("Listing Objects", error);
            });
          })(i, that);
        });
      }
    },

    bufferStack: async function () {
      if (!this.state.bufferRunning && this.state.lastUpdate < (Date.now() - 60000)) {
        this.state.bufferRunning = true;
        var loadList = new Set();
        this.state.lastUpdate = Date.now();
        var i, j, image;
        var min = (this.state.minDst / 10.0) * this.state.scl;
        var max = (this.state.maxDst / 10.0) * this.state.scl;
        var buffMax = 2000;

        for (j = 0; j < this.state.numTiles; j++) {
          for (i in this.state.stack) {
            image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[i] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=' + Number(this.state.scl).toFixed(1) + '&dst=' + Number(this.state.dst).toFixed(1) + '&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0) + '&qlt=80&jtl=' + j.toString();
            if (!this.state.iBuffer[image]) {
              loadList.add(image);
              buffMax -= 1;
            }
          }
        }
        if (buffMax > 1) {
          var distance = Number(Number(this.state.dst).toFixed(1));
          this.state.lastUpdate = Date.now();
          var step = 0;
          var maxDist = 0;
          if (this.state.orth == 0) {
            step = this.state.voxelZ * this.state.scl;
          } else if (this.state.orth == 1) {
            step = this.state.voxelY * this.state.scl;
          } else if (this.state.orth == 2) {
            step = this.state.voxelX * this.state.scl;
          }
          step = Number(Number(step).toFixed(1));
          if (this.state.numTiles < 10) {
            for (maxDist = distance + step; maxDist < max; maxDist += step) {
              for (i in this.state.stack) {
                for (j in this.state.visibleTiles) {
                  image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[i] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=' + Number(this.state.scl).toFixed(1) + '&dst=' + Number(maxDist).toFixed(1) + '&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0) + '&qlt=80&jtl=' + this.state.visibleTiles[j].toString();
                  if (!this.state.iBuffer[image]) {
                    loadList.add(image);
                    buffMax -= 1;
                  }
                }
              }
              if (buffMax < 1000) {
                break;
              }
            }
            for (maxDist = distance - step; maxDist > min; maxDist -= step) {
              for (i in this.state.stack) {
                for (j in this.state.visibleTiles) {
                  image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[i] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=' + Number(this.state.scl).toFixed(1) + '&dst=' + Number(maxDist).toFixed(1) + '&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0) + '&qlt=80&jtl=' + this.state.visibleTiles[j].toString();
                  if (!this.state.iBuffer[image]) {
                    loadList.add(image);
                    buffMax -= 1;
                  }
                }
              }
              if (buffMax < 1) {
                break;
              }
            }
          } else {
            //console.log('Buffering neighbouring layers (' + this.state.numTiles.toString() + ') tiles...');
            for (j = 0; j < this.state.numTiles; j++) {
              for (i in this.state.stack) {
                image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[i] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=' + Number(this.state.scl).toFixed(1) + '&dst=' + Number(this.state.dst).toFixed(1) + '&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0) + '&qlt=80&jtl=' + j.toString();
                if (!this.state.iBuffer[image]) {
                  // console.log('buffering ' + this.state.stack[i].toString() + '...');
                  loadList.add(image);
                  buffMax -= 1;
                }
                if (buffMax < 1) {
                  break;
                }
              }
              if (buffMax < 1) {
                break;
              }
            }
          }
        }

        if (loadList.size > 0) {
          this.state.bufferRunning = true;
          // console.log('Loading ' + loadList.size + ' slices/tiles...');

          const imageDelivery = {
            extension: ExtensionType.LoadParser,
            name : "customParser",
            test: (url) => url.startsWith('http://www.virtualflybrain.org/fcgi/wlziipsrv.fcgi'),
            async load(value) {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                  let im = Texture.from(img);
                  resolve(im)
                };
                img.onerror = reject;
                img.src = value;
              });
            }
          }
          extensions.add(imageDelivery);

          let list = Array.from(loadList);
          let images = list.map( async (value) => {
            let im = await Assets.load({ src : value, loadParser : 'customParser' })
            return im;
          })
          let results = await Promise.allSettled(images);
          results = results.map( result => result.value );

          this.setup(results);

        } else {
          this.state.bufferRunning = false;
          this.state.lastUpdate = Date.now();
        }
      }
    },

    checkStack: function () {
      if (!this._isMounted) {
        // check that component is still mounted
        return;
      }

      if (this.state.stack.length < 1) {
        this.clearVisualState('empty stack');
      }

      if (this.state.txtUpdated < Date.now() - this.state.txtStay) {
        this.state.buffer[-1].text = '';
      }

      if (Object.keys(this.state.images).length > (this.state.stack.length * this.state.visibleTiles.length)) {
        for (var i = 0; i < Object.keys(this.state.images).length; i++) {
          var id = Object.keys(this.state.images)[i].split(",")[0];
          if (id > (this.state.stack.length - 1)) {
            delete this.state.images[Object.keys(this.state.images)[i]];
            try {
              this.stack.removeChildAt(i);
            // eslint-disable-next-line no-unused-vars
            } catch (ignore) {
              // ignore if it doesn't exist
            }
          }
        }
      }
      // console.log('Updating scene...');
      this.createImages();

      if (this.disp.width > 1) {
        this.disp.position.x = ((this.props.width / 2) - ((((this.state.imageX / 10.0) * this.state.scl) * this.disp.scale.x) / 2));
        this.disp.position.y = ((this.props.height / 2) - ((((this.state.imageY / 10.0) * this.state.scl) * this.disp.scale.y) / 2));
      }

    },

    generateColor: function () {
      var i;
      for (i in this.state.stack) {
        if (this.state.stack[i] && this.state.stack[i].trim() !== '' && !this.state.color[i]) {
          this.state.color = this.state.color.concat(['0xFFFFFF']);
        }
      }
    },

    createImages: async function () {
      if (this.state.stack.length > 0) {
        var i, x, y, w, h, d, offX, offY, t, image, Xpos, Ypos, XboundMax, YboundMax, XboundMin, YboundMin;
        /*
         * move through tiles
         * console.log('Creating slice view...');
         */
        this.state.visibleTiles = [];
        w = Math.ceil(((this.state.imageX / 10.0) * this.state.scl) / this.state.tileX);
        h = Math.ceil(((this.state.imageY / 10.0) * this.state.scl) / this.state.tileY);
        // console.log('Tile grid is ' + w.toString() + ' wide by ' + h.toString() + ' high');
        this.state.numTiles = w * h;

        for (t = 0; t < w * h; t++) {
          x = 0;
          y = 0;
          offY = 0;
          if ((t + 1) > w) {
            offY = Math.floor(t / w);
          }
          offX = (t - (offY * w));
          x += offX * this.state.tileX;
          y += offY * this.state.tileY;
          // console.log('Tiling: ' + [t,offX,offY,x,y,w,h]);
          Xpos = (this.stack.parent.position.x / (this.disp.scale.x)) + this.stack.position.x;
          XboundMin = Xpos - (2 * (this.state.tileX * this.state.scl));
          XboundMax = (this.props.width / (this.disp.scale.x)) + Xpos + (2 * (this.state.tileX * this.state.scl));
          Ypos = (this.stack.parent.position.y / (this.disp.scale.y)) + this.stack.position.y;
          YboundMin = Ypos - (2 * (this.state.tileY * this.state.scl));
          YboundMax = (this.app.view.height / (this.disp.scale.y)) + Ypos + (2 * (this.state.tileY * this.state.scl));
          if ((w * h < 3) || ((x + this.state.tileX) > XboundMin && x < XboundMax && (y + this.state.tileY) > YboundMin && y < YboundMax)) {
            this.state.visibleTiles.push(t);
            for (i in this.state.stack) {
              d = i.toString() + ',' + t.toString();
              image = this.state.serverUrl.toString() + '?wlz=' + this.state.stack[i] + '&sel=0,255,255,255&mod=zeta&fxp=' + this.props.fxp.join(',') + '&scl=' + Number(this.state.scl).toFixed(1) + '&dst=' + Number(this.state.dst).toFixed(1) + '&pit=' + Number(this.state.pit).toFixed(0) + '&yaw=' + Number(this.state.yaw).toFixed(0) + '&rol=' + Number(this.state.rol).toFixed(0) + '&qlt=80&jtl=' + t.toString();
              if (!this.state.images[d]) {
                // console.log('Adding ' + this.state.stack[i].toString());
                if (this.state.iBuffer[image]) {
                  this.state.images[d] = Sprite.from(this.state.iBuffer[image]);
                  this.state.imagesUrl[d] = image;
                } else {
                  this.state.images[d] = Sprite.from(image);
                  this.state.iBuffer[image] = this.state.images[d].texture;
                  this.state.imagesUrl[d] = image;
                }
                this.state.images[d].anchor.x = 0;
                this.state.images[d].anchor.y = 0;
                this.state.images[d].position.x = x;
                this.state.images[d].position.y = y;
                this.state.images[d].zOrder = i;
                this.state.images[d].visible = true;
                if (!this.state.color[i]) {
                  this.generateColor();
                }
                this.state.images[d].tint = this.state.color[i];
                if (i > 0) {
                  // this.state.images[d].alpha = 0.9;
                  this.state.images[d].blendMode = BLEND_MODES.SCREEN;
                }
                // console.log("adding image ", this.state.images[d])
                this.stack.addChild(this.state.images[d]);
              } else {
                if (this.state.imagesUrl[d] != image) {
                  if (this.state.iBuffer[image]) {
                    this.state.images[d].texture = this.state.iBuffer[image];
                    this.state.imagesUrl[d] = image;
                  } else {
                    if (this.state.txtUpdated < Date.now() - this.state.txtStay) {
                      this.state.buffer[-1].text = 'Loading slice ' + Number(this.state.dst - ((this.state.minDst / 10.0) * this.state.scl)).toFixed(1) + '...';
                    }
                    this.state.images[d].texture =  Texture.from(image);
                    this.state.iBuffer[image] = this.state.images[d].texture;
                    this.state.imagesUrl[d] = image;
                  }
                  this.state.images[d].anchor.x = 0;
                  this.state.images[d].anchor.y = 0;
                  this.state.images[d].position.x = x;
                  this.state.images[d].position.y = y;
                  this.state.images[d].zOrder = i;
                  this.state.images[d].visible = true;
                  if (i > 0) {
                    // this.state.images[d].alpha = 0.9;
                    this.state.images[d].blendMode = BLEND_MODES.SCREEN;
                  }
                }
                if (!this.state.color[i]) {
                  this.generateColor();
                }
                if (this.state.images[d].tint != this.state.color[i]) {
                  this.state.images[d].tint = this.state.color[i];
                }
              }
            }
          } else {
            for (i in this.state.stack) {
              d = i.toString() + ',' + t.toString();
              if (this.state.images[d] && this.state.images[d].visible) {
                // console.log('Hiding tile ' + d);
                this.state.images[d].visible = false;
                // console.log([x,y,w,h,XboundMin,XboundMax,YboundMin,YboundMax,Xpos,Ypos]);
              }
            }
            // console.log('Tile ' + [offX,offY] + ' off screen.');
          }
        }
      }
    },

    createStatusText: function () {
      if (!this.state.buffer[-1]) {
        const style = {
          fontSize: 16,
          fill: '#ffffff',
          stroke: '#1a1a1a',
          strokeThickness: 2,
          dropShadow: true,
          dropShadowColor: '#1a1a1a',
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 2,
          wordWrap: true,
          wordWrapWidth: this.app.view.width,
          textAlign: 'right'
        };
        const textStyle = new TextStyle(style);
        this.state.buffer[-1] = new Text(this.state.text, textStyle);
        this.app.stage.addChild(this.state.buffer[-1]);
        // fix position to always be at top-left corner
        this.state.buffer[-1].x = 30;
        this.state.buffer[-1].y = 6;
        this.state.buffer[-1].anchor.x = 0;
        this.state.buffer[-1].anchor.y = 0;
        this.state.buffer[-1].zOrder = 1000;
      } else {
        this.state.buffer[-1].text = this.state.text;
      }
    },

    /**
     * Helper function to clear all visual state consistently
     */
    // eslint-disable-next-line no-unused-vars
    clearVisualState: function(reason) {
      // Properly dispose of existing sprites and textures to prevent memory leaks
      if (this.stack && this.stack.children) {
        this.stack.children.forEach(child => {
          // Don't destroy the status text buffer or hover text buffer
          if (child !== this.state.buffer[-1] && child !== this.state.hoverTextBuffer) {
            if (child.texture) {
              child.texture.destroy(true);
            }
            if (child.destroy) {
              child.destroy();
            }
          }
        });
      }
      
      // Clear arrays and objects
      this.state.images = [];
      this.state.visibleTiles = [];
      this.state.iBuffer = {};
      this.state.imagesUrl = {};
      
      // Remove all children from stack container (status text should stay on stage)
      if (this.stack) {
        this.stack.removeChildren();
      }
      
      // Ensure status text remains at fixed position on the stage
      if (this.state.buffer[-1]) {
        // Make sure it's on the stage, not the stack
        if (this.state.buffer[-1].parent !== this.app.stage) {
          this.app.stage.addChild(this.state.buffer[-1]);
        }
        this.state.buffer[-1].x = 30;
        this.state.buffer[-1].y = 6;
      }
    },

    /**
     * When we get new props, run the appropriate imperative functions
     *
     */
    UNSAFE_componentWillReceiveProps: function (nextProps) {
      var updDst = false;
      if (nextProps.dst !== this.state.dst) {
        this.state.dst = nextProps.dst;
        this.setStatusText(nextProps.statusText);
        this.createImages();
        return true;
      }

      // Clear stack when instances are significantly reduced (like Clear All)
      // Only trigger on substantial reductions (more than 1 instance removed) to avoid
      // triggering on normal updates/renders
      if (this.props.data && this.props.data.instances && nextProps.data && nextProps.data.instances) {
        const currentLength = this.props.data.instances.length;
        const nextLength = nextProps.data.instances.length;
        const reduction = currentLength - nextLength;

        // Only clear visual state for significant reductions (2+ instances removed)
        // This prevents clearing on normal re-renders but catches Clear All operations
        if (reduction >= 2) {
          this.clearVisualState('instances significantly reduced');
          this._instancesWereReduced = true;
        }
      }

      if (nextProps.stack !== this.state.stack || nextProps.color !== this.state.color || this.state.serverUrl !== nextProps.serverUrl.replace('http:', window.location.protocol).replace('https:', window.location.protocol) || this.state.id !== nextProps.id) {
        // Reset the flag when stack actually updates
        if (this._instancesWereReduced) {
          this._instancesWereReduced = false;
        }
        this.setState({
          stack: nextProps.stack,
          color: nextProps.color,
          label: nextProps.label,
          id: nextProps.id,
          serverUrl: nextProps.serverUrl.replace('http:', window.location.protocol).replace('https:', window.location.protocol)
        });
        this.checkStack();
      }
      if (nextProps.width !== this.props.width || nextProps.height !== this.props.height || nextProps.stackX !== this.stack.position.x || nextProps.stackY !== this.stack.position.y){
        // Only update position if it's different from current stack position
        if (nextProps.stackX !== this.stack.position.x || nextProps.stackY !== this.stack.position.y) {
          this.stack.position.x = nextProps.stackX;
          this.stack.position.y = nextProps.stackY;
        }

        this.bufferStack();
        updDst = true;
      }

      // Handle scale and zoom changes from user interactions, explicit zoom commands, or initial setup
      // Accept changes when: zoomLevel changes (user zoom), during initial setup (!this._initialized), or user-initiated flag is set
      if ((nextProps.scl !== this.state.scl || nextProps.zoomLevel !== this.props.zoomLevel) &&
          (nextProps.zoomLevel !== this.props.zoomLevel || !this._initialized)) {
        this.state.scl = nextProps.scl;
        this.setState({ scl: nextProps.scl });
        this.updateZoomLevel(nextProps);
        updDst = true;
      } else if (nextProps.scl !== this.state.scl) {
        // Ignoring scale-only change - preserving user zoom level
      }
      if (nextProps.fxp[0] !== this.props.fxp[0] || nextProps.fxp[1] !== this.props.fxp[1] || nextProps.fxp[2] !== this.props.fxp[2]) {
        this.state.dst = nextProps.dst;
        this.setState({ dst: nextProps.dst });
        this.bufferStack();
        updDst = true;
      }
      if (nextProps.statusText !== this.props.statusText && nextProps.statusText.trim() !== '') {
        this.updateStatusText(nextProps);
      }

      if (nextProps.orth !== this.state.orth || nextProps.pit !== this.state.pit || nextProps.yaw !== this.state.yaw || nextProps.rol !== this.state.rol) {
        if (nextProps.orth !== this.state.orth) {
          this.state.recenter = true;
        }
        this.changeOrth(nextProps);
        this.bufferStack();
        updDst = true;
      }
      if (updDst) {
        this.checkStack();
        this.callPlaneEdges();
      }
    },
    /**
     * Update the stage "zoom" level by setting the scale
     *
     */
    updateZoomLevel: function (props) {
      var scale = props.zoomLevel / props.scl;
      this.disp.scale.x = scale;
      this.disp.scale.y = scale;
      // update slice view
      this.checkStack();
      // recenter display for new image size keeping any stack offset.
      this.disp.position.x = Math.ceil((props.width / 2) - (((this.state.imageX / 10.0) * props.zoomLevel) / 2));
      this.disp.position.y = Math.ceil((props.height / 2) - (((this.state.imageY / 10.0) * props.zoomLevel) / 2));
    },

    /**
     * Update the display text
     *
     */
    updateStatusText: function (props) {
      this.setStatusText(props.statusText);
    },

    changeOrth: function (props) {
      // Ensure we have valid orientation values
      if (typeof props.orth !== 'number' || props.orth < 0 || props.orth > 2) {
        console.warn('Invalid orth value:', props.orth, 'resetting to 0');
        props.orth = 0;
      }
      
      // console.log('Orth: ' + props.orth);
      this.state.orth = props.orth;
      this.state.pit = props.pit;
      this.state.yaw = props.yaw;
      this.state.rol = props.rol;
      
      // forcing the state change before size calls as setstate take time.
      this.setState({
        pit: props.pit,
        yaw: props.yaw,
        rol: props.rol,
        orth: props.orth
      });
      
      this.clearVisualState('orientation change');
      
      // Set appropriate status text based on orientation
      if (props.orth == 0) {
        // console.log('Frontal');
        this.setStatusText('Frontal');
      } else if (props.orth == 1) {
        // console.log('Transverse');
        this.setStatusText('Transverse');
      } else if (props.orth == 2) {
        // console.log('Sagittal');
        this.setStatusText('Sagittal');
      } else {
        // console.log('Orth:' + props.orth);
        this.setStatusText('...');
      }
      
      // Call metadata and size update methods
      this.callDstRange();
      this.callImageSize();
    },

    setStatusText: function (text) {
      // Ensure status text buffer exists
      if (!this.state.buffer[-1]) {
        this.createStatusText();
      }
      
      // Make sure the status text is always on the stage (not the stack)
      if (this.state.buffer[-1].parent !== this.app.stage) {
        this.app.stage.addChild(this.state.buffer[-1]);
      }
      
      // Always ensure status text is positioned at the fixed location
      this.state.buffer[-1].x = 30;
      this.state.buffer[-1].y = 6;
      this.state.buffer[-1].text = text;
      this.state.text = text;
      this.state.txtUpdated = Date.now();
    },

    setHoverText: function (x,y,text) {
      // Create or update a separate hover text element
      if (!this.state.hoverTextBuffer) {
        const style = {
          fontSize: 14,
          fill: '#ffffff',
          stroke: '#1a1a1a',
          strokeThickness: 2,
          dropShadow: true,
          dropShadowColor: '#1a1a1a',
          dropShadowAngle: Math.PI / 6,
          dropShadowDistance: 2,
          wordWrap: true,
          wordWrapWidth: 200,
          textAlign: 'left'
        };
        const textStyle = new TextStyle(style);
        this.state.hoverTextBuffer = new Text(text, textStyle);
        this.app.stage.addChild(this.state.hoverTextBuffer);
        this.state.hoverTextBuffer.anchor.x = 0;
        this.state.hoverTextBuffer.anchor.y = 0;
        this.state.hoverTextBuffer.zOrder = 1001; // Higher than status text
      }
      
      // Position the hover text at the specified coordinates
      this.state.hoverTextBuffer.x = this.disp.position.x + (this.stack.position.x * this.disp.scale.x) + (Number(x) * this.disp.scale.x) - 10;
      this.state.hoverTextBuffer.y = this.disp.position.y + (this.stack.position.y * this.disp.scale.y) + (Number(y) * this.disp.scale.y) + 15;
      this.state.hoverTextBuffer.text = text;
      this.state.hoverTextBuffer.visible = true;
    },

    clearHoverText: function () {
      if (this.state.hoverTextBuffer) {
        this.state.hoverTextBuffer.visible = false;
      }
    },

    /**
     * Animation loop for updating Pixi Canvas
     *
     */
    animate: function () {
      if (this._isMounted) {
        // render the stage container (if the component is still mounted)
        this.app.renderer.render(this.disp);
      }
    },

    // eslint-disable-next-line no-unused-vars
    onDragStart: function (event) {
      /*
       * store a reference to the data
       * the reason for this is because of multitouch
       * we want to track the movement of this particular touch
       */
      this.stack.alpha = 0.7;
      this.state.dragging = true;
      var offPosition = this.state.data?.global;
      if ( offPosition ) {
        this.state.dragOffset = {
          x: offPosition.x,
          y: offPosition.y
        };
        // console.log('DragStartOffset:'+JSON.stringify(this.state.dragOffset));
        var startPosition = this.state.data?.getLocalPosition(this.stack);
        // console.log([startPosition.x,this.state.imageX*0.5,1/this.disp.scale.x]);
        this.state.posX = Number(startPosition?.x?.toFixed(0));
        this.state.posY = Number(startPosition?.y?.toFixed(0));
        // console.log('DragStart:'+JSON.stringify(startPosition));
      }
    },

    onDragEnd: function () {
      if (this.state.data !== null && typeof this.state.data.getLocalPosition === "function") {
        this.stack.alpha = 1;
        var startPosition = this.state.data.getLocalPosition(this.stack);
        var newPosX = Number(startPosition.x.toFixed(0));
        var newPosY = Number(startPosition.y.toFixed(0));
        // console.log('DragEnd:'+JSON.stringify(startPosition));
        if (newPosX == this.state.posX && newPosY == this.state.posY) {
          this.callObjects();
          this.state.oldX = newPosX;
          this.state.oldY = newPosY;
          this.state.hoverTime = Date.now();
        }
        // set the interaction data to null
        this.state.data = null;
        this.props.setExtent({ stackX: this.stack.position.x, stackY: this.stack.position.y });
        this.createImages();
        this.state.buffer[-1].text = '';
      }
      this.state.dragging = false;
    },

    onStackClick: function (event) {
      // Backup click handler for when drag doesn't register as a click
      if (!this.state.dragging) {
        var clickPosition;
        if (event.data && typeof event.data.getLocalPosition === "function") {
          clickPosition = event.data.getLocalPosition(this.stack);
          this.state.posX = Number(clickPosition.x.toFixed(0));
          this.state.posY = Number(clickPosition.y.toFixed(0));
          this.callObjects();
        } else if (this.state.data && typeof this.state.data.getLocalPosition === "function") {
          clickPosition = this.state.data.getLocalPosition(this.stack);
          this.state.posX = Number(clickPosition.x.toFixed(0));
          this.state.posY = Number(clickPosition.y.toFixed(0));
          this.callObjects();
        }
      }
    },

    onHoverEvent: function (event) {
      this.state.data = event.data;
      if (this.state.data !== null && typeof this.state.data.getLocalPosition === "function" && !this.state.loadingLabels && !this.state.dragging) {
        if (this.app === null ) {
          return;
        }
        var currentPosition = this.state.data.getLocalPosition(this.stack);
        // update new position:
        this.state.posX = Number(currentPosition?.x?.toFixed(0));
        this.state.posY = Number(currentPosition?.y?.toFixed(0));
        if (!(this.state.posX == this.state.oldX && this.state.posY == this.state.oldY)) {
          this.listObjects();
          this.state.hoverTime = Date.now();
        }
        if (this.state.hoverTime < (Date.now() - 1000) && this.state.posX == this.state.oldX && this.state.posY == this.state.oldY) {
          this.state.hoverTime = Date.now() + 30000;
          this.listObjects();
        }
        this.state.oldX = Number(currentPosition?.x?.toFixed(0));
        this.state.oldY = Number(currentPosition?.y?.toFixed(0));
      }
    },

    onDragMove: function (event) {
      if (this.state.dragging && this.state.data?.global) {
        var newPosition = this.state.data?.global;
        var xmove = (newPosition?.x - this.state?.dragOffset?.x) / this.disp.scale?.x;
        var ymove = (newPosition?.y - this.state?.dragOffset?.y) / this.disp.scale?.y;
        this.state.dragOffset.x = newPosition?.x;
        this.state.dragOffset.y = newPosition?.y;
        this.stack.position.x += xmove;
        this.stack.position.y += ymove;
        // console.log('Moving :'+xmove+','+ymove);
        this.state.buffer[-1].text = 'Moving stack... (X:' + Number(this.stack.position?.x).toFixed(2) + ',Y:' + Number(this.stack.position?.y).toFixed(2) + ')';
        // update slice view
        this.createImages();
      } else {
        this.onHoverEvent(event);
      }
    },

    /**
     * Render our container that will store our PixiJS game canvas. Store the ref
     *
     */
    render: function () {
      return (
        < div className="stack-canvas-container" ref="stackCanvas"> </div>
      );
    },

    toggleMenu: function() {
      this.setState(prevState => ({
        isMenuOpen: !prevState.isMenuOpen
      }));
    }
  });

  var prefix = "", _addEventListener, support;

const StackViewerComponent = () => createClass({
    _isMounted: false,

    getInitialState: function () {
      return {
        zoomLevel: 1.0,
        dst: 0,
        text: '',
        stackX: 0,
        stackY: 0,
        imageX: 1024,
        imageY: 1024,
        fxp: [511, 255, 108],
        pit: 0,
        yaw: 0,
        rol: 0,
        scl: 1.0,
        voxelX: (this.props.voxel.x || 0.622088),
        voxelY: (this.props.voxel.y || 0.622088),
        voxelZ: (this.props.voxel.z || 0.622088),
        minDst: -100,
        maxDst: 100,
        orth: 0,
        color: [],
        stack: [],
        label: [],
        id: [],
        tempId: [],
        tempName: [],
        tempType: [],
        plane: null,
        initalised: false,
        slice: false,
        lastUpdate: 0,
        scrollTrack: 0,
        loadChanges: true,
        width: this.props.width,
        height: this.props.height,
        isMenuOpen: false
      };
    },

    toggleMenu: function() {
      this.setState(prevState => ({
        isMenuOpen: !prevState.isMenuOpen
      }));
    },

    onWheelEvent: function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var newdst = Number(Number(this.state.dst).toFixed(1));
      if (e.ctrlKey && e.wheelDelta > 0) {
        this.onZoomIn();
      } else if (e.ctrlKey && e.wheelDelta < 0) {
        this.onZoomOut();
      } else {
        // Mac keypad returns values (+/-)1-20 Mouse wheel (+/-)120
        this.state.scrollTrack += e.deltaY * 0.04;

        if (this.state.scrollTrack > 0.9 || this.state.scrollTrack < -0.9){
          var step = 0;
          if (this.state.scrollTrack > 1) {
            step = Math.ceil(this.state.scrollTrack) - 1;
          } else {
            step = Math.floor(this.state.scrollTrack) + 1;
          }
          this.state.scrollTrack = 0;
          var stepDepth = 1;
          // Max step of imposed
          if (this.state.orth == 0) {
            stepDepth = this.state.voxelZ * this.state.scl;
          } else if (this.state.orth == 1) {
            stepDepth = this.state.voxelY * this.state.scl;
          } else if (this.state.orth == 2) {
            stepDepth = this.state.voxelX * this.state.scl;
          }
          if (e.shiftKey) {
            stepDepth = stepDepth * 10;
          }
          stepDepth = Number(Number(stepDepth).toFixed(1))

          newdst += Number((stepDepth * step).toFixed(1));
          if (newdst < ((this.state.maxDst / 10.0) * this.state.scl) && newdst > ((this.state.minDst / 10.0) * this.state.scl)) {
            this.setState({ dst: newdst, text: 'Depth:' + ((newdst / this.state.scl) - (this.state.minDst / 10.0)).toFixed(1) });
          } else if (newdst < ((this.state.maxDst / 10.0) * this.state.scl)) {
            newdst = ((this.state.minDst / 10.0) * this.state.scl);
            this.setState({ dst: newdst, text: 'First slice!' });
          } else if (newdst > ((this.state.minDst / 10.0) * this.state.scl)) {
            newdst = ((this.state.maxDst / 10.0) * this.state.scl);
            this.setState({ dst: newdst, text: 'Last slice!' });
          }

        }

      }
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      if (shallowCompare(this, nextProps, nextState)) {
        return true;
      }
      if (this.props !== undefined && this.props.data !== undefined && this.props.data.instances !== undefined && nextProps.data !== undefined && nextProps.data.instances !== undefined) {
        var a = nextProps.data.instances;
        var b = this.props.data.instances;
        if (a.length == b.length) {
          for (var i = 0; i < a.length; i++) {
            try {
              // FIXME : Update parent instance to VisualElement
              // if (a[i].parent.getColor() != b[i].parent.getColor()) {
              //   return true;
              // }
              // if (a[i].parent.isVisible() != b[i].parent.isVisible()) {
              //   return true;
              // }
            } catch (ignore) { console.log("Error ", ignore)}
          }
          return false;
        }
        return true;
      }
      return false;

      /**
       * Performs equality by iterating through keys on an object and returning false
       * when any key has values which are not strictly equal between the arguments.
       * Returns true when the values of all keys are strictly equal.
       */
      function shallowEqual (objA, objB) {
        if (objA === objB) {
          return true;
        }

        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
          return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
          return false;
        }

        // Test for A's keys different from B.
        var bHasOwnProperty = hasOwnProperty.bind(objB);
        for (var i = 0; i < keysA.length; i++) {
          if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
          }
        }

        return true;
      }

      function shallowCompare (instance, nextProps, nextState) {
        return (
          !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState)
        );
      }
    },

    componentDidMount: function () {
      this._isMounted = true;

      // detect event model
      if (window.addEventListener) {
        this._addEventListener = "addEventListener";
      } else {
        this._addEventListener = "attachEvent";
        prefix = "on";
      }

      // detect available wheel event
      support = "onwheel" in document.createElement("div") ? "wheel" // Modern browsers support "wheel"
        : document.onmousewheel !== undefined ? "mousewheel" // Webkit and IE support at least "mousewheel"
          : "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox
      this?.addWheelListener(document.getElementById(this.props.data.id + 'displayArea'), (e) => {
        this.onWheelEvent(e);
      });

      if (this.props.data && this.props.data != null && this.props.data.instances && this.props.data.instances != null) {
        this.setState(this.handleInstances(this.props.data.instances));
      }

      const container = document.getElementById('slice-viewer');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        this.onResize(width, height);
      }

      setTimeout(this.onHome, 5000);

    },

    componentDidUpdate: function (prevProps) {
      if (prevProps.data != undefined && prevProps.data != null && prevProps.data.instances != undefined) {
        this.setState(this.handleInstances(this.props.data.instances));
      }
    },

    handleInstances: function (instances) {
      var newState = {...this.state};
      if (instances && instances != null && instances.length > 0) {
        var instance;
        var data;
        var files = [];
        var colors = [];
        var labels = [];
        var ids = [];
        var server = this.props.config.serverUrl.replace('http:', window.location.protocol).replace('https:', window.location.protocol);
        if (!this.state.height && this.props.data.height != null) {
          newState.height = this.props.data.height;
        }
        if (!this.state.width && this.props.data.width != null) {
          newState.width = this.props.data.width;
        }

        if (this.props.config && this.props.config != null && this.props.config.subDomains && this.props.config.subDomains != null && this.props.config.subDomains.length && this.props.config.subDomains.length > 0 && this.props.config.subDomains[0] && this.props.config.subDomains[0].length && this.props.config.subDomains[0].length > 2) {
          newState.voxelX = Number(this.props.config.subDomains[0][0] || 0.622088);
          newState.voxelY = Number(this.props.config.subDomains[0][1] || 0.622088);
          newState.voxelZ = Number(this.props.config.subDomains[0][2] || 0.622088);
        }
        if (this.props.config && this.props.config != null) {
          if (this.props.config.subDomains && this.props.config.subDomains != null && this.props.config.subDomains.length) {
            if (this.props.config.subDomains.length > 0 && this.props.config.subDomains[0] && this.props.config.subDomains[0].length && this.props.config.subDomains[0].length > 2) {
              newState.voxelX = Number(this.props.config.subDomains[0][0] || 0.622088);
              newState.voxelY = Number(this.props.config.subDomains[0][1] || 0.622088);
              newState.voxelZ = Number(this.props.config.subDomains[0][2] || 0.622088);
            }
            if (this.props.config.subDomains.length > 3 && this.props.config.subDomains[1] != null) {
              newState.tempName = this.props.config.subDomains[2];
              newState.tempId = this.props.config.subDomains[1];
              newState.tempType = this.props.config.subDomains[3];
              // FIXME : Add extra subdomain to match previous configuration
              // if (this.props.config.subDomains[4] && this.props.config.subDomains[4].length && this.props.config.subDomains[4].length > 0) {
              //   newState.fxp = JSON.parse(this.props.config.subDomains[4][0]);
              // }
            }
          }
        }
        for (instance in instances) {
          try {
            if ((instances[instance].wrappedObj.id != undefined) && (instances[instance].parent != null) ){
              data = instances[instance].wrappedObj.visualValue.data;
              files.push(data);
              // Take multiple ID's for template
              if (typeof this.props.config.templateId !== 'undefined' && typeof this.props.config.templateDomainIds !== 'undefined' && instances[instance].parent.getId() == this.props.config.templateId) {
                ids.push(this.props.config.templateDomainIds);
              } else {
                ids.push([instances[instance].getId()]);
              }
              labels.push(instances[instance].getName());
              colors.push(rgbToHex(instances[instance].wrappedObj.color))
            }
          } catch (err) {
            console.log('Error handling ' + instance);
            console.log(err.message);
            console.log(err.stack);
          }
        }

        if (server != this.props.config.serverUrl.replace('http:', window.location.protocol).replace('https:', window.location.protocol) && server != null) {
          newState.serverURL = server;
        }
        if (files && files != null && files.length > 0 && files.toString() != this.state.stack.toString()) {
          newState.stack = files;
        }
        if (labels && labels != null && labels.length > 0 && labels.toString() != this.state.label.toString()) {
          newState.label = labels;
        }
        if (ids && ids != null && ids.length > 0 && ids.toString() != this.state.id.toString()) {
          newState.id = ids;
        }
        if (colors && colors != null && colors.length > 0 && colors.toString() != this.state.color.toString()) {
          newState.color = colors;
        }
      }
      return newState;
    },

    componentWillUnmount: function () {
      this._isMounted = false;
      return true;
    },
    /**
     * Event handler for clicking zoom in. Increments the zoom level
     *
     */
    onResize: function (width, height) {
      const autoScale = Number(Math.min(
        height / (this.state.imageY / 10.0),
        width / (this.state.imageX / 10.0)
      ).toFixed(1));

      const scale = Math.ceil(autoScale);

      this.setState({
        width,
        height,
        zoomLevel: autoScale,
        scl: scale,
        text: 'Auto Zoom on Resize',
        dst: 0,
        stackX: 0,
        stackY: 0
      });

      this._resizedManually = true;
    },



    onZoomIn: function () {
      var zoomLevel = this.state.zoomLevel;
      var scale = this.state.scl;
      var text = "";
      var newDst = Number(this.state.dst);
      var stackX = this.state.stackX;
      var stackY = this.state.stackY;
      if (window.shiftDown) {
        zoomLevel = Number((this.state.zoomLevel += 1).toFixed(1));
      } else {
        zoomLevel = Number((this.state.zoomLevel += 0.1).toFixed(1));
      }
      if (zoomLevel < 10.0) {
        scale = Number(Math.ceil(zoomLevel).toFixed(1));
        text = 'Zooming in to (X' + Number(zoomLevel).toFixed(1) + ')';
      } else {
        zoomLevel = 10;
        scale = 10;
        text = 'Max zoom! (X10)';
      }
      if (Number(this.state.scl) < scale) {
        var baseDst = this.state.dst / this.state.scl;
        newDst = Number((baseDst * scale).toFixed(1));
        stackX = Math.ceil((this.state.stackX / (this.state.imageX / 10.0 * this.state.scl)) * (this.state.imageX / 10.0 * scale));
        stackY = Math.ceil((this.state.stackY / (this.state.imageY / 10.0 * this.state.scl)) * (this.state.imageY / 10.0 * scale));
      }
      this.setState({
        zoomLevel: zoomLevel,
        scl: scale,
        text: text,
        dst: newDst,
        stackX: stackX,
        stackY: stackY
      });
    },

    toggleOrth: function () {
      var orth = this.state.orth + 1;
      var pit, yaw, rol;
      
      if (orth > 2) {
        orth = 0;
      }
      
      if (orth == 0) {
        pit = 0;
        yaw = 0;
        rol = 0;
      } else if (orth == 1) {
        pit = 90;
        yaw = 90;
        rol = 270;
      } else if (orth == 2) {
        pit = 90;
        yaw = 0;
        rol = 0;
      }
      
      this.setState({ 
        orth: orth, 
        pit: pit, 
        yaw: yaw, 
        rol: rol, 
        dst: 0, 
        stackX: 0, 
        stackY: 0 
      });
      
      // Delay the home action to allow the orientation change to complete
      setTimeout(this.onHome, 1000);
    },

    toggleSlice: function () {
      if (this.state.slice) {
        this.setState({ slice: false });
      } else {
        this.setState({ slice: true });
      }
    },

    /**
     * Event handler for clicking zoom out. Decrements the zoom level
     *
     */
    onZoomOut: function () {
      var zoomLevel = this.state.zoomLevel;
      var scale = this.state.scl;
      var text = "";
      var newDst = Number(this.state.dst);
      var stackX = this.state.stackX;
      var stackY = this.state.stackY;
      if (window.shiftDown) {
        zoomLevel = Number((this.state.zoomLevel -= 1).toFixed(1));
      } else {
        zoomLevel = Number((this.state.zoomLevel -= 0.1).toFixed(1));
      }
      if (zoomLevel > 0.1) {
        scale = Number(Math.ceil(zoomLevel).toFixed(1));
        text = 'Zooming out to (X' + Number(zoomLevel).toFixed(1) + ')';
      } else {
        zoomLevel = 0.1;
        scale = 1.0;
        text = 'Min zoom! (X0.1)';
      }
      if (Number(this.state.scl) > scale) {
        var baseDst = this.state.dst / this.state.scl;
        newDst = Number((baseDst * scale).toFixed(1));
        stackX = Math.ceil((this.state.stackX / (this.state.imageX / 10.0 * this.state.scl)) * (this.state.imageX / 10.0 * scale));
        stackY = Math.ceil((this.state.stackY / (this.state.imageY / 10.0 * this.state.scl)) * (this.state.imageY / 10.0 * scale));
      }
      this.setState({
        zoomLevel: zoomLevel,
        scl: scale,
        text: text,
        dst: newDst,
        stackX: stackX,
        stackY: stackY
      });
    },

    /**
     * Event handler for clicking step in. Increments the dst level - TODO Remove
     *
     */
    onStepIn: function () {
      var newdst = this.state.dst
      if (window.shiftDown) {
        newdst += (this.state.voxelZ * this.state.scl) * 10;
      } else {
        newdst += (this.state.voxelZ * this.state.scl);
      }
      if (newdst < ((this.state.maxDst / 10.0) * this.state.scl) && newdst > ((this.state.minDst / 10.0) * this.state.scl)) {
        this.setState({ dst: newdst, text: 'Slice:' + (newdst - ((this.state.minDst / 10.0) * this.state.scl)).toFixed(1) });
      } else if (newdst < ((this.state.maxDst / 10.0) * this.state.scl)) {
        newdst = ((this.state.minDst / 10.0) * this.state.scl);
        this.setState({ dst: newdst, text: 'First slice!' });
      } else if (newdst > ((this.state.minDst / 10.0) * this.state.scl)) {
        newdst = ((this.state.maxDst / 10.0) * this.state.scl);
        this.setState({ dst: newdst, text: 'Last slice!' });
      }
    },
    /**
     * Event handler for clicking step out. Decrements the dst level - TODO Remove
     *
     */
    onStepOut: function () {
      var newdst = this.state.dst
      if (window.shiftDown) {
        newdst -= (this.state.voxelZ * this.state.scl) * 10;
      } else {
        newdst -= (this.state.voxelZ * this.state.scl);
      }
      if (newdst < ((this.state.maxDst / 10.0) * this.state.scl) && newdst > ((this.state.minDst / 10.0) * this.state.scl)) {
        this.setState({ dst: newdst, text: 'Slice:' + (newdst - ((this.state.minDst / 10.0) * this.state.scl)).toFixed(1) });
      } else if (newdst < ((this.state.maxDst / 10.0) * this.state.scl)) {
        newdst = ((this.state.minDst / 10.0) * this.state.scl);
        this.setState({ dst: newdst, text: 'First slice!' });
      } else if (newdst > ((this.state.minDst / 10.0) * this.state.scl)) {
        newdst = ((this.state.maxDst / 10.0) * this.state.scl);
        this.setState({ dst: newdst, text: 'Last slice!' });
      }
    },

    /**
     * Event handler for clicking Home.
     *
     */
    onHome: function () {
      const autoScale = Number(Math.min(
        this.state.height / (this.state.imageY / 10.0),
        this.state.width / (this.state.imageX / 10.0)
      ).toFixed(1));
      var scale = Math.ceil(autoScale);
      this.setState({ dst: 0, stackX: 0, stackY: 0, text: 'Stack Centred', zoomLevel: autoScale, scl: scale });
    },

    onExtentChange: function (data) {
      this.setState(data);
      if (!this.state.initalised && JSON.stringify(data).indexOf('imageX') > -1) {
        this.state.initalised = true;
        this.onHome();
      }
    },

    addWheelListener: function (elem, callback, useCapture) {
      this?._addWheelListener(elem, support, callback, useCapture);

      // handle MozMousePixelScroll in older Firefox
      if (support == "DOMMouseScroll") {
        this?._addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
      }
    },

    _addWheelListener: function (elem, eventName, callback, useCapture) {
      elem[this._addEventListener](prefix + eventName, support == "wheel" ? callback : (originalEvent) => {
        !originalEvent && (originalEvent = window.event);

        // create a normalized event object
        var event = {
          // keep a ref to the original event object
          originalEvent: originalEvent,
          target: originalEvent.target || originalEvent.srcElement,
          type: "wheel",
          deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
          deltaX: 0,
          delatZ: 0,
          preventDefault: function () {
            originalEvent.preventDefault
              ? originalEvent.preventDefault()
              : originalEvent.returnValue = false;
          }
        };

        // calculate deltaY (and deltaX) according to the event
        if (support == "mousewheel") {
          event.deltaY = -1 / 40 * originalEvent.wheelDelta;
          // Webkit also support wheelDeltaX
          originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX);
        } else {
          event.deltaY = originalEvent.detail;
        }

        // it's time to fire the callback
        return callback(event);

      }, useCapture || false);
    },

    render: function () {
      var displayArea = this.props.data.id + 'displayArea';
      const isSmallViewport = this.state.width < 300 || this.state.height < 300;

      var markup = '';
      if (this.state.stack.length > 0) {
        markup = (
          <div id={displayArea} style={{ position: 'absolute'}}>
            {isSmallViewport ? (
              <>
                <div style={{
                  position: 'absolute',
                  top: 20,
                  left: 10,
                }}>
                  <button
                    onClick={this.toggleMenu}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      width: '1rem',
                      height: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                    title="Toggle Menu"
                  >
                    {
                      this.state.isMenuOpen ? (
                        <i className="fa fa-times"></i>
                      ) : (
                        <i className="fa fa-bars"></i>
                      )
                    }
                  </button>
                </div>

                {this.state.isMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 13,
                    left: 35,
                    transition: 'all 0.2s ease',
                  }}>
                    <StackViewerButtons
                      onStepOut={this.onStepOut}
                      onHome={this.onHome}
                      onStepIn={this.onStepIn}
                      onZoomIn={this.onZoomIn}
                      onZoomOut={this.onZoomOut}
                      toggleOrth={this.toggleSlice}
                      toggleSlice={this.toggleOrth}
                      isSmallViewport={isSmallViewport}
                    />
                  </div>
                )}
              </>
            ) : (
              <div style={{
                position: 'absolute',
                top: 20,
                left: 10,
              }}>
                <StackViewerButtons
                  onStepOut={this.onStepOut}
                  onHome={this.onHome}
                  onStepIn={this.onStepIn}
                  onZoomIn={this.onZoomIn}
                  onZoomOut={this.onZoomOut}
                  toggleOrth={this.toggleSlice}
                  toggleSlice={this.toggleOrth}
                  isSmallViewport={isSmallViewport}
                />
              </div>
            )}
            <Canvas zoomLevel={this.state.zoomLevel} dst={this.state.dst}
              serverUrl={this.props.config.serverUrl} canvasRef={this.props.canvasRef}
              fxp={this.state.fxp} pit={this.state.pit} yaw={this.state.yaw} rol={this.state.rol}
              stack={this.state.stack} color={this.state.color} setExtent={this.onExtentChange}
              statusText={this.state.text} stackX={this.state.stackX} stackY={this.state.stackY}
              scl={this.state.scl} orth={this.state.orth}
              label={this.state.label} id={this.state.id} height={this.state.height}
              width={this.state.width} voxelX={this.state.voxelX}
              voxelY={this.state.voxelY} voxelZ={this.state.voxelZ} displayArea={displayArea}
              templateId={this.props.config.templateId}
              templateDomainIds={this.state.tempId}
              templateDomainTypeIds={this.state.tempType}
              templateDomainNames={this.state.tempName}
              slice={this.state.slice} onHome={this.onHome} onZoomIn={this.onZoomIn}
              onZoomOut={this.onZoomOut} onResize={this.onResize} showSliceDisplay={this.props.showSliceDisplay}
              modifySliceDisplay={this.props.modifySliceDisplay}/>
          </div>
        );
      } else {
        markup = (
          <div
            id={displayArea}
            style={{
              position: 'relative',
              top: 1,
              left: 1,
              background: 'transparent',
              width: this.props.data.width,
              height: this.props.data.height
            }}>
          </div>
        );
      }

      return <ReactResizeDetector skipOnMount={true} onResize={this.onResize}>
        <div id='slice-viewer' style={{width: '100%', height: '100%'}} ref={this.refs.stackCanvas}>
        {markup}
        </div>
        </ReactResizeDetector>
    }
  });

  export default StackViewerComponent;
