import { ChildConfig } from "./ChildConfig";
import { DisplayField } from "./DisplayField";
/**
 * Definition for the configuration of an sharepoint list
 */
export declare class ListConfig {
    KeyField: string;
    ListName: string;
    DisabledField: string;
    ViewName: string;
    DisplayFormat: string;
    WebUrl: string;
    DisplayFields: DisplayField[];
    ChildLists: ChildConfig[];
}
