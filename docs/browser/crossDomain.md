# 跨域  
跨域是指在一个域下的文档或脚本去访问另一个域下的资源。  
**广义的跨域**：  
1. 资源跳转： a链接，重定向，表单提交等  
2. 资源嵌入： html标签和css样式中的文件外链  
3. 脚本请求: ajax请求等。  

**狭义的跨域**
由浏览器的同源策略引起请求限制，通常说的跨域都是指狭义的跨域。  
同源策略： 浏览器的安全策略。协议、端口、域名三者任何一个不同则视为不同源。  
行为限制：  
1. cookie、localStorage和indexDB无法读取  
2. DOM和js无法获得  
3. ajax请求不能发送 

跨域的方法：  
1. JSONP跨域  
利用了`<script>`标签中src自带跨域的能力  
使用：用户传递一个callback的参数给服务器，服务器返回时会将callback参数包裹json数据后再发送给客户端  
客户端设置
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>exercise</title>
        <script type="text/javascript">
            function fn(data){//定义一个函数
                console.log(JSON.parse(data));//这个函数会将传进来的参数从json字符串格式转化成数组格式
                //然后可以对数组进行js操作
            }
        </script>
        <script src="http://www.xxx.com/search?xxx=1&callback=fn"></script>
    </head>
    <body>

    </body>
</html>

```  

服务端设置  
```js  
var querystring = require('querystring');
var http =require('http');
var data =['qq','ww','ee'];
http.createServer(function(req, res){
    //req:请求对象；res:响应对象
    var callback = qs.parse(req.url.split('?')[1]).callback;//fn
    var temp =JSON.stringify(data); //数据转为json格式
    res.end(callback+ "('"+temp+"')") //收到请求后的回复，返回一串字符串
}).listen(8080)

```

2. CORS (跨域资源共享)  
后台设置  
```js
//允许跨域访问的域名
response.setHeader("Access-Control-Allow-Origin", 'http://www.asdf.com');

//允许前端带认证cookie,启用这个，上面域名不能设为'*',要指定具体域名  
response.setHeader('Access-Control-Allow-Credentials', 'true');

//提示OPTIONS预检测时，后端需设置两个常用自定义头  
response.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
```  
前端设置
```js
//1.原生
//如需携带cookie，则前端也要设置
var xhr = new XMLHttpRequest();  
//前端设置携带cookie
xhr.withCredentials = true;

//2.axios
axios.defaults.withCredentials = true;
//扩展：axios和ajax有什么区别？axios是在ajax的基础上封装了一层，可以不用再写上例xhr,open,send,回调等等

//3.vue
Vue.http.options.credentials = true;
```

3. nginx代理跨域  

4. websocket协议跨域  

5. postMessage跨域  

6. window.name跨域
