import store from '../../store';
import { getGraphTypes } from './types/getGraphTypes';

const updateGraphSuccess = instance => ({
  type: getGraphTypes.UPDATE_GRAPH,
  payload: {
    ...instance
  }
});

const updateGraphSelectionSuccess = selection => ({
    type: getGraphTypes.UPDATE_GRAPH_SELECTION,
    payload: {
      ...selection
    }
  });

export const updateGraph = async (instance) => {
    store.dispatch(updateGraphSuccess(instance))
}

export const updateGraphSelection = async (selection) => {
    store.dispatch(updateGraphSelectionSuccess(selection))
}