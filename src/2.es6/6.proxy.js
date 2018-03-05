// 源https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy 
// Proxy 可以操作元数据的属性做自定义操作，包括属性查找、赋值、枚举、函数调用
// 一、基本操作实例
console.log("一、基本操作实例")
let handler={
  get:function (target,name){
    return name in target?target[name]:37;
  }
}
let p1=new Proxy({},handler);
p1.a=1;
p1.b=undefined;
console.log(p1.a,p1.b);
console.log('c' in p1,p1.c);

// 二、无操作转发
console.log("二、无操作转发")
let target={};
let p2=new Proxy(target,{});
p2.a=27;

console.log(target.a);

// 三、赋值验证
console.log("三、赋值验证")
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // The default behavior to store the value
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

console.log(person.age); 
// 100

// person.age = 'young'; 
// 抛出异常: Uncaught TypeError: The age is not an integer

// person.age = 300; 
// 抛出异常: Uncaught RangeError: The age seems invalid

// 四、扩展构造函数
console.log('四、扩展构造函数');
function extend(sup,base) {
  var descriptor = Object.getOwnPropertyDescriptor(
    base.prototype,"constructor"
  );
  base.prototype = Object.create(sup.prototype);
  var handler = {
    construct: function(target, args) {
      var obj = Object.create(base.prototype);
      this.apply(target,obj,args);
      return obj;
    },
    apply: function(target, that, args) {
      sup.apply(that,args);
      base.apply(that,args);
    }
  };
  var proxy = new Proxy(base,handler);
  descriptor.value = proxy;
  Object.defineProperty(base.prototype, "constructor", descriptor);
  return proxy;
}

var Person = function(name){
  this.name = name;
  console.log("base.constructor:"+this.name)
};

var Boy = extend(Person, function(name, age) {
  this.age = age;
  console.log("sub.constructor:"+this.age)
});

Boy.prototype.sex = "M";

var Peter = new Boy("Peter", 13);
console.log(Peter.sex);  // "M"
console.log(Peter.name); // "Peter"
console.log(Peter.age);  // 13


// 五、值修正及附加属性
console.log("五、值修正及附加属性")
let products = new Proxy({
  browsers: ['Internet Explorer', 'Netscape']
},
{
  get: function(obj, prop) {
    // 附加属性
    if (prop === 'latestBrowser') {
      return obj.browsers[obj.browsers.length - 1];
    }

    // 缺省行为是返回属性值
    return obj[prop];
  },
  set: function(obj, prop, value) {
    // 附加属性
    if (prop === 'latestBrowser') {
      obj.browsers.push(value);
      return;
    }

    // 如果不是数组则进行转换
    if (typeof value === 'string') {
      value = [value];
    }

    // 缺省行为是保存属性值
    obj[prop] = value;
  }
});

console.log(products.browsers); // ['Internet Explorer', 'Netscape']
products.browsers = 'Firefox'; // ?传入一个 string (错误地)
console.log(products.browsers); // ['Firefox'] <- ?没问题, ?得到的是一个 array

products.latestBrowser = 'Chrome';
console.log(products.browsers); // ['Firefox', 'Chrome']
console.log(products.latestBrowser); // 'Chrome'


// let window={};
// var pipe = (function () {
//     return function (value) {
//       var funcStack = [];
//       var oproxy = new Proxy({} , {
//         get : function (pipeObject, fnName) {
//           if (fnName === 'get') {
//             return funcStack.reduce(function (val, fn) {
//               return fn(val);
//             },value);
//           }
//           funcStack.push(window[fnName]);
//           return oproxy;
//         }
//       });
  
//       return oproxy;
//     }
//   }());
  
//   window.double = n => n * 2;
//   window.pow    = n => n * n;
//   window.reverseInt = n => n.toString().split("").reverse().join("") | 0;
  
//   let sum=pipe(3).double.pow.reverseInt.get; // 63

//   console.log(sum)