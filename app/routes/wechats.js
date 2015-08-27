var express = require('express');
var router = express.Router();

var signature = require('wx_jsapi_sign');
// mount all middlewares in app/middlewares, examples:
// 
// router.route('/')
//  .get($middlewares.check_session_is_expired, $.list)
//  .post($.create);
// 
var $middlewares  = require('mount-middlewares')(__dirname);

// core controller
var $ = require('mount-controllers')(__dirname).wechats_controller;

function wx_config(req, res, next) {
  
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
  
  var OAuth = require('wechat-oauth');
  req.wx_client = new OAuth(req.wx.app_id, req.wx.app_secret);
  
  next();
  
};
 
// var check_session = require('../middleware/check_session_is_expired');



// 读取配置项
// var config      = require('config');
// var app_id      = config.get('wx.app_id');
// var app_secret  = config.get('wx.app_secret');
// var domain      = config.get('domain');
// var app_token   = 'mengxiaoban.com'

// 微信授权和回调

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
router.get('/callback', function(req, res) {
  console.log('----weixin callback -----')
  var code = req.query.code;
  var User = req.model.UserModel;

  req.wx_client.getAccessToken(code, function (err, result) {
    console.dir(err);
    console.dir(result);
    var accessToken = result.data.access_token;
    var openid = result.data.openid;
    var unionid = result.data.unionid;

    console.log('token=' + accessToken);
    console.log('openid=' + openid);
    console.log('unionid=' + unionid);


    User.find_by_unionid(unionid, function(err, user){
      console.log('微信回调后，User.find_by_unionid(unionid) 返回的user = ' + user)
      if(err || user == null){
        console.log('经过unionid查询无结果');

        client.getUser(openid, function (err, get_by_openid) {
          console.log(get_by_openid);
          var oauth_user = get_by_openid;
          
          //  Wechat.create({openid: req.body.openid,nickname: req.body.nickname,sex: req.body.sex,language: req.body.language,city: req.body.city,province: req.body.province,country: req.body.country,headimgurl: req.body.headimgurl,privilege: req.body.privilege,created_at: req.body.created_at}, function (err, wechat) {
    // console.log(wechat);
//     res.render('wechats/show', {
//       wechat : wechat
//     })
//   });
          var _user = new User(oauth_user);
          _user.username = oauth_user.nickname;

          _user.save(function(err, user_save) {
            if (err) {
              console.log('User save error ....' + err);
            } else {
              console.log('User save sucess ....' + err);
              req.session.current_user = void 0;
              res.redirect('/users/' + user_save._id + '/verify');
            }
          });
        });
      }else{
        console.log('根据unionid查询，用户已经存在')
        // if phone_number exist,go home page
        if(user.is_valid == true){
           req.session.current_user = user;
           res.redirect('/mobile/')
        }else{
          //if phone_number exist,go to user detail page to fill it
          req.session.current_user = void 0;
          res.redirect('/users/' + user._id + '/verify');
        }
      }
    });
  });
});

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