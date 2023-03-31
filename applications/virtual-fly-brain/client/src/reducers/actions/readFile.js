import store from '../../store';

export const loadFileType = {
  FILE_READ_INITED : 'FILE_READ_INITED',
  FILE_READ_SUCCESS : 'FILE_READ_SUCCESS',
  FILE_RED_UPDATED  : 'FILE_RED_UPDATED'
}

const readFileAsync = async (url, returnBase64 = false) => {
  const response = await fetch(url);
  if (returnBase64) {
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  } else {
    return response.blob();
  }
};

export const readFile = (url) => {
  return async (dispatch) => {
    const file = {
      url,
      content: null,
      loading: true,
      error: null,
    };

    dispatch({ type: loadFileType.FILE_READ_INITED, payload: file });

    try {
      const content = await readFileAsync(url, true);
      file.content = content;
      file.loading = false;
      dispatch({ type: loadFileType.FILE_RED_UPDATED, payload: file });
    } catch (error) {
      file.error = error;
      file.loading = false;
      dispatch({ type: loadFileType.FILE_RED_UPDATED, payload: file });
    }
  };
};

const initFileWithoutReadingAction = url => ({
  type: loadFileType.FILE_READ_INITED,
  payload: {
    url
  }
});

export const initFileWithoutReading = async (url) => {
  store.dispatch(initFileWithoutReadingAction(url))
}




