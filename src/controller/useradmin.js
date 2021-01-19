//系统管理

layui.define(['table', 'form', 'commonReq'], function(exports) {
	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		commonReq = layui.commonReq
	view = layui.view,
		table = layui.table,
		form = layui.form;



	console.log(commonReq);
	var height='full-320';
	var elem = '#LAY-user-manage';
	var uri = '/sysuser/sys_user/getSysUserByPage';
	var cols = [

		[{
				type: 'checkbox',
				fixed: 'left'
			}, {
				field: 'zizeng',
				width: 80,
				title: '序号',
				fixed: 'left',
				templet: '#zizeng',
			},
			{
				field: 'userId',
				width: 100,
				title: 'ID',
				sort: true
			}, {
				field: 'userName',
				title: '用户名',
				minWidth: 100
			}, {
				field: 'schoolName',
				title: '学校'
			}, {
				field: 'roleName',
				width: 80,
				title: '角色'
			}, {
				field: 'email',
				title: '邮箱'
			}, {
				field: 'mobile',
				title: '手机'
			}, {
				field: 'status',
				title: '状态',
				align: 'center'
					,templet: statusTpl
				,
				sort: true
			},
			{
				field: 'createTime',
				title: '创建时间',
				align: 'center',
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
				toolbar: '#table-useradmin-webuser'
			}
		]

	];


	



	var done = function(res, curr, count) {
		//如果是异步请求数据方式，res即为你接口返回的信息。
		//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
		// console.log(res);
		// //得到当前页码
		// console.log(curr);
		// //得到数据总量
		// console.log(count);
	}
	commonReq.tableInit(elem, uri, cols, done,height);

	/**
	 * 开关：启用或者禁用
	 */
	layui.use(['form'], function() {
		var form = layui.form;
		form.on('switch(switchGoodsID)', function(data) {
			//开关是否开启，true或者false
			var checked = data.elem.checked;
			console.log(checked);
			
			
			//获取所需属性值
			var userId = data.elem.attributes['userId'].nodeValue;
			//TODO 此时进行ajax的服务器访问，如果返回数据正常，则进行后面代码的调用
			var uri = '/sysuser/sys_user/updateStatus';
			// params = JSON.stringify(params);
			// var method = "post";
			// commonReq.adminReq(uri, params, method, done);
			
			
			//尝试添加弹框1.
			 // layer.msg('合理搭配，展示不一样的风格', {
			 //                time: 5000, //5s后自动关闭
			 //                btn: ['确定', '取消']
			 //                ,yes: function(index){
			 //               	 	//TODO 此时进行ajax的服务器访问，如果返回数据正常，则进行后面代码的调用
			 //                    data.elem.checked = checked;
			 //                    form.render();
			 //                    layer.close(index);
			 //                    //按钮【按钮一】的回调
			 //                }
			 //                ,btn2: function(index){
			 //                    //按钮【按钮二】的回调
			 //                    data.elem.checked=!checked;
			 //                    form.render();
			 //                    layer.close(index);
			 //                    //return false; //开启该代码可禁止点击该按钮关闭
			 //                }
			 //            });
			
			
			
			var status = 0;
			if (checked) {
				status = 1;
			}
			var params = {
				"status": status,
				"id": userId,
			};
			params = JSON.stringify(params);
			var method = "post";
			console.log(params);
			commonReq.adminReq(uri, params, method, done);
			var done = function(res) {
				console.log(res);
				if (!checked) {
					data.elem.checked = checked;
				} else {
					data.elem.checked = !checked;
				}
				form.render();
			}

		});
	});


	//监听工具条
	table.on('tool(LAY-user-manage)', function(obj) {
		console.log(obj);
		var params = obj.data;
		console.log(params);
		console.log(params.createTime);
		console.log(params.userId);
		console.log(params.userName);
		console.log(params.status);

		if (obj.event === 'del') {
			if (params.userName !== "admin") {
				layer.confirm('是否确认删除', function(index) {
					layer.close(index);
					let ids = [];
					ids.push(params.userId);
					var uri = '/sysuser/sys_user/delete';
					var data = JSON.stringify(ids);
					var method = 'post';
					commonReq.adminReq(uri, data, method, done);
					layer.close(index);
					layui.table.reload('LAY-user-manage'); //重载表格

				});
			} else {
				layer.alert('没有权限，无法删除');

			}

		} else if (obj.event === 'edit') {

			if (params.userName !== "admin") {
				admin.popup({
					title: '编辑用户',
					area: ['500px', '450px'],
					id: 'LAY-popup-user-add',
					success: function(layero, index) {
						view(this.id).render('user/user/userform', params).done(function() {
							console.log(params);


							//用户编辑--角色下拉框
							var uri = '/sysuser/sys_role/findAll';
							var data = null;
							var method = "post";
							if (obj.data.userRoles == null) {
								var loadDeptSelect = function(role) {
									console.log(role);
									form.render();
									var option = "<option value=''>请选择角色</option>"; //初始化option选项
									var str = "";
									var data = role.data;
									console.log(data);
									for (i = 0; i < data.length; i++) {
										option += "<option value='" + data[i].roleId + "' ";
										option += ">" + data[i].roleName + "</option>";
										$("#typeroleBox").html(option);
									}

									form.render('select');
								}
								commonReq.adminReq(uri, data, method, loadDeptSelect);
							} else {
								var selectsroleId = obj.data.userRoles[0].roleId;
								console.log(selectsroleId);
								var loadDeptSelect = function(role) {
									console.log(role);
									form.render();
									var option = "<option value=''>请选择角色</option>"; //初始化option选项
									var str = "";
									var data = role.data;
									console.log(data);
									for (i = 0; i < data.length; i++) {
										option += "<option value='" + data[i].roleId + "' ";
										if (data[i].roleId == selectsroleId) {
											option += "selected";
										}
										option += ">" + data[i].roleName + "</option>";
										$("#typeroleBox").html(option);

										console.log(data[i].roleName);

									}
									console.log(data[i].roleId);
									form.render('select');

								}
								commonReq.adminReq(uri, data, method, loadDeptSelect);
							}


							//用户编辑--学校下拉框
							var uri = '/system/school_info/getSchoolList';
							var data = null;
							var method = "post";
							var selectschoolId = obj.data.schoolId;
							console.log(selectschoolId)
							var loadDeptSelect = function(school) {
								console.log(school);
								form.render();
								var option = "<option value=''>请选择学校</option>"; //初始化option选项
								var str = "";
								var data = school.data;
								console.log(data)
								for (i = 0; i < data.length; i++) {
									option += "<option value='" + data[i].id + "' ";
									if (data[i].id == selectschoolId) {
										option += "selected";

									}

									option += ">" + data[i].name + "</option>";
									console.log(data[i].name)
									$("#typeselectBox").html(option);
								}
								form.render('select');

							}

							commonReq.adminReq(uri, data, method, loadDeptSelect);



							//????
							form.render(null, 'layuiadmin-form-useradmin');
							//监听提交
							form.on('submit(LAY-user-front-submit)', function(params) {
								var field = params.field; //获取提交的字段 
								console.log(params);
								console.log(field);
								//???
								var userRoles = [];
								if (field.roleId != null) {
									let userRole = {
										userId: field.userId,
										roleId: field.roleId
									}
									userRoles.push(userRole)
								}
								field['userRoles'] = userRoles;
								//
								var data = JSON.stringify(field);
								var uri = '/sysuser/sys_user/save';
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
								}
								commonReq.adminReq(uri, data, method, done);


								layui.table.reload('LAY-user-manage'); //重载表格
								layer.close(index); //执行关闭
							});
						});
					}
				});
			} else {
				layer.alert('没有权限，无法删除');
			}


		}






	});







	

	



	// //菜单管理menu
	// table.render({
	// 	elem: '#LAY-user-back-menu2',
	// 	url: setter.address + '/sysuser/sys_role/findAll'

	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'systemname',
	// 			title: '名称'
	// 		}, {
	// 			field: 'logo',
	// 			title: '图标'
	// 		}, {
	// 			field: 'type',
	// 			title: '类型'
	// 		}, {
	// 			field: 'menu',
	// 			title: '上级菜单'
	// 		}, {
	// 			field: 'menuurl',
	// 			title: '菜单URL'
	// 		}, {
	// 			field: 'showtitle',
	// 			title: '授权标识'
	// 		}, {
	// 			field: 'rule',
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2'
	// 		}]
	// 	],
	// 	page: true,
	// 	limit: 30,
	// 	height: 'full-320',
	// 	text: '对不起，加载出现异常！',
	// 	method: 'post',
	// 	contentType: 'application/json',
	// 	response: {
	// 		statusName: 'code' //规定数据状态的字段名称，默认：code
	// 			,
	// 		statusCode: 200 //规定成功的状态码，默认：0
	// 			,
	// 		msgName: 'msg' //规定状态信息的字段名称，默认：msg
	// 			,
	// 		countName: 'count' //规定数据总数的字段名称，默认：count
	// 			,
	// 		dataName: 'data' //规定数据列表的字段名称，默认：data
	// 	},
	// 	request: {
	// 		pageName: 'pageNum' //页码的参数名称，默认：page
	// 			,
	// 		limitName: 'pageSize' //每页数据量的参数名，默认：limit
	// 	},
	// 	parseData: function(res) {
	// 		console.log(res);
	// 		return {
	// 			"code": res.status, //解析接口状态
	// 			"msg": res.message, //解析提示文本
	// 			"count": res.data.total, //解析数据长度
	// 			"data": res.data.rows //解析数据列表
	// 		};
	// 	},
	// 	done: function(res, curr, count) {
	// 		//如果是异步请求数据方式，res即为你接口返回的信息。
	// 		//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
	// 		console.log(res);
	// 		//得到当前页码
	// 		console.log(curr);
	// 		//得到数据总量
	// 		console.log(count);
	// 	}
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						$.ajax({
	// 							type: "post",
	// 							data: data,
	// 							url: "  http://192.168.1.2:8762/api/admin/sysuser/sys_permission/getParentMenuTree",
	// 							dataType: "json"

	// 						});


	// 						layui.table.reload('LAY-user-back-menu2'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });

























	// //菜单管理menu
	// table.render({
	// 	elem: '#LAY-user-back-menu2',
	// 	url: './json/useradmin/menu2.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'systemname',
	// 			title: '名称'
	// 		}, {
	// 			field: 'logo',
	// 			title: '图标'
	// 		}, {
	// 			field: 'type',
	// 			title: '类型'
	// 		}, {
	// 			field: 'menu',
	// 			title: '上级菜单'
	// 		}, {
	// 			field: 'menuurl',
	// 			title: '菜单URL'
	// 		}, {
	// 			field: 'showtitle',
	// 			title: '授权标识'
	// 		}, {
	// 			field: 'rule',
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//          $.ajax({  
	// 						// });


	// 						// url:"{./moudules/menu}",
	// 						// type:'post',
	// 						// data:userInfo,
	// 						// beforeSend:function () {
	// 						//     this.layerIndex = layer.load(0, { shade: [0.5, '#393D49'] });
	// 						// },
	// 						// success:function(data){
	// 						//     if(data.status == 'error'){
	// 						//         layer.msg(data.msg,{icon: 5});//失败的表情
	// 						//         return;
	// 						//     }else if(data.status == 'success'){
	// 						//         layer.msg(data.msg, {
	// 						//             icon: 6,//成功的表情
	// 						//             time: 1000 //1秒关闭（如果不配置，默认是3秒）
	// 						//         }, function(){
	// 						//             location.reload();
	// 						//         });
	// 						//     }
	// 						// },
	// 						// complete: function () {
	// 						//     layer.close(this.layerIndex);
	// 						// },




	// 						layui.table.reload('LAY-user-back-menu2'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });

	// //用户管理
	// table.render({
	// 	elem: '#LAY-user-back-manage1',
	// 	url: './json/useradmin/mangadmin2.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'mininame',
	// 			title: '昵称'
	// 		}, {
	// 			field: 'sex',
	// 			title: '性别'
	// 		}, {
	// 			field: 'age',
	// 			title: '年龄'
	// 		}, {
	// 			field: 'phone',
	// 			title: '电话'
	// 		}, {
	// 			field: 'jointime',
	// 			title: '创建时间',
	// 			sort: true
	// 		}, {
	// 			field: 'logintime',
	// 			title: '登录时间',
	// 			sort: true
	// 		}, {
	// 			field: 'open',
	// 			title: '启用'
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin1'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-manage1)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-manage1'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });






	// //用户反馈
	// table.render({
	// 	elem: '#LAY-user-back-menu2-userk',
	// 	url: './json/useradmin/userk.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: '序号',
	// 			sort: true
	// 		}, {
	// 			field: 'phone',
	// 			title: '电话'
	// 		}, {
	// 			field: 'question',
	// 			title: '反馈问题'
	// 		}, {
	// 			field: 'image',
	// 			title: '反馈图片'
	// 		}, {
	// 			field: 'releasetime',
	// 			title: '发布时间',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2-userk'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2-userk)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-menu2-userk'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });


	// //用户办卡
	// table.render({
	// 	elem: '#LAY-user-back-menu2-userk2',
	// 	url: './json/useradmin/userk2.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'name',
	// 			title: '姓名'
	// 		}, {
	// 			field: 'phone',
	// 			title: '电话'
	// 		}, {
	// 			field: 'school',
	// 			title: '学校'
	// 		}, {
	// 			field: 'IDcard',
	// 			title: '证件类型'
	// 		}, {
	// 			field: 'number',
	// 			title: '证件号码',
	// 			sort: true
	// 		}, {
	// 			field: 'applytime',
	// 			title: '申请时间'
	// 		}, {
	// 			field: 'servetype',
	// 			title: '服务类型'
	// 		}, {
	// 			field: 'type',
	// 			title: '状态',
	// 			sort: true
	// 		}, {
	// 			field: 'make',
	// 			title: '处理',
	// 			sort: true
	// 		}, {
	// 			field: 'maker',
	// 			title: '处理人',
	// 			sort: true
	// 		}, {
	// 			field: 'maketime',
	// 			title: '处理时间',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2-userk2'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2-userk)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-menu2-userk'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });

	// //异常日志



	// //客服问题
	// table.render({
	// 	elem: '#LAY-user-back-menu2-kefu',
	// 	url: './json/useradmin/kefu.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'systemname',
	// 			title: '名称'
	// 		}, {
	// 			field: 'logo',
	// 			title: '图标'
	// 		}, {
	// 			field: 'type',
	// 			title: '类型'
	// 		}, {
	// 			field: 'menu',
	// 			title: '上级菜单'
	// 		}, {
	// 			field: 'menuurl',
	// 			title: '菜单URL'
	// 		}, {
	// 			field: 'showtitle',
	// 			title: '授权标识'
	// 		}, {
	// 			field: 'rule',
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2-kefu'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2-kefu)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-menu2-kefu'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });




	// //上网管理
	// table.render({
	// 	elem: '#LAY-user-back-menu2-online2',
	// 	url: './json/useradmin/online2.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'systemname',
	// 			title: '名称'
	// 		}, {
	// 			field: 'logo',
	// 			title: '图标'
	// 		}, {
	// 			field: 'type',
	// 			title: '类型'
	// 		}, {
	// 			field: 'menu',
	// 			title: '上级菜单'
	// 		}, {
	// 			field: 'menuurl',
	// 			title: '菜单URL'
	// 		}, {
	// 			field: 'showtitle',
	// 			title: '授权标识'
	// 		}, {
	// 			field: 'rule',
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2-online2'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2-online2)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-menu2-online2'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });






	// //凌云客服

	// table.render({
	// 	elem: '#LAY-user-back-menu2-ling',
	// 	url: './json/useradmin/ling.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'systemname',
	// 			title: '名称'
	// 		}, {
	// 			field: 'logo',
	// 			title: '图标'
	// 		}, {
	// 			field: 'type',
	// 			title: '类型'
	// 		}, {
	// 			field: 'menu',
	// 			title: '上级菜单'
	// 		}, {
	// 			field: 'menuurl',
	// 			title: '菜单URL'
	// 		}, {
	// 			field: 'showtitle',
	// 			title: '授权标识'
	// 		}, {
	// 			field: 'rule',
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin-menu2-ling'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-menu2-ling)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-menu2-ling'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });


	// //管理员管理
	// table.render({
	// 	elem: '#LAY-user-back-manage',
	// 	url: './json/useradmin/mangadmin.js' //模拟接口
	// 		,
	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'loginname',
	// 			title: '登录名'
	// 		}, {
	// 			field: 'telphone',
	// 			title: '手机'
	// 		}, {
	// 			field: 'email',
	// 			title: '邮箱'
	// 		}, {
	// 			field: 'role',
	// 			title: '角色'
	// 		}, {
	// 			field: 'jointime',
	// 			title: '加入时间',
	// 			sort: true
	// 		}, {
	// 			field: 'check',
	// 			title: '审核状态',
	// 			templet: '#buttonTpl',
	// 			minWidth: 80,
	// 			align: 'center'
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-manage)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.prompt({
	// 			formType: 1,
	// 			title: '敏感操作，请验证口令'
	// 		}, function(value, index) {
	// 			layer.close(index);
	// 			layer.confirm('确定删除此管理员？', function(index) {
	// 				console.log(obj)
	// 				obj.del();
	// 				layer.close(index);
	// 			});
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '编辑管理员',
	// 			area: ['420px', '450px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/adminform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-admin');

	// 					//监听提交
	// 					form.on('submit(LAY-user-back-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-manage'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });

	// //角色管理
	// table.render({
	// 	elem: '#LAY-user-back-role',
	// 	// url: './json/useradmin/role.js' ，//模拟接口

	// 	cols: [
	// 		[{
	// 			type: 'checkbox',
	// 			fixed: 'left'
	// 		}, {
	// 			field: 'id',
	// 			width: 80,
	// 			title: 'ID',
	// 			sort: true
	// 		}, {
	// 			field: 'rolename',
	// 			title: '角色名'
	// 		}, {
	// 			field: 'limits',
	// 			title: '拥有权限'
	// 		}, {
	// 			field: 'descr',
	// 			title: '具体描述'
	// 		}, {
	// 			title: '操作',
	// 			width: 150,
	// 			align: 'center',
	// 			fixed: 'right',
	// 			toolbar: '#table-useradmin-admin'
	// 		}]
	// 	],
	// 	text: '对不起，加载出现异常！'
	// });

	// //监听工具条
	// table.on('tool(LAY-user-back-role)', function(obj) {
	// 	var data = obj.data;
	// 	if (obj.event === 'del') {
	// 		layer.confirm('确定删除此角色？', function(index) {
	// 			obj.del();
	// 			layer.close(index);
	// 		});
	// 	} else if (obj.event === 'edit') {
	// 		admin.popup({
	// 			title: '添加新角色',
	// 			area: ['500px', '480px'],
	// 			id: 'LAY-popup-user-add',
	// 			success: function(layero, index) {
	// 				view(this.id).render('user/administrators/roleform', data).done(function() {
	// 					form.render(null, 'layuiadmin-form-role');

	// 					//监听提交
	// 					form.on('submit(LAY-user-role-submit)', function(data) {
	// 						var field = data.field; //获取提交的字段

	// 						//提交 Ajax 成功后，关闭当前弹层并重载表格
	// 						//$.ajax({});
	// 						layui.table.reload('LAY-user-back-role'); //重载表格
	// 						layer.close(index); //执行关闭 
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}
	// });

	exports('useradmin', {})
});
