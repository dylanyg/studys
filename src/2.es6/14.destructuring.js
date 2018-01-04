// 数组解构赋值
let [a, b, c] = [1, 2, 3];

// 对象解构赋值
let { foo, bar } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

// 函数参数解构赋值
function add([x, y]){
    return x + y;
}
  
add([1, 2]); // 3

// 转化后代码
var parseCfgAndData = function parseCfgAndData(_ref) {
    var modules = _ref.modules,
        data = _ref.data;
    return modules.map(function (_ref2) {
        var id = _ref2.id,
            name = _ref2.name,
            cfg = _ref2.cfg;

        cfg = cfg ? JSON.parse(cfg) : {};
        var modData = data[name] || {};

        // data 修改
        if (name === 'information') {
            modData.logo = modData.logo ? picSrcDomain() + modData.logo : 'https://pic2.58cdn.com.cn/bizmp/n_v285d6a16d725a446694db35df23c9db24.png';
            app.globalData.information = modData;
        }

        if (name === 'services' || name === 'serviceOther') {
            if (modData.data) {
                modData.data.forEach(function (service) {
                    service.img = picSrcDomain() + service.img;
                });
            }
        }

        if (name === 'serviceDetail') {
            if (modData.descPics) {
                modData.descPics = modData.descPics.map(function (pic) {
                    return picSrcDomain() + pic;
                });
            }

            var strArr = modData.serviceInfo.split('\n');
            modData.htmlNodes = strArr.map(function (str) {
                return {
                    name: 'p',
                    children: [{
                        type: 'text',
                        text: str
                    }]
                };
            });
        }

        // 定义模板数据
        var pd = {
            id: id,
            name: name,
            props: _extends({}, modData, { cfg: cfg })
        };

        // props & cfg 修改
        // imageSwiper
        if (name === 'imageSwiper') {
            if (!cfg.images) {
                cfg.images = modData.data.map(function (img) {
                    return _extends({}, img, {
                        src: picSrcDomain() + img.src
                    });
                });
            }

            var current = cfg.current || 0;
            var _cfg$images$current = cfg.images[current],
                title = _cfg$images$current.title,
                desc = _cfg$images$current.desc;

            var newProps = {
                length: cfg.images.length,
                current: current
            };
            if (title) newProps.title = title;
            if (desc) newProps.desc = desc;

            Object.assign(pd.props, newProps);
        }

        // images 模块图片路径
        if (name === 'images') {
            cfg.images.forEach(function (img) {
                img.src = picSrcDomain() + img.src;
            });
        }

        console.log(name, pd);
        return pd;
    });
};

