import { ViewItem } from "./objects/ViewItem";
import { SharePointTarget } from "./SharePointTarget";
import { $REST } from "gd-sprest";
import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";

export class SPHelper {
    private static camlQueries:ViewItem[];

    /**
     * Get the correct List View XML for the configured list settings.
     */                 
    static getListViewXml(formData:JSPFormData, config:ListConfig):string {
        let webUrl = formData.SPConfig.BaseUrl + config.WebUrl;
        webUrl = SPHelper.getCorrectWebUrl(webUrl);
        
        let listView;
        if (!config.ViewName) {
            listView = SPHelper.getCamlQueryFromDevaultView(webUrl, config.ListName);
        }
        else {
            listView = SPHelper.getCamlQueryFromView(webUrl, config.ViewName, config.ListName);                
        }        
        return listView;
    }

    /**
     * Depending on environment att the target url.
     */                 
    static getCorrectWebUrl(webUrl:string): string {
        if (SharePointTarget.url && webUrl)
            return SharePointTarget.url + webUrl;
        else if (!SharePointTarget.url && !webUrl)
            return undefined;
        else
            return webUrl;
    }

    /**
     * Get the Defauld ListView cached from.
     */                 
    static getCamlQueryFromDevaultView(webUrl: string, listName:string): string {
        if (SPHelper.camlQueries == undefined)
            SPHelper.camlQueries = [];

        let key = listName + ":defaultView";
        let item = SPHelper.camlQueries.find(v => v.ViewName == key);
        if (item) return item.Query;
        
        let view = $REST.Web(webUrl, SharePointTarget)
            .Lists()
            .getByTitle(listName)
            .DefaultView()
            .executeAndWait();
        SPHelper.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        })
        return SPHelper.camlQueries.find(v => v.ViewName == key).Query;
    }

    static replaceAll(target:string, search:string, replacement: string) {
        return target.split(search).join(replacement);
    }

    /**
     * Collect the text for the display
     */                 
    static getDisplayTextFromConfig(item:IListItemResult, config:ListConfig) {
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
     */                 
    static getCamlQueryFromView(webUrl: string, viewName:string, listName:string): string {
        if (SPHelper.camlQueries == undefined)
            SPHelper.camlQueries = [];

        let key = listName + ":" + viewName;
        let item = SPHelper.camlQueries.find(v => v.ViewName == key);
        if (item) return item.Query;
        
        let view = $REST.Web(webUrl, SharePointTarget)
            .Lists()
            .getByTitle(listName)
            .Views()
            .getByTitle(viewName)
            .executeAndWait();
        SPHelper.camlQueries.push({
            ViewName: key,
            Query: view.ListViewXml
        });
        return SPHelper.camlQueries.find(v => v.ViewName == key).Query;
    }       
}
