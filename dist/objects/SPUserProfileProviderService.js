"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gd_sprest_1 = require("gd-sprest");
var Helper_1 = require("formgen-react/dist/Helper");
var __1 = require("..");
/**
* The Provider Service to access the User Profile from SharePoint
*/
var SPUserProfileProviderService = /** @class */ (function () {
    /**
     * Takes the target Info as parmeter.
     */
    function SPUserProfileProviderService(serverRelativeUrl, targetInfo) {
        this.providerServiceKey = "SPUserProfileProvider";
        this.targetInfo = targetInfo;
        this.spHelper = new __1.SPHelper(serverRelativeUrl, targetInfo);
    }
    /**
     * Retrieve list data from the store filtered and optional limited with count of result items
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     * @param filter The filterstring to use
     * @param limitResults Count of items to return at max.
     */
    SPUserProfileProviderService.prototype.retrieveFilteredListData = function (configKey, controlConfig, lang, filter, limitResults) {
        var _this = this;
        var providerConfigKey = Helper_1.Helper.getConfigKeyFromProviderKey(configKey);
        var configParts = providerConfigKey.split(".");
        if (configParts.length < 2)
            throw "At least the Provider, the name of the property(properties) to receive, and the filter Prpoerty has to be defined e.g. SPUserProfileProvider.AccountName to get the account name of the filtered User";
        return new Promise(function (resolve, reject) {
            var webUrl = _this.spHelper.getCorrectWebUrl("");
            var operator = "eq";
            if (configParts.length == 3)
                operator = configParts[2];
            var filterStar = filter + "*";
            if (isNaN(parseFloat(filter))) {
                filterStar = "\"" + filter + "*\"";
                filter = "\"" + filter + "\"";
            }
            var kqlFilter = "";
            switch (operator) {
                case "ne":
                    kqlFilter = configParts[0] + "<>" + filter;
                    break;
                case "lt":
                    kqlFilter = configParts[0] + "<" + filter;
                    break;
                case "gt":
                    kqlFilter = configParts[0] + ">" + filter;
                    break;
                case "ge":
                    kqlFilter = configParts[0] + ">=" + filter;
                    break;
                case "le":
                    kqlFilter = configParts[0] + "<=" + filter;
                    break;
                case "eq":
                    kqlFilter = configParts[0] + "=" + filter;
                    break;
                case "substring":
                    kqlFilter = configParts[0] + ":" + filterStar;
                    break;
                case "startswith":
                    kqlFilter = configParts[0] + "=" + filterStar;
                    break;
                default:
                    kqlFilter = configParts[0] + "=" + filter;
                    break;
            }
            gd_sprest_1.$REST.Search(webUrl, _this.targetInfo)
                .postquery({
                SourceId: "B09A7990-05EA-4AF9-81EF-EDFAB16C4E31",
                Querytext: kqlFilter,
                TrimDuplicates: true,
                RowLimit: limitResults
            })
                .execute(function (result) {
                var queryResult = result["postquery"];
                var rowsObject = queryResult.PrimaryQueryResult.RelevantResults.Table.Rows["results"];
                var promises = [];
                for (var _i = 0, rowsObject_1 = rowsObject; _i < rowsObject_1.length; _i++) {
                    var row = rowsObject_1[_i];
                    var cells = row["Cells"]["results"];
                    var accountNameCell = cells.find(function (c) { return c.Key == "AccountName"; });
                    promises.push(_this.getPropertiesFor(accountNameCell.Value));
                }
                var promises2 = [];
                Promise.all(promises).then(function (innerProm) {
                    for (var _i = 0, innerProm_1 = innerProm; _i < innerProm_1.length; _i++) {
                        var p = innerProm_1[_i];
                        promises2.push(p.json());
                    }
                    Promise.all(promises2).then(function (allValues) {
                        var subPropertyName = configParts[1];
                        var dropDonwEntries = [];
                        for (var _i = 0, allValues_1 = allValues; _i < allValues_1.length; _i++) {
                            var json = allValues_1[_i];
                            var innerValue = json["d"][subPropertyName];
                            if (innerValue == undefined && json["d"]["UserProfileProperties"]) {
                                var resArray = json["d"]["UserProfileProperties"].results;
                                var valueO = resArray.find(function (e) { return e.Key == subPropertyName; });
                                if (valueO)
                                    innerValue = valueO.Value;
                            }
                            if (innerValue) {
                                dropDonwEntries.push({
                                    key: json["d"]["AccountName"],
                                    text: innerValue
                                });
                            }
                        }
                        resolve(dropDonwEntries);
                    });
                });
            });
        });
    };
    /**
     * Add a photo to the current users UserProfile
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be stored.
     * @param fileContent The Content of the file.
     * @returns The full path where the file was stored.
     */
    SPUserProfileProviderService.prototype.addFile = function (configKey, controlConfig, fileName, fileContent) {
        var webUrl = this.spHelper.getCorrectWebUrl("");
        var peopleManager = new gd_sprest_1.PeopleManager(this.targetInfo);
        peopleManager.setMyProfilePicture(fileContent)
            .executeAndWait();
        var user = (new gd_sprest_1.Web(webUrl, this.targetInfo))
            .CurrentUser()
            .executeAndWait();
        var property = peopleManager.getUserProfilePropertyFor(user.LoginName, "PictureUrl")
            .executeAndWait();
        return property.PictureUrl;
    };
    /**
     * Remove a foto from the current UserProfile
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be removed.
     */
    SPUserProfileProviderService.prototype.removeFile = function (configKey, controlConfig, fileName) {
        var peopleManager = new gd_sprest_1.PeopleManager(this.targetInfo);
        peopleManager.setMyProfilePicture(undefined)
            .executeAndWait();
    };
    /**
     * Manual Call the Rest API Method (buggy gd-sprest)
     * @param account Account Name
     */
    SPUserProfileProviderService.prototype.getPropertiesFor = function (account) {
        account = encodeURIComponent(account);
        var webUrl = this.spHelper.getCorrectWebUrl("");
        var apiUrl = webUrl + "/_api/sp.userprofiles.peoplemanager/getPropertiesFor(accountName=@v)?@v='" + account + "'";
        return fetch(apiUrl);
    };
    /**
     * Retrieve the properties form the managers or the reports from the given profile.
     * @param propertyName PropertyName for the parent proeprty
     * @param configParts The parts from the configkey
     * @param profile The Person Properties (Profile)
     * @param manager The People Manager
     */
    SPUserProfileProviderService.prototype.getPropertyForOthers = function (propertyName, configParts, profile) {
        var _this = this;
        return new Promise(function (resolve) {
            var value = profile[propertyName];
            if (configParts.length > 1) {
                var innerObject = undefined;
                if (configParts[0] == "reports")
                    innerObject = profile.ExtendedReports;
                else if (configParts[0] == "managers") {
                    innerObject = profile.ExtendedManagers;
                }
                if (innerObject) {
                    var result = innerObject["results"];
                    var accounts = void 0;
                    accounts = result;
                    if (configParts.length == 2) {
                        var promises = [];
                        for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
                            var account = accounts_1[_i];
                            if (account != profile.AccountName) {
                                promises.push(_this.getPropertiesFor(account));
                            }
                        }
                        var promises2_1 = [];
                        Promise.all(promises).then(function (innerProm) {
                            for (var _i = 0, innerProm_2 = innerProm; _i < innerProm_2.length; _i++) {
                                var p = innerProm_2[_i];
                                promises2_1.push(p.json());
                            }
                            Promise.all(promises2_1).then(function (allValues) {
                                var values = [];
                                var subPropertyName = configParts[1];
                                for (var _i = 0, allValues_2 = allValues; _i < allValues_2.length; _i++) {
                                    var json = allValues_2[_i];
                                    var innerValue = json["d"][subPropertyName];
                                    if (innerValue == undefined && json["d"]["UserProfileProperties"]) {
                                        var resArray = json["d"]["UserProfileProperties"].results;
                                        var valueO = resArray.find(function (e) { return e.Key == subPropertyName; });
                                        if (valueO)
                                            innerValue = valueO.Value;
                                    }
                                    values.push(innerValue);
                                }
                                resolve(values.join(","));
                            });
                        });
                    }
                    else
                        resolve(accounts.join(","));
                }
            }
            else
                resolve(value);
        });
    };
    /**
     * Retrieve data from the sharepoint
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    SPUserProfileProviderService.prototype.retrieveListData = function (configKey, controlConfig, lang) {
        var _this = this;
        var configParts = configKey.split(".");
        if (configParts.length == 0)
            throw "At least the Provider and the name of the property has to be defined e.g. SPUserProfileProvider.AccountName to get all site users account name";
        return new Promise(function (resolve, reject) {
            var webUrl = _this.spHelper.getCorrectWebUrl("");
            if (configParts.length == 2) {
                var groupName = configParts[1];
                (new gd_sprest_1.Web(webUrl, _this.targetInfo))
                    .SiteGroups()
                    .getByName(groupName)
                    .query({
                    Top: 9999,
                    GetAllItems: true,
                    Expand: ["Users"]
                })
                    .execute(function (group) {
                    var list = [];
                    if (group && group.Users && group.Users.results && group.Users.results.length > 0) {
                        var promises = [];
                        for (var _i = 0, _a = group.Users.results; _i < _a.length; _i++) {
                            var user = _a[_i];
                            promises.push(_this.fillValueFromUser(configParts, user));
                        }
                        Promise.all(promises).then(function (values) {
                            var _loop_1 = function (val) {
                                if (val && list.find(function (l) { return l.key == val.key; }) == undefined) {
                                    list.push(val);
                                }
                            };
                            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                                var val = values_1[_i];
                                _loop_1(val);
                            }
                            resolve(list);
                        });
                        return;
                    }
                    else
                        resolve(undefined);
                });
            }
            else {
                (new gd_sprest_1.Web(webUrl, _this.targetInfo))
                    .SiteUsers()
                    .query({
                    Top: 9999,
                    GetAllItems: true
                })
                    .execute(function (users) {
                    var list = [];
                    if (users && users.results && users.results.length > 0) {
                        var promises = [];
                        for (var _i = 0, _a = users.results; _i < _a.length; _i++) {
                            var user = _a[_i];
                            promises.push(_this.fillValueFromUser(configParts, user));
                        }
                        Promise.all(promises).then(function (values) {
                            var _loop_2 = function (val) {
                                if (val && list.find(function (l) { return l.key == val.key; }) == undefined) {
                                    list.push(val);
                                }
                            };
                            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                                var val = values_2[_i];
                                _loop_2(val);
                            }
                            resolve(list);
                        });
                    }
                    else
                        resolve(undefined);
                });
            }
        });
    };
    /**
     * Fill the list with the concatinated user properties defined at the 0 element from the configParts (has to delimited with ,)
     * @param configParts The parts from the configkey
     * @param user The User Data
     * @param list The List to fill
     */
    SPUserProfileProviderService.prototype.fillValueFromUser = function (configParts, user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var propertyNames = configParts[0].split(",");
            _this.getPropertiesFor(user.LoginName).then(function (response) {
                var text = "";
                response.json().then(function (props) {
                    var _loop_3 = function (pName) {
                        var innerValue = props["d"][pName];
                        if (innerValue == undefined && props["d"]["UserProfileProperties"]) {
                            var resArray = props["d"]["UserProfileProperties"].results;
                            var valueO = resArray.find(function (e) { return e.Key == pName; });
                            if (valueO)
                                innerValue = valueO.Value;
                        }
                        text = text + innerValue ? innerValue : "" + " ";
                    };
                    for (var _i = 0, propertyNames_1 = propertyNames; _i < propertyNames_1.length; _i++) {
                        var pName = propertyNames_1[_i];
                        _loop_3(pName);
                    }
                    if (text && text.length > 0) {
                        text = text.trim();
                        resolve({
                            key: user.LoginName,
                            text: text
                        });
                    }
                    else {
                        resolve(undefined);
                    }
                });
            });
        });
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
    SPUserProfileProviderService.prototype.retrieveSingleData = function (configKey, senderControl, receiverControl, lang) {
        var _this = this;
        var configParts = configKey.split(".");
        if (configParts.length == 0)
            throw "At least the Provider and the name of the property has to be defined e.g. SPUserProfileProvider.AccountName to get the account name of the current User";
        return new Promise(function (resolve, reject) {
            var webUrl = _this.spHelper.getCorrectWebUrl("");
            (new gd_sprest_1.Web(webUrl, _this.targetInfo))
                .CurrentUser()
                .query({
                Select: ["*"]
            })
                .execute(function (user) {
                var propertyName = configParts[0];
                var value = user[propertyName];
                if (!value) {
                    var peopleManager = new gd_sprest_1.PeopleManager(_this.targetInfo);
                    peopleManager.getMyProperties()
                        .execute(function (profile) {
                        _this.getPropertyForOthers(propertyName, configParts, profile).then(function (value) {
                            resolve(value);
                        });
                    });
                }
                else {
                    resolve(value);
                }
            });
        });
    };
    return SPUserProfileProviderService;
}());
exports.SPUserProfileProviderService = SPUserProfileProviderService;
//# sourceMappingURL=SPUserProfileProviderService.js.map