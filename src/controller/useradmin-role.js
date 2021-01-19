//系统管理

layui.define(['table', 'form', 'commonReq', 'tree', 'util'], function(exports) {


	//角色管理
	
	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		form = layui.form;
		commonReq = layui.commonReq
		view = layui.view,
		table = layui.table;
	// console.log(commonReq);
      
    var height= 'full';
	var elem = '#LAY-user-back-role2';
	var uri = '/sysuser/sys_role/getRoleByPage';
	var cols = [
		[{
				type: 'checkbox',
				fixed: 'left'
			},
			{
				field: 'zizeng',
				width: 80,
				title: '序号',
				fixed: 'left',
				templet: '#zizeng',
			}, {
				field: 'roleId',
				title: 'ID',
				sort: true
			}, {
				field: 'roleName',
				title: '角色名',
			}, {
				field: 'description',
				title: '备注',
			}, {
				field: 'createUser',
				title: '创建人',
			}, {
				field: 'createTime',
				title: '创建时间',
				sort: true,
				templet: function(row) {
					var dateee = new Date(row.createTime).toJSON();
					return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
				}
			}, {
				title: '操作',
				width: 150,
				align: 'center',
				fixed: 'right',
				toolbar: '#table-useradmin-role'
			}
		]

	]

	var done = function(res, curr, count) {
		//如果是异步请求数据方式，res即为你接口返回的信息。
		//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
		// console.log(res);
		//得到当前页码
		// console.log(curr);
		//得到数据总量
		// console.log(count);
	}
	commonReq.tableInit(elem, uri, cols, done,height);
	//监听工具条
	table.on('tool(LAY-user-back-role2)', function(obj) {
		console.log(obj);
		var params = obj.data;


		if (obj.event === 'del') {
			layer.confirm('确定删除此角色？', function(index) {
				let param = [];
				param.push(params.roleId);
				var uri = '/sysuser/sys_role/delete';
				var data = param;
				var data = JSON.stringify(param);
				var method = 'post';
				commonReq.adminReq(uri, data, method, done);
				layui.table.reload('LAY-user-back-role2'); //重载表格
				layer.close(index);

			});
		} else if (obj.event === 'edit') {

			admin.popup({
				title: '编辑',
				area: ['490px', '440px'],
				id: 'LAY-popup-user-addrole',
				success: function(layero, index) {
					view(this.id).render('user/administrators/roleform', params).done(function() {
						// form.render(null, 'layuiadmin-form-admin');
						form.render(null, 'layadmin-useradmin-formlist');
						//监听提交
						form.on('submit(LAY-user-back-submit)', function(params) {
							var field = params.field; //获取提交的字段
							console.log(params);
							console.log(field);
							var data = JSON.stringify(field);
							var uri = '/sysuser/sys_role/save';

							var method = 'post';
							var done = function(res) {
								if (res.status == 200) {
									layer.closeAll('loading');
									layer.load(2);
									layer.msg("修改成功", {
										icon: 6
									});
									setTimeout(function() {
										layer.closeAll(); //关闭所有的弹出层
										table.reload("Users");
									}, 1000);

								} else {
									layer.msg("修改失败", {
										icon: 5
									});
								}
								layui.table.reload('LAY-user-back-role2'); //重载表格
							}
							commonReq.adminReq(uri, data, method, done);

							// layui.table.reload('LAY-user-back-role2'); //重载表格
							layer.close(index); //执行关闭 
						});
					});
				}
			});


		}
	});
	var tree = layui.tree,
		layer = layui.layer,
		util = layui.util;
	var uri = '/sysuser/sys_permission/findMenuTree';
	var method = 'post';
	var done1 = function(res) {
		var datas = res.data;
		var menu = new Array(datas.length);;
		if (datas != null) {
			for (var i = 0; i < datas.length; i++) {
				var obj = {
					title: datas[i].permissionName,
			
					id: datas[i].permissionId,
					children: []
				}
				menu[i] = obj;
				if (datas[i].children != null) {
					var em = datas[i].children;
					for (var j = 0; j < em.length; j++) {
						var obj2 = {
							title: em[j].permissionName,
							id: em[j].permissionId,
							children: []
						}
						menu[i].children[j] = obj2;
						if (em[j].children != null) {
							var sm = em[j].children;
							for (var n = 0; n < sm.length; n++) {
								var obj3 = {
									title: sm[n].permissionName,
									id: sm[n].permissionId,
								}
								menu[i].children[j].children[n] = obj3;
							}
						}
					}
				}
		
			}
		}	
			
		var data = menu;
		//基本演示
		tree.render({
			elem: '#test-tree-demo1',
			data: data,
			showCheckbox: true //是否显示复选框
				,
			id: 'test-tree-demoId1',
			isJump: true //是否允许点击节点时弹出新窗口跳转
				,
			showLine: false //是否开启连接线
				,
			click: function(obj) {
				var data = obj.data; //获取当前点击的节点数据
				// layer.msg('状态：' + obj.state + '<br>节点数据：' + JSON.stringify(data));
			}
		});
	}
	
	
	
	var donef = function(objp,tree){
		var uri2 = "/sysuser/sys_role/findRoleMenus";
		var params2 = {
			roleId : objp.data.roleId
		};
		console.log(params2);
		var method2 = "post";
		var done2 = function(res){
			var params = res.data;
			var ids = [];
			if(params != null){
				for(var i = 0; i < params.length; i++){
					var id = params[i].permissionId;
					ids.push(id);
					tree.setChecked('test-tree-demoId1', ids); //勾选指定节点
				}
			}
		}
		params2 = JSON.stringify(params2);
		commonReq.adminReq(uri2, params2, method2, done2);
	}
	
	
	commonReq.adminReq(uri, null, method, done1);
	
	table.on('row(LAY-user-back-role2)', function(objp) {
		var done = function(res) {
			done1(res);
			donef(objp,tree);
		}
		commonReq.adminReq(uri, null, method, done);
	});

	exports('useradmin-role', {})
});