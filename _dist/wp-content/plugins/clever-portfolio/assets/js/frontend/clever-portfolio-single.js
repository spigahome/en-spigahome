(function ($) {
    'use strict';
    $(document).ready(function () {
        //Lazy load imgs
        if ($('.clever_wrap_lazy_img')[0]) {
            var res = '';
            $('.clever_wrap_lazy_img').each(function () {
                var $this = $(this);
                res = $this.find('.lazy-img').parent().data('resolution');
                if (res != '') {
                    var w = $this.width();
                    $this.height(w / res);
                }
            });
        }
        if ($("img.lazy-img")[0]) {
            $("img.lazy-img").parent().addClass('loading');
            $("img.lazy-img").lazyload({
                effect: 'fadeIn',
                threshold: $(window).height(),
                load: function () {
                    $(this).parent().removeClass('loading');
                }
            });
        }
        if ($('.cp-wrap-thumbs')[0]) {
            $('.cp-wrap-thumbs').slick({
                centerMode: true,
                variableWidth: true,
                focusOnSelect: true,
                infinite: false,
                prevArrow: '<span class="prev-slide cp-slider-arrow"><i class="cs-font clever-icon-prev"></i></span>',
                nextArrow: '<span class="next-slide cp-slider-arrow"><i class="cs-font clever-icon-next"></i></span>',
                rtl: $('body.rtl')[0] ? true : false,
                asNavFor: '.cp-slider'
            });
        }
        if ($('.cp-slider, .cp-wrap-slider')[0]) {
            $('.cp-slider, .cp-wrap-slider').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                prevArrow: '<span class="prev-slide cp-slider-arrow"><i class="cs-font clever-icon-arrow-left"></i></span>',
                nextArrow: '<span class="next-slide cp-slider-arrow"><i class="cs-font clever-icon-arrow-right"></i></span>',
                rtl: $('body.rtl')[0] ? true : false,
                asNavFor: $('.cp-wrap-thumbs')[0] ? '.cp-wrap-thumbs' : ''
            });
        }
        if ($('.cp-single.full-screen')[0]) {
            $('.cp-single.full-screen .cp-wrap-slider').cleverGalleryFullscreen();
            $('.cp-wrap-content.expand').height($('.cp-wrap-content.expand').height());
            $('.cp-wrap-content.expand').addClass('deactive');
            $('.toggle-view').on('click', function () {
                $('.cp-wrap-content.expand').toggleClass('deactive');
                $('.cp-wrap-content.minimal').toggleClass('active');
            })
        }
    });
    $(window).on('load', function () {
        $('.cp-wrap-content.expand').css('opacity', '1');
        if ($('.cp-single.metro .cp-wrap-imgs')[0]) {
            var col = $('.cp-single.metro .cp-wrap-imgs').data('col');
            var width = $('.cp-single.metro  .cp-wrap-imgs').data('width');
            $('.cp-single.metro  .cp-wrap-imgs').cleverMetro({
                col: col,
                wrap_width: width
            });
        }
    });
})(jQuery);
(function ($) {
    $.fn.extend({
        cleverMetro: function (options) {
            var Metro = $(this);
            if (Metro[0]) {
                // Default Values
                var metro_width, item, itemwidth, data_w;
                var defaults = {
                    item: '.portfolio-img',
                    col: '3',
                    wrap_width: 1170
                };
                var options = $.extend(defaults, options);
                //Assign data
                item = Metro.find(options.item);
                metro_width = options.wrap_width;
                itemwidth =Math.floor( metro_width / options.col);
                $(window).resize(function () {
                    //Starting Calculator col width
                    if ($(window).width() > 768) {
                        item.each(function () {
                            if (!$(this).data("w")) {
                                data_w = Math.floor($(this).outerWidth(true) / itemwidth);
                                $(this).attr('data-w', data_w == 0 ? '1' : data_w);
                            }
                            $(this).outerWidth(($(this).data("w") * itemwidth) - 2);
                        });
                    }
                    else if ($(window).width() <= 768 && $(window).width() > 480) {
                        item.width('');
                        itemwidth = Math.floor(metro_width / 2);
                        item.each(function () {
                            if ($(this).outerWidth(true) < metro_width) {
                                $(this).outerWidth((metro_width / 2) - 2)
                            }
                        })
                    } else {
                        item.width('100%');
                        itemwidth = metro_width;
                    }
                    setTimeout(function () {
                        Metro.isotope({
                                masonry: {
                                    columnWidth: itemwidth
                                }
                            }
                        );
                    }, 500);
                }).resize();
            }
        },
        cleverGalleryFullscreen: function (options) {
            //Create var
            var Item = $(this);
            if (Item[0]) {
                var height, width;
                Item.wrap('<div class="clever-wrap-slider-fullscreen"></div>');
                //Resize window
                $(window).resize(function () {
                    height = $(window).height();
                    width = $(window).width();
                    Item.parent().css({'height': height + 'px', 'position': 'relative'});
                    //Add size for wrap
                    Item.find('.portfolio-img').css({'height': height + 'px', 'width': width + 'px'});
                    Item.css({'height': height + 'px', 'width': width + 'px', 'left': '0'});
                    Item.css({'left': '-' + Item.offset().left + 'px', 'overflow': 'hidden', 'position': 'absolute'});
                }).resize();
            }
        }
    });
})(jQuery);