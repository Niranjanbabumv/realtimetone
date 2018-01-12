var myApp = angular.module("myModule",[]);

myApp.constant("moment", moment);

myApp.controller('myController', ['$scope','$http', 'moment', function($scope,$http,momemt){
	
	$scope.msgFromMic = "";
	
	var ctsIcon = {
		name : "CTS",
		ctsIconLoc : "/Images/cts.jpg",
		message : "CTS Logo"
	};
	$scope.ctsIcon = ctsIcon ;
	
	var micIcon = {
		name : "Speak",
		micIconLoc : "/Images/mic.gif",
		message : "Sign In"
	};
	$scope.micIcon = micIcon ;
	
	var keyIcon = {
		name : "Type",
		keyIconLoc : "/Images/keyboard.jpg",
		message : "Sign In"
	};
	$scope.keyIcon = keyIcon ;
	
	$scope.Mic = false;
	
	$scope.Keyboard = true;
	
	$scope.showAudioSection = function(){
		$scope.Mic = true;		
		$scope.Keyboard = false;
		if (recognizing) {
			$scope.micIcon.micIconLoc = "/Images/mic.gif";
			recognition.stop();
			$scope.msgFromMic = "";
		reset();
		} else {
			$scope.micIcon.micIconLoc = "/Images/mic-animate.gif";
			recognition.start();
			recognizing = true;
		}
	}
	
	$scope.showWritingSection = function(){
		$scope.Mic = false;		
		$scope.Keyboard = true;
	}
	
	var recognizing;
	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	reset();
	recognition.onend = reset();

	recognition.onresult = function (event) {
		$scope.$apply(function(){	
		  for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
			  console.log(event.results[i][0].transcript);
			  $scope.msgFromMic += event.results[i][0].transcript;
			}
		  }
		}); 
	
		var data = {
			message: $scope.msgFromMic
		}
		
		var anger = 0 ;
		var sadness = 0 ;
		var fear = 0 ;
		var joy = 0 ;
	
		$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8086/analyzeTone/', 
		   data: data  
		}).then(function successCallback(response) {
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
				var tone_respone = JSON.parse(response.data.message);
				if(tone_respone != '{}'){
					var tones = tone_respone.document_tone.tones;
					if(tones != '{}'){
						for(i = 0 ; i < tones.length; i++){
								if(tones[i].tone_name == "Sadness"){
									sadness = tones[i].score ;
								}else if(tones[i].tone_name == "Anger"){
									anger = tones[i].score ;
								}else if(tones[i].tone_name == "Fear"){
									fear = tones[i].score ;
								}else if(tones[i].tone_name == "Joy"){
									joy = tones[i].score ;
								}	
						}
						$scope.createChart(anger,fear,joy,sadness);
					}	
				}	
			}else{
				alert(response.data.message);
			} 			 
		});
	}

	function reset() {
	  recognizing = false;
	}
	
	$scope.sendDataForAnalysisTab = function(){
	var anger = 0 ;
	var sadness = 0 ;
	var fear = 0 ;
	var joy = 0 ;
	
	var data = {
		message: $scope.msgFromKey
	}
		
	$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8086/analyzeTone/', 
		   data: data  
		}).then(function successCallback(response) {
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
				var tone_respone = JSON.parse(response.data.message);
				if(tone_respone != '{}'){
					var tones = tone_respone.document_tone.tones;
					if(tones != '{}'){
						for(i = 0 ; i < tones.length; i++){
								if(tones[i].tone_name == "Sadness"){
									sadness = tones[i].score ;
								}else if(tones[i].tone_name == "Anger"){
									anger = tones[i].score ;
								}else if(tones[i].tone_name == "Fear"){
									fear = tones[i].score ;
								}else if(tones[i].tone_name == "Joy"){
									joy = tones[i].score ;
								}	
						}
						$scope.createChart(anger,fear,joy,sadness);
					}	
				}	
			}else{
				alert(response.data.message);
			} 				
		});
	}
	
	$scope.createChart = function (anger, fear, joy, sadness){
		
		var chartColors = {
			red: 'rgb(255, 99, 132)',
			orange: 'rgb(255, 159, 64)',
			yellow: 'rgb(255, 205, 86)',
			green: 'rgb(75, 192, 192)',
			blue: 'rgb(54, 162, 235)',
			purple: 'rgb(153, 102, 255)',
			grey: 'rgb(201, 203, 207)'
		};

		function newDate(ms) {
			return moment().add(ms, 'ms');
		}

		function onRefresh() {
			var tone_data = new Array();
			tone_data.push(anger);
			tone_data.push(fear);
			tone_data.push(joy);
			tone_data.push(sadness);
			var i = 0;
			config.data.datasets.forEach(function(dataset) {
				dataset.data.push({
					x: moment(),
					y: tone_data[i]
					/* y: Math.round(Math.random() * tone_data[i]) */
				});
				i++;
			});
		}

		var color = Chart.helpers.color;
		var config = {
			type: 'line',
			data: {
				datasets: [{
					label: 'Anger',
					backgroundColor: color(chartColors.red).alpha(0.5).rgbString(),
					borderColor: chartColors.red,
					fill: false,
					cubicInterpolationMode: 'monotone',
					data: []
				}, {
					label: 'Fear',
					backgroundColor: color(chartColors.blue).alpha(0.5).rgbString(),
					borderColor: chartColors.blue,
					fill: false,
					cubicInterpolationMode: 'monotone',
					data: []
				}, {
					label: 'Joy',
					backgroundColor: color(chartColors.yellow).alpha(0.5).rgbString(),
					borderColor: chartColors.yellow,
					fill: false,
					cubicInterpolationMode: 'monotone',
					data: []
				}, {
					label: 'Sadness',
					backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
					borderColor: chartColors.green,
					fill: false,
					cubicInterpolationMode: 'monotone',
					data: []
				}]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Tone Analysis'
				},
				scales: {
					xAxes: [{
						type: 'realtime',
						display: false,
					}],
					yAxes: [{
						type: 'linear',
						display: true,
					}]
				},
				tooltips: {
					intersect: false
				},
				hover: {
					mode: 'nearest',
					intersect: false
				},
				plugins: {
					streaming: {
						duration: 20000,
						refresh: 1000,
						delay: 2000,
						onRefresh: onRefresh
					}
				}
			}
		};
		
		var ctx = document.getElementById('canvas').getContext('2d');
		var myLine = new Chart(ctx, config);
		
		var colorNames = Object.keys(chartColors);
	}
	
}]);

