import { DisplayField } from "src/objects/DisplayField";
import { ChildConfig } from "./ChildConfig";
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
