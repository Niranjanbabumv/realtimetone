var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For Using The HTML Files And Images In The Directory
app.use('/', express.static(__dirname + '/'));
app.use('/', express.static(__dirname +'/Images'));

//Establishing Connection To Tone Analyzer
var tone_analyzer = new ToneAnalyzerV3({
  username: '119b28e1-304a-41e3-9f68-54d434c4eba7',
  password: 'MEjXO1lTYjlb',
  version_date: '2017-09-21'
});

// viewed at http://localhost:8080
app.get('/', function(req, res) {
console.log("Open ToneAnalysis.html page");
    res.sendFile(path.join(__dirname + '/ToneAnalysis.html'));
});


app.post('/analyzeTone', function (req, res) {
	console.log("Got a POST request for ToneAnalysis.html page");

	//Calling Tone Analyzer With Input Data	
  	tone_analyzer.tone({text: req.body.message}, function(error, response) {
		  if (error){
			console.log('error:', error);
			var data = {
					status : 400,
					message : "Issue in getting response from tone analyzer"
			}
		  res.send(JSON.stringify(data));
		  }else{
			var data = {
					status : 200,
					message : JSON.stringify(response)
			}
		  res.send(JSON.stringify(data));
		  }
	  });  	  
	res.send(JSON.stringify("OK"));
});


app.listen(8086);