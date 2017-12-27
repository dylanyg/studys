// 模拟遍历器
let mymaker=new MyMaker(['a','b']);

mymaker.next();
mymaker.next();
mymaker.next();

function MyMaker(arr){
    let index=0;
    return {
        next:function (){
            console.log(index<arr.length?{value:arr[index++]}:{done:true});
        }
    }
}

// 类部署Iterator接口写法

class RangeIterator{
    constructor(start,stop){
        this.start=start;
        this.stop=stop;
    }
    [Symbol.iterator](){return this}
    next (){
        return this.start==this.stop?{value:undefined,done:true}:{value:this.start++,done:false};
    }
}
function Range(start,stop){
    return new RangeIterator(start,stop);
}
for(let value of Range(0,3)){
    console.log(value);
}

// 遍历器实现指针结构
console.log("111111111111")
function Obj(value){
    this.value=value;
    this.next=null;
}
Obj.prototype[Symbol.iterator]=function (){
    var iterator={next:next};

    var current=this;
    function next(){
        if(current){
            var value=current.value;
                current=current.next;
            return {value:value,done:false};
        }else{
            return {done:true};
        }
    }

    return iterator;
}
var obj1=new Obj("a");
var obj2=new Obj("b");
var obj3=new Obj("c");

obj1.next=obj2;
obj2.next=obj3;

for(var value of obj1){
    console.log(value);
}
