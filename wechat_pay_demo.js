//错误提醒
wx.error(function(res) {
    alert('wx.error=' + JSON.stringify(res))
});

function _get_date_string () {
  var date = moment().format('YYYY MM DD HH mm ss');

  return date.split(' ').join('_');
}

function _get_out_trade_no () {
  return _get_date_string ()  + "" + Math.random().toString().substr(2, 10);
}

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


function aaa()
{
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', jsApiCall); 
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }else{
        jsApiCall();
    }
};

function onBridgeReady() {
    WeixinJSBridge.on('menu:share:appmessage', function(argv) 
    {
        WeixinJSBridge.invoke('sendAppMessage',{
                    "link":"http://m.exmail.qq.com/",
                    "desc":"desc",
                    "title":"title for WeiXinJsBridge"
        }, function(res) {
            WeixinJSBridge.log(res.err_msg);
        });
    });
    WeixinJSBridge.on('menu:share:timeline', function(argv) 
    {
    WeixinJSBridge.invoke("shareTimeline",{
        "link":"http://m.exmail.qq.com",
        "img_url":"http://rescdn.qqmail.com/bizmail/zh_CN/htmledition/images/bizmail/v3/logo1ca3fe.png",
        "img_width":"172",
        "img_height":"40",
        "desc":"i am description",
        "title":"just test from WeixinJsBridge"
        },
        function(e){
        alert(e.err_msg);
        })
    });
}
 
if (typeof WeixinJSBridge === "undefined"){
    if (document.addEventListener){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }
}else{
    onBridgeReady();
}