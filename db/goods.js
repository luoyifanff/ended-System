
var mongoose = require('mongoose');//建立映射。映射的是数据库中的一个集合

var Schema = mongoose.Schema;//建立一个概要，指明有哪些域


var obj = {
	user:String,
	goodsname:String,
	describe:String,
	price:String,
	imgpath:String
}

var model = mongoose.model('goodinfo',new Schema(obj)); //数据库将会自动创建一个goodinfos的集合，模型映射该集合。 


module.exports = model;


