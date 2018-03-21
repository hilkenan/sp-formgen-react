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
var DisplayField_1 = require("src/objects/DisplayField");
var ChildConfig_1 = require("./ChildConfig");
/**
 * Definition for the configuration of an sharepoint list
 */
var ListConfig = /** @class */ (function () {
    function ListConfig() {
        this.KeyField = "";
        this.ListName = "";
        this.DisabledField = "";
        this.ViewName = "";
        this.DisplayFormat = "";
        this.WebUrl = "";
        this.DisplayFields = [];
        this.ChildLists = [];
    }
    __decorate([
        json2typescript_1.JsonProperty("key_field", String),
        __metadata("design:type", String)
    ], ListConfig.prototype, "KeyField", void 0);
    __decorate([
        json2typescript_1.JsonProperty("list_name", String),
        __metadata("design:type", String)
    ], ListConfig.prototype, "ListName", void 0);
    __decorate([
        json2typescript_1.JsonProperty("disabled_field", String, true),
        __metadata("design:type", String)
    ], ListConfig.prototype, "DisabledField", void 0);
    __decorate([
        json2typescript_1.JsonProperty("view_name", String, true),
        __metadata("design:type", String)
    ], ListConfig.prototype, "ViewName", void 0);
    __decorate([
        json2typescript_1.JsonProperty("display_format", String, true),
        __metadata("design:type", String)
    ], ListConfig.prototype, "DisplayFormat", void 0);
    __decorate([
        json2typescript_1.JsonProperty("web_url", String, true),
        __metadata("design:type", String)
    ], ListConfig.prototype, "WebUrl", void 0);
    __decorate([
        json2typescript_1.JsonProperty("display_fields", [DisplayField_1.DisplayField]),
        __metadata("design:type", Array)
    ], ListConfig.prototype, "DisplayFields", void 0);
    __decorate([
        json2typescript_1.JsonProperty("child_lists", [ChildConfig_1.ChildConfig], true),
        __metadata("design:type", Array)
    ], ListConfig.prototype, "ChildLists", void 0);
    ListConfig = __decorate([
        json2typescript_1.JsonObject
    ], ListConfig);
    return ListConfig;
}());
exports.ListConfig = ListConfig;
//# sourceMappingURL=ListConfig.js.map