import React from 'react';
import ORTH from "../assets/viewer/orth.svg";
import SLICE from "../assets/viewer/slice.svg";
import ORTHHOVER from "../assets/viewer/orth_hover.svg";
import SLICEHOVER from '../assets/viewer/slice_hover.svg';

const StackViewerButtons = ({
  onStepOut,
  onHome,
  onStepIn,
  onZoomIn,
  onZoomOut,
  toggleOrth,
  toggleSlice,
  mouseOverOrth,
  mouseOverSlice,
  hoverOrthButton,
  hoverSliceButton,
  isSmallViewport
}) => {
  const homeClass = 'btn fa fa-home';
  const zoomInClass = 'btn fa fa-search-plus';
  const zoomOutClass = 'btn fa fa-search-minus';
  const stepInClass = 'btn fa fa-chevron-down';
  const stepOutClass = 'btn fa fa-chevron-up';
  const orthClass = 'btn';
  const toggleSliceClass = 'btn';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isSmallViewport ? 'row' : 'column',
      alignItems: 'center', 
      gap: '.5rem', 
      height: isSmallViewport ? '40px' : 'auto',
      backgroundColor: isSmallViewport ? '#3A3A3A' : 'transparent',
      padding: '0.75rem 1rem',
      borderRadius: '0.375rem',
      transition: 'all 0.2s ease',
      overflowX: isSmallViewport ? 'auto' : 'hidden',
      overflowY: isSmallViewport ? 'hidden' : 'auto'
    }}>
      <div onClick={onStepOut}>
        <button style={{
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={stepOutClass} title={'Step Out Of Stack'} />
      </div>
      <div onClick={onHome}>
        <button style={{
          id: "home",
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={homeClass} title={'Center Stack'} />
      </div>
      <div onClick={onStepIn}>
        <button style={{
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={stepInClass} title={'Step Into Stack'} />
      </div>
      <div onClick={onZoomIn}>
        <button style={{
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={zoomInClass} title={'Zoom In'} />
      </div>
      <div onClick={onZoomOut}>
        <button style={{
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={zoomOutClass} title={'Zoom Out'} />
      </div>
      <div>
        <button style={{
          padding: 0,
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }} className={orthClass} onClick={toggleOrth} onMouseOver={() => mouseOverOrth(true)} onMouseOut={() => mouseOverOrth(false)} title={'Change Slice Plane Through Stack'}>
          <img
            src={hoverOrthButton ? ORTHHOVER : ORTH}
            alt={'Toggle Orth'}
            style={{ width: '20px', height: '20px' }}
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
          }} className={toggleSliceClass} onClick={toggleSlice} onMouseOver={() => mouseOverSlice(true)} onMouseOut={() => mouseOverSlice(false)} title={'Toggle the 3D slice display'}>
          <img
            src={hoverSliceButton ? SLICEHOVER : SLICE}
            alt={'Add Slices'}
            style={{ width: '20px', height: '20px' }}
          />
        </button>
      </div>
    </div>
  );
};

export default StackViewerButtons; 