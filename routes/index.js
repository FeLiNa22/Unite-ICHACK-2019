var express = require('express');
var router = express.Router();
var mysql = require('mysql');

connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ichack_2020'
});

connection.connect(function(err){
  if(err){
    console.log("Cannot connect to mysql server")
  }
  console.log("Connected to the db")
});

function getAnalytics(){
  var analytics = {};
  connection.query('SELECT SUM(cost) AS total_cost'
                      + ' FROM orders NATURAL JOIN stores'
                      + ' WHERE MONTH(dispatch_date) = MONTH(CURRENT_DATE()) AND YEAR(dispatch_date) = YEAR(CURRENT_DATE())'
                      + ' ORDER BY dispatch_date DESC'
    ,
    function(err,rows){
      if(err){
        //Handle The Error
      }
      analytics['monthly_budget']=500.00;
      analytics['monthly_budget_spent'] = rows[0].total_cost;
      analytics['monthly_budget_spent_percent'] = (rows[0].total_cost/500)*100; 
      connection.query('SELECT COUNT(*) AS total_orders'
                          + ' FROM orders'
                          + ' WHERE account_no = 1 AND YEAR(dispatch_date) = YEAR(CURRENT_DATE())'
        ,
        function(err,rows){
          if(err){
            //Handle The Error
          }
          analytics['total_orders']=rows[0].total_orders;
        }); 
    });
  return analytics;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT dispatch_date,item,store_name,icon_link,FORMAT(cost,2) AS cost'
                    + ' FROM orders NATURAL JOIN stores'
                    + ' WHERE MONTH(dispatch_date) = MONTH(CURRENT_DATE()) AND YEAR(dispatch_date) = YEAR(CURRENT_DATE())'
                    + ' ORDER BY dispatch_date DESC'
  ,
  function(err,rows){
    if(err){
      //Handle The Error
    }
    var current_month_orders = rows;
    connection.query('SELECT dispatch_date,item,store_name,icon_link,FORMAT(cost,2) AS cost'
                    + ' FROM orders NATURAL JOIN stores'
                    + ' WHERE MONTH(dispatch_date) < MONTH(CURRENT_DATE())'
                    + ' ORDER BY dispatch_date DESC'
    ,
    function(err,rows){
      if(err){
        //Handle The Error
      }
      var last_month_orders = rows;
      var analytics = getAnalytics();
      res.render('index', { analytics, last_month_orders, current_month_orders, title: 'UNITE | Dashboard' });
    });
  });

});


/* GET Linked Accounts page. */
router.get('/link_accounts', function(req, res, next) {
  connection.query('SELECT store_name, icon_link, linked_account_username as username'
                  + ' FROM accounts'
                  + ' JOIN stores ON accounts.linked_store = stores.store_name',
  function(err,rows){
    if(err){
      // Handle the error
    }
    accounts = rows;
    res.render('LinkedAccounts', {accounts, title: 'UNITE | Dashboard' });
  });
});

/* GET Review Orders page. */
router.get('/review_orders', function(req, res, next) {
  var orders = {};
  connection.query("SELECT *, DATE_FORMAT(delivery_date,'%m/%d/%Y') AS delivery_date,DATE_FORMAT(dispatch_date,'%m/%d/%Y') AS dispatch_date FROM orders"
                  + ' NATURAL JOIN stores'
                  + ' ORDER BY delivery_date DESC'
  ,
  function(err,rows){
    if(err){
      // Handle the error
    }
    orders = rows;
    res.render('ReviewOrders', { orders, title: 'UNITE | Dashboard' });
  });
});

/* GET Amazon Demo page. */
router.get('/amazon', function(req, res, next) {
  res.render('AmazonDemo', { title: 'Amazon Demo' });
});

/* GET ASOS Demo page. */
router.get('/asos', function(req, res, next) {
  res.render('ASOSDemo', { title: 'ASOS Demo' });
});

module.exports = router;
