import { ITargetInfo } from "gd-sprest/build/utils/types";

export class SharePointTargetOnline implements ITargetInfo {
    static url:string = null;
}

export class SharePointTargetLocal implements ITargetInfo {
    static url:string = "http://localhost:4323";
}


