$(document).ready(function () {
    $('#nav_user').click(function () {
        $('.chat-sidebar').toggleClass('focus');
    });
});


function LikeUnlikeSatus($id) {
    $.post('/post-like', {'id_article': $id}, function (data) {
        if(data === 'like'){
            $('#status_'+$id +' .like-Unlike').attr('action', 'unlike');
            $('#status_'+$id +' .like-Unlike').html('<i class="fa fa-thumbs-o-down">Unlike</i>');
            $val = parseInt($('#status_'+$id +' .like-Unlike').parent().find('.pull-right.text-muted').children('.count-like').text()) + 1;
            $('#status_'+$id +' .like-Unlike').parent().find('.pull-right.text-muted').children('.count-like').text($val);
        }else {
            $('#status_'+$id +' .like-Unlike').attr('action', 'like');
            $('#status_'+$id +' .like-Unlike').html('<i class="fa fa-thumbs-o-up">Like</i>');
            $val = parseInt($('#status_'+$id +' .like-Unlike').parent().find('.pull-right.text-muted').children('.count-like').text()) - 1;
            $('#status_'+$id +' .like-Unlike').parent().find('.pull-right.text-muted').children('.count-like').text($val);
        }
    });
}


function getAddFriend() {
    $.post('/get-list-addfriend/', {}, function (data) {
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

function ReadOneChat($chat){
    $.post('/read-allmessage?chat='+$chat, {}, function (data) {
    });
}

function ReadAllNotification(){
    $.post('/read-notification', {}, function (data) {
    });
    $('#content_notifycation').html('');
}

function ReadOneNotify($notify){
    $.post('/read-notification?notify='+$notify, {}, function (data) {
    });
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


function handleEnterComment(e,id_status){
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        if($.trim($('#status_'+id_status+' input[name="content_comment"]').val()) != '') {
            var content = $.trim($('#status_'+id_status+' input[name="content_comment"]').val());
            var action = $('#status_'+id_status+' input[name="content_comment"]').attr('action');
            $.post('/post-comment/' + id_status, {'content_stt':content,'action':action}, function (data) {
                if(action === '') {
                    if ($('#status_' + id_status + ' .box-footer.box-comments .box-comment').length === 0) {
                        $('#status_' + id_status).children('.boxmain-comment').append('<div class="box-footer box-comments" style="display: block;">' + data + '</div>');
                    } else {
                        $('#status_' + id_status + ' .boxmain-comment .box-footer.box-comments .box-comment').last().after(data);
                    }
                }else {
                    var id_cmt = action.split('_');
                    $('#comment_'+id_status+'_'+id_cmt[1]+ ' .content-comment').text(content);
                }
            });
            $('#status_'+id_status+' input[name="content_comment"]').val('');
            $('#status_'+id_status+' input[name="content_comment"]').attr('action','');
        }
    }
}

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

if(filesInput != null) {
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
}

$("#results_upload").on("click", ".remove_pict", function () {
    $(this).parent().remove();
});


function DeleteComment($id_status, $id_comment) {
    $.post('/delete-commentstatus/', {"id_status":$id_status,"id_comment":$id_comment}, function (data) {
        $('#comment_'+$id_status+'_'+$id_comment).remove();
    });
}

function EditComment($id_status, $id_comment,$curr) {
    var curr_content = $($curr).parent().parent().parent().parent().find('.content-comment').text();
    $('#status_'+$id_status+' input[name="content_comment"]').val(curr_content);
    $('#status_'+$id_status+' input[name="content_comment"]').attr('action','editcomment_'+$id_comment);
}

function readmore_comment($id) {
    $('.readmore_comment').hide();
    $.post('/readmore-comment/'+$id, {}, function (data) {
        var domain = 'http://localhost:8080/readmore-comment/'+$id;
        $('#status_'+$id+' .box-footer.box-comments').prepend($('<div>').load(domain, function () { }));
    });
}


function delete_status(event) {
    $(event).children('ul').toggle();
}

function action_delete_status($id) {
    $.post('/delete-status', {'id_status':$id}, function (data) {
        if(data === 'ok'){
            $('#status_'+$id).remove();
        }
    });
}

$(document).ready(function () {
    setInterval(function () {
        $.post('/update-noti',{}, function (data) {
            var result = JSON.parse(data);
            if(result.mess.length >0){
                $('#inbox').html('<span class="red">'+result.mess.length+'</span>');
            }else {

            }
            if(result.chat.length >0){
                $('#notifications').html('<span class="red">'+result.chat.length+'</span>');
            }else {

            }
        });
    },30000);
});
