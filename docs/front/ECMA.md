# ES6  
## let和const  
块级作用域。  
相同点：  
1. 只在声明的执行体中有效。在全局声明时，无法挂载在window上;  
2. 声明不会提升，存在暂时性死区，只能声明后才能调用;  
3. 同一作用域中，不可重复声明。  
ps: 上述3点，var可以做到。  

不同点：  
const声明时就要赋值，且值为简单类型时是不可更改的，为对象类型时可修改内部属性。因为对于简单类型const是保证声明对象所指向的内存地址里数据不改动，相当于声明一个常量而不是变量，但是当值为对象类型时，保存到内存中的是指向实际数据的指针，const只能保证指针不变，无法确保数据不变。  
例如：  
```js
const foo = {};
foo.num = 111;
console.log(foo.num);  //111

//将foo指向另一对象
foo = {} //TypeError: "foo" is read-only
 
```
**面试问题**    
代码编译是会通过babel将ES6的语法转换为ES5的语法，ES5中没有const声明，请问a的值会改变吗？ 
```js
const a = 5;
eval('a=10');
```  
不会，通过Object.defineProperty实现，劫持当前对象，修改对象属性，并在set中对修改值的操作进行报错。
对象属性分为：Configurable(是否能删除修改属性)，Enumerable(是否能被遍历),Writable(是否能修改值),Value(值)。
前三者默认为true,const转换时修改为false。

## 箭头函数  
直接调用父级this,具体内容在[this的指向](./this)一章中。  

## 解构  
```js
let student = {name:'lw', age: 20};
let {newname ,newage} = student;
console.log(newname,newage) //lw 20

student = {name:'asd', age: 40};
console.log(newname) //lw
```
解构属于深拷贝  

## 字符串模板  
常用，不用写  

## ...args  
作用：  
1. 处理不定数目的参数；  
```js
function fun(a, ...args) {
    for(let i of args) {
        console.log(arg);
    }
}
fun(1,3,5,7,9);
//3
//5
//7
//9
```
2. 展开数组   
```js
let arr1 = [2,3,4];
let arr = [1, ...arr1, 5] //1,2,3,4,5  
```

## 模块  
特性：  
1. 尽量静态化，在编译时确定依赖关系，而原有的CommonJS和AMD是在运行时确定    
2. 输出接口与值是动态绑定关系，若是模块内部变量有变化，外部能通过接口取到实时的值  
3. 输入输出要处于模块顶层，不能在块级作用域中，会报错，无法做静态优化  

**import 和 export**  
`export`是输出，可输出变量，函数，类。   
```js
//变量
var str1 = 'ad',
str2 = 'zx';
export {str1, str2} 
export var str3 = 'we' 

//函数  
export function fun1(x,y) {
    return x + y
}
function v1() {...}
export {v1 as multiaddV1}
```

`import`是输入，使用了export定义了对接接口后，可以通过import来加载这些模块  
```js
import {str1,str2} from '../xxx'

import {str3 as params} from '../xxx' 

import * as testmodule from './aaa'  //文件整体加载
```  
ps:import命令会提升至头部执行；import是静态执行，不能使用表达式和变量。  

**import动态加载**  
引入import()函数，可实现动态加载。类似于Node的require,不过前者是异步加载，后者是同步加载。  
适用场合：
```js
//1.按需加载
btn.addEventListener('click', e => {
    import('../aaa').then(...)
})

//2.条件加载 
if(condition) {
    import('../aaa.js').then(({export1}) => {
        console.log(export1.aa)
    })
}else {
    import('../bbb.js').then(...)
}

//3.动态的模块路径 
function fun() {
    ...
    return xxx
}
import(fun()).then(...)
```

## Set和Map
### Set  
类似于数组，成员的值不会重复，通常用于去重。  
```js
let arr = new Set([1, 1, 2, 3, 3]);
congsole.log([...arr]) //[1,2,3]
console.log(arr.size)  //3
```  
ps： 
1. Set不会进行类型转换，所以不同类型的1和'1'不会执行去重；  
2. 内部判断算法类似与`===`,可以判断NaN,null,undefined等简单类型，数组、对象、正则等无法去重  

关于Set其他方法用得不多，还有weakSet,等用到时再添加。  

### Map  
类似于键值对的结构  
```js
//增删查改
let map = new Map();
map.set('name', 'az'); 
map.get('name'); //az

map.has('name'); //true
map.delete('name);  //true
map.has('name');  false
map.clear(); //清除
```
map也可以接受数组等具有Iterator接口且数据结构如下的数据为参数  
```js
let map = new Map([
    ['name', 'qw'],
    ['age', 23]
])
map.size  //2
map.has('name'); //true
map.get('name'); //qw
```
#### WeakMap  
结构与map类似，引用对象都是弱引用，当引用对象的其他引用都清除，则释放。解决忘记删除引用可能造成的内存泄露问题。  
目前尚未使用，待使用后添加。  

## Promise  
Promise是实现异步的一个对象。避免回调地狱  
**方法**：  
`resolve`，将Promise对象的状态改为成功，并传递一个参数给成功的回调函数  
`reject`, 将Promise对象的状态改为失败，并将错误消息传给失败的回调函数  

**状态**：  
* `Fulfilled`,成功的状态  
* `Rejected`,失败的状态  
* `Pending`, 初始状态，进行中  

**特点**  
1. 对象的状态不受外部影响。  
2. 状态一旦改变，就不会再变。状态改变只有两种可能：`Pending` -> `Fulfilled`, `Pending` -> `Rejected`  

