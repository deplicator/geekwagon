/**
 * Javascript that drives what couldn't be handled with css for geekwagon/jamespryor.net.
 */


/**
 * Pulls activities from the database in descending order thirty at a time and inserts them into the
 * activity table with an underscore template.
 * 
 * @param [limit]       integer     Where to start from, if not provided it starts from the latest 
 *                                  activity.
 */
function pullActivity(limit) {
    if (arguments.length == 0) { limit = 0; }
    $.getJSON('scripts/getActivity.php?limit=' + limit, function() {
        // For diagnostics
        //console.log('success');
    }).done(function(activities) {
        activities.forEach(function(activity) {
            var template = $('#activity-item').html();
            $('#tehactivities tbody').append(_.template(template, {activity: activity}));
        });
    }).fail(function() {
        console.log('Error: Failed to get data from getActivitiy.php.');
    });
}


/**
 * Show latest events for Summary tab, inserts into page with underscore template.
 */
function getLatestActivity() {
    $.getJSON('scripts/getActivity.php?limit=recent', function() {
        // For diagnostics
        //console.log('success');
    }).done(function(activities) {
        activities.forEach(function(activity) {
            var template = $('#summary-item').html();
            $('#latest-activity').append(_.template(template, {activity: activity}));
        });
    }).fail(function() {
        console.log('Error: Failed to get data from getActivitiy.php.');
    });
}


/**
 * Some of the text gathered from remote sites have strange characters. This fixes them, well some
 * of them.
 * 
 * @param usting        string      Unicode text to convert.
 */
function parseUnicodeString(ustring) {
    return ustring.replace(/u([\d\w]{4})/gi, function(match) {
        return String.fromCharCode(parseInt(match.substr(1), 16));
    });
}


/**
 * Takes Unix time as a string and returns a string formatted in the manor I deem prettiest.
 * 
 * @param unixTime      string      Time formated in number of seconds since January 1, 1970.
 */
function displayTime(unixTime) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date();
    var happened = new Date(unixTime);
    var year = happened.getFullYear();
    var month = months[happened.getMonth()];
    var date = happened.getDate();
    return month + ' ' + date + ', ' + year;
}


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
            url: 'resume/pryor-resume-' + which + '.md',
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
    // Display first page.
    var pages = $('.page');
    pages.hide().filter(':first').show();

    // When the hash changes hide content not associated with the related tab.
    $(window).bind('hashchange', function () {
        var hash = window.location.hash || '#summary';
        pages.hide();
        pages.filter(hash).fadeIn(600);
        $('.menu-item').removeClass('selected');
        $('#mi-' + hash.slice(1)).addClass('selected');
    });
    
    // Change to current hash if there is one in the address bar.
    $(window).trigger('hashchange');
    
    // Call latest event function for Summary tab.
    getLatestActivity();
    
    // Get the first 30 events for the Activity tab.
    pullActivity();
    
    // Show standard resume.
    displayResume('standard');
    
    // Pulls activity as user scrolls down Activity table.
    var count = 0;
    $(window).scroll(function () {
        if(window.location.hash == "#activity"){
            if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
                pullActivity(count += 30);
            }
        }
    });
    
    
    /** Click Handlers - because clicks must be handled. **/
    
    // Updates address bar hash when tab is clicked on.
    $('.menu-item').click(function() {
        window.location.hash = $(this).attr('id').slice(3);
    })

    // Makes the whole project card clickable.
    $('.project-summary').click(function() {
        window.location = $(this).attr('href');
    });

    // Swap out resume when Resume tab sub-menu is clicked.
    $('#resume-length').children().click(function (e) {
        e.PreventDefault;
        $('#resume-length').children('li').removeClass('active');
        displayResume($(this).attr('id').slice(3));
        $(this).addClass('active');
    });
});


















