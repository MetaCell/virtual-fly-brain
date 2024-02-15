import React from "react";
import QueryHeader from "./QueryHeader";
import { Item } from "./HistoryItem";
import vars from "../../theme/variables";
import { Box } from "@mui/material";

const facets_annotations_colors = require("../configuration/VFBColors").facets_annotations_colors;

const recentSearch = [
  {
    title: "CDF0 (anlage in statu nascendi)",
    tags: [
      {
        id: 0,
        label: "Anatomy"
      },
      {
        id: 1,
        label: "Nervous system"
      },
      {
        id: 2,
        label: "Neuron"
      },
      {
        id: 3,
        label: "Nervous projection bundle"
      },
      {
        id: 4,
        label: "Larva"
      }
    ]
  },
  {
    title: "a00c_a41 (a00c_a4 (L1EM:2511238))",
    tags: [
      {
        id: 0,
        label: "Anatomy"
      },
      {
        id: 1,
        label: "Nervous system"
      }
    ]
  }
]

const History = () => {
  return (
    <>
      <QueryHeader title="8 results in history" />

      <Box p={1}>
        {recentSearch?.map((search, index) => (
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