# 去重  
```js
//通用示例  
var arr = [1,1,'1','1',null,null,undefined,undefined,new String('1'),new String('1'),/a/,/a/,NaN,NaN];
```  
1. Set去重  
```js
var newArr = [...new Set(arr)];
congsole.log(newArr); //[1,'1',null,undefined,[String:'1'],[String:'1'],/a/,/a/,NaN]
```  

2. reduce去重  
```js
var newArr = arr.reduce((pre, cur) => {
    pre.includes(cur) ? pre : [...pre, cur],[]
})
console.log(newArr); //[1,'1',null,undefined,[String:'1'],[String:'1'],/a/,/a/,NaN]
```  

3. filter去重  
```js
var newarr = arr.filter((item, index, arr) =>{
    return arr.indexOf(item) === index
})
console.log(newArr); //[1,'1',null,undefined,[String:'1'],[String:'1'],/a/,/a/]
``` 

4. Object键值对去重  
```js
var obj = {};
var newArr = arr.filter((item, index, arr) => {
    return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
});
console.log(newarr); //[1,'1',null,undefined,[String:'1',/a/,NaN]]
```