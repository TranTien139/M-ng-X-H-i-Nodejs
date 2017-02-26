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
    $('#btnSendMessage').click(function(){
        socket.emit('chat message', {'message':$('#content_chat').val(),'id_send':$chat_with.val(),'name_send':$('#name_send').val(),'image_send':$('#image_send').val(),'id_chat_with':$('#id_chat_with').val(),'name_chat_with':$('#name_chat_with').val(),'image_chat_with':$('#image_chat_with').val()});
        $('#messages').append('<li class="left clearfix"> <span class="chat-img pull-left"> <img src="'+$('#image_send').val()+'" alt="User Avatar"> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">'+$('#name_send').val()+'</strong> <small class="pull-right text-muted"><i class="fa fa-clock-o"></i></small> </div><p> '+$('#content_chat').val()+'</p> </div> </li>');
        $.post('/post-chat',{'message':$('#content_chat').val(),'id_chat_with':$('#id_chat_with').val()},function (result) {
            console.log('save message success');
        });
        $('#content_chat').val('');
        $nickname.val();
        return false;
    });
});
function displayData(data){
    $('#messages').append('<li class="right clearfix"> <span class="chat-img pull-right"> <img src="'+data.image+'" alt="User Avatar"> </span> <div class="chat-body clearfix"> <div class="header"> <strong class="primary-font">'+data.name+'</strong> <small class="pull-right text-muted"><i class="fa fa-clock-o"></i></small> </div><p> '+data.msg+'</p> </div> </li>');
}

