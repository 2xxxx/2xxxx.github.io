# webpack  
webpack是一个资源打包工具。  
打包原理：识别入口文件，根据模块间的依赖关系进行静态分析，CommonJs、AMD、es6的import都会分析，然后按照指定规则生成静态资源。  

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


