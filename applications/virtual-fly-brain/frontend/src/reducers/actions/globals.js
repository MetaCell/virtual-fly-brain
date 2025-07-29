import { getGlobalTypes } from './types/GlobalTypes';

export const addRecentSearch = (search, isQuery) => ({
  type: getGlobalTypes.ADD_RECENT_SEARCH,
  payload : {
    Id : search.short_form || search.Id,
    Name : search.label || search.Name || search.query?.label,
    Tags : search.facets_annotation || search.Tags || search.query?.Tags,
    Type : search.type || search.query?.type,
    IsQuery : isQuery
  }
})

export const removeRecentSearch = (id, isQuery) => ({
  type: getGlobalTypes.REMOVE_RECENT_SEARCH,
  payload : {
    id : id,
    isQuery : isQuery
  }
})

export const removeAllRecentSearch = () => ({
  type: getGlobalTypes.REMOVE_ALL_RECENT_SEARCH,
  payload : {}
})

export const setTermInfoOpened = (opened) => ({
  type: getGlobalTypes.OPEN_TERM_INFO,
  payload : {
    opened
  }
})

export const setFirstIDLoaded = () => ({
  type: getGlobalTypes.FIRST_ID_LOADED,
  payload : {}
})

export const setAlignTemplates = (aligned, templateID) => ({
  type: getGlobalTypes.ALIGN_TEMPLATES,
  payload : { aligned, templateID }
})

export const setTemplateID = (id) => ({
  type: getGlobalTypes.SET_TEMPLATE_ID,
  payload : { id }
})

export const setQueryComponentOpened = (opened) => ({
  type: getGlobalTypes.OPEN_QUERY_COMPONENT,
  payload : {
    opened
  }
});

export const showSliceDisplay = (data) => ({
  type : getGlobalTypes.SHOW_SLICE_DISPLAY,
  payload : {
    data : data
  }
})

export const modifySliceDisplay = (data) => ({
  type : getGlobalTypes.MODIFY_SLICE_DISPLAY,
  payload : {
    data : data
  }
})

export const resetErrors = () => ({
  type: getGlobalTypes.RESET_ERRORS,
  payload : {}
});

export const cameraControlAction = (action) => ({
  type : getGlobalTypes.CAMERA_EVENT,
  payload : {
    action : action
  }
});
