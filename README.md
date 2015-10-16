# moa-plugin-wechat

[![npm version](https://badge.fury.io/js/moa-plugin-wechat.svg)](http://badge.fury.io/js/moa-plugin-wechat)

- getsignature 用于分享
- 认证授权后回调函数
  - 成功回调接口（用户存在，完成授权后的工作, wechat_id）
  - 失败回调接口（用户不存在，创建用户, wechat_id）
- oauth入口

## 模型

    moag wechat openid:string nickname:string sex:string language:string city:string province:string country:string headimgurl:string privilege:string created_at:string 

自己用的，这些字段都是微信返回来的，如果需要，可以让用户系统和wechat模型进行1对1的绑定

## 本地调试

    ngrok http 80

记得在公众号里修改【网页授权获取用户基本信息】，为对应的req.wx.domain里对应的地址，否则无法测试的。

另外推荐一个 https://localtunnel.me

特点：

- nodejs写的
- 稳定，速度也不错

```
npm install -g localtunnel
lt --port 8000
```

## 配置

在app.js里设置一下信息

    req.wx = {
      'app_id' : '',
      'app_secret' : '',
      'domain':'http://e0ad1396.ngrok.io',
      'app_token':'mengxiaoban.com',
      'enable_admin': true,
      //for pay
      'mch_id': '1229607702',
      'pfx': fs.readFileSync('./pay/cert/apiclient_cert.p12'), //微信商户平台证书
      callback:{
        success : '/wechats',
        failed  : '/404'
      }
    }
    
注意callback是微信授权后的回调地址

- success是成功后，参数会带wechat_id
- failed是失败后的处理

## API

### OAuth接口

http://127.0.0.1:3029/wechats/oauth


- 请求：get
- 参数：无

### 公众号支付 (JS API)接口

http://127.0.0.1:3029/wechats/pay_h5/


公众号支付 (JS API)

- 请求：get
- 参数req.params
  - id      = openid
  - order_id= 订单编号
  - body    = 产品名称
  - detail  = 产品规格描述
  - fee     = 支付费用，单位是分
  - cb_url  = 回调url

```
function pay_h5(){
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
```


在app/routes/wechats.js里,定义支付成功回调url

- 必须是post
- 微信服务器会给发送几次post，所以自己判断一下是否已处理，如果已处理过，忽略即可
- 完整的对账单还是有必要和微信的对一下的，虽然一般不会有什么问题

```
// path = /wechats/pay_calllback/'+ ordor_id
router.post('/pay_calllback/:id', function(req, res, next){
  console.log(req.params.id)
  console.log('/wechats/pay_calllback post sucess')
});  
```

如果是多个模型用一个callback url，可以参数上增加模型名称

## status code

- -1 please check your wechat settings with req.wx!
- -2 当前是(req.wx.enable_admin==false),管理接口不可用

## 管理

http://127.0.0.1:3029/wechats

需要添加一个debug选项，如果没有就不能访问管理界面的
