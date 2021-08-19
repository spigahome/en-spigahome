/**
 * Create for Portfolio detail with embed format
 * It's make full width media player
 */
(function ($) {
    'use strict';
    $(document).ready(function () {
        $(".cp-embed-format.full-width .cp-wrap-embed:not(.audio-embed)").cleverVideoFullwidth();
        $('.cp-embed-format.full-screen .cp-wrap-embed').cleverVideoFullscreen();
        //resizeVideo();
        var t;
        $('.cp-embed-format.full-screen .mask-full-screen').mousemove(function () {
            $('.wrap-portfolio-content.minimal.active').fadeIn();
            $('.cp-play-2').fadeIn();
            var lastTimeMouseMoved = new Date().getTime();
            clearTimeout(t);
            t = setTimeout(function () {
                var currentTime = new Date().getTime();
                if (currentTime - lastTimeMouseMoved > 900) {
                    $('.wrap-portfolio-content.minimal.active').fadeOut();
                    $('.cp-play-2').fadeOut();
                }
            }, 1000)
        });
        //Vimeo
        VimeoControl();
        resizeEmbed();
    });
    $(window).on('load',function () {
        if ($('.cp-embed-format.full-screen')[0]) {
            $('.wrap-portfolio-content.minimal').fadeOut();
            $('.cp-play-2').fadeOut();
        }
    });
    function resizeEmbed() {
        if( !$(".cp-embed-format.full-width")[0] && !$(".cp-embed-format.full-screen")[0] ) {
            var allVideos = $(".cp-embed-format .cp-wrap-embed:not(.audio-embed) iframe");
            allVideos.each(function () {
                $(this).data('aspectRatio', this.height / this.width)
                // and remove the hard coded width/height
                    .removeAttr('height')
                    .removeAttr('width');
            });
            var newWidth = jQuery(".cp-wrap-embed").width();
            // Resize all videos according to their own aspect ratio
            allVideos.each(function () {
                var el = jQuery(this);
                el.width(newWidth).height(newWidth * el.data('aspectRatio'));
            });
        }
        var AllAudio = $(".cp-wrap-embed.audio-embed iframe");
        AllAudio.removeAttr('width').attr('height', '160');
        AllAudio.width('100%');
    }
    function VimeoControl() {
        if ($('.cp-embed-format.full-screen .vimeo-embed')[0]) {
            var player = new Vimeo.Player($('.cp-embed-format.full-screen .vimeo-embed'));
            player.play();
            player.setLoop(true);
            console.log(getCookie('cp-mute'));
            if (getCookie('cp-mute')) {
                player.setVolume(0);
                $('.cp-volume').addClass('active');
            }
            $('.mask-full-screen').on('click', function () {
                $('.cp-play-2').toggleClass('active');
                if ($('.cp-embed-format.full-screen .vimeo-embed')[0]) {
                    player.getPaused().then(function (paused) {
                        if (!paused) {
                            player.pause();
                            $('.wrap-portfolio-content.minimal.active').fadeIn();
                            $('.cp-play-2').fadeIn();
                        } else {
                            player.play();
                        }
                    })
                }
            });
            $('.cp-volume').on('click', function () {
                $(this).toggleClass('active');
                if ($('.cp-embed-format.full-screen .vimeo-embed')[0]) {
                    player.getVolume().then(function (vol) {
                        if (vol > 0) {
                            player.setVolume(0);
                            setCookie('cp-mute', true)
                        } else {
                            player.setVolume(1);
                            setCookie('cp-mute', false)
                        }
                    })
                }
            })
        }
    }
})(jQuery);


