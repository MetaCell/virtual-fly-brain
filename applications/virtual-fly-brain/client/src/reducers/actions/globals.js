import { getGlobalTypes } from './types/GlobalTypes';

export const addRecentSearch = (search, isQuery) => ({
  type: getGlobalTypes.ADD_RECENT_SEARCH,
  payload : {
    Id : search.short_form || search.Id,
    Name : search.label || search.Name,
    Tags : search.facets_annotation || search.Tags,
    IsQuery : isQuery
  }
})

export const setTermInfoOpened = (opened) => ({
  type: getGlobalTypes.OPEN_TERM_INFO,
  payload : {
    opened
  }
})