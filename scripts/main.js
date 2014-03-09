//http://stackoverflow.com/a/3291856/2219970
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//Refreshes section
function DisplaySection() {
    var pages = $('.page');
    pages.hide().filter(':first').show();

    $(window).bind('hashchange', function () {
        var hash = window.location.hash || '#summary';
        pages.hide();
        pages.filter(hash).show();
    });

    $(window).trigger('hashchange');
    
    $('.menu-item').click(function() {
        $('.menu-item').removeClass('selected');
        $(this).addClass('selected');
        window.location.hash = $(this).attr('id').slice(3);
    })
}

function pullActivity(limit) {
    if (arguments.length == 0) {
        limit = "all";
    }
    $.getJSON("scripts/getActivity.php?limit=" + limit, function() {
        //console.log("success");
    }).done(function(activities) {
        test = activities;
        activities.forEach(function(activity) {
            template = $("#activity-item").html();
            $("#tehactivities tbody").append(_.template(template, {activity: activity}));
        });
    }).fail(function() {
        console.log("Error: Failed to get data from getActivitiy.php.");
    }).always(function() {
        //console.log("complete");
    });
}

function parseUnicodeString(ustring) {
    return ustring.replace(/u([\d\w]{4})/gi, function(match) {
        return String.fromCharCode(parseInt(match.substr(1), 16));
    });
}

function displayTime(unixTime) {
    var months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

    var now = new Date();
    var happened = new Date(unixTime);
    var year = happened.getFullYear();
    var month = months[happened.getMonth()];
    var date = happened.getDate();
    return month + " " + date + ", " + year;
}

$(document).ready(function() {
    //display page based on hash
    var pages = $('.page');
    pages.hide().filter(':first').show();

    $(window).bind('hashchange', function () {
        var hash = window.location.hash || '#summary';
        pages.hide();
        pages.filter(hash).fadeIn(600);
        $('.menu-item').removeClass('selected');
        $('#mi-' + hash.slice(1)).addClass('selected');
        
        //Pull all activity when user scrolls down.
        if(window.location.hash == "#activity"){
            pullFlag = true;
            $(document).scroll(function() {
                if($(document).scrollTop() > 600 && pullFlag) {
                    pullFlag = false;
                    pullActivity('all');
                    
                }
            });
        }
    });
    $(window).trigger('hashchange');
    
    //menu item click handler
    $('.menu-item').click(function() {
        window.location.hash = $(this).attr('id').slice(3);
    })

    //Show first 30 events on Activity page.
    pullActivity(30);
    
    //Show latest events on summary page.
    $.getJSON("scripts/getActivity.php?limit=recent", function() {
        //console.log("success");
    }).done(function(activities) {
        activities.forEach(function(activity) {
            var template = $("#summary-item").html();
            $("#latest-activity").append(_.template(template, {activity: activity}));
        });
    }).fail(function() {
        console.log("Error: Failed to get data from getActivitiy.php.");
    }).always(function() {
        //console.log("complete");
    });

    $('.project-summary').click(function() {
        window.location = $(this).attr('href');
    });

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        $.ajax({
            url: 'resume/pryor-resume-extended.md',
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
});


















