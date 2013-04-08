$.ajax({
	url: "scripts/get.blogger.php?wut=posts",
	dataType: "json",
	success: function(response) {
		//console.log(response);
		for(i = 0; i < 20; i++) {
			var monthNames = [ "January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December" ];
				
			var date = new Date(response.items[i].published);
			month = monthNames[date.getMonth()];
			day = date.getDate();
			year = date.getFullYear();
			date = date.format();
			
			comments = '';
			if(response.items[i].replies.totalItems != 0){
				if(response.items[i].replies.totalItems == 1) {
					comments = '1 comment';
				} else {
					comments = response.items[i].replies.totalItems + ' comments';
				}
			}
			
			img = '';
			if(response.items[i].content.indexOf('<img') != -1) {
				var find = $('<div>' + response.items[i].content).find('img:first').attr('src');
				img = '<img class="picture" src="' + find + '">';
			}
			
			var message = '<a href="' + response.items[i].url + '">' +
						  response.items[i].title + 
					  '</a>';
						
			$('#apilog').append(
			'<div class="event blogger">' +
				'<div class="datetime">' + date + '</div>' +
				'<div class="datebox">' +
					'<div class="month">' + month + '</div>' +
					'<div class="day">' + day + '</div>' +
					'<div class="year">' + year + '</div>' +
				'</div><div class="filler"></div>' +
				'<div class="message">' +
					'<a href="http://blog.geekwagon.net"><img class="icon" src="./images/blogger_logo.png"></a>' +
					img +
					message +
					'<div class="notes">' + 
						comments + 
					'</div>');
		}
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});

$.ajax({
	url: "scripts/get.blogger.php?wut=blog",
	dataType: "json",
	success: function(response) {
		//console.log(response);
		var monthNames = [ "January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December" ];
			
		var date = new Date(response.published);
		var desiredDate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
		
		$('#randomfacts').append(
			'<div id="blogfacts">' +
				'<h4>About My Blog</h4>' + 
				'<p>I\'ve managed to make ' + response.posts.totalItems + ' blog posts since ' + desiredDate + '</p>' +
			'</div>'
		);
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});