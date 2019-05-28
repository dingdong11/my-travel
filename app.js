// 引入第三方模块
//  mysql/express/
const express = require("express");
const bodyParser=require("body-parser");
const session =require("express-session");
const userRouter=require("./router/user.js");
const productRouter=require("./router/product.js");
//2.1:引入跨域模块
const cors = require("cors");
//2.2:配置允许列表
//3创建连接池
const pool=require("./pool.js");
//4:创建express对象
var server = express(); 
//4.1,配置session
server.use(session({
  secret:"128位字符串",//配置秘钥
  resave:false,//每次请求是否更新数据
  saveUninitialized:true//保存初始化数据
}))
//4.1:配置允许列表3000 允许
server.use(cors({
   origin:["http://127.0.0.1:8080",
   "http://localhost:8080"],
   credentials:true 
}))
//5:绑定监听端口 3000
server.listen(5050);
// 5.1 指定一个静态的目录
server.use(express.static("public"));
server.use(bodyParser.urlencoded({
  extended:false
}));
//6:请求banner图片
server.use("/user",userRouter);
server.use("/product",productRouter);