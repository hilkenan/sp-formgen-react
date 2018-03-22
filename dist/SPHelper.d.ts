import { JSPFormData } from "./objects/JSPFormData";
import { IListItemResult } from "gd-sprest/build/mapper/types";
import { ListConfig } from "./objects/ListConfig";
import { ITargetInfo } from "gd-sprest/build/utils/types";
export declare class SPHelper {
    private targetInfo;
    private camlQueries;
    /**
     * Takes the target Info as parmeter.s
     */
    constructor(targetInfo: ITargetInfo);
    /**
     * Get the correct List View XML for the configured list settings.
     */
    getListViewXml(formData: JSPFormData, config: ListConfig): string;
    /**
     * Depending on environment att the target url.
     */
    getCorrectWebUrl(webUrl: string): string;
    /**
     * Get the Defauld ListView cached from.
     */
    getCamlQueryFromDevaultView(webUrl: string, listName: string): string;
    private replaceAll(target, search, replacement);
    /**
     * Collect the text for the display
     */
    getDisplayTextFromConfig(item: IListItemResult, config: ListConfig): string;
    /**
     * Get the ListView cached from the given view name.
     */
    getCamlQueryFromView(webUrl: string, viewName: string, listName: string): string;
}
