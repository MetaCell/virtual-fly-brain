import React from 'react';
import ORTH from "../assets/viewer/orth.svg";
import SLICE from "../assets/viewer/slice.svg";
import ORTHHOVER from "../assets/viewer/orth_hover.svg";
import SLICEHOVER from '../assets/viewer/slice_hover.svg';
import HOME from '../assets/viewer/home.svg';
import HOMEHOVER from '../assets/viewer/home_hover.svg';
import UP from '../assets/viewer/up.svg';
import UPHOVER from '../assets/viewer/up_hover.svg';
import DOWN from '../assets/viewer/down.svg';
import DOWNHOVER from '../assets/viewer/down_hover.svg';
import ZOOM_IN from '../assets/viewer/zoom_in.svg';
import ZOOM_IN_HOVER from '../assets/viewer/zoom_in_hover.svg';
import ZOOM_OUT from '../assets/viewer/zoom_out.svg';
import ZOOM_OUT_HOVER from '../assets/viewer/zoom_out_hover.svg';


const StackViewerButtons = ({
  onStepOut,
  onHome,
  onStepIn,
  onZoomIn,
  onZoomOut,
  toggleOrth,
  toggleSlice,
  isSmallViewport
}) => {
  const orthClass = 'btn';
  const toggleSliceClass = 'btn';

  const [upHover, setUpHover] = React.useState(false);
  const [downHover, setDownHover] = React.useState(false);
  const [zoomInHover, setZoomInHover] = React.useState(false);
  const [zoomOutHover, setZoomOutHover] = React.useState(false);
  const [sliceHover, setSliceHover] = React.useState(false);
  const [orthHover, setOrthHover] = React.useState(false);
  const [homeHover, setHomeHover] = React.useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: isSmallViewport ? 'row' : 'column',
      alignItems: 'center',
      gap: '.5rem',
      height: isSmallViewport ? '40px' : 'auto',
      backgroundColor: isSmallViewport ? '#3A3A3A' : 'transparent',
      padding: '1.75rem 1rem',
      borderRadius: '0.375rem',
      transition: 'all 0.2s ease',
      overflowX: isSmallViewport ? 'auto' : 'hidden',
      overflowY: isSmallViewport ? 'hidden' : 'auto'
    }}>
      <div>
        <button
          style={{
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            border: 'none',
          }} className={orthClass} onClick={onStepOut} onMouseOver={() => setUpHover(true)} onMouseOut={() => setUpHover(false)} title={'Step out of Stack'}>
          <img
            src={upHover ? UPHOVER : UP}
            alt={'Step out of Stack'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
      <div>
        <button
          style={{
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            border: 'none',
          }} className={orthClass} onClick={onHome} onMouseOver={() => setHomeHover(true)} onMouseOut={() => setHomeHover(false)} title={'Reset the Stack Viewer'}>
          <img
            src={homeHover ? HOMEHOVER : HOME}
            alt={'Reset Stack Viewer'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
      <div>
        <button
          style={{
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            border: 'none',
          }} className={orthClass} onClick={onStepIn} onMouseOver={() => setDownHover(true)} onMouseOut={() => setDownHover(false)} title={'Step in of Stack'}>
          <img
            src={downHover ? DOWNHOVER : DOWN}
            alt={'Step in of Stack'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
      <div>
        <button
          style={{
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            border: 'none',
          }} className={orthClass} onClick={onZoomIn} onMouseOver={() => setZoomInHover(true)} onMouseOut={() => setZoomInHover(false)} title={'Zoom In'}>
          <img
            src={zoomInHover ? ZOOM_IN_HOVER : ZOOM_IN}
            alt={'Zoom In'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
      <div>
        <button
          style={{
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            border: 'none',
          }} className={orthClass} onClick={onZoomOut} onMouseOver={() => setZoomOutHover(true)} onMouseOut={() => setZoomOutHover(false)} title={'Zoom Out'}>
          <img
            src={zoomOutHover ? ZOOM_OUT_HOVER : ZOOM_OUT}
            alt={'Zoom Out'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
      <div>
        <button style={{
          padding: 0,
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={orthClass} onClick={toggleOrth} onMouseOver={() => setOrthHover(true)} onMouseOut={() => setOrthHover(false)} title={'Toggle the 3D slice display'}>
          <img
            src={orthHover ? ORTHHOVER : ORTH}
            alt={'Toggle Orth'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
      <div>
        <button 
          style={{
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            border: 'none',
          }} className={toggleSliceClass} onClick={toggleSlice} onMouseOver={() => setSliceHover(true)} onMouseOut={() => setSliceHover(false)} title={'Change Slice Plane Through Stack'}>
          <img
            src={sliceHover ? SLICEHOVER : SLICE}
            alt={'Add Slices'}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
        </button>
      </div>
    </div>
  );
};

export default StackViewerButtons;
