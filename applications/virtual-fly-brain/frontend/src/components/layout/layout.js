import { LEFT, RIGHT, BOTTOM } from "../../utils/constants";

export default {
  global: {
    sideBorders: 8,
    tabSetHeaderHeight: 28,
    tabSetTabStripHeight: 28,
    enableEdgeDock: false,
    borderBarSize: 1,
    borderEnableDrop: false,
  },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      size: 1,
      barSize: 1,
      enableDrop: false,
      config: {
        isMinimizedPanel: true
      }
    },
  ],
  layout: {
    type: "row",
    id: "root",
    children: [
      {
        type: "row",
        id: "root1",
        weight: 50,
        children: [
          {
            type: "row",
            id: "root2",
            weight: 50,
            children: [
              {
                type: "tabset",
                id: LEFT,
                weight: 50,
                enableDeleteWhenEmpty: false,
                tabSetEnableMaximize: true,
                children: []
              },
              {
                type: "tabset",
                id: RIGHT,
                weight: 50,
                enableDeleteWhenEmpty: false,
                tabSetEnableMaximize: true,
                children: []
              },
            ]
          },
          {
            type: "tabset",
            id: BOTTOM,
            weight: 30,
            enableDeleteWhenEmpty: false,
            tabSetEnableMaximize: true,
            children: []
          }
        ]
      }
    ]
  }
};
