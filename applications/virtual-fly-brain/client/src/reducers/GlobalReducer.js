import { Return } from '../icons';
import { getGlobalTypes } from './actions/types/GlobalTypes';
import { getInstancesTypes } from './actions/types/getInstancesTypes';
import { getLayoutTypes } from './actions/types/getLayoutTypes';

export const initialStateGlobalReducer = {
  templateID: "VFB_00101567",
  termInfoOpened : true,
  queryComponentOpened : false,
  recentSearches : [],
  firstIDLoaded : false,
  alignedTemplates : true,
  misalignedTemplate : null,
  misalignedIDs : {},
  showSliceDisplay : {},
  autoSaveLayout : false,
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
      case getGlobalTypes.ALIGN_TEMPLATES:{
        const aligned = response.payload.aligned;
        const id = response.payload.templateID
        return Object.assign({}, state, {
          alignedTemplates: aligned,
          misalignedTemplate : id,
          misalignedIDs : {...state.misalignedIDs, [id] : id }
        })
      }
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
            is_query : response.payload.IsQuery || false,
            type : response.payload.Type
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
      case getGlobalTypes.REMOVE_ALL_RECENT_SEARCH: {
        return Object.assign({}, state, {
          recentSearches: []
        })
      }
      case getGlobalTypes.SHOW_SLICE_DISPLAY : {
        return Object.assign( {}, state, {
          showSliceDisplay : {
            params : {
              data : response.payload.data?.data || state.showSliceDisplay.data,
              textureURL : response.payload.data?.textureUrl || state.showSliceDisplay.textureURL,
              id : response.payload.data?.id || state.showSliceDisplay.id,
              visible : response.payload.data?.visible || state.showSliceDisplay.visible
            },
            action : "addSliceDisplay"
          }
        })
      }
      case getGlobalTypes.MODIFY_SLICE_DISPLAY : {
        return Object.assign( {}, state, {
          showSliceDisplay : {
            params : {
              data : response.payload.data?.data || state.showSliceDisplay.data,
              textureURL : response.payload.data?.textureUrl || state.showSliceDisplay.textureURL,
              id : response.payload.data?.id || state.showSliceDisplay.id,
              visible : response.payload.data?.visible || state.showSliceDisplay.visible
            },
            action : "modifySliceDisplay"
          }
        })
      }
      case getLayoutTypes.AUTOSAVE_LAYOUT : {
        return Object.assign({}, state, {
          autoSaveLayout: !state.autoSaveLayout
        });
      }
      default:
        return state;
  }
}

export default GlobalReducer;
