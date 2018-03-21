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
var SPDataProviderService_1 = require("./SPDataProviderService");
var formgen_react_1 = require("formgen-react");
/**
* Inversion Of Control class container
*/
var SPContainer = /** @class */ (function (_super) {
    __extends(SPContainer, _super);
    function SPContainer() {
        var _this = _super.call(this) || this;
        _this.declareDependencies();
        return _this;
    }
    SPContainer.prototype.declareDependencies = function () {
        this.bind(formgen_react_1.typesForInject.IDataProviderService).to(SPDataProviderService_1.SPDataProviderService);
    };
    return SPContainer;
}(inversify_1.Container));
exports.SPContainer = SPContainer;
//# sourceMappingURL=inversify.config.js.map