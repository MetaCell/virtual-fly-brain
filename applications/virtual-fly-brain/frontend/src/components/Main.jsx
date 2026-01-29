import React from 'react';
import Wrapper from '../shared/wrapper';
import MainLayout from './Layout';
import '../css/base.less';
import '../css/VFBMain.less';

const Main = () => {
  const [bottomNav, setBottomNav] = React.useState();

  return (
    <Wrapper bottomNav={bottomNav} setBottomNav={setBottomNav}>
      <MainLayout
        bottomNav={bottomNav}
        setBottomNav={setBottomNav}
      />
    </Wrapper>
  )
}

export default Main;
