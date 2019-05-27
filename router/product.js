const express=require("express");
const pool=require("../pool.js");
var router=express.Router();


// 获取主页banner轮播图
router.get("/banner_list",(req,res)=>{
	var sql="SELECT pid,pfirst_img FROM mobile_products WHERE pkey='index_banner'"
	pool.query(sql,(err,result)=>{
	if(err)throw err;
	if(result.length>0){
		res.send(result);
	}
	})
});
// 省内推荐接口
router.get("/preference_list",(req,res)=>{
	var sql="SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products WHERE pkey='henan'"
	pool.query(sql,(err,result)=>{
	if(err)throw err;
	if(result.length>0){
		res.send(result);
	}
	})
});
// 旅游精选接口
router.get("/concentration_list",(req,res)=>{
	var sql="SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products WHERE pkey='index_concentration'"
	pool.query(sql,(err,result)=>{
	if(err)throw err;
		if(result.length>0){
			res.send(result);
		}
	})
});
// 导游推荐接口
router.get("/recommend_list",(req,res)=>{
	var sql="SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products WHERE pkey='index_recommend'"
	pool.query(sql,(err,result)=>{
	if(err)throw err;
	if(result.length>0){
		res.send(result);
	}
	})
});
// 详情页接口
router.get("/detail",(req,res)=>{
	var pid=req.query.pid;
	var sql="SELECT pid,pimg,pname,price,pticket,pgrade,precommend,pfeature,pdetails_img,pcity FROM mobile_products WHERE pid=?";
	pool.query(sql,[pid],(err,result)=>{
		if (err) {throw err};
		if (result.length>0) {
			res.send(result);
		}
	})
});
// 搜索查找功能
router.get("/searchKey",(req,res)=>{
	var key=req.query.searchKey;	 
	var sql="SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products WHERE pname";
	sql+=" LIKE concat('%',?,'%')";
	pool.query(sql,[key],(err,result)=>{
		if (err) {throw err};
		res.send(result);
	});
})
// 分类页面功能
router.get("/classify_all",(req,res)=>{ 
	var pno = req.query.pno;
	var pageSize = req.query.pageSize;
	if(!pno){
		pno = 1;
	}
	if(!pageSize){
		pageSize = 10;
	}
	var obj = {code:1};
	var progress = 0;
	var offset = (pno-1)*pageSize; 
	var ps = parseInt(pageSize);
	var id=req.query.id;
	var sql="SELECT pid,pfirst_img,pname,price,pticket FROM mobile_products"
	if (id==0) {
		sql+=" LIMIT ?,?";
	}else if(id==1){
		sql+=" WHERE pkey NOT IN ('guowai') LIMIT ?,?";
	}else if(id==2){
		sql+=" WHERE pkey='guowai' LIMIT ?,?";
	}
	
	pool.query(sql,[offset,ps],(err,result)=>{
		if(err)throw err;
		progress+=50;
		obj.data = result;
		if(progress==100){
			res.send(obj);
		}
	});

	var sql="SELECT count(pid) AS c FROM mobile_products"
	if (id==0) {
		 sql+="";
	}else if(id==1){
		sql+=" WHERE pkey NOT IN ('guowai')";
	}else if(id==2){
		sql+=" WHERE pkey='guowai'";
	}
	pool.query(sql,(err,result)=>{
		if(err)throw err;
		progress+=50;
		var pc = Math.ceil(result[0].c/pageSize);
		obj.pageCount = pc;
		if(progress==100){
			res.send(obj)
		}
	});
})
// 查询相册
router.get("/get_photo",(req,res)=>{
	var pid=req.query.pid;
	var sql="SELECT pid,pimg FROM mobile_products WHERE pid=?"
	pool.query(sql,[pid],(err,result)=>{
		if (err) {throw err};
		if (result.length>0) {
			res.send(result);
		}
	})
})



module.exports=router;