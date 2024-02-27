import { getGlobalTypes } from './actions/types/GlobalTypes';
import { getInstancesTypes } from './actions/types/getInstancesTypes';

export const initialStateGlobalReducer = {
  templateID: "",
  recentSearches : [],
};

const GlobalReducer = (state = initialStateGlobalReducer, response) => {
  switch (response.type) {
     case getGlobalTypes.GET_TEMPLATE_ID:
        return Object.assign({}, state, {
          templateID: response.payload.id
        })
      case getInstancesTypes.GET_INSTANCES_SUCCESS:
      case getGlobalTypes.ADD_RECENT_SEARCH:{
        let updateRecentSearches = [...state.recentSearches];
        if ( !updateRecentSearches?.find( r => r.id === response.payload.Id ) ) {
          updateRecentSearches.push({
            short_form : response.payload.Id,
            label : response.payload.Name,
            id : response.payload.Id,
            facets_annotation : response.payload.Tags
          })
        }
        return Object.assign({}, state, {
          recentSearches: updateRecentSearches
      })
    }
     default:
        return state;
  }
}

export default GlobalReducer;