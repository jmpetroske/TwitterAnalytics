$(document).ready(function(){
	var labels = new Array(24); // Stores the labels for the graph
	for (var i = 0; i < 24; i++){
		labels[i] = (i % 12).toString();
		if (labels[i] == "0"){
			labels[i] = "12";
		}
		if (i < 12){
			labels[i] += "AM";
		} else {
			labels[i] += "PM";
		}
	}	
	
	$("#loadButton").click(load);
	$("input[name='displayType']").change(updateChart); // TODO: dont require http request
	$("#tweetMultiplierDisplay").text("Sample Size: Less than " + $("input[name=tweetMultiplier]").val()*200 + " tweets");	
	$("input[name=tweetMultiplier]").change(function(){
		$("#tweetMultiplierDisplay").text("Sample Size: Less than " + $("input[name=tweetMultiplier]").val()*200 + " tweets");	
	});
	$(window).resize(updateChart);

	var chartIsLoaded = false;
	var settings = settings = {
			labels: labels,
			datasets: [
				{
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
				}
			]
	};
	var hourlyCounts, hourlyPercents;

	function updateChart() {
		if (chartIsLoaded) {
			if ($("input[type='radio'][name='displayType']:checked").val() == "amount"){
				settings.datasets[0].data = hourlyCounts;
			} else {
				settings.datasets[0].data = hourlyPercents;
			}

			$("#amountvtimeGraph").remove();
			$("#statisticsContainer").append(
					"<canvas id='amountvtimeGraph' width='" + ($(window).width() * 0.8).toString() + "px' height='256'></canvas>");
			var amountvtimeChart = new Chart($("#amountvtimeGraph").get(0).getContext("2d"));
			amountvtimeChart.Line(settings, {animation: false});
		}
	}

	function load(){
		var tweetMultiplier = $("input[name=tweetMultiplier]").val();
		var handle = $("#twitterHandle").val();
		if (handle.charAt(0) == "@"){
			handle = handle.substring(1,handle.length);
		}
		console.log("loading: " + handle);
		console.log("Tweet Multiplier: " + tweetMultiplier);

		$.getJSON("http://students.washington.edu/petroske/testing/timestamps.php",
			{"handle":handle, "tweetMultiplier":tweetMultiplier},
			function (data){
				console.log(data);
				/* Creates an array hourlyPercents containing the percent of tweets at each hour */
				// Creates an array of length 24 with all elements initialized to 0
                hourlyCounts = new Array(24+1).join("0").split("").map(parseFloat); 
				var curval = data[0];
				data = data.sort();
				var tweetsPerHour = 0;
				if (data.length > 0){
					tweetsPerHour = data.length / ((data[data.length -1] - data[0]) / (60*60));	
				}
				for(var i = 0; i < data.length; i++){
                    var dateObj = new Date(data[i] * 1000);
                    hourlyCounts[dateObj.getHours()]++;  
                }
				// Account for edge case where no tweets were found
				if (data.length == 0){
					hourlyPercents = hourlyCounts;
				} else {
					hourlyPercents = new Array(24);	
					for (var i = 0; i < 24; i++){
						hourlyPercents[i] = hourlyCounts[i] * 100 / data.length;	
					}	
				}

				$("#statisticsContainer").empty();
				$("#statisticsContainer").append("<p>Tweets Per Hour: " 
							+ tweetsPerHour.toFixed(2).toString()
							+ " Sample Size: " + data.length.toString() + "</p>");

				updateChart();
			}
		);
		chartIsLoaded = true;
	}
}); 
