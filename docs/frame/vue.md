# vue
vue是一个mvvm结构的框架。核心思想主要是组件化和数据驱动。  
优点：从复杂的dom操作中解放出来，由数据变化驱动页面视图更改，只要关心要显示操作哪些数据，要如何显示。  

 

## vue的生命周期  
总共8个，  
创建前后(beforeCreate,created)：处在实例化Vue的阶段，在_init方法中执行。该阶段没有渲染DOM,所以不能访问DOM。    
```js
Vue.prototype._init = function(options?: Object) {
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm,'beforeCreate');
    initInjection(vm);
    initState(vm); //初始化props、data、methods、watch、computed等属性  
    initProvide(vm);
    callHook(vm,'created')
}
```
挂载前后(beforeMount,mounted)： data有初始化,el没有、  
更新前后(beforeUpdate,updated)： 前（完成了el和data初始化，挂载虚拟dom），后（完成挂载，渲染）、  
销毁前后(beforeDestroy,destroyed)    

## 数据  

### data
使用vue都要有一个vue 的根实例，vue的实例对象是其data属性值的代理。根的data属性是一个**对象**，组件内的data属性是**函数**。  

提问，**为什么组件中data是函数**？  
对象是引用类型，当复用组件时，由于数据对象指向同一个data,一个组件修改data会造成其他复用组件的data同时修改，使用函数的话，每次都会返回不同的对象。   

`this.变量 === this._data.变量(this.$data.变量)`。ps:`_`前缀一般是表示私有属性，以`_`或`$`开头的是vue**内置的property、API方法**，为了将内置属性名与开发人员自定义的属性名区分开，一旦自定义以这个开头将不会被Vue实例代理，以免发生冲突。  
 在vue中，data中定义的变量都可以通过this访问到。  
 原理是：vue在初始化的过程中对data做一层代理(通过重写get，set方法)，递归将Data的property转换为getter/setter,从而让data的property能响应数据变化  
 ```js
function initData(vm: Component) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? getData(data,vm) : data || {}
    //----------
    let i = keys.length  
    while(i--){
        cionst key = keys[i]
        //---------
        //关键  
        proxy(vm, `_data`,key)
    }
}  

function proxy(target:object, sourcekey:string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key] // 关键
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val  // 关键
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)

 ```


 ## 特殊属性
 * key    
 取值：`number | string | boolean(2.4.2)|symbol(2.5.12)`
 key可以管理可复用元素，主要用在vue的虚拟DOM算法，在新旧nodes对比时辨别Vndes。这样vue在渲染时可以复用已有元素，而不是重新渲染，加快了渲染速度。  
 该特性在有些时候不符合实际需求，当你需要某个标签重新渲染时，就将该标签的key值修改。  
 有相同父元素的子元素要有独特的key,不然重复的key会造成渲染错误  

 * ref   
 ref被用来给元素或子组件注册引用信息，引用信息会注册在父组件的$refs对象上  
 注意：ref是作为渲染结果被创建的，在初始渲染时不能访问它们，因为还不存在；$refs也不是响应式的，因此不能在模板中做数据绑定


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

受javaScript限制，Vue无法检测到对象的属性添加或删除。Vue在初始化实例时会对属性执行getter/setter转化，所以属性必须在data对象上存在才能转换为响应式的。后续对象再新增响应式属性需要使用Vue提供的`Vue.$set(object,propName,value)`方法。  
vm.$set的实现原理：  
* 如果目标是数组，直接使用数组的splice方法触发响应式；  
* 如果目标是对象，会先判断属性是否存在、对象是否是响应式，最终决定是否进行响应式处理，通过调用defineRective方法(利用Object.defineProperty动态给对象属性添加getter和setter的功能)进行响应式处理  

## 内置方法  
* nextTick：在下次DOM循环更新后执行的延迟回调    
用法： 在修改数据后使用这个方法，获取更新后的DOM。  
原理：Vue是异步更新DOM的，在修改数据后，视图不会立即更新，而是等同一个事件循环(执行栈中的同步任务)中所有数据变化完成后再统一更新  
流程：  
1. （1）修改数据，都是同步任务，还未涉及到DOM。（2）开启一个异步队列，缓冲事件循环中的数据变化，如果同一个watcher被多次触发，只会被推入到队列中一次。  
2. 同步任务执行完后，执行异步watcher队列的队列来更新DOM。Vue在内部对异步队列使用原生的Promise.then和MessageChannel方法，如果执行环境不支持，就使用setTimeout(fn,0)代替。  
3. DOM更新结束后，通过nextTick获取到改变后的DOM。

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
是vue的状态管理器，集中存储管理所有组件的状态，Vuex实现了一个单向数据流，在全局拥有一个State存放数据，当组件要更改State中数据时，必须通过Mutation(commit，同步)修改，异步操作或者批量同步操作则使用Action(dispatch),但Action也是通过Mutation修改State中的数据。最后根据state数据渲染到视图上。getters是State对象的读取方法。  
Vuex存储的数据是响应式的，但是不会保存起来，刷新页面后就会回到初始状态，要想刷新后保存，需要存储在localStorage中（只支持字符串，需要JSON转换）。  

4. **$parent/$children与ref**  
ref: 在普通DOM上使用，引用指向的就是DOM元素，在子组件上使用，就是指向组件实例。  
$parent/$children: 访问父/子实例    

