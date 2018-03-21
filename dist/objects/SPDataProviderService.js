"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var formgen_react_1 = require("formgen-react");
var gd_sprest_1 = require("gd-sprest");
var SharePointTarget_1 = require("../SharePointTarget");
var SPHelper_1 = require("../SPHelper");
var Helper_1 = require("formgen-react/dist/Helper");
var SPDataProviderService = /** @class */ (function () {
    function SPDataProviderService() {
    }
    /**
     * Retrieve data from the store
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    SPDataProviderService.prototype.retrieveListData = function (configKey, controlConfig, lang) {
        var _this = this;
        var config = this.formData.SPConfig.ListConfigs.find(function (c) { return c.Key == configKey; });
        if (!config)
            throw "No List Configuration found for key " + configKey;
        return new Promise(function (resolve, reject) {
            var spConfig = Helper_1.Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
            var webUrl = spConfig.BaseUrl ? spConfig.BaseUrl : "" +
                config.ListConfig.WebUrl ? config.ListConfig.WebUrl : "";
            webUrl = SPHelper_1.SPHelper.getCorrectWebUrl(webUrl);
            var listView = SPHelper_1.SPHelper.getListViewXml(_this.formData, config.ListConfig);
            gd_sprest_1.$REST.Web(webUrl, SharePointTarget_1.SharePointTarget)
                .Lists()
                .getByTitle(config.ListConfig.ListName)
                .getItems(listView).execute(function (items) {
                switch (controlConfig.RenderType) {
                    case formgen_react_1.ControlTypes.DropDown:
                    case formgen_react_1.ControlTypes.ComboBox:
                    case formgen_react_1.ControlTypes.ChoiceGroup:
                        var dropDonwEntries = [];
                        for (var _i = 0, _a = items.results; _i < _a.length; _i++) {
                            var item = _a[_i];
                            dropDonwEntries.push({
                                key: item[config.ListConfig.KeyField],
                                text: SPHelper_1.SPHelper.getDisplayTextFromConfig(item, config.ListConfig)
                            });
                        }
                        resolve(dropDonwEntries);
                        break;
                    default:
                        var cascadData = [];
                        for (var _b = 0, _c = items.results; _b < _c.length; _b++) {
                            var item = _c[_b];
                            cascadData.push(_this.getCascaderItems(webUrl, item, config.ListConfig));
                        }
                        resolve(cascadData);
                        break;
                }
            });
        });
    };
    /**
     * Get the Cacading Item with all the Childs and subchilds
     * @param webUrl  Root Web Url for the Lists.
     * @param item List item to use for the data.
     * @param listConfig The List configuration for this level.
     */
    SPDataProviderService.prototype.getCascaderItems = function (webUrl, item, listConfig) {
        var key = item[listConfig.KeyField];
        var cItem = {
            value: key.toString(),
            label: SPHelper_1.SPHelper.getDisplayTextFromConfig(item, listConfig),
            disabled: item[listConfig.DisabledField] ?
                item[listConfig.DisabledField] : undefined
        };
        if (listConfig.ChildLists) {
            var citems = [];
            for (var _i = 0, _a = listConfig.ChildLists; _i < _a.length; _i++) {
                var childConfig = _a[_i];
                var config = Helper_1.Helper.getTranslatedObject(childConfig.Config, childConfig.ConfigTranslation);
                var items = gd_sprest_1.$REST.Web(webUrl, SharePointTarget_1.SharePointTarget)
                    .Lists()
                    .getByTitle(config.ListName)
                    .Items()
                    .query({
                    Top: 1000,
                    Filter: childConfig.ParentField + " eq " + key,
                    OrderBy: [config.DisplayFields[0].InternalName],
                    Select: ["*"]
                })
                    .executeAndWait();
                if (items.results) {
                    for (var _b = 0, _c = items.results; _b < _c.length; _b++) {
                        var item1 = _c[_b];
                        var cItem1 = this.getCascaderItems(webUrl, item1, config);
                        citems.push(cItem1);
                    }
                }
            }
            if (citems.length > 0)
                cItem["children"] = citems;
        }
        return cItem;
    };
    SPDataProviderService = __decorate([
        inversify_1.injectable()
    ], SPDataProviderService);
    return SPDataProviderService;
}());
exports.SPDataProviderService = SPDataProviderService;
//# sourceMappingURL=SPDataProviderService.js.map