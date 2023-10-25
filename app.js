var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var princessRouter=require('./routes/princess');
var robotRouter=require('./routes/robot');
var homeRouter=require('./routes/home');
var cartRouter=require('./routes/cart');

var app = express();

//Cau hinh model session
app.use(
  session({
    secret:"abcdefg",
    resave:true,
    saveUnintialized:true,
    cookie:{maxAge: 30*60*1000},
  })
)
app.use((req,res,next)=>{
  res.locals.logined=req.session.logined||false; //true neu da login
  res.locals.role=req.session.role==="admin";
  res.locals.userId=req.session.userId;
  next();
});


  
//Khai bao Body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//Khai bao hbs
var hbs = require('hbs');
hbs.registerHelper('equal', require('handlebars-helper-equal'))
//tạo helper cho hbs
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});
hbs.registerHelper('gt', function(a, b) {
  return a > b;
});
hbs.registerHelper('lt', function(a, b) {
  return a < b;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/princess',princessRouter);
app.use('/robot', robotRouter);
app.use('/home', homeRouter);
app.use('/cart', cartRouter);



//khai bao va cau hinh thu vien mongoose 
var mongoose = require('mongoose');
mongoose.set('strictQuery',false)
//go ten database vao cuoi link
var uri='mongodb+srv://hiuconymoi:vanhieu2k3@cluster0.4gstzz5.mongodb.net/atn'
mongoose.connect(uri)
.then(() => console.log ("Connect to DB succeed !"))
.catch((err) => console.log (err));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT||3001);
module.exports = app;
