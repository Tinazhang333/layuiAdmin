{
  "status": 200
  ,"message": ""
  ,"data": [{
	  
    "title": "系统管理"
    ,"icon": "layui-icon-home"
    ,"list": [{
      "title": "用户管理"
      ,"jump": "/"
    }, {
      "name": "school"
      ,"title": "学校管理"
      ,"jump": "system/school"
    }, {
      "name": "role"
      ,"title": "角色管理"
      ,"jump": "system/role"
    }, {
      "name": "menu-g"
      ,"title": "菜单管理"
      ,"jump": "system/menu-g"
    }]
  }, {
	  
	  
    "name": "app-user"
    ,"title": "app用户"
    ,"icon": "layui-icon-username"
    ,"list": [
	{
      "name": "usermanage"
      ,"title": "用户管理"
    }, 
	{
      "name": "anim"
      ,"title": "用户反馈"
    }, {
      "name": "form"
      ,"title": "用户办卡"
      ,"list": [{
        "name": "group"
        ,"title": "办卡用户"
      }]
    }, {
      "name": "timeline"
      ,"title": "异常日志"
    }
	
	]
  }, {
	  
	  
    "name": "template"
    ,"title": "app设置"
    ,"icon": "layui-icon-template"
    ,"list": [{
      "name": "demo2"
      ,"title": "办卡活动"
      ,"jump": "template/demo2"
    },{
      "name": "addresslist"
      ,"title": "弹框广告"
      ,"jump": "template/addresslist"
    },{
      "name": "caller"
      ,"title": "客服问题"
      ,"jump": "template/caller"
    },{
      "name": "goodslist"
      ,"title": "上网管理"
      ,"jump": "template/goodslist"
    },{
        "name": ""
        ,"title": "百度一下"
        ,"jump": "/iframe/link/baidu"
      }]
  }, {
	  
	  
    "name": "app"
    ,"title": "校麦网维"
    ,"icon": "layui-icon-app"
    ,"list": [{
      "name": "content"
      ,"title": "校区管理"
      ,"list": [{
        "name": "comment"
        ,"title": "A学校"
      },{
        "name": "comment1"
        ,"title": "B学校"
      },{
        "name": "comment2"
        ,"title": "C学校"
      }]
    },{
		
      "name": "forum"
      ,"title": "设备管理"
      ,"list": [{
        "name": "list"
        ,"title": "帖子列表"
      },{
        "name": "replys"
        ,"title": "回帖列表"
      }]
    },{
      "name": "message"
      ,"title": " 客服管理"
    },{
      "name": "workorder"
      ,"title": "工单系统"
      ,"jump": "app/workorder/list"
    }]
  }, {
	  
	  
    "name": "senior"
    ,"title": "助手管理"
    ,"icon": "layui-icon-senior"
    ,"list": [{
      "name": "im"
      ,"title": "凌云用户"
    }]
  }, {
	  
	  
    "name": "user"
    ,"title": "回单管理"
    ,"icon": "layui-icon-circle"
    ,"list": [{
      "name": "user"
      ,"title": "回单日志"
      ,"jump": "user/user/list"
    }, {
      "name": "administrators-list"
      ,"title": "回单用户"
      ,"jump": "user/administrators/list"
    }, {
      "name": "administrators-rule"
      ,"title": "回单统计"
      ,"jump": "user/administrators/role"
    }]
  }, {
	  
	  
    "name": "set"
    ,"title": "用户统计"
    ,"icon": "layui-icon-user"
    ,"list": [{
      "name": "system"
      ,"title": "系统设置"
      ,"spread": true
      ,"list": [{
        "name": "website"
        ,"title": "网站设置"
      },{
        "name": "email"
        ,"title": "邮件服务"
      }]
    },{
      "name": "user"
      ,"title": "我的设置"
      ,"spread": true
      ,"list": [{
        "name": "info"
        ,"title": "基本资料"
      },{
        "name": "password"
        ,"title": "修改密码"
      }]
    }]
  }]
}