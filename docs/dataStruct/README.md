# 数据结构  

## 队列  
队列，遵循**先进先出**的一组有序项，尾部添加，头部移出。浏览器的[`Event Loop`](../browser/eventloop.md)机制就是基于队列。  
优先队列，不同于普通队列，元素的添加和移出是依赖优先级的。主要分为两类：**最小优先队列**和**最大优先队列**。  
最小优先队列是按优先级的从小到大顺序，优先级低的在队列最前面。最大优先队列刚好相反。   

## 栈  
栈，遵循**后进先出**的有序集合。尾部添加，尾部移除，尾部叫做栈顶，另一端叫栈底 

## 堆  
堆是一种特殊的树。特点：  
1. 堆是一个完全二叉树（除了最底下一层，其他层的节点个数都是满的，且最后一层的节点都是靠左排列）。  
2. 堆中每一个节点的值都必须大于等于（或小于等于）其子树中每个节点的值。  

堆与栈的区别：  
1. 申请的方式不同。栈由系统自动分配，堆是认为申请开辟。  
2. 申请的大小不同。栈获得的空间比较小，堆获得的空间比较大。  
3. 申请效率不同。 栈有系统分配，速度更快，堆更慢。  
4. 存储内容的不同。 栈在函数调用时，调用后可执行语句先进栈，然后函数的参数依次进栈，其中静态变量不入栈。堆一般在头部一个字节存放堆大小，堆的具体内容人为安排。  
5. 底层不同。 栈是连续的空间，堆是不连续的。

## 链表  
链表数据元素的线性集合，链表中的基本数据用节点来表示，节点由**元素**和**指针**构成，元素是**存储数据**的存储单元，指针是连接每个节点的**地址数据** 线性顺序是根据节点的指向串起来的序列来表现。  

**单链表**  
单链表的节点只有两个域：**信息域**和**指针域**。信息域保存当前节点的数据信息，指针域指向下个节点的地址，尾节点指向null.节点结构为`data+next`    
js实现单链表  
```js  
//单个节点  
class Node {
    constructor(element) {
        //信息域  
        this.element = element;
        //指针域  
        this.next = null;
    }
}  

class singleLink {
    constructor() {
        //初始头部节点  
        this.head = null;  
        //初始长度  
        this.length = 0;
    }  
    // 增加节点  
    append(element) {
        //1.定义当前节点  
        const node = new Node(element);  
        //2.找到链尾并添加  
        let temp = this.head;
        if(!this.head) {  //当前列表为空，可以直接插入
            this.head = node;
        }else {
            //节点指针指向null即为尾节点  
            while(temp.next) {
                temp = temp.next;
            } 
            temp.next = node;
        }
        this.length++;
    },  

    //搜索节点
    search(element) {
        if(!this.head) return false;  
        let temp = this.head;
        while(temp) {
            if(temp.element === element) return true;  
            temp = temp.next;
        }
        return false;
    },

    //插入节点
    insert(position,element) {
        //position是要插入的位置，为0就在头部插入，不为0就找到要插入位置的前一个
        if(position < 0 || position > this.length) return null;  

        const node = new Node(element);
        if(position === 0) {
            node.next = this.head;
            this.head = node;
        }else {
            let temp = this.head;
            for(let i = 1; i < position; i++) {
                temp = temp.next;
            }
            node.next = temp.next;
            temp.next = node;
        }
        this.length++;
    }, 

    //删除节点
    removeAt(element) {
        if(!this.head)return;
        //当删除节点是head时，要重新指定head
        if(this.head.element === element) {
            this.head = this.head.next;
            this.length--;
            return;
        }
        let pre = this.head,cur = this.head;
        while(cur) {
            if(cur.element === element) {
                pre.next = cur.next;
                this.length--;
                break;
            }else {
                pre = cur;
                cur = cur.next;
            }
        }
    }
}

```

