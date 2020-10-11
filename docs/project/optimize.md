# 性能优化    

## 加载优化    
加载过程最为耗时，可能会占到总耗时的80%的时间，是优化的重点。
**减少http请求个数**  
web前端80%的时间花在请求图片、脚本、样式等资源文件上。首次加载同时请求数不能超过4个，减少http请求个数的主要途径有：  
1. 合并JS/CSS文件。基于NodeJs的文件合并工具，将脚本合并成一个文件。  
2. 使用CSS Sprite将图片合并成一个文件，通过background-image和background-position来控制显示。  

**缓存资源**  
使用缓存可减少请求数。  
1. DNS缓存。用户输入URL后，查询域名对应的IP一般需要20~120ms。基于性能考虑，ISP、局域网、操作系统、浏览器都会有DNS缓存机制。  
2. 缓存响应结果(Ajax请求)。http头添加Expires或Cache-Control字段判断缓存是否过期或是否存在，还有Last-Modified和Etag判断资源是否有更改。  
3. 使用外联的样式和脚本。外部的JavaScript和CSS文件可以被浏览器缓存，在不同页面复用，可以减小页面大小。  

**压缩代码**   
减少资源大小可以加快网页显示速度。  
1. 压缩JavaScript和CSS。移除(注释、空格、空行等)非功能性字符，有大量前端优化工具可以实现，webpack等构建工具内有配套插件。  
2. 启用Gzip。绝大多数浏览器支持Gzip解码，Gzip压缩可以减少70%的响应大小，可以有效缩短响应时间。ps:图片和PDF文件不要用，因为它们本身已经压缩过了。  

**无阻塞**   
样式放头部，脚本放底部。 
1. 把脚本放在页面底部。浏览器下载脚本时，会阻塞其他资源的下载，即使是不同域名的资源。倘若某些场景无法将脚本放到底部，可以**异步加载js**，这样渲染引擎一遇到该命令就会开始下载外部脚本，但是不会等它下载和执行，而是继续执行后续命令，方法是在`<script>`标签中添加`defer`属性或是`async`属性。不同的是：  
async会在脚本加载完可用之时立即执行，渲染引擎会中断渲染，待执行完后继续渲染，而defer要等到DOM加载完毕，其他脚本生成后再执行。如果有多个脚本，设置了defer属性的脚本会按顺序执行，async不能确保。defer执行在window.onload之前，会阻止DOMContentLoaded事件，直至脚本被加载并解析完成后在触发该事件。  
2. 对于样式，使用`link`代替`@import`。对于IE一些版本，@import 相当于放在页面底部，应该在头部用link引入样式。  

**首屏加载**  
首屏快速显示可以提升用户对页面速度的感知。   
1. 延迟加载。除了页面初始加载所必须的内容，其他非首屏显示的数据、样式、脚本、图片和一些用户交互时才显示的内容都可以延迟加载。 

**按需加载**    
1. 懒加载  
2. 滚屏加载  
3. Media Query加载

**预加载**   
利用浏览器空闲时间请求将来要用的资源。预加载方式：  
1. 无条件预先加载：页面加载完(load)后,马上获取其他资源  
2. 有条件预先加载： 根据用户行为预判用户去向，预载相关资源。  


**压缩图像**    

**减少cookie**  
cookie通过http头在服务器与浏览器之间传送，会影响响应速度。  
1. 静态资源域名不使用cookie  
2. 去除不必要的cookie
3. 尽量压缩cookie大小  
4. 设置cookie的domain级别  
5. 设置合适的过期时间

**避免重定向**  
重定向会影响加载速度。客户端收到重定向的回复后，会根据响应头中的Location地址再次发送请求。

## 执行优化  
执行处理不当会阻塞页面加载和渲染  
**css写在头部，js写在尾部**  

**避免img.iframe等的src为空**   
空的src会导致重新加载当前页面，影响速度和效率 

**尽量避免重置图像大小**   
重置大小会应发图像的重绘 

**图像尽量避免使用DataURL**   
DataURL图像没有使用图像的压缩算法，文件会变大，并且要解码后再渲染，加载慢耗时长 

## 渲染优化  
**设置viewport**  
HTML的viewport可加速页面渲染   

