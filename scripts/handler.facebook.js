/*
 * 
 */
$.ajax({
	url: "scripts/get.facebook.php",
	dataType: "json",
	success: function(response) {
		//console.log(response);
		
		var len = response.data.length;
		for(i = 0; i < len; i++) {
			var monthNames = [ "January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December" ];
				
			var date = new Date(response.data[i].created_time);
			month = monthNames[date.getMonth()];
			day = date.getDate();
			year = date.getFullYear();
			date = date.format();
			
			var message = response.data[i].message;
			if(typeof(message) == 'undefined') {
				message = '';
			}
			var link = response.data[i].id;
			message = '<a href="https://www.facebook.com/' + link + '">' + message + '</a>';
			
			var story = response.data[i].story
			if(typeof(story) == 'undefined') {
				story = '';
			}
			story = '<a href="https://www.facebook.com/' + link + '">' + story + '</a>';
			
			var from = response.data[i].from.name;
			if(from == 'James Pryor') {
				from = '';
			} else {
				from = from + ' says ';
			}
			
			var commentCount = response.data[i].comments.count;
			if(commentCount > 1) {
				var comments = commentCount + ' comments';
			} else if(commentCount == 1) {
				var comments = '1 comment';
			} else {
				var comments = '';
			}
			
			var like = response.data[i].likes;
			if(typeof(like) == 'undefined') {
				var likes = '';
			} else {
				var likeCount = response.data[i].likes.count;
				if(likeCount > 1) {
					var likes = likeCount + ' likes';
				} else if(likeCount == 1) {
					var likes = '1 like';
				} else {
					var likes = '';
				}
			}
			
			var social = '';
			if(commentCount > 0 && likeCount > 0 && typeof(like) != 'undefined') {
				social = ' (' + comments + ' & ' + likes + ')';
			} else if(commentCount > 0 && likeCount == 0 || typeof(like) != 'undefined') {
				//I don't even know why this works
				social = ' (' + likes + ')';
			} else if(commentCount > 0 && likeCount > 0 || typeof(like) != 'undefined') {
				//I assume this works, no one leaves a comment without liking it.
				social = ' (' + comments + ')';
			} else {
				social = '';
			}
			
			$('#apilog').append(
				'<div class="event facebook">' +
					'<div class="datetime">' + date + '</div>' +
					'<div class="datebox">' +
						'<div class="month">' + month + '</div>' +
						'<div class="day">' + day + '</div>' +
						'<div class="year">' + year + '</div>' +
					'</div><div class="filler"></div>' +
					'<div class="message">' +
					'<a href="http://facebook.com/deplicator"><img class="icon" src="./images/f_logo.png"></a>' +
					from + message + story +
					'<div class="notes">' + 
						social + 
					'</div>');
		}
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log('ERROR', textStatus, errorThrown);
	}
});