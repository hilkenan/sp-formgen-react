import { IDataProviderCollection } from "formgen-react/dist/formBaseInput/FormBaseInput.types";
import { IDataProviderService } from "formgen-react";
import { ITargetInfo } from "gd-sprest/build/utils/types";
/**
 * The Types to use for injection
 */
export declare const typesForInjectSP: {
    targetInfo: string;
    serverRelativeUrl: string;
};
/**
 * The colleciton of all Service providers for Sharepoint:
 * List Provider
 * UserProfile Provider
 * Search Provider (not jet implmented)
 */
export declare class SPDataProviderServiceCollection implements IDataProviderCollection {
    /**
     * Takes the target Info as parmeter.
     */
    constructor(targetInfo: ITargetInfo, serverRelativeUrl: string);
    providers: IDataProviderService[];
}
