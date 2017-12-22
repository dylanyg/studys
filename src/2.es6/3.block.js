var tmp=10;
function fn(){
    console.log(tmp)
    if(false){
        var tmp="I am  cover";
    }
}
fn();

console.log("循环变量泄露为全局变量")
var s = 'hello';

for (var i = 0; i < s.length; i++) {
  console.log(s[i]);
}

console.log(i); // 5