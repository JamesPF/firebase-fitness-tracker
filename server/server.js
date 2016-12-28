const express = require('express');

var app = express();

var port = 3000;
app.use(express.static(__dirname + '/../public'));

app.listen(3000, () => {
  console.log('Application running on port 3000');
});
