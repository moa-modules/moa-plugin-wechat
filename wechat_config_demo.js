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
    'domain':'https://i5ting2.localtunnel.me',
    'app_token':'moa-plugin-wechat',
    'enable_admin': true,
    //for pay
    'mch_id': '1229607702',
    'pfx': fs.readFileSync('./pay/cert/apiclient_cert.p12'), //微信商户平台证书
    //callback
    callback:{
      url     : '/wechats/callback2',
      attr    : '_id',
      success : '/wechats',
      failed  : '/404'
    }
  }
  
  next();
};