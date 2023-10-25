var mongoose=require('mongoose');
var PrincessSchema=mongoose.Schema({
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
    image:String
})

var PrincessModel=mongoose.model('princess',PrincessSchema,'princess');
module.exports=PrincessModel;