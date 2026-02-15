import React from 'react';
import vars from "../../../theme/variables";
import { widgets } from "../../layout/widgets";
const { primaryFont, whiteColor, tabActiveColor, primaryBg } = vars;

const ACTIONS = {
  SHOW_WIDGET : 'SHOW_WIDGET',
  SHOW_SEARCH : 'SHOW_SEARCH',
  SHOW_COMPONENT : 'SHOW_COMPONENT',
  SHOW_TERM_INFO : 'SHOW_TERM_INFO',
  OPEN_NEW_TAB : 'OPEN_NEW_TAB',
  REDIRECT_TO : 'REDIRECT_TO',
  CLICK_ABOUT : 'CLICK_ABOUT',
  CLICK_FEEDBACK : 'CLICK_FEEDBACK',
  CLICK_CONTRIBUTE : 'CLICK_CONTRIBUTE',
  CLICK_QUICK_HELP : 'CLICK_QUICK_HELP',
  HISTORY_MENU_INJECTOR : 'HISTORY_MENU_INJECTOR',
  SELECT_INSTANCE : 'SELECT_INSTANCE',
  RUN_QUERY : 'RUN_QUERY',
  LOAD_LAYOUT : 'LOAD_LAYOUT',
  LOAD_CUSTOM_LAYOUT : 'LOAD_CUSTOM_LAYOUT',
  SAVE_LAYOUT : 'SAVE_LAYOUT',
};

