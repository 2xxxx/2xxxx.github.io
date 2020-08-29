# this的指向  
this的指向主要分为两种情况：全局上下文和函数上下文。  
## 全局上下文  
在全局上下文中，this指向的window。用var声明一个变量，那么该变量会挂载在window上,用this可以访问该变量。  
```js
var value = 1;
//let value2 = 1; //let声明的变量不会挂载在window上，因为它是块级作用域。
function fun() {
    console.log(this, this.value) //Window  1
    // console.log(this, this.value2) //Window  undefined
}
fun()
```

## 函数上下文  
函数上下文中主要分为三种情况：  
1. 在普通函数中，非严格模式下this指向window,严格模式下,this指向undefined  
```js
function fun () {
    console.log(this)//window
}
fun()
```
2. 在构造函数中，当函数中调用了this,this指向当前函数  
```
var fun = function() {
    this.value = 3
    console.log(this) //fun {value: 3}
}
var test = new fun()
console.log(test.value) //3
```
3. 在箭头函数中，没有this的绑定，如果箭头函数的外部有非箭头函数包裹它，则取最近的非箭头函数中this指向；如果没有包裹就指向window  
```
var fun = function outfun() {
    console.log('外层',this); //外层 outfun{}
    var infun = ()=> {console.log('内层', this)}; //内层 outfun{}
    infun();
}
var test = new fun();
//外层未包裹的情况
var fun = ()=> {console.log('内层', this)}; //内层 window
 fun();
```

## 改变this指向  
改变this指向的方法主要有  
* 箭头函数  
* 声明变量保存this(一种解决办法，不算改变this指向)  
* new 实例化
* call,apply,bind

```
var test = {
    num: 123,
    outfun: function() {
        setTimeout(function() {
           console.log(this.num);  //undefined, 在该例中由于setTimeout是由window调用的，所以this指向的是window,无法访问到test.num
        },1000)
        

    }
}
test.outfun()
```  
修改方法：  
```  
//箭头函数  
var test = {
    num: 123,
    outfun: function() {
        setTimeout(() => {
           console.log(this.num);  //123
        },1000)
        

    }
}
test.outfun()

//call,apply,bind
var test = {
    num: 123,
    outfun: function() {
        setTimeout(function() {
           console.log(this.num);  //123
        }.call(test),1000)

        //setTimeout(function() {
        //   console.log(this.num);  //123
        //}.apply(test),1000)

         //setTimeout(function() {
        //   console.log(this.num);  //123
        //}.bind(test),1000)

    }
}
test.outfun()  

//声明变量保存
var test = {
    num: 123,
    outfun: function() {
        let that = this
        setTimeout(function() {
           console.log(that.num);  
        },1000)
        

    }
}
test.outfun()  
```
new实例改变指向  
```
var fun = function outfun() {
    console.log('外层',this); 
    var infun = ()=> {console.log('内层', this)}; 
    infun();
}
var test = new fun();
//外层 outfun{}
//内层 outfun{}

fun()
//外层 window
//内层 window
```  

**call** 
语法：fun.call(thisArg, arg1, arg2,....)  
使用：第一个参数是this的指向，传参方式是以参数列表的型式  


**apply**  
语法：fun.call(thisArg, [arg1, arg2 ,...])  
使用：第一个参数是this的指向，传参方式是数组的型式  

ps:thisArg为null或undefined时，非严格模式下，this会指向window,严格模式下，this会指向null或undefined。当thisArg的值是基本类型number、string、boolean时，this指向变为基本类型的包装对象（如Number()等等）  

**bind**  
bind与call,apply不一样，bind()会创建一个新的函数，在bind被调用时，新函数中的this是指向第一个参数thisArg.bind是用call和apply实现的  