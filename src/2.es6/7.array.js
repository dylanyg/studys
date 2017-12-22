let a=[1,8,21,9];
var sum=a.reduce(function (prev,cur){
    console.log(prev,cur);
    return prev+cur;
},99)
console.log(sum)
