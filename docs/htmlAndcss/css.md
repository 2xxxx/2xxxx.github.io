# CSS  
## 两列布局   
```html
<div class="father"> 
    <div class="box left"></div>
    <div class="box right"></div>
</div>

```  
```css
.box {  /*通用*/
    border:1px solid black;
    height:300px;
}
```
实现左边固定，右边自适应  

1. `position + margin-left`：两列中间有间隙
```css

.left {
    position: absolute;
    left:0;
    width:200px;
}
.right {
    margin-left:200px;
}
```  
2. `float + overflow:auto `:两列中间无间隙  
```css
.left {
    float: left;
    width: 200px;
}
.right {
    overflow: auto;
}
```  
3. flex布局 :两列中间无间隙 
```css
.father {
    display:flex;
}
.left {
    width:200px;
}
.right {
    flex-grow: 1;
}
```  

## 三列布局
```html
<div class="father"> 
    <div class="box left"></div>
    <div class="box right"></div>
    <div class="box main"></div>
</div>

```    
两边固定，中间自适应  
1. 左右绝对定位，中间设置margin  
```css
.left,.right {
    width:200px;
    position: absolute;
    top:0;
}
.left {left: 0}
.right {right:0}
.main {
    margin:0 200px;
}
```  

2. 左右用float,中间设置margin。ps:该方法中html一定要是未浮动元素在浮动元素后面，因为未浮动元素会单独占据一行，将浮动元素挤下去
```css
.left {
		float:left;
		width:200px;
	}

.right {
    float: right;
    width:200px;
    overflow: auto;
}
.main {
    margin: 0 200px;

}
```

3. flex布局  
```css
.father {
    display:flex;
}
.left {
    order: 1;
    width:200px
}
.right {
    order: 3;
    width:200px;
}
.main {
    order:2;
    flex-grow: 1;
    
}
```

## 垂直水平居中   
```html 
<div class="father">
    <div class="content"></div>
</div>
```  
```css
/*通用*/
.father {
    border:1px solid red;
    width:300px;
    height:300px;
}
.content {
    background-color: red;
    width:100px;
    height:100px;
}
```

1. `absolute + 负margin`  
```css
.father {position: relative;}  
.content {
    position:absolute;
    top: 50%;
    left:50%;
    margin-left:-50px;
    margin-top:-50px;
}
```  

2. `absolute + magin:auto`  
```css
.father {position: relative;}
.box {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin: auto;
}
``` 

3. `absolute+calc`  
```css
.father {position: relative}
.content {
    position: absolute;
    top: calc(50% -50px);
    left: calc(50% - 50%);
}
```  

4. `absolute + transform`: 该方法可以不需要子元素固定宽高(以下方法都不用),兼容性方面需要依赖translate2d  
```css
.father {position: relative;}
.content {
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
}
```  

5. `text-align + vertical-align + line-height`  
```css
.father {
    line-height:300px;
    text-align: center;
}
.content {
    display: inline-block;
    vertical-align: middle;
    line-height: initial;
}
```  

6. `writing-mode`:可以改变文字方向
```html
<div class="father">
    <div class="inner">
        <div class="content"></div>
    </div>
</div>
```  
```css
.father {
    writing-mode: vertical-lr;  /*垂直方向*/
    text-align: center;
}
.inner {
    writing-mode:horizontal-tb; /*水平方向*/
    display: inline-block;
    text-align: center;
    width:100%;
}
.content {display:inline-block;}
```
  
7. `css-table`  
```css
.father {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
.content {
    display: inline-block;
}
```  

8. flex布局  
```css
.father {
    display:flex;
    justify-content: center;
    align-items: center;
}
```  

9. grid
```css
.father {display:grid;}
.content {
    align-self: center;
    justify-self: center;
}
```  

## 媒体查询  
功能：Media Queries能在不同条件下使用不同样式，是页面在不同设备下达到不同的渲染效果。  
使用方法：    
1. 最大宽度max-width：媒体类型小于等于指定宽度时样式生效  
```css
@media screen and (max-width:400px) {      /*屏幕小于等于480时隐藏ad*/
    .ad {
        display:none;
    }
} 
```  

