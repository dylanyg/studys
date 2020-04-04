
// 原型链：实例对象都有一个私有属性__proto__,他指向对象的构造函数的原型对象，原型对象也有自己的__proto__属性，指向他的构造函数的原型对象，层层向上查找，直到原型对象为null，到达原型链的顶端。

// 原型继承：当我们访问一个对象的属性时，如果当前没有找到，我们就会向他的构造函数的原型对象上查找，如果没有找到就继续向构造函数的原型对象的上级原型对象查找，直到找到属性或者直到原型链的顶端为止。

// 知识点一、prototype 原型生成对象继承原型属性

// 知识点二、constructor 原型生成对象构造函数等于Prototype.contructor

// 知识点三、 instanceof 检测构造函数的prototype是否在对象的原型链上（ob.getPrototypeOf()）
1.定义：比较对象的构造函数和

// 原型生成对象

// function 语法


// {} 静态对象语法




function Student(props) {
    this.name = props.name || 'Unnamed';
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
}
// PrimaryStudent构造函数:
function PrimaryStudent(props) {
    Student.call(this, props);
    this.grade = props.grade || 1;
}

// 空函数F:
function F() {
}

// 把F的原型指向Student.prototype:
F.prototype = Student.prototype;

// 把PrimaryStudent的原型指向一个新的F对象，F对象的原型正好指向Student.prototype:
PrimaryStudent.prototype = new F();

// 把PrimaryStudent原型的构造函数修复为PrimaryStudent:
PrimaryStudent.prototype.constructor = PrimaryStudent;

// 继续在PrimaryStudent原型（就是new F()对象）上定义方法：
PrimaryStudent.prototype.getGrade = function () {
    return this.grade;
};

// 创建xiaoming:
var xiaoming = new PrimaryStudent({
    name: '小明',
    grade: 2
});
xiaoming.name; // '小明'
xiaoming.grade; // 2

// 验证原型:
xiaoming.__proto__ === PrimaryStudent.prototype; // true
xiaoming.__proto__.__proto__ === Student.prototype; // true

// 验证继承关系:
xiaoming instanceof PrimaryStudent; // true
xiaoming instanceof Student; // true