import { JFormData } from "formgen-react";
import { SPConfig } from "./SPConfig";
import { Translate } from "formgen-react/dist/objects/jsonConverters/TransConverter";
/**
 * Form Definition for SharePoint fomrs
 */
export declare class JSPFormData extends JFormData {
    SPConfig: SPConfig;
    Message: string;
    MessageTranslates?: Translate[];
}
