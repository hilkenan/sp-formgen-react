import { ViewItem } from "./objects/ViewItem";
import { $REST } from "gd-sprest";
import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";
import { List, SPConfig } from ".";

/**
 * Helper class to acces sharepoint.
 */
export class SPHelper {
    private targetInfo: ITargetInfo;
    private serverRelativeUrl: string;
    private camlQueries:ViewItem[];
    
    /**
     * Takes the target Info
     * @param serverRelativeUrl The server url from the request.
     * @param targetInfo Target to use (local or current context)
     */
    public constructor(serverRelativeUrl: string, targetInfo: ITargetInfo) {
        this.targetInfo = targetInfo;
        this.serverRelativeUrl = serverRelativeUrl;
    }

    /**
     * Get the correct List View XML for the configured list settings.
     * @param formData the Current Form Data object
     * @param config The Config for the List to get the view from.
     */                 
    public getListViewXml(formData:JSPFormData, config:ListConfig):string {
        let webUrl = formData.SPConfig.BaseUrl + config.WebUrl;
        webUrl = this.getCorrectWebUrl(webUrl);
        
        let listView;
        if (!config.ViewName) {
            listView = this.getCamlQueryFromDefaultView(webUrl, config.ListName);
        }
        else {
            listView = this.getCamlQueryFromView(webUrl, config.ViewName, config.ListName);                
        }        
        return listView;
    }

    /**
     * Depending on environment att the target url.
     * @param webUrl The Url relative to the base url
     */                 
    public getCorrectWebUrl(webUrl:string): string {
        if (this.targetInfo.url && (webUrl || webUrl == ""))
            return this.targetInfo.url + this.serverRelativeUrl + webUrl;
        else if (!this.targetInfo.url && !webUrl)
            return this.serverRelativeUrl;
        else
            return this.serverRelativeUrl + webUrl;
    }

    /**
     * Get the correct web url from the list.
     * @param config The config for the given list
     * @param controlConfig SharePoint part of the configuration (translated)
     */
    public getWebUrl(config: List, spConfig:SPConfig)  {
        let webUrl = spConfig.BaseUrl ? spConfig.BaseUrl : "" + 
        config.ListConfig.WebUrl ? config.ListConfig.WebUrl : "";
        return  this.getCorrectWebUrl(webUrl);
    }
    
    /**
     * Get the Defauld ListView cached from.
     * @param webUrl The Url relative to the base url
     * @param listName The Dipslay name of the list to use.
     */                 
    public getCamlQueryFromDefaultView(webUrl: string, listName:string): string {
        if (this.camlQueries == undefined)
            this.camlQueries = [];

        let key = listName + ":defaultView";
        let item = this.camlQueries.find(v => v.ViewName == key);
        if (item) return item.Query;
        
        let view = $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(listName)
            .DefaultView()
            .executeAndWait();
        this.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        })
        return this.camlQueries.find(v => v.ViewName == key).Query;
    }

    /**
     * Replace the all occurencies from search in the target with replacments
     * @param target the origin string
     * @param search the search string
     * @param replacement the replacment string
     */                 
    public static replaceAll(target:string, search:string, replacement: string) {
        return target.split(search).join(replacement);
    }

    /**
     * Collect the text for the display
     * @param item The ListItem Result to collect texts from.
     * @param config The Configuration for this list.
     * @param lang The language if use language specific fieldnames
     * @param configFieldName If defined then use this fieldName insted in the config devined ones
     */                 
    public getDisplayTextFromConfig(item:IListItemResult, config:ListConfig, lang: string, configFieldName?: string) {
        let texts:string[] = [];
        for(let fieldConfig of config.DisplayFields) {            
            let fieldNaame = fieldConfig.UseLanguageVariants ?
                fieldConfig.InternalName + "_" + lang : fieldConfig.InternalName;
            if (configFieldName)
                fieldNaame = fieldConfig.UseLanguageVariants ?
                configFieldName + "_" + lang : configFieldName;
            
            let fieldValue = item[fieldNaame];
            if (fieldConfig.DisplayFormat) {
                fieldValue = SPHelper.replaceAll(fieldConfig.DisplayFormat, "{fieldValue}",  fieldValue);
            }
            texts.push(fieldValue)
        }
        let text = ""
        if (config.DisplayFormat) {
            text = config.DisplayFormat;
            for(let i = 0;i < texts.length; i++) {
                text = SPHelper.replaceAll(text, "{texts[" + i + "]}",  texts[i]);
            }
        }
        else
            text = texts.join(',')
        return text;
    }
    
    /**
     * Get the ListView cached from the given view name.
     * @param webUrl The Url relative to the base url
     * @param viewName The view name to get the caml from.
     * @param listName The Name of the list.
     */                 
    public getCamlQueryFromView(webUrl: string, viewName:string, listName:string): string {
        if (this.camlQueries == undefined)
            this.camlQueries = [];

        let key = listName + ":" + viewName;
        let item = this.camlQueries.find(v => v.ViewName == key);
        if (item) return item.Query;
        
        let view = $REST.Web(webUrl, this.targetInfo)
            .Lists()
            .getByTitle(listName)
            .Views()
            .getByTitle(viewName)
            .executeAndWait();
        this.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        });
        return this.camlQueries.find(v => v.ViewName == key).Query;
    }       
}
