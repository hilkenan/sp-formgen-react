"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SPHelper_1 = require("../SPHelper");
/**
* The base Provider Service to access the shrepoint services
*/
var SPProviderServiceBase = /** @class */ (function () {
    /**
     * Takes the target Info as parmeter.
     */
    function SPProviderServiceBase(serverRelativeUrl, targetInfo) {
        this.targetInfo = targetInfo;
        this.serverRelativeUrl = serverRelativeUrl;
    }
    SPProviderServiceBase.prototype.initialize = function () {
        if (!this.spConfig) {
            this.spConfig = SPHelper_1.SPHelper.LoadConfig(this.serverRelativeUrl, this.targetInfo, this.formData.DataProviderConfigName);
            this.spHelper = new SPHelper_1.SPHelper(this.serverRelativeUrl, this.targetInfo, this.spConfig);
        }
    };
    return SPProviderServiceBase;
}());
exports.SPProviderServiceBase = SPProviderServiceBase;
//# sourceMappingURL=SPProviderServiceBase.js.map