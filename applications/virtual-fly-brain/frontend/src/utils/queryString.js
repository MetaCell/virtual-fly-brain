export const queryString = (name) => {
  const urlParams = new URLSearchParams(decodeURIComponent(window.location.search));
  return urlParams.get(name)?.replace(' ', '+');
}

export const getQueryStringParam = (surl, name) => {
  const url = new URL(surl);
  return  url.searchParams.get(name);
}

export const getQueryStringJson = (surl) => {
  return JSON.parse(decodeURIComponent(surl.split('?')[1]));
}