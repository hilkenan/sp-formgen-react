import { Control, IDataProviderService } from 'formgen-react';
import { JSPFormData } from './JSPFormData';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { Web, PeopleManager, $REST } from 'gd-sprest';
import { IPersonProperties, IUserResult, IUserQueryResult } from 'gd-sprest/build/mapper/types';
import { IDropdownOption } from 'office-ui-fabric-react';
import { Helper } from 'formgen-react/dist/Helper';
import { KeyValue } from 'gd-sprest/build/mapper/types/complexTypes';

/**
* The Provider Service to access the User Profile from SharePoint
*/  
export class SPUserProfileProviderService implements IDataProviderService {
    private targetInfo: ITargetInfo;

    public providerServiceKey = "SPUserProfileProvider"

    /**
     * Takes the target Info as parmeter.
     */
    public constructor(targetInfo: ITargetInfo) {
        this.targetInfo = targetInfo;
    }

    /**
     * The SharePoint Form Data
     */
    formData?: JSPFormData;

    /**
     * Retrieve list data from the store filtered and optional limited with count of result items
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     * @param filter The filterstring to use
     * @param limitResults Count of items to return at max.
     */
    retrieveFilteredListData(configKey: string, controlConfig: Control, lang: string, filter: string, limitResults?: number): Promise<any[]> {
        let providerConfigKey = Helper.getConfigKeyFromProviderKey(configKey);
        let configParts = providerConfigKey.split(".");
        
        if (configParts.length < 2 )
            throw "At least the Provider, the name of the property(properties) to receive, and the filter Prpoerty has to be defined e.g. SPUserProfileProvider.AccountName to get the account name of the filtered User"
        return new Promise<any[]>((resolve, reject)  => {
            let operator = "eq";
            if (configParts.length == 3)
                operator = " " + configParts[2] + " ";
            if (isNaN(parseFloat(filter))) {
                filter = " '" + filter + "'";
            }
            let fullFilter = ""
            switch(operator) {
                case "substringof":
                    fullFilter = "substringof(" + filter + "," + configParts[0] + ")";
                    break;
                case "startswith":
                    fullFilter = "startswith(" + configParts[0] + "," + filter + ")";
                    break;
                default:
                    fullFilter = configParts[0] + " " + operator + " " + filter;                
                    break;
            }

            $REST.Web("", this.targetInfo)
            .SiteUsers()
            .query({
                Filter: fullFilter,
                Select: ["*"]
            })
            .execute((users) => {
                let propertyName = configParts[1];
                let dropDonwEntries:IDropdownOption[] = [];
                if (users && users.results && users.results.length > 0) {
                    let promises:Promise<any>[] = [];
                    for (let user of users.results) {
                        let value = user[propertyName];
                        if (value == undefined) {
                            promises.push(this.getPropertiesFor(user.LoginName));
                        }
                        else {
                            if (value != "") {
                                dropDonwEntries.push({
                                    key: user.LoginName,
                                    text: value });
                            }
                        }
                    }
                    if (dropDonwEntries.length > 0) {
                        resolve(dropDonwEntries);
                        return;                        
                    }
                    else {
                        let promises2:Promise<any>[] = [];                        
                        Promise.all(promises).then((innerProm) => {
                            for(let p of innerProm) {
                                promises2.push(p.json())
                            }
                            Promise.all(promises2).then((allValues) => {
                                let subPropertyName = configParts[1];
                                let dropDonwEntries2:IDropdownOption[] = [];
                                
                                for(let json of allValues) {
                                    let innerValue = json["d"][subPropertyName];
                                    if (innerValue == undefined && json["d"]["UserProfileProperties"]) {
                                        let resArray = json["d"]["UserProfileProperties"].results as Array<KeyValue>
                                        let valueO = resArray.find(e => e.Key == subPropertyName);
                                        if (valueO)
                                            innerValue = valueO.Value;
                                    }
                                    if (innerValue) {
                                        dropDonwEntries2.push({
                                            key: json["d"]["AccountName"],
                                            text: innerValue });
                                    }
                                }
                                resolve(dropDonwEntries2);    
                            });
                        });
                        return;
                    }
                }
                resolve(dropDonwEntries);                
            })
        });
    }

    /**
     * Add a photo to the current users UserProfile
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be stored.
     * @param fileContent The Content of the file.
     * @returns The full path where the file was stored.
     */
    addFile(configKey: string, controlConfig: Control, fileName: string, fileContent: any): string {
        let peopleManager = new PeopleManager(this.targetInfo);
        peopleManager.setMyProfilePicture(fileContent)
        .executeAndWait();
        let user = (new Web(undefined, this.targetInfo))
            .CurrentUser()
            .executeAndWait();
        
        let property = peopleManager.getUserProfilePropertyFor(user.LoginName, "PictureUrl")
            .executeAndWait();
        return property.PictureUrl;
    }

    /**
     * Remove a foto from the current UserProfile
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be removed.
     */
    removeFile(configKey: string, controlConfig: Control, fileName: string): any {
        let peopleManager = new PeopleManager(this.targetInfo);
        peopleManager.setMyProfilePicture(undefined)
        .executeAndWait();
    }
    
