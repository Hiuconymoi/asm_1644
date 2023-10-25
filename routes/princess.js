var express = require('express');
var router = express.Router();
const PrincessModel=require('../models/PrincessModel');

// Get homePAGE
router.get('/',async(req,res) => {
  var princess= await PrincessModel.find();
  res.render('princess/index',{princess:princess})
})

router.get('/admin',async(req,res) => {
    var princess=await PrincessModel.find();
    res.render('robot/admin',{princess:princess})
})

router.get('/detail/:id',async(req,res) => {
    var id=req.params.id;
    var princess=await PrincessModel.findById(id);
    res.render('princess/detail',{princess:princess})
})

router.get('/delete/:id',async(req,res)=>{
    var id = req.params.id;
    await PrincessModel.findByIdAndDelete(id);
    res.redirect('/robot/admin')
})

router.get('/add', async(req, res)=>{
    res.render('princess/add')
})

router.post('/add',async(req, res)=>{
    var princess=req.body;
    await PrincessModel.create(princess)
    res.redirect('/robot/admin')
})

router.get('/edit/:id',async(req, res)=>{
    var id=req.params.id;
    var princess= await PrincessModel.findById(id);
    res.render('princess/edit',{princess:princess})
})

router.post('/edit/:id',async(req,res)=>{
    var id=req.params.id;
    var princess=req.body;
    await PrincessModel.findByIdAndUpdate(id, princess)
    res.redirect('/robot/admin');
})
router.post('/search',async(req,res)=>{
    var keyword=req.body.name;
    var princess=await PrincessModel.find({name: new RegExp(keyword,"i")});
    res.render('princess/index',{princess:princess});
})

router.get('/priceasc',async(req,res)=>{
    var princess=await PrincessModel.find().sort({price:1});
    res.render('princess',{princess:princess})
})
router.get('/pricedsc',async(req,res)=>{
    var princess=await PrincessModel.find().sort({price:-1});
    res.render('princess',{princess:princess})
})

module.exports = router;