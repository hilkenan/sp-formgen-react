import { Container } from 'inversify';
/**
* Inversion Of Control class container
*/
export declare class SPContainer extends Container {
    private targetInfo;
    constructor(useLocalHost: boolean);
    declareDependencies(): void;
}
