// 设计目标一
// 替代Object静态属性、方法

// 设计目标二
// 安全性

// 旧写法
try{
    Object.defineProperty(target,property,attribute)
    // success
}catch{
    // failure
}

// 新写法

if(Reflect.defineProperty(target,property,attribute)){
    // success
}else{
    // failure
}

// 设计目标三
// 函数式操作
Reflect.has(traget,property);
Reflect.defineProperty(target,property);

// 设计目标三

// Reflect方法与Proxy一一对应