import { backendClient } from "./client";

export const get_term_info = (queryId) => {
  return backendClient.get({ method: "get_term_info", payload: { id: queryId } })
}