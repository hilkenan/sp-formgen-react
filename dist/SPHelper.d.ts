import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";
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
     * Get the Defauld ListView cached from.
     * @param webUrl The Url relative to the base url
     * @param listName The Dipslay name of the list to use.
     */
    getCamlQueryFromDevaultView(webUrl: string, listName: string): string;
    /**
     * Replace the all occurencies from search in the target with replacments
     * @param target the origin string
     * @param search the search string
     * @param replacement the replacment string
     */
    private replaceAll(target, search, replacement);
    /**
     * Collect the text for the display
     * @param item The ListItem Result to collect texts from.
     * @param config The Configuration for this list.
     */
    getDisplayTextFromConfig(item: IListItemResult, config: ListConfig): string;
    /**
     * Get the ListView cached from the given view name.
     * @param webUrl The Url relative to the base url
     * @param viewName The view name to get the caml from.
     * @param listName The Name of the list.
     */
    getCamlQueryFromView(webUrl: string, viewName: string, listName: string): string;
}
