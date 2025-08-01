import React, { Component } from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from "prop-types";
import LoopIcon from '@material-ui/icons/Loop';

/**
 * Shows the data value as a link
 */
class DropDownQueries extends Component {
  constructor (props) {
    super(props);
    this.state = { dropDownAnchorEl: null };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick (selection) {
    this.setState( { dropDownAnchorEl: null } );
    this.props.handleMenuClick(selection);
  }

  render () {
    let self = this;

    return (
      <div>
        <Tooltip placement="right" title={`Refresh for ${self.props.stateInstanceOnFocus?.metadata?.Name}`}>
          <LoopIcon key="tooltip-icon"
            onClick={ self.props.sync } style={{fontSize: '1.3rem', zIndex : "1000",
              cursor : "pointer",
              marginTop : "20px",
              left : "10px",
              color : self.props.syncColor,}} />
        </Tooltip>
        <Tooltip placement="right" title="Options">
          <div
            style={
              {
                zIndex : "1000" ,
                cursor : "pointer",
                marginTop : "5px",
                left : "10px",
                width: "1.3rem",
                height: "1.3rem",
                backgroundPosition: "center",
                backgroundImage: `url(${self.props.stylingConfiguration.icons.dropdown})`
              }
            }
            aria-label="more"
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            onClick={ event => self.setState( { dropDownAnchorEl : event.currentTarget } )}
          />
        </Tooltip>
        <Menu
          id="dropdown-menu"
          anchorEl={self.state.dropDownAnchorEl}
          keepMounted
          open={Boolean(self.state.dropDownAnchorEl)}
          onClose={ event => self.setState( { dropDownAnchorEl : null } )}
          PaperProps={{
            style: {
              marginTop: '32px',
              borderStyle: "solid",
              borderColor: "#585858",
              borderRadius: "0px 0px 2px 2px",
              color: self.props.stylingConfiguration.dropDownTextColor,
              backgroundColor: self.props.stylingConfiguration.dropDownBackgroundColor,
            }
          }}
        >
          {self.props.stylingConfiguration.dropDownQueries.map(item => (
            <MenuItem
              key={item.label(self.props.stateInstanceOnFocus?.metadata.Id)}
              onClick={() => self.handleMenuClick(item)}
              style={{
                fontSize : "14px",
                fontFamily: "Barlow Condensed",
              }}
              onMouseEnter={e => {
                e.target.style.color = self.props.stylingConfiguration.dropDownHoverTextColor;
                e.target.style.backgroundColor = self.props.stylingConfiguration.dropDownHoverBackgroundColor;
              }
              }
              onMouseLeave={e => {
                e.target.style.color = self.props.stylingConfiguration.dropDownTextColor;
                e.target.style.backgroundColor = self.props.stylingConfiguration.dropDownBackgroundColor;
              }
              }
            >
              {item.label(self.props.stateInstanceOnFocus?.metadata.Name)}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

DropDownQueries.propTypes = { classes: PropTypes.object.isRequired };

export default DropDownQueries;
