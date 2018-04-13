"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formgen_react_1 = require("formgen-react");
var gd_sprest_1 = require("gd-sprest");
var SPHelper_1 = require("../SPHelper");
var Helper_1 = require("formgen-react/dist/Helper");
/**
* The Provider Service to access SharePoint Lists
*/
var SPListProviderService = /** @class */ (function () {
    /**
     * Takes the target Info as parmeter.
     */
    function SPListProviderService(targetInfo) {
        this.providerServiceKey = "SPListProvider";
        this.targetInfo = targetInfo;
        this.spHelper = new SPHelper_1.SPHelper(targetInfo);
    }
    /**
     *Get from the config key the List Config
     * @param configKey The Config Key to get Infos from.
     */
    SPListProviderService.prototype.getConfigFromKey = function (configKey) {
        if (!configKey)
            throw "No List Configuration defined";
        var configParts = configKey.split(".");
        var config = this.formData.SPConfig.ListConfigs.find(function (c) { return c.Key == configParts[0]; });
        if (!config)
            throw "No List Configuration found for key " + configParts[0];
        return config;
    };
    /**
      * Add a file to the lib
      * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
      * @param controlConfig The control that calls the request.
      * @param fileName The FileName to be stored.
      * @param fileContent The Content of the file.
      * @returns The full path where the file was stored.
      */
    SPListProviderService.prototype.addFile = function (configKey, controlConfig, fileName, fileContent) {
        var config = this.getConfigFromKey(configKey);
        var spConfig = Helper_1.Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
        var webUrl = this.spHelper.getWebUrl(config, spConfig);
        var rootFolder = gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .RootFolder()
            .executeAndWait();
        var folderUrl = rootFolder.ServerRelativeUrl + "/" + this.formData.ID + "_" + controlConfig.ID;
        gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .RootFolder()
            .Folders()
            .add(folderUrl)
            .executeAndWait();
        var result = gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .RootFolder()
            .Folders()
            .getbyurl(folderUrl)
            .Files()
            .add(true, fileName, fileContent)
            .executeAndWait();
        return result.ServerRelativeUrl;
    };
    /**
     * Remove a file from the lib
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be removed.
     */
    SPListProviderService.prototype.removeFile = function (configKey, controlConfig, fileName) {
        var config = this.getConfigFromKey(configKey);
        var spConfig = Helper_1.Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
        var webUrl = this.spHelper.getWebUrl(config, spConfig);
        var files = controlConfig.Value;
        if (files) {
            var file = files.find(function (f) { return f.fileName == fileName; });
            if (file)
                gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
                    .getFileByServerRelativeUrl(file.storedPath)
                    .delete()
                    .executeAndWait();
            if (files.length == 1) {
                var rootFolder = gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
                    .Lists()
                    .getByTitle(config.ListConfig.ListName)
                    .RootFolder()
                    .executeAndWait();
                var folderUrl = rootFolder.ServerRelativeUrl + "/" + this.formData.ID + "_" + controlConfig.ID;
                gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
                    .Lists()
                    .getByTitle(config.ListConfig.ListName)
                    .RootFolder()
                    .Folders()
                    .getbyurl(folderUrl)
                    .delete()
                    .executeAndWait();
            }
        }
    };
    /**
     * Retrieve list data from the store filtered and optional limited with count of result items
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     * @param filter The filterstring to use
     * @param limitResults Count of items to return at max.
     */
    SPListProviderService.prototype.retrieveFilteredListData = function (configKey, controlConfig, lang, filter, limitResults) {
        var _this = this;
        var configParts = configKey.split(".");
        var config = this.getConfigFromKey(configKey);
        return new Promise(function (resolve, reject) {
            var spConfig = Helper_1.Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
            var webUrl = _this.spHelper.getWebUrl(config, spConfig);
            var listView = _this.spHelper.getListViewXml(_this.formData, config.ListConfig);
            if (filter) {
                if (configParts.length < 2)
                    throw "When a filter is defined, then also a field name must be specified";
                var fieldName = configParts[1];
                var operator = " eq ";
                if (configParts.length == 3)
                    operator = " " + configParts[2] + " ";
                if (isNaN(parseFloat(filter)))
                    filter = " '" + filter + "'";
                gd_sprest_1.$REST.Web(webUrl, _this.targetInfo)
                    .Lists()
                    .getByTitle(config.ListConfig.ListName)
                    .query({
                    Top: limitResults,
                    Filter: fieldName + operator + filter,
                    GetAllItems: true
                }).execute(function (items) {
                    resolve(_this.confertListData(controlConfig, items.Items, config, webUrl, lang));
                });
            }
            else {
                gd_sprest_1.$REST.Web(webUrl, _this.targetInfo)
                    .Lists()
                    .getByTitle(config.ListConfig.ListName)
                    .getItems(listView).execute(function (items) {
                    resolve(_this.confertListData(controlConfig, items, config, webUrl, lang));
                });
            }
        });
    };
    /**
     * Retrieve list data from the store filtered and optional limited with count of result items
     * @param controlConfig The control that calls the request.
     * @param items The Result from the search.
     * @param config The configuration for a list.
     * @param webUrl The url where the list is.
     */
    SPListProviderService.prototype.confertListData = function (controlConfig, items, config, webUrl, lang) {
        switch (controlConfig.RenderType) {
            case formgen_react_1.ControlTypes.DropDown:
            case formgen_react_1.ControlTypes.ComboBox:
            case formgen_react_1.ControlTypes.ChoiceGroup:
                var dropDonwEntries = [];
                for (var _i = 0, _a = items.results; _i < _a.length; _i++) {
                    var item = _a[_i];
                    dropDonwEntries.push({
                        key: item[config.ListConfig.KeyField],
                        text: this.spHelper.getDisplayTextFromConfig(item, config.ListConfig, lang)
                    });
                }
                return dropDonwEntries;
            default:
                var cascadData = [];
                for (var _b = 0, _c = items.results; _b < _c.length; _b++) {
                    var item = _c[_b];
                    cascadData.push(this.getCascaderItems(webUrl, item, config.ListConfig, lang));
                }
                return cascadData;
        }
    };
    /**
     * Retrieve data from the sharepoint
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    SPListProviderService.prototype.retrieveListData = function (configKey, controlConfig, lang) {
        return this.retrieveFilteredListData(configKey, controlConfig, lang, undefined, undefined);
    };
    /**
     * Retrieve singel data from the store based on an key. Variations of Key format:
     * MyUserDataProvider.firstName --> Get for the current control from the "MyUserDataProvider (= providerServiceKey) the Information "firstName"
     * MyUserDataProvider.manager.firstName --> Get for the current control from the element manager the firstName. This type of object for this control has to support sub elements.
     * MyUserDataProvider.[thisForm.manager].firstName --> Get for control "thisForm.manager" the element "firstName"
     * MyUserDataProvider.[thisForm.anyUser].manager.firstName --> Get for control "thisForm.anyUser" from the element manager the firstName. This type of object for this control has to support sub elements.
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param senderControl The control config that sends the request.
     * @param receiverControl The control config that receives the value.
     * @param lang The current language to use.
     */
    SPListProviderService.prototype.retrieveSingleData = function (configKey, senderControl, receiverControl, lang) {
        var _this = this;
        var configParts = configKey.split(".");
        if (configParts.length < 3)
            throw "At least the providerkey, the list config, the filter fieldname and the filtervalue has to be defined e.g. SPListProvider.MyList.Title.test (would filter from the myList the Title with the value 'test'";
        var config = this.getConfigFromKey(configKey);
        return new Promise(function (resolve, reject) {
            var spConfig = Helper_1.Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
            var webUrl = _this.spHelper.getWebUrl(config, spConfig);
            var fieldName = configParts[1];
            var filter = configParts[2];
            if (isNaN(parseFloat(filter)))
                filter = " '" + filter + "'";
            var displayFieldName = undefined;
            if (configParts.length > 3)
                displayFieldName = configParts[3];
            gd_sprest_1.$REST.Web(webUrl, _this.targetInfo)
                .Lists()
                .getByTitle(config.ListConfig.ListName)
                .query({
                Top: 1,
                Filter: fieldName + " eq " + filter,
                GetAllItems: true
            }).execute(function (items) {
                if (items && items.Items && items.Items.results && items.Items.results.length > 0) {
                    var text = _this.spHelper.getDisplayTextFromConfig(items.Items.results[0], config.ListConfig, lang, displayFieldName);
                    resolve(text);
                }
                else
                    resolve(undefined);
            });
        });
    };
    /**
     * Get the Cacading Item with all the Childs and subchilds
     * @param webUrl  Root Web Url for the Lists.
     * @param item List item to use for the data.
     * @param listConfig The List configuration for this level.
     * @param lang The current language to use.
     */
    SPListProviderService.prototype.getCascaderItems = function (webUrl, item, listConfig, lang) {
        var key = item[listConfig.KeyField];
        var cItem = {
            value: key.toString(),
            label: this.spHelper.getDisplayTextFromConfig(item, listConfig, lang),
            disabled: item[listConfig.DisabledField] ?
                item[listConfig.DisabledField] : undefined
        };
        if (listConfig.ChildLists) {
            var citems = [];
            for (var _i = 0, _a = listConfig.ChildLists; _i < _a.length; _i++) {
                var childConfig = _a[_i];
                var config = Helper_1.Helper.getTranslatedObject(childConfig.Config, childConfig.ConfigTranslation);
                var items = gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
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
                        var cItem1 = this.getCascaderItems(webUrl, item1, config, lang);
                        citems.push(cItem1);
                    }
                }
            }
            if (citems.length > 0)
                cItem["children"] = citems;
        }
        return cItem;
    };
    return SPListProviderService;
}());
exports.SPListProviderService = SPListProviderService;
//# sourceMappingURL=SPListProviderService.js.map