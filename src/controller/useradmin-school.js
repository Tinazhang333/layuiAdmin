//系统管理

layui.define(['table', 'form', 'commonReq'], function(exports) {
	

	// 学校管理-1
	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		commonReq = layui.commonReq
	view = layui.view,
		table = layui.table,
		form = layui.form;
	console.log(commonReq);
	var height ='full-320';
	var elem = '#LAY-user-back-manage2';
	var uri = '/system/school_info/getSchoolInfoByPage';
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
				field: 'name',
				title: '学校名称'
			}, {
				field: 'regiestNewUser',
				title: '注册用户'
			}, {
				field: 'userRecharge',
				title: '用户充值'
			}, {
				field: 'balanceInquiry',
				title: '查询余额'
			}, {
				field: 'findSecret',
				title: '找回密码'
			}, {
				field: 'logoutLogin',
				title: '退出登录',
			}, {
				title: '操作',
				width: 150,
				align: 'center',
				fixed: 'right',
				toolbar: '#table-useradmin-admin'
			}
		]
	];
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
	table.on('tool(LAY-user-back-manage2)', function(obj) {
		console.log(obj);
		var params = obj.data;
		console.log(params);
		console.log(params.createTime);
		console.log(params.id);

		// console.log(params.name);
		// console.log(params.logoutLogin);
		// var data = obj.data;
		if (obj.event === 'del') {
			layer.confirm('是否确认删除', function(index) {
				let param = [];
				param.push(params.id);
				var uri = '/system/school_info/delete';
				// var data=param;
				var data = JSON.stringify(param);
				var method = 'post';
				commonReq.adminReq(uri, data, method, done);
				
				layui.table.reload('LAY-user-back-manage2');
				layer.close(index);
			});

		} else if (obj.event === 'edit') {
			admin.popup({
				title: '编辑学校',
				area: ['500px', '600px'],
				id: 'LAY-popup-school-add',
				success: function(layero, index) {
					view(this.id).render('user/administrators/schoolform', params).done(function() {
						// form.render(null, 'layuiadmin-form-admin');
						// form.render(null, 'layadmin-useradmin-formlist');
						//监听提交
						form.on('submit(LAY-user-back-submit)', function(params) {
							console.log(params)
							var field = params.field; //获取提交的字段
							var data = JSON.stringify(field);
							var uri = '/system/school_info/saveSchool';
							// var uri = '/system/school_info/getSchoolList';
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
										// table.reload("Users");
									}, 1000);
								} else {
									layer.msg("修改失败", {
										icon: 5
									});
								}
							}
							commonReq.adminReq(uri, data, method, done);
							layui.table.reload('LAY-user-back-manage2'); //重载表格
							layer.close(index); //执行关闭 
						});
					});
				}
			});
		}
	});






	exports('useradmin-school', {})
});
