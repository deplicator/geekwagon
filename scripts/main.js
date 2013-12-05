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
        limit = "recent";
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
        
        if(window.location.hash == "#activity"){
            var top = 0;
            $(document).scroll(function() {
                if(top < $(document).scrollTop()) {
                    top = $(document).scrollTop();
                }
                if (!(top % 600)) {
                    pullActivity(pullCount);
                    pullCount += 30;
                }
            });
        }
    });
    $(window).trigger('hashchange');
    
    //menu item click handler
    $('.menu-item').click(function() {
        window.location.hash = $(this).attr('id').slice(3);
    })

    //DisplaySection();
    pullActivity(30);
    pullCount = 60;
    
    $.getJSON("scripts/getActivity.php?limit=recent", function() {
        //console.log("success");
    }).done(function(activities) {
        activities.forEach(function(activity) {
            template = $("#summary-item").html();
            $("#latest-activity").append(_.template(template, {activity: activity}));
        });
    }).fail(function() {
        console.log("Error: Failed to get data from getActivitiy.php.");
    }).always(function() {
        //console.log("complete");
    });
    
    
    $('section h2').hover(function() {
        $(this).children('.more-info').css('margin-bottom', '1.25em');
        $(this).children('.more-info').css('opacity', '1');
    }, function() {
        $(this).children('.more-info').css('margin-bottom', '0');
        $(this).children('.more-info').css('opacity', '0');
    });


    $('.project-summary').click(function() {
        window.location = $(this).attr('href');
    });

});

















