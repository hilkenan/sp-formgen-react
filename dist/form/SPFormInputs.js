"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FormInputs_1 = require("formgen-react/dist/form/FormInputs");
var Enums_1 = require("formgen-react/dist/Enums");
var FormSPPeoplePicker_1 = require("../inputs/peoplePicker/FormSPPeoplePicker");
/**
 * Replace the People Picker with the Sharepoint people picker
 */
var SPFormInputs = /** @class */ (function (_super) {
    __extends(SPFormInputs, _super);
    function SPFormInputs() {
        var _this = _super.call(this) || this;
        var picker = _this.controls.find(function (c) { return c.typeName == Enums_1.ControlTypes.PeoplePicker; });
        picker.controlType = FormSPPeoplePicker_1.FormSPPeoplePicker;
        return _this;
    }
    return SPFormInputs;
}(FormInputs_1.FormInputs));
exports.SPFormInputs = SPFormInputs;
//# sourceMappingURL=SPFormInputs.js.map