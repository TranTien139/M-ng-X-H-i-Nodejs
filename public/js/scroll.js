$(document).ready(function () {
    var page = 0;
    var win = $(window);
    win.scroll(function () {
        if ($(document).height() - win.height() == win.scrollTop()) {
            $('#loading').show();
            page++;
            var id_profile = $("input[name='id_profile']").val();
            var id_group = $("input[name='id_group']").val();
            var id_tag = $("input[name='id_tag']").val();
            var domain = 'http://localhost:8080/loadMoreNewFeedHTML?page=' + page + '&id_profile=' + id_profile + '&id_group=' + id_group+'&tag=' + id_tag;
            $('#LoadMoreNewFeed').append($('<div>').load(domain, function () {
            }));
        }
    });
});
