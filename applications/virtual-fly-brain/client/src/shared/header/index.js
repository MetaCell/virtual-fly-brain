import { Box, Button, Link } from "@mui/material";
import React, { useState } from "react";
import vars from '../../theme/variables';
import MediaQuery from 'react-responsive';
import { History, Logo, Menu as MenuIcon, QueryStats } from "../../icons";
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import { toolbarMenu } from "../../components/configuration/VFBToolbar/vfbtoolbarMenuConfiguration";
const { primaryBg, headerBoxShadow, headerBorderColor } = vars;

const Header = () => {
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

  return (
    <Box
      display='flex'
      sx={{
        ...classes.root,
        py: 1.5,
        borderBottom: {
          xs: `0.0625rem solid ${headerBorderColor}`,
          lg: 'none'
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
          xs: 1.5
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
          sx={{
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
              lg: 1.5
            }
          }}
        >
          <Menu
            configuration={toolbarMenu}
            menuHandler={() => {}}
          />
          {/* <Link underline="hover" href='#'>Virtual Fly Brain</Link>
          <Link underline="hover" href='#'>Tools</Link>
          <Link underline="hover" href='#'>History</Link>
          <Link underline="hover" href='#'>Templates</Link>
          <Link underline="hover" href='#'>Datasets</Link>
          <Link underline="hover" href='#'>View</Link>
          <Link underline="hover" href='#'>Help</Link> */}
        </Box>
      </Box>

      <MediaQuery minWidth={1200}>
        <Button variant="outlined">
          <QueryStats />
          Queries for V_ilpn (FlyEM-HB:2064165421)
        </Button>
      </MediaQuery>
    </Box>
  )
};

export default Header;