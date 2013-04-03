//Get and parse API
$.ajax({
	url: "scripts/get.github.php?wut=events",
	dataType: "json",
	success: function(response) {
		//console.log(response);
		
		var len = response.length;

		for(i = 0; i < len; i++) {
			var date = new Date(response[i].created_at);
			var monthNames = [ "January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December" ];
					
			month = monthNames[date.getMonth()];
			day = date.getDate();
			year = date.getFullYear();
			date = date.format();
			
			var message = response[i].type.slice(0,-5);
			var secondbit = "";
			
			if(response[i].type.slice(0,-5) == "Follow") {
				secondbit = response[i].payload.target.name;
			} else if(response[i].type.slice(0,-5) == "Push") {
				secondbit = 'to ' + response[i].repo.name.slice(11) + ', comment: \'' + response[i].payload.commits[0].message + '\'';
			} else if(response[i].type.slice(0,-5) == "Create" || response[i].type.slice(0,-5) == "Watch") {
				secondbit = response[i].repo.name.slice(11);
			}


			$('#apilog').append(
				'<div class="event github">' +
					'<div class="datetime">' + date + '</div>' +
					'<div class="datebox">' +
						'<div class="month">' + month + '</div>' +
						'<div class="day">' + day + '</div>' +
						'<div class="year">' + year + '</div>' +
					'</div><div class="filler"></div>' +
					'<div class="message">' +
						'<a href="https://github.com/deplicator"><img class="icon" src="./images/github_icon.png"></a>' +
						message + secondbit +
					'</div>' +
				'</div>');
		}

	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});

//Get and parse RSS
$.ajax({
	url: "scripts/get.github.php",
	dataType: "text",
	success: function(response) {
		//console.log($(response).find('div.simple'));
		
		$(response).find('div.simple').each(function() {
			//console.log($(this).find('time').attr('datetime'));
			//console.log($(this).find('.title').html());
			
			var date = new Date($(this).find('time').attr('datetime'));
			var monthNames = [ "January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December" ];

			month = monthNames[date.getMonth()];
			day = date.getDate();
			year = date.getFullYear();
			date = date.format();

			$('#apilog').append(
				'<div class="event github">' +
					'<div class="datetime">' + date + '</div>' +
					'<div class="datebox">' +
						'<div class="month">' + month + '</div>' +
						'<div class="day">' + day + '</div>' +
						'<div class="year">' + year + '</div>' +
					'</div><div class="filler"></div>' +
					'<div class="message">' +
						'<a href="https://github.com/deplicator"><img class="icon" src="./images/github_icon.png"></a>' +
						$(this).find('.title').html() + //[BUG] all links are relative
					'</div>' +
				'</div>');
			
			
		});
		
		
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});