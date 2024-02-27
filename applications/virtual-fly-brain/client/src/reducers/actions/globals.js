import { getGlobalTypes } from './types/GlobalTypes';

export const addRecentSearch = (search) => ({
  type: getGlobalTypes.ADD_RECENT_SEARCH,
  payload : {
    Id : search.short_form,
    Name : search.label,
    Tags : search.facets_annotation,
  }
})