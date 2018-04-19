import { injectable, inject } from "inversify";
import { IDataProviderCollection } from "formgen-react/dist/formBaseInput/FormBaseInput.types";
import { SPListProviderService } from "./objects/SPListProviderService";
import { IDataProviderService } from "formgen-react";
import { ITargetInfo } from "gd-sprest/build/utils/types";
import { SPUserProfileProviderService } from "./objects/SPUserProfileProviderService";
  
/**
 * The Types to use for injection
 */
export const typesForInjectSP = { 
    targetInfo: "targetInfo",
    serverRelativeUrl: "serverRelativeUrl"
};

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
    public constructor(@inject(typesForInjectSP.targetInfo) targetInfo: ITargetInfo, @inject(typesForInjectSP.serverRelativeUrl) serverRelativeUrl: string) {
        let spListProvider = new SPListProviderService(serverRelativeUrl, targetInfo);
        let spUserProfileProvider = new SPUserProfileProviderService(serverRelativeUrl, targetInfo);
        this.providers.push(spListProvider);
        this.providers.push(spUserProfileProvider);        
    }
    providers:IDataProviderService[] = [];
}
