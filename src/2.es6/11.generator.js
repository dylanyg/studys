// 一系列的状态生成器
// function * helloGenerator(){
//     yield "hello"

//     yield "world"

//     return "end"
// }

// var hw=helloGenerator();
// console.log(hw.next());
// console.log(hw.next());
// console.log(hw.next());
// console.log(hw.next());

// // 暂缓器

// function* g(){
//     console.log("stash 2000 second")
// }
// var g1=g();

// setTimeout(function (){
//     g1.next();
// },2000)

// // 遍历器
// console.log("遍历器")
// var myIterable={}
// myIterable[Symbol.iterator]=function* (){
//     yield 1;
//     yield 2;
//     yield 3;
// }

// console.log([...myIterable]);


// function* gen(){

// }
// var g=gen();

// console.log(g[Symbol.iterator]===g)

console.log("yield 返回值")
function* f(x){
    var y=2*(yield x+1);
    var z=(yield y/3);
    return x+y+z;
}

var a=f(5);
console.log(a.next());
console.log(a.next());
console.log(a.next());

var b=f(5)
console.log(b.next())
console.log(b.next(12))
console.log(b.next(13))


