/* eslint-disable no-undef */
import React, { useState } from 'react';
import Wrapper from '../shared/Wrapper';
import MainLayout from './Layout';

require('../css/base.less');
require('../css/VFBMain.less');

const Main = () => {
  const [bottomNav, setBottomNav] = useState()

  return (
    <Wrapper setBottomNav={setBottomNav}>
      <MainLayout
        bottomNav={bottomNav}
        setBottomNav={setBottomNav}
      />
    </Wrapper>
  )
}

export default Main;