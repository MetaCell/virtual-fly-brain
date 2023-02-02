/* eslint-disable no-undef */
import React, { Component } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import * as FlexLayout from '@metacell/geppetto-meta-ui/flex-layout/src';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'

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
      <div>
        <div>
          <div>
            <span >Name</span>
              <div>
                <div tabindex="-1">
                  <div>
                    <b>{ termInfoData.Name }</b>
                    <span class="label types">
                      { termInfoData.Tags.map( tag => <span class="label">{tag}</span>) }
                    </span>
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