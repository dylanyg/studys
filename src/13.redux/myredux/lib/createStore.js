import { Function } from "core-js/library/web/timers";

/**
 * @param[rootReducer] 应用中所以的reducer的合并函数
 * @param[preloadedState] 应该state初始状态，因为优先于reducer初始值
 */
export default createStore=(rootReducer,preloadedState)=>{
    var currentState;
    var listeners=[];
    var currentReducer=rootReducer;
    if(preloadedState && !(preloadedState instanceof Function)){
        currentState=preloadedState;
    }
    /**
     * @param[action]
     */
    dispatch(action){
        var reducerKeys=Object.keys(rootReducer);
        for(var i=0,len=reducerKeys.length;i<len;i++){
            var prevKey=reducerkeys[i];
            var prevState=rootReducer[prevKey](currentState,)
        }
        listeners.map(listener=>{
            listener();
        })
    }

    /**
     * @param[listener] 状态监听函数
     */
    subscribe(listener){
        if(listener instanceof Function){
            listeners.push(listener);
        }
    }

    getState(){
        return currentState;
    }


    return {
        dispatch:Function,
        getState:Function,
        subscribe:Function,
    }
}