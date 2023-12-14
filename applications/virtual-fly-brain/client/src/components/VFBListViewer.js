import React, { Component } from 'react';
import ListViewer from "@metacell/geppetto-meta-ui/list-viewer/ListViewer"
import { connect } from 'react-redux';

require('../css/VFBListViewer.less');

const VISUAL_TYPE = "VisualType";
const COMPOSITE_VISUAL_TYPE = "CompositeVisualType";

/**
 * Wrapper class that connects geppetto-client's ListViewer component with VFB.
 */
class VFBListViewer extends Component {

  constructor (props) {
    super(props);
  }
  
  filter (pathObj) {
    const { path, type } = pathObj;
    return false
  }
  

  getAllPaths() {
    return window.Instances?.map(instance => ({
      "path": instance.getPath(),
      "metaType": "VisualType", //instance.getMetaType(),
      "type": instance.getType(),
      "static": true
    })) || [];
  }
  
  render () {
    const instances = this.getAllPaths();
    return <div id="VFBLayers_component" style= { { backgroundColor : "rgb(53, 51, 51)" } } >
      <ListViewer
        instances={instances}
        className = "vfbListViewer"
        handler={this}
        filter={() => true}
        filterFn={() => console.log("Filtering")}
        infiniteScroll={true}
      />
    </div>
  }
}


function mapStateToProps (state) {

  return { 
    idsList : state.instances.allLoadedInstances?.map( (instance) => instance.Id ) || [],
    instancesList : state.instances.augmentedInstances 
  }
}

export default connect(mapStateToProps)(VFBListViewer);
