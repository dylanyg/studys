let _init = Symbol('privateInit')
let _upload = Symbol('privateUpload')
const newImg = 'https://static.58.com/lbg/mengchong/image/element/upimg_loading_1.gif';
const uploadAPI = 'https://mengchong.58.com/file/upload/'

class Upload {
  constructor(args) {
    this.sub=args; // onCreate,onCompleted，tempFiles
    this.uploadTrace = [];
    this.taskTrace = [];
    this[_init]();
  }
  [_init]() {
    let _tempFiles;
    if(!this.sub.tempFiles){
      return;
    }
    if (Array.isArray(this.sub.tempFiles)) {
      _tempFiles = [...this.sub.tempFiles];
    } else if (this.sub.tempFiles){
      _tempFiles = [this.sub.tempFiles]
    }else{
      return;
    }
    for (let i = 0; i < _tempFiles.length; i++) {
      this.onCreate(_tempFiles[i], i);
      this[_upload](_tempFiles[i], i);
    }
  }
  onCreate(uploadImg, index ) {
    let newItem={
      uploadImg:'',
      localImg: newImg
    }
    this.uploadTrace.push(newItem)
    this.sub.onCreate.call(this, newItem, index);
  }
  [_upload](tempfile, index, onCompleted) {
    let self = this;
    wx.uploadFile({
      url: uploadAPI,
      filePath: tempfile,
      name: 'content',
      success({ data, statusCode }) {
        data = JSON.parse(data);
        if (statusCode === 200 && data.code == 0) {
          let uploadItem={
            uploadImg:data.data,
            localImg: tempfile
          }
          self.onCompleted(null, uploadItem,index);
        } else {
          self.onCompleted('上传失败',index);
        }
      },
      fail() {
        self.onCompleted('上传失败',index);
      }
    })
  }
  onCompleted(e,data,index) {
    this.sub.onCompleted.call(this, e, data, index);
  }
}


export default Upload
