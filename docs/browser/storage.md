# 缓存与存储
## 浏览器缓存  
缓存机制：客户端发送请求时先发给浏览器缓存，如果有缓存数据且生效，则返回200 from Cache（现在已区分disk和memory）和缓存数据，如果失效则携带缓存标识向服务器去请求，由服务器决定是否启用缓存，若启用则协商缓存生效返回304，客户端使用浏览器缓存资源，若缓存失效，服务器返回200和新数据，并将该数据及缓存规则标识存在浏览器缓存中.

缓存作用：
* 减少网络带宽消耗
* 减少服务器压力
* 减少网络延迟，提升用户体验  

### 强缓存
强缓存就是向浏览器缓存查询请求结果，并根据回复结果的缓存规则判断是否要使用缓存的过程。  

**强缓存控制字段**  
http1.0使用的是`Expires`,http1.1使用的`Cache-Control`.  

`Expires`：响应头字段，值为服务器返回的请求结果到期时间，控制原理是将客户端时间与服务端返回的时间做对比，如果用户修改了本地时间，或时区不同发生误差，会导致缓存失效。  

`Cache-Control`: 取值
* public: 所有的内容都缓存(客户端和服务器)
* private： 所有内容都缓存(客户端)，默认取值
* no-cache：客户端缓存内容，但是是否使用由协商缓存决定
* no-store：所有内容都不会被缓存
* max-age：max-age = xxx,缓存内容会在xxx秒后失效。当值=0时，会先查看资源是否有修改(检验协商缓存是否生效)，与no-cache类似

**优先级**  
两个字段同时存在时Cache-Control优先级更高。Expires主要是为了向下兼容。

### 协商缓存
强制缓存失效后，客户端携带缓存标志向服务端发出http请求，由服务端决定是否启用缓存，协商缓存生效返回304，协商缓存失败返回200。  

**协商缓存控制字段**  
HTTP1.0使用`Last-Modified` 和 `If-Modified-Since`,HTTP1.1使用的`Etag` 和 `If-None-Match`.  

`Last-Modified`：是服务端响应请求时，返回的该资源在服务器最后修改的时间。  
流程：
1. 客户端首次请求，服务器会在响应头带上Last-Modified,并告知缓存到期时间  
2. 客户端请求时会在请求头携带If-Modified-Since,值为上次响应回复的Last-Modifoed  
3. 服务器收到后会对比最新的修改时间是否大于If-Modified-Since,如果大于就返回资源，状态为200，并更新Last-Modified,否则回复304，代表资源无更新。

`Etag`: 是由服务器生成的资源文件的唯一标识。  
流程：
1. 客户端首次请求，服务响应时会在响应头携带Etag标识   
2. 客户端在发送请求时会在请求头携带If-None-Match，值为上次返回的Etag
3. 服务器接收后会判断If-None-Match的值是否与最新的Etag相等，若不相等则表明资源文件已修改，服务器返回200和最新资源，若相等则返回304.  

**优先级**  
两个字段同时存在时Etag优先级更高，因为Last-Modified只能作用于秒级的改变，若是1秒改变N次则无法判断，Etag判断更加准确，Etag由响应头的Last-Modified和Content-Length转为16进制后再拼接而成，是加强版的Last-Modified。  

**提问，如果响应头的Etag变了，文件内容就一定变了吗？**  
不一定。因为Etag中包含Last-Modified,Last-Modified由mtime组成，当编辑文件但没修改内容时，mtime也会改变，造成Etag也改变。
mtime: modified time 文件内容改变的事件戳。

## 浏览器存储  
|           | cookie |  localstorage  | sessionStorage |
|-----------|---------|----------------|---------------|
|存储大小    | 4Kb   | 5Mb            | 5Mb           |
|生命周期    |可设置失效事件，默认是关闭浏览器后失效|若用户不清除，则永远存在|当前会话有效，关闭页面或浏览器清除|
|与服务端通信|每次都会携带在http头中，如果cookie保存过多数据会影响性能|仅在客户端保存|仅在客户端保存|
|易用性      |需要封装，原生接口不友好|原生接口可以接受，也可自己再封装|同左|

### cookie 
服务端发送给客户端并保存在本地的一段数据，用于记录用户数据，验证用户身份，cookie是不能跨域的，客户端每次发送http请求都会携带cookie来验明身份。  
**cookie设置**  
1. 服务端设置，响应头的set-cookie字段可生成cookie信息保存在客户端  
2. 客户端设置  
字段：name(cookie名称)，value(值)，domain(域名), path(页面路径)，expires/Max-Age(超时时间，设置一个时间，到达时间后失效，如果不设置则默认值为session,当浏览器关闭后失效)，size(cookie大小)，http(httponly属性，若为true，则不能通过document.cookie来访问cookie),secure(设置是否只能通过https来传递cookie)
```js
document.cookie = 'key = value'//js中设置cookie

var time = new Date(+(new Date()) + 1000 * 120) ;
document.cookie = `name = xxx;expires = $(time.toGMTString())`//设置cookie过期时间expires,如果要删除cookie，就设置过去的时间

/*原则上cookie不能跨域，如果想实现跨域，就得设置域或者路径。domain 只有当cookie的domain和当前域名匹配时才能访问到cookie,当网址不止一个域名时，比如a.example.com和b.example.com如果想共享cookie,那么domain要设置成example.com，path路径要设置为/ */

var t = new Date( +(new Date()) + 1000 * 120 );
document.cookie = `name=monsterooo;expires=${t.toLocaleTimeString()}; domain=.example.com; path=/`;
```  
扩展：  
浏览器的cookie新增了SameSite属性，用来防止CSRF攻击和用户追踪，限制第三方的cookie.
SameSite属性有3个值： 
* Strict. 完全禁止第三方cookie.只有当前网页的URL与请求目标一致时才带cookie,网页跳转时不会携带cookie,也就不会记录用户状态。
* Lax。链接，预加载请求，get表单会发送cookie,其他情况不发送第三方cookie;
* None

谷歌默认为Lax.
Strict和Lax基本能杜绝CSRF攻击（需用户浏览器支持SameSite,浏览器>=chrome51）

解决：  
1.设置代理
2.用火狐浏览器调试；
3.谷歌浏览器关闭SameSite属性，改为none,前提是必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效。  

ps:考虑到安全，应该使用session或token.  
**session**:记录用户的会话，存储在服务端，根据session id来确认用户身份。但是当访问增多时会占用服务器性能，session用户在20分钟内没操作的话就会删除。但是使用session也需要依赖cookie，sessionId会存储在cookie中，如果cookie被禁用，则会将sessionId写在URL中。


### localStorage 和 sessionStorage
两者提供了统一的API来访问和设置数据：  
1. clear。清除所有存储数据  
2. getItem。接收参数key,获取key对应的键值对 
3. removeItem。接收参数key,删除key对应的键值对  
4. setItem。接收key和value,如果不存在key则添加，存在就更新   
5. key。接收整数索引，返回对应下标的键值对的key
```js
localStorage.setItem('order', '123');
console.log(localStorage.key(0)); //order
console.log(localStorage.getItem('order'))//123
console.log(localStorage.order) //123
localStorage.removeItem('order')
localStorage.clear()

```  

### IndexedDB  
IndexedDB是浏览器提供的本地数据库。相比与上述的存储方式，它的优势在于：  
1. 存储空间更大。一般不少于250MB。  
2. 异步。异步是为了防止大量数据的读写，拖慢网页的表现，而localStorage的话是同步操作的。  
3. 支持二进制存储。IndexedDB不仅支持字符串存储，还支持存储二进制数据，而localStorage只支持字符串存储
