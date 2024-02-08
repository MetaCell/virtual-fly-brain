import React, { Component } from 'react'
import axios from 'axios';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { queryParser } from './VFBGraph/QueryParser';
import DropDownQueries from './VFBGraph/DropDownQueries';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from "react-redux";

import { configuration } from './configuration/VFBGraph/graphConfiguration';
import { restPostConfig } from './configuration/VFBGraph/graphConfiguration';
import { cypherQuery } from './configuration/VFBGraph/graphConfiguration';
import { stylingConfiguration } from './configuration/VFBGraph/graphConfiguration';
import { getInstanceByID } from '../reducers/actions/instances';

const UPDATE_GRAPH = 'UPDATE_GRAPH';

/**
 * If no configuration is given for queries in graphConfiguration.js, we use this configuration.
 */
const defaultHTTPConfiguration = {
  url: "https://pdb.virtualflybrain.org/db/data/transaction/commit",
  contentType: "application/json"
}

const COMPONENT_ID = "VFBGraph";
const NODE_WIDTH = 55;
const NODE_HEIGHT = 40;
const NODE_BORDER_THICKNESS = 2;

class VFBGraph extends Component {

  constructor (props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      graph : { nodes : [], links : [] },
      currentQuery : this.props.instance != null ? this.props.instance : { id : "" , name : "" },
      dropDownAnchorEl : null,
      optionsIconColor : stylingConfiguration.defaultRefreshIconColor,
      reload : false,
      lastClick: { timestamp: 0, nodeId: null }
    }
    this.updateGraph = this.updateGraph.bind(this);
    this.instanceFocusChange = this.instanceFocusChange.bind(this);
    this.queryResults = this.queryResults.bind(this);
    this.handleNodeLeftClick = this.handleNodeLeftClick.bind(this);
    this.handleNodeRightClick = this.handleNodeRightClick.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.queryNewInstance = this.queryNewInstance.bind(this);
    this.resetCamera = this.resetCamera.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.selectedNodeLoaded = this.selectedNodeLoaded.bind(this);
    this.resize = this.resize.bind(this);
    this.sync = this.sync.bind(this);
    this.getErrorLabel = this.getErrorLabel.bind(this);

    this.highlightNodes = new Set();
    this.highlightLinks = new Set();
    this.hoverNode = null;

