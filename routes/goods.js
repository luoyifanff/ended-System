var express = require('express');
var router = express.Router();
var goods = require('../db/goods');
var multer  = require('multer');
var fs = require('fs');
var path = require('path');
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
	if(req.session.uid){
		res.render('goods', {     //渲染新建商品页面
			title: '新建商品',
			isCreate: true,
			judge: {
				isShowlog: true,
				isShowout: true,
				isShowreg: false
			},
			emp:false,
			currentUser: req.session.uid.email
		})
	}else{
		res.redirect('/login');
	}

})


router.post('/',upload.single('addimg'), function(req,res){

	for(var i in req.body){
	
		if(!req.body[i] || !req.file){   //新建商品的时候不能有空
			res.render('goods', {     //渲染新建商品页面
			title: '新建商品',
			isCreate: true,
			judge: {
				isShowlog: true,
				isShowout: true,
				isShowreg: false
			},
			emp:true,
			currentUser: req.session.uid.email
		}) 
			return ;		
		}
	}
	
		goods.create({ //新增商品
			user:req.session.uid.email, //该商品属于哪位用户
			goodsname:req.body.goodname,
			describe:req.body.describe,
			price:req.body.price,
	//		imgpath:path.`${path.join(__dirname,'../public/images')}
	//					  ${req.file.filename}`
			imgpath:`/images/${req.file.filename}` 
		}).then(function(){ 
			res.redirect('/');
		})
	
	
})



router.get('/update',function(req,res){ //更新商品套用新增商品的模板，跳转后的更新页面渲染原信息
	goods.find({
		_id:req.query.id
	}).then(function(data){		
		res.render('goods',{
			title:'更新商品',
			judge:{
					isShowlog:true,
					isShowout:true,
					isShowreg:false
			},
			isCreate:false,
			goodname:data[0].goodsname,
			describe:data[0].describe,
			price:data[0].price,
			gid:data[0]._id,
			emp:false,
			currentUser:req.session.uid.email
		});
	})
})

router.post('/update',upload.single('addimg'),function(req,res){  //更新界面点击更新后根据post方式提交的表单信息进行更新	
	goods.find({
		_id:req.body.hidden
	}).then(function(data){
		for(var i in req.body) {		
			if(!req.body[i]) { //如果有空的
				res.render('goods', {
					title: '更新商品',
					isCreate: false,
					judge: {
						isShowlog: true,
						isShowout: true,
						isShowreg: false
					},
					goodname:'',
					describe:'',
					price:'',
					gid:data[0]._id,
					emp:true,
					currentUser: req.session.uid.email
				})
				return; //结束回调不向下执行
			}
		}

		
		goods.findByIdAndUpdate(data[0]._id, {
			$set: {
				goodsname: req.body.goodname,
				describe:req.body.describe,
				price: req.body.price,
				imgpath: req.file ? `/images/${req.file.filename}` : data[0].imgpath   //如果没改图片就用原来的
			}			
		}).then(function(result) {
			
		//	console.log(result)  //result存的是数据库中文档被修改前的数据
			
			if(req.file){
				if(result.imgpath){
					fs.unlink('./public/'+result.imgpath);  //如果更新图片，删除上一张图片
				}
			}
			res.redirect(`/goods/detail?id=${req.body.hidden}`)
		})
	})
	
})

router.get('/delete',function(req,res){      //删除商品
	goods.findByIdAndRemove(req.query.id).then(function(){
		var id = path.join(__dirname,'/../public',req.query.path);  //也要删除服务器上的图片
		fs.unlink(id); 
		res.redirect('/')
	})
})
module.exports = router;