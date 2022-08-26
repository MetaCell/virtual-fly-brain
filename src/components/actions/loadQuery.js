import { queryById } from '../../network/query'

export const loadQuery = (queryId) => {
  return queryById(queryId);
}