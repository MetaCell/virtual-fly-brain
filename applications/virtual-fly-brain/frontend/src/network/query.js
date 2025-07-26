import Resources from '@metacell/geppetto-meta-core/Resources';

export const get_term_info = async (queryId) => {
  const url =`${import.meta.env.VITE_API_URL}/get_term_info?id=${queryId}`;
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
  const url =`${import.meta.env.VITE_API_URL}/get_term_info?id=${queryId}`;
  let response = await fetch(url)
  .then(response => {
    return response.json()
  })
  .then((data) => {
    return data;
  });
  return response;
}

export const get_query_results = async (id, queryType) => {
  const url =`${import.meta.env.VITE_API_URL}/run_query?id=${id}&query_type=${queryType}`;
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
  const url =`${import.meta.env.VITE_API_URL}/get_term_info?id=${short_form}`;
  let response = await fetch(url)
  .then(response => {
    return response.json()
  })
  .then((data) => {
    return data;
  });

  return response;
}

export const get_3d_mesh = async (targetInstance, objURL) => {
  let response = await fetch(objURL)
    .then(response => response.text())
    .then(base64Content => {
      const instance = {
        "eClass": "SimpleInstance",
        "id": targetInstance?.Id,
        "name": targetInstance?.Name,
        "type": { "eClass": "SimpleType" },
        "visualValue": {
          "eClass": Resources.OBJ,
          "obj" : objURL
        }, 
        "visible" : true,
        "color" : targetInstance?.color
      }

      window[objURL] = base64Content;

      return instance;

    });

    return response;
}
