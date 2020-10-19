# 框架架构

## MVC 
Model-View-Controller  
模型(model): 数据保存  
视图(View): 用户界面  
控制器(Controller): 业务逻辑  

MVC所有的通信都是单向的，View传送指令到Controller,Controller完成业务逻辑后要求Model改变状态，Model将新的数据发送给View,用户得到反馈

## MVVM  
Model-View-Viewmodel,是MVC的改进版，可以解决随着业务变复杂，视图交互变复杂导致的Controller臃肿的问题。  
优势： 促进前端开发与后端业务逻辑的分离，提高前端开发效率
MVVM的核心是ViewModel层，负责转换Model中的数据对象来让数据变得更容易管理和使用，向上**与视图层进行双向数据绑定**，向下**与Model层通过请求进行数据交互**。  
1. **View**  
View是视图层，也就是用户界面。主要由HTML和CSS构建  
2. **Model**  
Model是指数据模型，对前端来说就是后端提供的API接口  
3. **ViewModel**   
ViewModel是视图数据层。在这层，前端开发者对从后端获取的Model数据进行转换处理，做二次封装，生成View层使用预期的视图数据模型。ViewModel封装的数据模型包括视图的状态和行为两部分，而Model层的数据模型只包含状态。  
MVVM框架实现了双向绑定，这样ViewModel的内容会实时展现在View层，不用再通过操作DOM去更新View层。


## MVP