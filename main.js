var request = require('request');
var cheerio = require("cheerio");
var express = require('express');
var ejs = require('ejs');
var fs = require('fs');
var bodyParser = require('body-parser');
var word1 = require('./word.json');

var app = express();
app.set('view engine', 'ejs');

app.use( express.static( "public" ) );

app.use(bodyParser.urlencoded({extended: false}));
const $ = cheerio();

//A function to get the zipcode of the city from the website
function getZipcode(cityy){
  var zip = "";

  if(cityy == 'barcelona'){
    zip = '753692';
  }else if(cityy == 'tel-aviv') {
    zip = '1968212';
  } else if(cityy == 'los-angeles'){
    zip = '2442047';
  } else if(cityy == 'sydney'){
    zip = '23388205';
  } else {
    return;
  }
  return zip;
}

//Search by City 
let url = "";
let LosAngeles = 'https://www.yahoo.com/news/weather/united-states/los-angeles/los-angeles-2442047';
let Barcelona = 'https://www.yahoo.com/news/weather/spain/barcelona/barcelona-753692'
let uri = 'https://www.yahoo.com/news/weather/';


//Route to Search Page
app.get('/', function(req, res) {

  res.render('search', { msg:'Yes'});

  });

 //Route to the About page
 app.get('/about', (req, res) => {
  
  var cont = fs.readFileSync("word.json");
  var jsonCont = JSON.parse(cont);
  
  console.log(JSON.stringify(jsonCont[0].city));
  
      res.render('about', { word1:jsonCont});
 // return res.send(req.query);
  });

  app.post('/about', (req, res) => {
    var area = {
      country: req.body.cname,
      cityName: req.body.sname
    }
    console.log(area);

    res.render('about', {
      userValue: area,
      topic: 'countrys'
    });
  });

  //Route to Index(Weather) Page
app.get('/index', (req, res) => {

  var country1 = req.query.sname;
  var city1 = req.query.cname;
  var zipCode = "";

  zipCode = getZipcode(city1);
  var fullUrl = uri + country1 + "/" + city1 + "/" + city1 + "-" + zipCode;
  console.log(fullUrl);

//HTTP Request to get data from yahoo weather website and save it into a json file
request(fullUrl, function(err, response, html){
    if(!err){
       const $ = cheerio.load(html);

        const city = $('.city');
        const description = $('.day-description').nextUntil('p.day-description My');
        const temp = $('.now');
        const humidity = $('.item').children().nextUntil('div.Fl');

        var data = [];
        
         var c = {"city":city.text(),
          "description":description.text(),
          "temperature":temp.text(),
          "humidity":humidity.text()};

         data.push(c);

         fs.writeFileSync('word.json', JSON.stringify(data,null,2));

        console.log( city.text() + '\n' + description.text() + '\n' + temp.text() + '\n' + humidity.text());
         }

    });

    var cont = fs.readFileSync("word.json");
    var jsonCont = JSON.parse(cont);

//console.log(JSON.stringify(jsonCont[0].city));
    res.render('index', {word1: jsonCont});
    
  });

//Style Route
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "style.css");
  });
 

app.listen('5000', function(){
    console.log('Login Success');
});


