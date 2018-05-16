import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";
import { List, SPConfig } from ".";
import { JFormData } from "formgen-react";
/**
 * Helper class to acces sharepoint.
 */
export declare class SPHelper {
    private targetInfo;
    private serverRelativeUrl;
    private camlQueries;
    private spConfig;
    /**
     * Load the Config File from the Config SharePoint List with the config Infos. providerConfigName is the json Filename
     * @param serverRelativeUrl The server url from the request.
     * @param targetInfo Target to use (local or current context)
     * @param spConfig The SharePoint Configuration
     */
    static LoadConfig(serverRelativeUrl: string, targetInfo: ITargetInfo, providerConfigName: string): SPConfig;
    /**
     * Get the content of the given file from the Cnfig Library
     * @param serverRelativeUrl The server url from the request.
     * @param fileName The filename without extention
     * @param targetInfo Target to use (local or current context)
     */
    static getConfigFile(serverRelativeUrl: string, fileName: string, targetInfo: ITargetInfo): string;
    /**
     * Takes the target Info
     * @param serverRelativeUrl The server url from the request.
     * @param targetInfo Target to use (local or current context)
     * @param spConfig The SharePoint Configuration
     */
    constructor(serverRelativeUrl: string, targetInfo: ITargetInfo, spConfig: SPConfig);
    /**
     * Get the correct List View XML for the configured list settings.
     * @param formData the Current Form Data object
     * @param config The Config for the List to get the view from.
     */
    getListViewXml(formData: JFormData, config: ListConfig): string;
    /**
     * Depending on environment att the target url.
     * @param webUrl The Url relative to the base url
     */
    getCorrectWebUrl(webUrl: string): string;
    /**
     * Depending on environment att the target url.
     * @param webUrl The Url relative to the base url
     * @param targetInfo The Target Info
     * @param serverRelativeUrl Server Relative url
     */
    private static getCorrectWebUrlFromTarget(webUrl, targetInfo, serverRelativeUrl);
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
