import React from "react";

var ACTIONS = {
  COLOR : 'color',
  INFO : 'info',
  DELETE : 'delete',
  SELECT : 'select',
  DESELECT : 'deselect',
  SHOW : 'hide',
  HIDE : 'show',
  ZOOM_TO : 'zoom_to',
  SHOW_VOLUME : 'show_volume',
  HIDE_VOLUME : 'hide_volume',
  SHOW_SKELETON : 'show_skeleton',
  HIDE_SKELETON : 'hide_skeleton',
};

const controlsMenuConf = {
  itemOptions: { customArrow: <i style={ { float : "right" } } className="fa fa-caret-right" /> },
  // Global configuration for Menu buttons and drop down
  global: {
    buttonsStyle: {
      standard: {
        background: 'rgb(53, 51, 51)',
        borderRadius: 0,
        border: 0,
        boxShadow: '0px 0px',
        color: '#ffffff',
        fontSize: '16px',
        fontFamily: 'Khand, sans-serif',
        margin: '0px 0px 0px 0px',
        minWidth: '44px',
        height: '30px',
        textTransform: 'capitalize',
        textAlign: 'left',
        justifyContent: 'start',
        marginTop: '1px',
        fontWeight: '300'
      }
    },
    labelsStyle: {
      standard: {
        backgroundColor: '#44414112',
        borderRadius: 0,
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: 'Khand, sans-serif',
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: '300',
        minHeight: '30px',
        height: '30px'
      },
      hover: {
        background: "#11bffe",
        backgroundColor: "#11bffe",
        borderRadius: 0,
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: 'Khand, sans-serif',
        paddingTop: 0,
        paddingBottom: 0,
        fontWeight: '300',
        minHeight: '30px',
        height: '30px'
      }
    }
  },
  actions : ACTIONS,
  // Buttons to display inside the Menu
  buttons: [
    {
      label: "",
      icon: <i className="fa fa-eye" />,
      activeColor : "",
      action: "",
      position: "bottom-start",
      caret : {
        show : true, 
        expandedIcon : <i className="fa fa-angle-down" />,
        closedIcon : <i className="fa fa-angle-up" />
      },
      list: [
        {
          label: "Show Info",
          icon: "fa fa-info",
          action: { handlerAction: ACTIONS.INFO }
        },
        // {
          // toggle : {
          //   condition : entity => true, //entity.isSelected(),
          //   isVisible : entity => true, //entity.isVisible(),
          //   options : {
          //     false : {
          //       label: "Select",
          //       icon: "fa fa-check-circle-o",
          //       action: { handlerAction: ACTIONS.SELECT, }
          //     },
          //     true : {
          //       label: "Unselect",
          //       icon: "fa fa-check-circle",
          //       action: { handlerAction: ACTIONS.DESELECT, }
          //     }
          //   }
          // }
        // },
        // {
          // toggle : {
          //   condition : entity => true, //entity.isVisible(),
          //   options : {
          //     false : {
          //       label: "Show",
          //       icon: "fa fa-eye",
          //       action: { handlerAction: ACTIONS.SHOW, }
          //     },
          //     true : {
          //       label: "Hide",
          //       icon: "fa fa-eye-slash",
          //       action: { handlerAction: ACTIONS.HIDE, }
          //     }
          //   }
          // }
        // },
        {
          label: "Delete",
          icon: "fa fa-trash",
          isVisible : entity => true, //entity.getId() != window.templateID,
          action: { handlerAction: ACTIONS.DELETE },
        },
        {
          label: "Zoom To",
          icon: "fa fa-search-plus",
          action: { handlerAction: ACTIONS.ZOOM_TO },
          isVisible : entity => entity.isVisible()
        },
        {
          label: "Show Volume",
          icon: "",
          action: {},
          position: "right-start",
          list: [
            {
              // toggle : {
              //   condition : entity => { return true },
              //   isVisible : entity => { return true },
              //   options : {
              //     false : {
              //       label: "Enable 3D Volume",
              //       icon: "gpt-shapeshow",
              //       action: { handlerAction: ACTIONS.SHOW_VOLUME }
              //     },
              //     true : {
              //       label: "Disable 3D Volume",
              //       icon: "gpt-shapehide",
              //       action: { handlerAction: ACTIONS.HIDE_VOLUME }
              //     }
              //   }
              // }
            },
          ]
        },
        {
          label: "Show Skeleton",
          icon: "",
          action: {},
          position: "right-start",
          list: [
            {
              // toggle : {
              //   condition : entity => { return true },
              //   isVisible : entity => { return true },
              //   options : {
              //     false : {
              //       label: "Enable 3D Skeleton",
              //       icon: "gpt-3dhide",
              //       tooltip : "Show 3D Skeleton",
              //       action: { handlerAction: ACTIONS.SHOW_SKELETON }
              //     },
              //     true : {
              //       label: "Disable 3D Skeleton",
              //       icon: "gpt-3dshow",
              //       action: { handlerAction: ACTIONS.HIDE_SKELETON }
              //     }
              //   }
              //}
            },
          ]
        },
      ]
    }
  ]
};

export default controlsMenuConf;