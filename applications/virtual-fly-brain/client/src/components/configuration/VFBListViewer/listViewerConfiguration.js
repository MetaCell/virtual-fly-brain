import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ListViewerControlsMenu from '../../VFBListViewer/ListViewerControlsMenu';

/**
 * Create component to display controls
 */
const ControlsMenu = component => {
  const path = component.value._root.entries.find( e=> e[0] == "path")[1] ;
  //let instance = Instances.getInstance(path); anti pattern fix: we don't pass the full instance anymore as we have an indirection level through the reducer
  //actions should be executed through the reducer, given an instance path 
  return <ListViewerControlsMenu instance={ path }/>;
}

const Thumbnail = component => (
  <Tooltip
    title={
      <React.Fragment>
        <img src={component.value}
          className="thumbnail-img" />
      </React.Fragment>
    }
  >
    <img src={component.value}
      className="thumbnail-img" />
  </Tooltip>
)

const conf = [
  {
    id: "controls",
    title: "Controls",
    customComponent: ControlsMenu,
    source: entity => entity
  },
  {
    id: "name",
    title: "Name",
    customComponent: component => {
      const entityName = component.value._root.entries.find( e=> e[0] == "path")[1] ;
      return <div onClick={e => click(e)} dangerouslySetInnerHTML={{ __html: "<div>"+entityName+"</div>" }} />
    },
    source : entity => entity
  },
  {
    id: "type",
    title: "Type",
    customComponent: component => {

      const entityType = component.value._root.entries.find( e=> e[0] == "type")[1] ;
      return <div>
        <div style={{ width: "40%", textAlign: "left", float: "left" }} onClick={e => click(e)} dangerouslySetInnerHTML={{ __html: entityType }} />
        <div style={{ textAlign: "right", width: "60%", float: "right" }} dangerouslySetInnerHTML={{ __html: entityType }} />
      </div>
    },
    source : entity => entity
  },
  {
    id: "image",
    title: "Thumbnail",
    customComponent: Thumbnail,
    source: entity => { 

      return entity.thumbnail;
    }
  }
];

export default conf;
