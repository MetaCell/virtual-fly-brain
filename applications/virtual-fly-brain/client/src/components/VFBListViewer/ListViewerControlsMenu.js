import React, { Component } from "react";
import Menu from "@metacell/geppetto-meta-ui/menu/Menu";
import { connect } from 'react-redux';
import { ChromePicker } from 'react-color';
import { getInstanceByID, removeInstanceByID, selectInstance, changeColor,
  show3DMesh, hide3DMesh, focusInstance, show3DSkeleton, hide3DSkeleton } from '../../reducers/actions/instances';

const controlsConfiguration = require('../configuration/VFBListViewer/controlsMenuConfiguration').default;
const ACTIONS = controlsConfiguration.actions;

/**
 * Menu component to display controls for VFB List Viewer
 */
class ListViewerControlsMenu extends Component {
  constructor (props) {
    super(props);
    this.state = { displayColorPicker : false }
    this.menuHandler = this.menuHandler.bind(this);
    this.iterateConfList = this.iterateConfList.bind(this);
    this.visibleButton = this.visibleButton.bind(this);
    this.updateControlsConfiguration = this.updateControlsConfiguration.bind(this);
    this.monitorMouseClick = this.monitorMouseClick.bind(this);

    // Keep track of color picker action and ID
    this.colorPickerBtnId = '';
    this.colorPickerActionFn = '';
    this.colorPickerContainer = undefined;
  }
  
  /**
   * Close color picker when clicking outside of it
   */
  monitorMouseClick (e) {
    if ((this.colorPickerContainer !== undefined && this.colorPickerContainer !== null) && !this.colorPickerContainer.contains(e.target) && this.state.displayColorPicker === true) {
      this.setState({ displayColorPicker: false });
    }
  }

  componentDidMount () {
    // Add event listener to detect when clicking outside of color picker
    document.addEventListener('mousedown', this.monitorMouseClick, false);
  }
  
  /**
   * Handles menu option selection
   */
  menuHandler (action, component) {
    switch (action.handlerAction){
    case ACTIONS.SHOW:
      show3DMesh(this.props.instance)
      break;
    case ACTIONS.HIDE:
      hide3DMesh(this.props.instance)
      break;
    case ACTIONS.SELECT:
      selectInstance(this.props.instance);
      break;
    case ACTIONS.DESELECT:
      selectInstance(this.props.instance);
      break;
    case ACTIONS.ZOOM_TO:
      focusInstance(this.props.instance)
      break;
    case ACTIONS.DELETE:
      removeInstanceByID(this.props.instance);
      break;
    case ACTIONS.INFO:
      focusInstance(this.props.instance);
      break;
    case ACTIONS.COLOR:
      this.setState({ displayColorPicker: true });
      break;
    case ACTIONS.SHOW_VOLUME:
      show3DMesh(this.props.instance)
      break;
    case ACTIONS.HIDE_VOLUME:
      hide3DMesh(this.props.instance)
      break;
    case ACTIONS.SHOW_SKELETON:
      show3DSkeleton(this.props.instance)
      break;
    case ACTIONS.HIDE_SKELETON:
      hide3DSkeleton(this.props.instance)
      break;
    }
  }
  
  /**
   * Pick button in configuration to display, some buttons have multiple options to display based on a 
   * condition.
   * E.g.: 
   * { toggle : {
   *   condition : {},
   *   false : { button1 }, 
   *   true : { button 2}
   * }
   */
  visibleButton (list,item) {
    let instance = this.props.allLoadedInstances?.find( i => i.metadata?.Id == this.props.instance);
    // Button configuration has two options, perform condition to determine which button to use 
    if ( item.toggle ){
      let condition = item.toggle.condition(instance);
      if ( item.toggle.isVisible !== undefined) {
        let visible = item.toggle.isVisible(instance);
        if ( visible ) {
          list.push(item.toggle.options[condition]);
        }
      } else {
        list.push(item.toggle.options[condition]);
      }
    } else {
      if ( item.isVisible !== undefined) {
        let visible = item.isVisible(instance);
        if ( visible ) {
          list.push(item);
        }
      } else { 
        list.push(item);
      }
    }
  }
  
  
  /**
   * Iterate through button list in Menu configuration
   */
  iterateConfList (list, item) {
    if ( item.list ) {
      // List of buttons found
      item.list.map(subItem => {
        this.iterateConfList(list, subItem);
      })
    } else {
      // Single button detected
      this.visibleButton(list, item)
    }
  }
  
  /**
   * Update Menu configuration. This needs to happen since the Menu configuration have
   * some options (hide/show, select/deselect) that depend on whether the Instance is
   * selected/visible or not.
   */
  updateControlsConfiguration () {
    // Create deep clone of configuration
    var configuration = { ...controlsConfiguration };
    let list = new Array();
    let self = this;

    let buttons = [...configuration.buttons];
 
    let updatedButtons = buttons.map((button, index) => {
      if ( self.props.allLoadedInstances?.find( i => i.metadata?.Id == self.props.instance) !== undefined ) {
        button.activeColor = self.props.allLoadedInstances?.find( i => i.metadata?.Id == self.props.instance)?.color;
        button.list.map(item => {
          // Iterate through button list in configuration, store new configuration in 'list' array
          this.iterateConfList(list, item);
        })
      
        // Replace buttons list in configuration with updated one
        button.list = list;
      }

      return button;
    });
        
    return { ...configuration, buttons : updatedButtons };
  }
  render () {
    // Update Menu Configuration
    let configuration = this.updateControlsConfiguration();
    let matchInstance = this.props.allLoadedInstances.find( instance => instance.metadata?.Id === this.props.instance);
    return (
      <div id="LayersControls_Menu">
        <Menu
          configuration={configuration}
          key="list_viewer"
          menuHandler={ value => this.menuHandler(value) }/>
        { this.state.displayColorPicker === true
          ? <div
            className="btnBar-color-picker"
            ref={ref => this.colorPickerContainer = ref}
            style={{ left: this.state.pickerPosition }}>
            <ChromePicker
              color={ matchInstance.color }
              onChangeComplete={ (color, event) => {
                let rgb;
                if ( color.source === "hsv" ){
                  rgb = { r:color.rgb.r/255, g:color.rgb.g/255, b:color.rgb.b/255, a:color.rgb.a }
                  changeColor(this.props.instance, rgb)
                  setDisplayColorPicker(false)
                } else if ( color.source === "hsl" ) {
                  rgb = color.rgb;
                  changeColor(this.props.instance, rgb)
                }
                this.setState({ displayColorPicker: true });                              
              }}
              style={{ zIndex: 10 }}/>
          </div>
          : undefined }
      </div>
    );
  }
}

function mapStateToProps (state) {

  return { 
    allLoadedInstances : state.instances.allLoadedInstances
  }
}

function mapDispatchToProps (dispatch) {
  return { setTermInfo: (instance, visible) => dispatch(setTermInfo(instance, visible )) }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListViewerControlsMenu);
