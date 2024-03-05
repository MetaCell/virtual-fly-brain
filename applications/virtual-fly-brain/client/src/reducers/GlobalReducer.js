import { getGlobalTypes } from './actions/types/GlobalTypes';
import { getInstancesTypes } from './actions/types/getInstancesTypes';

export const initialStateGlobalReducer = {
  templateID: "VFB_00101567",
  termInfoOpened : true,
  recentSearches : [],
};

const GlobalReducer = (state = initialStateGlobalReducer, response) => {
  switch (response.type) {
     case getGlobalTypes.GET_TEMPLATE_ID:
        return Object.assign({}, state, {
          templateID: response.payload.id
        })
      case getGlobalTypes.OPEN_TERM_INFO:
        return Object.assign({}, state, {
          termInfoOpened: response.payload.opened
        })
      case getInstancesTypes.GET_INSTANCES_SUCCESS:
      case getGlobalTypes.ADD_RECENT_SEARCH:{
        let updateRecentSearches = [...state.recentSearches];
        let isQuery = response.payload.IsQuery || false;
        let matchSearch = updateRecentSearches?.find( r => r.id === response.payload.Id && r.is_query == isQuery);
        if ( !matchSearch ) {
          updateRecentSearches.push({
            short_form : response.payload.Id,
            label : response.payload.Name,
            id : response.payload.Id,
            facets_annotation : response.payload.Tags,
            is_query : response.payload.IsQuery
          })
        }
        return Object.assign({}, state, {
          recentSearches: updateRecentSearches
      })
    }
    case getGlobalTypes.REMOVE_RECENT_SEARCH:{
      let updateRecentSearches = [...state.recentSearches];
      let update = updateRecentSearches?.filter( r => r.id !== response.payload.id);
      return Object.assign({}, state, {
        recentSearches: update
    })
    }
     default:
        return state;
  }
}

export default GlobalReducer;