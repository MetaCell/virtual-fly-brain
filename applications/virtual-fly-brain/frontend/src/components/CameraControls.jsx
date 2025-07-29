/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  KeyboardArrowLeft,
  KeyboardArrowUp,
  KeyboardArrowDown,
  KeyboardArrowRight,
  HomeOutlined,
  VideocamOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReplayOutlined,
  LanguageOutlined
} from '@mui/icons-material';
import { Menu } from '../icons';
import { cameraControlAction } from '../reducers/actions/globals';

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
    canvasHeight,
    canvasWidth
  } = props;

  const dispatch = useDispatch();
  const [showControls, setShowControls] = useState(false);
  const isSmallViewport = canvasWidth < 300 || canvasHeight < 300;

  const handleClick = (event, value) => {
    cameraControlsHandler(value?.action);
    if ( value?.action === cameraControlsActions.WIREFRAME ){
      dispatch(cameraControlAction(value?.action))
    }
  };

  const iconButton = (label, action, IconComponent, sx = {}) => {
    return (
      <Tooltip title={label} placement="top">
        <IconButton aria-label={label} onClick={() => handleClick(null, { action })}>
          {typeof IconComponent === 'function'
            ? IconComponent()
            : <IconComponent fontSize="small" sx={sx} />}
        </IconButton>
      </Tooltip>
    );
  };


  const rotateIcon = (transform) => (
    <ReplayOutlined sx={{ transform }} fontSize="small" />
  );

  const ControlPanel = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSmallViewport ? 'row' : 'column',
        alignItems: 'center',
        p: 1,
        gap: isSmallViewport ? 0 : 1,
        backgroundColor: isSmallViewport ? '#3A3A3A' : 'transparent',
        borderRadius: 2,
        '& .MuiIconButton-root': { padding: 0 },
        '& .MuiSvgIcon-root': { fontSize: '1rem', color: 'rgba(255, 255, 255, 0.8)' },
      }}
    >
      {/* Pan */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
        {iconButton("Up", cameraControlsActions.PAN_UP, KeyboardArrowUp)}
        <Box display="flex" gap={0.5}>
          {iconButton("Left", cameraControlsActions.PAN_LEFT, KeyboardArrowLeft)}
          {iconButton("Home", cameraControlsActions.PAN_HOME, HomeOutlined)}
          {iconButton("Right", cameraControlsActions.PAN_RIGHT, KeyboardArrowRight)}
        </Box>
        {iconButton("Down", cameraControlsActions.PAN_DOWN, KeyboardArrowDown)}
      </Box>

      {/* Divider */}
      <Box mx={1} height="100%" borderLeft="1px solid rgba(255, 255, 255, 0.1)" />

      {/* Rotation */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
        {iconButton("Rotate Up", cameraControlsActions.ROTATE_UP, () => rotateIcon('scaleX(-1) rotate(-180deg)'))}
        <Box display="flex" gap={0.5}>
          {iconButton("Rotate Left", cameraControlsActions.ROTATE_LEFT, () => rotateIcon('rotate(-90deg)'))}
          {iconButton("Rotate", cameraControlsActions.ROTATE, VideocamOutlined)}
          {iconButton("Rotate Right", cameraControlsActions.ROTATE_RIGHT, () => rotateIcon('scaleX(-1) rotate(-90deg)'))}
        </Box>
        <Box display="flex" gap={0.5}>
          {iconButton("Rotate Z", cameraControlsActions.ROTATE_Z, () => rotateIcon('rotate(-90deg)'))}
          {iconButton("Rotate down", cameraControlsActions.ROTATE_DOWN, () => rotateIcon('rotate(0deg)'))}
          {iconButton("Rotate Z", cameraControlsActions.ROTATE_MZ, () => rotateIcon('scaleX(-1) rotate(-90deg)'))}
        </Box>
      </Box>

      {/* Divider */}
      <Box mx={1} height="100%" borderLeft="1px solid rgba(255, 255, 255, 0.1)" />

      {/* Zoom & Other */}
      <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
        {iconButton("Zoom In", cameraControlsActions.ZOOM_IN, ZoomInOutlined)}
        {iconButton("Zoom Out", cameraControlsActions.ZOOM_OUT, ZoomOutOutlined)}
        {iconButton("wireframe", cameraControlsActions.WIREFRAME, LanguageOutlined)}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ position: 'absolute', top: '10%', left: '1rem' }}>
      {isSmallViewport ? (
        <>
          <IconButton onClick={() => setShowControls((prev) => !prev)}>
            <Menu />
          </IconButton>
          {showControls && (
            <Box sx={{ position: 'absolute', left: '2rem', top: '-50%' }}>
              <ControlPanel />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ position: 'absolute', top: '-50%' }}>
          <ControlPanel />
        </Box>
      )}
    </Box>
  );
};

export default CameraControls;
