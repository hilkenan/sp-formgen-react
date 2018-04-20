import { ITargetInfo } from "gd-sprest/build/utils/types";

/**
* Target that use https://localhost:4323
*/  
export class SharePointTargetLocal implements ITargetInfo {
    static url:string = "http://localhost:4323";
}