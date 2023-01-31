import { backendClient } from "./client";

export const get_term_info = (queryId) => {
  return backendClient.get({ endPoint: "get_term_info", method: "query", payload: { q : "id:" + queryId } })
}