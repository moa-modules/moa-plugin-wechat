var express = require('express');
var router = express.Router();
var res_api       = require('res.api');
var $middlewares  = require('mount-middlewares')(__dirname);
var OAuth         = require('wechat-oauth');
// core controller
var $ = require('mount-controllers')(__dirname).wechats_controller;

function wx_config(req, res, next) {
  if (req.wx) {
    req.wx_client = new OAuth(req.wx.app_id, req.wx.app_secret);
    next();
  } else {
    console.log('please check your wechat settings with req.wx!');
  }
};

// 主页,主要是负责OAuth认真
router.get('/oauth', wx_config, function(req, res) {
  var url = req.wx_client.getAuthorizeURL('http://' + req.wx.domain + '/wechats/callback','','snsapi_userinfo');

  // 重定向请求到微信服务器
  res.redirect(url);
})


/**
 * 认证授权后回调函数
 *
 * 根据openid判断是否用户已经存在
 * - 如果是新用户，注册并绑定，然后跳转到手机号验证界面
 * - 如果是老用户，跳转到主页
 */
router.get('/callback', res_api, wx_config, $.oauth_callback);

router.post('/getsignature', wx_config, function config(req, res, next){
  req.wx_config = {
    cache_json_file : req.server_path,
    appId           : req.wx.app_id,
    appSecret       : req.wx.app_secret,
    appToken        : req.wx.app_token
  };
  
  next();
}, $.getsignature);

/**
 * Auto generate RESTful url routes.
 *
 * URL routes:
 *
 *  GET    /wechats[/]        => wechat.list()
 *  GET    /wechats/new       => wechat.new()
 *  GET    /wechats/:id       => wechat.show()
 *  GET    /wechats/:id/edit  => wechat.edit()
 *  POST   /wechats[/]        => wechat.create()
 *  PATCH  /wechats/:id       => wechat.update()
 *  DELETE /wechats/:id       => wechat.destroy()
 *
 */

router.get('/new', $.new);  
router.get('/:id/edit', $.edit);

router.route('/')
  .get($.list)
  .post($.create);

router.route('/:id')
  .patch($.update)
  .get($.show)
  .delete($.destroy);


// -- custom routes

module.exports = router;