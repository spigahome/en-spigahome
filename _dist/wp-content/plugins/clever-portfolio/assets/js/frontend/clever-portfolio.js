(function ($) {
    'use strict';
    // Portfolio filter
    $(window).on('load', function () {
        portfolioMasonry();
        jQuery('.wrap-portfolio-imgs').bind('DOMNodeInserted DOMNodeRemoved', function (event) {
            portfolioMasonry();
        });
    });
    $(document).ready(function () {

        if($('.cp-carousel-layout')[0]) {
            $('.cp-carousel-layout').each(function () {
                if ($(this).attr('data-config')) {
                    var $this=$(this);
                    var item, $grid, layout_mod, height, width;
                    var data = JSON.parse($(this).attr('data-config'));
                    item = parseInt(data['columns']);
                    var item_tablet = parseInt(data['columns_tablet']);
                    var item_mobile = parseInt(data['columns_mobile']);
                    var scroll=1;
                    if(!!data['scroll']){
                        scroll=parseInt(data['scroll']);
                    }
                    layout_mod = data['carousel_layout'];
                    $grid = $this.find(' .cp-wrap-block-item');
                    //Full screen build layout
                    if (layout_mod == 'full-screen') {
                        $grid.wrap('<div class="clever-wrap-slider-fullscreen"></div>');
                        //Resize window
                        $(window).resize(function () {
                            height = $(window).height();
                            width = $(window).width();
                            $grid.parent().css({'height': height + 'px', 'position': 'relative'});
                            $grid.find('.clever-portfolio-item').height(height);
                            //Add size for wrap
                            $grid.css({'height': height + 'px', 'width': width + 'px', 'left': '0'});
                            $grid.css({
                                'left': '-' + $grid.offset().left + 'px',
                                'overflow': 'hidden',
                                'position': 'absolute'
                            });
                        }).resize();
                    }
                    //End full screen
                    $grid.slick({
                        slidesToShow: item,
                        slidesToScroll: scroll,
                        arrows: data['show_nav'] != '' ? true : false,
                        dots: data['show_pag'] != '' ? true : false,
                        autoplay: data['autoplay'] != '' && data['autoplay'] != '0' ? true : false,
                        prevArrow: '<span class="prev-slide cp-slider-arrow"><i class="cs-font clever-icon-prev"></i></span>',
                        nextArrow: '<span class="next-slide cp-slider-arrow"><i class="cs-font clever-icon-next"></i></span>',
                        autoplaySpeed: data['autoplay'] != '' && data['autoplay'] != '0' ? data['autoplay'] : 0,
                        responsive: [
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: item_tablet,
                                }
                            },
                            {
                                breakpoint: 767.98,
                                settings: {
                                    slidesToShow: item_mobile,
                                }
                            }
                        ]
                    });
                }
            });
            $('.cp-multi-row .clever-portfolio-filter li').on('click', function () {
                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                $(this).parents('.wrap-portfolio-filter').find('.cp-mobile-filter span').text($(this).text());
                var filtervar = $(this).attr('data-id');
                $(this).parents('.clever-portfolio-shortcode').find('.clever-portfolio-item:not(.' + filtervar + ')').addClass('cp-outfilter');
                $(this).parents('.clever-portfolio-shortcode').find('.clever-portfolio-item.' + filtervar + '').removeClass('cp-outfilter');
            });
            var cp_filtered = false;
            $('.cp-single-row .clever-portfolio-filter li').on('click', function () {
                $(this).parent().find('.active').removeClass('active');
                $(this).addClass('active');
                $(this).parents('.wrap-portfolio-filter').find('.cp-mobile-filter span').text($(this).text());
                var filtervar = $(this).attr('data-id');
                $(this).parents('.clever-portfolio-shortcode').find('.clever-portfolio-item:not(.' + filtervar + ')').addClass('cp-outfilter');
                $(this).parents('.clever-portfolio-shortcode').find('.clever-portfolio-item.' + filtervar + '').removeClass('cp-outfilter');
                var $cp_slick=$(this).parents('.clever-portfolio-shortcode').find(' .cp-wrap-block-item');
                $cp_slick.slick('slickUnfilter');
                $cp_slick.slick('slickFilter', '.'+filtervar);
            });
        }

    });
    function portfolioMasonry() {
        $('.clever-portfolio:not(.cp-carousel-layout) ').each(function () {
            if ($(this).attr('data-config')) {
                var col, wrapID, $grid, itemwidth, data_w, grid_w, layout_mod, window_w, new_w;
                var data = JSON.parse($(this).attr('data-config'));
                col = data['columns'];
                layout_mod = data['layout_mod'];
                wrapID = '#' + data['id'];
                $grid = $(wrapID + ' .cp-wrap-block-item');
                window_w = 0;
                $(window).resize(function () {
                    new_w=$(window).width();
                    if(new_w!=window_w) {
                        window_w=new_w;
                        itemwidth = Math.floor($grid.width() / col);

                        grid_w = $grid.outerWidth();
                        if ($(window).width() > 1024) {
                            $grid.find('.clever-portfolio-item').each(function () {
                                if (!$(this).data("w")) {
                                    data_w = Math.floor(jQuery(this).find('img').attr('width') / itemwidth);
                                    $(this).attr('data-w', data_w == 0 ? '1' : data_w);
                                }
                                $(this).outerWidth($(this).data("w") * itemwidth);
                                $(this).outerHeight($(this).outerHeight());
                            });
                        }
                        else if ($(window).width() <= 1024 && $(window).width() > 767.98) {
                            $grid.find('.clever-portfolio-item').width('');
                            itemwidth = Math.floor(grid_w / 2);
                            $grid.find('.clever-portfolio-item').each(function () {
                                if ($(this).outerWidth(true) < grid_w) {
                                    $(this).outerWidth((grid_w / 2) - 2)
                                }
                                $(this).outerHeight($(this).outerHeight());
                            })
                        } else {
                            $grid.find('.clever-portfolio-item').width('100%');
                            $grid.find('.clever-portfolio-item').height('auto')
                            itemwidth = grid_w;
                        }
                        if(layout_mod){
                            setTimeout(function () {
                                $grid.isotope({
                                    masonry: {
                                        columnWidth: itemwidth
                                    },
                                    layoutMode: layout_mod != '' ? layout_mod : 'masonry',
                                    itemSelector: '.clever-portfolio-item'
                                });
                            }, 500);
                        }else{
                            setTimeout(function () {
                                $grid.isotope({
                                    masonry: {
                                        columnWidth: itemwidth
                                    }
                                });
                            }, 500);
                        }

                    }
                }).resize();
                $(wrapID + ' .clever-portfolio-filter  li').on('click', function () {
                    $(wrapID + ' .clever-portfolio-filter  li').removeClass('active');
                    $(this).addClass('active');
                    $(wrapID + ' .cp-mobile-filter span').text($(this).text());
                    var filtervar = $(this).attr('data-id');
                    $grid.isotope({filter: '.' + filtervar});
                });
                $(wrapID + ' .clever-portfolio-filter ').on('click', function () {
                    $(this).removeClass('active');
                });
                $(wrapID + ' .cp-mobile-filter').on('click', function () {
                    $(wrapID + ' .clever-portfolio-filter ').toggleClass('active');
                })
            }
        })
    }
})(jQuery)
