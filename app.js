var express = require('express');
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

app.get('/', function(req,res,next){
    res.render('index', {
        title: 'Tech & Tabletop Club',
        location: 'Union College, Lincoln Nebraska',
        events: data.events,
        officers: data.officers,
        games: data.games
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