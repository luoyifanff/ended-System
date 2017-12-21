var express = require('express');
var router = express.Router();
var user = require('../db/user');
router.get('/',function(req,res){
	res.render('register',{tip:'',judge:{
		isShowlog:false,
		isShowout:false,
		isShowreg:false
	}});
	
})

router.post('/',function(req,res){
	var regname = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	if(regname.test(req.body.username)){ //判断用户名是否合理
		var regpsw = /.{6,}/;
		console.log(req.body.psw)
		if(regpsw.test(req.body.psw)){//判断密码是否合理
			check(req,res);
		}else{
			res.render('register', {
				tip: '密码不合理',
				judge: {
					isShowlog: false,
					isShowout: false,
					isShowreg: false
				}
			})
		}
	} else if(req.body.username == '' || req.body.psw == '') {
		res.render('register', {
			tip: '用户名或密码不能为空',
			judge: {
				isShowlog: false,
				isShowout: false,
				isShowreg: false
			}
		})
	} else {
		res.render('register', {
			tip: '用户名不合理',
			judge: {
				isShowlog: false,
				isShowout: false,
				isShowreg: false
			}
		})
	}

})


function check(req,res){
	user.find({
		email:req.body.username  //以该组键值对查询记录
	}).then(function(data){			
		if(data.length==0){  //[] 插入一条文档
			if(req.body.username==''||req.body.psw==''){
				res.render('register',{tip:'用户名或密码不能为空',judge:{
					isShowlog:false,
					isShowout:false,
					isShowreg:false
				}})
			}else{		
				//res.render('register',{tip:''});
				return user.create({
						email: req.body.username,
						password: req.body.psw
					})
			}		
		}else{   //非空，提示已存在
			res.render('register',{tip:'用户名已存在',judge:{
				isShowlog:false,
				isShowout:false,
				isShowreg:false
			}});	
		}
	}).then(function(){
		res.redirect('/login');
	})
}
module.exports = router;
