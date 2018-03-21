import { JsonCustomConvert } from "json2typescript";
import { ListConfig } from "../ListConfig";
/**
* Json Converter for a List Config
*/
export declare class ListConfigConverter implements JsonCustomConvert<ListConfig> {
    serialize(config: ListConfig): any;
    deserialize(configJson: any): ListConfig;
}
