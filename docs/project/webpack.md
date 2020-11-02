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
```js
var path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
    //webpack打包入口
  entry: {  //可配置多个入口文件
    app: './src/main.js'
  },
  //定义webpack如何输出的选项
  output: {
    path: path.resolve(__dirname, '../dist'), //文件输出目标路径
    filename: '[name].js',
    publicPath: '/'    //构建文件的输出目录
  },
  //解析模块的可选项
  resolve: {
    extensions: ['.js', '.vue', '.json'],   //用到的文件扩展
    alias: {   //模块的别名列表
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  //模块相关配置
  module: {
      //配置模块loader，解析规则
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',  //调整webpack处理顺序。pre(优先)、normal(默认，正常)、inline(其次处理)、post(最后处理)
        include: [resolve('src'), resolve('test')],  //手动添加处理文件，exclude:屏蔽无需处理文件
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(swf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/,
        loader: 'file-loader',
        options: {
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
        
      }
    ]
  },
  plugins:[
      new ExtractTextPlugin('style.css')
  ]
}
```

## webpack的加载  
构建流程：webpack启动后会从entry里配置的入口模块开始递归解析entry依赖的所有module,每找到一个module，就匹配对应的loader进行转换，之后再解析当前module所依赖的模块。这些模块会以entry为单位进行分组，一个entry和它所依赖的模块组成一个chunk。最后webpack将所有chunk转换成文件输出。在整个流程中，webpack会在某些进程节点执行plugin

## plugin 和 loader  
两者都是为了扩展webpack的功能。  

### loader  
主要功能：转换文件，压缩，打包，翻译。  
因为webpack只能打包CommonJs规范的js文件，对于css,图片等格式的文件需要借助loader进行打包。loader运行在NodeJs上，运行在打包文件之前。

**常见loader**  
`css-loader`:遍历CSS文件，找到url()表达式然后通过特定的语法规则进行内容转换(会转换成数组)  
`style-loader`：把CSS代码插入到页面的style标签中  
`babel-loader`：将es6的语法转换成es5的语法  
`vue-loader`: 提供HMR(页面热更新)解决方案  

由于webpack中loader的执行顺序是从右往左，从下往上，所以需要主要loader引入的先后顺序，比如style-loader和css-loader,需要先将css模块解析完毕再创建script标签，所以css-loader要在style-loader的下方或右方引入，或者是设置enforce调整顺序。  

实现：  
```js
//style-loader
module.exports = function(source) {
    let script =  (`
        let style = document.createElement("style");
        style.innerText = ${JSON.stringify(source)};
        document.head.appendChild(style)
    `)
    retrun script
}
```

### plugin  
plugin功能更加丰富，主要有：打包优化，压缩，重新定义环境变量等功能，还能携带参数，在整个编译周期都有运行，不直接操作文件，而是监听打包进程的某些节点。  

**常见plugin**  
`HotModuleReplacementPlugin`: 页面热更新(不在生产环境中使用)  
`UglifyJSPlugin`: 压缩JS代码  
`html-webpack-plugin`:自动打包生成html  
`extract-text-webpack-plugin`: 提取样式到css文件中（webpack4之前引用）  
`mini-css-extract-plugin`: 提取样式到css文件中（webpack4及以上版本使用）。优化：按需加载css  
`optimize-css-assets-webpack-plugin`: 压缩css文件
`CommonsChunkPlugin`:将一些公共代码分割成一个chunk,实现单独加载(该插件适用于webpack3及以前，webpack4后被废弃，开始使用SplitChunksPlugin)      

实现：  
```js
class FileListPlugin{
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tap('FileListPlugin',function(compilation) {
            let fileList = 'filelist:\n\n';
            for(let filename in compilation.assets) {
                fileList += ('- '+ filename + '\n');
            }
            compilation.assets['filelist.md'] = {
                source() {
                    return filelist;
                },
                size() {
                    return filelist.length
                }
            }
        })
    }
}
module.exports = FileListPlugin;
```

## webpack优化  
1. **HMR热替换**  
Hot Module Replcement,作用是对代码进行修改可以在不刷新浏览器的情况下对页面进行更新。当对代码进行修改保存后，webpack将对代码重新打包，并将新的模块发送到浏览器端，浏览器将新模块替换老模块，对应用进行更新，从而减少消耗时间。  

流程：webpack-dev-server和浏览器之间建立一个web socket进行通信，一旦新文件被打包进来，webpack-dev-server就会通知浏览器这个消息，浏览器就可以自动刷新页面或是进行热替换。当一个模块b发生改变，而模块内又没有HMR代码来处理这个消息，那这个消息就会被传递到依赖b模块的其他模块上，如果消息在新模块页面没被捕获就再次传递；如果消息被捕获了应用就按代码进行更新，如果消息一直冒泡到入口文件（entry）还没被捕获的话，就说明代码中没有处理该消息的方法，那webpack就刷新浏览器，从HMR回退到LiveReload.   


2. **tree-shaking**  
通过工具“摇”js文件，将不用的代码“摇”掉。在webpack项目中，入口文件相当于一棵树的主干，入口文件有很多依赖的模块相当于树枝，依赖的模块中，有些其实只使用了部分功能，通过tree-shaking可以将没有使用的模块“摇”掉，删除没用到的代码。  
工具：对于js通过UglifyJsPlugin进行，对于css通过purify-CSS  

原理： tree-shaking的消除原理依赖于ES6的模块特性。  
ES6 module特点：1. 只能作为模块顶层的语句出现； 2. import的模块名只能是字符串常量 3. import binding是immutable的  
ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。  
ps:静态分析，从字面量上对代码进行分析，ES6之前的模块化，动态require一个模块，只有执行后才能知道引用的是什么模块。

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
3. mini-css-extract-plugin替代extract-text-webpack-plugin(提取css代码，避免css被打包到js中，虽然能用，但是会使js文件体积变大)，按需加载   
优势：  
* 异步加载  
* 不重复编译，性能更好  
* 只针对CSS 
4. 部分插件升级  


## 扩展  
**CommonJS和ES6模块的区别**  
* CommonJS输出的是**值的拷贝**，利用require（require在ES6中也有效，babel会把import转换为require）导入module.export导出，对简单类型来说一旦输出该值，模块内部的变化不会影响到这个值，因为值会被缓存，除非写成一个函数，才能得到内部变化的值；ES6模块输出的是**值的引用**，利用export导出import导入，是属于动态引用，不会缓存  
* CommonJS是运行时加载，ES6模块是编译时输出接口   
即使使用的是ES6模块系统，如果借助babel转换，ES6的模块系统最终还是会转换成CommonJS的规范 


