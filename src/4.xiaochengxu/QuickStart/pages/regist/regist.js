
const { get, post } = require('../utils/http');
const { alert } = require('../utils/index');
const { uploader } = require('../utils/uploader');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        form: {
            portrait:'',
            cate: 0,
            gender: 0,
            sterilization:0,
            petname:'',
            weight:'',
            summary:'',
            birthday:'',
            city:''
        },
        //宠物编号
        code:'',
        typeList: [
            {
                id: 2,
                name: '猫'
            },
            {
              id: 1,
              name: '狗'
            },
            {
              id: 0,
              name: '其它'
            }
        ],
        sexList:[
          {
            id:0,
            name:'男'
          },{
            id:1,
            name:'女'
          }
        ],
        hasBabyList:[
          {
            id:0,
            name:'已绝育'
          },{
            id:1,
            name:'未绝育'
          }
        ],
        date: '请选择',
        allAreaData:[],
        index:0,
        submit:'提交',
        currentDate: ''
    }, 
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取地区数据
        this.getCurent();
        post('/rank/cities', (e, response) => {
            if (e) {
                console.log(e);
                return;
            }
            this.setData({
                allAreaData:['请选择'].concat(response),
            });
        });
        wx.setNavigationBarTitle({
            title: '注册'
        })
        // 如果有id，则是编辑宠物信息  更新接口 /pet/update/
        // 没有的话就是新建宠物  保存接口 /pet/save/
        const { id } = this.options;
        if (id) {
            // TODO
            // 加载宠物信息  /user/petDetail
            // 并且展示在页面上编辑
            wx.setNavigationBarTitle({
                title: '宠物资料'
            })
            post('/user/petDetail',{petId:id}, (e, response) => {
                if (e) {
                    alert("初始化页面失败，请稍后再试");
                    return;
                }
               //获取初始化页面的基础数据
               const { name, portrait, cate, gender, sterilization, birthday, weight, city, summary, code } = response;
               
               //获取地区在地区数组里面对应的下标
               const cityIndex = this.data.allAreaData.indexOf(city);

               /*给宠物编号赋初值 */
                this.setData({
                    code: code,
                    index: cityIndex,
                    date:birthday,
                    submit:'保存'
                });
                this.setData({
                    form: Object.assign({}, this.data.form, {
                        cate:cate,
                        gender: gender,
                        sterilization: sterilization,
                        petname:name,
                        weight:weight,
                        summary:summary,
                        portrait:portrait,
                        birthday:birthday,
                        city:city,
                    }),
                });
            });
        }
    },
    
    //上传头像
    selectImage(){
        const self = this;
        wx.chooseImage({
            count:1,
            sizeType: ["compressed"],
            success: function(res) {
                var tempFilePaths = res.tempFilePaths;
                var url = tempFilePaths[0];
                uploader(url, (e, res) => {
                    if (e) {
                        alert('头像上传失败，请重试。');
                        return;
                    }
                    wx.showToast({
                        title: '头像上传成功。',
                        icon: 'none',
                    });
                    self.setData({
                        form: Object.assign({}, self.data.form, { portrait: res.data }),
                    })
                });
            },
        })
    },
    //选择宠物类别
    selectType(e) {
        const { id, name } = e.target.dataset.item;
        this.setData({
          form: Object.assign({}, this.data.form, { cate: id }),
        });
    },
    //选择宠物性别
    selectSex(e) {
        const { id, name } = e.target.dataset.item;
        this.setData({
          form: Object.assign({}, this.data.form, { gender: id }),
        });
    },
    //是否绝育
    judgeBaby(e){
        const { id, name } = e.target.dataset.item;
        this.setData({
          form: Object.assign({}, this.data.form, { sterilization: id }),
        });
    },
    //宠物名字
    petName(e){
        const petName = e.detail.value;
        this.setData({
          form: Object.assign({}, this.data.form, { petname: petName }),
        });
        console.log(e);
    },
    //宠物体重
    petWeight(e){
        var petWeight = e.detail.value;
        this.setData({
            form: Object.assign({}, this.data.form, { weight: petWeight }),
        });
        if (parseFloat(petWeight)){
            this.setData({
                form: Object.assign({}, this.data.form, { weight: parseFloat(petWeight).toFixed(1) }),
            });
        }  
    },
    //宠物特点
    introduceYourPet(e){
        const petIntroduce = e.detail.value;
        this.setData({
            form: Object.assign({}, this.data.form, { summary: petIntroduce }),
        });
    },
    //选择宠物出生日期
    selectDate(e){
        const getDate = e.detail.value;
        this.setData({
            date: getDate,
            form: Object.assign({}, this.data.form, { birthday: getDate }),
        });
    },
    //选择地区
    selectArea: function(e){
        const getDate = e.detail.value;   //value是下标
        this.setData({
            index: getDate,
            form: Object.assign({}, this.data.form, { city: this.data.allAreaData[getDate] }),
        });
    },
    //获取当前日期
    getCurent: function () {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth()+1) < 10 ? '0'+ (date.getMonth()+1) : (date.getMonth()+1);
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
        this.setData({
            currentDate:year + '-' + month + '-' + day,
        })
    },
    //提交
    submit(){
        if(this.data.code.length === 0){
            //注册
            //判断宠物基础信息是否合理
            const form = this.data.form;
            if (form.petname.length === 0 || form.portrait.length === 0 ||
                form.weight.length === 0 || form.summary.length === 0 ||
                form.birthday.length === 0 || form.city.length === 0
            ) {
                alert("请完善宠物信息，每项都是必填/必选项！");
                return;
            } else if (form.summary.length > 10) {
                alert("特点描述最多十个字！");
                return;
            } else if (form.petname.length > 5) {
                alert("宠物名字最多五个字！");
                return;
            }else if (!parseFloat(form.weight)) {
                alert("宠物的体重只能是数字！");
                return;
            } else if (form.city == '请选择') {
                alert("请选择宠物地区！");
                return;
            } else if (form.birthday == '请选择') {
                alert("请选择宠物出生日期！");
                return;
            }
            this.setData({
                submit:'提交',
            });
            post('/pet/save/', this.data.form, (e, response) => {
                if (e) {
                    console.log(e);
                    return;
                }
               wx.showModal({
                    title: '提示',
                    content: '宠物卡注册成功，可以点击“拍摄”按钮去拍摄宠物小视频参赛了!',
                    cancelText:'不参赛',
                    confirmText:'拍摄',
                    success: function(res) {
                        //点击拍摄
                        if(res.confirm){
                            wx.switchTab({ url: "/pages/camera/camera" });
                        //点击不参赛
                        }else if(res.cancel){
                            wx.redirectTo({ url: "/pages/center/center" });
                        }
                    }
                });
            });
        }else{
            //编辑页面
            const form = this.data.form;
            if (form.petname.length === 0 ||form.portrait.length === 0 ||
                form.weight.length === 0 || form.summary.length === 0 ||
                form.birthday.length === 0 || form.city.length === 0
            ) {
                alert("请完善宠物信息，每项都是必填/必选项！");
                return;
            } else if (form.summary.length > 10) {
                alert("特点描述最多十个字！");
                return;
            } else if (form.petname.length > 5) {
                alert("宠物名字最多五个字！");
                return;
            } else if (!parseFloat(form.weight)) {
                alert("宠物的体重只能是数字！");
                return;
            } else if (form.city == '请选择') {
                alert("请选择宠物地区！");
                return;
            } else if (form.birthday == '请选择') {
                alert("请选择宠物出生日期！");
                return;
            }
            const { code } = this.data;
            const sendData = Object.assign({}, this.data.form, { code });
            post('/pet/update/', sendData, (e, response) => {
                if (e) {
                    console.log(e);
                    return;
                }
                wx.showModal({
                    showCancel: false,
                    title: '提示',
                    content: '更新宠物信息成功',
                    success: function(res) {
                        wx.navigateBack();
                    }
                });
            });
        }
    }
});
