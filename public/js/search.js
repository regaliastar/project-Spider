$(document).ready(function(){
    $('.nav-search-icon').on('click',function(){
        //$("#searchBlank").is(":hidden") ? $('#searchBlank').slideDown() : $('#searchBlank').slideUp();
        var isHidden = $("#searchBlank").is(":hidden");
        if(isHidden){
            //$('#searchBlank').slideDown();
            document.getElementById('searchBlank').style.display='block';
            $('body').addClass('gray');
            $('#searchBlank').addClass('light');
            //document.getElementById('header').style.display='block';
            //document.getElementById('fade').style.display='block'
        }else {
            $('body').removeClass('gray');
            //$('#searchBlank').slideUp();
            document.getElementById('searchBlank').style.display='none';
            //document.getElementById('header').style.display='none';
            //document.getElementById('fade').style.display='none'
        }

    });

    document.onkeydown = function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==27){ // 按 Esc
            //$('#searchBlank').slideUp();
            $('body').removeClass('gray');
            document.getElementById('searchBlank').style.display='none';
        }
    }

})
