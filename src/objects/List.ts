import { JsonProperty, JsonObject } from "json2typescript";
import { ListConfig } from "src/objects/ListConfig";
import { ObjectTranslate } from "formgen-react/dist/objects/ObjectTranslate";

/**
 * Definition for the a SharePoint List
 */
@JsonObject
export class List {
    @JsonProperty("key", String) 
    Key: string = "";
 
    @JsonProperty("config", ListConfig) 
    ListConfig: ListConfig = undefined;

    @JsonProperty("config_trans", ObjectTranslate, true)
    ConfigTranslation?: ObjectTranslate = undefined
}
