/*!
 * Moajs Middle
 * Copyright(c) 2015-2019 Alfred Sang <shiren1118@126.com>
 * MIT Licensed
 */

// for raw data post
module.exports = function (req, res, next) {
  
  // var config      = require('config');
  // var app_id      = config.get('wx.app_id');
  // var app_secret  = config.get('wx.app_secret');
  // var domain      = config.get('domain');
  // var app_token   = 'mengxiaoban.com'
  
  req.wx = {
    'app_id' : 'wx50b97d02c86f6c26',
    'app_secret' : 'a50b4bd3fa1949624b7c404c6d48bda0',
    'domain':'domain',
    'app_token':'mengxiaoban.com'
  }
  
  next();
  
};