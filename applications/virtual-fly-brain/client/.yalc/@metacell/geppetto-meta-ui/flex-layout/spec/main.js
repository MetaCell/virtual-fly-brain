"use strict";

var _Model = _interopRequireDefault(require("../src/model/Model"));
var _Actions = _interopRequireDefault(require("../src/model/Actions"));
var _DockLocation = _interopRequireDefault(require("../src/DockLocation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
describe("Tree", function () {
  it("adds a tab to center of empty tabset using add action", function () {
    var model = _Model["default"].fromJson({
      global: {},
      layout: {
        type: "row",
        id: "0",
        children: [{
          type: "tabset",
          name: "one",
          id: "1",
          enableDeleteWhenEmpty: false,
          children: []
        }]
      }
    });
    model.doAction(_Actions["default"].addNode({
      id: "2",
      name: "newtab1",
      component: "grid"
    }, "1", _DockLocation["default"].CENTER, -1));
    var expected = {
      "global": {},
      "layout": {
        "type": "row",
        "id": "0",
        "children": [{
          "type": "tabset",
          "name": "one",
          "enableDeleteWhenEmpty": false,
          "active": true,
          "id": "1",
          "children": [{
            "type": "tab",
            "id": "2",
            "name": "newtab1",
            "component": "grid"
          }]
        }]
      },
      "borders": []
    };
    var json = model.toJson();
    expect(json).toEqual(expected);
    console.log(JSON.stringify(json, null, "\t"));
  });

  // todo:

  // adding into tabset with position: 0, middle, end
  // adding into rows (ie splitting a tabset)

  // auto assignment of ids

  // dividers moving
  // moving tabs and tidying tree
  // removing tabs and tidying tree
  // setting attributes
});
//# sourceMappingURL=main.js.map