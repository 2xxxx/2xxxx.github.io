# 手撕代码  

## 防抖 
在函数给定的时间范围内值执行一次，若在该时间段内有触发则重新计算时间   
实现1：
```js  
function debounce(fn, context, arg, time, immediate) {
    return function() {
        fn.curtime = new Date.noe();
        if(!fn.starttime) {
            if(immediate) fn.call(context, arg)
            
        }else {
            if(fn.curtime - fn.starttime >= time) {
                fn.call(context, arg)
            }
        }
        fn.starttime = fn.curtime;
    }
}
```  
实现2：
```js
function debounce(fn, context, arg, time, immediate) {
    return function() {
        if(fn.timer){
            clearTimeout(fn.timer);
        } else {
            if(immediate) fn.call(context, arg)
        }

        fn.timer = setTimeout(() => {
            fn.call(context, arg)
        },time)
       
    }
}
``` 

## 节流  
在用户操作过程中，按函数给的频率执行  
```js
function throttle(fn, context, arg, time, immidiate) {
    return function() {
        fn.curtime = new Date.now();
        if(!fn.starttime) {
            fn.starttime = fn.curtime;
            if(immidiate) fn.call(context, arg)
        } 
        if(fn.curtime - fn.starttime >= time) {
            fn.call(context, arg);
            fn.starttime = fn.curtime;
        }
    }
}
```

**防抖节流合并**
```js
function debounce(fn, context, delay, text, mustApplyTime) {
    clearTimeout(fn.timer);
    fn._cur = Date.now(); //记录当前时间

    if (!fn._start) { //若该函数是第一次调用，则直接设置_start,即开始时间，为_cur，即此刻的时间
        fn._start = fn._cur;
    }
    if (fn._cur - fn._start > mustApplyTime) {
        //当前时间与上一次函数被执行的时间作差，与mustApplyTime比较，若大于，则必须执行一次函数，若小于，则重新设置计时器
        fn.call(context, text);
        fn._start = fn._cur;
    } else {
        fn.timer = setTimeout(function () {
            fn.call(context, text);
        }, delay);
    }
}
```

## 深拷贝  
```js
function deepClone(obj) {
    if(obj === null) return null
    if(obj instanceof RegExp) return new RegExp(obj)
    if(obj instanceof Date) return new Date(obj)
    if(typeof obj == 'function') return new function(obj){}
    if(typeof obj != 'object') {
        //非复杂类型直接返回，也是结束递归的条件
        return obj
    }
    var newObj = new obj._proto_.constructor;
    for(var key in obj) {
        newObj[key] = deepClone(obj[key])
    }
    return newObj
}
```