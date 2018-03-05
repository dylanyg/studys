export default combineReducers=(reducers)=>{
    var reducerKeys=Object.keys(reducers);
    return function complain(state,action){
        if(reducerKeys.indexOf(action.type)>-1){
        
        }
    }
}