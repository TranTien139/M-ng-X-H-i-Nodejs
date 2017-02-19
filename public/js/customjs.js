$(document).ready(function () {
   $('.head_chat_box ul li.pull-right').click(function () {
        $('.box_chat').hide();
   });

   $('#list_friend li').click(function () {
       var username = $(this).text();
       $('.head_chat_box .name_chat_with').text(username);
       $('.box_chat').show();
   });
});

$(document).ready(function(){
    var socket = io();
    var $nickname = $('#nickname');
    var $chat_with= $('#chat_with');

    var $name_chat = $('#name_chat');
    var $name_chat_with= $('#name_chat_with');

    socket.emit('new user', $nickname.val(), function (data) {
    });

    socket.on('usernames', function (data) {
    });
    socket.on('gui-lai', function(data){
        displayData(data);
    });
    $('.sendmessage button').click(function(){
        socket.emit('chat message', {'msg':$('#m').val(),'chat_with':$chat_with.val(),'name_chat':$name_chat.val(),'name_chat_with':$name_chat_with.val()});
        $('#messages').append("<span class='msg'><b>"+$name_chat.val()+":</b>"+$('#m').val()+"</span></br>");
        $('#m').val('');
        $nickname.val();
        return false;
    });
});
function displayData(data){
    $('#messages').append("<span class='msg'><b>"+data.nick+":</b>"+data.msg+"</span></br>");
}
function get_name_chat($data,$username) {
    $('.head_chat_box .name_chat_with').text($username);
    $('.box_chat').show();
    $('#name_chat_with').val($username);
    $('#chat_with').val($data);
}