5. **provide和inject**  
应用场景：当父组件有一个方法fn，它的子组件A，子组件的子组件B,子组件的子组件的子组件c都要使用这个方法，A要访问是用`this.$parent.fn()`,B要访问是`this.$parent.$parent.fn()`,c要访问是用`this.$parent.$parent.$paren.fn()`,如果嵌套很多层访问就很麻烦，这时候就能在父组件中使用`provide`来提供被访问的函数，子组件就使用`inject`导入父组件的函数。  
使用：  
provide取值：一个对象或是返回一个对象的函数  
inject取值：一个字符串数组或是一个对象（对象的key是本地的绑定名）
```js
// A
export default {
    provide: function() {
        return {
            fn: this.fn
        }
    },
    data() {},
    methods: {
        fn() {}
    }
}

//B
export default {
    inject: ['fn'],
    props: [],
    created() {
        this.fn()
    }
}
    

```

还有其他通信方法，不常用就没列举。   

### minxins  
minxins是一种实现功能复用的方式，可以定义共用的变量，在组件中使用。  
使用：先定义一个包含需要复用的组件选项的对象，将混入对象导出，在需要复用的组件中导入混入对象，把混入对象混入到当前组件中。    
```js
//定义混入对象
export const myMixin = {
    data() {
        return {
            text:1,
        }
    },
    created() {},
    methods: {

    }
}  
//将混入对象混入到当前组件中
<template>
    <div></div>
</template>
<script>
import {myMixin} from '@/assets/mixin.js'
export default {
    mixins: [myMixin]
}
</script>

```
特点：  
1. 方法和参数在各组件间不共享，组件内修改不会相互影响。  
2. 值为对象的选项，像methods,components这些，选项会合并，如果有冲突，组件中的会覆盖掉混入对象中的。  
3. 值为函数的选项，像created,mounted等，会被合并调用，先调用混入对象里钩子函数内的方法，再调用组件内钩子函数的。  
区别：  
* 与vuex对比，vuex是做状态管理，里面的变量每个组件都能访问和修改，是相互影响的。  
* 与公共组件对比，公共组件中父组件单独开辟一块独立空间给子组件，使用props传值，本质上两者是独立的；而mixins则是在组件原有的对象和方法上进行扩展，融为一体。


## vue-router  
hash和history模式的区别:  
vue默认hash模式，url改变时页面不会重新加载

**hash模式**  
基于location.hash(#后的内容)实现的。  
特性：
* URL中hash值只是客户端的一种状态，也就是当向服务器发送请求时，hash部分不会被发送。  
* hash值的改变会在浏览器中添加历史记录，可以通过浏览器前进后退来控制hash切换  
* 通过a标签设置href属性，用户点击标签后，hash值会改变；js中对location.hash赋值，也会使之改变；  
* hash模式是通过改变锚点(#)来更新页面URL，并不会触发页面重新加载，我们可以通过window.onhashchange监听到hash的改变，从而处理路由。  

**history模式**  
HTML5提供的History API来实现URL的变化。其中最主要的API是`history.pushState()`和`history.replaceState()`,这两个API可以在不刷新的情况下，操作浏览器的历史记录。不同的是，前一个是新增历史记录，后一个是替换当前历史记录。  
特性：  
* 通过调用window.history对象上的一系列方法（pushState和replaceState）来实现URL变化  
* 使用popstate事件来监听url变化，从而对页面进行无刷新跳转  
* history.pushState()或history.replaceState()不会触发popstate事件，这时我们需要手动触发页面跳转。


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

### methods  
methods会被混入到vue实例中，可以通过vm实例访问里面的方法，方法中的this自动绑定为vue实例

### 计算属性  
变量需要进行复杂的逻辑操作时，可使用计算属性，它可以像绑定普通property一样在模板中绑定。  
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

### 监听属性  
当需要在数据变化时执行异步或开销较大的操作时，适合用watch来响应数据的变化，例如页面中搜索框实时搜索等可以适用。  
watch允许执行异步操作，限制操作频率，并在得到最终结果前设置中间状态。  

## Vue SSR  
SSR是什么？  
**服务端渲染**。由服务端来根据标签渲染成整个html片段，再直接返回给客户端。  
**优点**  
1. 更好的SEO，搜索引擎的爬虫工具可以直接查看完全渲染的页面。    
2. 解决首屏加载速度过慢的问题。  
**缺点**   
1. 开发条件受限。SSR目前只支持beforeCreate和created生命周期钩子函数，有些代码可能需要特殊处理  
2. 构建设置和部署要求更高。以前的完全静态单页面程序（SPA）可以部署在任何静态文件服务器上，而SSR需要处于Node.js server环境下  
3. 更多的服务器负载

## 指令  

### 自定义指令
目的: 对普通的DOM元素进行底层操作  

## vue-cli  
基于Vue.js进行快速开发的完整系统，实现交互式的项目脚手架  

配置：  
* proxyTable:设置后可以实现开发环境下跨域  

vue-cli配置优化  
1. preload. 指定页面加载后很快会被用到的资源（js、css文件）.`<link rel="preload">`  
```js
module.exports = {
    chainWebpack: config => {
        //移除preload插件
        config.plugins.delete('prefetch')
    }
}
```  
2. prefetch.告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容  
3. 处理静态资源。  
（1）从相对路径导入。在js、css或.vue文件中使用相对路径引用静态资源时，这类引用会被webpack处理，可以减少http请求数量。放在public目录下或通过绝对路径则会直接拷贝  
4.图片压缩。在vue.config.js中使用image-webpack-loader.执行很长的loader可以在之前使用cache-loader缓存下来




 


