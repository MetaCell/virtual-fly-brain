/* eslint-disable no-undef */
import React from 'react';
import ThreeDCanvas from './ThreeDCanvas';
import TermInfo from './TermInfo';

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
        {/* <div>
          <VFBToolBar />
        </div>*/}
        <div style={{ height: '100%', width: '50%' }} id="termInfoMain">
          <TermInfo />
        </div> 
        <div style={{ height: '100%', width: '50%' }} id="termInfoMain">
          <ThreeDCanvas />
        </div>
        
      </div>
    )
}

export default Main ;