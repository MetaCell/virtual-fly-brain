
import { Box, IconButton, Tooltip } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cameraControlAction } from './../reducers/actions/globals'
import UP from "../assets/viewer/up.svg";
import DOWN from "../assets/viewer/down.svg";
import LEFT from "../assets/viewer/left.svg";
import RIGHT from "../assets/viewer/right.svg";
import HOME from "../assets/viewer/home.svg";
import REPLAY from "../assets/viewer/replay.svg";
import REPLAY_1 from "../assets/viewer/replay-1.svg";
import REPLAY_2 from "../assets/viewer/replay_2.svg";
import REPLAY_3 from "../assets/viewer/replay_3.svg";
import REPLAY_4 from "../assets/viewer/replay_4.svg";
import REPLAY_5 from "../assets/viewer/replay_5.svg";
import VIDEOCAM from "../assets/viewer/videocam.svg";
import LANG from "../assets/viewer/language.svg";
import ZOOM_IN from "../assets/viewer/zoom_in.svg";
import ZOOM_OUT from "../assets/viewer/zoom_out.svg";

export const cameraControlsActions = {
  PAN_LEFT: 'panLeft',
  PAN_UP: 'panUp',
  PAN_RIGHT: 'panRight',
  PAN_DOWN: 'panDown',
  PAN_HOME: 'cameraHome',
  ROTATE_LEFT: 'rotateLeft',
  ROTATE_UP: 'rotateUp',
  ROTATE_RIGHT: 'rotateRight',
  ROTATE_DOWN: 'rotateDown',
  ROTATE_Z: 'rotateZ',
  ROTATE_MZ: 'rotateMZ',
  ROTATE: 'rotate',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  WIREFRAME: 'wireframe',
};

export const cameraControlsRotateState = {
  STOP: 'stop',
  STARTING: 'starting',
  ROTATING: 'rotating',
  STOPPING: 'stopping',
};

const CameraControls = (props) => {
  const {
    cameraControlsHandler,
    viewerId,
  } = props;
  const dispatch = useDispatch();
  const widget = useSelector((state) => state.widgets[viewerId]);

  const handleClick = (event, value) => {
    cameraControlsHandler(value?.action);
    if ( value?.action === cameraControlAction.WIREFRAME ){
      dispatch(cameraControlAction(value?.action))
    }
  };
  
  const controlsBottom = [
    {
      tooltip: 'Wireframe',
      image: LANG,
      action : cameraControlsActions.WIREFRAME
    },
    {
      tooltip: 'Zoom In',
      image: ZOOM_IN,
      action : cameraControlsActions.ZOOM_IN
    },
    {
      tooltip: 'Zoom Out',
      image: ZOOM_OUT,
      action : cameraControlsActions.ZOOM_OUT
    },
  ];

  const controlsRight = [
    {
      tooltip: 'Rotate Up',
      image: REPLAY,
      action : cameraControlsActions.ROTATE_UP
    },
    {
      tooltip: 'Rotate Left',
      image: REPLAY_1,
      action : cameraControlsActions.ROTATE_LEFT
    },
    {
      tooltip: 'Rotate',
      image: VIDEOCAM,
      action : cameraControlsActions.ROTATE
    },
    {
      tooltip: 'Rotate Right',
      image: REPLAY_2,
      action : cameraControlsActions.ROTATE_RIGHT
    },

    {
      tooltip: 'Rotate Z',
      image: REPLAY_3,
      action : cameraControlsActions.ROTATE_Z
    },
    {
      tooltip: 'Rotate Down',
      image: REPLAY_4,
      action : cameraControlsActions.ROTATE_DOWN
    },
    {
      tooltip: 'Rotate Z',
      image: REPLAY_5,
      action : cameraControlsActions.ROTATE_MZ
    },
  ];

  const controlsLeft = [
    {
      tooltip: 'Up',
      image: UP,
      action : cameraControlsActions.PAN_UP
    },
    {
      tooltip: 'Left',
      image: LEFT,
      action : cameraControlsActions.PAN_LEFT
    },
    {
      tooltip: 'Home',
      image: HOME,
      action : cameraControlsActions.PAN_HOME
    },
    {
      tooltip: 'Right',
      image: RIGHT,
      action : cameraControlsActions.PAN_RIGHT
    },

    {
      tooltip: 'Down',
      image: DOWN,
      action : cameraControlsActions.PAN_DOWN
    },
  ];

  const commonStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  }

  const firstElementStyle = {
    ...commonStyle,
    top: '-1.3125rem'
  }

  const lastElementStyle = {
    ...commonStyle,
    bottom: "-1.5125rem"
  }

  return (
    <Box className="position-toolbar" sx={{
      position: 'absolute',
      top: '40%',
      width: '4.125rem',
      left: '1rem',
      transform: 'translateY(-50%)'
    }}>
      <Box sx={{gap: '0.375rem', display: 'flex', alignItems: 'center'}} className="left position-relative" id="left-controls-id">
        {
          controlsLeft.map((value, index) => {
            let style = {};
            if (index === 0) {
              style = firstElementStyle;
            } else if (index === (controlsLeft.length -1)) {
              style = lastElementStyle;
            }
            return (
              <Tooltip title={value.tooltip} placement="top" key={`left_'${index}`}>
                <IconButton
                  style={ style }
                  sx={{padding: 0}}
                  disableRipple
                  key={value?.tooltip}
                  onClick={(event) => handleClick(event, value)}
                >
                  <img
                    src={value.image}
                    alt={value?.tooltip}
                  />
                </IconButton>
              </Tooltip>
            )
          })
        }
      </Box>

      <Box className="right position-relative" id="right-controls-id" sx={{marginTop: '3.5625rem', gap: '0.355rem', flexWrap: 'wrap', display: 'flex'}}>
        {
          controlsRight.map((value, index) => {
            let style = {};
            if (index === 0) {
              style = firstElementStyle;
            }
            return (
              <Tooltip title={value.tooltip} placement="top" key={`right_'${index}`}>
                <IconButton
                  style={ style }
                  sx={{padding: 0}}
                  disableRipple
                  key={value?.tooltip}
                  aria-describedby={value?.tooltip}
                  ref={value?.ref}
                  onClick={(event) => handleClick(event, value)}
                >
                  <img
                    src={value.image}
                    alt={value?.tooltip}
                  />
                </IconButton>
              </Tooltip>
            )
          })
        }
      </Box>

      <Box className="right position-relative" style={{ display: 'flex', marginTop: '1.75rem', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.375rem' }} id="right-controls-id">
        {
          controlsBottom.map((value, index) => {
            return (
              <Tooltip title={value.tooltip} placement="top" key={`bottom_'${index}`}>
                <IconButton
                  sx={{padding: 0}}
                  disableRipple
                  key={value?.tooltip}
                  onClick={(event) => handleClick(event, value)}
                >
                  <img
                    src={value.image}
                    alt={value?.tooltip}
                  />
                </IconButton>
              </Tooltip>
            )
          })
        }
      </Box>
    </Box>
  );
};

export default CameraControls;
