import Resources from '@metacell/geppetto-meta-core/Resources';

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

export const get_3d_mesh = async (targetInstance) => {
  let response = await fetch(targetInstance?.metadata?.Images?.[Object.keys(targetInstance?.metadata?.Images)[0]][0].obj)
    .then(response => response.text())
    .then(base64Content => {
      const instance = {
        "eClass": "SimpleInstance",
        "id": targetInstance?.metadata?.Id,
        "name": targetInstance?.metadata?.Name,
        "type": { "eClass": "SimpleType" },
        "visualValue": {
          "eClass": Resources.OBJ,
          'obj': base64Content
        }, 
        "visible" : true,
        "color" : targetInstance?.color
      }

      return instance;
    });

    return response;
}