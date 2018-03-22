"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gd_sprest_1 = require("gd-sprest");
var SPHelper = /** @class */ (function () {
    /**
     * Takes the target Info as parmeter.s
     */
    function SPHelper(targetInfo) {
        this.targetInfo = targetInfo;
    }
    /**
     * Get the correct List View XML for the configured list settings.
     */
    SPHelper.prototype.getListViewXml = function (formData, config) {
        var webUrl = formData.SPConfig.BaseUrl + config.WebUrl;
        webUrl = this.getCorrectWebUrl(webUrl);
        var listView;
        if (!config.ViewName) {
            listView = this.getCamlQueryFromDevaultView(webUrl, config.ListName);
        }
        else {
            listView = this.getCamlQueryFromView(webUrl, config.ViewName, config.ListName);
        }
        return listView;
    };
    /**
     * Depending on environment att the target url.
     */
    SPHelper.prototype.getCorrectWebUrl = function (webUrl) {
        if (this.targetInfo.url && webUrl)
            return this.targetInfo.url + webUrl;
        else if (!this.targetInfo.url && !webUrl)
            return undefined;
        else
            return webUrl;
    };
    /**
     * Get the Defauld ListView cached from.
     */
    SPHelper.prototype.getCamlQueryFromDevaultView = function (webUrl, listName) {
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
    SPHelper.prototype.replaceAll = function (target, search, replacement) {
        return target.split(search).join(replacement);
    };
    /**
     * Collect the text for the display
     */
    SPHelper.prototype.getDisplayTextFromConfig = function (item, config) {
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