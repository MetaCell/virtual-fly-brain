/* eslint-disable no-undef */
import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: '#000000'
}

const divStyle = {
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '100%',
  borderRadius: '0.5rem',
}

const ExamplesSlider = (props) => {
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

      '& .react-slideshow-container + ul.indicators .each-slideshow-indicator::before': {
        background: '#fff',
        position: 'static',
        display: 'block'
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
        bottom: '8px',
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
  },[props.examples]);

  return (
    <Box sx={classes.root}>
      <Slide slidesToShow={1} slidesToScroll={1} infinite={false} indicators={true} arrows={false}>
        {slideImages?.map((slideImage, index)=> (
          <div key={index}>
            <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
              {slideImage.caption && <span style={spanStyle}>{slideImage.caption}</span>}
            </div>
          </div>
        ))}
      </Slide>
    </Box>
  )
}

export default ExamplesSlider ;