/**
 * The default layout of the application.
 * 
 * Will be loaded by FlexLayout.
 * https://github.com/caplin/FlexLayout
 */
export const layout = {
  global: {
    tabEnableClose: true,
    tabSetHeaderHeight: 26,
    tabSetTabStripHeight: 26,
    enableEdgeDock: false,
  },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      size: 100,
      children: [],
      barSize: 35,
      config: {
        isMinimizedPanel: true
      }
    },
  ],
  "layout": {
    "type": "tabset",
    "weight": 100,
    "id": "root",
    "children": [
      {
        "type": "row",
        "weight": 69,
        "id": "headerBar",
        "children": []
      },
      {
        "type": "row",
        "weight": 69,
        "children": [
          {
            "type": "tabset",
            "weight": 100,
            "id": "mainPanel",
            "enableDeleteWhenEmpty": false,
            "children": [
              {
                type: "tab",
                name: "left",
                id: "leftPanel",
                component: "panel",
              }
              ,{
                type: "tab",
                name: "center",
                id: "centerPanel", 
                component: "panel",
              }
              ,{
                type: "tab",
                name: "right",
                id: "rightPanel", 
                component: "panel",
              }
            ]
          }
        ]
      }
    ]
  }
};