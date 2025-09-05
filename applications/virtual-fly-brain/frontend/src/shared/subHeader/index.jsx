import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  AngleLeft,
  ClearAll,
  Download,
  History,
  Layers,
  Query,
  Search,
  Upload,
} from "../../icons";
import vars from "../../theme/variables";
import MediaQuery from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import SearchBuilder from "./SearchBuilder";
import { FilterMenu } from "./FilterMenu";
import { resetLoadingState } from "../../reducers/actions/instances";

const navArr = [
  {
    id: 0,
    icon: Upload,
    name: "Upload",
  },
  {
    id: 1,
    icon: Download,
    name: "Download",
  },
  {
    id: 2,
    icon: Query,
    name: "Query",
  },
  {
    id: 3,
    icon: Layers,
    name: "Layer",
  },
  {
    id: 4,
    icon: ClearAll,
    name: "Clear all",
  },
  {
    id: 5,
    icon: History,
    name: "Recent",
  },
];

const {
  tabActiveColor,
  primaryBg,
  secondaryBg,
  searchBoxBg,
  whiteColor,
  shortcutBg,
  blackColor,
  bottomNavBg,
  headerBorderColor,
  lightWhiteColor,
} = vars;

const SubHeader = ({ setBottomNav, bottomNav }) => {
  const [focused, setFocused] = useState(false);
  const [filterOpened, setFilterOpened] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const isLoading = useSelector((state) => state.instances.isLoading);
  const loadingInstances = useSelector(
    (state) => state.instances.loadingInstances
  );
  const finishedLoadedInstances = useSelector(
    (state) => state.instances.finishedLoadedInstances
  );
  const isBulkLoading = useSelector(
    (state) => state.instances.isBulkLoading
  );
  const bulkLoadingCount = useSelector(
    (state) => state.instances.bulkLoadingCount
  );
  const dispatch = useDispatch();
  const classes = {
    root: {
      position: "relative",
    },

    nav: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
    },

    shortcut: {
      backgroundColor: shortcutBg,
      borderRadius: 2,
      // width: '4.1875rem',
      height: "1.75rem",
      color: whiteColor,
    },
  };

  useEffect(() => {
    // For bulk loading, check if all instances are loaded using bulk count
    // For individual loading, use the original logic
    const allLoaded = isBulkLoading 
      ? finishedLoadedInstances >= bulkLoadingCount
      : loadingInstances > 0 && loadingInstances === finishedLoadedInstances;
      
    if (allLoaded) {
      // Add a small delay to show the final loading state before resetting
      const timer = setTimeout(() => {
        dispatch(resetLoadingState());
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [loadingInstances, finishedLoadedInstances, isBulkLoading, bulkLoadingCount, dispatch]);

  return (
    <Box
      sx={{
        ...classes.root,
        display: "flex",
        alignItems: "center",
        py: {
          // xs: 1,
          lg: 0.75,
        },
        px: {
          lg: 1.5,
        },

        borderTop: {
          xs: `0.0625rem solid ${headerBorderColor}`,
          lg: "none",
        },

        borderColor: {
          xs: focused ? "transparent" : headerBorderColor,
        },

        backgroundColor: {
          xs: primaryBg,
          lg: secondaryBg,
        },
      }}
    >
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body1" color={lightWhiteColor}>
            Loading{" "}
            {isBulkLoading && bulkLoadingCount > 0
              ? `instance ${finishedLoadedInstances} of ${bulkLoadingCount}`
              : loadingInstances > 0 && finishedLoadedInstances > 0
              ? `instance ${finishedLoadedInstances} of ${loadingInstances}`
              : " ..."}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          zIndex: 99,
          transition: "all ease-in-out .3s",
          width: {
            lg: focused ? "50rem" : "35rem",
          },
          mx: {
            lg: "auto",
          },
          borderRadius: {
            xs: focused ? "0.375rem 0.375rem 0 0" : 0,
            lg: focused ? "0.5rem 0.5rem 0 0" : 2,
          },
          pl: {
            xs: 1.5,
            lg: 1.5,
          },
          py: {
            xs: 1,
            lg: 0.5,
          },
          pr: {
            xs: 1.5,
            lg: 0.5,
          },
          backgroundColor: {
            xs: focused ? bottomNavBg : primaryBg,
            lg: focused ? bottomNavBg : searchBoxBg,
          },
          boxShadow: focused
            ? `0 0.25rem 6.25rem ${blackColor}, 0 0 5rem rgba(0, 0, 0, 0.6)`
            : "none",
        }}
        display="flex"
        alignItems="center"
      >
        {focused ? (
          <AngleLeft style={{ margin: 0 }} size={20} />
        ) : (
          <Search style={{ margin: 0 }} />
        )}

        <Box flexGrow={1} px={1}>
          <SearchBuilder
            applyFilters={selectedFilters}
            focused={focused}
            setFilterOpened={setFilterOpened}
            filterOpened={filterOpened}
            setFocused={setFocused}
            bottomNav={bottomNav}
            setBottomNav={setBottomNav}
          />
        </Box>
        <FilterMenu
          classes={classes}
          focused={focused}
          setFilterOpened={setFilterOpened}
          setSelectedFilters={setSelectedFilters}
        />
      </Box>

      <MediaQuery minWidth={1200}>
        <Box display="flex" flexWrap="wrap" sx={classes.nav}>
          {navArr.map((item, index) => (
            <Button
              aria-label={item.name}
              onClick={() => {
                setBottomNav(index);
              }}
              sx={{
                minWidth: "0.0625rem",
              }}
              key={`${item.id}_${item.name}`}
            >
              <item.icon
                color={item?.id === bottomNav ? tabActiveColor : "white"}
              />
            </Button>
          ))}
        </Box>
      </MediaQuery>
    </Box>
  );
};

export default SubHeader;
