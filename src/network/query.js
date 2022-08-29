import { backendClient } from "./client";

export const queryById = (queryId) => {
  return backendClient.get({ endPoint: "vfb_json", method: "query", payload: { q : "id:" + queryId } })
}