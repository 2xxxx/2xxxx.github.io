# 浏览器渲染  
浏览器渲染主要分为4步：  
1. 将html代码解析成DOM树(包括display为none的节点)，将css代码解析成CSSOM(不包含display为none的节点)；  
2. 将DOM tree与CSSOM相结合生成render tree(不包含display为none的节点);  
3. 根据视口信息计算出render tree中节点的位置大小的实际像素值;  
4. 将render tree的实际像素值发送给GPU,渲染到页面上。  

浏览器器渲染中主要会触发两个事件：`回流`和`重绘`  
## 回流  
回流又叫做重排。一般会触发回流的条件有：  
1. 页面初次渲染  
2. 页面中增加或者删除可见节点 (js,display:none) 
3. 节点的尺寸发生改变(盒子模型中的属性)  
4. 节点的位置变化  
5. 文本的变化或者是图片尺寸变化  
6. 窗口大小变化(因为视口的大小会影响到实际像素值)  
ps:浏览器本身有做回流优化，将对DOM的修改放到一个队列里，通过**队列机制来批量更新布局**，当达到一定阈值或是一段时间(至少一个浏览器刷新16.6ms)后才会清空队列触发回流，但是当用户获取窗口等布局信息时，会立即执行回流，因为队列中可能会有影响这些属性或方法返回值的操作，即使没有，浏览器也会强制清空队列，触发回流和重绘来确保返回正确的值。  


## 重绘
触发重绘的条件有：  
1. 回流。回流一定会触发重绘，重绘不一定触发回流。  
2. 改变某个元素的颜色  
3. 改变节点可见性，节点还在渲染树中(visibility:hidden,opacity等) 

## 渲染优化
**避免回流和重绘**
具体方法： 
**CSS** 
1. 使用visibility替代display:none,因为前者只会引起重绘，后者会引起回流    
2. 避免使用table布局，很小的改动都可能造成整个table重新布局  
3. CSS3硬件加速(不了解)  
4. 避免设置多层内联样式，CSS选择符会从右往左匹配查找，避免节点层级过多


**JS**
1. 避免频繁获取布局信息(可用变量保存)  
2. 需要频繁修改的节点，给其设置绝对定位，脱离文档流，可以避免父元素及其后续元素频繁回流  
3. js中改变元素多个样式时，可用class或者cssText同时设置多个属性    
4. 一次添加多个节点时，可以使用document fragment创建空白片段来添加节点，
之后将片段拷贝进文档中   

扩展：  
布局信息包括：  
* offsetTop、offsetLeft、offsetWidth、offsetHeight  
* scrollTop、scrollLeft、scrollWidth、scrollHeight  
* clientTop、clientLeft、clientWidth、clientHeight  
* width、height  
* getComputedStyle()、getBoundingClientRect()  

position为absolute或fixed的元素不参与flex的布局，可能会导致部分移动端布局错位  
解决方法：在设置绝对定位的元素上再设置width:100%; 
