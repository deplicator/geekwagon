/**
 * Javascript that drives what couldn't be handled with css for geekwagon/jamespryor.net.
 */


/**
 * Swaps out my resume with the resume length buttons. I only did this because I liked the idea of
 * a tweet sized resume. Now I need a twitter account.
 * 
 * @param which         string      Accepts 'brief', 'standard', or 'story' and displays my resume 
 *                                  with the corresponding name.
 */
function displayResume(which) {
    if (arguments.length == 0) { which = 'standard'; }
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $.ajax({
            url: 'pryor-resume-' + which + '.md',
            type: 'get',
            success: function(text) {
                marked(text, function (err, text) {
                    if (err) throw err;
                    $('#resume-content').html(text);
                });
            }
        });
    } else {
        alert('The File APIs are not fully supported by your browser.');
    }
}


/**
 * Standard jQuery run this stuff after DOM load.
 */
$(document).ready(function() {

    // Show standard resume.
    displayResume('print');

});


















