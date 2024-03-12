import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import ListViewerControlsMenu from '../../VFBListViewer/ListViewerControlsMenu';
import { Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { focusInstance } from '../../../reducers/actions/instances';

const facets_annotations_colors = require("../VFBColors").facets_annotations_colors;

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
      const entityName = component.value._root.entries.find( e=> e[0] == "name")[1];
      const entityPath = component.value._root.entries.find( e=> e[0] == "path")[1];

      console.log(component.value._root.entries)
      return <div style={{ width: "100%", textAlign: "left", float: "left" }}>
          <Link 
            component="button"
            underline='none'
            variant="subtitle1"
            sx={{
              textAlign : "left",
              float : "left"
            }}
            onClick={() => {
              focusInstance(entityPath);
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

      const entityType = component.value._root.entries.find( e=> e[0] == "types")[1]?.match(/\[(.*?)\]/)[1];
      const entityPath = component.value._root.entries.find( e=> e[0] == "path")[1];
      const tags = component.value._root.entries.find( e=> e[0] == "tags")[1];
      const chips_cutoff = 3;
      return <div style={{ width: "100%", textAlign: "left", float: "left" }}>
        <div style={{ textAlign: "left", float: "left" }}>
          <Link 
            component="button"
            underline='none'
            variant="subtitle1"
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
              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color
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
