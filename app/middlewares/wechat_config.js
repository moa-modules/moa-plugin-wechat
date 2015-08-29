/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */

// for raw data post
module.exports = function (req, res, next) {
  req.wx = {
    'app_id' : 'wx04014b02a0a61c90',
    'app_secret' : 'cc4c224b5018370cf6ffc95ad2be309c',
    'domain':'e0ad1396.ngrok.io',
    'app_token':'mengxiaoban.com',
    callback:{
      success : '/wechats',
      failed  : '/404'
    }
  }
  
  next();
};