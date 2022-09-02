/* eslint-disable no-undef */
import React, { Component } from 'react';
import VFBToolBar from './VFBToolbar';
import VFBOBJModelLoader from './VFBOBJModelLoader';
import VFBStackViewer from './VFBStackViewer';
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
var modelJson = require('./layoutModel').modelJson;

require('../css/base.less');
require('../css/VFBMain.less');

const styles = () => ({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export class VFBMain extends React.Component {

  constructor (props) {
    super(props);
    this.model = FlexLayout.Model.fromJson(modelJson)
  }

  shouldComponentUpdate (nextProps, nextState) {
  }
  
  componentWillReceiveProps (nextProps) {
  }

  componentDidUpdate (prevProps, prevState) {
  }

  componentWillMount () {
  }

  componentWillUnmount () {
  }

  componentDidMount () {
  }

  render () {
    return(<div className="unselectable" style={{ height: '100%', width: '100%' }}>
    { this.quickHelpRender }
    <VFBToolBar
      htmlOutputHandler={this.renderHTMLViewer}
      menuHandler={this.menuHandler}/>
    
    <div>
      <VFBOBJModelLoader />
    </div>

    <div className="flexChildContainer">
      <VFBStackViewer
        id="NewStackViewer"
        layout={this.refs.layout}
        ref={ref => this.sliceViewerReference = ref}
        canvasRef={this.canvasReference}
        onLoad={this.StackViewerIdLoaded}
        stackViewerHandler={this.stackViewerHandler} />
    </div>

    {/* <FlexLayout.Layout
      ref="layout"
      model={this.model}
      factory={this.factory.bind(this)}
      onRenderTabSet={onRenderTabSet}
      clickOnBordersAction={clickOnBordersAction}/> */}
    
    {this.htmlToolbarRender}
  </div>)
  }
}