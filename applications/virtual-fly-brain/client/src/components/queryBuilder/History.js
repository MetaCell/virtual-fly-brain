import React, { useState } from "react";
import QueryHeader from "./QueryHeader";
import { Item } from "./HistoryItem";
import vars from "../../theme/variables";
import { Box } from "@mui/material";
import { useSelector } from 'react-redux'

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const History = () => {
  const recentSearches = useSelector(state => state.globalInfo.recentSearches);
  const [filteredSearches, setFilteredSearches] = React.useState(recentSearches);
  const [filters, setFilters] = React.useState({
    "Id" : "short_form",
    "Name" : "label"
  });

  const updateFilters = (searches) => {
    setFilteredSearches(searches)
  }

  React.useEffect( () => {
    setFilteredSearches(recentSearches)
  }, [recentSearches])

  return (
    <>
      <QueryHeader filters={filters} recentSearches={filteredSearches} setFilteredSearches={updateFilters} title={recentSearches?.length + " results in history"} />

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