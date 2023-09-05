/* eslint-disable no-undef */
import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { ChevronLeft } from '../../icons';

const imageStyle =  {
  height: '100%',
  width: '100%',
  objectFit: 'cover'
}

const TerminfoSlider = (props) => {
  const classes = {
    root: {
      height: '100%',
      position: 'relative',

      '& > div': {
        height: '100%',
        '& > div': {
          height: '100%',
        }
      },
      '& .react-slideshow-wrapper': {
        height: '100%'
      },

      '& .react-slideshow-container': {
        height: '100%'
      },

      '& .images-wrap': {
        height: '100%',
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
        left: '60px'
      },

      '& .react-slideshow-container .nav:last-of-type': {
        right: '60px',

        '& svg': {
          transform: 'rotate(180deg)'
        }
      },

      '& .react-slideshow-container + ul.indicators .each-slideshow-indicator::before': {
        background: '#fff',
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

  useEffect( () => {
    if(props?.examples) {
      const keys = Object.keys(props.examples);
      setSlideImages(keys.map( k => ({
        url: props.examples[k][0].thumbnail,
        caption: props.examples[k][0].label
      })));
    }
  }, [props.examples]);

  return (
    <Box sx={classes.root}>
      <Slide canSwipe={false} slidesToShow={1} slidesToScroll={1} infinite={false} indicators={true} prevArrow={<Typography><ChevronLeft color={'#A0A0A0'} /></Typography>} nextArrow={<Typography><ChevronLeft color={'#A0A0A0'} /></Typography>} arrows={true}>
        {slideImages.length > 0 && (
          <>
            {slideImages?.map((slideImage, index) => (
              <div key={index}>
                <img
                  style={imageStyle}
                  src={slideImage.url}
                  alt={slideImage.caption}
                />
              </div>
            ))}
          </>
        )}

      </Slide>
    </Box>
  )
}

export default TerminfoSlider ;