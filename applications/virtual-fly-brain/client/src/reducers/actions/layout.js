import store from '../../store';
import { getLayoutTypes } from './types/getLayoutTypes';

const showComponentMessage = id => ({
  type: getLayoutTypes.SHOW_COMPONENT,
  payload: {
    id
  }
});


export const showComponent = async (id) => {
  store.dispatch(showComponentMessage(id))
}