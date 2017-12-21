var express = require('express');
var router = express.Router();
var goods = require('../db/goods');
/* GET home page. */
router.get('/', function(req, res) {
	if(req.session.uid){ //如果session中有这个uid证明登录成功了	
		var skip = req.query.skip;
		var page = req.query.page;
		Promise.all([
				goods.find(   //每个用户只能看到自己用户名下的商品.limit限制个数.skip限制跳过集合中几个后开始查询
					{user:req.session.uid.email},{},{limit:5,skip:skip?skip:0}
				),
				goods.count({user:req.session.uid.email}) //count()方法统计该集合下商品总数
			]).then(function(data){
				res.render('index', {
					title: '首页',
					currentUser: req.session.uid.email,
					goodslist: data[0],
					total: data[1],
					page :page,
					judge: {
						isShowlog: true,
						isShowout: true,
						isShowreg: false
					}
				})
			})
		
		
	}else{
		res.redirect('/login');
	}		
});

//注销  ，销毁session在服务器上的内存
router.get('/out',function(req,res){
	req.session.destroy(function(){
		res.redirect('/login');
	})
})

module.exports = router;
