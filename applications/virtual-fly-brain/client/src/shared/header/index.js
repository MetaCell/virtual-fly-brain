import { Box, Button, Link } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import vars from '../../theme/variables';
import MediaQuery from 'react-responsive';
import { History, Logo, Menu as MenuIcon, QueryStats } from "../../icons";
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import { toolbarMenu } from "../../components/configuration/VFBToolbar/vfbtoolbarMenuConfiguration";
import { showComponent } from "../../reducers/actions/layout";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import { selectInstance, focusInstance, getInstanceByID } from '../../reducers/actions/instances';
import { getQueries, updateQueries } from '../../reducers/actions/queries';
import { setTermInfoOpened } from "../../reducers/actions/globals";

const { primaryBg, headerBoxShadow, headerBorderColor } = vars;
const ACTIONS = toolbarMenu.actions;

const Header = ({setBottomNav}) => {
  const classes = {
    root: {
      background: primaryBg,
    },

    iconGroup: {
      '& svg + svg': {
        marginLeft: '0.75rem'
      }
    },
  };

  const [navShow, setNavShow] = useState(false)
  const dispatch = useDispatch();
  const recentSearches = useSelector(state => state.globalInfo.recentSearches)
  const queries = useSelector(state => state.queries.queries)
  const allLoadedInstances = useSelector(state => state.instances.allLoadedInstances)

  const handleLogoClick = () => {
    // TODO: what to do here?
    console.log('Logo Clicked!')
  }

  const handleHistoryClick = () => {
    // TODO: what to do here?
    console.log('History Clicked!')
  }

  const handleQueryStatsClick = () => {
    // TODO: what to do here?
    console.log('QueryStats Clicked!')
  }

  const handleMenuClick = () => {
    setNavShow(prev => !prev)
  }

  /**
   * Handler function triggered when a Menu item is clicked.
   */
  const menuHandler = (action, component) => {
    switch (action.handlerAction){
      case ACTIONS.SHOW_WIDGET:
        dispatch(showComponent(action.parameters[0], { status : WidgetStatus.ACTIVE }))
        break;
      case ACTIONS.SHOW_COMPONENT:
        setBottomNav(action.parameters[0])
        break;
      case ACTIONS.SHOW_TERM_INFO:{
        dispatch(setTermInfoOpened(true))
        break;
      }
      case ACTIONS.OPEN_NEW_TAB:
        action.parameters.map((item, index) => {
          window.open(item, '_blank');
        })
        break;
      case ACTIONS.SELECT_INSTANCE:{
        let matchInstance = allLoadedInstances?.find( q => q.metadata?.Id === action.parameters[0] );
        if (matchInstance ) {
          focusInstance(action.parameters[0])
          selectInstance(action.parameters[0])
        } else {
          getInstanceByID(action.parameters[0], true, true, true)
        }
        break;
      }
      case ACTIONS.RUN_QUERY:{
        let updatedQueries = [...queries];
        let matchQuery = updatedQueries?.find( q => q.Id === action.parameters[0] );
        updatedQueries?.forEach( q => q.active = false )
        if ( matchQuery ) {
          matchQuery.active = true;
          updateQueries(updatedQueries);
          setBottomNav(2)
        } else {
          getQueries({ short_form : action.parameters[0] })
          setBottomNav(2)
        }
        break;
      }
      case ACTIONS.HISTORY_MENU_INJECTOR:{
        var historyList = [];
        // Add instances to history menu
        recentSearches?.reverse()?.forEach( i => {
          historyList.push(
            {
              label: i?.label,
              icon: i?.is_query ? "fa fa-quora" : "fa fa-eye", // TODO : replace with figma icon
              action: {
                handlerAction: i?.is_query ? ACTIONS.RUN_QUERY : ACTIONS.SELECT_INSTANCE,
                parameters: [i?.short_form]
              }
            },
          );
        })
        return historyList;
      }
    }
  }

  return (
    <Box
      display='flex'
      sx={{
        ...classes.root,
        py: {
          xs: 1.5,
          lg: 0
        },
        boxShadow: {
          xs: headerBoxShadow,
          lg: 'none'
        },
        alignItems: {
          lg: 'center'
        },
        justifyContent: {
          lg: 'space-between'
        },
        flexDirection: {
          xs: 'column',
          lg: 'row'
        },
        px: {
          xs: 1.5,
          lg: 2,
        }
      }} >
      <Box
        sx={{
          display: {
            lg: 'flex'
          },
          alignItems: {
            lg: 'center'
          },
        }}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            flexGrow: {
              xs: 1,
              lg: 0
            }
          }}
        >
          <Logo onClick={handleLogoClick} />

          <MediaQuery maxWidth={1199}>
            <Box
              display='flex'
              alignItems='center'
              sx={classes.iconGroup}
            >
              <History onClick={handleHistoryClick} />
              <QueryStats onClick={handleQueryStatsClick} />
              <MenuIcon onClick={handleMenuClick} />
            </Box>
          </MediaQuery>
        </Box>

        <Box
          sx={ {
            '& span': {
              display: {
                xs: 'block',
                lg: 'inline-block'
              },
            },
            display: {
              xs: navShow ? 'flex' : 'none',
              lg: 'flex'
            },
            flexDirection: {
              xs: 'column',
              lg: 'row'
            },
            mt: {
              xs: 1.5,
              lg: 0
            },
            ml: {
              lg: 1
            }
          }}
        >
          <Menu
            configuration={toolbarMenu}
            menuHandler={menuHandler}
          />
        </Box>
      </Box>

      <MediaQuery minWidth={1200}>
        <Button
          onClick={() => setBottomNav((prev) => prev === 2 ? null : 2)}
          variant="outlined"
        >
          <QueryStats size={16} />
          Queries for V_ilpn (FlyEM-HB:2064165421)
        </Button>
      </MediaQuery>
    </Box>
  )
};

export default Header;