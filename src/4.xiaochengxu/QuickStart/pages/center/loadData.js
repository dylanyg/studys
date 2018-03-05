import { get, post } from '../utils/http.js'

const _isMyPet = Symbol('_isMyPet')
const _haveCard = Symbol('_haveCard')
const _openTime = Symbol('_openTime')
const _washData = Symbol('_washData')

class LoadData {
  constructor({ petId }) {
    this.petId = petId;
  }
  /**
   * 是否是我的宠物
   */
  [_isMyPet](callback) {
    const API = '/user/isMyPet'
    let _this = this;
    if (this.petId == '') {
      callback && callback.call(_this, null, true);
    } else {
      get(API, { petId: this.petId }, (e, response) => {
        if (e) {
          console.log(e);
          return;
        }
        callback.call(_this, null, response) && callback.call(_this, null, response);
      },true)
    }
  }
  /**
   * 是否有宠物卡
   */
  [_haveCard](callback) {
    const API = '/user/havePetCard'
    let _this = this;
    // 宠物卡ID不为空则有宠物卡
    if (this.petId) {
      callback && callback.call(_this, null, true);
    } else {
      get(API, { petId: this.petId }, (e, response) => {
        if (e) {
          console.log(e);
          return;
        }
        callback.call(_this,null,response) && callback.call(_this,null,response);
      },true)
    }
  }
  /**
   * 是否是我的宠物
   */
  [_openTime](callback) {
    const API = '/index/show'
    let _this = this;
    get(API, (e, response) => {
      let activityTime=new Date().getTime();
      if (e) {
        console.log(e);
      }
      if (response){
        activityTime = new Date(response.finishTime.replace(/-/g, "/")).getTime();
      }
      callback && callback(activityTime)
    },true)
  }
  [_washData](model){
    // 宠物年龄
    let birthArr = model.userCenterVO.pet.birthday.split('-');
    let age = new Date().getFullYear() - birthArr[0];
    model.userCenterVO.pet.age = age;
    // 出生日期
    model.userCenterVO.pet.birdthShow = birthArr[1].replace(/^0/, '') + '月' + birthArr[2].replace(/^0/, '') + '日';
    // 体重
    // model.userCenterVO.pet.weight = model.userCenterVO.pet.weight.replace(/^0/, '');
    
    return model;
  }
  loadData(callback) {
    var _this = this;
    const data = this.petId ? { petId:this.petId } : {};
    let result = {
      'openActivity':false,
      'title':'我的宠物',
      'haveCard':false,
      'showEdit': false,
      'CenterCard': { 'isFocus': false }
    }
    _this[_isMyPet]((e, response) => {
      if (response) {
        _this[_haveCard]((e, response) => {
          result.haveCard = response;
          if (response) {
            result.showEdit = true;
            _this[_openTime]((optime) => {
              // 开奖时间
              result.openActivity=Date.now()>optime;
              get('/user/myCard/', data, (e, response) => {
                if(e){
                  console.log(e);return;
                }
                _this[_washData](response);
                result.CenterCard=response;
                callback && callback(result);
              })
            })
          } else {
            callback && callback(result);
          }
        })
      } else {
        _this[_openTime]((optime)=>{
          result.openActivity = Date.now() > optime;
          get('/user/otherCard/', data, (e, response) => {
            if (e) {
              console.log(e); return;
            }
            _this[_washData](response.myCardVO);
            result.title = '他的宠物';
            result.haveCard = true;
            result.isFocus = response.focus;
            result.CenterCard = Object.assign({}, response.myCardVO);
            callback && callback(result);
          })
        })
      }
    })
  }

}

export default LoadData