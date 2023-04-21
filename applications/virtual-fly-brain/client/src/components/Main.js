/* eslint-disable no-undef */
import React, { Component } from 'react';
import VFBToolBar from './Toolbar';
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import TermInfo from './TermInfo';
import Wrapper from '../shared/Wrapper';
import MainLayout from './Layout';

var modelJson = require('./layoutModel').modelJson;

require('../css/base.less');
require('../css/VFBMain.less');

const Main = () => {

  return (
    <>
      {/* <div className="unselectable" style={{ height: '100%', width: '100%' }}>

       <div>
         <VFBToolBar />
       </div>

       <div>
         <TermInfo />
       </div>

     </div> */}

      <Wrapper>
        <MainLayout />
      </Wrapper>
    </>
  )
}

export default Main;