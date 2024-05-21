"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Units = void 0;
/**
 * Customizes units for Math.js library
 */
var Units = exports.Units = {
  unitsMap: [],
  /**
   * Adds external unit to local map:
   * unit : String representing unit to be added to map
   * label : String used to associated the unit label with
   *  e.g "kilometer" for unit : "km"
   */
  addUnit: function addUnit(unit, label) {
    unit = unit.replace(/\s/g, '');
    this.unitsMap[unit] = label;
  },
  getUnitLabel: function getUnitLabel(unit) {
    var label;
    unit = unit.replace(/\s/g, '');
    if (unit != undefined && unit != null) {
      label = this.unitsMap[unit];
    }
    return label;
  },
  getUnitsMap: function getUnitsMap() {
    return this.unitsMap;
  },
  hasUnit: function hasUnit(unit) {
    unit = unit.replace(/\s/g, '');
    var hasUnit = false;
    var match = this.unitsMap[unit];
    if (match != undefined || match != null) {
      hasUnit = true;
    }
    return hasUnit;
  }
};
//# sourceMappingURL=units.js.map