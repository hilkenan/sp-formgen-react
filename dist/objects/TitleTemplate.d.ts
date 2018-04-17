import { Translate } from "formgen-react/dist/objects/jsonConverters/TransConverter";
import { TemplateVariable } from "./TemplateVariable";
/**
 * Form Definition for SharePoint fomrs
 */
export declare class TitleTemplate {
    Message: string;
    MessageTranslates?: Translate[];
    TemplateVariables?: TemplateVariable[];
}