(function ($) {
    $.fn.extend({
        cleverVideoFullscreen: function (options) {
            //Create var
            var  Item= $(this);
            if(Item[0]) {
                //  Set Default Values
                var defaults = {
                    main: '.cp-wrap-embed'
                };
                var options = $.extend(defaults, options);
                var item_h, item_w, embed, wrap_embed, height, width;
                embed = $(this).find('iframe, embed');
                embed.wrap('<div class="clever-embed-total-wrap"></div>');
                wrap_embed = embed.parent();
                wrap_embed.append('<div class="mask-full-screen"></div><span class="cp-volume"><i class="cs-font clever-icon-volume-on"></i> </span><span class="cp-play-2"><i class="cs-font clever-icon-play-2-1"></i><i class="cs-font clever-icon-pause-1"></i></span>');
                //Resize window
                $(window).resize(function () {
                    //Set Ratio
                    embed.data('aspectRatio', embed.height() / embed.width()).removeAttr('height').removeAttr('width');
                    height = $(window).height();
                    width = $(window).width();
                    //Add size for wrap
                    $(options.main).css({'height': height + 'px', 'position': 'relative'})
                    wrap_embed.height(height).width(width);
                    wrap_embed.css('left', '0');
                    wrap_embed.css({'position': 'absolute', 'left': '-' + wrap_embed.offset().left + 'px','overflow':'hidden'});
                    //Calculator size for embed
                    item_h = width * embed.data('aspectRatio');
                    item_w;
                    if (item_h < height) {
                        item_w = height / el.data('aspectRatio');
                        if (item_w == width) {
                            embed.width(width).height(item_h);
                        } else {
                            embed.width(height / embed.data('aspectRatio')).height(height);
                        }
                    } else {
                        item_w = height / embed.data('aspectRatio');
                        if (item_w == width) {
                            embed.width(width).height(item_h);
                        } else {
                            embed.width(width).height(width * embed.data('aspectRatio'));
                        }
                    }
                }).resize();
            }
        },
        cleverVideoFullwidth: function (options) {
            var Item = $(this).find('iframe, embed');
            if(Item[0]) {
                //  Set Default Values
                var defaults = {
                    wrap: '.cp-wrap-embed',
                    main: '.cp-embed-format.full-width .cp-wrap-main-embed',
                    height: 80
                };
                var options = $.extend(defaults, options);
                // When the window is resized
                $(window).resize(function () {
                    Item.data('aspectRatio', Item.height() / Item.width()).removeAttr('height').removeAttr('width');
                    if ($(window).width() > 769) {
                        //For layout media full width
                        var cv_wrap = $(options.wrap);
                        var height = parseInt($(window).height() * options.height / 100);
                        Item.width(height / Item.data('aspectRatio')).height(height);
                        $(options.main).height(height);
                        cv_wrap.width($(window).width());
                        cv_wrap.css('left', '0');
                        cv_wrap.css({'position': 'absolute', 'left': '-' + cv_wrap.offset().left + 'px'});
                    }
                    else {
                        var newWidth = $(options.wrap).width();
                        // Resize all videos according to their own aspect ratio
                        Item.width(newWidth).height(newWidth * Item.data('aspectRatio'));
                    }
                }).resize();
            }
        }
    });
})(jQuery);


var player;
// global variable for the player
function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    player = new YT.Player(jQuery('.cp-embed-format.full-screen .youtube-embed iframe').attr('id'), {
        events: {
            // call this function when player is ready to use
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}
function onPlayerReady(event) {
    // bind events
    player.playVideo();
    jQuery('.mask-full-screen').on('click', function () {
        jQuery('.cp-play-2').toggleClass('active');
        if (player.getPlayerState() == 1) {
            player.pauseVideo();
        }
        if (player.getPlayerState() == 2) {
            player.playVideo();
        }
    });
    jQuery('.cp-volume').on('click', function () {
        jQuery(this).toggleClass('active');
        if (player.isMuted()) {
            player.unMute();
            setCookie('cp-mute', false)
        } else {
            player.mute();
            setCookie('cp-mute', true);
        }
    })
    if (getCookie('cp-mute')) {
        player.mute();
        $('.cp-volume').addClass('active');
    }
}
function onPlayerStateChange(event) {
    if (player.getPlayerState() == 0) {
        player.playVideo();
    }
}
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + "; ";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
