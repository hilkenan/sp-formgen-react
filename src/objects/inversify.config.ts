import { Container } from 'inversify';
import { SPDataProviderService, typesForInjectSP } from './SPDataProviderService';
import { IDataProviderService, typesForInject } from 'formgen-react';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { SharePointTargetLocal, SharePointTargetOnline } from './SharePointTarget';

/**
* Inversion Of Control class container
*/
export class SPContainer extends Container {
    private targetInfo: ITargetInfo;
    constructor(useLocalHost: boolean) {
      super();
      if (useLocalHost)
        this.targetInfo = SharePointTargetLocal;
      else
        this.targetInfo = SharePointTargetOnline;

      this.declareDependencies();
    }
  
    declareDependencies() {
      this.bind<IDataProviderService>(typesForInject.IDataProviderService).to(SPDataProviderService);
      this.bind<ITargetInfo>(typesForInjectSP.targetInfo).toConstantValue(this.targetInfo);
    }
}