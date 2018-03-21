const RestProxy = require('sp-rest-proxy');

const settings = {  
  port: 4323,
  protocol: 'http'
};

const restProxy = new RestProxy(settings);  
restProxy.serve();  