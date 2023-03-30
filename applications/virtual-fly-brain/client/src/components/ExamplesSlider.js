/* eslint-disable no-undef */
import React from 'react';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
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
  backgroundSize: 'contain',
  height: '400px'
}

const ExamplesSlider = (props) => {
  const keys = [];
  if ( props.examples ) Object.keys(props.examples);
  const slideImages = keys.map( k => ({
    url: props.examples[k][0].thumbnail,
    caption: props.examples[k][0].label
  }));
  return (
    <div className="slide-container" >
      <Slide >
       {slideImages.map((slideImage, index)=> (
          <div key={index}>
            <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
              <span style={spanStyle}>{slideImage.caption}</span>
            </div>
          </div>
        ))} 
      </Slide>
    </div>
  )   
}

export default ExamplesSlider ;