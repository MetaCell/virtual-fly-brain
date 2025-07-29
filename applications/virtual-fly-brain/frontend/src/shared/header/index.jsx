/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import vars from '../../theme/variables';
import MediaQuery from 'react-responsive';
import { Box, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import { History, Logo, Menu as MenuIcon, QueryStats } from "../../icons";
import { getQueries, updateQueries } from '../../reducers/actions/queries';
import { loadCustomLayout, saveCustomLayout } from "../../reducers/actions/layout";
import { updateWidget } from "@metacell/geppetto-meta-client/common/layout/actions";
import { selectInstance, focusInstance, getInstanceByID, triggerInstanceFailure } from '../../reducers/actions/instances';
import { toolbarMenu } from "../../components/configuration/VFBToolbar/vfbtoolbarMenuConfiguration";
import { setTermInfoOpened } from "../../reducers/actions/globals";
import layout1 from "../../components/layout/layout1";
import layout2 from "../../components/layout/layout2";
import layout3 from "../../components/layout/layout3";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";

const { primaryBg, headerBoxShadow } = vars;

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
  const widgets = useSelector(state => state.widgets);
  const firstIdLoaded = useSelector(state => state.globalInfo.firstIDLoaded);
  let autoSaveLayout = useSelector(state => state.globalInfo.autoSaveLayout);
  let menuConfig = toolbarMenu(autoSaveLayout);
  const ACTIONS = menuConfig.actions;

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
  const menuHandler = (action, _component) => {
    switch (action.handlerAction){
      case ACTIONS.SHOW_WIDGET: {
        const newWidget = { ...widgets[action.parameters[0]] }
        const layoutManager = getLayoutManagerInstance();
        const activeTabset = layoutManager.model.getRoot().getModel().getActiveTabset();
        if (activeTabset) {
          newWidget.defaultPanel = layoutManager.model.getRoot().getModel().getActiveTabset().getId();
          newWidget.panelName = layoutManager.model.getRoot().getModel().getActiveTabset().getId();
        } else {
          // dig from the root children, check the type, if tabset, then set the default panel, if not then get the children of the child and continue until you find a tabset.
          // if a tabset is not found, then raise an error
          let root = layoutManager.model.getRoot();
          let tabset = undefined;
          while (!tabset) {
            tabset = root.getChildren().find(child => child.getType() === 'tabset');
            if (!tabset) {
              root = root.getChildren()[0];
            }
          }
          if (tabset) {
            newWidget.defaultPanel = tabset.getId();
            newWidget.panelName = tabset.getId();
          } else {
            console.error('No tabset found in the root children');
          }
        }
        newWidget.status = WidgetStatus.ACTIVE;
        dispatch(updateWidget(newWidget));
        break;
      }
      case ACTIONS.SHOW_COMPONENT:
        setBottomNav(action.parameters[0])
        break;
      case ACTIONS.SHOW_TERM_INFO:{
        dispatch(setTermInfoOpened(true))
        break;
      }
      case ACTIONS.OPEN_NEW_TAB:
        action.parameters.map((item, _index) => {
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
        let matchQuery = updatedQueries?.find( q => q.short_form === action.parameters[0] );
        updatedQueries?.forEach( query => {
          if( query.queries ){
            Object.keys(query.queries)?.forEach( q => query.queries[q].active = false );
          }
        });
        if ( matchQuery?.queries?.[action?.parameters[1]] ) {
          matchQuery.queries[action.parameters[1]].active = true;
          updateQueries(updatedQueries);
          setBottomNav(2)
        } else {
          getQueries(action.parameters[0],action.parameters[1])
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
                parameters: [i?.short_form, i?.type]
              }
            },
          );
        })
        return historyList;
      }
      case ACTIONS.LOAD_LAYOUT:{
        if (!firstIdLoaded) {
          dispatch(triggerInstanceFailure('No instance loaded, wait please ...'));
          break;
        }
        switch (action.parameters[0]){
          case 'layout1':
            dispatch(loadCustomLayout(layout1));
            break;
          case 'layout2':
            dispatch(loadCustomLayout(layout2));
            break;
          case 'layout3':
            dispatch(loadCustomLayout(layout3));
            break;
          default:
            console.log('layout not implemented');
        }
        break;
      }
      case ACTIONS.SAVE_LAYOUT: {
        dispatch(saveCustomLayout());
        break;
      }
      case ACTIONS.LOAD_CUSTOM_LAYOUT: {
        const vfb_layout = localStorage.getItem('vfb_layout');
        if (vfb_layout !== null && vfb_layout !== undefined) {
          const layout = {
            version: Math.random(),
            redux: JSON.parse(vfb_layout)
          }
          dispatch(loadCustomLayout(layout));
        } else {
          console.log('No layout saved');
        }
        break;
      }
    }
  }

  useEffect(() => {
    menuConfig = toolbarMenu(autoSaveLayout);
  }, [autoSaveLayout]);

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
            configuration={menuConfig}
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
