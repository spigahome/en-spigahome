(function ($) {
    'use strict';
    $('document').ready(function () {
        if ($('.clever-lightbox-gallery')[0]) {
            var index, total;
            total = $('.clever-lightbox-gallery').children().length;
            //Make lightbox gallery when click
            $('.clever-lightbox-gallery a').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);
                index = $(this).parent().index();
                if (!$('.clever-wrap-lightbox-gallery')[0]) {
                    $('body').append('<div class="clever-wrap-lightbox-gallery active"><div class="clever-wrap-lightbox-gallery-block"><ul class="clever-lightbox-gallery-block"></ul></div><div class="cp-mask-close"></div><span class="clever-lb-close"><i class="cs-font clever-icon-close"></i> </span> </div> ');
                    for (var i = 0; i < total; i++) {
                        $('.clever-lightbox-gallery-block').append('<li class="clever-lightbox-gallery-item"></li>');
                    }
                    if (total > 1) {
                        $('.clever-wrap-lightbox-gallery-block').prepend('<span class="clever-lb-gallery-nav clever-lb-prev-item"><i class="cs-font clever-icon-arrow-left-5"></i> </span> <span class="clever-lb-gallery-nav clever-lb-next-item"><i class="cs-font clever-icon-arrow-right-5"></i></span>')
                    }
                    $('.clever-lightbox-gallery-item:nth-child(' + parseInt(index + 1) + ')').addClass('active').append('<img src="' + $this.attr('href') + '" alt="' + $this.attr('title') + '" />');
                    $('.clever-wrap-lightbox-gallery-block').append('<div class="clever-lb-gallery-count"><span class="current-item">' + parseInt(index + 1) + '</span>/<span>' + total + '</span></div>')
                } else {
                    var item = $('.clever-lightbox-gallery-item:nth-child(' + parseInt(index + 1) + ')');
                    $('.clever-wrap-lightbox-gallery').addClass('active');
                    $('.clever-lightbox-gallery-item').removeClass('active');
                    item.addClass('active');
                    if (!item.has('img')[0]) {
                        item.append('<img src="' + $this.attr('href') + '" alt="' + $this.attr('title') + '" />');
                    }
                    $('.clever-lb-gallery-count .current-item').text(index + 1);
                }
                PreloadingImgs($this);
            });
            //lightbox gallery nav
            $(document).on('click','.cp-mask-close', function () {
                $('.clever-wrap-lightbox-gallery').removeClass('active');
            });
            //Navigation control
            $(document).on('click','.clever-lb-gallery-nav', function () {
                if ($(this).hasClass('clever-lb-next-item')) {
                    NextItem();
                } else {
                    PrevItem();
                }
            });
            //Key press control
            $(document).keyup(function (e) {
                //Next
                if (e.keyCode === 39 || e.keyCode === 40) {
                    NextItem();
                }
                //Prev
                if (e.keyCode === 37 || e.keyCode === 38) {
                    PrevItem();
                }
                //Close when press Esc
                if (e.keyCode === 27) {
                    $('.clever-wrap-lightbox-gallery').removeClass('active');
                }
            });
            //Mouse control
            var mousepos_old;
            $(document).on('mousedown','.clever-wrap-lightbox-gallery-block', function (e) {
                mousepos_old = e.pageX;
            });
            $(document).on('mouseup', '.clever-wrap-lightbox-gallery-block', function (e) {
                if (parseInt(mousepos_old - e.pageX) != 0) {
                    if (parseInt(mousepos_old - e.pageX) > 0) {
                        NextItem();
                    } else {
                        PrevItem();
                    }
                }
            });
        }
        function NextItem() {
            var $this = $('.clever-lightbox-gallery-item.active');
            var index;
            if ($this.next('li').length) {
                $this.next('li').addClass('active');
                //+1 item
                index = $this.index() + 1;
            } else {
                $('.clever-lightbox-gallery-item:first-child').addClass('active');
                index = 0;
                if (!$('.clever-lightbox-gallery-item:first-child').has('img')[0]) {
                    var $item = $('.clever-lightbox-gallery').children().eq(0);
                    $('.clever-lightbox-gallery-item:first-child').append('<img src="' + $item.find('a').attr('href') + '" alt="' + $item.find('a').attr('title') + '" />');
                }
            }
            var preload = $('.clever-lightbox-gallery').children().eq(index).find('a');
            $('.clever-lb-gallery-count .current-item').text(index + 1);
            $this.removeClass('active');
            PreloadingImgs(preload);
        }
        function PrevItem() {
            var $this = $('.clever-lightbox-gallery-item.active');
            var index;
            if ($this.prev('li').length) {
                $this.prev('li').addClass('active');
                //decrease 1 item
                index = $this.index() - 1;
            } else {
                $('.clever-lightbox-gallery-item:last-child').addClass('active');
                index = parseInt(total - 1);
                if (!$('.clever-lightbox-gallery-item:last-child').has('img')[0]) {
                    var $item = $('.clever-lightbox-gallery').children().eq(parseInt(total - 1));
                    $('.clever-lightbox-gallery-item:last-child').append('<img src="' + $item.find('a').attr('href') + '" alt="' + $item.find('a').attr('title') + '" />');
                }
            }
            var preload = $('.clever-lightbox-gallery').children().eq(index).find('a');
            $('.clever-lb-gallery-count .current-item').text(index + 1);
            $this.removeClass('active');
            PreloadingImgs(preload);
        }
        function PreloadingImgs(item) {
            var $this = item;
            $('.clever-lightbox-gallery-item.active').imagesLoaded(function () {
                Imgsize($('.clever-lightbox-gallery-item.active img').attr('src'));
                if ($('.clever-lightbox-gallery-item.active').next('li').length && !$('.clever-lightbox-gallery-item.active').next('li').has('img')[0]) {
                    $('.clever-lightbox-gallery-item.active').next('li').append('<img src="' + $this.parent().next().find('a').attr('href') + '" alt="' + $this.parent().next().find('a').attr('title') + '" />');
                }
                if ($('.clever-lightbox-gallery-item.active').prev('li').length && !$('.clever-lightbox-gallery-item.active').prev('li').has('img')[0]) {
                    $('.clever-lightbox-gallery-item.active').prev('li').append('<img src="' + $this.parent().prev().find('a').attr('href') + '" alt="' + $this.parent().prev().find('a').attr('title') + '" />');
                }
            });
        }
        //Resize light box window
        function Imgsize(url) {
            var wrap = $('.clever-wrap-lightbox-gallery-block');
            var res, item_w, item_h, max_w, max_h;
            max_w = $(window).width() * 0.9;
            max_h = $(window).height() * 0.9;
            $("<img>").attr("src", url).on('load',function () {
                res = this.height / this.width;
                if (this.height > max_h) {
                    item_h = max_h;
                    item_w = max_h / res;
                } else {
                    item_h = this.height;
                    item_w = item_h / res;
                }
                if (item_w > max_w) {
                    item_w = max_w;
                    item_h = max_w * res;
                }
                wrap.height(item_h);
                wrap.width(item_w);
            });
        }
    })
})(jQuery)