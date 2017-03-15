$(document).ready(function () {
    $('#nav_user').click(function () {
        $('.chat-sidebar').toggleClass('focus');
    });
});

$(".like-Unlike").click(function (e) {
    $id = $(this).attr('data-id');
    $action = $(this).attr('action');
    if ($(this).attr('action') === 'like') {
        $.post('/post-like/' + $action, {'id_article': $id}, function (data) {

        });
        $(this).attr('action', 'unlike');
        $(this).html('<i class="fa fa-thumbs-o-down">Unlike</i>');
        $val = parseInt($(this).parent().find('.pull-right.text-muted').children('.count-like').text()) + 1;
        $(this).parent().find('.pull-right.text-muted').children('.count-like').text($val);
    }
    else {
        $.post('/post-like/' + $action, {'id_article': $id}, function (data) {

        });
        $(this).attr('action', 'like');
        $(this).html('<i class="fa fa-thumbs-o-up">Like</i>');
        $val = parseInt($(this).parent().find('.pull-right.text-muted').children('.count-like').text()) - 1;
        $(this).parent().find('.pull-right.text-muted').children('.count-like').text($val);
    }
});

$(".like-UnlikeGroup").click(function (e) {
    $id = $(this).attr('data-id');
    $action = $(this).attr('action');
    $id_group = $("#iddd_group").val();
    if ($(this).attr('action') === 'like') {
        $.post('/post-like-gr/' + $action, {'id_article': $id,'id_group':$id_group}, function (data) {

        });
        $(this).attr('action', 'unlike');
        $(this).html('<i class="fa fa-thumbs-o-down">Unlike</i>');
        $val = parseInt($(this).parent().find('.pull-right.text-muted').children('.count-like').text()) + 1;
        $(this).parent().find('.pull-right.text-muted').children('.count-like').text($val);
    }
    else {
        $.post('/post-like-gr/' + $action, {'id_article': $id,'id_group': $id_group}, function (data) {

        });
        $(this).attr('action', 'like');
        $(this).html('<i class="fa fa-thumbs-o-up">Like</i>');
        $val = parseInt($(this).parent().find('.pull-right.text-muted').children('.count-like').text()) - 1;
        $(this).parent().find('.pull-right.text-muted').children('.count-like').text($val);
    }
});

function getAddFriend($list) {
    $.post('/get-list-addfriend/', {'list_addfriend': $list}, function (data) {
        $('#content_addfriend').html(data);
    });
}

function ConfirmAddFriend($id) {
    $.post('/confirm-friend/' + $id, {'id_friend': $id}, function (data) {
    });
    $('#fr_'+$id).remove();
}

function ReadAllMessage() {
    $.post('/read-allmessage', {}, function (data) {
    });
    $('#content_allmessage').html('');
}

$('.addfriend_unfriend').click(function (e) {
    $id_other = $(this).attr('id-other');
    $action = $(this).attr('action');
    if ($action === 'send') {
        $.post("/send-add-friend/" + $id_other, {}, function (data) {
        });
        $(this).text('cancel add friend');
    }
    if ($action === 'unfriend') {
        $.post('/send-unfriend/' + $id_other, {}, function (data) {
        });
        $(this).text('add friend');
    }

    if ($action === 'cancelsend') {
        $.post('/send-unsendfriend/' + $id_other, {}, function (data) {
        });
        $(this).text('add friend');
    }
});

$('.join-group').click(function (e) {
    $id_group = $(this).attr('id_group');
    $action = $(this).attr('action');
    if ($action === 'join') {
        $.post("/join-group/" + $id_group, {}, function (data) {
        });
        $(this).attr('unjoin');
        $(this).text('UnJoin Group');
    }
    if ($action === 'unjoin') {

        $.post('/unjoin-group/' + $id_group, {}, function (data) {
        });
        $(this).attr('join');
        $(this).text('Join Group');
    }
});

// preview image
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#myAvatar_preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#myAvatar").change(function () {
    readURL(this);
});

function readURL1(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#myCover_preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#myCover").change(function () {
    readURL1(this);
});

function readURL2(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#addImageGroup1').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#addImageGroup").change(function () {
    readURL2(this);
});

//Check File API support
if (window.File && window.FileList && window.FileReader) {
    var filesInput = document.getElementById("addImageStatus");

    filesInput.addEventListener("change", function (event) {

        var files = event.target.files; //FileList object
        var output = document.getElementById("results_upload");

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            //Only pics
            if (!file.type.match('image'))
                continue;

            var picReader = new FileReader();

            picReader.addEventListener("load", function (event) {

                var picFile = event.target;

                var div = document.createElement("li");

                div.innerHTML = "<img class='thumbnail' width='80' height='80' src='" + picFile.result + "'" +
                    "title='" + picFile.name + "'/> <a style='cursor: pointer;'  onclick='removeHtml(this)' class='remove_pict'>X</a>";
                output.insertBefore(div, null);
            });

            //Read the image
            picReader.readAsDataURL(file);
        }

    });
}

$("#results_upload").on("click", ".remove_pict", function () {
    $(this).parent().remove();
});

