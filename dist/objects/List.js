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
var ListConfig_1 = require("src/objects/ListConfig");
var ObjectTranslate_1 = require("formgen-react/dist/objects/ObjectTranslate");
/**
 * Definition for the a SharePoint List
 */
var List = /** @class */ (function () {
    function List() {
        this.Key = "";
        this.ListConfig = undefined;
        this.ConfigTranslation = undefined;
    }
    __decorate([
        json2typescript_1.JsonProperty("key", String),
        __metadata("design:type", String)
    ], List.prototype, "Key", void 0);
    __decorate([
        json2typescript_1.JsonProperty("config", ListConfig_1.ListConfig),
        __metadata("design:type", ListConfig_1.ListConfig)
    ], List.prototype, "ListConfig", void 0);
    __decorate([
        json2typescript_1.JsonProperty("config_trans", ObjectTranslate_1.ObjectTranslate, true),
        __metadata("design:type", ObjectTranslate_1.ObjectTranslate)
    ], List.prototype, "ConfigTranslation", void 0);
    List = __decorate([
        json2typescript_1.JsonObject
    ], List);
    return List;
}());
exports.List = List;
//# sourceMappingURL=List.js.map