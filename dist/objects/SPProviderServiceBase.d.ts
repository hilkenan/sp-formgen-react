import { ITargetInfo } from "gd-sprest/build/utils/types";
import { SPConfig } from "./SPConfig";
import { SPHelper } from "../SPHelper";
import { JFormData } from "formgen-react";
/**
* The base Provider Service to access the shrepoint services
*/
export declare abstract class SPProviderServiceBase {
    protected targetInfo: ITargetInfo;
    protected spHelper: SPHelper;
    protected spConfig: SPConfig;
    protected serverRelativeUrl: string;
    /**
     * The SharePoint Form Data
     */
    formData?: JFormData;
    /**
     * Takes the target Info as parmeter.
     */
    constructor(serverRelativeUrl: string, targetInfo: ITargetInfo);
    initialize(): void;
}
