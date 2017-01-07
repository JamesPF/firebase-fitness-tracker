const express = require('express');

var app = express();

var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/../public'));

app.listen(port, () => {
  console.log('Application running on port ' + port);
});
