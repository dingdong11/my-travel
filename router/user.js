const express=require("express");
const pool=require("../pool.js");
var router=express.Router();
// var session;

// 功能一: 注册
router.get("/reg",(req,res)=>{
	var uname = req.query.uname;
	var upwd = req.query.upwd;
	var sql="SELECT uname FROM mobile_users WHERE uname=?"
	pool.query(sql,[uname],(err,result)=>{
		if (err) throw err;
		if (result.length>0) {
			res.send({code:0,msg:"该号码已被注册"});
		} else if(result.length==0){
			var sql1="INSERT INTO mobile_users SET uname=?,upwd=md5(?)";
			pool.query(sql1,[uname,upwd],(err,result)=>{
				if (err) throw err;
				if(result.affectedRows>0){
					res.send({code:1,msg:"注册成功"})
				}else{
					res.send({code:-1,msg:"注册失败"})
				}
			})
		}
	})
})
// 功能二: 登录
router.get("/login",(req,res)=>{
	var uname = req.query.uname;
	var upwd = req.query.upwd;
	sql="SELECT uid,uname,upwd FROM mobile_users";
	sql+=" WHERE uname=? AND upwd=md5(?)";
	pool.query(sql,[uname,upwd],(err,result)=>{
		if(err)throw err;
		if(result.length==0){
			res.send({code:-1,msg:"用户名或密码有误"});
		}else{
			var uid =result[0].uid;
			var uname =result[0].uname;
			req.session.uid = uid;
			req.session.uname = uname;
			res.send({code:1,msg:"登录成功"})
		}
	})
});
// 功能三: 获取用户信息
router.get("/getInfo",(req,res)=>{
	var uid=req.session.uid;
	var uname=req.session.uname;
	res.send(uname);
});
// 功能四: 退出登录
router.get("/getUname",(req,res)=>{
	req.session.uname="";
	var uname=req.session.uname;
	res.send(uname);
})
// 通用功能: 判断是否有req.session.uname
router.get("/hasUname",(req,res)=>{
	var uname=req.session.uname;
	if (!uname) {
		res.send({code:-1,msg:"请先登录"})
	}else{
		res.send(uname);
	}
})
// 功能五: 添加我的收藏
router.get("/add_collect",(req,res)=>{
	var uname=req.query.uname;
	var tid=req.query.tid;
	var sql="SELECT id FROM mobile_mycollect WHERE pid=? AND uname=?";
	pool.query(sql,[tid,uname],(err,result)=>{
		if(err) {throw err};
		if(result.length>0) {
			res.send({code:0,msg:"您已经收藏过此商品"})
		}else if(result.length==0){
			var sql1="INSERT INTO mobile_mycollect (pid,uname) VALUES (?,?)"
			pool.query(sql1,[tid,uname],(err,result)=>{
				if (err) {throw err}
				if (result.affectedRows>0) {
					res.send({code:1,msg:"收藏成功"});
				}
			})
		}
	})
})
// 功能六: 删除我的收藏
router.get("/del_collect",(req,res)=>{
	var tid=req.query.tid;
	var uname=req.session.uname;
	var sql="DELETE FROM mobile_mycollect WHERE pid=? AND uname=?";
	pool.query(sql,[tid,uname],(err,result)=>{
		if (err) {throw err}
		if (result.affectedRows>0) {
			res.send({code:1,msg:"已取消收藏"});
		}
	})
})
// 功能七: 显示收藏列表
router.get("/get_collect",(req,res)=>{
	var uname=req.session.uname
	sql="SELECT pid FROM mobile_mycollect WHERE uname=?";
	pool.query(sql,[uname],(err,result)=>{
		if (err) throw err;
		if (result.length>0) {
			var str="";
			for(var i=0;i<result.length;i++){
				str+=result[i].pid+",";
			};
			str=str.slice(0,-1);
			var sql1=`SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products WHERE pid in (${str})`;
			pool.query(sql1,(err,result)=>{
				if (err) throw err;
				if (true) {}
				res.send(result);
			});
		}
	})
})

// 功能八: 添加订单
router.get("/add_order",(req,res)=>{
	var uname=req.query.uname;
	var tid=req.query.tid;
	var sql="SELECT id FROM mobile_order WHERE pid=? AND uname=?";
	pool.query(sql,[tid,uname],(err,result)=>{
		if(err) {throw err};
		if(result.length>0) {
			res.send({code:0,msg:"您已经预订过此商品"})
		}else if(result.length==0){
			var sql1="INSERT INTO mobile_order (pid,uname,ispay) VALUES (?,?,?)"
			pool.query(sql1,[tid,uname,0],(err,result)=>{
				if (err) {throw err}
				if (result.affectedRows>0) {
					res.send({code:1,msg:"预订成功"});
				}
			})
		}
	})
})
// 功能八: 显示订单列表
router.get("/get_order",(req,res)=>{
	var ispay=req.query.id;
	var uname=req.session.uname;
	sql="SELECT pid FROM mobile_order WHERE uname=? AND ispay=?";
	pool.query(sql,[uname,ispay],(err,result)=>{
		if (err) throw err;
		if (result.length>0) {
			var str="";
			for(var i=0;i<result.length;i++){
				str+=result[i].pid+",";
			};
			str=str.slice(0,-1);
			var sql1=`SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products WHERE pid in (${str})`;
			pool.query(sql1,(err,result)=>{
				if (err) throw err;
				if (true) {}
				res.send(result);
			});
		}else{
			res.send({code:0,msg:"没有未支付订单"})
		}
	})
})
// 功能九: 支付订单
router.get("/change_order",(req,res)=>{
	var tid=req.query.tid;
	var uname=req.session.uname;
	var sql="UPDATE mobile_order SET ispay=1 WHERE pid=? AND uname=?";
	pool.query(sql,[tid,uname],(err,result)=>{
		if (err) {throw err}
		if (result.affectedRows>0) {
			res.send({code:1,msg:"支付成功"});
		}
	})
})
// 功能十: 提交我的反馈
router.get("/submit_help",(req,res)=>{
	var uname=req.session.uname;
	var phone=req.query.phone;
	var content=req.query.content;
	var sql="INSERT INTO mobile_help (content,phone,uname) VALUES (?,?,?)";
	pool.query(sql,[content,phone,uname],(err,result)=>{
		if (err) {throw err};
		if (result.affectedRows>0) {
			res.send({code:1,msg:"提交成功,谢谢您的反馈"})
		}
	})
})


module.exports=router;