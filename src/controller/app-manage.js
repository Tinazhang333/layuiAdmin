//app用户

layui.define(['table', 'form', 'commonReq'], function(exports) {
	
	//用户管理
	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		commonReq = layui.commonReq
	view = layui.view,
		table = layui.table,
		form = layui.form;
	console.log(commonReq);
	var elem = '#LAY-user-usermanage';
	var uri = '/system/school_info/getSchoolInfoByPage';
	var cols = [
		[{
			type: 'checkbox',
			fixed: 'left'
		}, {
			field: 'id',
			width: 80,
			title: 'ID',
			sort: true
		}, {
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
			title: '退出登录'
		}, {
			title: '操作',
			width: 150,
			align: 'center',
			fixed: 'right',
			toolbar: '#table-useradmin-admin'
		}]
	];
	var done = function(res, curr, count) {
		//如果是异步请求数据方式，res即为你接口返回的信息。
		//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
		console.log(res);
		//得到当前页码
		console.log(curr);
		//得到数据总量
		console.log(count);
	}
	commonReq.tableInit(elem, uri, cols, done);

	//监听工具条
	table.on('tool(LAY-user-usermanage)', function(obj) {
		var data = obj.data;
		if (obj.event === 'del') {
			layer.confirm({
				title: '是否确认删除'
			}, function(value, index) {
				layer.close(index);

				// layer.confirm('真的删除行么', function(index) {
				// 	obj.del();
				// 	layer.close(index);
				// });
				let ids = [];
				ids.push(params.userId);
				var uri = '/system/school_info/delete';
				var data = JSON.stringify(ids);
				var method = 'post';
				commonReq.adminReq(uri, data, method, done);
				layer.close(index);
			});

		} else if (obj.event === 'edit') {
			admin.popup({
				title: '编辑',
				area: ['450px', '550px'],
				id: 'LAY-popup-user-add',
				success: function(layero, index) {
					view(this.id).render('user/administrators/adminform', data).done(function() {
						form.render(null, 'layuiadmin-form-admin');

						//监听提交
						form.on('submit(LAY-user-back-submit1)', function(data) {
							var field = params.field; //获取提交的字段
							var data = JSON.stringify(field);
							//提交 Ajax 成功后，关闭当前弹层并重载表格
							//$.ajax({});

							var uri = '/system/school_info/saveSchool';
							console.log(params)
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




							layui.table.reload('LAY-user-usermanage'); //重载表格
							layer.close(index); //执行关闭 
						});
					});
				}
			});
		}
	});




	


	exports('useradmin', {})
});
