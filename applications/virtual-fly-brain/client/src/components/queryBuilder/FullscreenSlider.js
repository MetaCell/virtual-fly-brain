/* eslint-disable no-undef */
import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { ChevronLeft, ChevronRight } from '../../icons';
import vars from '../../theme/variables';

const { listHeadingColor } = vars;

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: '100% 100%',
  height: '320px',
  borderRadius: '0.5rem',
  backgroundPosition: 'center center'
}

const FullscreenSlider = (props) => {
  const {slideImages, setSlideImages, setSlideImageCurrentSlide} = props;

  useEffect( () => {
    if(props?.examples) {
      setSlideImages(props?.examples.map( k => ({
        url: k.thumbnail,
        caption: k.label,
        id : k
      })));
    }
  }, [props.examples]);


  return (
      <Slide canSwipe={ false } slidesToShow={ 1 } slidesToScroll={ 1 } infinite={ false } indicators={ true } prevArrow={ <Typography><ChevronLeft color={ listHeadingColor } /></Typography> } nextArrow={ <Typography><ChevronRight color={ listHeadingColor } /></Typography> } arrows={ true } onChange={(slideIndex) => setSlideImageCurrentSlide(slideIndex)}>
        {slideImages?.map((slideImage) => (
          <div key={slideImage.caption}>
            <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}></div>
          </div>
        ))}
      </Slide>
  )
}

export default FullscreenSlider ;