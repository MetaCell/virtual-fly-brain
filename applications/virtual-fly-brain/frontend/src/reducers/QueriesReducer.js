import { getGlobalTypes } from "./actions/types/GlobalTypes";
import { getQueriesTypes } from "./actions/types/getQueriesTypes";

export const initialStateQueriesReducer = {
  queries: [],
  isLoading: false,
  error: false,
  errorMessage: undefined,
  errorID: undefined,
};

const QueriesReducer = (state = initialStateQueriesReducer, response) => {
  switch (response.type) {
    case getQueriesTypes.GET_QUERIES_STARTED:
      return Object.assign({}, state, {
        isLoading: true,
      });
    case getQueriesTypes.GET_QUERIES_SUCCESS: {
      let updatedQueries = [...state.queries];
      response.payload.query.active = true;
      if (Array.isArray(response.payload.query.queries)) {
\        let findQuery = updatedQueries?.find(
  (i) => i.short_form === response.payload.short_form
);

if (findQuery === undefined) {
  // Create a NEW query entry with ALL queries at once
  const queriesObject = {};
  response.payload.query.queries.forEach((query) => {
    query.active = true;
    queriesObject[query["query"]] = query;
  });

  const newQuery = {
    short_form: response.payload.short_form,
    name: response.payload.query.name,
    queries: queriesObject,
  };
  updatedQueries.push(newQuery);
} else {
  // Query entry exists, add/update individual queries
  response.payload.query.queries.forEach((query) => {
    query.active = true;
    findQuery.queries[query["query"]] = query;
  });
}
      } else {
  let findQuery = updatedQueries?.find(
    (i) => i.short_form === response.payload.short_form
  );
  if (findQuery === undefined) {
    const newQuery = {
      short_form: response.payload.short_form,
      name: response.payload.query.name,
      queries: { [response.payload.type]: response.payload.query },
    };
    updatedQueries.push(newQuery);
  } else {
    findQuery.type = response.payload.type;
    findQuery.queries[response.payload.type] = response.payload.query;
  }
}

return Object.assign({}, state, {
  queries: updatedQueries,
  isLoading: false,
});
    }
    case getQueriesTypes.UPDATE_QUERIES:
return Object.assign({}, state, {
  queries: response.payload,
});
    case getQueriesTypes.DELETE_QUERY:
return Object.assign({}, state, {
  queries: state.queries?.filter(
    (i) => i.short_form !== response.payload.id
  ),
  isLoading: false,
  error: false,
  errorMessage: undefined,
});
    case getQueriesTypes.GET_QUERIES_FAILURE:
return Object.assign({}, state, {
  error: true,
  errorMessage: response.payload.error,
  errorID: response.payload.id,
});
    case getGlobalTypes.RESET_ERRORS: {
  return Object.assign({}, state, {
    error: false,
    errorMessage: undefined,
  });
}
    default:
return state;
  }
};

export default QueriesReducer;
