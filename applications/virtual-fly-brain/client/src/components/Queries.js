/* eslint-disable no-undef */
import React from 'react';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'
import { get_instance } from '../network/query';

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: 'blue',
  textDecoration:'underline', 
  cursor: 'pointer'
}

const Queries = (props) => {

  const loadInstance = (takes) => { 
    get_instance(takes);
  }
  
  return (
    <div className="slide-container" >
       {props.queries.map((query, index)=> (
          <div key={index}>
            <span style={spanStyle} onClick={ () => { loadInstance(query.takes) } }>{query.query}</span>
          </div>
        ))} 
    </div>
  )   
}

export default Queries ;