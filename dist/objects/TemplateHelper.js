"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var formgen_react_1 = require("formgen-react");
var Helper_1 = require("formgen-react/dist/Helper");
var TemplateHelper = /** @class */ (function () {
    function TemplateHelper() {
    }
    TemplateHelper.getTemplatedTitle = function (formDataJson) {
        var formData = formgen_react_1.ObjectFabric.getForm(formDataJson, __1.JSPFormData);
        if (formData.Message) {
            var title = Helper_1.Helper.getTranslatedProperty(formgen_react_1.TranslatedProperty.Message, formData);
            var result = title.match("\\[(.*)]");
            if (result) {
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var key = result_1[_i];
                    var control = TemplateHelper.findeControlFromKey(formData, key);
                    if (control) {
                        title = __1.SPHelper.replaceAll(title, "[" + key + "]", control.Value);
                    }
                    else {
                        title = __1.SPHelper.replaceAll(title, "[" + key + "]", "");
                    }
                }
            }
            return title;
        }
        return undefined;
    };
    /**
     * Finde with the full control id the Control in the tree.
     * @param inputKey The full control id to finde the corresponding control
     */
    TemplateHelper.findeControlFromKey = function (formData, inputKey) {
        var control;
        var controlStruct = inputKey.split(".");
        if (formData.Rows)
            control = TemplateHelper.findeControlInRow(formData.Rows, controlStruct, 1);
        return control;
    };
    /**
     * Find the Control with the ID in the tree of controls
     * @param rows Row Array
     * @param controlStruct ID Structure. the Element 0 is the id from the form an will not be used
     * @param level The level in where to search in the contrlStruct.
     */
    TemplateHelper.findeControlInRow = function (rows, controlStruct, level) {
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            for (var _a = 0, _b = row.Columns; _a < _b.length; _a++) {
                var col = _b[_a];
                var control = TemplateHelper.findeControlInControls(col.Controls, controlStruct, level);
                if (control)
                    return control;
            }
        }
        return undefined;
    };
    /**
     * Find the Control with the ID in the tree of controls
     * @param controls Control Array
     * @param controlStruct ID Structure. the Element 0 is the id from the form an will not be used
     * @param level The level in where to search in the contrlStruct.
     */
    TemplateHelper.findeControlInControls = function (controls, controlStruct, level) {
        var id = Helper_1.Helper.cleanUpKey(controlStruct[level]);
        var control = controls.find(function (c) { return c.ID == id; });
        if (controlStruct.length - 1 != level)
            if (control && control.SubRows)
                control = TemplateHelper.findeControlInRow(control.SubRows, controlStruct, level + 1);
            else if (control && control.SubControls)
                control = TemplateHelper.findeControlInControls(control.SubControls, controlStruct, level + 1);
        return control;
    };
    return TemplateHelper;
}());
exports.TemplateHelper = TemplateHelper;
//# sourceMappingURL=TemplateHelper.js.map