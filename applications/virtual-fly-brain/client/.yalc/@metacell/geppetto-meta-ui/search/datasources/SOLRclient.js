"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResultsSOLR = getResultsSOLR;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var globalConfiguration = {
  "url": "https://solr-dev.virtualflybrain.org/solr/ontology/select",
  "query_settings": {
    "q": "$SEARCH_TERM$ OR $SEARCH_TERM$* OR *$SEARCH_TERM$*",
    "defType": "edismax",
    "qf": "label synonym label_autosuggest_ws label_autosuggest_e label_autosuggest synonym_autosuggest_ws synonym_autosuggest_e synonym_autosuggest shortform_autosuggest has_narrow_synonym_annotation has_broad_synonym_annotation",
    "indent": "true",
    "fl": "short_form,label,synonym,id,type,has_narrow_synonym_annotation,has_broad_synonym_annotation,facets_annotation",
    "start": "0",
    "fq": ["type:class OR type:individual OR type:property", "ontology_name:(vfb)", "shortform_autosuggest:VFB* OR shortform_autosuggest:FB* OR is_defining_ontology:true"],
    "rows": "100",
    "wt": "json",
    "bq": "is_obsolete:false^100.0 shortform_autosuggest:VFB*^110.0 shortform_autosuggest:FBbt*^100.0 is_defining_ontology:true^100.0 label_s:\"\"^2 synonym_s:\"\" in_subset_annotation:BRAINNAME^3 short_form:FBbt_00003982^2"
  }
};
var solrConfiguration = {
  params: {
    json: {
      params: globalConfiguration.query_settings
    }
  }
};
function getResultsSOLR(searchString, returnResults, sorter, configuration) {
  var url = configuration.url;
  if (configuration.url === undefined) {
    url = globalConfiguration.url;
  }
  if (configuration.query_settings !== undefined) {
    solrConfiguration.params.json.params = configuration.query_settings;
  }

  // hack to clone the object
  var tempConfig = JSON.parse(JSON.stringify(solrConfiguration));
  tempConfig.params.json.params.q = solrConfiguration.params.json.params.q.replace(/\$SEARCH_TERM\$/g, searchString);
  _axios["default"].get("".concat(url), tempConfig).then(function (response) {
    var blob = new Blob(["onmessage = " + refineResults]);
    var blobUrl = window.URL.createObjectURL(blob);
    var worker = new Worker(blobUrl);
    worker.onmessage = function (e) {
      switch (e.data.resultMessage) {
        case "OK":
          returnResults("OK", e.data.params.results, searchString);
          window.URL.revokeObjectURL(blobUrl);
          break;
      }
    };
    worker.postMessage({
      message: "refine",
      params: {
        results: response.data.response.docs,
        value: searchString
      }
    });

    // refineResults(searchString, response.data.response.docs, returnResults);
  })["catch"](function (error) {
    console.log('%c --- SOLR datasource error --- ', 'background: black; color: red');
    console.log(error);
    returnResults("ERROR", undefined, searchString);
  });
}
;
function refineResults(e) {
  var sorter = function sorter(a, b) {
    var InputString = self.spotlightString;

    // move exact matches to top
    if (InputString == a.label) {
      return -1;
    }
    if (InputString == b.label) {
      return 1;
    }
    // close match without case matching
    if (InputString.toLowerCase() == a.label.toLowerCase()) {
      return -1;
    }
    if (InputString.toLowerCase() == b.label.toLowerCase()) {
      return 1;
    }
    // match ignoring joinging nonwords
    if (InputString.toLowerCase().split(/\W+/).join(' ') == a.label.toLowerCase().split(/\W+/).join(' ')) {
      return -1;
    }
    if (InputString.toLowerCase().split(/\W+/).join(' ') == b.label.toLowerCase().split(/\W+/).join(' ')) {
      return 1;
    }
    // match against id
    if (InputString.toLowerCase() == a.id.toLowerCase()) {
      return -1;
    }
    if (InputString.toLowerCase() == b.id.toLowerCase()) {
      return 1;
    }
    // pick up any match without nonword join character match
    if (a.label.toLowerCase().split(/\W+/).join(' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ')) < 0 && b.label.toLowerCase().split(/\W+/).join(' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ')) > -1) {
      return 1;
    }
    if (b.label.toLowerCase().split(/\W+/).join(' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ')) < 0 && a.label.toLowerCase().split(/\W+/).join(' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ')) > -1) {
      return -1;
    }
    // also with underscores ignored
    if (a.label.toLowerCase().split(/\W+/).join(' ').replace('_', ' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ').replace('_', ' ')) < 0 && b.label.toLowerCase().split(/\W+/).join(' ').replace('_', ' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ').replace('_', ' ')) > -1) {
      return 1;
    }
    if (b.label.toLowerCase().split(/\W+/).join(' ').replace('_', ' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ').replace('_', ' ')) < 0 && a.label.toLowerCase().split(/\W+/).join(' ').replace('_', ' ').indexOf(InputString.toLowerCase().split(/\W+/).join(' ').replace('_', ' ')) > -1) {
      return -1;
    }
    // if not found in one then advance the other
    if (a.label.toLowerCase().indexOf(InputString.toLowerCase()) < 0 && b.label.toLowerCase().indexOf(InputString.toLowerCase()) > -1) {
      return 1;
    }
    if (b.label.toLowerCase().indexOf(InputString.toLowerCase()) < 0 && a.label.toLowerCase().indexOf(InputString.toLowerCase()) > -1) {
      return -1;
    }
    // if the match is closer to start than the other move up
    if (a.label.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && a.label.toLowerCase().indexOf(InputString.toLowerCase()) < b.label.toLowerCase().indexOf(InputString.toLowerCase())) {
      return -1;
    }
    if (b.label.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && b.label.toLowerCase().indexOf(InputString.toLowerCase()) < a.label.toLowerCase().indexOf(InputString.toLowerCase())) {
      return 1;
    }
    // if the match in the id is closer to start then move up
    if (a.id.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && a.id.toLowerCase().indexOf(InputString.toLowerCase()) < b.id.toLowerCase().indexOf(InputString.toLowerCase())) {
      return -1;
    }
    if (b.id.toLowerCase().indexOf(InputString.toLowerCase()) > -1 && b.id.toLowerCase().indexOf(InputString.toLowerCase()) < a.id.toLowerCase().indexOf(InputString.toLowerCase())) {
      return 1;
    }
    // move the shorter synonyms to the top
    if (a.label < b.label) {
      return -1;
    } else if (a.label > b.label) {
      return 1;
    } else {
      return 0;
    } // if nothing found then do nothing.
  };
  self.spotlightString = e.data.params.value;
  var refinedResults = [];
  e.data.params.results.map(function (item) {
    if (item.hasOwnProperty("synonym")) {
      item.synonym.map(function (innerItem) {
        var newRecord = {};
        if (innerItem !== item.label) {
          Object.keys(item).map(function (key) {
            switch (key) {
              case "label":
                newRecord[key] = innerItem + " (" + item.label + ")";
                break;
              case "synonym":
                break;
              default:
                newRecord[key] = item[key];
            }
          });
          refinedResults.push(newRecord);
        }
      });
      var newRecord = {};
      Object.keys(item).map(function (key) {
        if (key !== "synonym") {
          if (key === "label") {
            newRecord[key] = item[key] + " (" + item["short_form"] + ")";
          } else {
            newRecord[key] = item[key];
          }
        }
      });
      refinedResults.push(newRecord);
    } else {
      var _newRecord = {};
      Object.keys(item).map(function (key) {
        if (key === "label") {
          _newRecord[key] = item[key] + " (" + item["short_form"] + ")";
        } else {
          _newRecord[key] = item[key];
        }
      });
      refinedResults.push(_newRecord);
    }
  });
  var sortedResults = refinedResults.sort(sorter);
  this.postMessage({
    resultMessage: "OK",
    params: {
      results: sortedResults
    }
  });
  self.close();
}
//# sourceMappingURL=SOLRclient.js.map