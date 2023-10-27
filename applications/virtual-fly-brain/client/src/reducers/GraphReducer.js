export const initialStateGraphReducer = {
  graphQueryIndex : 0,
  sync : false,
  visible: false,
  instanceOnFocus : undefined
};

const UPDATE_GRAPH = 'UPDATE_GRAPH';

const GraphReducer = (state = initialStateGraphReducer, response) => {
  switch (response.type) {
     case UPDATE_GRAPH:
        return Object.assign({}, state, {
          graphQueryIndex : response.data.queryIndex,
          sync : response.data.sync,
          visible: response.data.visible,
          instanceOnFocus : response.data.instance
        });
     default:
        return state;
  }
}

export default GraphReducer;