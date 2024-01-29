import { getGlobalTypes } from './actions/types/GlobalTypes';

export const initialStateGlobalReducer = {
  templateID: "",
  querySelected : [{ id : "", label : "" }],
  querySelectedVisible : true
};

const GlobalReducer = (state = initialStateGlobalReducer, response) => {
  switch (response.type) {
     case getGlobalTypes.GET_TEMPLATE_ID:
        return Object.assign({}, state, {
          templateID: true
        })
     default:
        return state;
  }
}

export default GlobalReducer;