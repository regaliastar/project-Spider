(function(){
    $(".downloadable").trigger("click");

    $('img').on('click',function(evt){
        var workname = $(evt.target).attr('id');
        $('.'+workname).trigger('click');
    });

    $('#download_all').on('click',function(){
        $('a span').trigger('click');
    })
})();
