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
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var formgen_react_1 = require("formgen-react");
var SharePointTarget_1 = require("./SharePointTarget");
var SPDataProviderServiceCollection_1 = require("../SPDataProviderServiceCollection");
/**
* Inversion Of Control class container.
* @param useLocalHost If is true then use the SharePointTargetLocal otherwise the SharePointTargetOnline as target.
*/
var SPContainer = /** @class */ (function (_super) {
    __extends(SPContainer, _super);
    function SPContainer(useLocalHost, serverRelativeUrl) {
        var _this = _super.call(this) || this;
        if (useLocalHost)
            _this.targetInfo = SharePointTarget_1.SharePointTargetLocal;
        else
            _this.targetInfo = undefined;
        _this.serverRelativeUrl = serverRelativeUrl;
        _this.declareDependencies();
        return _this;
    }
    SPContainer.prototype.declareDependencies = function () {
        this.bind(formgen_react_1.typesForInject.IDataProviderCollection).to(SPDataProviderServiceCollection_1.SPDataProviderServiceCollection);
        this.bind(SPDataProviderServiceCollection_1.typesForInjectSP.targetInfo).toConstantValue(this.targetInfo);
        this.bind(SPDataProviderServiceCollection_1.typesForInjectSP.serverRelativeUrl).toConstantValue(this.serverRelativeUrl);
    };
    return SPContainer;
}(inversify_1.Container));
exports.SPContainer = SPContainer;
//# sourceMappingURL=inversify.config.js.map