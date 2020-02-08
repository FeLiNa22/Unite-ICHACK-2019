var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
