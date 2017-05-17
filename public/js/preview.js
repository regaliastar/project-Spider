$(document).ready(function(){
    $('.break').attr("disabled",true);
    var roll;
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

        var time =0;
        var timer =setInterval(function(){
            time++;
            $('#analysis').text('正在解析 用时：'+time+' s');
        },1000);

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

        roll=setInterval(function(){
            $.ajax({
                type:'post',
                url:'/preview',
                data:{},
                success:function(data){
                    /*if(data['tasks']){
                        clearInterval(timer);
                        $('#analysis').slideUp();
                    }*/

                    $('#tasks').text('总任务数：'+(data['tasks'] || 0));
                    $('#completed').text('已完成：'+(data['completed'] || 0));
                    $('#error').text('失败数：'+(data['error'] || 0));
                    if(data['ok']){
                        clearInterval(roll);
                        clearInterval(timer);
                        $('#analysis').slideUp();
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

    $('#Break').on('click',function(){
        $.ajax({
            type:'post',
            url:'/preview/break',
            data:{},
            success:function(data){

                $("#Preview").attr("disabled",false);
                $("#Download").attr("disabled",false);
                window.open('http://localhost:3000/preview/break');
            },
            error:function(err){
                console.log(err);
            }
        })
    })
});
