var express = require('express');
var router = express.Router();

const reader = require('../model/build/Release/Reader.node')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/read', function (req, res, next) {
  const file = req.query.file
  model = reader.importFile(file)
  res.send(model);
});

router.get('/update/addmodel', function (req, res, next) {
  const file = req.query.file
  model = reader.importFile(file)
  res.send(model);
});


module.exports = router;