var express = require('express');
var router = express.Router();
var goods = require('../db/goods');
var multer  = require('multer');
var path = require('path');
var fs = require('fs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage });


router.get('/',function(req,res){
	
	if(req.session.uid){      //当用户登录后才能查看商品详情
		goods.find({
			_id: req.query.id      //通过地址栏的get发送的id来查表
		}).then(function(data) {
			res.render('detail', {
				goodname: data[0].goodsname,
				describe:data[0].describe,
				price: data[0].price,
				imgpath: data[0].imgpath,
				id:data[0]._id,
				currentUser:req.session.uid.email,
				judge:{
					isShowlog:true,
					isShowout:true,
					isShowreg:false
				}
			});		
		}).catch(function(){     //通过主键查找如果找不到这条文档，就需要promise的错误判断，而不会返回空数组
			res.redirect('/error');  
		})
	}else{
		res.redirect('/login');  //若非法访问则跳转到登录
	}
})

router.get('/update', function(req, res) { //更新商品套用新增商品的模板，跳转后的更新页面保留原数据
	goods.find({
		_id: req.query.id
	}).then(function(data) {
		res.render('goods', {
			title:'更新商品',	
			judge: {
				isShowlog: true,
				isShowout: true,
				isShowreg: false
			},
			isCreate: false,
			goodname: data[0].goodsname,
			describe: data[0].describe,
			price: data[0].price,
			gid: data[0]._id,
			currentUser: req.session.uid.email
		});
	})
})


router.get('/delete',function(req,res){ 
	goods.findByIdAndRemove(req.query.id).then(function(){		
			var id = path.join(__dirname,'/../public',req.query.path);  //也要删除服务器上的图片
			fs.unlink(id); 
			res.redirect('/')
	})
})



module.exports = router;