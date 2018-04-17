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
/**
 * Form Definition for SharePoint fomrs
 */
var TemplateVariable = /** @class */ (function () {
    function TemplateVariable() {
        this.Name = "";
        this.JsonPath = "";
    }
    __decorate([
        json2typescript_1.JsonProperty("name", String),
        __metadata("design:type", String)
    ], TemplateVariable.prototype, "Name", void 0);
    __decorate([
        json2typescript_1.JsonProperty("json_path", String),
        __metadata("design:type", String)
    ], TemplateVariable.prototype, "JsonPath", void 0);
    TemplateVariable = __decorate([
        json2typescript_1.JsonObject
    ], TemplateVariable);
    return TemplateVariable;
}());
exports.TemplateVariable = TemplateVariable;
//# sourceMappingURL=TemplateVariable.js.map