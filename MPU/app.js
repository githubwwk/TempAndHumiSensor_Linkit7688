var express = require('express'),
    path = require('path'),
    os = require('os'),
    route = require('./private/route.js'),
    arduino = require('./private/arduino.js'),
    db = require('./private/db.js');

var app = express();
app.get('/', route.current);
app.get('/statisticMenu', route.statisticMenu);
app.get('/statisticResult', route.statisticResult);
app.get('/current', route.current);


app.set('views', path.join(__dirname, 'views'));
app.set('private', path.join(__dirname, 'private'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

/******************/
db.init();
arduino.init();
/******************/

app.listen(3000);

//console.log(os.platform());
console.log("Server Start...");