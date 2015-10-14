var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var gmailauth = require('./auth.json');
var data = require('./data');

// Initialize our express application
var app = express();

// Set Jade as the engine for HTML and run it
app.set('view engine', 'jade');

// Set server ip and port
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '0.0.0.0');

// Set root directory.
app.use(express.static('public'));

// Enable body-parser for req.body calls
app.use(bodyParser.urlencoded({ extended: false }));

function formatDate(date){
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dateArr = date.split('-');
  var month = months[dateArr[1]];
  var day = parseInt(dateArr[2],10);
  return month + " " + day;
}

var sortedEvents = data.events.slice(0);

sortedEvents.sort(function(a,b){
  if ( a.date > b.date ){
    return 1;
  } else if ( a.date < b.date ){
    return -1;
  } else {
    return 0;
  }
});

sortedEvents = sortedEvents.map(function(a){
  return {
    "url": a.url,
    "title": a.title,
    "date": formatDate(a.date),
    "time": a.time,
    "location": a.location
  };
});

var sortedGames = data.games.slice(0);

sortedGames.sort(function(a,b){
  if ( a.name > b.name ){
    return 1;
  } else if ( a.name < b.name ){
    return -1;
  } else {
    return 0;
  }
});

app.get('/', function(req,res,next){
    res.render('index', {
        title: 'Tech & Tabletop Club',
        location: 'Union College, Lincoln Nebraska',
        events: sortedEvents,
        officers: data.officers,
        games: sortedGames
    });
});

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: gmailauth
});

app.post('/email', function(req,res,next){
  console.log(req.body);
  var mailOptions = {
      from: 'UnionTTC <uctechtabletop@gmail.com>',
      to: 'uctechtabletop@gmail.com',
      subject: 'Feedback from website',
      html: '<ul>'+
              '<li>From: '+req.body.email+'</li>'+
              '<li>Message: '+req.body.message+'</li>'+
            '</ul>'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    //If you felt like it, you could do fancy renders here, or a thank
    //you page or something.
    res.redirect('/');
  });
});

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log('[ttc] app running on http://%s:%s', address.address, address.port);
});