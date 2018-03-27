import { JsonProperty, JsonObject } from "json2typescript";

/**
 * Definition for an display field for the lists
 */
@JsonObject
export class DisplayField {
    @JsonProperty("internal_name", String) 
    InternalName: string = "";

    @JsonProperty("display_format", String, true) 
    DisplayFormat: string = "";

    @JsonProperty("use_language_variants", Boolean, true) 
    UseLanguageVariants: Boolean = false;
}

