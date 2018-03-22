import { IDropdownOption } from 'office-ui-fabric-react';
import { injectable, inject } from 'inversify';
import { Control, ControlTypes, IDataProviderService } from 'formgen-react';
import { JSPFormData } from './JSPFormData';
import { $REST } from 'gd-sprest';
import { SPHelper } from '../SPHelper';
import { IListItemResult, IListItemQueryResult } from 'gd-sprest/build/mapper/types';
import { ListConfig } from './ListConfig';
import { SPConfig } from './SPConfig';
import { Helper } from 'formgen-react/dist/Helper';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
  
/**
 * The Types to use for injection
 */
export const typesForInjectSP = { targetInfo: "targetInfo" };

@injectable()
export class SPDataProviderService implements IDataProviderService {
    private targetInfo: ITargetInfo;
    private spHelper: SPHelper;

    /**
     * Takes the target Info as parmeter.s
     */
    public constructor(@inject(typesForInjectSP.targetInfo) targetInfo: ITargetInfo) {
        this.targetInfo = targetInfo;
        this.spHelper = new SPHelper(targetInfo)
    }

    /**
     * The SharePoint Form Data
     */
    formData?: JSPFormData;
    
    /** 
     * Retrieve data from the store 
     * @param configKey Config Key from the control. This will use the by the provider to finde the correct configuration for this request
     * @param formData The Current complete Form Model. Here the config should be found.
     * @param controlConfig The control that calls the request.
     * @param lang The current language to use.
     */
    public retrieveListData(configKey:string, controlConfig: Control, lang:string):Promise<any[]> {
        let config = this.formData.SPConfig.ListConfigs.find(c => c.Key ==configKey);
        if (!config)
            throw "No List Configuration found for key " + configKey;
        return new Promise<any[]>((resolve, reject)  => {
            let spConfig:SPConfig = Helper.getTranslatedObject(config.ListConfig, config.ConfigTranslation);
            let webUrl = spConfig.BaseUrl ? spConfig.BaseUrl : "" + 
                config.ListConfig.WebUrl ? config.ListConfig.WebUrl : "";
            webUrl = this.spHelper.getCorrectWebUrl(webUrl);
            let listView = this.spHelper.getListViewXml(this.formData, config.ListConfig);

            $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(config.ListConfig.ListName)
            .getItems(listView).execute(items => {
                switch (controlConfig.RenderType){
                    case ControlTypes.DropDown:
                    case ControlTypes.ComboBox:
                    case ControlTypes.ChoiceGroup:
                        let dropDonwEntries:IDropdownOption[] = [];
                        for(let item of items.results) {
                            dropDonwEntries.push({
                                key: item[config.ListConfig.KeyField],
                                text: this.spHelper.getDisplayTextFromConfig(item, config.ListConfig)
                            })
                        }
                        resolve(dropDonwEntries);
                        break;
                    default:
                        let cascadData:any[] = [];
                        for(let item of items.results) {
                            cascadData.push(this.getCascaderItems(webUrl, item, config.ListConfig));
                        }
                        resolve(cascadData);
                        break;
                }
            });
        });
    }

    /** 
     * Get the Cacading Item with all the Childs and subchilds 
     * @param webUrl  Root Web Url for the Lists.
     * @param item List item to use for the data.
     * @param listConfig The List configuration for this level.
     */
    private getCascaderItems(webUrl: string, item: IListItemResult | IListItemQueryResult, listConfig: ListConfig): any {
        let key:string = item[listConfig.KeyField];
        let cItem = {
            value: key.toString(),
            label: this.spHelper.getDisplayTextFromConfig(item as IListItemResult, listConfig),
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
                        let cItem1 = this.getCascaderItems(webUrl, item1, config);
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