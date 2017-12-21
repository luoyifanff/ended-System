var express = require('express');
var router = express.Router();
var user = require('../db/user');
router.get('/',function(req,res){
	res.render('login',{tip:'',judge:{
		isShowlog:false,
		isShowout:false,
		isShowreg:true
	}});
	
})

router.post('/',function(req,res){
	
		user.find({
			email:req.body.username,
			password:req.body.psw
		}).then(function(data){
			if(data.length==0){  //没找到这条记录
				if(req.body.username==''||req.body.psw==''){
					res.render('login',{tip:'请输入邮箱和密码',judge:{
						isShowlog:false,
						isShowout:false,
						isShowreg:false
					}})
				}else{
					res.render('login',{tip:'邮箱或密码错误',judge:{
						isShowlog:false,
						isShowout:false,
						isShowreg:true
					}});
				}		
			}else{ //匹配成功则设置cookie
				req.session.uid = data[0];
				res.redirect('/');	
			}
		})
	
})

module.exports = router;