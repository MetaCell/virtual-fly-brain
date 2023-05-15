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

export const get_instance = async (short_form) => {
  const url =`https://vfb.dev.metacell.us/get_instances?short_form=${short_form}`;
  console.log("Url ", url)
  let response = await fetch(url)
  .then(response => { 
    return response.json() 
  })
  .then((data) => {
    console.log("data " , data);
    return data;
  });

  return response;
}