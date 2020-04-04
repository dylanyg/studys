Function.prototype.bind = function (){
    var fn = this;
    var context = Array.prototype.shift.call(arguments);
    var arg = Array.prototype.slice.call(arguments,1);
    return function (){
        var newAry = arg.concat(Array.prototype.slice.call(arguments,1));
        fn.apply(context,newAry);
    }
}

var  student = {
    name : 'yaogang',
}
var study = function (){
    console.log(this.name);
}.bind(student);


study();    // yaogang