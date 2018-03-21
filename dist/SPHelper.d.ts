import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
export declare class SPHelper {
    private static camlQueries;
    /**
     * Get the correct List View XML for the configured list settings.
     */
    static getListViewXml(formData: JSPFormData, config: ListConfig): string;
    /**
     * Depending on environment att the target url.
     */
    static getCorrectWebUrl(webUrl: string): string;
    /**
     * Get the Defauld ListView cached from.
     */
    static getCamlQueryFromDevaultView(webUrl: string, listName: string): string;
    static replaceAll(target: string, search: string, replacement: string): string;
    /**
     * Collect the text for the display
     */
    static getDisplayTextFromConfig(item: IListItemResult, config: ListConfig): string;
    /**
     * Get the ListView cached from the given view name.
     */
    static getCamlQueryFromView(webUrl: string, viewName: string, listName: string): string;
}
