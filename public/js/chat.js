/**
 * Created by Tran Tien on 22/02/2017.
 */
$(document).ready(function(){
    var socket = io();
    var $nickname = $('#id_send');
    var $chat_with= $('#id_chat_with');

    socket.emit('new user', $nickname.val(), function (data) {
    });

    socket.on('gui-lai', function(data){
        displayData(data);
    });

    socket.on('usernames', function (data) {
        $('.list-group-item').removeClass('fa fa-check-circle connected-status');
        for(var i=0; i<data.length; i++){
            $('.list-group-item.friend_'+data[i]+' i' ).addClass('fa fa-check-circle connected-status');
        }
    });

    socket.on('seen back', function (data) {
        $("#chatlist"+$('#id_chat_with').val()).children().children('.chat-alert.label.label-danger').text('');
        $("#seen_message").text('seen');
    });

    $('#btnSendMessage').click(function(){
        var currentdate = new Date();

        var datetime = currentdate.getDate() + "/"+(currentdate.getMonth()+1)
            + "/" + currentdate.getFullYear() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        socket.emit('chat message', {'message':$('#content_chat').val(),'id_send':$chat_with.val(),'name_send':$('#name_send').val(),'image_send':$('#image_send').val(),'id_chat_with':$('#id_chat_with').val(),'name_chat_with':$('#name_chat_with').val(),'image_chat_with':$('#image_chat_with').val(), 'time':datetime});
        $('#messages').append('<li class="left clearfix"> <span class="chat-img pull-left"> <img src="'+$('#image_send').val()+'" alt="User Avatar"> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">'+$('#name_send').val()+'</strong> <small class="pull-right text-muted"><i class="fa fa-clock-o"></i>'+datetime+'</small> </div><p> '+$('#content_chat').val()+'</p> </div> </li>');
        $.post('/post-chat',{'message':$('#content_chat').val(),'id_chat_with':$('#id_chat_with').val()},function (result) {

        });
        $("#chatlist"+$('#id_chat_with').val()).children().children('.last-message.text-muted').text($('#content_chat').val());
        $("#chatlist"+$('#id_chat_with').val()).children().children('.time.text-muted').text(datetime);
        $("#chatlist"+$('#id_chat_with').val()).children().children('.chat-alert.label.label-danger').text('');
        $("#seen_message").text('');
        $('#content_chat').val('');
        $nickname.val();
        $(".chat-message").animate({ scrollTop: $('#messages').height() }, "slow");
        return false;
    });

    $("#content_chat").keydown(function (e) {
        if (e.keyCode == 13) {
            var currentdate = new Date();

            var datetime = currentdate.getDate() + "/"+(currentdate.getMonth()+1)
                + "/" + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":" + currentdate.getSeconds();

            socket.emit('chat message', {'message':$('#content_chat').val(),'id_send':$chat_with.val(),'name_send':$('#name_send').val(),'image_send':$('#image_send').val(),'id_chat_with':$('#id_chat_with').val(),'name_chat_with':$('#name_chat_with').val(),'image_chat_with':$('#image_chat_with').val(), 'time':datetime});
            $('#messages').append('<li class="left clearfix"> <span class="chat-img pull-left"> <img src="'+$('#image_send').val()+'" alt="User Avatar"> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">'+$('#name_send').val()+'</strong> <small class="pull-right text-muted"><i class="fa fa-clock-o"></i>'+datetime+'</small> </div><p> '+$('#content_chat').val()+'</p> </div> </li>');
            $.post('/post-chat',{'message':$('#content_chat').val(),'id_chat_with':$('#id_chat_with').val()},function (result) {

            });
            $("#chatlist"+$('#id_chat_with').val()).children().children('.last-message.text-muted').text($('#content_chat').val());
            $("#chatlist"+$('#id_chat_with').val()).children().children('.time.text-muted').text(datetime);
            $("#chatlist"+$('#id_chat_with').val()).children().children('.chat-alert.label.label-danger').text('');
            $("#seen_message").text('');
            $('#content_chat').val('');
            $nickname.val();
            $(".chat-message").animate({ scrollTop: $('#messages').height() }, "slow");
            return false;
        }
    });

    $("#content_chat").click(function () {
        $("#chatlist"+$('#id_chat_with').val()).children().children('.chat-alert.label.label-danger').text('');
        $("#seen_message").text('');
        socket.emit('seen message', {'id_send':$chat_with.val(),'id_chat_with':$('#id_chat_with').val()});
    });
});
function displayData(data){
    $('#messages').append('<li class="right clearfix"> <span class="chat-img pull-right"> <img src="'+data.image+'" alt="User Avatar"> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">'+data.name+'</strong> <small class="pull-right text-muted"><i class="fa fa-clock-o"></i>'+data.datetime+'</small> </div><p> '+data.msg+'</p> </div> </li>');
    $("#chatlist"+$('#id_chat_with').val()).children().children('.last-message.text-muted').text(data.msg);
    $("#chatlist"+$('#id_chat_with').val()).children().children('.time.text-muted').text(data.datetime);
    $("#chatlist"+$('#id_chat_with').val()).children().children('.chat-alert.label.label-danger').text('1');
    $(".chat-message").animate({ scrollTop: $('#messages').height() }, "slow");
}

$(document).ready(function () {
    $(".chat-message").animate({ scrollTop: $('#messages').height() }, "slow");
    return false;
});

