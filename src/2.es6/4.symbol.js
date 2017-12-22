// // Symbol作为属性名
// let key=Symbol();

// // 第一种写法
// let a={};
// a[key]="hello world";


// // 第二种写法
// let a={};
// Object.defineProperty(a,key,{value:"hello world"})


// // 第三种写法

// let a={
//     [key]:"hello world"
// }

// console.log("Symbol 类型定义常量")
// let log={};
// log.levels = {
//     DEBUG: Symbol('debug'),
//     INFO: Symbol('info'),
//     WARN: Symbol('warn')
//   };
//   console.log(log.levels.DEBUG, 'debug message');
//   console.log(log.levels.INFO, 'info message');

const COLOR_RED    = Symbol();
const COLOR_GREEN  = Symbol();

function getComplement(color) {
  switch (color) {
    case COLOR_RED:
      return COLOR_GREEN;
    case COLOR_GREEN:
      return COLOR_RED;
    default:
      throw new Error('Undefined color');
    }
}

console.log(getComplement(COLOR_GREEN));


// 3.消除魔术字符串


// 4.属性名的遍历
console.log(Object.getOWnPropertySymbols);

console.log(Reflect.ownKeys);


// 5.内部私有
console.log("内部私有")
let size=Symbol("size");

class Collection{
    constructor(){
        this[size]=0;
    }
    add(item){
        this[this[size]]=item
        this[size]++;
    }
    static sizeof(instance){
        return instance[size];
    }
}
let x=new Collection();
console.log(Collection.sizeof(x));
x.add("hello world");
console.log(Collection.sizeof(x));

console.log(Object.keys(x));
console.log(Object.getOwnPropertySymbols(x));
console.log(Object.getOwnPropertyNames(x));

// 7.内置的Symbol值

// 7.1 Symbol.hasInstance 对象的Symbol.hasInstance属性，指向一个内部方法
// 7.2 Symbol.isConcatSpreadable 表示对象Array.prototype.concat()时，是否可以展开
// 7.3 Symbol.species 指向构造函数，创建衍生对象时，会使用该属性
console.log("Symbol.match")
let regexp=new RegExp("/index/")
console.log(regexp[Symbol.match]("123index"))

console.log("123index".match());
// 等同于
regexp[Symbol.match](this)

class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}

'e'.match(new MyMatcher()) // 1


// 7.4 Symbol.iterator


class MyIterator{
    *[Symbol.iterator] (){
        let i=0;
        while(this[i]!==undefined){
            yield this[i];
            i++;
        }
    }
}

let myiterator=new MyIterator();
myiterator[0]=1;
