var mongoose=require('mongoose');
var RobotSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"name cannot be empty"]
    },
    material:{
        type:String,
        required:[true,"material cannot be empty"]
    },
    height:{
        type:Number,
        min:[10,"cannot be lower than 10"]
    },
    price:{
        type:Number,
        min:0
    },
    quantity:Number,
    description:String,
    image:String,
    image2:String
})

var RobotModel=mongoose.model('robot',RobotSchema,'robot');
module.exports=RobotModel;