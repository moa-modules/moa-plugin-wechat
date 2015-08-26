/**
 * Created by Moajs on August 25th 2015, 6:11:46 pm.
 */

var $models = require('mount-models')(__dirname);

var Wechat = $models.wechat;

exports.list = function (req, res, next) {
  console.log(req.method + ' /wechats => list, query: ' + JSON.stringify(req.query));
  
  Wechat.getAll(function(err, wechats){
    console.log(wechats);
    res.render('wechats/index', {
      wechats : wechats
    })
  });
};

exports.new = function (req, res, next) {
  console.log(req.method + ' /wechats/new => new, query: ' + JSON.stringify(req.query));
  
  res.render('wechats/new', {
    wechat : {
      "_action" : "new"
    }
  })
};

exports.show = function (req, res, next) {
  console.log(req.method + ' /wechats/:id => show, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params));
  var id = req.params.id;
  
  Wechat.getById(id, function(err, wechat) {
    console.log(wechat);
    res.render('wechats/show', {
      wechat : wechat
    })
  });
};

exports.edit = function (req, res, next) {
  console.log(req.method + ' /wechats/:id/edit => edit, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params));
    
  var id = req.params.id; 
  
  Wechat.getById(id, function (err, wechat) {
    console.log(wechat);
    wechat._action = 'edit';
    
    res.render('wechats/edit', {
      wechat : wechat
    })
  });
};

exports.create = function (req, res, next) {
  console.log(req.method + ' /wechats => create, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
  
  Wechat.create({openid: req.body.openid,nickname: req.body.nickname,sex: req.body.sex,language: req.body.language,city: req.body.city,province: req.body.province,country: req.body.country,headimgurl: req.body.headimgurl,privilege: req.body.privilege,created_at: req.body.created_at}, function (err, wechat) {
    console.log(wechat);
    res.render('wechats/show', {
      wechat : wechat
    })
  });
};

exports.update = function (req, res, next) {
  console.log(req.method + ' /wechats/:id => update, query: ' + JSON.stringify(req.query) + 
    ', params: ' + JSON.stringify(req.params) + ', body: ' + JSON.stringify(req.body));
    
  var id = req.params.id; 

  Wechat.updateById(id,{openid: req.body.openid,nickname: req.body.nickname,sex: req.body.sex,language: req.body.language,city: req.body.city,province: req.body.province,country: req.body.country,headimgurl: req.body.headimgurl,privilege: req.body.privilege,created_at: req.body.created_at}, function (err, wechat) {
    console.log(wechat);
  
    res.json({
      data: {
        redirect : '/wechats/' + id
      },
      status: {
        code : 0,
        msg  : 'delete success!'
      }
    });
  });
};

exports.destroy = function (req, res, next) {
  var id = req.params.id;
  Wechat.deleteById(id, function (err) {
    if (err) {
      throw new Error(err);
    }
    
    res.json({
      data: {},
      status: {
        code : 0,
        msg  : 'delete success!'
      }
    });
  });
};

// -- custom 

exports.getsignature = function (req, res) {
  var url = req.body.url;
  var re = /\/$/;

  if(!re.test(url)) {
      url = url + '/'
  }
  console.log('\033[32m'+url+'\033[39m');

  signature.getSignature(req.wx_config)(url, function (error, result) {
    console.log(result);
    if (error) {
      res.api_error(error);
    } else {
      res.api(result);
    }
  });
}


// -- custom api

exports.api = {
  list: function (req, res, next) {
    var user_id = req.api_user._id;
    
    Wechat.query({}, function (err, wechats) {
      if (err) {
        return res.api_error(err);
      }
      
      res.api({
        wechats : wechats
      })
    });
  },
  show: function (req, res, next) {
    var user_id = req.api_user._id;
    var id = req.params.wechat_id;
    
    Wechat.getById(id, function (err, wechat) {
      if (err) {
        return res.api_error(err);
      }
      
      res.api({
        wechat : wechat
      });
    }); 
  },
  create: function (req, res, next) {
    var user_id = req.api_user._id;
  
    Wechat.create({openid: req.body.openid,nickname: req.body.nickname,sex: req.body.sex,language: req.body.language,city: req.body.city,province: req.body.province,country: req.body.country,headimgurl: req.body.headimgurl,privilege: req.body.privilege,created_at: req.body.created_at}, function (err, wechat) {
      if (err) {
        return res.api_error(err);
      }
      
      res.json({
        wechat : wechat
      })
    });
  },
  update: function (req, res, next) {
    var user_id = req.api_user._id;
    var id = req.params.wechat_id; 
    Wechat.updateById(id, {openid: req.body.openid,nickname: req.body.nickname,sex: req.body.sex,language: req.body.language,city: req.body.city,province: req.body.province,country: req.body.country,headimgurl: req.body.headimgurl,privilege: req.body.privilege,created_at: req.body.created_at}, function (err, wechat) {
      if (err) {
        return res.api_error(err);
      }
  
      res.api({
        wechat : wechat,
        redirect : '/wechats/' + id
      })
    });
  },
  delete: function (req, res, next) {
    var user_id = req.api_user._id;
    var id = req.params.wechat_id; 
    
    Wechat.deleteById(id, function (err) {
      if (err) {
        return res.api_error(err);
      }
    
      res.api({id: id})
    });
  }
}
