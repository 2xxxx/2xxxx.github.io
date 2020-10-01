# 浏览器  
浏览器是平时开发中除编辑器外用的最多的工具，关于浏览器的知识点也有很多，包括浏览器的渲染、进程与线程、缓存机制、垃圾回收机制、性能优化等等。虽然一开始学前端的时候对浏览器不够了解，也能写出能用的项目，但是了解一些之后才能知道怎样写出好用的项目。  

## 浏览器对象  
1. window.  
`window.innerWidth`和`window.innerHeight`: 获取浏览器窗口的内部宽度和高度(除去菜单栏、工具栏、边框等，显示网页的净宽高，IE<=8不支持>)。  
`window.outerWidth`和`window.outerHeight`:获取浏览器窗口的整个宽高。  

2. navigator.  
表示浏览器的信息。用户可修改  
`navigator.appName`:浏览器名称  
`navigator.appVersion`:浏览器版本  
`navigator.language`:浏览器设置的语言  
`navigator.platform`:操作系统类型  
`navigator.userAgent`:浏览器设定的User-Agent字符串  

3. screen  
`screen.width`和`screen.height`: 屏幕宽高，以像素为单位  
`screen.colorDepth`: 颜色位数，8、16、24等  

4. location  
当前页面的URL信息。  
`location.href`: 完整的url。eg: http://www.example.com.8080/index.html?a=1&b=2#top 
`location.protocol`: 'http'  
`location.port`:'8080'
`location.host`: 'www.example.com'  
`location.pathname`: '/index.html'  
`location.search`: '?a=1&b=2'  
`location.hash`: 'top'  

5. document  
document对象是整个DOM树的根节点。  
`document.title`: html标题  
`document.getElementById()`和`document.getElementsByTagName`: 获得一个DOM节点和获得一组DOM节点  
`document.cookie`:获取当前页面的cookie  

6. history  


