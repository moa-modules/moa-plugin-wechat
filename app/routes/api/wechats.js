var express = require('express');
var router = express.Router();

// var res_api       = require('res.api');
var $ = require('mount-controllers')(__dirname).wechats_controller;

var $middlewares  = require('mount-middlewares')(__dirname);

// route define
router.get('/', $middlewares.check_api_token, $.api.list);

router.post('/', $middlewares.check_api_token, $.api.create);

router.get('/:wechat_id', $middlewares.check_api_token, $.api.show);

router.patch('/:wechat_id', $middlewares.check_api_token, $.api.update);

router.delete('/:wechat_id', $middlewares.check_api_token, $.api.delete);


module.exports = router;
