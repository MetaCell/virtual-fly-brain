import { loadFileType } from "./actions/readFile";

const initialState = {
  files: [],
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case loadFileType.FILE_READ_STARTED:
      return {
        ...state,
        files: [...state.files, action.payload],
      };
    case loadFileType.UPDATED:
      const index = state.files.findIndex(
        (file) => file.url === action.payload.url
      );
      if (index === -1) {
        return state;
      }
      const files = [...state.files];
      files[index] = {
        ...files[index],
        content: action.payload.content,
        loading: action.payload.loading,
        error: action.payload.error,
      };
      return {
        ...state,
        files,
      };
    default:
      return state;
  }
};