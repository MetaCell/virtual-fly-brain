import React from "react";
import { SkeletonOff, SkeletonOn } from "../../../icons";
import { NEURON } from "../../../utils/constants";

var ACTIONS = {
  COLOR : 'color',
  INFO : 'info',
  DELETE : 'delete',
  SELECT : 'select',
  DESELECT : 'deselect',
  SHOW : 'show',
  HIDE : 'hide',
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
        background: 'transparent',
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
        fontWeight: '300',

        '&:hover': {
          background: 'transparent',
        }
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
      icon: <i className="fa fa-sliders" style={{'marginRight': '5px'}}/>,
      activeColor : "red",
      action: "",
      position: "bottom-start",
      caret : {
        show : true, 
        expandedIcon : <i className="fa fa-angle-down" style={{'fontSize': '12px'}}/>,
        closedIcon : <i className="fa fa-angle-up" style={{'fontSize': '12px'}}/>
      },
      list: [
        {
          label: "Show Info",
          icon: "fa fa-info",
          action: { handlerAction: ACTIONS.INFO },
        },
        {
          list : [  
            { toggle : {
              condition : entity => { return entity.selected ? true : false }, //entity.isSelected(),
              isVisible : entity => { return entity.visible },
              options : {
                false : {
                  label: "Select",
                  icon: "fa fa-check-circle-o",
                  action: { handlerAction: ACTIONS.SELECT, }
                },
                true : {
                  label: "Unselect",
                  icon: "fa fa-check-circle",
                  action: { handlerAction: ACTIONS.DESELECT, }
                }
              }
            } }
          ]
        },
        {
          list : [
              { toggle : {
                condition : entity => { return entity.visible ? true : false},
                isVisible :  () => { return true },
                options : {
                  false : {
                    label: "Show",
                    icon: "fa fa-eye",
                    action: { handlerAction: ACTIONS.SHOW }
                  },
                  true : {
                    label: "Hide",
                    icon: "fa fa-eye-slash",
                    action: { handlerAction: ACTIONS.HIDE }
                  }
                }
            }}
          ]
        },
        {
          label: "Color",
          icon: "fa fa-color",
          action: { handlerAction: ACTIONS.COLOR, },
          isVisible : entity => { return entity.visible }
        },
        {
          label: "Delete",
          icon: "fa fa-trash",
          isVisible : entity => !entity.metadata?.IsTemplate, //entity.getId() != window.templateID,
          action: { handlerAction: ACTIONS.DELETE },
        },
        {
          label: "Zoom To",
          icon: "fa fa-search-plus",
          action: { handlerAction: ACTIONS.ZOOM_TO },
          isVisible : entity => { return entity.visible }
        },
        {
          list: [
            {
              toggle : {
                condition : entity => { return entity?.visibleMesh ? true : false },
                options : {
                  false : {
                    label: "Enable 3D Volume",
                    icon: "fa fa-eye",
                    action: { handlerAction: ACTIONS.SHOW_VOLUME }
                  },
                  true : {
                    label: "Disable 3D Volume",
                    icon: "fa fa-eye-slash",
                    action: { handlerAction: ACTIONS.HIDE_VOLUME }
                  }
                }
              }
            },
          ]
        },
        {
          list: [
            {
              toggle : {
                condition : entity => { return entity?.skeleton?.skeleton?.visible || entity?.skeleton?.sphere?.visible ? true : false },
                isVisible : entity => { return entity?.metadata?.SuperTypes?.find( s => s === NEURON) },
                options : {
                  false : {
                    label: "Enable 3D Skeleton",
                    icon: <SkeletonOn/>,
                    tooltip : "Show 3D Skeleton",
                    action: { handlerAction: ACTIONS.SHOW_SKELETON }
                  },
                  true : {
                    label: "Disable 3D Skeleton",
                    icon: <SkeletonOff/>,
                    action: { handlerAction: ACTIONS.HIDE_SKELETON }
                  }
                }
              }
            },
          ]
        },
      ]
    }
  ]
};

export default controlsMenuConf;
