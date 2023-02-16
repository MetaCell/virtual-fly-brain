/* eslint-disable no-undef */
import React from 'react';
import '@metacell/geppetto-meta-ui/flex-layout/style/dark.scss'

const spanStyle = {
  padding: '20px',
  background: '#efefef',
  color: '#000000'
}


const Queries = (props) => {

  return (
    <div className="slide-container" >
       {props.queries.map((query, index)=> (
          <div key={index}>
            <span>{query.query}</span>
          </div>
        ))} 
    </div>
  )   
}

export default Queries ;