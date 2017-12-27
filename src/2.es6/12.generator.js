function thunkify(fn){
    return function (){
        var args=new Array(arguments.length);
        var cxt=this;
        for(var i=0;i<arguments.length;++i){
            args[i]=arguments[i];
        }
        return function (done){
            var called;
            args.push(function (){
                if(called)return;
                called=true;
                done.apply(this,arguments);
            })
            try {
                fn.apply(cxt,args);
            } catch (error) {
                done(error);
            }
        }
    }
}

function f(a,b,callback){
    var sum=a+b;
    callback(sum);
}
var thunkF=thunkify(f);
var print=console.log.bind(console);
thunkF(1,2)(print)

// Generator和Thunk
var fs=require('fs');
var readFileThunk=thunkify(fs.readFile);
function run(fn){
    var gen=fn();
    function next(error,data){
        var result=gen.next(data);
        if(result.done) return;

        result.value(next);
    }
    next()
}

function* g(){
    var f1 = yield readFileThunk('src/tmp/test.json');
    console.log(f1.toString());
    var f2 = yield readFileThunk('src/tmp/test2.json');
    console.log(f2.toString());
}

run(g);

// Generator和co
// var co=require('co');
// function* gen(){
//     var f1 = yield readFileThunk('src/tmp/test.json');
//     var f2 = yield readFileThunk('src/tmp/test2.json');
// }
// co(gen).then(function (){
//     co(gen).then(function (){
//         console.log('Generator 函数执行完成');
//     });
// })


// Genearator和promise封装
function readFile(filename){
    return new Promise(function (resolve,reject){
        fs.readFile(filename,function (error,data){
            if(error) reject(error);
            resolve(data);
        })
    })
}

function* gen(){
    var s1=yield readFile('src/tmp/test.json');
    var s2=yield readFile('src/tmp/test2.json');
    console.log(s1.toString())
    console.log(s2.toString())
}
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});

