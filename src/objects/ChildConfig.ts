import { JsonProperty, JsonObject } from "json2typescript";
import { ListConfigConverter } from "./jsonConverters/ListConfigConverter";
import { ListConfig } from "./ListConfig";
import { ObjectTranslate } from "formgen-react/dist/objects/ObjectTranslate";

@JsonObject
export class ChildConfig {
    @JsonProperty("parent_field", String) 
    ParentField: string = "";

    @JsonProperty("child_config", ListConfigConverter) 
    Config: ListConfig = undefined;

    @JsonProperty("child_config_trans", ObjectTranslate, true)
    ConfigTranslation?: ObjectTranslate = undefined
}