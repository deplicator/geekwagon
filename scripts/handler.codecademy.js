var badge = ''
$.ajax({
	url: "scripts/get.codecademy.php",
	dataType: "text",
	success: function(response) {
		//console.log($(response).find('div .achievement'));
		
		$(response).find('div .achievement').each(function() {
			//console.log($(this).find('.name').html());
			//console.log($(this).find('.created_at').html());
			//console.log($(this).find('.badge').attr('class').replace(/\s+/,' ').split(' '));
			
			var date = new Date($(this).find('.created_at').html());
			var monthNames = [ "January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December" ];

			month = monthNames[date.getMonth()];
			day = date.getDate();
			year = date.getFullYear();
			date = date.format();
			
			badge = '<div class="picture ' + $(this).find('.badge').attr('class') + '"></div>';

			$('#apilog').append(
				'<div class="event codecademy">' +
					'<div class="datetime">' + date + '</div>' +
					'<div class="datebox">' +
						'<div class="month">' + month + '</div>' +
						'<div class="day">' + day + '</div>' +
						'<div class="year">' + year + '</div>' +
					'</div><div class="filler"></div>' +
					'<div class="message">' +
						'<a href="http://www.codecademy.com/users/deplicator"><img class="icon" src="./images/codecademy_logo_smallest.png"></a>' +
						badge +
						$(this).find('.name').html() +
					'</div>' +
				'</div>');
			
		});
		
		
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});

