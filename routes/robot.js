var express = require('express');
var router = express.Router();
const RobotModel=require('../models/RobotModel');
const PrincessModel=require('../models/PrincessModel');

// Get homePAGE
router.get('/',async(req,res) => {
  var robot= await RobotModel.find();
  res.render('robot/index',{robots:robot})
})

router.get('/admin',async(req,res) => {
    var robot=await RobotModel.find();
    var princess=await PrincessModel.find();
    res.render('robot/admin',{robots:robot,
    princess:princess})
})

router.get('/detail/:id',async(req,res) => {
    var id=req.params.id;
    var robot=await RobotModel.findById(id);
    res.render('robot/detail',{robot:robot})
})

router.get('/delete/:id',async(req,res)=>{
    var id = req.params.id;
    await RobotModel.findByIdAndDelete(id);
    res.redirect('/robot/admin')
})

router.get('/add', async(req, res)=>{
    res.render('robot/add')
})

router.post('/add',async(req, res)=>{
    var robot=req.body;
    await RobotModel.create(robot)
    res.redirect('/robot/admin')
})

router.get('/edit/:id',async(req, res)=>{
    var id=req.params.id;
    var robot= await RobotModel.findById(id);
    res.render('robot/edit',{robot:robot})
})

router.post('/edit/:id',async(req,res)=>{
    var id=req.params.id;
    var robot=req.body;
    await RobotModel.findByIdAndUpdate(id, robot)
    res.redirect('/robot/admin');
})
router.post('/search',async(req,res)=>{
    var keyword=req.body.name;
    var robot=await RobotModel.find({name: new RegExp(keyword,"i")});
    res.render('robot/index',{robots:robot});
})

router.get('/priceasc',async(req,res)=>{
    var robot=await RobotModel.find().sort({price:1});
    res.render('robot',{robots:robot})
})
router.get('/pricedsc',async(req,res)=>{
    var robot=await RobotModel.find().sort({price:-1});
    res.render('robot',{robots:robot})
})

module.exports = router;