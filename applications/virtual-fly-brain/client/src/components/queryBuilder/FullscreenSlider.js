/* eslint-disable no-undef */
import { Box, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { ChevronLeft, FullScreen } from '../../icons';
import vars from '../../theme/variables';
import { focusInstance, getInstanceByID, selectInstance } from '../../reducers/actions/instances';

const { whiteColor, listHeadingColor } = vars;

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: '#000000'
}

const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '400px'
}

const FullscreenSlider = (props) => {
  const classes = {
    root: {
      height: '100%',
      position: 'relative',
      overflow: !props.allowFullscreen ? 'hidden' : 'visible',
      borderRadius: !props.allowFullscreen ? '0.5rem' : '0',

      '& img': {
        display: 'block'
      },

      '& > div:first-child': {
        height: '100%',
        '& > div': {
          height: '100%',
        }
      },
      '& .react-slideshow-wrapper': {
        height: '100%'
      },

      '& .react-slideshow-container': {
        height: '100%',
      },

      '& .images-wrap': {
        height: '100%',
        width: '100% !important',
        transform: "translate(0px) !important",
        '& > div': {
        height: '100%',
        '& > div': {
          height: '100%',
        }
      },
      },

      '& .react-slideshow-container .nav': {
        zIndex: 10,
        position: 'absolute',
        cursor: 'pointer',
        bottom: '0.5rem',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
      },

      '& .react-slideshow-container .nav svg': {
        width: '1.25rem',
        height: '1.25rem'
      },

      '& .react-slideshow-container .nav.disabled': {
        opacity: 0.6
      },

      '& .react-slideshow-container .nav:first-of-type': {
        left: '3.75rem'
      },

      '& .react-slideshow-container .nav:last-of-type': {
        right: '3.75rem',

        '& svg': {
          transform: 'rotate(180deg)'
        }
      },

      '& .react-slideshow-container + ul.indicators .each-slideshow-indicator::before': {
        background: whiteColor,
        position: 'static',
        display: 'block',
        width: '0.375rem',
        height: '0.375rem'
      },

      '& .react-slideshow-container + ul.indicators li': {
        width: 'auto',
        height: 'auto',
        padding: 0,
        display: 'flex',

      },

      '& .react-slideshow-container + ul.indicators': {
        margin: 0,
        padding: 0,
        position: 'absolute',
        bottom: '0.938rem',
        height: 'auto',
        width: '100%',
      }
    }
  };
  const [slideImages, setSlideImages] = useState([]);

  const imageClick = (image) => {
    getInstanceByID(image.id, true, true, true);
  }

  useEffect( () => {
    console.log("Layers ", props.examples)
    if(props?.examples) {
      setSlideImages(props?.examples.map( k => ({
        url: k.thumbnail,
        caption: k.label,
        id : k
      })));
    }
  }, [props.examples]);

  return (
      <Slide canSwipe={ false } slidesToShow={ 1 } slidesToScroll={ 1 } infinite={ false } indicators={ true } prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } nextArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } arrows={ true }>
        {slideImages?.map((slideImage, index) => (
          <div key={slideImage.caption}>
            <div
              style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }} onClick={() => imageClick(slideImage.id)}>
              <span style={spanStyle}>{slideImage.caption}</span>
            </div>
          </div>
        ))}
      </Slide>
  )
}

export default FullscreenSlider ;