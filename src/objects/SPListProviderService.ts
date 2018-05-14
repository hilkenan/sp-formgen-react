import { IDropdownOption } from 'office-ui-fabric-react';
import { Control, ControlTypes, IDataProviderService } from 'formgen-react';
import { $REST } from 'gd-sprest';
import { IListItemResult, IListItemQueryResult, IListItemResults } from 'gd-sprest/build/mapper/types';
import { ListConfig } from './ListConfig';
import { SPConfig } from './SPConfig';
import { Helper } from 'formgen-react/dist/Helper';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { List } from '..';
import { IFileObject } from 'formgen-react/dist/inputs/fileUpload/FormFileUpload';
import { SPProviderServiceBase } from './SPProviderServiceBase';

/**
* The Provider Service to access SharePoint Lists
*/  
export class SPListProviderService extends SPProviderServiceBase implements IDataProviderService {
    public providerServiceKey = "SPListProvider"

    /**
     * Takes the target Info as parmeter.
     */
    public constructor(serverRelativeUrl: string, targetInfo: ITargetInfo) {
        super(serverRelativeUrl, targetInfo)
    }

    /**
     *Get from the config key the List Config
     * @param configKey The Config Key to get Infos from.
     */
    private getConfigFromKey(configKey: string) : List {
        if (!configKey)
            throw "No List Configuration defined";

        let configParts = configKey.split(".");
        let config = this.spConfig.ListConfigs.find(c => c.Key == configParts[0]);
        if (!config)
            throw "No List Configuration found for key " + configParts[0];
        return config;
    }


   /**
     * Add a file to the lib
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be stored.
     * @param fileContent The Content of the file.
     * @returns The full path where the file was stored.
     */
    addFile(configKey: string, controlConfig: Control, fileName: string, fileContent: any): string {
        let config = this.getConfigFromKey(configKey);
        let spConfig:SPConfig = Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
        let webUrl = this.spHelper.getWebUrl(config, spConfig);

        let rootFolder = $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .RootFolder()
            .executeAndWait();

        let folderUrl = rootFolder.ServerRelativeUrl + "/" + this.formData.ID + "_" + controlConfig.ID;
        $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .RootFolder()
            .Folders()
            .add(folderUrl)
            .executeAndWait();
        
        let result = $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .RootFolder()
            .Folders()
            .getbyurl(folderUrl)
            .Files()
            .add(true, fileName, fileContent)
            .executeAndWait();
        return result.ServerRelativeUrl;
    }

    /**
     * Remove a file from the lib
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param controlConfig The control that calls the request.
     * @param fileName The FileName to be removed.
     */
    removeFile(configKey: string, controlConfig: Control, fileName: string): any {
        let config = this.getConfigFromKey(configKey);
        let spConfig:SPConfig = Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
        let webUrl = this.spHelper.getWebUrl(config, spConfig);

        let files = controlConfig.Value as IFileObject[];
        if (files) {
            let file = files.find(f => f.fileName == fileName);
            if (file)
                $REST.Web(webUrl, this.targetInfo)
                .getFileByServerRelativeUrl(file.storedPath)
                .delete()
                .executeAndWait();
            if (files.length == 1) {
                let rootFolder = $REST.Web(webUrl, this.targetInfo)
                    .Lists()
                    .getByTitle(config.ListConfig.ListName)
                    .RootFolder()
                    .executeAndWait();
                let folderUrl = rootFolder.ServerRelativeUrl + "/" + this.formData.ID + "_" + controlConfig.ID;
                $REST.Web(webUrl, this.targetInfo)
                    .Lists()
                    .getByTitle(config.ListConfig.ListName)
                    .RootFolder()
                    .Folders()
                    .getbyurl(folderUrl)
                    .delete()
                    .executeAndWait();
            }
        }
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
        let configParts = configKey.split(".");
        let config = this.getConfigFromKey(configKey);
        return new Promise<any[]>((resolve, reject)  => {
            let spConfig:SPConfig = Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
            let webUrl = this.spHelper.getWebUrl(config, spConfig);
            let listView = this.spHelper.getListViewXml(this.formData, config.ListConfig);
            
            if (filter) {
                if (configParts.length < 2)
                    throw "When a filter is defined, then also a field name must be specified";
                let fieldName = configParts[1];
                let operator = " eq ";
                if (configParts.length == 3)
                    operator = " " + configParts[2] + " ";
                if (isNaN(parseFloat(filter)))
                    filter = " '" + filter + "'";

                $REST.Web(webUrl, this.targetInfo)
                .Lists()
                .getByTitle(config.ListConfig.ListName)
                .query({
                    Top: limitResults,
                    Filter: fieldName + operator + filter,
                    GetAllItems: true
                }).execute(items => {
                    resolve(this.confertListData(controlConfig, items.Items, config, webUrl, lang))
                });
            }
            else {
                $REST.Web(webUrl, this.targetInfo)
                .Lists()
                .getByTitle(config.ListConfig.ListName)
                .getItems(listView).execute(items => {
                    resolve(this.confertListData(controlConfig, items, config, webUrl, lang))
                });
            }
        });
    }

