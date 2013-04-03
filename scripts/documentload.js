$(document).ajaxComplete(function() {
	
	$("#apilog > div").tsort({order:'desc'});

});

var b;
$("#blogtoggle").toggleSwitch({
  highlight: true, // default
  width: 100, // default
  change: function(e) {
  console.log(e);
	if (b) {
		b.appendTo('#apilog');
		$("#apilog > div").tsort({order:'desc'});
		b = null;
	} else {
		b = $('.blogger').detach();
		console.log('gone');
	}
  } // default: null
});

var c;
$('#codecademytoggle').click(function() {
	if (c) {
		c.appendTo('#apilog');
		$("#apilog > div").tsort({order:'desc'});
		c = null;
	} else {
		c = $('.codecademy').detach();
	}
});

var f;
$('#facebooktoggle').click(function() {
	if (f) {
		f.appendTo('#apilog');
		$("#apilog > div").tsort({order:'desc'});
		f = null;
	} else {
		f = $('.facebook').detach();
	}
});

var p;
$('#githubtoggle').click(function() {
	if (p) {
		p.appendTo('#apilog');
		$("#apilog > div").tsort({order:'desc'});
		p = null;
	} else {
		p = $('.github').detach();
	}
});



