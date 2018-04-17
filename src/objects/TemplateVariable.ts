import { JsonProperty, JsonObject } from "json2typescript";

/**
 * Form Definition for SharePoint fomrs
 */
@JsonObject
export class TemplateVariable {
    @JsonProperty("name", String) 
    Name: string = "";

    @JsonProperty("json_path", String) 
    JsonPath: string = "";
}
