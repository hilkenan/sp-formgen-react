import { JsonProperty, JsonObject } from "json2typescript";
import { ChildConfig } from "./ChildConfig";
import { DisplayField } from "./DisplayField";

/**
 * Definition for the configuration of an sharepoint list
 */
@JsonObject
export class ListConfig {
    @JsonProperty("key_field", String) 
    KeyField: string = "";

    @JsonProperty("list_name", String) 
    ListName: string = "";

    @JsonProperty("disabled_field", String, true) 
    DisabledField: string = "";

    @JsonProperty("view_name", String, true) 
    ViewName: string = "";
    
    @JsonProperty("display_format", String, true) 
    DisplayFormat: string = "";

    @JsonProperty("web_url", String, true) 
    WebUrl: string = "";
    
    @JsonProperty("display_fields", [DisplayField])
    DisplayFields: DisplayField[] = [];

    @JsonProperty("child_lists", [ChildConfig], true)
    ChildLists: ChildConfig[] = [];        
}
