/* eslint-disable no-undef */
import React, { Component, useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
// import ExamplesSlider from './TermInfo/TerminfoSlider';
import Queries from './Queries';

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

const TermInfo = () => {

  const data = useSelector(state => state.termInfo.termInfoData)
  const error = useSelector(state => state.termInfo.error)

  const [termInfoData, setTermInfoData] = useState(data);

  // FIXME
  useEffect( () => {
    console.log("term info data : ", data);
    setTermInfoData(data)
  },[data]);

    return(
      termInfoData ?
      <div>
        <br/>
        <br/>
        <br/>
        <div>
          <div>
            <span><b>Name</b></span>
              <div>
                <div tabIndex="-1">
                  <div>
                     { termInfoData?.Name }<br/>
                    <span className="label types">
                      { termInfoData?.Tags.map( tag => <span key={tag} className="label">{tag}<br/></span>) }
                    </span>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div>
          <span><b>Description</b></span>
            <div>
              <div tabIndex="-1">
                <div>
                    { termInfoData?.Meta?.Description }<br/>
                </div>
              </div>
            </div>
        </div>
        <div>
          <div>
            <span><b>Queries</b></span>
              <div>
                <div tabIndex="-1">
                  <div>
                    <Queries queries={termInfoData?.Queries} ></Queries>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div>
          <div>
            <span><b>Examples</b></span>
              <div>
                <div tabIndex="-1">
                  <div>
                    {/* <ExamplesSlider examples={termInfoData?.Examples} ></ExamplesSlider> */}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      : ( error ? (<div>{ error?.data}</div>) : ( <div>Loading... </div>  ))
    )
}

export default TermInfo;