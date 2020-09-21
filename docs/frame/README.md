# 框架架构

## MVC 
Model-View-Controller  
模型(model): 数据保存  
视图(View): 用户界面  
控制器(Controller): 业务逻辑  

MVC所有的通信都是单向的，View传送指令到Controller,Controller完成业务逻辑后要求Model改变状态，Model将新的数据发送给View,用户得到反馈

## MVVM  
Model-View-Viewmodel,是MVC的改进版，可以解决随着业务变复杂，视图交互变复杂导致的Controller臃肿的问题。  
采用双向绑定  


## MVP