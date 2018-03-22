import { ITargetInfo } from "gd-sprest/build/utils/types";

/**
* Target that use the current Context 
*/  
export class SharePointTargetOnline implements ITargetInfo {
    static url:string = null;
}

/**
* Target that use http://localhost:4323
*/  
export class SharePointTargetLocal implements ITargetInfo {
    static url:string = "http://localhost:4323";
}


