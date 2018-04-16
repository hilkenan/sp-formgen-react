"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Target that use the current Context
*/
var SharePointTargetOnline = /** @class */ (function () {
    function SharePointTargetOnline() {
    }
    SharePointTargetOnline.url = null;
    return SharePointTargetOnline;
}());
exports.SharePointTargetOnline = SharePointTargetOnline;
/**
* Target that use https://localhost:4323
*/
var SharePointTargetLocal = /** @class */ (function () {
    function SharePointTargetLocal() {
    }
    SharePointTargetLocal.url = "https://localhost:4323";
    return SharePointTargetLocal;
}());
exports.SharePointTargetLocal = SharePointTargetLocal;
//# sourceMappingURL=SharePointTarget.js.map