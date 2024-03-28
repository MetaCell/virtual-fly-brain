import { getGlobalTypes } from './actions/types/GlobalTypes';
import { getInstancesTypes } from './actions/types/getInstancesTypes';

export const initialStateGlobalReducer = {
  templateID: "VFB_00101567",
  termInfoOpened : true,
  queryComponentOpened : false,
  recentSearches : [],
  firstIDLoaded : false,
  alignedTemplates : true,
  misalignedTemplate : null
};

const GlobalReducer = (state = initialStateGlobalReducer, response) => {
  switch (response.type) {
      case getGlobalTypes.GET_TEMPLATE_ID:
        return Object.assign({}, state, {
          templateID: response.payload.id
        })
      case getGlobalTypes.SET_TEMPLATE_ID:
        return Object.assign({}, state, {
          templateID: response.payload.id
        })
      case getGlobalTypes.OPEN_TERM_INFO:
        return Object.assign({}, state, {
          termInfoOpened: response.payload.opened
        })
      case getGlobalTypes.FIRST_ID_LOADED:
          return Object.assign({}, state, {
            firstIDLoaded: true
          })
      case getGlobalTypes.ALIGN_TEMPLATES:
        return Object.assign({}, state, {
          alignedTemplates: response.payload.aligned,
          misalignedTemplate : response.payload.templateID
        })
      case getGlobalTypes.OPEN_QUERY_COMPONENT:
        return Object.assign({}, state, {
          queryComponentOpened: response.payload.opened
        })
      case getInstancesTypes.GET_INSTANCES_SUCCESS:
      case getGlobalTypes.ADD_RECENT_SEARCH:{
        let updateRecentSearches = [...state.recentSearches];
        let isQuery = response.payload.IsQuery || false;
        let matchSearch = updateRecentSearches?.find( r => r.id === response.payload.Id);
        if ( !matchSearch || ( isQuery && matchSearch )) {
          updateRecentSearches.push({
            short_form : response.payload.Id,
            label : response.payload.Name,
            id : response.payload.Id,
            facets_annotation : response.payload.Tags,
            is_query : response.payload.IsQuery || false
          })
        }
        return Object.assign({}, state, {
          recentSearches: updateRecentSearches
        })
      }
      case getGlobalTypes.REMOVE_RECENT_SEARCH:{
        let updateRecentSearches = [...state.recentSearches];
        if ( response.payload.isQuery ){
          updateRecentSearches = updateRecentSearches?.filter( r => !r.is_query || r.id !== response.payload.id );
        } else {
          updateRecentSearches = updateRecentSearches?.filter( r => r.id !== response.payload.id || r.is_query );
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
