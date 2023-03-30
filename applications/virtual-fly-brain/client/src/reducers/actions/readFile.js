export const loadFileType = {
  FILE_READ_SUCCESS : 'FILE_READ_SUCCESS',
  FILE_RED_UPDATED : 'FILE_RED_UPDATED'
}

const readFile = (url) => {
  return async (dispatch) => {
    const file = {
      url,
      content: null,
      loading: true,
      error: null,
    };

    dispatch({ type: loadFileType.FILE_READ_STARTED, payload: file });

    try {
      const content = await readFileAsync(url);
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




