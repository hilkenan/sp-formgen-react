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
 * Definition for an display field for the lists
 */
var DisplayField = /** @class */ (function () {
    function DisplayField() {
        this.InternalName = "";
        this.DisplayFormat = "";
    }
    __decorate([
        json2typescript_1.JsonProperty("internal_name", String),
        __metadata("design:type", String)
    ], DisplayField.prototype, "InternalName", void 0);
    __decorate([
        json2typescript_1.JsonProperty("display_format", String, true),
        __metadata("design:type", String)
    ], DisplayField.prototype, "DisplayFormat", void 0);
    DisplayField = __decorate([
        json2typescript_1.JsonObject
    ], DisplayField);
    return DisplayField;
}());
exports.DisplayField = DisplayField;
//# sourceMappingURL=DisplayField.js.map