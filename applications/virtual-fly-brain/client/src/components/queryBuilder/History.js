import React, { useEffect } from "react";
import QueryHeader from "./QueryHeader";
import { Item } from "./HistoryItem";
import { Box } from "@mui/material";
import { useSelector } from 'react-redux'
import { removeAllRecentSearch } from "../../reducers/actions/globals";
import { useDispatch } from "react-redux";

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const History = () => {
  const recentSearches = useSelector(state => state.globalInfo.recentSearches);
  const [filteredSearches, setFilteredSearches] = React.useState(recentSearches);
  const dispatch = useDispatch();
  const initialFilters = {
    "filters" : {
      "Id" : "short_form",
      "Name" : "label"
    },
    "tags" : "facets_annotation"
  };
  const [filters, setFilters] = React.useState(initialFilters);

  useEffect( () => {
    let tags = {...initialFilters.filters};
    recentSearches?.forEach( (query, index ) => {
      query.facets_annotation?.forEach( tag => {
        if ( tags?.[tag] == undefined ){
          tags[tag] = tag;
        }
      })
    })
    setFilters({...filters, filters : tags});
  }, [recentSearches])

  const updateFilters = (searches) => {
    setFilteredSearches(searches)
  }

  const removeFromHistory = () => {
    dispatch(removeAllRecentSearch())
  };

  React.useEffect( () => {
    setFilteredSearches(recentSearches)
  }, [recentSearches])

  return (
    <>
      <QueryHeader filters={filters} recentSearches={filteredSearches} setFilteredSearches={updateFilters} title={recentSearches?.length + " results in history"} clearAll={removeFromHistory} />

      <Box p={1}>
        {filteredSearches?.map((search, index) => (
          <Item
            key={`recentSearch-${index}`}
            search={search}
            chipColors={facets_annotations_colors}
            index={index}
          />
        ))}
      </Box>
    </>
  )
};

export default History;