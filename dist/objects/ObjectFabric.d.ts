import { ListConfig } from './ListConfig';
/**
* Object Fabric to convert json objects to javascript objects and visa versa.
*/
export declare class ObjectFabric {
    /**
    * Get a ListConfig object
    * @param json The json object the get the config.
    */
    static getListConfig(json: any): ListConfig;
    /**
    * Get the Json from an given ListConfig
    * @param ctrol The ListConfig to serialize.
    */
    static getJsonFromListConfig(config: ListConfig): any;
}
