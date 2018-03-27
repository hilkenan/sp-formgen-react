import { Control, IDataProviderService } from 'formgen-react';
import { JSPFormData } from './JSPFormData';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { Web, PeopleManager } from 'gd-sprest';

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

    // /**
    //  * Retrieve list data from the store filtered and optional limited with count of result items
    //  * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
    //  * @param controlConfig The control that calls the request.
    //  * @param lang The current language to use.
    //  * @param filter The filterstring to use
    //  * @param limitResults Count of items to return at max.
    //  */
    // retrieveFilteredListData(configKey: string, controlConfig: Control, lang: string, filter: string, limitResults?: number): Promise<any[]> {
    //     let configParts = configKey.split(".");
    //     return new Promise<any[]>((resolve, reject)  => {
    //     });
    // }

    // /** 
    //  * Retrieve data from the sharepoint 
    //  * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
    //  * @param formData The Current complete Form Model. Here the config should be found.
    //  * @param controlConfig The control that calls the request.
    //  * @param lang The current language to use.
    //  */
    // public retrieveListData(configKey:string, controlConfig: Control, lang:string):Promise<any[]> {
    //     return this.retrieveFilteredListData(configKey, controlConfig, lang, undefined, undefined);
    // }

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
                    .execute((properties) => {
                        value = properties[propertyName];
                        if (configParts.length > 1) {
                            let accounts = undefined;
                            if (configParts[1] == "reports")
                                accounts = properties.ExtendedReports;
                            else if (configParts[1] == "managers")
                                accounts = properties.ExtendedManagers;
                            if (accounts) {
                                if (configParts.length == 3) {
                                    propertyName = configParts[2];
                                    peopleManager.getPropertiesFor(accounts)
                                    .execute((subProperties) => {
                                        value = subProperties[propertyName];
                                        resolve(value);
                                    });
                                }
                                else
                                    resolve(accounts);
                            }
                        }
                        else
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