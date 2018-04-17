import { JsonProperty, JsonObject } from "json2typescript";
import { TransConverter, Translate } from "formgen-react/dist/objects/jsonConverters/TransConverter";
import { TemplateVariable } from "./TemplateVariable";

/**
 * Form Definition for SharePoint fomrs
 */
@JsonObject
export class TitleTemplate {
    @JsonProperty("template", String) 
    Message: string = "";

    @JsonProperty("template_trans", TransConverter, true)
    MessageTranslates?: Translate[] = undefined;    

    @JsonProperty("variables", [TemplateVariable], true)
    TemplateVariables?: TemplateVariable[] = undefined;    
}
