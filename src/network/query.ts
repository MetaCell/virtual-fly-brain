import { backendClient } from "./client";

export function queryById(queryId) {
  return backendClient.get({ endPoint: "vfb_json", method: "query", payload: { id : queryId } })
}