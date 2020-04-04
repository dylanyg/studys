function deepClone(target){
    var newObj = target instanceof Array ? []:{};
    for(pop in target){
        var temp = typeof target[pop] === 'object' ? deepClone(target[pop]):target[pop];
        newObj[pop] = temp;
    }
    return newObj;
}
// 对象克隆
console.log(deepClone({
    name:"yg",
    age:'20',
}));
// 数组克隆
console.log(deepClone([1,2,3]));

// 二维数组

console.log(deepClone([[1,2,3]]));

