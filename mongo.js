let mongo = require("mongoose");
//连接
//连接前要启动数据库：
//mongod --dbpath=C:xxx
mongo.connect("mongodb://127.0.0.1/shop",{useNewUrlParser:true})
//连接状态
mongo.connection.on("connected",err=>{
	console.log("数据库连接成功")
})

//创建一个用户表
let userHead = mongo.Schema({
	tel:Number,
	pwd:String
})
let user = mongo.model("user",userHead)

//创建一个分类表
let cateHead = mongo.Schema({
	id:Number,
	name:String,
	pic:String
})
let category = mongo.model("category",cateHead)

let arr = ["苹果","三星","小米","华为","魅族","vivo","oppo","onePlus","诺基亚"]
let pics = [
	"img/ap.jpg",
	"img/s1.jpg",
	"img/m3.jpg",
	"img/h3.jpg",
	"img/m1.jpg",
	"img/m2.jpg",
	"img/h1.jpg",
	"img/h2.jpg",
	"img/s2.jpg",
	"img/s3.jpg"
]
for(let i=0;i<9;i++){
	var oneRow = new category({
		id:i+1,
		name:arr[i],
		pic:pics[i]
	})
	oneRow.save()
}

let goodsHead = mongo.Schema({
	pic:String,
	title:String,
	price:Number,
	isPay:Number,
	comments:String,
	oldPrice:Number,
	color:Array,
	version:Array,
	storing:Number,
	type:Number
})
let goods = mongo.model("goods",goodsHead)
//
for(let i=0;i<50;i++){
	let ran = ()=>Math.round(Math.random()*8);
	let one = ran()
	let title = arr[one]
	var oneRow = new goods({
		pic:pics[ran()],
		title:title+ran(),
		price:Math.round(Math.random()*9000+5000),
		isPay:Math.round(Math.random()*5000+100),
		comments:Math.round(Math.random()*6000+1200),
		oldPrice:Math.round(Math.random()*12000+8000),
		color:["白色","黑色","金色"],
		version:["16G国行","128G美版","32G港版"],
		storing:Math.round(Math.random()*500+100),
		type:one+1
	})
	oneRow.save()
}

//创建一个order表
let orderHead = mongo.Schema({
	type:Number,
	pic:String,
	title:String,
	count:Number,
	color:String,
	version:String,
	price:Number,
	user:String
})
let order = mongo.model("order",orderHead)
//导出表对象
module.exports = {user,category,goods,order}