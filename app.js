var express = require('express'),
    jade = require('jade');

var caldata = require('./caldata');

// Initialize our express application
var app = express();

// Set Jade as the engine for HTML and run it
app.set('view engine', 'jade');

// Set server ip and port
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '0.0.0.0');

// Set root directory.
app.use(express.static('public'));

app.get('/', function(req,res,next){
    res.render('index', {
        title: 'Tech & Tabletop Club',
        location: 'Union College, Lincoln Nebraska',
        events: caldata.events
    });
});

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log('[ttc] app running on http://%s:%s', address.address, address.port);
});
