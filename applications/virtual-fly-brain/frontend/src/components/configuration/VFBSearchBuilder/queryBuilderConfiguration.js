import Bloodhound from "bloodhound-js";

export const queryBuilderDatasourceConfig = {
  VFB: {
    url: 'https://solr.virtualflybrain.org/solr/ontology/select?q=$SEARCH_TERM$+OR+$SEARCH_TERM$*+OR+*$SEARCH_TERM$*&defType=edismax&qf=label^100+synonym^100+label_autosuggest_ws+label_autosuggest_e+label_autosuggest+synonym_autosuggest_ws+synonym_autosuggest+shortform_autosuggest&indent=true&fl=short_form+label+synonym+id+facets_annotation+type:"class"&start=0&pf=true&rows=100&wt=json&bq=shortform_autosuggest:VFB*^110.0+shortform_autosuggest:FBbt*^100.0+label_s:""^2+synonym_s:""+short_form=FBbt_00003982^2+facets_annotation:Deprecated^0.001',
    crossDomain: true,
    id: "short_form",
    label: { field: "label", formatting: "$VALUE$" },
    explode_fields: [{ field: "short_form", formatting: "$VALUE$ ($LABEL$)" }],
    explode_arrays: [{ field: "synonym", formatting: "$VALUE$ ($LABEL$)" }],
    type: {
      class: {
        actions: ["window.fetchVariableThenRun('$ID$', function(){ GEPPETTO.QueryBuilder.addQueryItem({ term: '$LABEL$', id: '$ID$'}); });"],
        icon: "fa-dot-circle-o"
      },
      individual: {
        actions: ["window.fetchVariableThenRun('$ID$', function(){ GEPPETTO.QueryBuilder.addQueryItem({ term: '$LABEL$', id: '$ID$'}); });"],
        icon: "fa-square-o"
      }
    },
    queryNameToken: '$NAME',
    resultsFilters: {
      getItem: function (record, header, field) {
        var recordIndex = header.indexOf(field);
        return record[recordIndex]
      },
      getId: function (record) {
        return record[0]
      },
      getName: function (record) {
        return record[1]
      },
      getDescription: function (record) {
        return record[2]
      },
      getType: function (record) {
        return record[3]
      },
      getImageData: function (record) {
        return record[4]
      },
      getScore: function (record) {
        return record[5]
      },
      getRecords: function (payload) {
        return payload.results.map((item) => {
          return item.values
        })
      },
      getHeaders: function (payload) {
        return payload.header;
      }
    },
    bloodhoundConfig: {
      datumTokenizer: function (d) {
        return Bloodhound.tokenizers.nonword(d.label.replace('_', ' '));
      },
      queryTokenizer: function (q) {
        return Bloodhound.tokenizers.nonword(q.replace('_', ' '));
      },
      sorter: function (a, b) {
        var InputString = $("#query-typeahead").val();
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
        Bloodhound.tokenizers.nonword("test thing-here12 34f").join(' ');
        if (Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ') == Bloodhound.tokenizers.nonword(a.label.toLowerCase()).join(' ')) {
          return -1;
        }
        if (Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ') == Bloodhound.tokenizers.nonword(b.label.toLowerCase()).join(' ')) {
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
        if (Bloodhound.tokenizers.nonword(a.label.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) < 0 && Bloodhound.tokenizers.nonword(b.label.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) > -1) {
          return 1;
        }
        if (Bloodhound.tokenizers.nonword(b.label.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) < 0 && Bloodhound.tokenizers.nonword(a.label.toLowerCase()).join(' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ')) > -1) {
          return -1;
        }
        // also with underscores ignored
        if (Bloodhound.tokenizers.nonword(a.label.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) < 0 && Bloodhound.tokenizers.nonword(b.label.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) > -1) {
          return 1;
        }
        if (Bloodhound.tokenizers.nonword(b.label.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) < 0 && Bloodhound.tokenizers.nonword(a.label.toLowerCase()).join(' ').replace('_', ' ').indexOf(Bloodhound.tokenizers.nonword(InputString.toLowerCase()).join(' ').replace('_', ' ')) > -1) {
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
      }
    }
  }
};