export const toolbarMenu = (autoSaveLayout) => { return {
  global: {
    buttonsStyle: {
      standard: {
        background: 'transparent',
        borderRadius: 0,
        border: 0,
        boxShadow: 'none',
        color: whiteColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        margin: '0',
        minWidth: '0.0625rem',
        padding: '0 0.75rem',
        height: '3rem',
        textTransform: 'capitalize',
        textAlign: 'left',
        justifyContent: 'start',
        marginTop: '0',
        lineHeight: '1.125rem',
        fontWeight: 400,
      },
      hover: {
        background: 'transparent',
        borderRadius: 0,
        border: 0,
        boxShadow: 'none',
        color: tabActiveColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        textDecoration: 'none',
        margin: '0',
        minWidth: '0.0625rem',
        height: 'auto',
        textTransform: 'capitalize',
        textAlign: 'left',
        justifyContent: 'start',
        marginTop: '0',
        fontWeight: 400
      }
    },
    drawersStyle: {
      standard: {
        top: '0.0625rem',
        backgroundColor: primaryBg,
        // borderRadius: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
        borderRadius: '0.125rem',
        color: whiteColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        minWidth: '7.75rem',
        fontWeight: 400
      },
      hover: {
        top: '0.0625rem',
        backgroundColor: primaryBg,
        // borderRadius: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
        borderRadius: '0.125rem',
        color: whiteColor,
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        minWidth: '7.75rem',
        fontWeight: 400,
      }
    },
    labelsStyle: {
      standard: {
        borderRadius: 0,
        color: whiteColor,
        fontSize: '0.875rem',
        padding: '0.5rem',
        fontFamily: primaryFont,
        lineHeight: '129%',
        minHeight: '2.125rem',
        height: '2.125rem'
      },
      hover: {
        background: "transparent",
        borderRadius: 0,
        color: tabActiveColor,
        lineHeight: '129%',
        padding: '0.5rem',
        fontSize: '0.875rem',
        fontFamily: primaryFont,
        fontWeight: 400,
        minHeight: '2.125rem',
        height: '2.125rem',
      }
    },
    iconStyle: {
      // display: 'inline-block',
      color: 'currentColor',
      minWidth: '1.5rem',
      width: '1.5rem',
    },
  },
  itemOptions: { customArrow: <i style={{ marginLeft: 'auto', marginRight: 0}} className="fa fa-angle-right menu-caret" /> },
  actions : ACTIONS,
  buttons: [
    {
      label: "Virtual Fly Brain",
      icon: "",
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "About",
          icon: "",
          action: {
            handlerAction: ACTIONS.OPEN_NEW_TAB,
            parameters: ["https://www.virtualflybrain.org/about/"]
          }
        },
        {
          label: "Contribute",
          icon: "",
          action: {
            handlerAction: ACTIONS.OPEN_NEW_TAB,
            parameters: ["http://www.virtualflybrain.org/docs/contribution-guidelines/"]
          }
        },
        {
          label: "Feedback",
          icon: "",
          action: {
            handlerAction: ACTIONS.CLICK_FEEDBACK,
            parameters: []
          }
        },
        {
          label: "Social media",
          icon: "",
          position: "right-start",
          action: {
            handlerAction: "submenu",
            parameters: ["undefinedAction"]
          },
          list: [
            {
              label: "Twitter",
              icon: "fa fa-twitter",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["http://twitter.com/virtualflybrain"]
              },
            },
            {
              label: "Facebook",
              icon: "fa fa-facebook",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["https://www.facebook.com/pages/Virtual-Fly-Brain/131151036987118"]
              },
            },
            {
              label: "Latest News & Releases",
              icon: "",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["https://www.virtualflybrain.org/blog/"]
              },
            }
          ]
        }
      ]
    },
    {
      label: "Tools",
      icon: "",
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "Search History",
          icon: "fa fa-search",
          action: {
            handlerAction: ACTIONS.SHOW_COMPONENT,
            parameters: [5]
          }
        },
        {
          label: "Query",
          icon: "fa fa-clipboard-question",
          action: {
            handlerAction: ACTIONS.SHOW_COMPONENT,
            parameters: [2]
          }
        },
        {
          label: "Layers",
          icon: "fa fa-list",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.listViewerWidget?.id]
          }
        },
        {
          label: "Term Info",
          icon: "fa fa-info",
          action: {
            handlerAction: ACTIONS.SHOW_TERM_INFO,
            parameters: [""]
          }
        },
        {
          label: "3D Viewer",
          icon: "fa fa-cube",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.threeDCanvasWidget?.id]
          }
        },
        {
          label: "Slice Viewer",
          icon: "fa fa-layer-group",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.stackViewerWidget?.id]
          }
        },
        {
          label: "Neuroglass Viewer",
          icon: "fa fa-brain",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.neuroglassViewerWidget?.id]
          }
        },
        {
          label: "Template ROI Browser",
          icon: "fa fa-indent",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.roiBrowserWidget?.id]
          }
        },
        {
          label: "Term Context",
          icon: "fa fa-sitemap",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.termContextWidget?.id]
          }
        },
        {
          label: "Circuit Browser",
          icon: "fa fa-route",
          action: {
            handlerAction: ACTIONS.SHOW_WIDGET,
            parameters: [widgets?.circuitBrowserWidget?.id]
          }
        },
        {
          label: "Download Contents",
          icon: "fa fa-download",
          action: {
            handlerAction: ACTIONS.SHOW_COMPONENT,
            parameters: [1]
          }
        },
        {
          label: "NBLAST Uploader",
          icon: "fa fa-upload",
          action: {
            handlerAction: ACTIONS.SHOW_COMPONENT,
            parameters: [0]
          }
        },
        {
          label: "NBLAST",
          icon: "",
          action: {},
          position: "right-start",
          list: [
            {
              label: "What is NBLAST?",
              icon: "",
              trailerIcon: "fa fa-external-link",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["http://flybrain.mrc-lmb.cam.ac.uk/si/nblast/www/"]
              }
            },
            {
              label: "NBLAST against your own data",
              icon: "",
              trailerIcon: "fa fa-external-link",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["http://nblast.virtualflybrain.org:8080/NBLAST_on-the-fly/?gal4_n=10&all_use_mean=F&all_query=&tab=One%20against%20all&gal4_query="]
              }
            }
          ]
        },
        {
          label: "CATMAID",
          icon: "",
          action: {},
          position: "right-start",
          list: [
            {
              label: "What is CATMAID?",
              icon: "",
              trailerIcon: "fa fa-external-link",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["https://www.virtualflybrain.org/blog/releases/catmaid/"]
              }
            },
            {
              label: "Hosted EM Data",
              icon: "",
              position: "right-start",
              action: {
                handlerAction: "submenu",
                parameters: ["undefinedAction"]
              },
              list: [
                {
                  label: "Adult Brain (FAFB)",
                  icon: "",
                  trailerIcon: "fa fa-external-link",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://fafb.catmaid.virtualflybrain.org/?pid=1&zp=65720&yp=160350.0517811483&xp=487737.6942783438&tool=tracingtool&sid0=1&s0=3.1999999999999993&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22Published%22%7D%7D,%200.6)"]
                  }
                },
                {
                  label: "Adult VNC",
                  icon: "",
                  position: "right-start",
                  action: {
                    handlerAction: "submenu",
                    parameters: ["undefinedAction"]
                  },
                  list: [
                    {
                      label: "Adult VNC (FANC)",
                      icon: "",
                      trailerIcon: "fa fa-external-link",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://fanc.catmaid.virtualflybrain.org/?pid=1&zp=55260&yp=512482.5999999994&xp=173092.19999999998&tool=tracingtool&sid0=1&s0=9&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22publication%22%7D%7D,%200.6)"]
                      }
                    },
                    {
                      label: "Adult VNC (FANC) Aligned to JRC2018 VNC Female",
                      icon: "",
                      trailerIcon: "fa fa-external-link",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://fanc.catmaid.virtualflybrain.org/?pid=2&zp=70800&yp=268000&xp=131600&tool=tracingtool&sid0=3&s0=1&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22publication%22%7D%7D,%200.6)"]
                      }
                    }
                  ]
                },
                {
                  label: "Larval",
                  icon: "",
                  position: "right-start",
                  action: {
                    handlerAction: "submenu",
                    parameters: ["undefinedAction"]
                  },
                  list: [
                    {
                      label: "Larval (L1EM)",
                      icon: "",
                      trailerIcon: "fa fa-external-link",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://l1em.catmaid.virtualflybrain.org/?pid=1&zp=108250&yp=82961.59999999999&xp=54210.799999999996&tool=tracingtool&sid0=1&s0=2.4999999999999996&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22papers%22%7D%7D,%200.6)"]
                      }
                    },
                    {
                      label: "Larval (L3VNC)",
                      icon: "",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://l3vnc.catmaid.virtualflybrain.org/?pid=2&zp=0&yp=53578.49999999999&xp=71242.5&tool=tracingtool&sid0=2&s0=6&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22papers%22%7D%7D,%200.6)"]
                      }
                    },
                    {
                      label: "Larval (ABD1.5)",
                      icon: "",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://abd1.5.catmaid.virtualflybrain.org/?pid=1&zp=10485&yp=40560.65722061269&xp=42396.0789533435&tool=tracingtool&sid0=1&s0=4.5&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22papers%22%7D%7D,%200.6)"]
                      }
                    },
                    {
                      label: "Larval Mutant (IAV-Robo)",
                      icon: "",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://iav-robo.catmaid.virtualflybrain.org/?pid=1&zp=18360&yp=25383.555362060197&xp=40676.497110038756&tool=tracingtool&sid0=1&s0=4&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22papers%22%7D%7D,%200.6)"]
                      }
                    },
                    {
                      label: "Larval Mutant (IAV-TNT)",
                      icon: "",
                      action: {
                        handlerAction: ACTIONS.OPEN_NEW_TAB,
                        parameters: ["https://iav-tnt.catmaid.virtualflybrain.org/?pid=2&zp=0&yp=28633&xp=45094.6&sid0=2&s0=4&tool=tracingtool&help=true&layout=h(XY,%20%7B%20type:%20%22neuron-search%22,%20id:%20%22neuron-search-1%22,%20options:%20%7B%22annotation-name%22:%20%22papers%22%7D%7D,%200.6)"]
                      }
                    }
                  ]
                }
              ]
            },
            {
              label: "APIs",
              icon: "",
              position: "right-start",
              action: {
                handlerAction: "submenu",
                parameters: ["undefinedAction"]
              },
              list: [
                {
                  label: "Adult Brain (FAFB)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://fafb.catmaid.virtualflybrain.org/apis/"]
                  }
                },
                {
                  label: "Adult VNC (FANC)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://fanc.catmaid.virtualflybrain.org/apis/"]
                  }
                },
                {
                  label: "Larval (L1EM)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://l1em.catmaid.virtualflybrain.org/apis/"]
                  }
                },
                {
                  label: "Larval (L3VNC)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://l3vnc.catmaid.virtualflybrain.org/apis/"]
                  }
                },
                {
                  label: "Larval (ABD1.5)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://abd1.5.catmaid.virtualflybrain.org/apis/"]
                  }
                },
                {
                  label: "Larval Mutant (IAV-Robo)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://iav-robo.catmaid.virtualflybrain.org/apis/"]
                  }
                },
                {
                  label: "Larval Mutant (IAV-TNT)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["https://iav-tnt.catmaid.virtualflybrain.org/apis/"]
                  }
                }
              ]
            }
          ]
        },
        {
          label: "VFB CONNECT (API)",
          icon: "",
          action: {},
          position: "right-start",
          list: [
            {
              label: "VFB_connect: A library for querying VFB",
              icon: "",
              trailerIcon: "fa fa-external-link",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["https://vfb-connect.readthedocs.io/"]
              }
            },
            {
              label: "Python (PiPy)",
              icon: "",
              trailerIcon: "fa fa-external-link",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["https://pypi.org/project/vfb-connect/"]
              }
            },
            {
              label: "R wrapper",
              icon: "",
              trailerIcon: "fa fa-external-link",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["https://github.com/jefferis/vfbconnectr"]
              }
            }
          ]
        }
      ]
    },
    {
      label: "History",
      icon: "",
      action: {},
      position: "bottom-start",
      dynamicListInjector: {
        handlerAction: ACTIONS.HISTORY_MENU_INJECTOR,
        parameters: [""]
      }
    },
    {
      label: "Templates",
      icon: "",
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "Adult",
          icon: "",
          position: "right-start",
          action: {
            handlerAction: "submenu",
            parameters: ["undefinedAction"]
          },
          list: [
            {
              label: "Adult Brain Unisex (JRC2018U)",
              icon: "",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["/?id=VFB_00101567"]
              }
            },
            {
              label: "Adult VNC Unisex (JRC2018VU)",
              icon: "",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["/?id=VFB_00200000"]
              }
            },
            {
              label: "Other",
              icon: "",
              position: "right-start",
              action: {
                handlerAction: "submenu",
                parameters: ["undefinedAction"]
              },
              list: [
                {
                  label: "Adult Head (McKellar)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["/?id=VFB_00110000"]
                  }
                },
                {
                  label: "Adult Brain (JFRC2/2010)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["/?id=VFB_00017894"]
                  }
                },
                {
                  label: "Adult VNS (Court2018)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["/?id=VFB_00100000"]
                  }
                },
                {
                  label: "Janelia FlyEM HemiBrain",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["/?id=VFB_00101384"]
                  }
                },
                {
                  label: "Ito Half Brain",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.OPEN_NEW_TAB,
                    parameters: ["/?id=VFB_00030786"]
                  }
                }
              ]
            }
          ]
        },
        {
          label: "Larval",
          icon: "",
          position: "right-start",
          action: {
            handlerAction: "submenu",
            parameters: ["undefinedAction"]
          },
          list: [
            {
              label: "L1 CNS (ssTEM)",
              icon: "",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["/?id=VFB_00050000"]
              }
            },
            {
              label: "L3 CNS (Wood2018)",
              icon: "",
              action: {
                handlerAction: ACTIONS.OPEN_NEW_TAB,
                parameters: ["/?id=VFB_00049000"]
              }
            }
          ]
        }
      ]
    },
    {
      label: "Datasets",
      icon: "",
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "Adult",
          icon: "",
          position: "right-start",
          action: {
            handlerAction: "submenu",
            parameters: ["undefinedAction"]
          },
          list: [
            {
              label: "Adult Brain Unisex (JRC2018U)",
              icon: "",
              action: {
                handlerAction: ACTIONS.RUN_QUERY,
                parameters: ["VFB_00101567"]
              }
            },
            {
              label: "Adult VNC Unisex (JRC2018VU)",
              icon: "",
              action: {
                handlerAction: ACTIONS.RUN_QUERY,
                parameters: ["VFB_00200000"]
              }
            },
            {
              label: "Other",
              icon: "",
              position: "right-start",
              action: {
                handlerAction: "submenu",
                parameters: ["undefinedAction"]
              },
              list: [
                {
                  label: "Adult Head (McKellar)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.RUN_QUERY,
                    parameters: ["VFB_00110000"]
                  }
                },
                {
                  label: "Adult Brain (JFRC2/2010)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.RUN_QUERY,
                    parameters: ["VFB_00017894"]
                  }
                },
                {
                  label: "Adult VNS (Court2018)",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.RUN_QUERY,
                    parameters: ["VFB_00100000"]
                  }
                },
                {
                  label: "Janelia FlyEM HemiBrain",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.RUN_QUERY,
                    parameters: ["VFB_00101384"]
                  }
                },
                {
                  label: "Ito Half Brain",
                  icon: "",
                  action: {
                    handlerAction: ACTIONS.RUN_QUERY,
                    parameters: ["VFB_00030786"]
                  }
                }
              ]
            }
          ]
        },
        {
          label: "Larval",
          icon: "",
          position: "right-start",
          action: {
            handlerAction: "submenu",
            parameters: ["undefinedAction"]
          },
          list: [
            {
              label: "L1 CNS (ssTEM)",
              icon: "",
              action: {
                handlerAction: ACTIONS.RUN_QUERY,
                parameters: ["VFB_00050000"]
              }
            },
            {
              label: "L3 CNS (Wood2018)",
              icon: "",
              action: {
                handlerAction: ACTIONS.RUN_QUERY,
                parameters: ["VFB_00049000"]
              }
            }
          ]
        }
      ]
    },
    {
      label: "View",
      icon: "",
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "3D + EM viewers",
          icon: "fa fa-window-restore",
          action: {
            handlerAction: ACTIONS.LOAD_LAYOUT,
            parameters: ["layout1"]
          }
        },
        {
          label: "Hierarchy + circuit + data list",
          icon: "fa fa-window-restore",
          action: {
            handlerAction: ACTIONS.LOAD_LAYOUT,
            parameters: ["layout2"]
          }
        },
        {
          label: "3D + EM + data list",
          icon: "fa fa-window-restore",
          action: {
            handlerAction: ACTIONS.LOAD_LAYOUT,
            parameters: ["layout3"]
          }
        },
        {
          label: "Load user custom layout",
          icon: "fa fa-window-restore",
          action: {
            handlerAction: ACTIONS.LOAD_CUSTOM_LAYOUT,
            parameters: [""]
          }
        },
        {
          label: autoSaveLayout ? "Disable layout autosaving" : "Enable layout autosaving",
          icon: autoSaveLayout ? "fa fa-ban" : "fa fa-save",
          action: {
            handlerAction: ACTIONS.SAVE_LAYOUT,
            parameters: [""]
          }
        },
      ]
    },
    {
      label: "Help",
      icon: "",
      action: {},
      position: "bottom-start",
      list: [
        {
          label: "Documentation",
          icon: "fa fa-comments-o",
          action: {
            handlerAction: ACTIONS.OPEN_NEW_TAB,
            parameters: ["https://www.virtualflybrain.org/docs/"]
          }
        },
        {
          label: "Support Forum",
          icon: "fa fa-medkit",
          action: {
            handlerAction: ACTIONS.OPEN_NEW_TAB,
            parameters: ["https://groups.google.com/g/vfb-suport"]
          }
        },
        {
          label: "Contribute",
          icon: "",
          action: {
            handlerAction: ACTIONS.OPEN_NEW_TAB,
            parameters: ["http://www.virtualflybrain.org/docs/contribution-guidelines/"]
          }
        },
        {
          label: "Circuit Browser Query (Shortest Weighted Path Algorithm)",
          icon: "fa fa-connectdevelop",
          trailerIcon: "fa fa-external-link",
          action: {
            handlerAction: ACTIONS.OPEN_NEW_TAB,
            parameters: ["https://github.com/VirtualFlyBrain/graph_queries/blob/main/weighted_path.md"]
          }
        },
        {
          label: "Report an issue",
          icon: "fa fa-bug",
          action: {
            handlerAction: ACTIONS.CLICK_FEEDBACK,
            parameters: []
          }
        }
      ]
    }
  ]
}};
