const RestProxy = require('sp-rest-proxy');

const settings = {  
  port: 4323,
  protocol: 'http',
  // ssl: {
  //   cert: CertificateStore.default.instance.certificateData,
  //   key: CertificateStore.default.instance.keyData
  // }};
}
const restProxy = new RestProxy(settings);  
restProxy.serve();  