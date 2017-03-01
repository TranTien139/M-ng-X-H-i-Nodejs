$(document).ready(function(){
	$('#nav_user').click(function(){
		$('.chat-sidebar').toggleClass('focus');
	});
});

function  LikeStatus($action,$id) {
	if($action === 'like'){
		$(this).text('UnLike');
	}else {
        $(this).text('Like');
	}
    $(this).css('color','red');
    $.post('/post-like/'+$action,{'id_article':$id}, function (data) {

    });
}

//Check File API support
if(window.File && window.FileList && window.FileReader)
{
    var filesInput = document.getElementById("addImageStatus");

    filesInput.addEventListener("change", function(event){

        var files = event.target.files; //FileList object
        var output = document.getElementById("results_upload");

        for(var i = 0; i< files.length; i++)
        {
            var file = files[i];

            //Only pics
            if(!file.type.match('image'))
                continue;

            var picReader = new FileReader();

            picReader.addEventListener("load",function(event){

                var picFile = event.target;

                var div = document.createElement("li");

                div.innerHTML = "<img class='thumbnail' width='80' height='80' src='" + picFile.result + "'" +
                    "title='" + picFile.name + "'/> <a style='cursor: pointer;'  onclick='removeHtml(this)' class='remove_pict'>X</a>";
                output.insertBefore(div,null);
            });

            //Read the image
            picReader.readAsDataURL(file);
        }

    });
}

    $("#results_upload").on( "click",".remove_pict",function(){
        $(this).parent().remove();
    });

