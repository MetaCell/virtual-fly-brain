/* eslint-disable no-undef */
import React, { Component } from 'react';
import VFBToolBar from './Toolbar';
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import TermInfo from './TermInfo';
import ThreeDCanvas from './ThreeDCanvas';
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
        
        <div>
          <TermInfo />
        </div>

        <div>
          <ThreeDCanvas />
        </div>
        
      </div>
    )
}

export default Main ;