import { Control, IDataProviderService, JFormData } from 'formgen-react';
import { SPConfig } from './SPConfig';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { SPHelper } from '..';
/**
* The Provider Service to access SharePoint Lists
*/
export declare class SPListProviderService implements IDataProviderService {
    providerServiceKey: string;
    protected targetInfo: ITargetInfo;
    protected spHelper: SPHelper;
    protected spConfig: SPConfig;
    protected serverRelativeUrl: string;
    /**
     * The SharePoint Form Data
     */
    formData?: JFormData;
    initialize(): void;
    /**
     * Takes the target Info as parmeter.
     */
    constructor(serverRelativeUrl: string, targetInfo: ITargetInfo);
    /**
     *Get from the config key the List Config
     * @param configKey The Config Key to get Infos from.
     */
    private getConfigFromKey(configKey);
    /**
      * Add a file to the lib
      * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
      * @param controlConfig The control that calls the request.
      * @param fileName The FileName to be stored.
      * @param fileContent The Content of the file.
      * @returns The full path where the file was stored.
      */
    addFile(configKey: string, controlConfig: Control, fileName: string, fileContent: any): string;
    /**
     * Remove a file from the lib
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be removed.
     */
    removeFile(configKey: string, controlConfig: Control, fileName: string): any;
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
     * Retrieve list data from the store filtered and optional limited with count of result items
     * @param controlConfig The control that calls the request.
     * @param items The Result from the search.
     * @param config The configuration for a list.
     * @param webUrl The url where the list is.
     */
    private confertListData(controlConfig, items, config, webUrl, lang);
    /**
     * Retrieve data from the sharepoint
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    retrieveListData(configKey: string, controlConfig: Control, lang: string): Promise<any[]>;
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
    /**
     * Get the Cacading Item with all the Childs and subchilds
     * @param webUrl  Root Web Url for the Lists.
     * @param item List item to use for the data.
     * @param listConfig The List configuration for this level.
     * @param lang The current language to use.
     */
    private getCascaderItems(webUrl, item, listConfig, lang);
}