2. 最小宽度min-width: 媒体类型大于等于指定宽度时样式生效  

3. 多个媒体特性使用  
```css
@media screen and (min-width:600px) and (max-width:900px) {    /*屏幕在600px~900px时，body变背景色*/
    body {background-color: red;}
}
```  
```html
<link rel="stylesheet" type="text/css" media="handheld and (max-width:480px), screen and {
    min-width:960px
}" href="style.css">  
<!-- style.css将被用于宽度小于等于480px的手持设备上或被用于屏幕宽度大于等于960px的设备上 -->
```

4. 设置屏幕的输出宽度Device Width  
```html
<link rel="stylesheet" media="screen and (max-device-width:480px)" href="ipone.css">  
<!-- max-device-width指的是设备的实际分辨率，上例是指ipone.css样式适用于最大设备宽度为480px的，比如ipone -->
``` 

5. `not`关键字  
用来排除某种指定的媒体类型，对后面表达式执行取反操作。  
```css
@media not print and {max-width:1200px}{样式}  
/*样式将被使用在除打印设备和设备宽度小于1200px外的其他所有设备中/
```  

6. `only`关键字  
用来指定特定媒体类型，主要用来排除不支持媒体查询的浏览器。若是不支持则不会采用后面的样式  
```html
<link rel="stylesheet" media="only screen and (max-device-width:240px)" href="android.css">
```  

## flex布局（弹性布局）   
任何容器都能设置为flex布局  
```css
/* 块状 */
.box {display:flex;}
/* 行内 */
.box1 {display: inline-flex;}
```
设置flex布局后，该容器称做`flex容器`，其子元素自动成为容器成员,称做`flex项目`，并且子元素的float、clear、vertical-align属性将失效。  

**容器属性**  
1. `flex-direction`: 项目(子元素)的排列方向   
取值：  
* row(默认)：水平方向，从左往右  
* row-reverse: 水平方向，从右往左  
* column: 垂直方向，从上往下  
* column-reverse: 垂直方向，从下往上
* column-reverse: 垂直方向，从下往上

2. `flex-wrap`：默认下项目都在一条轴线上，当轴线排不下时，该属性设置如何换行  
取值：  
* nowrap(默认)：不换行  
* wrap: 换行，第一行在上方  
* wrap-reverse: 换行，第一行在下方    

3. `flex-flow`：是`flex-direction`和`flex-wrap`的简写形式，默认值`row nowrap`  

4. `justify-content`: 定义项目在主轴(水平轴)上的对齐方式  
取值：  
* `flex-start`(默认值): 左对齐  
* `flex-end`: 右对齐  
* `center`: 居中  
* `space-between`: 两端对齐，项目之间间隔相等    
* `space-around`: **每个**项目两侧的间隔相等(项目之间的间隔比项目与边框的间隔大一倍)  

5. `align-items`：定义项目在交叉轴(垂直轴)上如何对齐   
具体的对齐方式与交叉轴的方向相关，取值是假设交叉轴从上到下 
取值：  
* `flex-start`: 对齐交叉轴的起点  
* `flex-end`: 对齐交叉轴的终点  
* `center`: 对齐交叉轴的中点(垂直居中)  
* `baseline`: 对齐项目中第一行文字的基线  
* `stretch`(默认值): 如果项目未设置高度或设为auto,将占满整个容器的高度(100%)  

6. `align-content`: 定义有多个轴线的对齐方式，只有一根就不生效  
取值：  
* `flex-start`: 与交叉轴的起点对齐  
* `flex-end`: 与交叉轴的终点对齐  
* `center`: 与交叉轴的中点对齐  
* `space-between`: 与交叉轴两端对齐，轴线之间间隔相等    
* `space-around`：垂直方向，**每根**轴线两侧的间隔相等(轴线之间的间隔比轴线与边框的间隔大一倍)  
* `stretch`(默认值):  轴线占满整个交叉轴  

### 项目属性  
1. order： int类型，定义项目的排列顺序，数值越小，排列越靠前，默认为0，可为负数    

2. flex-grow: 定义项目的放大比例，默认为0(不放大)  
如果所有项目的flex-grow都为1，则它们将等分剩余空间(如果有)；如果一个为2，其他为1，则前者占据要比其他大一倍。  

