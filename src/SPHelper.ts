import { ViewItem } from "./objects/ViewItem";
import { $REST } from "gd-sprest";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";
import { List, SPConfig } from ".";
import { Helper } from "formgen-react/dist/Helper";
import { JFormData } from "formgen-react";
import { JsonConvert } from "json2typescript";
import { SPFormConst } from "./SPFormConst";

/**
 * Helper class to acces sharepoint.
 */
export class SPHelper {
    private targetInfo: ITargetInfo;
    private serverRelativeUrl: string;
    private camlQueries:ViewItem[];
    private spConfig:SPConfig;
    
    /**
     * Load the Config File from the Config SharePoint List with the config Infos. providerConfigName is the json Filename
     * @param serverRelativeUrl The server url from the request.
     * @param targetInfo Target to use (local or current context)
     * @param spConfig The SharePoint Configuration
     */
     public static LoadConfig(serverRelativeUrl:string, targetInfo: ITargetInfo, providerConfigName: string) : SPConfig {
        let json = SPHelper.getConfigFile(serverRelativeUrl, providerConfigName + ".json", targetInfo);
        let jsonConvert: JsonConvert = new JsonConvert();
        let jsonObject = JSON.parse(json);
        return jsonConvert.deserializeObject(jsonObject, SPConfig) as SPConfig
    }

    /**
     * Get the content of the given file from the Cnfig Library
     * @param serverRelativeUrl The server url from the request.
     * @param fileName The filename without extention
     * @param targetInfo Target to use (local or current context)
     */    
    public static getConfigFile(serverRelativeUrl:string, fileName:string, targetInfo: ITargetInfo) : string {
        let serverUrl = serverRelativeUrl ? serverRelativeUrl : "";
        let url = serverUrl + SPFormConst.ConfigLibraryUrl;
        let webUrl = SPHelper.getCorrectWebUrlFromTarget("", targetInfo, serverRelativeUrl);
        let content = $REST.Web(webUrl,  targetInfo)
            .getFolderByServerRelativeUrl(url)
            .Files(fileName)
            .openBinaryStream()
            .executeAndWait();
        if (content.toString().indexOf("{\"error\":") != -1 || content.toString().indexOf("Error") != -1) {
            throw content;
        }
        return content.toString();
    }

    /**
     * Takes the target Info
     * @param serverRelativeUrl The server url from the request.
     * @param targetInfo Target to use (local or current context)
     * @param spConfig The SharePoint Configuration
     */
    public constructor(serverRelativeUrl: string, targetInfo: ITargetInfo, spConfig:SPConfig) {
        this.targetInfo = targetInfo;
        this.serverRelativeUrl = serverRelativeUrl;
        this.spConfig = spConfig;
    }

    /**
     * Get the correct List View XML for the configured list settings.
     * @param formData the Current Form Data object
     * @param config The Config for the List to get the view from.
     */                 
    public getListViewXml(formData:JFormData, config:ListConfig):string {
        let webUrl = this.spConfig.BaseUrl + config.WebUrl;
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
        let serverUrl = this.serverRelativeUrl ? this.serverRelativeUrl : "";
        if (this.targetInfo && this.targetInfo.url && (webUrl || webUrl == ""))
            return this.targetInfo.url + serverUrl + webUrl;
        else if ((!this.targetInfo || !this.targetInfo.url) && !webUrl)
            return serverUrl;
        return serverUrl + webUrl;
    }

    /**
     * Depending on environment att the target url.
     * @param webUrl The Url relative to the base url
     * @param targetInfo The Target Info
     * @param serverRelativeUrl Server Relative url
     */                 
    private static getCorrectWebUrlFromTarget(webUrl:string, targetInfo:ITargetInfo, serverRelativeUrl:string): string {
        serverRelativeUrl = serverRelativeUrl ? serverRelativeUrl : "";
        if (targetInfo && targetInfo.url && (webUrl || webUrl == ""))
            return targetInfo.url + serverRelativeUrl + webUrl;
        else if ((!targetInfo || !targetInfo.url) && !webUrl)
            return serverRelativeUrl;
        return serverRelativeUrl + webUrl;
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
                fieldValue = Helper.replaceAll(fieldConfig.DisplayFormat, "{fieldValue}",  fieldValue);
            }
            texts.push(fieldValue)
        }
        let text = ""
        if (config.DisplayFormat) {
            text = config.DisplayFormat;
            for(let i = 0;i < texts.length; i++) {
                text = Helper.replaceAll(text, "{texts[" + i + "]}",  texts[i]);
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
