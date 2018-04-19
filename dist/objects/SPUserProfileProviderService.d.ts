import { Control, IDataProviderService } from 'formgen-react';
import { JSPFormData } from './JSPFormData';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
/**
* The Provider Service to access the User Profile from SharePoint
*/
export declare class SPUserProfileProviderService implements IDataProviderService {
    private targetInfo;
    private spHelper;
    providerServiceKey: string;
    /**
     * Takes the target Info as parmeter.
     */
    constructor(serverRelativeUrl: string, targetInfo: ITargetInfo);
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
    retrieveFilteredListData(configKey: string, controlConfig: Control, lang: string, filter: string, limitResults?: number): Promise<any[]>;
    /**
     * Add a photo to the current users UserProfile
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be stored.
     * @param fileContent The Content of the file.
     * @returns The full path where the file was stored.
     */
    addFile(configKey: string, controlConfig: Control, fileName: string, fileContent: any): string;
    /**
     * Remove a foto from the current UserProfile
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be removed.
     */
    removeFile(configKey: string, controlConfig: Control, fileName: string): any;
    /**
     * Manual Call the Rest API Method (buggy gd-sprest)
     * @param account Account Name
     */
    private getPropertiesFor(account);
    /**
     * Retrieve the properties form the managers or the reports from the given profile.
     * @param propertyName PropertyName for the parent proeprty
     * @param configParts The parts from the configkey
     * @param profile The Person Properties (Profile)
     * @param manager The People Manager
     */
    private getPropertyForOthers(propertyName, configParts, profile);
    /**
     * Retrieve data from the sharepoint
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    retrieveListData(configKey: string, controlConfig: Control, lang: string): Promise<any[]>;
    /**
     * Fill the list with the concatinated user properties defined at the 0 element from the configParts (has to delimited with ,)
     * @param configParts The parts from the configkey
     * @param user The User Data
     * @param list The List to fill
     */
    private fillValueFromUser(configParts, user);
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
    retrieveSingleData(configKey: string, senderControl: Control, receiverControl: Control, lang: string): Promise<any>;
}
