var babel=require("babel-core");
var code=babel.transform("var b=[];\
for(let j=0;j<10;j++){\
    b[j]=function (){\
        console.log(j)\
    }\
}",{presets:["env"]})
console.log(code);

