# vue
vue是一个mvvm结构的框架。核心思想主要是组件化和数据驱动。  
优点：从复杂的dom操作中解放出来，由数据变化驱动页面视图更改，只要关心要显示操作哪些数据，要如何显示。  

使用vue都要有一个vue 的根实例，vue的实例对象是其data属性值的代理。根的data属性是一个对象，组件内的data属性是函数。  

提问，为什么组件中data是函数？对象是引用类型，当复用组件时，由于数据对象指向同一个data,一个组件修改data会造成其他复用组件的data同时修改，使用函数的话，每次都会返回不同的对象。  

## vue的生命周期  
总共8个，  
创建前后(beforeCreate,created)：el(Events&Lifecycle)和data都没初始化、  
挂载前后(beforeMount,mounted)： data有初始化,el没有、  
更新前后(beforeUpdate,updated)： 前（完成了el和data初始化，挂载虚拟dom），后（完成挂载，渲染）、  
销毁前后(beforeDestroy,destroyed)  

## 双向绑定    
原理: 采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter和getter,在数据变动时发布消息给订阅者，触发相应的监听回调。  

流程：  
1. 实现一个数据监听器Observer,能够对数据所有属性进行监听，如有变动可拿到最新值并且通知订阅者。  
2. 实现一个指令解析器Compile,对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数。 
3. 实现一个Watcher，作为连接Observer和Compile的桥梁，能订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图。  
4. mvvm入口函数，整合以上三者。
具体方法：
1. getAttribute获取属性，正则收集指令  
2. 指令添加处理函数  
3. data内的对象用defineProperty监听，在变化时进行拦截。  
4. 检测到数据变化后更新对应的DOM节点  
```html
<input type='text' id='str' onkeyup='func()'>
<span id='spans'>{{text.name}}</span>   

<script>
    var data = {
        name: 1
    }
    var subs = [];
    observe(data)
    // function func() {
    //     let str = document.getElementById('str').value;  
    //     text.name = str;

    // }  
    // function fun1() {
    //     let spannode = document.getElementById('spans');
    //     spannode.innerText = text.name 
    // }
    function observe(data) {
        if(!data || typeof data !== 'object') return  
        //取出所有属性遍历
        Object.keys(data).forEach((key) => {
            definekey(data, key, data[key])
        })
    }
    function definekey(data, key, val){
        var dep = new Dep()
        observe(val);  //监听子属性
        Object.defineProperty(data,key, {
            enumerable: true, //可枚举
            configurable: false,  //不能再define
            get: function() {
                return val
            },
            set: function(newval) {
                if(val === newval) return
                val = newval;
                dep.notify()  //通知所有订阅者
            }
        })
    }  
    function Dep() {
        subs = [];
    }
    Dep.prototype = {
        addSub: function(sub) {
            subs.push(sub)
        },
        notify: function() {
            subs.forEach(function(sub) {
                sub.update();
            })
        }
    }
    data.name = 2;
</script>
```

## vue组件通信  
1. **props/$emit** 
父组件A通过props向子组件B传递，子组件向父组件通过子组件中的$emit，父组件中的v-on实现  

2. **$emit/$on** 
通过一个空的Vue实例作为中央事件总线来触发事件和监听事件，可以实现任意组件间的通信。  
```js 
var ebus = new Vue();
ebus.$emit(event, ...arg);
ebus.$on(event, cb);
ebus.$off(event, cb); //在组件销毁是可取消响应，以免冲突
```

3. **Vuex**  
是vue的状态管理器，Vuex实现了一个单向数据流，在全局拥有一个State存放数据，当组件要更改State中数据时，必须通过Mutation(commit，同步)修改，异步操作或者批量同步操作则使用Action(dispatch),但Action也是通过Mutation修改State中的数据。最后根据state数据渲染到视图上。getters是State对象的读取方法。  
Vuex存储的数据是响应式的，但是不会保存起来，刷新页面后就会回到初始状态，要想刷新后保存，需要存储在localStorage中（只支持字符串，需要JSON转换）。  

4.**$parent/$children与ref**  
ref: 在普通DOM上使用，引用指向的就是DOM元素，在子组件上使用，就是指向组件实例。  
$parent/$children: 访问父/子实例  

