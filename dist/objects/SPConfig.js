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
var List_1 = require("src/objects/List");
/**
 * Config Definition for SharePoint Config Lists
 */
var SPConfig = /** @class */ (function () {
    function SPConfig() {
        this.BaseUrl = "";
        this.ListConfigs = [];
    }
    __decorate([
        json2typescript_1.JsonProperty("base_url", String, true),
        __metadata("design:type", String)
    ], SPConfig.prototype, "BaseUrl", void 0);
    __decorate([
        json2typescript_1.JsonProperty("lists", [List_1.List]),
        __metadata("design:type", Array)
    ], SPConfig.prototype, "ListConfigs", void 0);
    SPConfig = __decorate([
        json2typescript_1.JsonObject
    ], SPConfig);
    return SPConfig;
}());
exports.SPConfig = SPConfig;
//# sourceMappingURL=SPConfig.js.map