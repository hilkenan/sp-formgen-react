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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var formgen_react_1 = require("formgen-react");
var SPFormInputs_1 = require("./SPFormInputs");
var inversify_config_1 = require("../objects/inversify.config");
/**
 * The main SharePoint Form Control that renders the Control Tree
 */
var SPForm = /** @class */ (function (_super) {
    __extends(SPForm, _super);
    function SPForm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SPForm.prototype.render = function () {
        var inputs = new SPFormInputs_1.SPFormInputs();
        var spContainer = new inversify_config_1.SPContainer(this.props.useLocalHost ? this.props.useLocalHost : false, this.props.serverRelativeUrl);
        return (React.createElement(formgen_react_1.GenericForm, __assign({}, this.props, { container: spContainer, formInputs: inputs })));
    };
    return SPForm;
}(office_ui_fabric_react_1.BaseComponent));
exports.SPForm = SPForm;
//# sourceMappingURL=SPForm.js.map