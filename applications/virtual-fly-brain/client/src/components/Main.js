/* eslint-disable no-undef */
import React, { Component } from 'react';
import VFBToolBar from './Toolbar';
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
        <div style={{ height: '100%', width: '50%' }} id="termInfoMain">
          <TermInfo />
        </div>
        
      </div>
    )
}

export default Main ;