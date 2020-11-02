# 原型和原型链    
## 原型
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
person.__proto__ == Person.prototype;
Person.prototype.__proto__ == Person.__proto__.__proto__;
Person.prototype.constructor == Person;
Person.prototype.__proto__ == Object.prototype;
Object.prototype.__proto__ == null;

``` 
 
```js
Object.setPrototypeOf(son,father.ptototype) //设置原型，这样son就能够调用fathert的方法了  
//或是
Object.setPrototypeOf(son,new father())//可以访问到father内的属性，上一个是访问father原型的
Object.getPrototypeOf(son).constructor   //获取son的构造函数  

```


## 原型链  
原型链是实现继承的主要方法。其基本思想是：利用原型让一个引用类型继承另一个引用类型的属性和方法。  

## 原型继承
js实现继承的方法：  
1. 修改原型    
2. 重写原型  
3. 继承原型   

* 原型链继承 
```js  
//  
function father() {}
function son() {}
son.prototype= new father()
var child = new son()
//弊端son.prototype.constructor指向father，son的实例化对象共享father自身的引用类型属性

```  
原型链继承的优缺点：  
优点：继承了父类的模板，又继承了父类的原型对象  
缺点：  
    无法实现多继承(已经指定了原型对象)  
    来自原型对象的所有属性被共享了，如果修改了原型对象中的引用类型属性，那么所有子类创建的实例对象都会收到影响  
    创建子类时，无法像父类构造函数传参
  

* 借助构造函数继承  
```js
function father() {
    this.name = '5441';
}
function son(){
    father.call(this)
} 
var child = new son()
```   
优点：  
    解决了原型链继承中子类实例共享父类引用对象的问题，可以实现多继承  
    可以向父类传递参数  
缺点：  
    son只能继承father自身的属性和方法，而无法继承father原型中的属性和方法  
    child实例不是父类的实例，只是子类的实例，用instanceof无法检测到father  
    无法实现函数复用

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
son.prototype.constructor = son //修复constructor指向
```  
优点：前两种的优点结合  
缺点：父类构造函数father被调用了两次  
    并且生成两个实例，子类实例的属性和方法会覆盖子类原型上的属性和方法，增加不必要的内存  
    只解决了子类实例共享父类引用对象的问题，但是父类原型上的共享还是存在的

* 寄生组合式继承  
```js
function inheritPrototype(son, father) {
    var prototype = Object.create(father.prototype);//创建对象
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
ps：上例中`prototype.constructor = son`设置后，son.prototype.constructor属性是可被遍历的，所以不想被遍历可以用如下方法替换  
```js
Object.defineProperty(son.prototype,'constructor', {
    value: son,
    enumerable: false
})
```    
* 检测是否在原型链上  
1. `instance of`  
2. `isPrototypeOf()`


## 扩展
**new的实现**  
1. 新建一个Object对象  
2. 构造函数的显式原型等于实例函数的隐式原型（继承父类原型上的方法 ）  
3. 通过call,apply绑定到实例上,通过new创建的每个对象会链接到这个实例的prototype对象上(添加父类的属性到新的对象上并初始化. 保存方法的执行结果)  
4. 如果函数（实例）没有返回对象类型Object,那么new表达式中的函数调用会自动返回第一步创建的全新对象  

```js
function ownNew(obj, ...rest){
    //基于obj原型创建一个新的对象
    const newObj = Object.create(obj.prototype);
    //添加属性到新创建的newObj上，并获取obj函数的执行结果
    const result = obj.apply(newbj, rest);
    //如果执行结果有返回值且是一个对象，返回执行的结果，否则，返回新创建的对象
    return typeof result === 'object' ? result : newObj;
}
```
提问，为什么用new调用，不直接调用？  
用new调用，会新建一个实例对象，构造函数原型上的属性和方法都继承到实例对象中，this会指向该实例，如果直接调用，this会指向window,也就无法继承构造函数的属性。  

**Object.create()的实现**  
Object.create(proto,{xxx:xxx}),接收两个参数，第一个是指定的原型对象(xxx.prototype),第二个是给新对象添加的新属性
```js
function ownObject(obj) {
    function f() {};
    f.prototype = obj;
    f.prototype.constructor = f;
    return new f()
}
```
