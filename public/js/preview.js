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
                    $('#analysis').slideUp();
                    $('#tasks').text(data['tasks']);
                    $('#completed').text(data['completed']);
                    $('#time').text(data['time']);
                    $('#error').text(data['error']);
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
        },1500);


    });
});
