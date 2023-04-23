/* eslint-disable no-undef */
import React, { Component } from 'react';
import VFBToolBar from './Toolbar';
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import TermInfo from './TermInfo';
import VFBStackViewer from './StackViewer';
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

const Main = () => {

    return(
      <div className="unselectable" style={{ height: '100%', width: '100%' }}>
        
        <div>
          <VFBToolBar />
        </div>
        <div style={{ height: '100%', paddingTom : 20,}} id="stackViewerMain">
          <VFBStackViewer 
            id="NewStackViewer"
            defHeight={600}
            defWidth={600}
          />
        </div>
        <div style={{ height: '100%',  width : "50%", float : "right", display : 'inline-flex'}} id="termInfoMain">
          <TermInfo />
        </div>
      </div>
    )
}

export default Main ;