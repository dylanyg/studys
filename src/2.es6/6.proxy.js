// Proxy 用于修改某些默认行为，等同于在语言层面做出修改，所以输液一种“元编程”,既对编程语言进行编程
let window={};
var pipe = (function () {
    return function (value) {
      var funcStack = [];
      var oproxy = new Proxy({} , {
        get : function (pipeObject, fnName) {
          if (fnName === 'get') {
            return funcStack.reduce(function (val, fn) {
              return fn(val);
            },value);
          }
          funcStack.push(window[fnName]);
          return oproxy;
        }
      });
  
      return oproxy;
    }
  }());
  
  window.double = n => n * 2;
  window.pow    = n => n * n;
  window.reverseInt = n => n.toString().split("").reverse().join("") | 0;
  
  let sum=pipe(3).double.pow.reverseInt.get; // 63

  console.log(sum)