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
var ListConfigConverter_1 = require("./jsonConverters/ListConfigConverter");
var ListConfig_1 = require("./ListConfig");
var ObjectTranslate_1 = require("formgen-react/dist/objects/ObjectTranslate");
var ChildConfig = /** @class */ (function () {
    function ChildConfig() {
        this.ParentField = "";
        this.Config = undefined;
        this.ConfigTranslation = undefined;
    }
    __decorate([
        json2typescript_1.JsonProperty("parent_field", String),
        __metadata("design:type", String)
    ], ChildConfig.prototype, "ParentField", void 0);
    __decorate([
        json2typescript_1.JsonProperty("child_config", ListConfigConverter_1.ListConfigConverter),
        __metadata("design:type", ListConfig_1.ListConfig)
    ], ChildConfig.prototype, "Config", void 0);
    __decorate([
        json2typescript_1.JsonProperty("child_config_trans", ObjectTranslate_1.ObjectTranslate, true),
        __metadata("design:type", ObjectTranslate_1.ObjectTranslate)
    ], ChildConfig.prototype, "ConfigTranslation", void 0);
    ChildConfig = __decorate([
        json2typescript_1.JsonObject
    ], ChildConfig);
    return ChildConfig;
}());
exports.ChildConfig = ChildConfig;
//# sourceMappingURL=ChildConfig.js.map