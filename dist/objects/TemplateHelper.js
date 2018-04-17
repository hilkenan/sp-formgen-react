"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var formgen_react_1 = require("formgen-react");
var jsonpath = require("jsonpath");
var Helper_1 = require("formgen-react/dist/Helper");
var TemplateHelper = /** @class */ (function () {
    function TemplateHelper() {
    }
    TemplateHelper.getTemplatedTitle = function (formDataJson) {
        var formData = formgen_react_1.ObjectFabric.getForm(formDataJson, __1.JSPFormData);
        if (formData.TitleTemplate) {
            var title = Helper_1.Helper.getTranslatedProperty(formgen_react_1.TranslatedProperty.Message, formData.TitleTemplate);
            if (formData.TitleTemplate.TemplateVariables) {
                for (var _i = 0, _a = formData.TitleTemplate.TemplateVariables; _i < _a.length; _i++) {
                    var templVariable = _a[_i];
                    var varObjects = jsonpath.query(formDataJson, templVariable.JsonPath, 1);
                    if (varObjects.length > 0) {
                        title = __1.SPHelper.replaceAll(title, "[" + templVariable.Name + "]", varObjects[0]);
                    }
                }
            }
            return title;
        }
        return undefined;
    };
    return TemplateHelper;
}());
exports.TemplateHelper = TemplateHelper;
//# sourceMappingURL=TemplateHelper.js.map