(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{382:function(e,a,t){"use strict";t.r(a);var s=t(42),r=Object(s.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"webpack"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack"}},[e._v("#")]),e._v(" webpack")]),e._v(" "),t("p",[e._v("webpack是一个资源打包工具。可以使用它管理项目中的模块依赖，"),t("br"),e._v("\n打包原理：识别入口文件，根据模块间的依赖关系进行静态分析，CommonJs、AMD、es6的import都会分析，然后按照指定规则生成静态资源。")]),e._v(" "),t("h2",{attrs:{id:"webpack核心概念"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack核心概念"}},[e._v("#")]),e._v(" webpack核心概念")]),e._v(" "),t("ul",[t("li",[e._v("entry: 入口。构建项目的起点，默认src/index.js")]),e._v(" "),t("li",[e._v("output: 出口。设置webpack打包代码的输出位置和命名，默认./dist")]),e._v(" "),t("li",[e._v("module: 模块。在webpack中一切皆模块，一个模块对应一个文件")]),e._v(" "),t("li",[e._v("chunk: 代码块。一个chunk由多个模块组成，用于代码的合并与分割")]),e._v(" "),t("li",[e._v("loader： 模块转换器。把模块原内容按需求转换成新内容")]),e._v(" "),t("li",[e._v("plugin: 扩展插件。在webpack构建流程中，监听特定事件，并执行相应操作")])]),e._v(" "),t("h2",{attrs:{id:"plugin-和-loader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#plugin-和-loader"}},[e._v("#")]),e._v(" plugin 和 loader")]),e._v(" "),t("p",[e._v("两者都是为了扩展webpack的功能。")]),e._v(" "),t("h3",{attrs:{id:"loader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#loader"}},[e._v("#")]),e._v(" loader")]),e._v(" "),t("p",[e._v("主要功能：转换文件，压缩，打包，翻译。"),t("br"),e._v("\n因为webpack只能打包CommonJs规范的js文件，对于css,图片等格式的文件需要借助loader进行打包。loader运行在NodeJs上，运行在打包文件之前。")]),e._v(" "),t("p",[t("strong",[e._v("常见loader")]),t("br"),e._v("\ncss-loader:遍历CSS文件，找到url()表达式然后进行处理"),t("br"),e._v("\nstyle-loader：把CSS代码插入到页面的style标签中"),t("br"),e._v("\nbabel-loader：将es6的语法转换成es5的语法\nvue-loader: 提供HMR(页面热更新)解决方案")]),e._v(" "),t("p",[e._v("可在webpack.config.js中配置")]),e._v(" "),t("h3",{attrs:{id:"plugin"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#plugin"}},[e._v("#")]),e._v(" plugin")]),e._v(" "),t("p",[e._v("plugin功能更加丰富，主要有：打包优化，压缩，重新定义环境变量等功能，还能携带参数，在整个编译周期都有运行，不直接操作文件，而是监听打包进程的某些节点。")]),e._v(" "),t("p",[t("strong",[e._v("常见plugin")]),t("br"),e._v("\nHotModuleReplacementPlugin: 页面热更新"),t("br"),e._v("\nUglifyJSPlugin: 压缩JS代码"),t("br"),e._v("\nhtml-webpack-plugin:自动打包生成html"),t("br"),e._v("\nextract-text-webpack-plugin: 提取样式到css文件中（webpack4之前引用）"),t("br"),e._v("\nmini-css-extract-plugin: 提取样式到css文件中（webpack4及以上版本使用）。优化：按需加载css"),t("br"),e._v("\noptimize-css-assets-webpack-plugin: 压缩css文件")]),e._v(" "),t("h2",{attrs:{id:"webpack优化"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack优化"}},[e._v("#")]),e._v(" webpack优化")]),e._v(" "),t("ol",[t("li",[t("strong",[e._v("HMR热替换")]),t("br"),e._v("\nHot Module Replcement,作用是对代码进行修改可以在不刷新浏览器的情况下对页面进行更新。当对代码进行修改保存后，webpack将对代码重新打包，并将新的模块发送到浏览器端，浏览器将新模块替换老模块，对应用进行更新，从而减少消耗时间。")])]),e._v(" "),t("p",[e._v("流程：webpack-dev-server和浏览器之间建立一个web socket进行通信，一旦新文件被打包进来，webpack-dev-server就会通知浏览器这个消息，浏览器就可以自动刷新页面或是进行热替换。当一个模块b发生改变，而模块内又没有HMR代码来处理这个消息，那这个消息就会百日传递到依赖b模块的其他模块上，如果消息在新模块页面被捕获就再次传递；如果消息被捕获了应用就按代码进行更新，如果消息一直冒泡到入口文件（entry）还没被捕获的话，就说明代码中没有处理该消息的方法，那webpack就刷新浏览器，从HMR回退到LiveReload.")]),e._v(" "),t("ol",{attrs:{start:"2"}},[t("li",[t("strong",[e._v("tree-shaking")]),t("br"),e._v("\n通过工具“摇”js文件，将不用的代码“摇”掉。在webpack项目中，入口文件相当于一棵树的主干，入口文件有很多依赖的模块相当于树枝，依赖的模块中，有些其实只使用了部分功能，通过tree-shaking可以将没有使用的模块“摇”掉，删除没用到的代码。"),t("br"),e._v("\n工具：对于js通过UglifyJsPlugin进行，对于css通过purify-CSS")])]),e._v(" "),t("p",[e._v("原理： tree-shaking的消除原理依赖于ES6的模块特性。"),t("br"),e._v("\nES6 module特点：1. 只能作为模块顶层的语句出现； 2. import的模块名只能是字符串常量 3. import binding是immutable的"),t("br"),e._v("\nES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是tree-shaking的基础。"),t("br"),e._v("\nps:静态分析，从字面量上对代码进行分析，ES6之前的模块化，动态require一个模块，只有执行后才能只带引用的是什么模块。")]),e._v(" "),t("p",[t("strong",[e._v("提高webpack的构建速度")])]),e._v(" "),t("ol",[t("li",[e._v("多入口的情况下，使用CommonsChunkPlugin来提取公共代码")]),e._v(" "),t("li",[e._v("通过externals配置来提取常用库")]),e._v(" "),t("li",[e._v("使用Happypack实现多线程加速编译")]),e._v(" "),t("li",[e._v("使用webpack-uglify-parallel来提升uglyfyPlugin的压缩速度。原理上webpack-uglify-parallel采用了多核并行压缩来提升压缩速度")]),e._v(" "),t("li",[e._v("使用tree-shaking和Scope Hoisting来提出多余代码")])]),e._v(" "),t("h3",{attrs:{id:"webpack4"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#webpack4"}},[e._v("#")]),e._v(" webpack4")]),e._v(" "),t("p",[e._v("优化：")]),e._v(" "),t("ol",[t("li",[e._v("使用mode来优化配置文件。production模式下可以减少代码体积，删除只在开发环境下用的代码，development模式下可以节约构建时间")])]),e._v(" "),t("div",{staticClass:"language-js extra-class"},[t("pre",{pre:!0,attrs:{class:"language-js"}},[t("code",[e._v("    module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n        mode"),t("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[e._v("'production'")]),e._v("  "),t("span",{pre:!0,attrs:{class:"token comment"}},[e._v("//development")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),t("ol",{attrs:{start:"2"}},[t("li",[e._v("移除commonchunk插件，使用optimization配置。"),t("br"),e._v("\n改动：")])]),e._v(" "),t("ul",[t("li",[e._v("获取vendor和manifest的方式。原先配置两次new webpack.optimize.CommonsChunkPlugin来获取，现在直接在optimization中配置runtimeChunk和splitChunks。")]),e._v(" "),t("li",[e._v("去除webpack.optimize.UglifyJsPlugin,只需配置optimization.minimize为true")])]),e._v(" "),t("ol",{attrs:{start:"3"}},[t("li",[e._v("mini-css-extract-plugin替代extract-text-webpack-plugin")]),e._v(" "),t("li",[e._v("部分插件升级")])])])}),[],!1,null,null,null);a.default=r.exports}}]);