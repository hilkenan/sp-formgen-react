import { Control, IDataProviderService } from 'formgen-react';
import { JSPFormData } from './JSPFormData';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { Web, PeopleManager } from 'gd-sprest';
import { IPersonProperties, IPeopleManager, IUserResult, IUserQueryResult } from 'gd-sprest/build/mapper/types';
import { IDropdownOption } from 'office-ui-fabric-react';

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
        let configParts = configKey.split(".");
        if (configParts.length < 2)
            throw "At least the Provider, the name of the property(properties) to receive, and the filter Prpoerty has to be defined e.g. SPUserProfileProvider.AccountName to get the account name of the filtered User"
        return new Promise<any[]>((resolve, reject)  => {
            let values: any[] = [];
            let operator = " eq ";
            if (configParts.length == 3)
                operator = " " + configParts[2] + " ";
            if (isNaN(parseFloat(filter)))
                filter = " '" + filter + "'";
        
            (new Web(undefined, this.targetInfo))
            .SiteUsers()
            .query({
                Filter: configParts[1] + operator + filter,
                Select: ["*"]
            })
            .execute((users) => {
                let propertyName = configParts[0];
                if (users && users.results && users.results.length > 0) {
                    for (let user of users.results) {
                        let value = user[propertyName];
                        if (!value) {
                            let peopleManager = new PeopleManager();
                            peopleManager.getUserProfilePropertyFor(filter, propertyName)
                            .execute((profile) => {
                                let value = this.getPropertyForOthers(propertyName, configParts, profile, peopleManager);
                                values.push(value);
                            });
                        }
                    }
                }
                resolve(values);
            })
        });
    }

    /** 
     * Retrieve the properties form the managers or the reports from the given profile.
     * @param propertyName PropertyName for the parent proeprty
     * @param configParts The parts from the configkey
     * @param profile The Person Properties (Profile)
     * @param manager The People Manager
     */
    private getPropertyForOthers(propertyName:string, configParts:string[], profile:IPersonProperties, manager:IPeopleManager): any {
        let value = profile[propertyName];
        if (configParts.length > 1) {
            let accounts = undefined;
            if (configParts[1] == "reports")
                accounts = profile.ExtendedReports;
            else if (configParts[1] == "managers")
                accounts = profile.ExtendedManagers;
            if (accounts) {
                if (configParts.length == 3) {
                    let propertyName = configParts[2];
                    let subProperties = manager.getUserProfilePropertyFor(accounts, propertyName)
                    .executeAndWait();
                    value = subProperties[propertyName];
                    return value;
                }
                else
                    return accounts;
            }
        else
            return value;
        }
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
                    let peopleManager = new PeopleManager();
                    peopleManager.getMyProperties()
                    .execute((profile) => {
                        let value = this.getPropertyForOthers(propertyName, configParts, profile, peopleManager);
                        resolve(value);
                    });
                }
                else {
                    resolve(value);
                }    
            });
        });
    }    
}