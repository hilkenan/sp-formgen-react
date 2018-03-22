import { Control, IDataProviderService } from 'formgen-react';
import { JSPFormData } from './JSPFormData';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
/**
 * The Types to use for injection
 */
export declare const typesForInjectSP: {
    targetInfo: string;
};
/**
* The Provider Service to access SharePoint Lists
*/
export declare class SPDataProviderService implements IDataProviderService {
    private targetInfo;
    private spHelper;
    /**
     * Takes the target Info as parmeter.s
     */
    constructor(targetInfo: ITargetInfo);
    /**
     * The SharePoint Form Data
     */
    formData?: JSPFormData;
    /**
     * Retrieve data from the sharepoint
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    retrieveListData(configKey: string, controlConfig: Control, lang: string): Promise<any[]>;
    /**
     * Get the Cacading Item with all the Childs and subchilds
     * @param webUrl  Root Web Url for the Lists.
     * @param item List item to use for the data.
     * @param listConfig The List configuration for this level.
     */
    private getCascaderItems(webUrl, item, listConfig);
}
