import { ViewItem } from "./objects/ViewItem";
import { $REST } from "gd-sprest";
import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";

export class SPHelper {
    private targetInfo: ITargetInfo;
    private camlQueries:ViewItem[];
    
    /**
     * Takes the target Info as parmeter.s
     */
    public constructor(targetInfo: ITargetInfo) {
        this.targetInfo = targetInfo;
    }

    /**
     * Get the correct List View XML for the configured list settings.
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

    private replaceAll(target:string, search:string, replacement: string) {
        return target.split(search).join(replacement);
    }

    /**
     * Collect the text for the display
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
