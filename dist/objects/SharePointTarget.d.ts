import { ITargetInfo } from "gd-sprest/build/utils/types";
/**
* Target that use the current Context
*/
export declare class SharePointTargetOnline implements ITargetInfo {
    static url: string;
}
/**
* Target that use https://localhost:4323
*/
export declare class SharePointTargetLocal implements ITargetInfo {
    static url: string;
}
