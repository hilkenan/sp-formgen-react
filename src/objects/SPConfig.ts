import { JsonProperty, JsonObject } from "json2typescript";
import { List } from "./List";


/**
 * Config Definition for SharePoint Config Lists
 */
@JsonObject
export class SPConfig {
    @JsonProperty("base_url", String, true) 
    BaseUrl: string = "";

    @JsonProperty("lists", [List])
    ListConfigs: List[] = []
}
