import { ViewItem } from "./objects/ViewItem";
import { $REST } from "gd-sprest";
import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";

/**
 * Helper class to acces sharepoint.
 */
export class SPHelper {
    private targetInfo: ITargetInfo;
    private camlQueries:ViewItem[];
    
    /**
     * Takes the target Info
     * @param targetInfo Target to use (local or current context)
     */
    public constructor(targetInfo: ITargetInfo) {
        this.targetInfo = targetInfo;
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
            listView = this.getCamlQueryFromDevaultView(webUrl, config.ListName);
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
        if (this.targetInfo.url && webUrl)
            return this.targetInfo.url + webUrl;
        else if (!this.targetInfo.url && !webUrl)
            return undefined;
        else
            return webUrl;
    }

    /**
     * Get the Defauld ListView cached from.
     * @param webUrl The Url relative to the base url
     * @param listName The Dipslay name of the list to use.
     */                 
    public getCamlQueryFromDevaultView(webUrl: string, listName:string): string {
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
    private replaceAll(target:string, search:string, replacement: string) {
        return target.split(search).join(replacement);
    }

    /**
     * Collect the text for the display
     * @param item The ListItem Result to collect texts from.
     * @param config The Configuration for this list.
     */                 
    public getDisplayTextFromConfig(item:IListItemResult, config:ListConfig) {
        let texts:string[] = [];
        for(let fieldName of config.DisplayFields) {
            let fieldValue = item[fieldName.InternalName];
            if (fieldName.DisplayFormat) {
                fieldValue = this.replaceAll(fieldName.DisplayFormat, "{fieldValue}",  fieldValue);
            }
            texts.push(fieldValue)
        }
        let text = ""
        if (config.DisplayFormat) {
            text = config.DisplayFormat;
            for(let i = 0;i < texts.length; i++) {
                text = this.replaceAll(text, "{texts[" + i + "]}",  texts[i]);
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