**减少DOM节点**  
DOM节点太多会影响页面渲染,js的DOM操作也更慢。  
**优化动画**  
尽量使用CSS3动画。  
合理使用requestAnimationFrame动画代替setTimeout  

**优化高频事件**  
1. 函数防抖和节流  
2. 减少重绘次数  

**GPU加速**  
使用某些html5标签和css3属性会触发GPU渲染，移动端需合理使用(增加耗电)  
* html标签：video、canvas、webgl  
* css属性： opacity、transform、transition

## 样式优化  
1. 避免在html中写style  
2. 避免css表达式。表达式的执行需要跳出css树的渲染  
3. 移除css空规则。会增加css文件大小  
4. 正确使用display。会影响页面渲染  
* `display:none`时，渲染树不会渲染该节点，当重新显示时会引起重排  
* `display:inline`时，后面不要再设置float、margin、padding、width和height  
* `disply:inline-block`时，后面不要再设置float  
* `display:block时`，后面不再设置vertical-align  
* `display:table-*`时，后面不再设置float和margin  
5. 不滥用float。float在渲染时计算量比较大  
6. 不滥用web字体。需要下载、解析、重绘  
7. 不声明过多的font-size。会影响css树的效率  
8. 考虑到浏览器的兼容和性能，值为0时不带单位  
9. 标准化浏览器前缀  
10. 避免使用高级选择符。执行耗时长且不易读懂  

## 脚本优化  
**减少重绘和回流**  
重绘与回流的[优化方法](../browser/render.md)  

**尽量使用事件代理**    

## 具体业务优化    
**指标**  
* 白屏时间：从浏览器输入地址并回车后到页面开始有内容的时间；  
计算：浏览器开始渲染<body>标签或者解析完<head>标签时就是页面白屏结束的时间。  
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>白屏</title>
  <script type="text/javascript">
    // 不兼容performance.timing 的浏览器，如IE8
    window.pageStartTime = Date.now();
  </script>
  <!-- 页面 CSS 资源 -->
  <link rel="stylesheet" href="common.css">
  <script type="text/javascript">
    // 白屏时间结束点
    window.firstPaint = Date.now();
  </script>
</head>
<body>
  <!-- 页面内容 -->
</body>
</html>
```
```js 
白屏时间 = performance.timing.responseStart - performance.timing.navigationStart;  
//不使用performance API时
白屏时间 = firstPaint - pageStartTime
```
* 首屏时间： 从浏览器输入地址并回车后到首屏页面内容渲染完毕的时间；  
计算方法：  
1. 首屏模块标签标记法  
在HTML文档中对应首屏内容的标签结束位置和内联的js代码处记录时间戳。适用不需要获取数据以及不需要考虑图片等资源加载的情况。  
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>首屏</title>
  <script type="text/javascript">
    window.pageStartTime = Date.now();
  </script>
  <link rel="stylesheet" href="common.css">
  <link rel="stylesheet" href="page.css">
</head>
<body>
  <!-- 首屏可见模块1 -->
  <div class="module-1"></div>
  <!-- 首屏可见模块2 -->
  <div class="module-2"></div>
  <script type="text/javascript">
    window.firstScreen = Date.now();
  </script>
  <!-- 首屏不可见模块3 -->
  <div class="module-3"></div>
    <!-- 首屏不可见模块4 -->
  <div class="module-4"></div>
</body>
</html>
```
```js
首屏时间 = firstScreen - performance.timing.navigationStart;
```

2. 统计首屏内加载最慢的图片的时间    
通常首屏加载最慢的就是图片资源，因此可以把首屏加载最慢的图片的时间当做首屏时间。  
计算方法：遍历首屏内所有的图片标签，监听图片标签的onload时间，计算出所有加载时间的最大值，并用这个最大值减去navigationStart就可获得首屏时间。(加载最慢的图片的时间点 - performance.timing.navigationStart)

3. 自定义首屏内容计算法

**Performance API**  
该接口可以获取到当前页面与性能相关的信息   



### 首屏优化    
1. 图片懒加载和尺寸控制  
可以使用vue-lazyload插件来实现图片懒加载,也可以先把背景替换成同一张占位图，这样就只用请求一次，当图片出现在浏览器可视区域时，才去请求图片的真实路径。  
尺寸控制，CDN可对图片尺寸做压缩处理，webp格式图片比对应的jpg要小三分之一 




  
 
