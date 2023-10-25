var mongoose=require('mongoose');
var CartSchema=mongoose.Schema({
    userId:String,
    items:[
        {
        product:{type:mongoose.Schema.Types.ObjectId, ref:'robot'},
        quantity: Number   
        },
        {
        product:{type:mongoose.Schema.Types.ObjectId, ref:'princess'},
        quantity: Number   
        }
    ],
})

var CartModel=mongoose.model('cart',CartSchema,'cart');
module.exports=CartModel;