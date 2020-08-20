# 事件  
页面或文档与用户交互的某个瞬间。  
任何事件都要经历三个阶段：  
1. 事件捕获阶段
2. 目标对象处理阶段
3. 事件冒泡阶段  
ps:尽量在事件冒泡阶段绑定回调函数处理事件，因为在捕获阶段存在兼容性问题(IE不支持)  

### 事件绑定  
dom0级事件绑定  
优点： 兼容性好，都能绑定。
缺点：只能绑冒泡阶段；不能绑多个函数，存在覆盖问题；事件对象的获取存在兼容性。
绑定方式有两种：一种是onclick=function(){},一种是标签内写onclick事件。
```
<input id="input" type="text" onclick="alert(111)" />

document.getElementById('input').onclick =function() {
    alert(222)
}

//弹出222
```

dom2级事件绑定  
优点： 既可以绑捕获阶段，也可以绑冒泡阶段；可以绑多个函数。
缺点： IE和非IE绑定时要使用不同的dom2级事件方法；且this的含义不一样；事件对象的获取存在兼容性。  
绑定方式：监听方法，addEventListener()和removeEventListener()这两个原生方法用来添加和移除事件。  
第三个参数如果为true则表示在捕获阶段调用，为false在冒泡阶段调用，默认为false. 
dom0级和dom2级的事件可以同时存在 
```
<input id="input" type="text" onclick="alert(111)" />

document.getElementById('input').onclick =function() {
    alert(222)
}
document.getElementById('input').addEventListener('click',function() {
    alert(333)
},true)
document.getElementById('input').addEventListener('click',function() {
    alert(444)
},true)
document.getElementById('input').addEventListener('click',function() {
    alert(555)
},false)

//兼容IE(移除用detachEvent)
document.getElementById('input').attachEvent('onclick',function() {
    alert(555)
})

//333 444 222 555
```

IE与标准浏览器下捕获事件和冒泡事件的顺序问题
捕获先执行，冒泡后执行。同在一个执行阶段则先绑定先执行
```
var eventUtil = {};
eventUtil.handler = function(obj, type, fun, isCapture) {
    let isCapture = !!isCapture;
     if(obj.attachEvent) {
        //IE
        if(isCapture) {
            //捕获阶段
            throw new Error('无法在该浏览器进行事件捕获')
        }else  {
            //冒泡阶段 
            // obj.attachEvent('on'+ type, fun)
        }
     }else {
         obj.addEventListener(type, fun, isCaptrue)
     }
    
}
```

### 事件对象
```
window.onload = function() {
    var a = document.getElementById('input');
    a.onclick= function(e) {
        e = e || window.event;      //兼容性获取事件
        //console.log(e.type)       //'click'   

        //阻止默认行为
        if(e.preventDefault) {
            e.preventDefault();      //标准浏览器下
        }else {
            e.returnValue = false;      //IE
        }

        //阻止事件的冒泡
        if(e.stopPropagation) {
            e.stopPropergation();       //标准浏览器
        }else {
            e.cancelBuble = true;       //IE
        }

        //获取事件源对象
        if(e.target.tagName) {
            console.log(e.target.tagName);  //标准浏览器
        }else {
            console.log(e.srcElement.tagName);  //IE
        }
    }
}
```

### 事件性能优化
1. 事件清除  

0级事件： `document.body.onclick = null`;  

2级事件：  
```
var fun =function() {console.log(123)};
wondow.onload = function() {
    document.body.onclick = function() {
        console.log(123);
    };
    
};
document.body.onclick = null;       //0级事件
document.body.addEventListener('click',fun);  //标准浏览器
document.body.removeEventListener('click',fun);
document.body.attachEvent('onclick',fun);   //IE浏览器
document.detachEvent('onclick',fun);

```

2. 事件委托
原因：当子节点过多时如果给每一个子节点都绑定事件，会影响性能。
利用了事件冒泡机制将子节点的事件绑定到父节点上，当鼠标点击子节点的时候，会冒泡到父节点上，通过event.target能获取到触发事件的子节点。
