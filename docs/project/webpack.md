# webpack  
webpack是一个资源打包工具。可以使用它管理项目中的模块依赖，  
打包原理：识别入口文件，根据模块间的依赖关系进行静态分析，CommonJs、AMD、es6的import都会分析，然后按照指定规则生成静态资源。  

## webpack核心概念  
* entry: 入口。构建项目的起点，默认src/index.js  
* output: 出口。设置webpack打包代码的输出位置和命名，默认./dist  
* module: 模块。在webpack中一切皆模块，一个模块对应一个文件     
* chunk: 代码块。一个chunk由多个模块组成，用于代码的合并与分割  
* loader： 模块转换器。把模块原内容按需求转换成新内容  
* plugin: 扩展插件。在webpack构建流程中，监听特定事件，并执行相应操作

## plugin 和 loader  
两者都是为了扩展webpack的功能。  

### loader  
主要功能：转换文件，压缩，打包，翻译。  
因为webpack只能打包CommonJs规范的js文件，对于css,图片等格式的文件需要借助loader进行打包。loader运行在NodeJs上，运行在打包文件之前。

**常见loader**  
css-loader:遍历CSS文件，找到url()表达式然后进行处理  
style-loader：把CSS代码插入到页面的style标签中  
babel-loader：将es6的语法转换成es5的语法
vue-loader: 提供HMR(页面热更新)解决方案  

可在webpack.config.js中配置

### plugin  
plugin功能更加丰富，主要有：打包优化，压缩，重新定义环境变量等功能，还能携带参数，在整个编译周期都有运行，不直接操作文件，而是监听打包进程的某些节点。  

**常见plugin**  
HotModuleReplacementPlugin: 页面热更新  
UglifyJSPlugin: 压缩JS代码  
html-webpack-plugin:自动打包生成html  
extract-text-webpack-plugin: 提取样式到css文件中（webpack4之前引用）  
mini-css-extract-plugin: 提取样式到css文件中（webpack4及以上版本使用）。优化：按需加载css  
optimize-css-assets-webpack-plugin: 压缩css文件    

## webpack优化  
1. **HMR热替换**  
Hot Module Replcement,作用是对代码进行修改可以在不刷新浏览器的情况下对页面进行更新。当对代码进行修改保存后，webpack将对代码重新打包，并将新的模块发送到浏览器端，浏览器将新模块替换老模块，对应用进行更新，从而减少消耗时间。  

流程：webpack-dev-server和浏览器之间建立一个web socket进行通信，一旦新文件被打包进来，webpack-dev-server就会通知浏览器这个消息，浏览器就可以自动刷新页面或是进行热替换。当一个模块b发生改变，而模块内又没有HMR代码来处理这个消息，那这个消息就会百日传递到依赖b模块的其他模块上，如果消息在新模块页面被捕获就再次传递；如果消息被捕获了应用就按代码进行更新，如果消息一直冒泡到入口文件（entry）还没被捕获的话，就说明代码中没有处理该消息的方法，那webpack就刷新浏览器，从HMR回退到LiveReload.   


2. **tree-shaking**  
通过工具“摇”js文件，将不用的代码“摇”掉。在webpack项目中，入口文件相当于一棵树的主干，入口文件有很多依赖的模块相当于树枝，依赖的模块中，有些其实只使用了部分功能，通过tree-shaking可以将没有使用的模块“摇”掉，删除没用到的代码。  
工具：对于js通过UglifyJsPlugin进行，对于css通过purify-CSS  

原理： tree-shaking的消除原理依赖于ES6的模块特性。  
ES6 module特点：1. 只能作为模块顶层的语句出现； 2. import的模块名只能是字符串常量 3. import binding是immutable的  
ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。  
ps:静态分析，从字面量上对代码进行分析，ES6之前的模块化，动态require一个模块，只有执行后才能只带引用的是什么模块。

**提高webpack的构建速度**  
1. 多入口的情况下，使用CommonsChunkPlugin来提取公共代码  
2. 通过externals配置来提取常用库  
3. 使用Happypack实现多线程加速编译  
4. 使用webpack-uglify-parallel来提升uglyfyPlugin的压缩速度。原理上webpack-uglify-parallel采用了多核并行压缩来提升压缩速度  
5. 使用tree-shaking和Scope Hoisting来提出多余代码

### webpack4  
优化：  
1. 使用mode来优化配置文件。production模式下可以减少代码体积，删除只在开发环境下用的代码，development模式下可以节约构建时间  
```js
    module.exports = {
        mode: 'production'  //development
    }
```  
2. 移除commonchunk插件，使用optimization配置。  
改动：  
* 获取vendor和manifest的方式。原先配置两次new webpack.optimize.CommonsChunkPlugin来获取，现在直接在optimization中配置runtimeChunk和splitChunks。  
* 去除webpack.optimize.UglifyJsPlugin,只需配置optimization.minimize为true  
3. mini-css-extract-plugin替代extract-text-webpack-plugin  
4. 部分插件升级