**双链表**  
双链表中节点是有两个方向的，节点结构为`prev+data+next`,支持从尾到头。  
js实现双链表  
```js
//单个节点  
class Node {
    constructor(element) {
        this.element = element;
        this.prev = null;
        this.next = null;
    },
}

class doublyLink {
    constructor() {
        this.head = null;
        this.tail = null; //初始尾部节点
        this.length = 0;
    },
    //获取
    getList(isInverted = false) {
        return isInverted ? this.tail : this.head;
    }
    size() {
        return this.length;
    }
    //清空 
    clear() {
        this.head = this.tail = null;
        this.length = 0;
    }
    //插入节点
    insert(position, element) {
        if(position < 0 || position > this.length) return null;

        const node = new Node(element);
        if(!this.head) {
            this.head = this.tail = node;
        }else if(position === 0){
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }else if(position === this.length) {
            this.tail.next = node;
            node.prev = this.tail;
            //重定向
            this.tail = node;
        }else {
            //插入
            let temp = this.head,index = 1;
            //找到前一个
            while(index < position) {
                temp = temp.next;
                index++;
            }
            node.next = temp.next;
            temp.next.prev = node;
            temp.next = node;
            node.prev = temp;

        }
        this.length++;
    },
    
    //寻找节点
    search(element) {
        let temp = this.head;
        while(temp) {
            if(temp.element === element) return true;
            temp = temp.next;
        }
        return false;
    },

    //删除节点
    removeAt(position) {
        if(!this.length || position < 0 || position > this.length -1) return null;

        let temp = this.head,index = 0;
        if(this.length === 1) {
            this.clear();
        }else if(position === 0) {
            this.head.next.prev = null;
            this.head = this.head.next;
        }else if(position === this.length - 1) {
            this.tail.prev.next = null;
            this.tail = this.tail.prev;
        }else {
            //找到position对应下标元素
            while(index < position) {
                temp = temp.next;
                index++;
            }
            temp.prev.next = temp.next;
            temp.next.prev = temp.prev;
        }
        this.length--;
        return temp.element;
    }

}

```

## 哈希  



## 深度优先和广度优先   
### 深度优先遍历（DFS）  
流程：  
1. 指定一点为顶点并标记，查找该节点任一相邻节点。  
2. 若该相邻节点没被访问，则对其进行标记，并进入递归，去查询该节点未被访问的相邻节点；如果该节点已被访问，则回退到上一级，查找它未被访问的相邻节点，再进入递归，知道与起点相同的节点都被访问完为止。  
```js
var source = [
    {
        id:'1',
        children: [
            {
                id:'1-1',
                children:[]
            }
        ]
    },
    {
        id:'2',
        children:[]
    }
]
function deepfind(source) {
    let result = [];
    const dfs = src => {
        src.forEach(element => {
            result.push(element.id);
            if(element.children && element.children.length > 0) {
                dfs(element.children);
            }
        })  
    }
    dfs(source);
    return result;
}
deepfind(source);
```


### 广度优先遍历（BFS）  
流程：从顶点开始，依次访问离起始点最近的节点，逐层向下移动。  
```js
function deepfind(source) {
    let result = [], queue = [];
    queue = queue.concat(source);
    while(queue.length) {
        let temp = queue.shift();
        if(temp.children && temp.children.length > 0) {
            queue.concat(temp.children)
        }
        result.push(temp.id)
    }
    return result

}
```



## 时间复杂度、空间复杂度
考量算法的两个维度  
**时间复杂度**：  
* 常数阶O(1): 无论代码执行多少行，只要没有循环等复杂结构，时间复杂度就是O(1)  
```js
let i = 1;
let j = 1;
i++;
j++;
```  

* 线性阶O(n):循环执行n遍，消耗时间随n变化  
```js
for(let i = 0; i < n; i++) {
    console.log(i)
}
```  

* 对数阶O(logN):如下，假设x次循环后i>n,循环退出，也就是2的x次方大于等于n,那么x = log2^n  
```js 
let i = 1;
while(i < n) {
    i= i * 2;
}
```  

* 线性对数阶O(nlogN):将时间复杂度为O(logN)的代码循环n遍  
```js
for(let m = 1; m < n; m++) {
    let i = 1;
    while(i < n) {
        i= i * 2;
    }
}
```  

* 平方阶O(n^2): 时间复杂度为O(n)的代码再嵌套循环一遍  
```js
for(let i = 0; i < n; i++) {
    
    for(let j = 0; j < n; j++) {
       console.log(i,j) 
    }
}
```  

* 立方阶O(n^3)、k次方阶O(n^k): 参考平方阶  

**空间复杂度**：  
* O(1):算法执行所需要的临时空间不随某个变量n的大小变化，示例代码同时间复杂度O(1)  

* O(n):如下，行1开辟了占用大小为n的数组，后续虽然有循环，但没有再分配新空间，所有空间复杂度为O(n)  
```js
let arr = new Array(n);
for(let i=0; i < n; i++) {
    console.log(i)
}
```  

* O(n^2)  


**扩展**  
|排序法       |平均时间复杂度  |平均空间复杂度  |稳定度     |
|-------------|---------------|---------------|----------|
|冒泡排序      |O(n^2)          |O(1)           |稳定      |
|快速排序      |O(n^2)         |O(log2n)-O(n)  |不稳定     |
|选择排序       |O(n^2)        |O(1)           |稳定       | 


