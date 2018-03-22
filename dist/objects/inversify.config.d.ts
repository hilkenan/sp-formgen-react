import { Container } from 'inversify';
/**
* Inversion Of Control class container.
* @param useLocalHost If is true then use the SharePointTargetLocal otherwise the SharePointTargetOnline as target.
*/
export declare class SPContainer extends Container {
    private targetInfo;
    constructor(useLocalHost: boolean);
    declareDependencies(): void;
}
