/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */
var fs = require('fs');


// for raw data post
module.exports = function (req, res, next) {
  req.wx = {
    'app_id' : '',
    'app_secret' : '',
    'domain':'https://xxxxx.localtunnel.me',
    'app_token':'xxxx.com',
    'enable_admin': true,
    'callback_attr':'_id',
    //for pay
    'mch_id': 'xxxxx',
    'pfx': fs.readFileSync('./pay/cert/apiclient_cert.p12'), //微信商户平台证书
    //callback
    callback:{
      success : '/wechats',
      failed  : '/404'
    }
  }
  
  next();
};