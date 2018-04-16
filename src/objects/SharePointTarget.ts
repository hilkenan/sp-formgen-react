import { ITargetInfo } from "gd-sprest/build/utils/types";

/**
* Target that use the current Context 
*/  
export class SharePointTargetOnline implements ITargetInfo {
    static url:string = null;
}

/**
* Target that use https://localhost:4323
*/  
export class SharePointTargetLocal implements ITargetInfo {
    static url:string = "https://localhost:4323";
}


