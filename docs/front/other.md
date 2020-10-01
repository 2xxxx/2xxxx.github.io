# js的奇怪知识  

1. 是否存在变量x，使得它等于多个数  
```js
const x = {
    value:0,
    toString() {
        return ++this.value
    }
}
x== 1 && x==2 && x== 3 //true
```