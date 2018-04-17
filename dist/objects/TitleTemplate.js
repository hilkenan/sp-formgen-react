"use strict";
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
var json2typescript_1 = require("json2typescript");
var TransConverter_1 = require("formgen-react/dist/objects/jsonConverters/TransConverter");
var TemplateVariable_1 = require("./TemplateVariable");
/**
 * Form Definition for SharePoint fomrs
 */
var TitleTemplate = /** @class */ (function () {
    function TitleTemplate() {
        this.Message = "";
        this.MessageTranslates = undefined;
        this.TemplateVariables = undefined;
    }
    __decorate([
        json2typescript_1.JsonProperty("template", String),
        __metadata("design:type", String)
    ], TitleTemplate.prototype, "Message", void 0);
    __decorate([
        json2typescript_1.JsonProperty("template_trans", TransConverter_1.TransConverter, true),
        __metadata("design:type", Array)
    ], TitleTemplate.prototype, "MessageTranslates", void 0);
    __decorate([
        json2typescript_1.JsonProperty("variables", [TemplateVariable_1.TemplateVariable], true),
        __metadata("design:type", Array)
    ], TitleTemplate.prototype, "TemplateVariables", void 0);
    TitleTemplate = __decorate([
        json2typescript_1.JsonObject
    ], TitleTemplate);
    return TitleTemplate;
}());
exports.TitleTemplate = TitleTemplate;
//# sourceMappingURL=TitleTemplate.js.map