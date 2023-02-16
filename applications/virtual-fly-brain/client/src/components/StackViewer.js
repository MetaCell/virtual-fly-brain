import React, { Component } from 'react';

export default class VFBStackViewer extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      data: { id: this.props.id, height: this.props.defHeight, width: this.props.defWidth, instances: [], selected: [] },
      canvasRef: this.props.canvasRef
    }

    this.addSlices = this.addSlices.bind(this);
    this.removeSlice = this.removeSlice.bind(this);

    this.variable = null;
    this.options = null;
    // REMEMBER to define these props in the VFBMain
    this.data = { id: this.props.id, height: this.props.defHeight, width: this.props.defWidth, instances: [], selected: [] };
  }

  updateCanvasRef (newRef) {
    this.setState({ canvasRef: newRef });
  }

  addSlices (instances) {
    var added = undefined;
    var curr = this.data.instances.length;
    if (instances.length == undefined) {
      added = [instances];
      if (instances.parent) {
        // console.log('Adding ' + instances.parent.getName() + ' to StackViewer...');
        if (this.props.onLoad !== undefined) {
          this.props.onLoad(instances.parent.getId());
        }
        if (instances.parent.getId() == window.templateID){
          this.data.instances.unshift(instances);
        } else {
          this.data.instances[this.data.instances.length] = instances;
        }
      } else {
        // console.log('Adding ' + instances.toString() + ' to ' + this.data.instances.length);
        window.test = instances;
      }
    } else {
      added = instances;
      // console.log('Updating ' + instances.length + ' instances...');
      this.data.instances = instances;
    }
    // console.log('Passing ' + this.data.instances.length + ' instances');
    this.setState({ data: this.data }, () => {
      this.forceUpdate();
    });
  }

  removeSlice (path) {
    // console.log('Removing ' + path.split('.')[0] + ' from ' + this.data.instances.length);
    var i;
    for (i in this.data.instances){
      try {
        if (this.data.instances[i].parent.getId() == path.split('.')[0]){
          this.data.instances.splice(i,1);
          break;
        }
      } catch (ignore){ // handling already deleted instance
        // this.data.instances.splice(i,1);
      }
    }
    // console.log('Passing ' + this.data.instances.length + ' instances');
    this.setState({ data: this.data }, () => {
      this.forceUpdate();
    });
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  componentDidMount () {

  }

  render () {
    return (
      <div></div>
    )
  }
}
