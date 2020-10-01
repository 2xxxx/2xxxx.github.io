# 原型和原型链  
js分为函数对象和普通对象，每个对象都有_proto_属性，但是只有函数对象才有prototype属性。  
Object、Function都是js内置的函数，类似的还有常用的Array、RegExp、Date、Boolean、Number、String.  
属性_proto_是一个对象，它有两个属性，constructor和_proto_;
原型对象prototype有一个默认的constructor属性，用于记录实例是由哪个构造函数创建的。  

每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针  
例如：  
```js
//Person是构造函数
//Person的prototype指向实例原型Person.prototype
var person = new Person();
person._proto_ = Person.prototype;
Person.prototype.constructor = Person;
Person.prototype._proto_ = Object.prototype;
Onject.prototype._proto_ = null;

```

原型链：原型链是实现继承的主要方法。其基本思想是：利用原型让一个引用类型继承另一个引用类型的属性和方法。  

js实现继承  
* 原型链继承 
```js  
//  
//1
son.prototype = father.prototype
//弊端：son.prototype.constructor指向father,需要手动更改为son,son的实例化对象只能继承father原型中的方法，无法继承father本身的属性  
//2
son.prototype= new father()
//弊端son.prototype.constructor指向father，son的实例化对象共享father自身的引用类型属性

```  
ps: new的实现  
1. 新建一个Object对象  
2. 构造函数的显示原型等于实例函数的隐式原型  
3. 通过call,apply绑定到实例上  
4. 通过new创建的每个对象会链接到这个实例的prototype对象上  
5. 如果函数（实例）没有返回对象类型Object,那么new表达式中的函数调用会自动返回第一步创建的全新对象  

提问，为什么用new调用，不直接调用？  
用new调用，会新建一个实例对象，构造函数原型上的属性和方法都继承到实例对象中，this会指向该实例，如果直接调用，this会指向window,也就无法继承构造函数的属性。  

* 借助构造函数继承  
```js
function father() {
    this.name = '5441';
}
function son(){
    father.call(this)
}
//弊端: son只能继承father自身的属性，而无法继承father原型中的方法
```  

* 组合式继承
```js  
 function father() {
    this.name = '5441';
}
function son(){
    father.call(this)
}
son.prototype = new father();

var s = new son();
//弊端，通过father.call()和new father(),父类构造函数father被调用了两次

```  

* 寄生组合式继承  
```js
function inheritPrototype(son, father) {
    var prototype = object(father.prototype);//创建对象
    prototype.constructor = son; //增强对象
    son.prototype = prototype; //指定对象

    function father() {
        this.arr =[1,2];
    }
    function son() {
        father.call(this);
    }
    inheritPrototype(son, father);

    var c1=new son(),c2 = new son();
    c1.arr.push(3);//[1,2,3]
    c2.arr;//[1,2]

    //优点：可以多重继承，解决两次调用，解决实例共享引用类型的问题，原型链保持不变
}
```