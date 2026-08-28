/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 */

(function($) {
    "use strict";

    $('a.page-scroll').bind('click', function(event) {
        var href = $(this).attr('href');
        if (!href || href.charAt(0) !== '#') {
            return;
        }
        var $target = $(href);
        if (!$target.length) {
            return;
        }
        $('html, body').stop().animate({
            scrollTop: ($target.offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    $("header h1").fitText(1.2, {
        minFontSize: '28px',
        maxFontSize: '58px'
    });

    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });

    new WOW().init();

})(jQuery);
