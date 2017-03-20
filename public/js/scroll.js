$(document).ready(function() {
    var page = 0;
    var win = $(window);
    win.scroll(function() {
        if ($(document).height() - win.height() == win.scrollTop()) {
            $('#loading').show();
            page++;
            console.log(page);
            // Uncomment this AJAX call to test it
            /*
             $.ajax({
             url: 'get-post.php',
             dataType: 'html',
             success: function(html) {
             $('#posts').append(html);
             $('#loading').hide();
             }
             });
             */

            // $('#posts').append(randomPost());
            // $('#loading').hide();
        }
    });
});