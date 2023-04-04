import { getGlobalTypes } from './actions/types/GlobalTypes';

const initialState = {
  templateID: ""
};

const GlobalReducer = (state = initialState, response) => {
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