    /** 
     * Manual Call the Rest API Method (buggy gd-sprest)
     * @param account Account Name
     */
    private getPropertiesFor(account:string) : Promise<Response> {
        account = encodeURIComponent(account);
        let apiUrl = this.targetInfo.url + "/_api/sp.userprofiles.peoplemanager/getPropertiesFor(accountName=@v)?@v='" + account + "'";
        return fetch(apiUrl);
    }

    /** 
     * Retrieve the properties form the managers or the reports from the given profile.
     * @param propertyName PropertyName for the parent proeprty
     * @param configParts The parts from the configkey
     * @param profile The Person Properties (Profile)
     * @param manager The People Manager
     */
    private getPropertyForOthers(propertyName:string, configParts:string[], profile:IPersonProperties): Promise<any> {
        return new Promise<any>((resolve)  => {
            let value = profile[propertyName];
            if (configParts.length > 1) {
                let innerObject = undefined;
                if (configParts[0] == "reports")
                    innerObject = profile.ExtendedReports as Object;
                else if (configParts[0] == "managers") {
                    innerObject = profile.ExtendedManagers as Object;
                }
                if (innerObject) {
                    let result = innerObject["results"] as Array<string>;
                    let accounts:string[];
                    accounts = result;

                    if (configParts.length == 2) {
                        let promises:Promise<any>[] = [];
                        for(let account of accounts) {
                            if (account != profile.AccountName) {
                                promises.push(this.getPropertiesFor(account))
                            }
                        }
                        let promises2:Promise<any>[] = [];                        
                        Promise.all(promises).then((innerProm) => {
                            for(let p of innerProm) {
                                promises2.push(p.json())
                            }
                            Promise.all(promises2).then((allValues) => {
                                let values:any[] = [];
                                let subPropertyName = configParts[1];
                                for(let json of allValues) {
                                    let innerValue = json["d"][subPropertyName];
                                    if (innerValue == undefined && json["d"]["UserProfileProperties"]) {
                                        let resArray = json["d"]["UserProfileProperties"].results as Array<KeyValue>
                                        let valueO = resArray.find(e => e.Key == subPropertyName);
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
    }

    /** 
     * Retrieve data from the sharepoint 
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    public retrieveListData(configKey:string, controlConfig: Control, lang:string):Promise<any[]> {
        let configParts = configKey.split(".");
        if (configParts.length == 0)
            throw "At least the Provider and the name of the property has to be defined e.g. SPUserProfileProvider.AccountName to get all site users account name"
        return new Promise<any[]>((resolve, reject)  => {
            if (configParts.length == 2) {
                let groupName = configParts[1];
                (new Web(undefined, this.targetInfo))
                .SiteGroups()
                .getByName(groupName)
                .query({
                    Top: 9999,
                    GetAllItems: true,
                    Expand: ["Users"]
                })
                .execute((group) => {
                    let list:IDropdownOption[] = [];
                    if (group && group.Users && group.Users.results && group.Users.results.length > 0) {
                        for (let user of group.Users.results) {
                            this.fillValueFromUser(configParts, user, list);
                        }
                        resolve (list);                        
                    }
                    else
                        resolve(undefined);
                });
            }
            else {
                (new Web(undefined, this.targetInfo))
                .SiteUsers()
                .query({
                    Top: 9999,
                    GetAllItems: true,
                    Select: [configParts[0]]
                })
                .execute((users) => {
                    let list:IDropdownOption[] = [];
                    if (users && users.results && users.results.length > 0) {
                        for (let user of users.results) {
                            this.fillValueFromUser(configParts, user, list);
                        }
                        resolve (list);                        
                    }
                    else
                        resolve (undefined);
                })
            }
        });
    }

    /** 
     * Fill the list with the concatinated user properties defined at the 0 element from the configParts (has to delimited with ,)
     * @param configParts The parts from the configkey
     * @param user The User Data
     * @param list The List to fill
     */    
    private fillValueFromUser(configParts:string[], user:IUserResult | IUserQueryResult, list:IDropdownOption[]) {
        let propertyNames = configParts[0].split(",");
        let text:string = "";
        for(let pName of propertyNames) {
            text = text + user[pName] ? user[pName] : "" + ","
        }
        if (text.length > 0)
            text = text.substring(0, text.length -1 );
        list.push({
            key: user.Id,
            text: text
        })
    }

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
    retrieveSingleData(configKey: string, senderControl: Control, receiverControl: Control, lang: string): Promise<any> {
        let configParts = configKey.split(".");
        if (configParts.length == 0)
            throw "At least the Provider and the name of the property has to be defined e.g. SPUserProfileProvider.AccountName to get the account name of the current User"
        return new Promise<any>((resolve, reject)  => {
            (new Web(undefined, this.targetInfo))
            .CurrentUser()
            .query({
                Select: ["*"]
            })
            .execute((user) => {
                let propertyName = configParts[0];
                let value = user[propertyName];
                if (!value) {
                    let peopleManager = new PeopleManager(this.targetInfo);
                    peopleManager.getMyProperties()
                    .execute((profile) => {
                        this.getPropertyForOthers(propertyName, configParts, profile).then((value) => {
                            resolve(value);
                        });
                    });
                }
                else {
                    resolve(value);
                }    
            });
        });
    }    
}