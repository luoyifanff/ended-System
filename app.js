var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
require('./db/conndb');//启动数据库连接模块


var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var goods = require('./routes/goods');
var detail = require('./routes/detail');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: "userID",   //随意设置
    secret:"llll",    //随意设置，将与转码后的cookie再次组合，进一步加密
    cookie: {maxAge: 1000*3600 }, //1小时
    resave: true,        //每次登录过后重新设置cookie过期时间
    saveUninitialized: true      //默认自动生成一个cookie
})); 



/***************注册路由域名*****************/
app.use('/', index);
app.use('/users', users);
app.use('/register',register);
app.use('/login',login);
app.use('/goods',goods);
app.use('/goods/detail',detail);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
