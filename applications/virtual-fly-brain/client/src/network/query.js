import { backendClient } from "./client.js";

export const get_term_info = (queryId) => {
  return backendClient.get({ method: "get_term_info", payload: { id: queryId } })
}

export const get_instance = (short_form) => {
  return backendClient.get({ method: "get_instances", payload: { short_form: JSON.stringify(short_form) } })
}