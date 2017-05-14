$(document).ready(function(){
    $('#Preview').on('click',function(){
        $("#Preview").attr("disabled",true);
        var terminalForm=document.terminal;
        var txtZuoZheID=''+terminalForm.zuoZheID.value || '';
        var tempYesAllLable=''+terminalForm.yesAllLable.value || '';

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
                    $('#tasks').text(data['tasks']);
                    $('#completed').text(data['completed']);
                    $('#time').text(data['time']);
                    if(data['ok']){
                        clearInterval(roll);
                        $("#Preview").attr("disabled",false);
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        },1500);


    });
});
