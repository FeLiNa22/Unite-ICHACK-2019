var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { last_month_orders: last_month_orders, current_month_orders: current_month_orders, title: 'UNITE | Dashboard' });
});


/* GET home page. */
router.get('/link_accounts', function(req, res, next) {
  res.render('LinkedAccounts', {accounts :accounts, title: 'UNITE | Dashboard' });
});

/* GET home page. */
router.get('/review_orders', function(req, res, next) {
  res.render('ReviewOrders', { orders :all_orders, title: 'UNITE | Dashboard' });
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
