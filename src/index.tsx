import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { SPForm } from './form/SPForm';
var jsonForm = require('./samples/test.json');

ReactDOM.render(
  <SPForm jsonFormData={ jsonForm }  />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
