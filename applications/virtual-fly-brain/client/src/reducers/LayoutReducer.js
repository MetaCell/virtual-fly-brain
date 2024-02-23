import { getLayoutTypes } from './actions/types/getLayoutTypes';
import { widgets } from '../components/layout/widgets'
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const initialStateLayoutReducer = {
  widget : null
};

const LayoutReducer = (state = initialStateLayoutReducer, response) => {
  switch (response.type) {
    case getLayoutTypes.SHOW_COMPONENT: {
      let update = state.widget;
      update = response.payload.id;
      return Object.assign({}, state, {
        widget : update
      });
    }
    default:
       return state;
  }
}
export default LayoutReducer;