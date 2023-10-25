var express = require('express');
const UserModel = require('../models/UserModel');
const path=require('path');
const hbs=require('hbs');
const bcrypt=require('bcrypt');

const checkLoginStatus=(req,res,next)=>{
  if(req.session.logined){
    res.redirect('/home');
  }else{
    next();
  }
}

var router = express.Router();
router.get('/',checkLoginStatus, (req, res) => {
  res.render('login');
})

router.post('/', async (req, res) => {
    const {username,password}=req.body;
    try{
      const user= await UserModel.findOne({username})
      if(!user){
        return res.render('/',{messeage: "Cannot find user"})
      }
      const isPasswordValid=await bcrypt.compare(password, user.password)
      if(isPasswordValid){
        req.session.logined=true;
        req.session.role=user.role;
        req.session.password=user.password;
        req.session.userId=user._id;
        req.session.username=user.username;
        req.session.cookie.maxAge=30*60*1000;
        res.redirect('/home');
      }else{
        res.redirect('/')
      }
    }catch(err){
      console.error(err);

    }
})

router.get('/register',(req,res)=>{
  res.render('register');
})
router.post('/register',async(req,res)=>{
  var {username,password}=req.body;
  try{
    var user =await UserModel.create({username,password})
    // res.status(201).json(user);
    res.redirect('/');
  }catch(err){
    console.log(err);
  }
  // var user=req.body;
  // await UserModel.create(user);
  // res.redirect('/princess');
})

//logout
router.get('/logout',(req,res)=>{
  req.session.logined=false;
  req.session.username=undefined;

  //huy bo phien
  req.session.destroy((err)=>{
    if(err){
      console.error("Falied to destroy")
    }
    res.redirect('/')
  })
})

router.get('/user',async(req,res)=>{
    var user=await UserModel.find();
    res.render('user/index',{user:user})
})

router.get('/user/edit/:id',async(req,res)=>{
  var id =req.params.id;
  var user=await UserModel.findById(id);
  res.render('user/edit',{user:user})
})

router.post('/user/edit/:id',async(req,res)=>{
  var id=req.params.id;
    var user=req.body;
    await UserModel.findByIdAndUpdate(id, user)
    res.redirect('/user');
})

router.get('/user/delete/:id',async(req,res)=>{
  var id =req.params.id;
  await UserModel.findByIdAndDelete(id);
  res.redirect('/user');
})
module.exports = router;