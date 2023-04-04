import { backendClient } from "./client";

export const get_term_info = async (queryId) => {
  const url =`https://vfb.dev.metacell.us/get_term_info?id=${queryId}`;
  console.log("Url ", url)
  let response = await fetch(url)
  .then(response => { 
    console.log("Response ", response)
    return response.json() 
  })
  .then((data) => {
    console.log("data " , data);
    return data;
  });

  return response;
}

export const get_instance = (short_form) => {
  return backendClient.get({ method: "get_instances", payload: { short_form: JSON.stringify(short_form) } })
}