
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const ejs = require('ejs');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function(req, res){
  res.render('signup');
})

app.post('/', function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members : [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  }
const jsonData = JSON.stringify(data);

const url = 'https://us12.api.mailchimp.com/3.0/lists/b8a46a1f3b';
const options = {
  method: 'POST',
  auth: 'gbengarock:03741580505a8e9ce41d9767d4460c7f-us12'
}

const request = https.request(url, options, function(response){
  if (response.statusCode === 200){
    res.render('success', {userName: req.body.fName} );
  } else {
    res.render('failure');
  }
  response.on('data', function(data){
    console.log(JSON.parse(data));
  })

})
  request.write(jsonData);
  request.end();
})

app.post('/failure', function(req, res){
  res.redirect('/');
})

app.post('/success', function(req, res){
  res.redirect('/');
})

app.listen(process.env.PORT || 3002, function(){
  console.log('welcome, we are live on port 3002!');
})