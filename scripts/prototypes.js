/*
 * Custom prototypes used for geekwagon.net.
 */
Date.prototype.format = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	var h = this.getHours().toString();
	var m = this.getMinutes().toString();
	return yyyy + "-" + (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + "  " + (h[1]?h:"0"+h[0]) + ":" + (m[1]?m:"0"+m[0]); // padding
};