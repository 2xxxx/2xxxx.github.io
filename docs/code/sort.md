# 排序算法  

## 快速排序    
取一参照值，比参照值小的放一边，比参照值大的放一边，再在两边又取参照值做比较，直至排序完成。
```js
function quickSort(arr) {
    if(arr.length <= 1) return arr;
    let left = [],right = [],keys = arr.shift();
    for(let i of arr) {
        if(i < keys) {
            left.push(i)
        }else {
            right.push(i)
        }
    }
   return quickSort(left).concat(keys,quickSort(right))
}
```


## 冒泡排序    
两两比较，逆序的交换，顺序的不变
```js
function bubbleSort(arr) {
    for(let i = 1; i< arr.length; i++) {
        for(let j = i; j > 0; j--) {
            if(arr[j-1] >arr[j]) {
                [arr[j-1],arr[j]] =[arr[j],arr[j-1]]
            }
        }
    }
    return arr
}
```

## 选择排序    
选择未排序中最小值，移至未排序部分的最前方
```js
function selectSort(arr) {
    for(let i = 0; i < arr.length; i++) {
        let min = arr[i],minIndex = i;
        for(let j = i+1; j < arr.length; j++) {
            if(min > arr[j]){
                min = arr[j];
                minIndex = j;
            }
        }
        [arr[i],arr[minIndex]] = [arr[minIndex], arr[i]];

    }
    return arr
}
```

## 插入排序    
遍历取值，将值按大小直接插入到已遍历且排好序的部分中
```js
function insertSort(arr) {
    for(let i = 0; i < arr.length; i++){
        let j = i;
        while(j > 0) {
            if(arr[j] > arr[j-1]) break;
            [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
            j--;
        }
    }
    return arr
}
```
