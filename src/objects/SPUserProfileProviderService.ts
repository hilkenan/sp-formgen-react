import { Control, IDataProviderService } from 'formgen-react';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { Web, PeopleManager, $REST } from 'gd-sprest';
import { IPersonProperties, IUserResult, IUserQueryResult, IPeopleManager, IResults } from 'gd-sprest/build/mapper/types';
import { IDropdownOption } from 'office-ui-fabric-react';
import { Helper } from 'formgen-react/dist/Helper';
import { KeyValue, SearchResult } from 'gd-sprest/build/mapper/types/complexTypes';
import { SPProviderServiceBase } from './SPProviderServiceBase';

/**
* The Provider Service to access the User Profile from SharePoint
*/  
export class SPUserProfileProviderService extends SPProviderServiceBase implements IDataProviderService {
    public providerServiceKey = "SPUserProfileProvider"

    /**
     * Takes the target Info as parmeter.
     */
    public constructor(serverRelativeUrl:string, targetInfo: ITargetInfo) {
        super(serverRelativeUrl, targetInfo)
    }

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
            let webUrl = this.spHelper.getCorrectWebUrl("");
            
            let operator = "eq";
            if (configParts.length == 3)
                operator = configParts[2];
            let filterStar = filter + "*";

            if (isNaN(parseFloat(filter))) {
                filterStar = "\"" + filter + "*\"";
                filter = "\"" + filter + "\"";
            }

            let kqlFilter = ""
            switch(operator) {
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

            $REST.Search(webUrl, this.targetInfo)
            .postquery({
                SourceId:"B09A7990-05EA-4AF9-81EF-EDFAB16C4E31",
                Querytext:kqlFilter,
                TrimDuplicates:true,
                RowLimit:limitResults
            })
            .execute((result) => {
                let queryResult = result["postquery"] as SearchResult;
                let rowsObject = queryResult.PrimaryQueryResult.RelevantResults.Table.Rows["results"] as Array<Object>
                let promises:Promise<IPersonProperties>[] = [];
                for(let row of rowsObject) {
                    let cells = row["Cells"]["results"] as KeyValue[];
                    let accountNameCell = cells.find(c => c.Key == "AccountName");
                    promises.push(this.getPropertiesFor(accountNameCell.Value));
                }
                let dropDonwEntries: IDropdownOption[] = [];
                Promise.all(promises).then((persProperties) => {
                    let subPropertyName = configParts[1];
                    for(let props of persProperties) {
                        let innerValue = props[subPropertyName];
                        if (innerValue == undefined && props.UserProfileProperties) {
                            let valueO = props.UserProfileProperties.results.find( p => p.Key == subPropertyName)
                            if (valueO)
                                innerValue = valueO.Value;
                        }
                        if (innerValue) {
                            dropDonwEntries.push({
                                key: props.AccountName,
                                text: innerValue });
                        }
                    }
                    resolve(dropDonwEntries);    
                });
            });
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
        let webUrl = this.spHelper.getCorrectWebUrl("");
        let peopleManager = new PeopleManager(this.targetInfo);
        peopleManager.setMyProfilePicture(fileContent)
        .executeAndWait();
        let user = (new Web(webUrl, this.targetInfo))
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
    private getPropertiesFor(account:string) : Promise<IPersonProperties> {
        return new Promise<IPersonProperties>((resolve)  => {
            let manager: IPeopleManager = new PeopleManager(this.targetInfo);
            return manager.getPropertiesFor(account).execute((props) => {
                resolve(props)
            });
        });
    }

    /** 
     * Retrieve the properties form the managers or the reports from the given profile.
     * @param propertyName PropertyName for the parent proeprty
     * @param configParts The parts from the configkey
     * @param profile The Person Properties (Profile)
     * @param manager The People Manager
     */
    private getPropertyForOthers(propertyName:string, configParts:string[], profile:IPersonProperties): Promise<string> {
        return new Promise<string>((resolve)  => {
            let value = profile[propertyName];
            if (configParts.length > 1) {
                let innerObject:IResults<string> = undefined;
                if (configParts[0] == "reports")
                    innerObject = profile.ExtendedReports;
                else if (configParts[0] == "managers") {
                    innerObject = profile.ExtendedManagers;
                }
                if (innerObject) {
                    let accounts:string[] = innerObject.results;
                    if (configParts.length == 2) {
                        let promises:Promise<IPersonProperties>[] = [];
                        let subPropertyName = configParts[1];
                        
                        for(let account of accounts) {
                            if (account != profile.AccountName) {
                                promises.push(this.getPropertiesFor(account))
                            }
                        }
                        Promise.all(promises).then((properties) => {
                            let values:string[] = [];
                            for(let account of accounts) {
                                if (account != profile.AccountName) {
                                    let props = properties.find(p => p.AccountName == account);
                                    if (props) {
                                        let innerValue = props[subPropertyName];
                                        if (innerValue == undefined && props.UserProfileProperties) {
                                            let valueO = props.UserProfileProperties.results.find( p => p.Key == subPropertyName)
                                            if (valueO) {
                                                innerValue = valueO.Value;
                                            }
                                            if (innerValue) {
                                                values.push(innerValue);
                                            }
                                        }
                                    }
                                }
                            }
                            resolve(values.join(","));
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
            let webUrl = this.spHelper.getCorrectWebUrl("");
            if (configParts.length == 2) {
                let groupName = configParts[1];

                (new Web(webUrl, this.targetInfo))
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
                        let promises:Promise<IDropdownOption>[] = [];
                        for (let user of group.Users.results) {
                            promises.push(this.fillValueFromUser(configParts, user));
                        }
                        Promise.all(promises).then((values) => {
                            for(let val of values) {
                                if (val && list.find(l => l.key == val.key) == undefined ) {
                                    list.push(val);
                                }
                            }
                            resolve (list);                        
                        })
                        return;
                    }
                    else
                        resolve(undefined);
                });
            }
            else {
                (new Web(webUrl, this.targetInfo))
                .SiteUsers()
                .query({
                    Top: 9999,
                    GetAllItems: true
                })
                .execute((users) => {
                    let list:IDropdownOption[] = [];
                    if (users && users.results && users.results.length > 0) {
                        let promises:Promise<IDropdownOption>[] = [];
                        for (let user of users.results) {
                            promises.push(this.fillValueFromUser(configParts, user));
                        }
                        Promise.all(promises).then((values) => {
                            for(let val of values) {
                                if (val && list.find(l => l.key == val.key) == undefined ) {
                                    list.push(val);
                                }
                            }
                            resolve (list);                        
                        })
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
    private fillValueFromUser(configParts:string[], user:IUserResult | IUserQueryResult) : Promise<IDropdownOption> {
        return new Promise<IDropdownOption>((resolve, reject)  => {
            let propertyNames = configParts[0].split(",");
            this.getPropertiesFor(user.LoginName).then((persProps) => {
                let text:string = "";
                for(let pName of propertyNames) {
                    let innerValue:string = persProps[pName];
                    if (innerValue == undefined && persProps.UserProfileProperties) {
                        let valueO = persProps.UserProfileProperties[pName];
                        if (valueO) {
                            innerValue = valueO.Value;
                        }
                    }
                    text = text + innerValue ? innerValue : "" + " "
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
            })
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
            let webUrl = this.spHelper.getCorrectWebUrl("");
            (new Web(webUrl, this.targetInfo))
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