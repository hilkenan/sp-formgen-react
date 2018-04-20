"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gd_sprest_1 = require("gd-sprest");
/**
 * Helper class to acces sharepoint.
 */
var SPHelper = /** @class */ (function () {
    /**
     * Takes the target Info
     * @param serverRelativeUrl The server url from the request.
     * @param targetInfo Target to use (local or current context)
     */
    function SPHelper(serverRelativeUrl, targetInfo) {
        this.targetInfo = targetInfo;
        this.serverRelativeUrl = serverRelativeUrl;
    }
    /**
     * Get the correct List View XML for the configured list settings.
     * @param formData the Current Form Data object
     * @param config The Config for the List to get the view from.
     */
    SPHelper.prototype.getListViewXml = function (formData, config) {
        var webUrl = formData.SPConfig.BaseUrl + config.WebUrl;
        webUrl = this.getCorrectWebUrl(webUrl);
        var listView;
        if (!config.ViewName) {
            listView = this.getCamlQueryFromDefaultView(webUrl, config.ListName);
        }
        else {
            listView = this.getCamlQueryFromView(webUrl, config.ViewName, config.ListName);
        }
        return listView;
    };
    /**
     * Depending on environment att the target url.
     * @param webUrl The Url relative to the base url
     */
    SPHelper.prototype.getCorrectWebUrl = function (webUrl) {
        if (this.targetInfo && this.targetInfo.url && (webUrl || webUrl == ""))
            return this.targetInfo.url + this.serverRelativeUrl + webUrl;
        else if ((!this.targetInfo || !this.targetInfo.url) && !webUrl)
            return this.serverRelativeUrl;
        return this.serverRelativeUrl + webUrl;
    };
    /**
     * Get the correct web url from the list.
     * @param config The config for the given list
     * @param controlConfig SharePoint part of the configuration (translated)
     */
    SPHelper.prototype.getWebUrl = function (config, spConfig) {
        var webUrl = spConfig.BaseUrl ? spConfig.BaseUrl : "" +
            config.ListConfig.WebUrl ? config.ListConfig.WebUrl : "";
        return this.getCorrectWebUrl(webUrl);
    };
    /**
     * Get the Defauld ListView cached from.
     * @param webUrl The Url relative to the base url
     * @param listName The Dipslay name of the list to use.
     */
    SPHelper.prototype.getCamlQueryFromDefaultView = function (webUrl, listName) {
        if (this.camlQueries == undefined)
            this.camlQueries = [];
        var key = listName + ":defaultView";
        var item = this.camlQueries.find(function (v) { return v.ViewName == key; });
        if (item)
            return item.Query;
        var view = gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(listName)
            .DefaultView()
            .executeAndWait();
        this.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        });
        return this.camlQueries.find(function (v) { return v.ViewName == key; }).Query;
    };
    /**
     * Replace the all occurencies from search in the target with replacments
     * @param target the origin string
     * @param search the search string
     * @param replacement the replacment string
     */
    SPHelper.replaceAll = function (target, search, replacement) {
        return target.split(search).join(replacement);
    };
    /**
     * Collect the text for the display
     * @param item The ListItem Result to collect texts from.
     * @param config The Configuration for this list.
     * @param lang The language if use language specific fieldnames
     * @param configFieldName If defined then use this fieldName insted in the config devined ones
     */
    SPHelper.prototype.getDisplayTextFromConfig = function (item, config, lang, configFieldName) {
        var texts = [];
        for (var _i = 0, _a = config.DisplayFields; _i < _a.length; _i++) {
            var fieldConfig = _a[_i];
            var fieldNaame = fieldConfig.UseLanguageVariants ?
                fieldConfig.InternalName + "_" + lang : fieldConfig.InternalName;
            if (configFieldName)
                fieldNaame = fieldConfig.UseLanguageVariants ?
                    configFieldName + "_" + lang : configFieldName;
            var fieldValue = item[fieldNaame];
            if (fieldConfig.DisplayFormat) {
                fieldValue = SPHelper.replaceAll(fieldConfig.DisplayFormat, "{fieldValue}", fieldValue);
            }
            texts.push(fieldValue);
        }
        var text = "";
        if (config.DisplayFormat) {
            text = config.DisplayFormat;
            for (var i = 0; i < texts.length; i++) {
                text = SPHelper.replaceAll(text, "{texts[" + i + "]}", texts[i]);
            }
        }
        else
            text = texts.join(',');
        return text;
    };
    /**
     * Get the ListView cached from the given view name.
     * @param webUrl The Url relative to the base url
     * @param viewName The view name to get the caml from.
     * @param listName The Name of the list.
     */
    SPHelper.prototype.getCamlQueryFromView = function (webUrl, viewName, listName) {
        if (this.camlQueries == undefined)
            this.camlQueries = [];
        var key = listName + ":" + viewName;
        var item = this.camlQueries.find(function (v) { return v.ViewName == key; });
        if (item)
            return item.Query;
        var view = gd_sprest_1.$REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(listName)
            .Views()
            .getByTitle(viewName)
            .executeAndWait();
        this.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        });
        return this.camlQueries.find(function (v) { return v.ViewName == key; }).Query;
    };
    return SPHelper;
}());
exports.SPHelper = SPHelper;
//# sourceMappingURL=SPHelper.js.map