export const get_term_info = async (queryId) => {
  const url =`${API_URL}/get_term_info?id=${queryId}`;
  let response = await fetch(url)
  .then(response => { 
    return response.json() 
  })
  .then((data) => {
    return data;
  });
  return response;
}

export const get_queries = async (queryId) => {
  const url =`${API_URL}/get_term_info?id=${queryId}`;
  let response = await fetch(url)
  .then(response => { 
    return response.json() 
  })
  .then((data) => {
    return data;
  });
  return response;
}

export const get_instance = async (short_form) => {
  const url =`${API_URL}/get_term_info?id=${short_form}`;
  let response = await fetch(url)
  .then(response => { 
    return response.json() 
  })
  .then((data) => {
    return data;
  });

  return response;
}