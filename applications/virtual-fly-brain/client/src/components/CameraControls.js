
import { IconButton, Tooltip } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
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
  ROTATE: 'rotate',
  ZOOM_IN: 'zoomIn',
  ZOOM_OUT: 'zoomOut',
  COLOR_PICKER: 'COLOR_PICKER',
  DEV_STAGES: 'DEVELOPMENT_STAGES',
  LAYERS: 'LAYERS',
  HOME: 'cameraHome',
};

export const cameraControlsRotateState = {
  STOP: 'stop',
  STARTING: 'starting',
  ROTATING: 'rotating',
  STOPPING: 'stopping',
};

const CameraControls = (props) => {
  const controlsBottom = [
    {
      tooltip: 'LANG',
      image: LANG,
    },
    {
      tooltip: 'ZOOM_IN',
      image: ZOOM_IN,
    },
    {
      tooltip: 'ZOOM_OUT',
      image: ZOOM_OUT,
    },
  ];

  const controlsRight = [
    {
      tooltip: 'REPLAY',
      image: REPLAY,
    },
    {
      tooltip: 'R2P2AY_1',
      image: REPLAY_1,
    },
    {
      tooltip: 'VIDEOCAM',
      image: VIDEOCAM,
    },
    {
      tooltip: 'REPLAY_2',
      image: REPLAY_2,
    },

    {
      tooltip: 'REPLAY_3',
      image: REPLAY_3,
    },
    {
      tooltip: 'REPLAY_4',
      image: REPLAY_4,
    },
    {
      tooltip: 'REPLAY_5',
      image: REPLAY_5,
    },
  ];

  const controlsLeft = [
    {
      tooltip: 'Up',
      image: UP,
    },
    {
      tooltip: 'Left',
      image: LEFT,
    },
    {
      tooltip: 'Home',
      image: HOME,
    },
    {
      tooltip: 'Right',
      image: RIGHT,
    },

    {
      tooltip: 'Down',
      image: DOWN,
    },
  ];

  const commonStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  }

  const firstElementStyle = {
    ...commonStyle,
    top: '-34px'
  }

  const lastElementStyle = {
    ...commonStyle,
    bottom: "-34px"
  }

  return (
    <div className="position-toolbar" style={{
      position: 'absolute',
      top: '50%',
      width: '102px',
      transform: 'translateY(-50%)'
    }}>
      <div className="left position-relative" id="left-controls-id">
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
                  style={style}
                  disableRipple
                  key={value?.tooltip}
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
      </div>

      <div className="right position-relative" id="right-controls-id" style={{marginTop: '70px'}}>
        {
          controlsRight.map((value, index) => {
            let style = {};
            if (index === 0) {
              style = firstElementStyle;
            }
            return (
              <Tooltip title={value.tooltip} placement="top" key={`left_'${index}`}>
                <IconButton
                  style={style}
                  disableRipple
                  key={value?.tooltip}
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
      </div>

      <div className="right position-relative" style={{ display: 'flex', marginTop: '16px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} id="right-controls-id">
        {
          controlsBottom.map((value, index) => {
            return (
              <Tooltip title={value.tooltip} placement="top" key={`left_'${index}`}>
                <IconButton
                  disableRipple
                  key={value?.tooltip}
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
      </div>
    </div>
  );
};

export default CameraControls;
