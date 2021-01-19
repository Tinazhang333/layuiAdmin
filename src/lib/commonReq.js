layui.define(['table', 'admin'], function(exports) {
	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		table = layui.table;
		var headers = {};
		headers[setter.request.tokenName] = layui.data(setter.tableName)[setter.request.tokenName];
	var obj = {
		tableInit: function(elem, uri, cols, done,height) {
			table.render({
				elem: elem,
				url: setter.address + uri,
				cols: cols,
				page: true,
				limit: 30,
				skin: 'line' ,//行边框风格
				even: true ,//开启隔行背景
				// height: 'full-320',
				height: height,
				text: '对不起，加载出现异常！',
				method: 'post',
				contentType: 'application/json',
				headers: headers,
				response: {
					statusName: 'code', //规定数据状态的字段名称，默认：code
					statusCode: 200, //规定成功的状态码，默认：0
					msgName: 'msg', //规定状态信息的字段名称，默认：msg
					countName: 'count', //规定数据总数的字段名称，默认：count
					dataName: 'data' //规定数据列表的字段名称，默认：data
				},
				request: {
					pageName: 'pageNum', //页码的参数名称，默认：page
					limitName: 'pageSize' //每页数据量的参数名，默认：limit
				},
				parseData: function(res) {
					if(res.status != 200){
						return {
							"code": res.status, //解析接口状态
							"msg": res.message, //解析提示文本
							"count": 0, //解析数据长度
							"data": null //解析数据列表
						};
					}else{
						return {
							"code": res.status, //解析接口状态
							"msg": res.message, //解析提示文本
							"count": res.data.total, //解析数据长度
							"data": res.data.rows //解析数据列表
						};
					}
					
				},
				done: done
			});
		},
		adminReq: function(uri, data, method, done) {
			//请求登入接口
			admin.req({
				url: setter.address + uri,//实际使用请改成服务端真实接口
				data: data,
				method: method,
				contentType: 'application/json',
				dataType: "json",
				parseData: function(res) {
					return {
						"code": res.status, //解析接口状态
						"msg": res.message, //解析提示文本
						// "count": res.data.total, //解析数据长度
						// "data": res.data.rows //解析数据列表
					};
				},
				done: done
			});
		}
	};
	//输出接口
	exports('commonReq', obj);
});
