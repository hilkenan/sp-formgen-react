import { JFormData } from "formgen-react";
import { JsonProperty, JsonObject } from "json2typescript";
import { SPConfig } from "src/objects/SPConfig";

/**
 * Form Definition for SharePoint fomrs
 */
@JsonObject
export class JSPFormData extends JFormData {
    @JsonProperty("sp_config", SPConfig, true)
    SPConfig: SPConfig = undefined;     
}