还有其他通信方法，不常用就没列举。  


## vue-router  
hash和history模式的区别:  
vue默认hash模式，url改变时页面不会重新加载

hash模式是通过改变锚点(#)来更新页面URL，并不会触发页面重新加载，我们可以通过window.onhashchange监听到hash的改变，从而处理路由。
history模式是通过调用window.history对象上的一系列方法来实现页面的无刷新跳转


## 虚拟dom  
虚拟dom是根据真实dom提炼出的简单树状对象，将真实dom中的属性简化如下：  
```js
{
    tag: 'div',  //标签名  
    data: {},   //属性数据，包括class,style,event,props,attrs等  
    children: [], //子节点数组，也是vnode结构  
    text: undefined, //文本
    elm: undefined,  //真实dom,旧的Vnode指向真实的node,新的Vnode指向undefined
    key: undefined  //节点标识
}
```
 Vue是由数据驱动视图，当某个数据修改时，视图在修改部分进行局部刷新。想要精准的找到视图就需要拿到数据改变前后的dom结构，找到差异并更新。   

 ### diff  
 diff实现主要通过两个方法：patchVnode和updateChildren。 

 虚拟dom比较：将新节点和旧节点做比较，对差异打补丁(patchVnode)。节点比较时，如果不相似则新建一个节点，如过相似则先对比节点data属性里的字段，有不同的就调用update函数进行更新，再是对子节点进行比较,如果在比较过程中找到了相似的childVnode,则递归进入新的打补丁的过程。  

 源码实现：  
 ```js 
    function patch(oldVnode, vnode) {
        var elm,parent;
        if(sameVnode(oldVnode,vnode)) {
            //若相似就打补丁   
            patchVnode(oldVnode,vnode)
        }else {
            //不相似，直接覆盖  
            elm = oldVnode.elm;  
            parent = api.parentNode(elm);
            createElm(vnode);  
            if(parent !== null) {
                api.insertBefore(parent, vnode, elm, api.nextSibling(elm));  
                removeVnodes(parent,[oldVnode],0 ,0);  
            }
        }
        return vnode.elm;
    }  

    function sameVnode(a,b) {
        //判断新旧vnode，比较tag和key是否一致
        return a.key === b.key && a.tag === b.tag;
    }  

    //打补丁
    function patchVnode(oldVnode, vnode) {
        //新节点引用旧节点的dom  
        let elm = vnode.elm = oldVnode.elm;
        const oldCh = oldVnode.children;  
        const ch = vnode.children;

        //调用update钩子,打补丁就是调用update函数，更新真实dom的属性  
        if(vnode.data) {
            updateAttrs(oldVnode, vnode);
            updateClass(oldVnode, vnode);
            updateEventListener(oldVnode, vnode);
            updateProps(oldVnode, vnode);
            updateStyle(oldVnode, vnode);
        }

        //update函数实例  
        function updateAttrs(oldVnode, vnode){
            let key,cur,old
            const oldAttrs = oldVnode.data.attrs || {};
            const attrs = vnode.data.attrs || {};

            //更新/添加属性 . 遍历vnode属性，如果和oldVnode不一样就调用setAttribute;
            for(key in attrs) {
                cur = attrs[key];
                old = oldAttrs[key];
                if(old !== cur) {
                    if(booleanAttrsDict[key] && cur == null) {
                        //判断是否在布尔类型的属性字典中，例如async,autoplay,checked,autofocus等需要先移除该属性。
                        elm.removeAttribute(key);
                    }else {
                        //新增，更新
                        elm.setAttribute(key, cur)
                    }
                } 
            }

            //删除新节点不存在的属性. 遍历oldVnode属性，如果不在vnode属性中就调用removeAttribute删除
            for(key in oldAttrs) {
                if(!(key in attrs)) {
                    elm.removeAttribute(key)
                }
            }
        }

        //判断是否为文本节点 ，如果是就不考虑子节点的比较
        if(vnode.text == undefined) {
            //如果不是：
             
            
            if(isDef(oldCh) && isDef(Ch)) {
               // 1.新旧节点都有children,那就进入子节点比较(diff);
               if(oldCn !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
            }else if(isDef(ch)) {
                //2.新节点有children，旧节点没有，那就循环创建dom节点  
                if(isDef(oldVnode.text)) api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length -1, insertedVnodeQueue)
            }else if(isDef(oldCh)) {
                //3.新节点没有children,旧节点有，就循环删除dom节点 
                removeVnodes(elm, oldCh,0, oldCh.length -1) 
            }else if(isDef(oldVnode.text)) {
                api.setTextContent(elm, '')
            }
        }else if(oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text)
        }
    }
```


### 计算属性  
变量需要进行复杂的逻辑操作是，可使用计算属性，它可以像绑定普通property一样在模板中绑定。  
通常我们可以将同一函数定义为方法methods，也可以定义为计算属性computed，两个方式的结果是一样的。但是不同的是，计算属性会**基于响应式依赖进行缓存**，也就是说，只有该属性依赖的响应式数据发生改变时，计算属性才会重新求值，否则计算属性就会回复上次缓存的值，不会再次执行函数。而方法methods是**每次调用时都会执行函数**。所以，当不需要缓存时，就用方法来代替计算属性。  
提问，为什么计算属性要缓存呢？  
为了节省计算开销，适用于计算量大或者修改频率低的情况。如果有一个计算属性要遍历庞大的数组且有大量计算，而其他计算属性又依赖于该属性时，没有缓存，会要多次执行该属性的getter。  

计算属性的实现：  
computed初始化、首次渲染、触发更新  
过程：  
* 首次渲染时实例化computeedWather并定义属性dirty: false,在render过程中求值并进行依赖收集  
* 当computedWather订阅的响应式数据改变时，触发computedWatcher更新，修改dirty: true  
* render函数执行时读取计算属性，发现dirty为true就重新求值，并更新页面视图。  
```js
//1.定义_computedWatchers。首先定义一个watcher空对象，挂在vm._computedWatchers上，用来存放vm实例的所有computedWather
function initComputed(vm, computed) {
    const watchers = vm._computedWathers = Object.create(null);
    //遍历computed选项，依次定义
    for(const key in computed) {
        const getter = computed[key];
        //2.实例化computedWather,为计算属性创建内部watcher
        watchers[key] = new Wather(
            vm,
            getter || noop, 
            noop,
            computedWatcherOptions //{lazy:true},指定lazy属性，表示要实例化的是computedWatcher

        )
        //3.为计算属性定义getter
        defineComputed(vm,key,userDef)
    }
}

// 实例化computedWather
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        // options是{lazy: true}
        if(options) {
            this.lazy = !options.lazy
        }
        this.dirty = this.lazy //lazy watcher,初始为true
        this.getter = expOrFn;
        //lazy为true的话，不进行求值，直接返回undefined
        this.value = this.lazy ? undefined : this.get();
       
    },
     evaluate() {
         this.value = this.get();
         this.dirty = false;
     },
    depend() {
        //对dep的响应式数据进行依赖收集，
        let i = this.deps.length;
        while(i--) {
            this.deps[i].depend()
        }
    },
    update() {
        if(this.lazy) {
            this.dirty = true; //dirty为true,表示要重新计算
        }
        queueWather(this); //加入异步更新队列，最终会执行render函数来生成vnode，同首次渲染一样，触发getter
    }
    
}
//wather对象
// {
//     xxx: Watcher {
//         lazy: true,
//         dirty: true,
//         deps:[],
//         getter: function() {
//             return ...
//         },
//         value: undefined
//     }
// }

// 定义计算属性getter
function defineComputed(target, key, userDef) {
    Object.defineProperty(target, key, {
        get: function() {
            const watcher = this._computedWathers && this.computedWathers[key];
            if(watcher) {
                if(watcher.dirty) {
                    //dirty为true,执行get进行求值,并将dirty设置为false
                    watcher.evaluate()
                }
                if(Dep.target) {
                    watcher.depend()
                }
                return wather.value
                
            }

        },
        set: function() {
            //进行更新
        }

    })
}
```  
由上述可知，computedWather主要是修改dity属性为true,计算属性依赖的响应式数据a被会computedWatcher订阅，即数据a的dep会收集该computedWatcher，一旦发生变化，就会触发computedWather更新，dirty置为true,重新求值；若是依赖数据没有变化，则不会触发更新，dirty仍为false，render不会重新求值，这样就起到了缓存的作用




 


