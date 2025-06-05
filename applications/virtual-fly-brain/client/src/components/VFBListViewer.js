import React, { Component } from "react";
import ListViewer from "@metacell/geppetto-meta-ui/list-viewer/ListViewer";
import listViewerConf from "./configuration/VFBListViewer/listViewerConfiguration";
import { connect } from "react-redux";

require("../css/VFBListViewer.less");

const VISUAL_TYPE = "VisualType";
const COMPOSITE_VISUAL_TYPE = "CompositeVisualType";

/**
 * Wrapper class that connects geppetto-client's ListViewer component with VFB.
 */
class VFBListViewer extends Component {
  constructor(props) {
    super(props);
  }

  filter(pathObj) {
    const { path, type } = pathObj;
    return false;
  }

  getColumnConfiguration() {
    return listViewerConf;
  }

  getConfiguredInstances() {
    const visuals = {};
    const instances =
      window.Instances?.map((instance) => ({
        path: instance.getPath(),
        metaType: "VisualType", //instance.getMetaType(),
        type: instance.getType(),
        static: true,
        selected: instance.selected,
      })) || [];
    instances.forEach((instance) => {
      const { path, metaType, type } = instance;
      const id = path.split(".")[0];
      const instanceVisual = {
        id,
        name: id,
        types: [type],
        tags: ["test", "test2"],
      };
      visuals[id] = instanceVisual;
    });
    return Object.values(visuals);
  }

  render() {
    const instances =
      this.props.allLoadedInstances
        .filter((i) => i.meshCreated)
        .map((instance) => ({
          path: instance.metadata?.Id,
          name: instance.metadata?.Name,
          types: instance.metadata?.Meta?.Types,
          tags: instance.metadata?.Tags,
          metaType: VISUAL_TYPE,
          type: COMPOSITE_VISUAL_TYPE,
          thumbnail: instance.metadata?.Images
            ? instance.metadata?.Images[
                Object.keys(instance.metadata?.Images)[0]
              ][0].thumbnail
            : undefined,
          static: true,
          selected: instance.selected,
        })) || [];

    return instances?.length > 0 ? (
      <div
        id="VFBLayers_component"
        style={{ backgroundColor: "rgb(53, 51, 51)" }}
      >
        <ListViewer
          instances={instances}
          className="vfbListViewer"
          handler={this}
          filter={(instance) => true}
          filterFn={() => console.log("Filtering")}
          columnConfiguration={this.getColumnConfiguration()}
          infiniteScroll={true}
        />
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allLoadedInstances: state.instances.allLoadedInstances,
  };
}

export default connect(mapStateToProps)(VFBListViewer);
