let Koa = require("koa");
let {user,category,goods,order} = require("./mongo.js")
let server = new Koa();
server.listen(3000,err=>{
	console.log("服务器启动成功3000")
})
//1.我们现在前端分离，前后端的地址端口
//不一样，就需要跨域访问
//使用koa2-cors的中间件来解决跨域
let cors = require("koa2-cors")
server.use(cors())

//2.处理静态资源
let Static = require("koa-static");
server.use(Static("./src"))

//3.处理post请求数据
let body = require("koa-body")
server.use(body())
//ctx.request.body 数据在这

//4.创建路由
//每一个独立的http请求都有一个独立的
//接口接收
let Router = require("koa-router");
//创建一个路由对象
let router = new Router();
//把路由挂在use上
server.use(router.routes())
//安心的写接口
router.post("/user",async (ctx,next)=>{
	//console.log(ctx.request.body)
	let oneRow = new user(ctx.request.body)
	let res = await oneRow.save();
	if(res){
		ctx.body ="注册成功"
	}else{
		ctx.body ="注册失败"
	}
	
})

router.post("/validate",async (ctx,next)=>{
	//ctx.request.body -> {tel:13377778888}
	let res = await user.findOne(ctx.request.body)
	if(res){
		ctx.body = "电话已被占用"
	}else{
		ctx.body = "电话可以用"
	}
})

router.post("/login",async (ctx,next)=>{
	let res = await user.findOne(ctx.request.body)
	if(res){
		ctx.body = {
			status:1,
			message:"登录成功",
			data:res.tel
		}
	}else{
		ctx.body = {
			status:0,
			message:"电话或密码错误",
			data:""
		}
	}
})


router.get("/category",async (ctx,next)=>{
	ctx.body = await category.find().sort({id:1})
})


router.get("/list",async (ctx,next)=>{
	let obj = {}
	if(ctx.query.id){
		obj.type = ctx.query.id
	}
	if(ctx.query.keyword){
		obj.title = new RegExp(ctx.query.keyword)
	}
	//console.log(obj,JSON.parse(ctx.query.sort))
	let limit = ctx.query.limit;
	let skip = ctx.query.skip;
	ctx.body = await goods.find(obj)
	ctx.body = await goods.find(obj,{color:0,oldPrice:0}).sort(JSON.parse(ctx.query.sort)).skip(limit*skip).limit(+limit)

})

router.get("/goods",async (ctx,next)=>{
	ctx.body = await goods.findOne({_id:ctx.query.id})
})


router.post("/order",async (ctx,next)=>{
	//ctx.request.body
	let oneRow = new order(ctx.request.body)
	let res = await oneRow.save();
	ctx.body = "已加入到购物车"
})

router.get("/order",async (ctx,next)=>{
	let user = ctx.query.user;
	ctx.body = await order.find({user})
})

router.delete("/order",async (ctx,next)=>{
	let _id = ctx.query.id
	let res = await order.deleteOne({_id})
	if(res.n == 1){
		ctx.body = "删除商品成功"
	}else{
		ctx.body = "删除商品失败"
	}
	
})
