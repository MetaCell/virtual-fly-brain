/* eslint-disable no-tabs */
import React from 'react';
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
var Rnd = require('react-rnd').default;

require('../css/VFBToolbar.less');

const popperStyles = {
  root: {
    top: '1px',
    backgroundColor: '#444141f2',
    borderRadius: 0,
    color: '#ffffff',
    fontSize: '12px',
    fontFamily: 'Barlow Condensed, Khand, sans-serif',
    minWidth: '110px',
    borderLeft: '1px solid #585858',
    borderRight: '1px solid #585858',
    borderBottom: '1px solid #585858',
    borderBottomLeftRadius: '2px',
    borderBottomRightRadius: '2px',
  }
};

const sectionStyles = {
  root1: {
    background: '#010101',
    borderRadius: 0,
    border: 0,
    boxShadow: '0px 0px',
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Barlow Condensed, Khand, sans-serif',
    margin: '0px 0px 0px 0px',
    minWidth: '44px',
    height: '30px',
    textTransform: 'capitalize',
    textAlign: 'left',
    justifyContent: 'start',
    marginTop: '1px'
  },
  root2: {
    background: "#11bffe",
    backgroundColor: "#11bffe",
    borderRadius: 0,
    border: 0,
    boxShadow: '0px 0px',
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Barlow Condensed, Khand, sans-serif',
    margin: '0px 0px 0px 0px',
    minWidth: '44px',
    height: '30px',
    textTransform: 'capitalize',
    textAlign: 'left',
    justifyContent: 'start',
    marginTop: '1px'
  }
};

export default class VFBToolBar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null,
      htmlChild: undefined
    }

    this.menuConfiguration = require('./configuration/VFBToolbar/vfbtoolbarMenuConfiguration').toolbarMenu;
    this.aboutHTML = require('./configuration/VFBToolbar/vfbtoolbarHTML').about;
    this.feedbackHTML = require('./configuration/VFBToolbar/vfbtoolbarHTML').feedback;
    this.contributeHTML = require('./configuration/VFBToolbar/vfbtoolbarHTML').contribute;

    this.clickAbout = this.clickAbout.bind(this);
    this.menuHandler = this.menuHandler.bind(this);
    this.clickFeedback = this.clickFeedback.bind(this);
    this.clickContribute = this.clickContribute.bind(this);
    this.clickQuickHelp = this.clickQuickHelp.bind(this);
  }

  componentWillMount () {
    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css?family=Khand:300,400&display=swap"

    head.appendChild(link);
  }

  clickFeedback () {
    
  }

  clickAbout () {
    var htmlContent = this.aboutHTML;
    this.props.htmlOutputHandler(htmlContent);
    window.ga('vfb.send', 'pageview', (window.location.pathname + '?page=About'));
  }

  clickContribute () {
    var htmlContent = this.contributeHTML;
    this.props.htmlOutputHandler(htmlContent);
    window.ga('vfb.send', 'pageview', (window.location.pathname + '?page=Contribute'));
  }
  
  clickQuickHelp () {

  }

  menuHandler (click) {
    switch (click.handlerAction) {
    case 'openNewTab':
      click.parameters.map((item, index) => {
        window.ga('vfb.send', 'pageview', item);
        window.open(item, '_blank');
      })
      break;
    case 'redirectTo':
      window.location.href = click.parameters[0];
      break;
    case 'clickAbout':
      this.clickAbout();
      break;
    case 'clickFeedback':
      this.clickFeedback();
      break;
    case 'clickContribute':
      this.clickContribute();
      break;
    case 'clickQuickHelp':
      this.clickQuickHelp();
      break;
    default:
      return this.props.menuHandler(click);
    }
  }

  render () {
    const style = { padding: 2 };
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : null;

    return (
      <Rnd
        enableResizing={{
          top: false, right: false, bottom: false, left: false,
          topRight: false, bottomRight: false, bottomLeft: false,
          topLeft: false
        }}
        default={{
          x: 0, y: 0,
          height: 30,
          width: '100%'
        }}
        className="vfbToolBarClass"
        disableDragging={true}
        ref={e => {
          this.rnd = e;
        }}
        style={{ "backgroundColor": "#010101" }} >
        <nav className="vfbToolBar">
          <div className="toolBarLeft">
            <div className="toolBarDivL">
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Menu
                configuration={this.menuConfiguration}
                menuHandler={this.menuHandler}/>
            </div>
          </div>

          <div className="toolBarCenter">
            <div className="toolBarDivC">
            </div>
          </div>

          <div className="toolBarRight">
            <div className="toolBarDivR"> 
              VFB
            </div>
          </div>
        </nav>
      </Rnd>
    );
  }
}