3. flex-shrink: 定义项目的缩小比例，默认为1(如果空间不足，将缩小该项目)  
如果所有项目的flex-shrink都为1，当空间不足时，将等比缩小所有项目；如果一个为0，其他为1，则空间不足时，前者不缩小。(负值无效)   

4. flex-basis: 定义了在分配多余空间前，项目占据主轴(水平轴)的空间。默认值为auto(项目原本的大小)，也可设置为width或height属性的取值  

5. flex: 是`flex-grow`、`flex-shrink`、`flex-basis`的缩写，默认`0 1 auto`,还有两个快捷值：`auto`(1 1 auto)  和 `none`(0 0 auto)

6. align-self: 允许单个项目和其他项目有不一样的对齐方式，可覆盖align-items。默认值为auto(继承父元素的align-items属性，如果没有父元素，等同于stretch)  
取值： 在align-items的取值上增加auto

## Grid布局  
Grid可以指定容器内部多个项目(子元素)的位置，将容器划分成“行”和“列”，产生单元格，然后指定项目在哪个单元格。  
```html
<div>
    <div><p>1</p></div>
    <div><p>2</p></div>
    <div><p>3</p></div>
</div>
```  
如上例，最外层的div是容器，第二层的三个div是项目，由于p不是容器的顶层子元素，所以不能算项目，Grid布局只对项目生效。  
ps:设为Grid的布局后，项目的`float`、display的`inline-block`和`tabel-cell`属性、`vertical-align`和`column-*`等将生效。  

默认情况下，容器都是块级元素  
```css
div {
    display:grid;
}
```  
也可以设置成行内元素：  
```css
div {
    display: inline-grid;
}
```  

### 属性  
1. grid-template-columns属性和grid-template-rows属性  
该属性可以定义每列的宽度和每行的高度，用来划分容器的行和列。  
```css
/* 三行三列布局 */
.container {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    grid-template-rows: 100px 100px 100px;
}

/* 百分比 */
.container {
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-template-rows: 33.33% 33.33% 33.33%;
}
```  
还可以使用关键字简写:  
**repeat()**   
接收两个参数，第一个是重复次数，第二个是需要重复的参数
```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 33.33%);
}
/* repeat还可以重复某种模式 */
grid-template-columns: repeat(2, 100px 200px 300px);/*重复两遍，定义6列（100 200 300 100 200 300）*/
```  

**auto-fill**  
在单元格(项目)大小固定的情况下，如果容器大小不确定，希望每一行或每一列容纳更多的项目，可以使用auto-fill自动填充。在占满当前行（列）后换行。  
```css
/* 每列宽100px,横向放置更多的项目 */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px)
}
```  

**fr**  
fr(fraction)是片段，用来表示比例关系，如果两列宽度分别为1fr和2fr,就表示后者是前者的两倍  
```css
.container {
    display:grid;
    grid-template-columns: 1fr 1fr;  /*两列相同*/  

    /*也可以像素值与倍数混用*/  
    grid-template-columns: 150px 1fr 2fr; /*第一列150px,第二列是第三列的一半*/
}
```  

**minmax**  
产生一个长度范围，它接受两个参数，最小值和最大值，长度在该范围中  
```css 
/* 第三列不小于100px,不大于1fr */
grid-template-columns: 1fr 1fr minmax(100px, 1fr);
```    

**auto**  
由浏览器决定长度  
```css  
/* 左右固定，中间自适应 */
grid-template-columns: 100px auto 100px;
```  

**布局实例**  
* 两栏式布局  
```css
.wrapper {
    display: grid;
    grid-template-columns: 30% 70%; /*左栏30%，右栏70%*/
}
```  

* 十二网格布局  
```css
grid-template-columns: repeat(12, 1fr);
```
   
2. grid-row-gap、grid-column-gap和grid-gap  
`grid-row-gap`是设置行间距，`grid-column-gap`是设置列间距  
```css
.container {
    grid-row-gap: 20px;
    grid-column-gap:20px;
}
```  
`grid-gap`是两者合并的写法  
```css
grid-gap: <grid-row-gap> <grid-column-gap>
```  
ps:最新标准，上述三个属性民可以省略grid  


