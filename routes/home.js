var express = require('express');
var router = express.Router();
const PrincessModel=require('../models/PrincessModel');
const RobotModel=require('../models/RobotModel');

router.get('/',async(req,res)=>{
    var princess=await PrincessModel.find();
    var robot=await RobotModel.find();
    res.render('home',{princess:princess, robots:robot})
})
module.exports = router;
