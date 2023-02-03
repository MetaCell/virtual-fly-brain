/* eslint-disable no-undef */
import React, { Component } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import ExamplesSlider from './ExamplesSlider';
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

  const termInfoData = useSelector(state => state.termInfo.termInfoData)
  const error = useSelector(state => state.termInfo.error)

    return(
      termInfoData ?
      <div className="flexlayout__border_bottom">
        <br/>
        <br/>
        <br/>
        <div>
          <div>
            <span><b>Name</b></span>
              <div>
                <div tabIndex="-1">
                  <div>
                     { termInfoData.meta.Name }<br/>
                    <span className="label types">
                      { termInfoData.meta.Tags.map( tag => <span className="label">{tag}<br/></span>) }
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
                    { termInfoData.meta.Description }<br/>
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
                    <ExamplesSlider examples={termInfoData.Examples} ></ExamplesSlider>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      : ( error ? (<div>{ error.data}</div>) : ( <div>Loading... </div>  ))
    )
}

export default TermInfo;