import {JsonCustomConvert, JsonConverter} from "json2typescript";
import { ListConfig } from "../ListConfig";
import { ObjectFabric } from "../ObjectFabric";

/**
* Json Converter for a List Config
*/ 
@JsonConverter
export class ListConfigConverter implements JsonCustomConvert<ListConfig> {
    serialize(config: ListConfig): any {
        return ObjectFabric.getJsonFromListConfig(config);
    }

    deserialize(configJson: any):ListConfig {
        return ObjectFabric.getListConfig(configJson)
    }
}
