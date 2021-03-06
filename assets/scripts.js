$(function() {
    var pageHeights = [];
    var pageNames = [];
    var scrollSpeed = 700;
    var fixedOn = $(".nav").offset().top;
    console.log(fixedOn);
    getPageHeights();

    $(".logo").hover(function() {

        $(this).toggleClass("hover");
    });

    $(window).resize(debounce(onResize, 100));
    bindNavOpen();

    function onResize() {
        getPageHeights();
        bindNavOpen();
    }

    function bindNavOpen() {
        if ($(window).width() < 800) {
            $(".nav a").click(function() {
                if ($(this).parent().hasClass("selected")) {
                    $("#nav").addClass("open");
                    return false;
                }
                else {
                    $("#nav").removeClass("open");
                }
            });
        }


    }

    $(window).scroll(function() {
        if ($(window).scrollTop() > fixedOn) {
            $("#header-wrapper").addClass("after-scroll");
            throttle(highlightMenuItem(), 250);
            if (!$(".selected").length) {
                $(".nav li:first-child").addClass("selected");
            }
        }

        else if ($(window).scrollTop() <= fixedOn) {
            console.log("scrollTop: ", $(window).scrollTop(), " fixedOn: ", fixedOn);
            $("#header-wrapper").removeClass("after-scroll");
            $(".nav li.selected").removeClass("selected");
            fixedOn = $(".nav").offset().top;

        }
    });

    $(window).trigger("scroll");
    
    function getPageHeights() {
        $(".page").each(function(i) {
            pageHeights[i] = $(this).offset().top;
            pageNames[i] = this.id;
        });
        pageHeights.push($(document).height());
        console.log("page heights: ", pageHeights);
    }

    function highlightMenuItem() {
        var location = $(window).scrollTop();
        console.log(location); 
        for (var i=0; i<pageHeights.length; i++) {
            if (location >= pageHeights[i] && location < pageHeights[i+1]) {
                $(".selected").removeClass("selected");
                $(".nav li:nth-child(" + i + ")").addClass("selected");
                break;
            }
        }
    }

    $(".nav a").click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr("href")).offset().top
        }, scrollSpeed, highlightMenuItem);
        return false;
    });

    $('.logo').click(function() {
        if ($(".selected").length) {
            $('html, body').animate({
                scrollTop: 0
            }, scrollSpeed);
        }
    });

    
    var responseDiv = $('#contact-form-response');
    var contactForm = $('#contact-form');
    var wrapper = $(contactForm).parent();
    $(contactForm).submit(function(e) {
        e.preventDefault();

        var data = contactForm.serialize();
        console.log("data: ", data);
        $(wrapper).addClass('waiting');
        $.ajax({
            type: 'POST',
            url: $(contactForm).attr('action'),
            data: data
        }).done(function(data) {
            console.log("success\n", data);
            $(responseDiv).removeClass('error');
            $(responseDiv).addClass('success');
            $(wrapper).removeClass('waiting');
            $(contactForm).hide();
            $(responseDiv).text(data);
        }).fail(function(data){
            console.log("fail\n", data);
            $(wrapper).removeClass('waiting');
            $(responseDiv).addClass('error');

            var response = data.responseText;
            if (response.responseText !== '') {
                $(responseDiv).text(response);
            } else {
                $('#responseDiv > p.unknown-error').show();
            }
        });



    });

});

function recaptchaCallback() {
    $('.g-recaptcha').hide();
    $('.contact-form-wrapper button').show();
}


//Taken from underscore via https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

//Also from underscore (http://underscorejs.org/docs/underscore.html)
function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : now();
        timeout = null;
        result = func.apply(context, args);
    if (!timeout) context = args = null;
    };
    return function() {
        var n = now();
        if (!previous && options.leading === false) previous = n;
        var remaining = wait - (n - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        previous = n;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

//From underscore
now = Date.now || function() {
    return new Date().getTime();
  };