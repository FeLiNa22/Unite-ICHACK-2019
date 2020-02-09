var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'eu-cdbr-west-02.cleardb.net',
  user: 'b380ca6d8c4a86',
  password: 'b6cb2eb0',
  database: 'heroku_c09f1c7a9daf41a'
});
connection.connect(function(err){
  if(err){
    console.log("Cannot connect to mysql server")
  }
  console.log("Connected to the database")
});

connection.query('SELECT delivery_date,item,store_name,icon_link,FORMAT(cost,2) AS cost'
+ ' FROM orders NATURAL JOIN stores'
+ ' WHERE MONTH(delivery_date) = MONTH(CURRENT_DATE()) AND YEAR(delivery_date) = YEAR(CURRENT_DATE())'
+ ' ORDER BY delivery_date DESC'
,
  function(err,rows){
    current_month_orders = rows;
    console.log(rows);
});

connection.query('SELECT delivery_date,item,store_name,icon_link,FORMAT(cost,2) AS cost'
+ ' FROM orders NATURAL JOIN stores'
+ ' WHERE MONTH(delivery_date) < MONTH(CURRENT_DATE())'
+ ' ORDER BY delivery_date DESC'
,
  function(err,rows){
    last_month_orders = rows;
    console.log(rows);
});


connection.query("SELECT *, DATE_FORMAT(delivery_date,'%m/%d/%Y') AS delivery_date,DATE_FORMAT(dispatch_date,'%m/%d/%Y') AS dispatch_date FROM orders"
+ ' NATURAL JOIN stores'
+ ' ORDER BY delivery_date DESC'
,
  function(err,rows){
    all_orders = rows;
    console.log(rows);
});

connection.query('SELECT store_name, icon_link, linked_account_username as username'
+ ' FROM accounts'
+ ' JOIN stores ON accounts.linked_store = stores.store_name',
  function(err,rows){
    accounts = rows;
    console.log(rows);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var port = 8000;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine( '.html', 
hbs({
  extname: '.html',
  defaultLayout: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', '.html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
})

module.exports = app;
