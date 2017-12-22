// 1.括号作用域
console.log("1.括号作用域")
{
    let a=11;
    var b=5;
}
// console.log(a)
console.log(b)

// 2.for循环
console.log("2.let循环中运用一")
for(let i=0;i<10;i++){
    console.log(i)
}

// 3.for循环
console.log("3.let循环中运用二")
var a=[];
for(var i=0;i<10;i++){
    a[i]=function (){
        console.log(i);
    }
}
a[6]();

var b=[];
for(let j=0;j<10;j++){
    b[j]=function (){
        console.log(j)
    }
}
b[6]();

// 4.for申明理解
console.log("4.for申明理解")
for(let i=0;i<3;i++){
    let i="abc";
    console.log(i);
}

// 5.不存在变量提升
console.log("5.不存在变量提升")
console.log(a)
var a="I am a";

console.log(b)
let b="I am b"

console.log("6. Temporal dead zone")

console.log("7.不允许重复声明")

