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
var formgen_react_1 = require("formgen-react");
var json2typescript_1 = require("json2typescript");
var SPConfig_1 = require("./SPConfig");
var TransConverter_1 = require("formgen-react/dist/objects/jsonConverters/TransConverter");
/**
 * Form Definition for SharePoint fomrs
 */
var JSPFormData = /** @class */ (function (_super) {
    __extends(JSPFormData, _super);
    function JSPFormData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.SPConfig = undefined;
        _this.Message = "";
        _this.MessageTranslates = undefined;
        return _this;
    }
    __decorate([
        json2typescript_1.JsonProperty("sp_config", SPConfig_1.SPConfig, true),
        __metadata("design:type", SPConfig_1.SPConfig)
    ], JSPFormData.prototype, "SPConfig", void 0);
    __decorate([
        json2typescript_1.JsonProperty("template", String, true),
        __metadata("design:type", String)
    ], JSPFormData.prototype, "Message", void 0);
    __decorate([
        json2typescript_1.JsonProperty("template_trans", TransConverter_1.TransConverter, true),
        __metadata("design:type", Array)
    ], JSPFormData.prototype, "MessageTranslates", void 0);
    JSPFormData = __decorate([
        json2typescript_1.JsonObject
    ], JSPFormData);
    return JSPFormData;
}(formgen_react_1.JFormData));
exports.JSPFormData = JSPFormData;
//# sourceMappingURL=JSPFormData.js.map