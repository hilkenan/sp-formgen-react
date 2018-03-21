"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SharePointTarget_1 = require("./SharePointTarget");
var gd_sprest_1 = require("gd-sprest");
var SPHelper = /** @class */ (function () {
    function SPHelper() {
    }
    /**
     * Get the correct List View XML for the configured list settings.
     */
    SPHelper.getListViewXml = function (formData, config) {
        var webUrl = formData.SPConfig.BaseUrl + config.WebUrl;
        webUrl = SPHelper.getCorrectWebUrl(webUrl);
        var listView;
        if (!config.ViewName) {
            listView = SPHelper.getCamlQueryFromDevaultView(webUrl, config.ListName);
        }
        else {
            listView = SPHelper.getCamlQueryFromView(webUrl, config.ViewName, config.ListName);
        }
        return listView;
    };
    /**
     * Depending on environment att the target url.
     */
    SPHelper.getCorrectWebUrl = function (webUrl) {
        if (SharePointTarget_1.SharePointTarget.url && webUrl)
            return SharePointTarget_1.SharePointTarget.url + webUrl;
        else if (!SharePointTarget_1.SharePointTarget.url && !webUrl)
            return undefined;
        else
            return webUrl;
    };
    /**
     * Get the Defauld ListView cached from.
     */
    SPHelper.getCamlQueryFromDevaultView = function (webUrl, listName) {
        if (SPHelper.camlQueries == undefined)
            SPHelper.camlQueries = [];
        var key = listName + ":defaultView";
        var item = SPHelper.camlQueries.find(function (v) { return v.ViewName == key; });
        if (item)
            return item.Query;
        var view = gd_sprest_1.$REST.Web(webUrl, SharePointTarget_1.SharePointTarget)
            .Lists()
            .getByTitle(listName)
            .DefaultView()
            .executeAndWait();
        SPHelper.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        });
        return SPHelper.camlQueries.find(function (v) { return v.ViewName == key; }).Query;
    };
    SPHelper.replaceAll = function (target, search, replacement) {
        return target.split(search).join(replacement);
    };
    /**
     * Collect the text for the display
     */
    SPHelper.getDisplayTextFromConfig = function (item, config) {
        var texts = [];
        for (var _i = 0, _a = config.DisplayFields; _i < _a.length; _i++) {
            var fieldName = _a[_i];
            var fieldValue = item[fieldName.InternalName];
            if (fieldName.DisplayFormat) {
                fieldValue = this.replaceAll(fieldName.DisplayFormat, "{fieldValue}", fieldValue);
            }
            texts.push(fieldValue);
        }
        var text = "";
        if (config.DisplayFormat) {
            text = config.DisplayFormat;
            for (var i = 0; i < texts.length; i++) {
                text = this.replaceAll(text, "{texts[" + i + "]}", texts[i]);
            }
        }
        else
            text = texts.join(',');
        return text;
    };
    /**
     * Get the ListView cached from the given view name.
     */
    SPHelper.getCamlQueryFromView = function (webUrl, viewName, listName) {
        if (SPHelper.camlQueries == undefined)
            SPHelper.camlQueries = [];
        var key = listName + ":" + viewName;
        var item = SPHelper.camlQueries.find(function (v) { return v.ViewName == key; });
        if (item)
            return item.Query;
        var view = gd_sprest_1.$REST.Web(webUrl, SharePointTarget_1.SharePointTarget)
            .Lists()
            .getByTitle(listName)
            .Views()
            .getByTitle(viewName)
            .executeAndWait();
        SPHelper.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        });
        return SPHelper.camlQueries.find(function (v) { return v.ViewName == key; }).Query;
    };
    return SPHelper;
}());
exports.SPHelper = SPHelper;
//# sourceMappingURL=SPHelper.js.map