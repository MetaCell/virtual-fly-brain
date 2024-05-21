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
    enableDeleteWhenEmpty: true,
    weight: 100,
    children: [{
      type: "tabset",
      id: "left",
      weight: 60,
      enableDeleteWhenEmpty: true,
      tabSetEnableMaximize: true,
      children: []
    },
    {
      type: "tabset",
      id: "right",
      weight: 40,
      enableDeleteWhenEmpty: true,
      tabSetEnableMaximize: true,
      children: []
    }]
  }
};
