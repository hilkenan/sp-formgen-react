import { JFormData } from "formgen-react";
import { JsonProperty, JsonObject } from "json2typescript";
import { SPConfig } from "./SPConfig";
import { TransConverter, Translate } from "formgen-react/dist/objects/jsonConverters/TransConverter";

/**
 * Form Definition for SharePoint fomrs
 */
@JsonObject
export class JSPFormData extends JFormData {
    
    @JsonProperty("sp_config", SPConfig, true)
    SPConfig: SPConfig = undefined;     

    @JsonProperty("template", String, true)
    Message: string = "";     
    
    @JsonProperty("template_trans", TransConverter, true)
    MessageTranslates?: Translate[] = undefined;        
}
