import { getGraphTypes } from './actions/types/getGraphTypes';

export const initialStateGraphReducer = {
  graphQueryIndex : 0,
  sync : false,
  visible: false,
  instanceOnFocus : undefined,
  selection : undefined,
};

const GraphReducer = (state = initialStateGraphReducer, response) => {
  switch (response.type) {
    case getGraphTypes.UPDATE_GRAPH:
      return Object.assign({}, state, {
        graphQueryIndex : response.data.queryIndex,
        sync : response.data.sync,
        visible: response.data.visible,
        instanceOnFocus : response.data.instance
      });
    case getGraphTypes.UPDATE_GRAPH_SELECTION:
      return Object.assign({}, state, {
        selection : response.payload.data.selection,
        instanceOnFocus : response.payload.data.instance
      });
    default:
        return state;
  }
}
export default GraphReducer;