**基本用法**
```js
let promise = new Promise(function(resolve, reject) {
    ...
    if(/*success*/) {
        resolve(value)
    }else {
        reject(error)
    }
})
promise().then(res => {
    console.log('成功',res)
}).catch(err => {
    console.log('失败',err)
})
```  
手写promise  
```js
function ownPromise() {
    this.status = 'pending';
    this.msg = '';
    var process = arguments[0];
    var that = this;
    process(function() {
        that.status = 'resolve';
        that.msg = arguments[0];
    },function() {
        that.status = 'reject';
        that.msg = arguments[0];
    })
    return this;
}

ownPromise.prototype.then = function() {
    if(this.status === 'resolve') {
        arguments[0](this.msg);
    }
    if(this.status === 'reject'&&arguments[1]) {
        arguments[1](this.msg);
    }
}
```
**promise.all()**  
批量执行多个promise时使用，只有当promise.all内所有promise实例执行完毕，promise.all()的状态才会改变,成功返回一个数组  
```js
let p1 = new Promise(
    function(resolve,reject) {
        console.log('成功')
        resolve('ok1')
    }
)

let p2 = new Promise(
    function(resolve,reject) {
        console.log('成功')
        resolve('ok2')
    }
)

Promise.all([p1,p2]).then(res => {
    console.log('成功',res)  //成功，['ok1','ok2']
}).catch(err => {
    console.log('失败',err)
})
```  
上例中任何一个promise实例任何一个执行失败都会报错，报错信息为失败的promise实例返回的错误信息   
手写promise.all:  
```js
function promiseAll(promises) {
    return new Promise(function (resolve, reject) {
        if(!Array.isArray(promises)) {
            return reject(new TypeError('arguments must be an array'));
        }
        let resolvedCount = 0,promiseNum = prmises.length;
        let resolvedValues = new Array(promiseNum);
        for(let i = 0; i < promiseNum; i++) {
           Promise.reolve(promises[i]).then(
                (value) => {
                    resolvedCount++;
                    resolvedValues[i] == value;
                    if(resolvedCount === promiseNum) {
                        return resolve(resolvedValues)
                    }
                },
                (reson) => {
                    return reject(reson)
                }
            )
        }
        
    })
}
```

**promise.race()**  
用法与promise.all()类似，不同的是适用场景，promise.race()是只要其中的promise实例有结果，无论成功或失败，promise.race()的状态就会改变，返回单个结果  

**promise异步串联**  
适用场景：当多个promise实例需要按顺序执行时，使用异步串联  
```js
function four() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(4);
            resolve();
        },2000)
    })
}

function three() {
    return new Promise((resolve,reject) => {
        console.log(3);
        resolve(123);
    })
}
function two(){
	return new Promise(function(resolve, reject) {
	    console.log(2);
        resolve();
    });
}

function one(){
	return new Promise(function(resolve, reject) {
        console.log(1);
        resolve();
    });
}

var p = new Promise((resolve, reject) => {
    resolve();
})
p.then(one)
.then(four)
.then(two)
.then(three)
.then((res) => {
    console.log(res)
})
//1
//4
//2
//3
//123
```


## Proxy 
Proxy意思为代理，在ES6中作用是给目标对象的访问进行拦截，并在内部做相关处理后再返回结果。  
Proxy有两个参数，target和handler, target是被代理的对象，handler是对代理对象的操作。  

**基本用法**：  
```js
let obj = new Proxy({}, {
    get: function(target, key) {
        console.log(`get ${key}`)
        return target[key]
    }, 
    set: function(target, key, value) {
        console.log(`set ${key}`);
        target[key] = value;
        return target[key]
    }
})
obj.count = 1;
//set count 
//1
++obj.count
//get count
//set count
//2
```

handler是空对象时，没有拦截效果，访问handler就是访问target
```js
let target = {};
let handler = {}; 
let proxy = new Proxy(target, handler);
proxy.a = 1;
console.log(target.a) //1
```
同一个拦截器函数可以拦截多个操作，以下Proxy支持的拦截操作：  
* `get(target,propKey,receiverv)`,拦截读取，receiver是可选属性  
* `set(target,propKey,value,receiver)`,拦截设置，返回布尔值  
* `has(target,propKey)`,拦截`propKey in proxy`,返回布尔值  
* `deleteProperty(target,propKey)`, 拦截`delete proxy[propKey]`,返回布尔值  
* `ownKeys(target)`,拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`,返回一个数组（目标对象所有自身属性的属性名）  
* `apply(target,object,args)`,拦截Proxy实例,并将其作为函数调用  
* `construct(target,args)`,拦截Proxy实例,并将其作为构造函数调用   

**扩展**  
在最新的Vue3.0中，将用proxy代替Object.defineProperty()进行数据劫持，实现双向绑定。  
proxy的优势： 
1. 能够监听到数组和对象的变动。   
原因： Object.defineProperty只能劫持对象的属性，需要遍历对象的每个属性，当对象新增属性时，需要重新遍历对象，对新增属性进行劫持。而Proxy是直接代理对象，proxy可以直接通过set方法拦截到对象属性和数组的设置。  
ps:vue2.0中通过vm.$set实现对数组和对象的响应，当target是数组时，调用重写的splice方法更新数组，当target是对象时，如果不是响应式对象或者属性key本就存在就直接赋值，否则调用defineReactive给数据添加getter和setter  
  




