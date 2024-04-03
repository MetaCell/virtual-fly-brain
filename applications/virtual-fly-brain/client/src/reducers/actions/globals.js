import { getGlobalTypes } from './types/GlobalTypes';

export const addRecentSearch = (search, isQuery) => ({
  type: getGlobalTypes.ADD_RECENT_SEARCH,
  payload : {
    Id : search.short_form || search.Id,
    Name : search.label || search.Name || search.query?.label,
    Tags : search.facets_annotation || search.Tags || search.query?.Tags,
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

export const removeAllRecentSearch = (id, isQuery) => ({
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

export const resetErrors = () => ({
  type: getGlobalTypes.RESET_ERRORS,
  payload : {}
});