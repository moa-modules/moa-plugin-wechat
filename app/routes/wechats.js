var express = require('express');
var router = express.Router();
var res_api       = require('res.api');
var $middlewares  = require('mount-middlewares')(__dirname);
var OAuth         = require('wechat-oauth');
var WXPay         = require('weixin-pay');
// core controller
var $ = require('mount-controllers')(__dirname).wechats_controller;

var c = function(req, res, next){
  next();
}

if(process.env.moas == 1){
  console.log('当前在使用moas调试，加载../../wechat_config');
  c = require('../../wechat_config');
}else{
  console.log('当前未使用moas调试，请注意中间件配置');
}

function wx_config (req, res, next) {
  if (req.wx) {
    req.wx_client = new OAuth(req.wx.app_id, req.wx.app_secret);
    console.log('req.mch_id && req.pfx')
    console.log(req.wx.mch_id && req.wx.pfx)
    console.log(req.wx.mch_id)
    console.log(req.wx.pfx)
    
    if (req.wx.mch_id && req.wx.pfx) {
      req.wx_pay = WXPay({
        appid: req.wx.app_id,
        mch_id: req.wx.mch_id,
        partner_key: req.wx.app_secret, //微信商户平台API密钥
        pfx: req.wx.pfx
      });
    }
    
    next();
  } else {
    console.log('please check your wechat settings with req.wx!');
    return res.status(200).json({
      status:{
        code:-1,
        msg:"please check your wechat settings with req.wx!"
      }
    });
  }
}

function wx_pay_option (req, res, next) {
  if (!req.wx_pay){
    return res.status(200).json({
      data  : req.wx,
      status:{
        code:-2,
        msg:"当前是req.wx_pay不存在，请检查配置项mch_id和pfx是否配置"
      }
    });
  }else{
    console.log("当前是(req.wx_pay存在)")
    next();
  }
}

function wx_option (req, res, next) {
  if (!req.wx.enable_admin){
    return res.status(200).json({
      status:{
        code:-2,
        msg:"当前是(req.wx.enable_admin==false),管理接口不可用"
      }
    });
  }else{
    console.log("当前是(req.wx.enable_admin==true),管理接口可用,访问/wechats")
    next();
  }
}

// 主页,主要是负责OAuth认证
router.get('/oauth', c, wx_config, wx_option, function(req, res) {
  var url = req.wx_client.getAuthorizeURL(req.wx.domain + '/wechats/callback','','snsapi_userinfo');

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
router.get('/callback', c, res_api, wx_config, wx_option, $.oauth_callback);

router.post('/getsignature', c, wx_config, wx_option, function config(req, res, next){
  req.wx_config = {
    cache_json_file : req.server_path,
    appId           : req.wx.app_id,
    appSecret       : req.wx.app_secret,
    appToken        : req.wx.app_token
  };
  
  next();
}, $.getsignature);


// 主要是负责pay
/**
公众号支付 (JS API)

参数req.params

- id      = openid
- order_id= 订单编号
- body    = 产品名称
- detail  = 产品规格描述
- fee     = 支付费用，单位是分
- cb_url  = 回调url

function jsApiCall(){
  var ordor_id = _get_out_trade_no ();
  alert(ordor_id)
  $.get('/wechats/pay_h5?id=o12hcuKXjejDFUwxMgToaGtjtqf4&order_id=' + ordor_id + '&body=1111&detail=222222&fee=1&cb_url=/wechats/pay_calllback/'+ ordor_id, function(data){
    var r = data.data;

    WeixinJSBridge.invoke('getBrandWCPayRequest', r, function(res){
      if(res.err_msg == "get_brand_wcpay_request:ok"){
        alert("支付成功");
        // 这里可以跳转到订单完成页面向用户展示
      }else{
        alert("支付失败，请重试");
      }
    });
  });
}

*/ 
router.get('/pay_h5/', c, wx_config, wx_pay_option, function(req, res) {  
  var call_back_url = req.wx.domain + req.query.cb_url;
  var out_trade_no = req.query.order_id;
  console.log(req.query.id);
  // return;
  // req.wx_pay
  var p = {
    openid: req.query.id,
    body: req.query.body,
    detail: req.query.detail,
    out_trade_no: out_trade_no,// 2015_10_14_18_37_187949638969
    total_fee: req.query.fee,
    spbill_create_ip: req.ip,// 请求的ip地址
    notify_url: call_back_url,
    prepay_id:out_trade_no
  }
  
  console.log(p)
  req.wx_pay.getBrandWCPayRequestParams(p, function(err, result){
    console.log('getBrandWCPayRequestParams=' +err);
    console.log(result);
    if (err) {
      res.status(200).json({
        data: err,
        status: {
          code: 2,
          msg: 'create order filde'
        }
      });
    }else{
      res.status(200).json({
        data: result,
        status: {
          code: 0,
          msg: 'success'
        }
      }) 
    };
  });
})

// 仅供测试支付成功后回调使用
router.post('/pay_calllback/:id', function(req, res, next){
  console.log(req.params.id)
  console.log('/wechats/pay_calllback post sucess')
});  

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