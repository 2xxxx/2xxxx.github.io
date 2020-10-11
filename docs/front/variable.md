 # 变量和类型

## 变量
变量是一个值的符号名称，可通过名称引用值。

定义：`var 变量名`  （声明提前，赋值不提前）


## 类型

基本数据类型：number,string,boolean,object,null,undefined,symbol.
* 简单类型：数值类型，字符串类型，boolean类型，null，undefined, symbol
* 对象类型：除了以上六种，剩下都是.

javaScript中所有类型都能转化成boolean类型。
```js
//为假
var num = 0; //undefined,null,'',false，0，NaN转bool都为false
console.log(!!num) //false
```


### 类型判断
#### typeof
可判断的类型：`number/string/boolean/undefined/object/function/symbol`  
ps:`typeof null`为`object`

#### instanceof
`obj instanceof constructor`
`instanceof`是利用原型链来判断，构造函数的prototype指向的对象是否在obj对象的原型链上，可用来判断数组、正则等

#### Object.prototype.toString
```js
const arr = [1, 2, 3];
console.log(Object.prototype.toString.call(arr)) //"[object Array]"
```
call是用来改变toString方法的执行上下文，可用apply代替  

扩展: Object.prototype.toString可以判断函数是同步还是异步   
```js
//promise  
var promise1 = new Promise((resolve,reject) => {
    resolve();
})
console.log(Object.prototype.toString.call(promise1))  //"[object Promise]"  

//async
async function fun() {
    await 2
}
console.log(Object.prototype.toString.call(fun)) //"[object AsyncFunction]"  

//同步函数
function fun1() {
    alert('1')
}
console.log(Object.prototype.toString.call(fun1))  //"[object Function]"
```


#### 其他方法
1. NaN。NaN不和任何值包括自身相等，可通过isNaN(num)判断
2. Array。Array.isArray()可判断，但老浏览器存在一定兼容性