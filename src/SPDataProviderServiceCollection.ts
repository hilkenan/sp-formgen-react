import { injectable, inject } from "inversify";
import { IDataProviderCollection } from "formgen-react/dist/formBaseInput/FormBaseInput.types";
import { SPListProviderService } from "./objects/SPListProviderService";
import { IDataProviderService } from "formgen-react";
import { ITargetInfo } from "gd-sprest/build/utils/types";
  
/**
 * The Types to use for injection
 */
export const typesForInjectSP = { targetInfo: "targetInfo" };

/**
 * The colleciton of all Service providers for Sharepoint:
 * List Provider
 * UserProfile Provider
 * Search Provider (not jet implmented)
 */
@injectable()
export class SPDataProviderServiceCollection implements IDataProviderCollection {
    /**
     * Takes the target Info as parmeter.
     */
    public constructor(@inject(typesForInjectSP.targetInfo) targetInfo: ITargetInfo) {
        let spListProvider = new SPListProviderService(targetInfo);
        this.providers.push(spListProvider);
    }
    providers:IDataProviderService[] = [];
}
