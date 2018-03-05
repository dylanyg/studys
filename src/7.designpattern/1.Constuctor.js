// 第一种
function Person(name,age){
    this.name=name;
    this.age=age;
    this.toString=function (){
        console.log("My name is "+this.name+",age is "+this.age)
    }
    console.log(this);
}
var p1=Person('xiaowu',20);   // window
p1.toString();  // uncaugth TypeError:can not read property 'toString'
var p2=new Person('xiaosi',18);   // Person{name,age,toString}
p2.toString();   // My name is xiaosi,age 18
console.log(car.hasOwnProperty('toString'))  // 实例本身



// 第二种
function Car(width,height){
    this.width=name;
    this.height=age;
}
Car.prototype={
    toString:function (){
        console.log("My wdith is "+this.width+",My height is "+this.height)
    }
}
var car=new Car(2700,1700);
console.log(car);
car.toString();
console.log(car.hasOwnProperty('toString'))  // 继承原型连