    /**
     * Retrieve list data from the store filtered and optional limited with count of result items
     * @param controlConfig The control that calls the request.
     * @param items The Result from the search.
     * @param config The configuration for a list.
     * @param webUrl The url where the list is.
     */
    private confertListData(controlConfig: Control, items:IListItemResults, config:List, webUrl: string, lang: string): any[] {
        switch (controlConfig.RenderType){
            case ControlTypes.DropDown:
            case ControlTypes.ComboBox:
            case ControlTypes.ChoiceGroup:
                let dropDonwEntries:IDropdownOption[] = [];
                for(let item of items.results) {
                    dropDonwEntries.push({
                        key: item[config.ListConfig.KeyField],
                        text: this.spHelper.getDisplayTextFromConfig(item, config.ListConfig, lang)
                    })
                }
                return dropDonwEntries;
            default:
                let cascadData:any[] = [];
                for(let item of items.results) {
                    cascadData.push(this.getCascaderItems(webUrl, item, config.ListConfig, lang));
                }
                return cascadData;
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
        return this.retrieveFilteredListData(configKey, controlConfig, lang, undefined, undefined);
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
        if (configParts.length < 3)
            throw "At least the providerkey, the list config, the filter fieldname and the filtervalue has to be defined e.g. SPListProvider.MyList.Title.test (would filter from the myList the Title with the value 'test'";
      
        let config = this.getConfigFromKey(configKey);
        return new Promise<any>((resolve, reject)  => {
            let spConfig:SPConfig = Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
            let webUrl = this.spHelper.getWebUrl(config, spConfig);

            let fieldName = configParts[1];
            let filter = configParts[2];
            if (isNaN(parseFloat(filter)))
                filter = " '" + filter + "'";

            let displayFieldName = undefined
            if (configParts.length > 3)
                displayFieldName = configParts[3];

            $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .query({
                Top: 1,
                Filter: fieldName + " eq " + filter,
                GetAllItems: true
            }).execute(items => {
                if (items && items.Items && items.Items.results && items.Items.results.length > 0) {
                    let text = this.spHelper.getDisplayTextFromConfig(items.Items.results[0], config.ListConfig, lang, displayFieldName);
                    resolve(text);                    
                }
                else
                    resolve(undefined);
            });
        });
    }
    
    /** 
     * Get the Cacading Item with all the Childs and subchilds 
     * @param webUrl  Root Web Url for the Lists.
     * @param item List item to use for the data.
     * @param listConfig The List configuration for this level.
     * @param lang The current language to use.
     */
    private getCascaderItems(webUrl: string, item: IListItemResult | IListItemQueryResult, listConfig: ListConfig, lang: string): any {
        let key:string = item[listConfig.KeyField];
        let cItem = {
            value: key.toString(),
            label: this.spHelper.getDisplayTextFromConfig(item as IListItemResult, listConfig, lang),
            disabled: item[listConfig.DisabledField] ? 
                 item[listConfig.DisabledField] as boolean : undefined 
        }
        if (listConfig.ChildLists) {
            let citems:any[] = [];
            for (let childConfig of listConfig.ChildLists) {
                let config:ListConfig = Helper.getTranslatedObject(childConfig.Config, childConfig.ConfigTranslation);
                
                let items = $REST.Web(webUrl, this.targetInfo)
                .Lists()
                .getByTitle(config.ListName)
                .Items()
                .query({ 
                    Top: 1000, 
                    Filter: childConfig.ParentField + " eq " + key,
                    OrderBy: [config.DisplayFields[0].InternalName],
                    Select: ["*"]
                })
                .executeAndWait();
                if (items.results) {
                    for(let item1 of items.results) {
                        let cItem1 = this.getCascaderItems(webUrl, item1, config, lang);
                        citems.push(cItem1);
                    }
                }
            }
            if (citems.length > 0)
                cItem["children"] = citems;
        }
        return cItem;
    }
}