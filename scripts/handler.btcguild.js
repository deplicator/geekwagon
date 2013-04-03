var totalHashrate = 0;

$.ajax({
	url: "scripts/get.btcguild.php",
	dataType: "json",
	success: function(response) {
		//console.log(response);
		
		for(i = 1; i < 5; i++) {
			totalHashrate += response.workers[i].hash_rate;
		}
		totalHashrate = Math.round(totalHashrate);
		$('#bitcoins').html(
			'<h4>Bitcoin Mining</h4>' + 
			'<img src="./images/bitcoin.png">' +
			'<p>' + totalHashrate + ' MH/s</p>');
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});