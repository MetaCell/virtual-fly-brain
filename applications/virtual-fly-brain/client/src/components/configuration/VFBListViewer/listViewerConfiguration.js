import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import ListViewerControlsMenu from '../../VFBListViewer/ListViewerControlsMenu';
import { getUpdatedTags } from '../../../utils/utils';
import Link from '@mui/material/Link';
import { focusInstance, selectInstance } from '../../../reducers/actions/instances';

const colors_config = require("../VFBColors").facets_annotations_colors;
const facets_annotations_colors = getUpdatedTags(colors_config)

/**
 * Create component to display controls
 */
const ControlsMenu = component => {
  const path = component.value._root.nodes.find( e=> e.entry?.[0] == "path").entry[1] ;
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
      const entityName = component.value._root.nodes.find( e=> e.entry?.[0] == "name").entry[1];
      const entityPath = component.value._root.nodes.find( e=> e.entry?.[0] == "path").entry[1];
      const entitySelected = component.value._root.nodes.find( e=> e.entry?.[0] == "selected").entry[1];

      return <div style={{ width: "100%", textAlign: "left", float: "left" }}>
          <Link 
            component="button"
            underline='none'
            variant="subtitle1"
            color={entitySelected ? "yellow" : "white"}
            sx={{
              textAlign : "left",
              float : "left"
            }}
            onClick={() => {
              selectInstance(entityPath);
              focusInstance(entityPath)
            }}>
            {entityName}
          </Link>
        </div>
    },
    source : entity => entity
  },
  {
    id: "type",
    title: "Type",
    customComponent: component => {

      //const entityType = component.value._root.nodes.find( e=> e.entry?.[0] == "types").entry[1]?.match(/\[(.*?)\]/)[1];
      let entityType = null;
      component.value._root.nodes.forEach( e=> e.nodes?.forEach( n=> { if ( n.entry?.[0] == "types" ) { entityType = n.entry?.[1] } }))
      entityType = entityType.match(/\[(.*?)\]/)[1];
      const entityPath = component.value._root.nodes.find( e=> e.entry?.[0] == "path").entry[1];
      
      let tags = null;
      component.value._root.nodes.forEach( e=> e.nodes?.forEach( n=> { if ( n.entry?.[0] == "tags" ) { tags = n.entry?.[1] } }))
      
      const chips_cutoff = 3;
      return <div style={{ width: "100%", textAlign: "left", float: "left" }}>
        <div style={{ textAlign: "left", float: "left" }}>
          <Link 
            component="button"
            underline='none'
            variant="subtitle1"
            color="#428bca"
            onClick={() => {
              focusInstance(entityPath);
            }}>
            {entityType}
          </Link>
        </div>
        <div style={{ textAlign: "left", float: "left" }}> 
        {tags?.slice(0,chips_cutoff).map((tag, index) => {
          return (<Chip
            key={tag + index}
            style={{
              lineHeight: '140%',
              fontSize: '0.625rem',
              alignSelf: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height : 'auto',
              width : 'auto',
              maxWidth: '5.9375rem',
              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
              color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor
            }}
            label={tag}
          />)
        }
        )}
        </div>
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
