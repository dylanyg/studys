const sleep = (s) =>{
    var start = Date.now(), last = start + s;
    while(Date.now()<last){
        console.log('1');
    }
}


const timer = setInterval(function (){
    for(var i=0;i<10;i++){
        var tick = parseInt(Math.random()*1000);
        sleep(tick);
        console.log(i);
    }
    clearInterval(timer);
},1000);
console.log('开始');