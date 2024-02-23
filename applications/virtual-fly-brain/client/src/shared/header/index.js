import { Box, Button, Link } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import vars from '../../theme/variables';
import MediaQuery from 'react-responsive';
import { History, Logo, Menu as MenuIcon, QueryStats } from "../../icons";
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import { toolbarMenu } from "../../components/configuration/VFBToolbar/vfbtoolbarMenuConfiguration";
import { showComponent } from "../../reducers/actions/layout";

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

  const handleLogoClick = () => {
    console.log('Logo Clicked!')
  }

  const handleHistoryClick = () => {
    console.log('History Clicked!')
  }

  const handleQueryStatsClick = () => {
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
      case ACTIONS.SHOW_COMPONENT:
        console.log("action ", action)
        console.log("component ", component)
        showComponent(action.parameters)
        break;
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