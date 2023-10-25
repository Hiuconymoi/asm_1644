var mongoose=require('mongoose')
var bcrypt=require('bcrypt');
var UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
    },
})

UserSchema.pre('save', async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt)
    next()
})
var UserModel=mongoose.model('user',UserSchema,'users');
module.exports = UserModel;