// node.js事件模型

const events = require('events');

const eventEmitter = new events.EventEmitter();

eventEmitter.on('say',function (e){
    console.log('hi,'+e.name);
})

eventEmitter.emit('say',{name:'dog'});