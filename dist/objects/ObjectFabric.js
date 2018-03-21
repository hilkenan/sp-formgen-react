"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json2typescript_1 = require("json2typescript");
var ListConfig_1 = require("./ListConfig");
/**
* Object Fabric to convert json objects to javascript objects and visa versa.
*/
var ObjectFabric = /** @class */ (function () {
    function ObjectFabric() {
    }
    /**
    * Get a ListConfig object
    * @param json The json object the get the config.
    */
    ObjectFabric.getListConfig = function (json) {
        var jsonConvert = new json2typescript_1.JsonConvert();
        return jsonConvert.deserializeObject(json, ListConfig_1.ListConfig);
    };
    /**
    * Get the Json from an given ListConfig
    * @param ctrol The ListConfig to serialize.
    */
    ObjectFabric.getJsonFromListConfig = function (config) {
        var jsonConvert = new json2typescript_1.JsonConvert();
        return jsonConvert.serializeObject(config);
    };
    return ObjectFabric;
}());
exports.ObjectFabric = ObjectFabric;
//# sourceMappingURL=ObjectFabric.js.map