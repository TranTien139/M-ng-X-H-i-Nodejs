$(document).ready(function() {
    var page = 0;
    var win = $(window);
    win.scroll(function() {
        if ($(document).height() - win.height() == win.scrollTop()) {
            $('#loading').show();
            page++;
            var id_profile = $("input[name='id_profile']").val();
            var id_group = $("input[name='id_group']").val();

            // Uncomment this AJAX call to test it
            $.post('/loadMoreNewFeed/', {'page':page}, function (data) {
                var domain = 'http://localhost:8080/loadMoreNewFeedHTML?page='+page+'&id_profile='+id_profile+'&id_group='+id_group;
                $('#LoadMoreNewFeed').append($('<div>').load(domain, function () { }));
            });

            // function loadmore_data(total,count) {
            //     var page = parseInt($('#txtPage').val());
            //     page = page + 1;
            //     var url = '';
            //     var urlCur = window.location.href;
            //     var urlFull = urlCur.split("?page=");
            //     if (urlFull.length > 1) {
            //         url = urlFull[0];
            //     } else {
            //         url = urlCur;
            //     }
            //     if (page > 1) {
            //         url = url + '?page=' + page;
            //     }
            //
            //     $('#main_moredata').append($('<div>').load(url + ' .list-daily-hot-news', function () {
            //
            //     }));
            //     $('#txtPage').val(page);
            //
            //     if (parseInt(total*page) >= parseInt(count)){
            //         $('.continue-btn').hide();
            //     }
            // }

        }
    });
});