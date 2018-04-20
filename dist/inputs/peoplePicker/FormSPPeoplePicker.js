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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var FormBaseInput_1 = require("formgen-react/dist/formBaseInput/FormBaseInput");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var InnerControl_1 = require("formgen-react/dist/controls/innerControl/InnerControl");
var Helper_1 = require("formgen-react/dist/Helper");
var LocalsPeoplePicker_1 = require("formgen-react/dist/locales/LocalsPeoplePicker");
var Rendering_1 = require("formgen-react/dist/form/Rendering");
;
var peoplePicker_1 = require("gd-sprest-react/build/components/peoplePicker");
/**
 * SharePoint People picker control. Let choose one ore more Persons.
 */
var FormSPPeoplePicker = /** @class */ (function (_super) {
    __extends(FormSPPeoplePicker, _super);
    function FormSPPeoplePicker(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            isValid: true,
            currentValue: _this.props.control.Value,
            currentError: undefined,
            mostRecentlyUsed: [],
            peopleList: [],
        };
        _this.pickerSuggestionsProps = _this._getTranslatedTexts();
        return _this;
    }
    /**
     * Translate all the UI text in the correct langauge.
     */
    FormSPPeoplePicker.prototype._getTranslatedTexts = function () {
        var ppFormater = Helper_1.Helper.getTranslator("peoplepicker").formatMessage;
        var suggestionProps = {
            suggestionsHeaderText: ppFormater(LocalsPeoplePicker_1.LocalsPeoplePicker.suggestionsHeaderText),
            mostRecentlyUsedHeaderText: ppFormater(LocalsPeoplePicker_1.LocalsPeoplePicker.mostRecentlyUsedHeaderText),
            noResultsFoundText: ppFormater(LocalsPeoplePicker_1.LocalsPeoplePicker.noResultsFoundText),
            loadingText: ppFormater(LocalsPeoplePicker_1.LocalsPeoplePicker.loadingText),
            showRemoveButtons: true,
            searchForMoreText: "Weitere Benutzer suchen",
            forceResolveText: "Forcieren",
            searchingText: "Sucht",
            suggestionsAvailableAlertText: ppFormater(LocalsPeoplePicker_1.LocalsPeoplePicker.suggestionsAvailableAlertText),
            suggestionsContainerAriaLabel: ppFormater(LocalsPeoplePicker_1.LocalsPeoplePicker.suggestionsContainerAriaLabel),
        };
        return suggestionProps;
    };
    /**
     * Render a Fabric DatePicker
     */
    FormSPPeoplePicker.prototype.render = function () {
        var _this = this;
        return (React.createElement(InnerControl_1.InnerControl, { BaseControl: this, LabelWith: this.props.labelWith },
            React.createElement(peoplePicker_1.SPPeoplePicker, __assign({ ref: function (input) { return _this.innerControl = input; } }, this.ConfigProperties, { props: {
                    onChange: this._onItemsChange,
                    onResolveSuggestions: null,
                    pickerSuggestionsProps: this.pickerSuggestionsProps
                } })),
            this.state.currentError && Rendering_1.default.renderError(this.state.currentError)));
    };
    /**
   * Event when the selection has changed. Store the array of persons.
   * @param items Array of personas to store
   */
    FormSPPeoplePicker.prototype._onItemsChange = function (items) {
        var alloMulti = this.ConfigProperties.allowMultiple != undefined ? this.ConfigProperties.allowMultiple : true;
        var personas = alloMulti ? items : items.splice(items.length - 1, 1);
        this.setValue(personas, true);
    };
    __decorate([
        office_ui_fabric_react_1.autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", void 0)
    ], FormSPPeoplePicker.prototype, "_onItemsChange", null);
    return FormSPPeoplePicker;
}(FormBaseInput_1.FormBaseInput));
exports.FormSPPeoplePicker = FormSPPeoplePicker;
//# sourceMappingURL=FormSPPeoplePicker.js.map