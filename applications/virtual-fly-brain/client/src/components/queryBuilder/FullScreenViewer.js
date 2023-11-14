import React from "react";
import Dialog from '@mui/material/Dialog';
import { ChevronRight, CrossCircle } from "../../icons";
import { IconButton, Typography } from "@mui/material";
import { Slide } from 'react-slideshow-image';
import { ChevronLeft, FullScreen } from '../../icons';
import vars from '../../theme/variables';

const { listHeadingColor } = vars;
const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}

const FullScreenViewer = ( { open, onClose, maxWidth = 'md', images, sx, children } ) =>
{
  return (
    <Dialog
      fullWidth
      onClose={onClose}
      scroll="body"
      maxWidth={maxWidth}
      open={open}
      sx={sx}
    >
      <IconButton
        sx={{
          position: 'absolute',
          right: '-1.25rem',
          top: '-1.25rem',
        }}
        onClick={onClose}
      >
        <CrossCircle />
      </IconButton>
      {children}
      {images.length > 0 && (
        <Slide canSwipe slidesToShow={ 1 } slidesToScroll={ 1 } infinite={ false } indicators={ true } prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } nextArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } arrows={ true }>
          <>
            {images?.map((slideImage, index) => (
              <div key={index}>
                <img
                  style={imageStyle}
                  src={slideImage?.url}
                />
              </div>
            ))}
          </>
        </Slide>
      )}
    </Dialog>
  )
};

export default FullScreenViewer;