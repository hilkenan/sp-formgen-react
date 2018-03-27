import { Container } from 'inversify';
import { typesForInject } from 'formgen-react';
import { ITargetInfo } from 'gd-sprest/build/utils/types';
import { SharePointTargetLocal, SharePointTargetOnline } from './SharePointTarget';
import { IDataProviderCollection } from 'formgen-react/dist/formBaseInput/FormBaseInput.types';
import { typesForInjectSP, SPDataProviderServiceCollection } from '../SPDataProviderServiceCollection';

/**
* Inversion Of Control class container.
* @param useLocalHost If is true then use the SharePointTargetLocal otherwise the SharePointTargetOnline as target.
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
      this.bind<IDataProviderCollection>(typesForInject.IDataProviderCollection).to(SPDataProviderServiceCollection);
      this.bind<ITargetInfo>(typesForInjectSP.targetInfo).toConstantValue(this.targetInfo);
    }
}