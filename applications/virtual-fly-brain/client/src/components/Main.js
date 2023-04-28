/* eslint-disable no-undef */
import React from 'react';
import Wrapper from '../shared/Wrapper';
import MainLayout from './Layout';

require('../css/base.less');
require('../css/VFBMain.less');

const Main = () => {

  return (
    <>
      <Wrapper>
        <MainLayout />
      </Wrapper>
    </>
  )
}

export default Main;