    this.graphRef = React.createRef();
    this.__isMounted = false;
    this.shiftOn = false;
    this.objectsLoaded = 0;
    this.focused = false;
    // Graph component has been resized
    this.graphResized = false;
    this.focusedInstance = { id : "" };
    this.selectedDropDownQuery = -1;
    this.loading = false;
    this.firstLoad = true;
    this.nodeSelectedID = "";
    this.queryRequests = [];
    this.querySelection = {};
  }

  componentDidMount () {
    let self = this;

    // Keyboard listener, detect when shift is pressed down
    document.addEventListener("keydown", event => {
      if (event.isComposing || event.keyCode === 16) {
        self.shiftOn = true;
      }
    });

    document.addEventListener("keyup", event => {
      if (event.isComposing || event.keyCode === 16) {
        self.shiftOn = false;
      }
    });
  }

  componentDidUpdate () {
    const graphInstance = this.props.graphInstanceOnFocus ;
    const stateInstance = this.props.stateInstanceOnFocus
    if (graphInstance == undefined && stateInstance)
    {
      const instanceId = stateInstance.metadata.Id ;
      const instanceName = stateInstance.metadata.Name ;
      this.props.vfbGraph(UPDATE_GRAPH, stateInstance, -1, true, false);
      this.queryResults(cypherQuery(instanceId), { id : instanceId, name : instanceName });
    }

    if (!this.resizeObserver && this.containerRef.current)
    {
      this.resizeObserver = new ResizeObserver(entries => {
        this.graphRef.current.ggv.current.zoomToFit();
      });
  
      if (this.containerRef.current) {
        this.resizeObserver.observe(this.containerRef.current); // Start observing for size changes
      }
    }

    this.updateCameraAtStart();
  }

  updateCameraAtStart () {
    let self = this;
    // Reset camera view after graph component becomes visible
    setTimeout( () => {
      self.resetCamera();
      self.focused = true;
      self.loading = false;
      self.graphResized = false;
    }, (self.objectsLoaded * 20));
  }
  componentWillUnmount () {
    this.__isMounted = false;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect(); // Stop observing for size changes
    }
  }

  resetCamera () {
    if ( this.graphRef.current !== null ) {
      // If more than one graph node, use library's 'zoomToFit' method to center camera
      if ( this.state.graph.nodes.length > 1 ) {
        this.graphRef.current.ggv.current.zoomToFit();
      } else if ( this.state.graph.nodes.length == 1 ) {
        // Only one graph node, center camera around it
        let x = this.state.graph.nodes[0].x;
        let y = this.state.graph.nodes[0].y;
        this.graphRef.current.ggv.current.centerAt(x,y);
      }
      this.focused = true;
    }
  }

  resize (){
    this.graphResized = true;
    this.setState( { reload : !this.state.reload } );
  }

  zoomIn () {
    let zoom = this.graphRef.current.ggv.current.zoom();
    let inValue = 1;
    if (zoom < 2 ){
      inValue = .2;
    }
    this.graphRef.current.ggv.current.zoom(zoom + inValue , 100);
  }

  zoomOut () {
    let zoom = this.graphRef.current.ggv.current.zoom();
    let out = 1;
    if (zoom < 2 ){
      out = .2;
    }
    this.graphRef.current.ggv.current.zoom(zoom - out , 100);
  }

  handleNodeLeftClick(node, event) {
    const currentTime = Date.now();
    const doubleClickThreshold = 300; // Time in milliseconds to consider it a double-click
    const isDoubleClick = this.state.lastClick.nodeId === node.id &&
                          (currentTime - this.state.lastClick.timestamp) < doubleClickThreshold;

    if (isDoubleClick) {
      const title = node.title ;
      getInstanceByID(title);
    } else {
      this.graphRef.current.ggv.current.zoomToFit()
    }

    this.setState({
      lastClick: { timestamp: currentTime, nodeId: node.id },
    });
  }

  /**
   * Handle Right click on Nodes
   */
  handleNodeRightClick (node, event) {
    this.graphRef.current.ggv.current.centerAt(node.x , node.y, 1000);
    this.graphRef.current.ggv.current.zoom(2, 1000);
  }

  sync () {
    this.instanceFocusChange(this.props.stateInstanceOnFocus);
    this.selectedDropDownQuery = -1;
    this.updateGraph();
  }

  /**
   * Handle Menu drop down clicks
   */
  handleMenuClick (selection) {
    // Show loading spinner while cypher query search occurs
    this.loading = true;
    this.querySelection = selection;
    this.forceUpdate();
    // Perform cypher query
    this.queryResults(selection.query(this.state.currentQuery.id), { id : this.state.currentQuery.id, name : this.state.currentQuery.name } );
  }

  /**
   * Query new instance by using 'addVfbId' functionality
   */
  queryNewInstance (node) {
    /*
     * TODO : Comment out if clicking on a node needs to add it globally
     * window.addVfbId(node.title);
     */
    this.loading = true;
    this.setState({ optionsIconColor : stylingConfiguration.defaultRefreshIconColor });
    // Perform cypher query
    this.queryResults(cypherQuery(node.title), { id : node.title, name : node.path } );
  }

  selectedNodeLoaded (instance) {
    var loadedId = instance.id;
    if (instance.getParent) {
      loadedId = instance.getParent()?.id;
    }

    if ( this.nodeSselected ) {
      if ( this.nodeSelectedID === loadedId ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets notified every time the instance focused changes
   */
  instanceFocusChange (instance) {
    if (instance.getParent) {
      this.focusedInstance = instance.getParent();
    } else {
      this.focusedInstance = instance;
    }
  }

  /**
   * Re-render graph with a new instance
   */
  updateGraph () {
    const stateInstance = this.props.stateInstanceOnFocus ;

    let instanceId   = stateInstance.metadata.Id;
    let instanceName = stateInstance.metadata.Name;
    /*
     * function handler called by the VFBMain whenever there is an update of the instance on focus,
     * this will reflect and move to the node (if it exists) that we have on focus.
     */
    if (stateInstance?.getParent && stateInstance?.getParent() !== null) {
      instanceId   = stateInstance.getParent()?.id;
      instanceName = stateInstance.getParent()?.name;
    }

    this.loading = true;
    this.setState({ optionsIconColor : stylingConfiguration.defaultRefreshIconColor });
    
    // Perform cypher query
    this.props.vfbGraph(UPDATE_GRAPH, stateInstance, -1, true, false);
    this.queryResults(cypherQuery(instanceId), { id : instanceId, name : instanceName });
  }

  /**
   * Perform a cypher query to retrieve graph for instance
   */
  queryResults (requestQuery, instance) {
    // if ( this.queryRequests.includes(instance.id) ) {
    //   return;
    // }

    var url = restPostConfig.url;

    if (restPostConfig.url === undefined) {
      url = defaultHTTPConfiguration.url;
    }

    let contentType = restPostConfig.contentType.length !== 0 ? restPostConfig.contentType : defaultHTTPConfiguration.contentType;

    // Make cypher query request statement into string
    let request = JSON.parse(JSON.stringify(requestQuery));

    let self = this;

    // Axios HTTP Post request with cypher query
    axios({
      method: 'post',
      url: url,
      headers: { 'content-type': contentType },
      data: request,
    }).then( (response) => {
      var blob = new Blob(["onmessage = " + queryParser ]);
      var blobUrl = window.URL.createObjectURL(blob);

      var worker = new Worker(blobUrl);
      worker.onmessage = function (e) {
        switch (e.data.resultMessage) {
        case "OK":
          self.loading = false;
          self.firstLoad = false;
          var query = query = { id : e.data.params.instance.id , name : e.data.params.instance.name };
          var index = self.queryRequests.indexOf(instance.id);
          // Remove ID from list of requests, needs to be reset
          if ( index != -1 ){
            self.queryRequests.splice(index, 1);
          }
          // Update state with results and current query
          self.setState( { graph : e.data.params.results, currentQuery : query });
          self.objectsLoaded = e.data.params.results.nodes.length;
          // Reset camera after loading new graph
          setTimeout( () => {
            self.resetCamera();
            if ( self.graphRef.current !== null ) {
              self.graphRef.current.ggv.current.d3Force('charge').strength(-(self.objectsLoaded * 100 ))
            }
          }, 0);
          break;
        }
      };
      // Add ID to list of query requests made
      self.queryRequests.push(instance.id);

      let params = {
        results: response.data,
        value: instance,
        configuration : configuration,
        NODE_WIDTH : NODE_WIDTH,
        NODE_HEIGHT : NODE_HEIGHT
      }
      // Invoke web worker to perform conversion of graph data into format
      worker.postMessage({ message: "refine", params: params });
    })
      .catch( (error)=> {
        self.loading = false;
      })
  }

  /**
   * Breaks Description texts into lines to fit within a certain width value.
   */
  wrapText (context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  getErrorLabel () {
    let self = this;
    if ( this.selectedDropDownQuery == -1 ) {
      if ( this.querySelection?.label ){
        return this.querySelection?.label(self.state.currentQuery.id);
      }
      return null;
    }
    return stylingConfiguration.dropDownQueries.map((item, index) => {
      if ( self.selectedDropDownQuery === index ) {
        return item.label(self.state.currentQuery.id);
      }
    });
  }

  render () {
    let self = this;
    const { graphQueryIndex } = this.props;

    this.focused = true;
    // Color to use for synchronization button
    let syncColor = this.state.optionsIconColor;

    // No graph to display, message is shown instead of graph
    if (this.props.instanceOnFocus && Object.keys(this.props.instanceOnFocus).length === 0 && this.props.instanceOnFocus?.constructor === Object) {
      return (
        <p>Model not loaded, graph not available yet</p>
      );
    }

    const graphInstanceId = this.props.graphInstanceOnFocus?.metadata?.Id; 
    const stateInstanceId = this.props.stateInstanceOnFocus?.metadata?.Id;
    // Out of sync if instanceOnFocus is not what's on display
    if ( graphInstanceId !== stateInstanceId) {
      syncColor = stylingConfiguration.outOfSyncIconColor;
    }

    return (
      this.loading
        ? <CircularProgress
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            margin: 'auto',
            color: "#11bffe",
            size: "55rem"
          }}
        />
        : this.state.graph.nodes.length == 0
          ? <div>
            <div style={ { position: "absolute", padding: '1rem', width: "5vh", height: "100px",zIndex: "2" } }>
              <DropDownQueries
                handleMenuClick={selection => self.handleMenuClick(selection)}
                currentQuery = { self.state.currentQuery }
                focusedInstance = {self.focusedInstance}
                sync = { () => self.sync() }
                syncColor = { syncColor }
                stylingConfiguration = { stylingConfiguration }
              />
            </div>
            <p style={{ float : "right", width : "80%", paddingTop : "2vh" }}>No graph available for {this.getErrorLabel()}</p>
          </div>
          : 
            <div ref={this.containerRef}>
              <Box sx={{
              width: 600,
              height: 800,
              backgroundColor: 'primary.dark',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}><GeppettoGraphVisualization
              id= { COMPONENT_ID }
              // Graph data with Nodes and Links to populate
              data={this.state.graph}
              // Create the Graph as 2 Dimensional
              d2={true}
              onEngineStop={this.resetCamera}
              cooldownTicks={10}
              // Node label, used in tooltip when hovering over Node
              nodeLabel={node => node.path}
              nodeRelSize={20}
              nodeSize={30}
              // Relationship label, placed in Link
              linkLabel={link => link.name}
              // Assign background color to Canvas
              backgroundColor = {stylingConfiguration.canvasColor}
              // Assign color to Links connecting Nodes
              linkColor = {link => {
                let color = stylingConfiguration.linkColor;
                if ( self.highlightLinks.has(link) ) {
                  color = self.highlightNodes.has(link.source) || self.highlightNodes.has(link.targetNode) ? stylingConfiguration.linkHoverColor : stylingConfiguration.linkColor;
                }

                return color;
              }}
              nodeCanvasObject={(node, ctx, globalScale) => {
                let cardWidth = NODE_WIDTH;
                let cardHeight = NODE_HEIGHT;
                let borderThickness = self.highlightNodes.has(node) ? NODE_BORDER_THICKNESS : 1;

                // Node border color
                ctx.fillStyle = self.hoverNode == node ? stylingConfiguration.nodeHoverBoderColor : (self.highlightNodes.has(node) ? stylingConfiguration.neighborNodesHoverColor : stylingConfiguration.nodeBorderColor) ;
                // Create Border
                ctx.fillRect(node.x - cardWidth / 2 - (borderThickness), node.y - cardHeight / 2 - (borderThickness), cardWidth , cardHeight );

                // Assign color to Description Area background in Node
                ctx.fillStyle = stylingConfiguration.nodeDescriptionBackgroundColor;
                // Create Description Area in Node
                ctx.fillRect(node.x - cardWidth / 2,node.y - cardHeight / 2, cardWidth - (borderThickness * 2 ), cardHeight - ( borderThickness * 2) );
                // Assign color to Title Bar background in Node
                ctx.fillStyle = stylingConfiguration.nodeTitleBackgroundColor;
                // Create Title Bar in Node
                ctx.fillRect(node.x - cardWidth / 2 ,node.y - cardHeight / 2, cardWidth - ( borderThickness * 2 ), cardHeight / 3);

                // Assign font to text in Node
                ctx.font = stylingConfiguration.nodeFont;
                // Assign color to text in Node
                ctx.fillStyle = stylingConfiguration.nodeFontColor;
                // Text in font to be centered
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                // Create Title in Node
                ctx.fillText(node.title, node.x, node.y - 15);
                // Add Description text to Node
                this.wrapText(ctx, node.path, node.x, node.y, cardWidth - (borderThickness * 2) , 5);
              }}
              // Overwrite Node Canvas Object
              nodeCanvasObjectMode={node => 'replace'}
              // bu = Bottom Up, creates Graph with root at bottom
              dagMode="bu"
              dagLevelDistance = {100}
              // Handles clicking event on an individual node
              onNodeClick = { (node,event) => this.handleNodeLeftClick(node,event) }
              // Handles clicking event on an individual node
              onNodeRightClick = { (node,event) => this.handleNodeRightClick(node,event) }
              ref={this.graphRef}
              // Disable dragging of nodes
              enableNodeDrag={false}
              // Allow camera pan and zoom with mouse
              enableZoomPanInteraction={true}
              // Width of links
              linkWidth={1.25}
              controls = {
                <div style={ { position: "absolute", width: "5vh", height: "100px",zIndex: "2", color : "white" } }>
                  <Tooltip placement="right" title="Reset View">
                    <div
                      style={
                        {
                          zIndex : "2",
                          cursor : "pointer",
                          top : "10px",
                          left : "10px",
                          width: "1.3rem",
                          height: "1.3rem",
                          backgroundPosition: 'center',
                          backgroundImage: `url(${stylingConfiguration.icons.home})`
                        }
                      }
                      onClick={this.resetCamera }>
                    </div>
                  </Tooltip>
                  <Tooltip placement="right" title="Zoom In">
                    <div
                      style={
                        {
                          zIndex : "2",
                          cursor : "pointer",
                          marginTop : "20px",
                          left : "10px",
                          width: "1.3rem",
                          height: "1.3rem",
                          backgroundPosition: 'center',
                          backgroundImage: `url(${stylingConfiguration.icons.zoomIn})`
                        }
                      }
                      onClick={this.zoomIn }>
                    </div>
                  </Tooltip>
                  <Tooltip placement="right" title="Zoom Out">
                    <div
                      style={
                        {
                          zIndex : "2",
                          cursor : "pointer",
                          marginTop : "5px",
                          left : "10px",
                          width: "1.3rem",
                          height: "1.3rem",
                          backgroundPosition: 'center',
                          backgroundImage: `url(${stylingConfiguration.icons.zoomOut})`
                        }
                      }
                      onClick={this.zoomOut }>
                    </div>
                  </Tooltip>
                  <DropDownQueries
                    handleMenuClick={selection => self.handleMenuClick(selection)}
                    currentQuery = {self.state.currentQuery}
                    focusedInstance = {self.focusedInstance}
                    sync = { () => self.sync() }
                    syncColor = { syncColor }
                    stylingConfiguration = { stylingConfiguration }
                  />
                </div>
              }
              click={() => self.graphRef.current.ggv.current.zoomToFit()}
              // Function triggered when hovering over a nodeoptions
              onNodeHover={node => {
                // Reset maps of hover nodes and links
                self.highlightNodes.clear();
                self.highlightLinks.clear();

                // We found the node that we are hovering over
                if (node) {
                  // Keep track of hover node, its neighbors and links
                  self.highlightNodes.add(node);
                  node.neighbors.forEach(neighbor => self.highlightNodes.add(neighbor));
                  node.links.forEach(link => self.highlightLinks.add(link));
                }

                // Keep track of hover node
                self.hoverNode = node || null;
                document.getElementById(COMPONENT_ID).style.cursor = node ? '-webkit-grab' : null;
              }
              }
              // Function triggered when hovering over a link
              onLinkHover={link => {
                // Reset maps of hover nodes and links
                self.highlightNodes.clear();
                self.highlightLinks.clear();

                // We found link being hovered
                if (link) {
                  // Keep track of hovered link, and it's source/target node
                  self.highlightLinks.add(link);
                  self.highlightNodes.add(link.source);
                  self.highlightNodes.add(link.target);
                }
              }
              }
            /></Box>
          </div>
    )
  }
}

function mapStateToProps (state) {
  const graphInstanceOnFocus = state.graph.instanceOnFocus;
  const stateInstanceOnFocus = state.instances.focusedInstance;

  const newProps = {
    graphQueryIndex : graphInstanceOnFocus && stateInstanceOnFocus ? 0 : -1,
    sync : state.graph.sync,
    graphInstanceOnFocus,
    stateInstanceOnFocus,
    loading: graphInstanceOnFocus !== undefined
  }

  return newProps ;
}

function mapDispatchToProps (dispatch) {
  return { vfbGraph: (type, path, index, visible, sync) => dispatch ( { type : type, data : { instance : path, queryIndex : index, visible : visible, sync : sync } } ) }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef : true } )(VFBGraph);