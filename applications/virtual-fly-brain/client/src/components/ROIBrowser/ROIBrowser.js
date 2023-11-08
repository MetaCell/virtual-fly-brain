/* eslint-disable no-prototype-builtins */
import React from "react";
import { ChromePicker } from "react-color";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Tree from "./Tree";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import axios from 'axios';
import vars from "../../theme/variables";
import { useSelector, connect } from "react-redux";
import { termInfoById } from "../../reducers/actions/termInfo";
import { getInstanceByID } from '../../reducers/actions/instances';
import theme from "../../theme/index";
import { VisibilityOff } from "../../icons";
const {
    secondaryBg,
    whiteColor,
    blackColor
  } = vars;
const restPostConfig =
    require("../../components/configuration/ROIBrowser/ROIBrowserConfiguration").restPostConfig;
const treeCypherQuery =
    require("../../components/configuration/ROIBrowser/ROIBrowserConfiguration").treeCypherQuery;

const ROIBrowser = (props) => {
    const classes = {
        root: {
          height: 'calc(100% - 0.5rem)',
          width : '100%',
          color: whiteColor
        }
    }

    const templateID = useSelector((state) => state.globalInfo.templateID);
    const data = useSelector(state => state.termInfo.termInfoData)

    const styles = {
        left_second_column: 395,
        column_width_small: 385,
        column_width_viewer: "calc(100% - 385px)",
        row_height: 25,
        top: 0,
        height: props.size.height,
        width: props.size.width,
    };
    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
    const [pickerAnchor, setPickerAnchor] = React.useState(undefined);
    const [state, setState] = React.useState({
        errors : undefined,
        dataTree : undefined,
        loading : false,
        edges : undefined,
        nodes : undefined,
        nodeSelected : undefined,
        root : undefined
    });

    let isNumber = require("./helper").isNumber;
    let sortData = require("./helper").sortData;
    let findRoot = require("./helper").findRoot;
    let convertEdges = require("./helper").convertEdges;
    let convertNodes = require("./helper").convertNodes;
    let searchChildren = require("./helper").searchChildren;
    let defaultComparator = require("./helper").defaultComparator;
    let parseGraphResultData = require("./helper").parseGraphResultData;
    let buildDictClassToIndividual =
        require("./helper").buildDictClassToIndividual;

    const AUTHORIZATION = "Basic " + btoa("neo4j:vfb")

    let colorPickerContainer = undefined;
    let nodeWithColorPicker = undefined;
    //axios.defaults.headers.common["Authorization"] = this.AUTHORIZATION
    const restPost = (data) => {
        return new Promise((resolve, reject) => {
            axios.post(restPostConfig.url, data,  {
                headers: {
                  'Content-Type': restPostConfig.contentType,
                  'Authorization' : AUTHORIZATION
                }
              })
              .then((response) => {
                console.log("Response data ", response.data)
                resolve(response.data);
              })
              .catch((error) => {
                console.log("Error retrieving ROI query ", error)
                reject(error);
            });
        });
    };

    const findChildren = (parent, key, familyList, labels) => {
        let childrenList = [];
        let childKey = searchChildren(familyList, key, parent, labels);
        if (childKey !== undefined) {
            childrenList.push(childKey);
            let i = childKey - 1;
            while (i > 0 && isNumber(parent[key]) === isNumber(familyList[i][key])) {
                childrenList.push(i);
                i--;
            }
            i = childKey + 1;
            while (
                i < familyList.length &&
                isNumber(parent[key]) === isNumber(familyList[i][key])
            ) {
                childrenList.push(i);
                i++;
            }
        }
        return childrenList;
    };

    const insertChildren = (nodes, edges, child, imagesMap) => {
        // Extend the array of relationships from here
        let childrenList = findChildren({ from: child.id }, "from", edges, [
            "part of",
            "SUBCLASSOF",
        ]);
        // child.images = this.findChildren({ from: child.id }, "from", edges, "INSTANCEOF");
        let nodesList = [];
        for (let i = 0; i < childrenList.length; i++) {
            nodesList.push(edges[childrenList[i]].to);
        }
        let uniqNodes = [...new Set(nodesList)];

        for (let j = 0; j < uniqNodes.length; j++) {
            let node = nodes[findChildren({ id: uniqNodes[j] }, "id", nodes)[0]];
            let imageId = node.instanceId;
            child.children.push({
                title: node.title,
                subtitle: node.classId,
                description: node.info,
                classId: node.classId,
                instanceId: node.instanceId,
                id: node.id,
                showColorPicker: false,
                children: [],
            });
            insertChildren(nodes, edges, child.children[j], imagesMap);
        }
    };

    const convertDataForTree = (nodes, edges, vertix, imagesMap) => {
        // This will create the data structure for the react-sortable-tree library, starting from the vertix node.
        let refinedDataTree = [];
        for (let i = 0; i < nodes.length; i++) {
            if (vertix === nodes[i].id) {
                refinedDataTree.push({
                    title: nodes[i].title,
                    subtitle: nodes[i].classId,
                    description: nodes[i].info,
                    classId: nodes[i].classId,
                    instanceId: nodes[i].instanceId,
                    id: nodes[i].id,
                    showColorPicker: false,
                    children: [],
                });
                break;
            }
        }
        let child = refinedDataTree[0];
        // Once the vertix has been established we call insertChildren recursively on each child.
        insertChildren(nodes, edges, child, imagesMap);
        return refinedDataTree;
    };

    const updateSubtitle = (tree, idSelected) => {
        let node = undefined;
        if (tree.length !== undefined) {
            node = tree[0];
        } else {
            node = tree;
        }
        if (node.instanceId === idSelected || node.classId === idSelected) {
            node.subtitle = idSelected;
        }
        for (let i = 0; i < node.children.length; i++) {
            updateSubtitle(node.children[i], idSelected);
        }
    };

    const selectNode = (instance) => {
        if (
            state?.nodeSelected !== undefined &&
            state?.nodeSelected.instanceId !== instance.instanceId
        ) {
            /*
             * var treeData = this.state.dataTree;
             * this.updateSubtitle(treeData, instance.instanceId);
             */
            setState({ ...state, nodeSelected : instance });
        }
    };

    const updateTree = (instance) => {
        /*
         * function handler called by the VFBMain whenever there is an update of the instance on focus,
         * this will reflect and move to the node (if it exists) that we have on focus.
         */
        let idToSearch = instance.Id;

        if (
            state?.nodeSelected !== undefined &&
            idToSearch !== state?.nodeSelected?.instanceId &&
            idToSearch !== state?.nodeSelected?.classId
        ) {
            if (idToSearch === templateID) {
                selectNode(state?.dataTree[0]);
                return;
            }
            let node = [];
            let i = 0;
            /*
             * check the instance's id with the nodes, if this match we will use its subtitle
             * in the searchQuery in the render to move the tree focus on this node
             */
            while (state?.nodes.length > i) {
                if (
                    idToSearch === state?.nodes[i]["instanceId"] ||
                    idToSearch === state?.nodes[i]["classId"]
                ) {
                    node.push(i);
                    break;
                }
                i++;
            }
            if (node.length > 0) {
                selectNode(state?.nodes[node[0]]);
            }
        }
    };

    const initTree = (instance) => {
        // This function is the core and starting point of the component itself
        let that = this;
        setState({ ...state, loading : true, errors : undefined });
        if ( instance === undefined ) return
        let queryCypher = treeCypherQuery(instance.Id);
        restPost(queryCypher).then((data) => {
            /*
             * we take the data provided by the cypher query and consume the until we obtain the treeData that can be given
             * to the react-sortable-tree since it understands this data structure
             */
            if (data.errors.length > 0) {
                console.log(data.errors);
                setState({ ...state, errors : "Error retrieving the data - check the console for additional information"});
            }

            if (data.results.length > 0 && data.results[0].data.length > 0) {
                let dataTree = parseGraphResultData(data);
                let vertix = findRoot(data);
                let imagesMap = buildDictClassToIndividual(data);
                let nodes = sortData(
                    convertNodes(dataTree.nodes, imagesMap),
                    "id",
                    defaultComparator
                );
                let edges = sortData(
                    convertEdges(dataTree.edges),
                    "from",
                    defaultComparator
                );
                let treeData = convertDataForTree(nodes, edges, vertix, imagesMap);
                setState({
                    ...state,
                    loading : false,
                    errors : undefined,
                    root : vertix,
                    edges : edges,
                    nodes : nodes,
                    nodeSelected :  state?.nodeSelected === undefined ? treeData[0] : state.nodeSelected,
                    dataTree : treeData

                })
            } else {
                setState({...state, loading : false })
            }
        });
    };

    const nodeClick = (event, rowInfo) => {
        if (
            event.target.getAttribute("type") !== "button" &&
            (event.target.getAttribute("aria-label") !== "Collapse" ||
                event.target.getAttribute("aria-label") !== "Expand")
        ) {
            selectNode(rowInfo.node);
        }
    };

    const monitorMouseClick = (e) => {
        const clickCoord = {
            INSIDE: "inside",
            OUTSIDE: "outside",
            PICKER_PRESENT: "picker_present",
            NODE_PRESENT: "node_present",
        };

        let clickCondition = undefined;
        if (colorPickerContainer !== undefined && colorPickerContainer !== null) {
            clickCondition = clickCoord.PICKER_PRESENT;
            if (!colorPickerContainer.contains(e.target)) {
                clickCondition = clickCoord.OUTSIDE;
            }
        }

        switch (clickCondition) {
            case clickCoord.OUTSIDE:
                if (nodeWithColorPicker !== undefined) {
                    nodeWithColorPicker.showColorPicker = false;
                    nodeWithColorPicker = undefined;
                }
                colorPickerContainer = undefined;
                setDisplayColorPicker(false);
                break;
        }
    };

    const getButtons = (rowInfo) => {
        // As per name, provided by the react-sortable-tree api, we use this to attach to each node custom buttons
        let buttons = [];
        let fillCondition = "unknown";
        let instanceLoaded = false;
        if (
            rowInfo.node.instanceId != undefined &&
            rowInfo.node.instanceId.indexOf("VFB_") > -1
        ) {
            fillCondition = "3dAvailable";
            if (Instances[rowInfo.node.instanceId]) {
                instanceLoaded = true;
            }
            if (!instanceLoaded) {
                fillCondition = "3dToLoad";
            } else {
                if (
                    typeof Instances[rowInfo.node.instanceId].isVisible !== "undefined" &&
                    Instances[rowInfo.node.instanceId].isVisible()
                ) {
                    fillCondition = "3dVisible";
                } else {
                    fillCondition = "3dHidden";
                }
            }
        }

        switch (fillCondition) {
            case "3dToLoad":
                buttons.push(
                    <IconButton disableRipple color="primary" aria-label="delete" size="small" onClick={(e) => {
                        e.stopPropagation();
                        termInfoById(rowInfo.node.instanceId);
                        getInstanceByID(rowInfo.node.instanceId);
                        setState({ ...state, nodeSelected : rowInfo.node });
                    }}>
                        <VisibilityOff />
                    </IconButton>
                );
                break;
            case "3dHidden":
                buttons.push(
                    <IconButton disableRipple aria-label="delete" size="small" onClick={(e) => {
                        e.stopPropagation();
                        if (Instances[rowInfo.node.instanceId]?.getParent() !== null) {
                            Instances[rowInfo.node.instanceId]?.getParent().show();
                        } else {
                            Instances[rowInfo.node.instanceId]?.show();
                        }
                        setState({ ...state, nodeSelected : rowInfo.node });
                    }}>
                     <VisibilityOff />
                    </IconButton>
                );
                break;
            case "3dVisible":
                var color = Instances[rowInfo.node.instanceId].getColor();
                buttons.push(
                    <IconButton disableRipple aria-label="delete" size="small" onClick={(e) => {
                        e.stopPropagation();
                            if (Instances[rowInfo.node.instanceId]?.getParent() !== null) {
                                Instances[rowInfo.node.instanceId]?.getParent().hide();
                            } else {
                                Instances[rowInfo.node.instanceId].hide();
                            }
                            setState({ ...state, nodeSelected : rowInfo.node });
                    }}>
                     <VisibilityOff />
                    </IconButton>
                );
                buttons.push(
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <i
                            className="fa fa-tint"
                            style={{
                                paddingLeft: "6px",
                                color: color,
                            }}
                            aria-hidden="true"
                            onClick={(e) => {
                                e.stopPropagation();
                                nodeWithColorPicker = rowInfo.node;
                                rowInfo.node.showColorPicker = !rowInfo.node.showColorPicker;
                                setDisplayColorPicker(!displayColorPicker);
                                setPickerAnchor(!displayColorPicker ? undefined : e);
                            }}
                        />
                        {displayColorPicker && rowInfo.node.showColorPicker ? (
                            <div
                                id="tree-color-picker"
                                ref={(ref) => (colorPickerContainer = ref)}
                            >
                                <ChromePicker
                                    color={Instances[rowInfo.node.instanceId].getColor()}
                                    onChangeComplete={(color, event) => {
                                        Instances[rowInfo.node.instanceId].setColor(color.hex);
                                        setDisplayColorPicker(true);
                                    }}
                                    style={{ zIndex: 10 }}
                                />
                            </div>
                        ) : null}
                    </span>
                );
                break;
        }
        return buttons;
    };

    const getNodes = (rowInfo) => {
        /*
         * In the getNodes, provided by the API of react-sortable-tree, if the node has visual capability
         * we attach the tooltip with the image, differently only tooltip.
         */
        if (rowInfo.node.title !== "No data available.") {
            var title = (
                <MuiThemeProvider theme={theme}>
                    <Tooltip
                        placement="right-start"
                        title={
                            rowInfo.node.instanceId.indexOf("VFB_") > -1 ? (
                                <div>
                                    <div> {rowInfo.node.description} </div>
                                    <div>
                                        <img
                                            style={{ display: "block", textAlign: "center" }}
                                            src={
                                                "https://VirtualFlyBrain.org/reports/" +
                                                rowInfo.node.instanceId +
                                                "/thumbnailT.png"
                                            }
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div> {rowInfo.node.description} </div>
                                </div>
                            )
                        }
                    >
                        <div
                            className={
                                state?.nodeSelected !== undefined &&
                                    rowInfo.node.instanceId === state?.nodeSelected.instanceId
                                    ? "nodeFound nodeSelected"
                                    : "nodeSelected"
                            }
                            onClick={(e) => {
                                e.stopPropagation();
                                colorPickerContainer = undefined;
                                let instanceFound = false;
                                if (Instances[rowInfo.node.instanceId]) {
                                    instanceFound = true;
                                }

                                if (
                                    instanceFound &&
                                    typeof Instances[rowInfo.node.instanceId].isVisible ===
                                    "function"
                                ) {
                                    termInfoById(rowInfo.node.instanceId);
                                } else {
                                    termInfoById(rowInfo.node.classId);
                                }
                                setState({ ...state, nodeSelected : rowInfo.node });
                            }}
                        >
                            {rowInfo.node.title}
                        </div>
                    </Tooltip>
                </MuiThemeProvider>
            );
        }
        return title;
    };

    React.useEffect(() => {
        if (templateID !== undefined) {
            if ( state.dataTree === undefined ) initTree(templateID)

        } else {
            setState({ ...state, errors : "Template not loaded yet." });
        }
    }, [templateID]);

    React.useEffect( () => {
        if ( state.dataTree === undefined ) {
            initTree(data)
        } else {
            updateTree(data)
        }
    },[data]);

    React.useEffect(() => {
        document.addEventListener("mousedown", monitorMouseClick, false);
        // returned function will be called on component unmount
        return () => {
            document.removeEventListener("mousedown", monitorMouseClick, false);
        };
    }, []);

    return(
        <Box
      sx={{
        ...classes.root,
        background: {
          lg: blackColor
        },
        p: {
          xs: 2,
          lg: 2
        },
      }}
    >
      { state?.errors !== undefined ? (
        <div id="treeError">{state?.errors}</div>
    ) : (
        <>
            {state?.loading === true || state?.dataTree?.length < 1 | state?.dataTree === undefined ? (
                <Box display='flex' alignItems='center' justifyContent='center' style={{height: '100%'}}>
                    <CircularProgress
                        style={{
                            position: "relative",
                            display : "flex",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            top: 0,
                            margin: "auto",
                            color: "#11bffe",
                            size: "55rem",
                        }}
                    />
                </Box>
            ) : (
                <Tree
                    id="VFBTree"
                    name={"Tree"}
                    componentType={"TREE"}
                    toggleMode={true}
                    treeData={
                        state?.dataTree === undefined
                            ? [
                                {
                                    title: "No data available.",
                                    subtitle: null,
                                    children: [],
                                },
                            ]
                            : state?.dataTree
                    }
                    activateParentsNodeOnClick={true}
                    handleClick={nodeClick}
                    style={{
                        height: '100%'
                    }}
                    rowHeight={styles.row_height}
                    getButtons={getButtons}
                    getNodesProps={getNodes}
                    searchQuery={
                        state?.nodeSelected?.subtitle
                    }
                    onlyExpandSearchedNodes={false}
                />
            )}
        </>)
    }
    </Box>
    );
};

export default ROIBrowser;