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
import {Button, Box} from '@mui/material'
import Canvas from "@metacell/geppetto-meta-ui/3d-canvas/Canvas";
import { getInstancesTypes } from '../reducers/actions/types/getInstancesTypes';

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
    let instances = window.Instances;
    if ( instances === undefined ){
      instances = [];
    }
    instances?.find( i => i.wrappedObj?.id === instance.id ) ? null : window.Instances = [...instances, instance1]
    augmentInstancesArray(window.Instances);
  }
  
  getProxyInstances () {
    return window.Instances.map(i => (
      { ...i,
        instancePath: i.getId(),
        visible : this.state.mappedCanvasData?.find( cd => cd.instancePath === i.getId())?.visible
      }
    ))
  }

  updateColors ( inst, mappedCanvasData) {
    let match = mappedCanvasData?.find( m => m.instancePath === inst.Id )
    let color = { r : inst.color?.r/255, g : inst.color?.g/255, b : inst.color?.b/255 }
    let colorMatch = match?.color?.b === color?.b && match?.color?.r === color?.r && match?.color?.g === color?.g;
    if ( !colorMatch && inst.color && match ){
        match.color = color;
        this.canvasRef.current.threeDEngine.updateInstances(mappedCanvasData)
    }
  }

  newInstance (instance) {
    this.loadInstances(instance)
    const data = this.getProxyInstances();
    const newData = mapToCanvasData(data)
    instance.setGeometryType && instance.setGeometryType('cylinders')

    newData?.forEach( dat => {
      dat.visible = data?.find( i => i.Id === data.instancePath )?.visible;
    })
    let mappedCanvasData = [...newData]
    let match = mappedCanvasData?.find( m => instance.id === m.instancePath )
    if ( match ){
      match.visible = true;
      this?.canvasRef?.current?.threeDEngine?.updateInstances(mappedCanvasData)
      this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.event.trigger !== prevProps.event.trigger){ 
      let that = this;
      let allLoadedInstances = this.props.allLoadedInstances;
      const mappedCanvasData = [...this.state.mappedCanvasData];
      const targetInstance = allLoadedInstances?.find( i => i.Id === this.props.event.id)
      const focusInstance = window.Instances?.find( instance => instance.wrappedObj.id === this.props.focusInstance?.Id);

      switch(this.props.event.action){
        case getInstancesTypes.FOCUS_INSTANCE:
          if ( focusInstance){
            this.canvasRef.current.threeDEngine.cameraManager.zoomTo([focusInstance])
          } else {
            this.canvasRef.current.defaultCameraControlsHandler("cameraHome")
          }
          break;
        case getInstancesTypes.CHANGE_COLOR:
          this.updateColors(targetInstance,mappedCanvasData)
          break;
        case getInstancesTypes.ADD_INSTANCE:
          // Set all existing instances to invisible
          if ( mappedCanvasData?.find( i => targetInstance?.Id === i.instancePath ) === undefined ){
            if (targetInstance.Images)
            {
              mappedCanvasData?.forEach(i => i.visible = false);
              fetch(targetInstance.Images?.[Object.keys(targetInstance.Images)[0]][0].obj)
              .then(response => response.text())
              .then(base64Content => {
                const instance = {
                  "eClass": "SimpleInstance",
                  "id": targetInstance.Id,
                  "name": targetInstance.Name,
                  "type": { "eClass": "SimpleType" },
                  "visualValue": {
                    "eClass": Resources.OBJ,
                    'obj': base64Content
                  }, 
                  "visible" : true
                }
                that.newInstance(instance);
              });
            }
          }
          break;
        case getInstancesTypes.SHOW_3D_MESH:
          if ( mappedCanvasData?.find( m => m.instancePath === targetInstance?.Id) ){
            mappedCanvasData.find( m => m.instancePath === targetInstance.Id).visible = true
          }
          this?.canvasRef?.current?.threeDEngine?.updateInstances(mappedCanvasData)
          this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
          break;
        case getInstancesTypes.HIDE_3D_MESH:
          if ( mappedCanvasData?.find( m => m.instancePath === targetInstance?.Id) ){
            mappedCanvasData.find( m => m.instancePath === targetInstance.Id).visible = false
          }
          this?.canvasRef?.current?.threeDEngine?.updateInstances(mappedCanvasData)
          this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
          break;
        case getInstancesTypes.SELECT_INSTANCE:
          if ( mappedCanvasData?.find( m => m.instancePath === targetInstance?.Id) ){
            mappedCanvasData.find( m => m.instancePath === targetInstance.Id).selected = targetInstance.selected
          }
          this.updateColors(targetInstance,mappedCanvasData)
          this?.canvasRef?.current?.threeDEngine?.updateInstances(mappedCanvasData)
          this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
          break;
        case getInstancesTypes.SHOW_SKELETON:
          this.showSkeleton(targetInstance, true)
          break;
        case getInstancesTypes.HIDE_SKELETON:
          this.showSkeleton(targetInstance, false)
          break;
        case getInstancesTypes.SHOW_CYLINDERS:
          console.log("Show skeleton")
          break;
        case getInstancesTypes.HIDE_CYLINDERS:
          console.log("Show skeleton")
          break;
        default:
      }
    }
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
    let updatedCanvas = applySelection(this.state.mappedCanvasData, selectedInstances);
    this.setState({ mappedCanvasData: updatedCanvas })
  }

  showSkeleton (targetInstance, visible) {
    let that = this;
    let allLoadedInstances = this.props.allLoadedInstances;
    let mappedCanvasData = [...this.state.mappedCanvasData]
    let match = allLoadedInstances?.find ( inst => inst.Id === targetInstance?.Id );
    let matchSWC = allLoadedInstances?.find ( inst => inst.Id === targetInstance?.Id + "_swc" );
    let canvasMatch = this.state.mappedCanvasData?.find( i => matchSWC?.Id === i.instancePath );

    if ( visible ) {
      if ( canvasMatch === undefined ){
        let instanceCopy = match;
        fetch(match.Images?.[Object.keys(match.Images)[0]][0].obj)
          .then(response => response.text())
          .then(base64Content => {
            const instance = {
              "eClass": "Instance",
              "id": instanceCopy.Id + "_swc",
              "name": instanceCopy.Name,
              "type": { "eClass": "SimpleType" },
              "visualValue": {
                "eClass": Resources.OBJ,
                'obj': base64Content
              }, 
            }
            that.newInstance(instance);
        })
      } else {
        if ( !canvasMatch.visible )  {
          canvasMatch.visible = true
          this?.canvasRef?.current?.threeDEngine?.updateInstances(mappedCanvasData)
          this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
        }
      }
    } else {
      canvasMatch.visible = false
      this?.canvasRef?.current?.threeDEngine?.updateInstances(mappedCanvasData)
      this.setState({ ...this.state, mappedCanvasData : mappedCanvasData})
    }
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
              // onHoverListeners={{ 'hoverId': this.hoverHandler }}
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
  event : state.instances.event
});


export default connect(mapStateToProps)(withStyles(styles)(ThreeDCanvas));