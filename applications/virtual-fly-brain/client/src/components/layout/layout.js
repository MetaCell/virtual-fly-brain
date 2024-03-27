export default {
  global: {
    sideBorders: 8,
    tabSetHeaderHeight: 28,
    tabSetTabStripHeight: 28,
    enableEdgeDock: false,
  },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      children: [],
      config: {
        isMinimizedPanel: true
      }
    },
  ],
  layout: {
    type: "row",
    id: "root",
    weight: 100,
    children: [{
      type: "tabset",
      id: "left",
      weight: 60,
      enableDeleteWhenEmpty: false,
      tabSetEnableMaximize: true,
    },
    {
      type: "tabset",
      id: "right",
      weight: 40,
      enableDeleteWhenEmpty: false,
      tabSetEnableMaximize: true,
    }]
  }
};
