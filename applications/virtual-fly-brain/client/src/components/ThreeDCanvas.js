import React, { Component } from 'react';
// import CameraControls from "@metacell/geppetto-meta-ui/camera-controls/CameraControls";
import SimpleInstance from "@metacell/geppetto-meta-core/model/SimpleInstance";
import { withStyles } from '@material-ui/core';
import { applySelection, mapToCanvasData } from "@metacell/geppetto-meta-ui/3d-canvas/utils/SelectionUtils"
import Resources from '@metacell/geppetto-meta-core/Resources';
import ModelFactory from '@metacell/geppetto-meta-core/ModelFactory';
import { augmentInstancesArray } from '@metacell/geppetto-meta-core/Instances';
import { connect } from 'react-redux';
import vars from '../theme/variables';
import CameraControls from './CameraControls';
import {cameraControlsActions} from './CameraControls';
import {Button, Box} from '@mui/material'
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";

const {
  whiteColor,
  blackColor
} = vars;

const styles = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
  },
});

class ThreeDCanvas extends Component {
  constructor (props) {
    super(props);

    this.state = {
      instance: undefined,
      loaded: false,
      showLoader: false,
      cameraOptions: {
        angle: 50,
        near: 0.01,
        far: 1000,
        baseZoom: 1,
        cameraControls: {
          instance: CameraControls,
          props: { wireframeButtonEnabled: false },
        },
        initialFlip: ['y', 'z'],
        reset: false,
        autorotate: false,
        wireframe: false,
      },
      showModel: false,
      mappedCanvasData: [],
    };

    this.canvasRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.onSelection = this.onSelection.bind(this)
    this.layoutRef = React.createRef();
  }

  loadInstances (instance){
    ModelFactory.cleanModel();
    const instance1 = new SimpleInstance(instance)
    instance1.visible = true;
    let instances = window.Instances;
    if ( instances === undefined ){
      instances = [];
    }
    instances?.find( i => i.wrappedObj?.id === instance.id ) ? null : window.Instances = [...instances, instance1]
    augmentInstancesArray(window.Instances);
  }
  
  getProxyInstances () {
    return window.Instances.map(i => (
      { 
        instancePath: i.getId(), 
        color: { r:1, g: 1, b: 0, a: 1 }, 
        visible : true
      }
    ))
  }

  updateColors ( inst, visible) {
    let mappedCanvasData = [...this.state.mappedCanvasData]
    let match = mappedCanvasData?.find( m => m.instancePath === inst.Id )
    let color = { r : inst.color?.r/255, g : inst.color?.g/255, b : inst.color?.b/255 }
    let colorMatch = match?.color?.b === color?.b && match?.color?.r === color?.r && match?.color?.g === color?.g;
      
    if ( !colorMatch && inst.color && match && !match?.visible && ( match.visible != visible )){
        match.color = color;
        if ( match.visible != visible ) {
          match.visible = visible;
          //this.setState({ ...this.state, mappedCanvasData : mappedCanvasData })
        }
        this.canvasRef.current.threeDEngine.updateInstances(mappedCanvasData)
      } else if ( !colorMatch && inst.color && match && match?.visible ){
        match.color = color;
        if ( match.visible != visible ) {
          match.visible = visible;
          //this.setState({ ...this.state, mappedCanvasData : mappedCanvasData })
        }
        this.canvasRef.current.threeDEngine.updateInstances(mappedCanvasData)
      } else {
        if ( match && match?.visible != visible ) {
          match.visible = visible;
          this.setState({ ...this.state, mappedCanvasData : mappedCanvasData })
        }
      }
  }

  UNSAFE_componentWillReceiveProps(nextProps){
    if(this.props.triggerFocus !== nextProps.triggerFocus){ 
      let instance = window.Instances.find( (instance) => instance.wrappedObj.id === nextProps.focusInstance?.Id);
      if ( instance ){
        this.canvasRef.current.threeDEngine.cameraManager.zoomTo([instance])
      } else {
        this.canvasRef.current.defaultCameraControlsHandler("cameraHome")
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let that = this;
    let allLoadedInstances = this.props.allLoadedInstances;
    allLoadedInstances?.forEach ( inst => {
      if ( inst.visible ) {
        if ( that.state.mappedCanvasData?.find( i => inst.Id === i.instancePath ) === undefined ){
          let instanceCopy = inst;
          fetch(inst.Images?.[Object.keys(inst.Images)[0]][0].obj)
            .then(response => response.text())
            .then(base64Content => {
              const instance = {
                "eClass": "SimpleInstance",
                "id": instanceCopy.Id,
                "name": instanceCopy.Name,
                "type": { "eClass": "SimpleType" },
                "visualValue": {
                  "eClass": Resources.OBJ,
                  'obj': base64Content,
                  'color' : { r:1, g: 1, b: 0, a: 1 },
                }
              }
              this.loadInstances(instance)
              const data = this.getProxyInstances();
              const newData = mapToCanvasData(data)
              let mappedCanvasData = [...newData]
              let match = mappedCanvasData?.find( m => instance.id === m.instancePath )
              if ( match ){
                match.visible = true;
                that.setState({ ...that.state, mappedCanvasData : mappedCanvasData})
              }
            });
        } else {
          this.updateColors(inst, true)
        }
      } else {
        this.updateColors(inst, false)
      }
    });
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
    console.log("Component unmouted")
  }

  handleToggle () {
    this.setState({ showLoader: true })
    this.loadInstances()
    this.setState({ showModel: true, showLoader: false, data: this.getProxyInstances(), cameraOptions: { ...this.state.cameraOptions, } })
  }

  handleClickOutside (event) {
    if (this.node && !this.node.contains(event.target)) {
      if (event.offsetX <= event.target.clientWidth){
        this.setState({ showModel: false })
      }
    }
  }

  onSelection (selectedInstances){
    this.setState({ data: applySelection(this.state.data, selectedInstances) })
  }

  render () {
    const { cameraOptions } = this.state
    const { classes } = this.props

    return <Box
      sx={{
        height: 'calc(100% - 0.5rem)',
        color: whiteColor,
        overflow: 'hidden',
        background: {
          lg: blackColor
        },
        p: {
          xs: 2,
          lg: 2
        },
      }}
    >
      {this.state.mappedCanvasData?.length > 0 ? (
        <div ref={node => this.node = node} className={classes.container}>
          <>
            <Canvas
              ref={this.canvasRef}
              data={this.state.mappedCanvasData?.filter(d => d?.visible )}
              cameraOptions={cameraOptions}
              backgroundColor={blackColor}
              onSelection={this.onSelection}
              onHoverListeners={{ 'hoverId': this.hoverHandler }}
              dracoDecoderPath={'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/'}
            />
          </>
        </div>
      ) : (
        <Box p={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleToggle}
          >
            Show Example
          </Button>
        </Box>
      )}
    </Box>
  }
}

const mapStateToProps = state => ({
  allLoadedInstances : state.instances.allLoadedInstances,
  focusInstance : state.instances.focusInstance,
  triggerFocus : state.instances.triggerFocus
});


export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));