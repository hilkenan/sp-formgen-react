import { ITargetInfo } from "gd-sprest/build/utils/types";
import { SPConfig } from "./SPConfig";
import { SPHelper } from "../SPHelper";
import { JFormData } from "formgen-react";

/**
* The base Provider Service to access the shrepoint services
*/  
export abstract class SPProviderServiceBase {
    protected targetInfo: ITargetInfo;
    protected spHelper:SPHelper;
    protected spConfig:SPConfig;
    protected serverRelativeUrl:string;

    /**
     * The SharePoint Form Data
     */
    formData?: JFormData;
    
    /**
     * Takes the target Info as parmeter.
     */
    public constructor(serverRelativeUrl:string, targetInfo: ITargetInfo) {
        this.targetInfo = targetInfo;
        this.serverRelativeUrl = serverRelativeUrl;
    }

    public initialize() {
        if (!this.spConfig) {
            this.spConfig = SPHelper.LoadConfig(this.serverRelativeUrl, this.targetInfo, this.formData.DataProviderConfigName)
            this.spHelper = new SPHelper(this.serverRelativeUrl, this.targetInfo, this.spConfig);
        }
    }
}