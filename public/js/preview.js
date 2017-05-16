$(document).ready(function(){
    $('.break').attr("disabled",true);

    $('#Preview').on('click',function(){
        $("#Preview").attr("disabled",true);
        $("#Download").attr("disabled",true);
        $('.break').attr("disabled",false);
        var praise = $("#praise").val().trim() || 0;
        var pageView = $('#pageView').val().trim() || 0;
        var pixiver = $('#pixiver').val().trim();
        var no_tag_any = $('#no_tag_any').val().trim();
        var no_tag_every = $('#no_tag_every').val().trim();
        var has_tag_some = $('#has_tag_some').val().trim();
        var has_tag_every = $('#has_tag_every').val().trim();

        $('#analysis').slideDown();
        $.ajax({
            type:'post',
            url:'/preview',
            data:{
                'post':true,
                'id':pixiver,
                'tag':has_tag_every,
                'praise':praise,
                'pageView':pageView,
                'no_tag_any':no_tag_any,
                'no_tag_every':no_tag_every,
                'has_tag_some':has_tag_some,
                'has_tag_every':has_tag_every
            },
            success:function(data){
                if(data['ok']){
                    clearInterval(roll);
                    $("#Preview").attr("disabled",false);
                    $("#Download").attr("disabled",false);
                    $('.break').attr("disabled",true);
                    window.open('http://localhost:3000/preview');
                }
            },
            error:function(err){
                console.log(err);
            }
        })

        var roll=setInterval(function(){
            $.ajax({
                type:'post',
                url:'/preview',
                data:{},
                success:function(data){
                    if(data['tasks'])   $('#analysis').slideUp();

                    $('#tasks').text('总任务数：'+(data['tasks'] || 0));
                    $('#completed').text('已完成：'+(data['completed'] || 0));
                    $('#error').text('失败数：'+(data['error'] || 0));
                    if(data['ok']){
                        clearInterval(roll);
                        $("#Preview").attr("disabled",false);
                        $("#Download").attr("disabled",false);
                        window.open('http://localhost:3000/preview');
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        },800);


    });
});
