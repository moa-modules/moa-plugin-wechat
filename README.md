# moa-plugin-wechat

[![npm version](https://badge.fury.io/js/moa-plugin-wechat.svg)](http://badge.fury.io/js/moa-plugin-wechat)

- getsignature 用于分享
- 认证授权后回调函数
  - 成功回调接口（用户存在，完成授权后的工作, wechat_id）
  - 失败回调接口（用户不存在，创建用户, wechat_id）
- oauth入口

## 模型

    moag wechat openid:string nickname:string sex:string language:string city:string province:string country:string headimgurl:string privilege:string created_at:string 


## 本地调试

    ngrok http 80

## 配置

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

## 管理

http://127.0.0.1:3029/wechats