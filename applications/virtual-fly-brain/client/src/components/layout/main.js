import React from 'react';
import { activateWidget, addWidget, deleteWidget, maximizeWidget, minimizeWidget, setLayout, updateWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { stackViewerWidget, threeDCanvasWidget } from '../widgets';
import { layout } from '../app/layout';

const MainLayout = (props) => {

    const onLoad = () => {
      dispatch(addWidget(stackViewerWidget))
      dispatch(addWidget(threeDCanvasWidget))
    }

    // Click callbacks
    const onCustomWidgetClick = () => dispatch(addWidget(MyComponentWidget));
    const onAddWidgetClick = (widget) => dispatch(addWidget(widget));
    const onRemove = (id) => dispatch(deleteWidget(id));
    const onMaximize = (id) => dispatch(maximizeWidget(id));
    const onMinimize = (id) => dispatch(minimizeWidget(id));
    const onActivate = (id) => dispatch(activateWidget(id));
    const onUpdate = (widget) => dispatch(updateWidget({ ...widget, name: "Your Component!" }));
    const onChangeLayout = () => dispatch(setLayout({
        ...layout, "layout": {
            ...layout["layout"],
            "children": [
                ...layout['layout']['children'],
                newTabset
            ]
        }
    }));

    //implement UI
    return (
        <>
        </>
    );
}


export default LeftSidebar;
