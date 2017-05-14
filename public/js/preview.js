$(document).ready(function(){
    $('#Preview').on('click',function(){
        $("#Preview").attr("disabled",true);
        $("#Download").attr("disabled",true);
        var terminalForm=document.terminal;
        var txtZuoZheID=''+terminalForm.zuoZheID.value.trim() || '';
        var tempYesAllLable=''+terminalForm.yesAllLable.value.trim() || '';
        $('#analysis').slideDown();
        $.ajax({
            type:'post',
            url:'/preview',
            data:{
                'post':true,
                'id':txtZuoZheID,
                'tag':tempYesAllLable
            },
            success:function(data){

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
