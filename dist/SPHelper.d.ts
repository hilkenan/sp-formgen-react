import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";
import { List, SPConfig } from ".";
/**
 * Helper class to acces sharepoint.
 */
export declare class SPHelper {
    private targetInfo;
    private camlQueries;
    /**
     * Takes the target Info
     * @param targetInfo Target to use (local or current context)
     */
    constructor(targetInfo: ITargetInfo);
    /**
     * Get the correct List View XML for the configured list settings.
     * @param formData the Current Form Data object
     * @param config The Config for the List to get the view from.
     */
    getListViewXml(formData: JSPFormData, config: ListConfig): string;
    /**
     * Depending on environment att the target url.
     * @param webUrl The Url relative to the base url
     */
    getCorrectWebUrl(webUrl: string): string;
    /**
     * Get the correct web url from the list.
     * @param config The config for the given list
     * @param controlConfig SharePoint part of the configuration (translated)
     */
    getWebUrl(config: List, spConfig: SPConfig): string;
    /**
     * Get the Defauld ListView cached from.
     * @param webUrl The Url relative to the base url
     * @param listName The Dipslay name of the list to use.
     */
    getCamlQueryFromDefaultView(webUrl: string, listName: string): string;
    /**
     * Replace the all occurencies from search in the target with replacments
     * @param target the origin string
     * @param search the search string
     * @param replacement the replacment string
     */
    static replaceAll(target: string, search: string, replacement: string): string;
    /**
     * Collect the text for the display
     * @param item The ListItem Result to collect texts from.
     * @param config The Configuration for this list.
     * @param lang The language if use language specific fieldnames
     * @param configFieldName If defined then use this fieldName insted in the config devined ones
     */
    getDisplayTextFromConfig(item: IListItemResult, config: ListConfig, lang: string, configFieldName?: string): string;
    /**
     * Get the ListView cached from the given view name.
     * @param webUrl The Url relative to the base url
     * @param viewName The view name to get the caml from.
     * @param listName The Name of the list.
     */
    getCamlQueryFromView(webUrl: string, viewName: string, listName: string): string;
}
