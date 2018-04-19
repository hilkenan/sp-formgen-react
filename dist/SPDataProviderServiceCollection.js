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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var SPListProviderService_1 = require("./objects/SPListProviderService");
var SPUserProfileProviderService_1 = require("./objects/SPUserProfileProviderService");
/**
 * The Types to use for injection
 */
exports.typesForInjectSP = {
    targetInfo: "targetInfo",
    serverRelativeUrl: "serverRelativeUrl"
};
/**
 * The colleciton of all Service providers for Sharepoint:
 * List Provider
 * UserProfile Provider
 * Search Provider (not jet implmented)
 */
var SPDataProviderServiceCollection = /** @class */ (function () {
    /**
     * Takes the target Info as parmeter.
     */
    function SPDataProviderServiceCollection(targetInfo, serverRelativeUrl) {
        this.providers = [];
        var spListProvider = new SPListProviderService_1.SPListProviderService(serverRelativeUrl, targetInfo);
        var spUserProfileProvider = new SPUserProfileProviderService_1.SPUserProfileProviderService(serverRelativeUrl, targetInfo);
        this.providers.push(spListProvider);
        this.providers.push(spUserProfileProvider);
    }
    SPDataProviderServiceCollection = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(exports.typesForInjectSP.targetInfo)), __param(1, inversify_1.inject(exports.typesForInjectSP.serverRelativeUrl)),
        __metadata("design:paramtypes", [Object, String])
    ], SPDataProviderServiceCollection);
    return SPDataProviderServiceCollection;
}());
exports.SPDataProviderServiceCollection = SPDataProviderServiceCollection;
//# sourceMappingURL=SPDataProviderServiceCollection.js.map