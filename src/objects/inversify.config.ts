import { Container } from 'inversify';
import { SPDataProviderService } from './SPDataProviderService';
import { IDataProviderService, typesForInject } from 'formgen-react';

/**
* Inversion Of Control class container
*/
export class SPContainer extends Container {
    constructor() {
      super();
      this.declareDependencies();
    }
  
    declareDependencies() {
      this.bind<IDataProviderService>(typesForInject.IDataProviderService).to(SPDataProviderService)
    }
}