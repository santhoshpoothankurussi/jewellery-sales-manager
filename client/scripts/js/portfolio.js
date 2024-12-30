var Portfolio = function () {


    return {
        //main function to initiate the module
        init: function () {
            $('.mix-grid').mixitup();
        }

    };

}();

jQuery(function(){
    var offset=50;
    var duration=500;
    jQuery(window).scroll(function(){
        if(jQuery(this).scrollTop()>offset){
            jQuery('.back-to-top').fadeIn(duration);

        }
        else
        {
            jQuery('.back-to-top').fadeOut(duration);
        }
    });
    jQuery('.back-to-top').click(function(event){
        event.preventDefault();
        jQuery('html,body').animate({scrollTop:0},duration);
        return false;
    })
});