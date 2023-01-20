import { loadQueryTypes } from "./actions/loadQuery";

const initialState = {
  isLoading: false,
  anatomy_image_query: undefined,
  datasets_query: undefined
};

function createDataSetDictionary(o) {
  let dic = {}
  o.docs.forEach(doc => {
    doc.anat_image_query.forEach( anat => {
      const val = JSON.parse(anat);
      dic[val.term.core.short_form] = { core: val.term.core, description: val.term.description } ;
    })
  })
  return dic ;
}

function createAnatomyQueryDataSet(o) {
  let data = []
  o.docs.forEach(doc => {
    doc.template_2_datasets_query.forEach( anat => {
      const val = JSON.parse(anat);
      val.anatomy_channel_image.forEach( image => {
        data.push(image.channel_image.image.image_folder)
      })
    })
  })
  return data ;
}

const QueryReducer = (state = initialState, action) => {
  switch (action.type) {
     case loadQueryTypes.LOAD_QUERY_STARTED:
        return Object.assign({}, state, {
           isLoading: true
        })
     case loadQueryTypes.LOAD_QUERY_SUCCESS:
        return Object.assign({}, state, {
          anatomy_image_query: createDataSetDictionary(action.payload), 
          datasets_query: createAnatomyQueryDataSet(action.payload),
          isLoading: false
        })
     default:
        return state;
  }
}
export default QueryReducer;