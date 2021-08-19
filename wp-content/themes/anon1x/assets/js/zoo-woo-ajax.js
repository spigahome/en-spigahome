(function ($) {
    "use strict";
    jQuery(document).ready(function () {
        if (typeof wc_add_to_cart_params != 'undefined') {

            /* Ajax mini cart remove and Revert item remove from cart.*/
            $(document).on('click', '.woocommerce-mini-cart-item .remove', function (e) {
                e.preventDefault();
                var $thisbutton = $(this),
                    $mini_cart = $thisbutton.closest('.widget_shopping_cart_content'),
                    $cart_item = $thisbutton.closest('.woocommerce-mini-cart-item');
                $cart_item.addClass('loading');
                if (!$(this).hasClass('revert-cart-item')) {
                    $.post(wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'remove_from_cart'), {cart_item_key: $thisbutton.data('cart_item_key')}, function (response) {
                        if (!response || !response.fragments) {
                            window.location = $thisbutton.attr('href');
                            return;
                        }
                        $thisbutton.addClass('revert-cart-item');

                        $mini_cart.find('.pre-remove').addClass('removed');
                        $cart_item.addClass('pre-remove');

                        $mini_cart.find('.woocommerce-mini-cart__total.total .woocommerce-Price-amount').replaceWith(response.fragments.cart_subtotal);
                        $mini_cart.find('.free-shipping-required-notice').replaceWith(response.fragments.free_shipping_cart_notice);
                        $thisbutton.closest('.widget_shopping_cart ').find('.total-cart-item').replaceWith(response.fragments['.total-cart-item']);

                        setTimeout(function () {
                            $mini_cart.find('.removed').remove();
                        }, 500);
                        if (response.fragments.cart_count == 0) {
                            $mini_cart.find('.wrap-bottom-mini-cart').fadeOut();
                        }

                        $cart_item.removeClass('loading');
                        $(document).trigger('zoo_after_remove_product_item', {
                            "fragments": response.fragments
                        });
                    }).fail(function () {
                        window.location = $thisbutton.attr('href');
                        return;
                    });
                } else {
                    var cart_item_key = $thisbutton.data('cart_item_key');
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: wc_add_to_cart_params.ajax_url,
                        data: {
                            action: "restore_cart_item",
                            cart_item_key: cart_item_key
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log('AJAX Restore ' + errorThrown);
                            console.log('AJAX Restore ' + cart_item_key);
                        },
                        success: function (data) {
                            $(document).trigger('zoo_after_restore_product_item', {
                                "fragments": data
                            });
                            $thisbutton.removeClass('revert-cart-item');

                            $cart_item.removeClass('pre-remove');
                            if (!$mini_cart.find('.wrap-bottom-mini-cart').is(":visible")) {
                                $mini_cart.find('.wrap-bottom-mini-cart').fadeIn();
                            }
                            $mini_cart.find('.woocommerce-mini-cart__total.total .woocommerce-Price-amount').replaceWith(data.cart_subtotal);
                            $mini_cart.find('.free-shipping-required-notice').replaceWith(data.free_shipping_cart_notice);
                            $thisbutton.closest('.widget_shopping_cart ').find('.total-cart-item').replaceWith(data['.total-cart-item']);
                            $cart_item.removeClass('loading');
                        }
                    });
                    return false;
                }
            });

            //Update mini top cart ajax
            $(document).on('added_to_cart', function (event, fragments) {
                if (!$('.cafe-canvas-cart')[0])
                    zoo_add_to_cart_mess(fragments['zoo_add_to_cart_message']);

            });
            /* End Ajax cart for shop loop product item*/

            //Refresh variations_form button added to cart when change option.
            $("form.variations_form").on("woocommerce_variation_select_change", function () {
                $(this).find('.cart-added').removeClass('cart-added');
            });

            /* Ajax Add to Cart for Single Product */
            $(document).on('click', 'button.single_add_to_cart_button:not(.disabled)', function (e) {

                var max = parseInt($(this).closest('form').find('input.qty').attr('max'));
                var qty = parseInt($(this).closest('form').find('input.qty').val());
                if (!!max && (max < qty)) {
                    return;
                }

                var $thisbutton = $(this),
                    $form = $thisbutton.closest('form.cart'),
                    id = $thisbutton.val(),
                    product_qty = $form.find('input[name=quantity]').val() || 1,
                    product_id = $form.find('input[name=product_id]').val() || id,
                    variation_id = $form.find('input[name=variation_id]').val() || 0;
                var variations = {};
                var cart_item_data = {};
                if(!product_id){
                    return true;
                }
                if($form.find('select')[0]&& !$form.hasClass('variations_form')){
                    return true;
                }else{
                    e.preventDefault();
                }
                if ($form.find('select')[0]&& variation_id != 0) {
                    $form.find('select').each(function () {
                        if ($(this).val() != '') {
                            variations[$(this).attr('name')] = $(this).val();
                        }
                    });
                    $form.find('select').each(function () {
                        if ($(this).val() != '') {
                            cart_item_data[$(this).attr('name')] = $(this).val();
                        }
                    });
                    var restrictInput=["agree-term","quantity","add-to-cart","product_id","variation_id", "old_variation_id"];
                    $form.find('input').each(function () {
                        if ($(this).val() != '') {
                            let name=$(this).attr('name');
                            if(restrictInput.find(item=> name==item)==undefined) {
                                cart_item_data[name] = $(this).val();
                            }
                        }
                    });
                }
                if ($thisbutton.hasClass('cart-added')) {
                    window.location = wc_add_to_cart_params.cart_url;
                    return false;
                }
                if ($form.find('.woocommerce_gc_giftcard_form')[0]) {
                    return true;
                }
                var data = {
                    action: 'zoo_add_single_product_to_cart',
                    product_id: product_id,
                    product_sku: '',
                    quantity: product_qty,
                    variation_id: variation_id,
                    variations: variations,
                    cart_item_data: cart_item_data,
                };
                $(document.body).trigger('adding_to_cart', [$thisbutton, data]);
                $.ajax({
                    type: 'post',
                    url: wc_add_to_cart_params.ajax_url,
                    data: data,
                    beforeSend: function (response) {
                        $thisbutton.addClass('loading');
                    },
                    complete: function (response) {
                        $thisbutton.addClass('cart-added').removeClass('loading');
                    },
                    success: function (response) {
                        if (response.error && response.product_url) {
                            window.location = response.product_url;
                            return;
                        } else {
                            $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, '']);
                            if (!$thisbutton.hasClass('zoo-buy-now')) {
                                let icon = $thisbutton.find('i').clone();
                                $(document).trigger('zoo_single_product_cart_added', {
                                    "response": response
                                });
                                $thisbutton.html(wc_add_to_cart_params.i18n_view_cart);
                                $thisbutton.prepend(icon);
                            } else {
                                window.location = wc_add_to_cart_params.cart_url;
                                return false;
                            }

                        }
                    },
                });
                return false;
            });
        }
        /* End Ajax Add to Cart for Single Product */

        //Function for Add to Cart message
        function zoo_add_to_cart_mess($zoo_mess) {
            if (!!$zoo_mess && $zoo_mess != undefined) {
                if ($('#zoo-add-to-cart-message')[0]) {
                    $('#zoo-add-to-cart-message').replaceWith($zoo_mess);
                } else {
                    $('body').append($zoo_mess);
                }
                setTimeout(function () {
                    $('#zoo-add-to-cart-message').addClass('active');
                }, 100);
                setTimeout(function () {
                    $('#zoo-add-to-cart-message').removeClass('active');
                }, 3500);
            }
        }

        /* Quick view js */
        $(document).on('click', '.product .btn-quick-view', function (e) {
            e.preventDefault();
            $('.zoo-mask-close').addClass('loading active mask-quick-view');
            var load_product_id = $(this).attr('data-productid');
            var data = {action: 'zoo_quick_view', product_id: load_product_id};
            $(this).parent().addClass('loading');
            var $this = $(this);
            $.ajax({
                url: ajaxurl,
                data: data,
                type: "POST",
                success: function (response) {
                    $('body').append(response);
                    $this.parent().removeClass('loading');
                    // Variation Form
                    var form_variation = $(document).find('#zoo-quickview-lb .variations_form');
                    form_variation.wc_variation_form();
                    form_variation.trigger('check_variations');
                    zoo_quick_view_gal();
                    //Sync button compare/wishlist quickview load.
                    if ($('#zoo-quickview-lb .zoo-wishlist-button')[0]) {
                        if (window.zooWishlist.model.exists($('#zoo-quickview-lb .zoo-wishlist-button').data('id'))) {
                            window.zooWishlist.view.renderBrowseButton($('#zoo-quickview-lb .zoo-wishlist-button'));
                        }
                    }
                    if ($('#zoo-quickview-lb .zoo-compare-button')[0]) {
                        if (window.zooProductsCompare.model.exists($('#zoo-quickview-lb .zoo-compare-button').data('id'))) {
                            window.zooProductsCompare.view.renderBrowseButton($('#zoo-quickview-lb .zoo-compare-button'));
                        }
                    }
                    $('.lazy-img:not(.loaded)').zoo_lazyImg();
                    setTimeout(function () {
                        $('#zoo-quickview-lb').css('opacity', '1');
                        $('#zoo-quickview-lb').css('top', '50%');
                    }, 100);
                }
            });
        });

        $(document).on('click', '.close-quickview, .zoo-mask-close.mask-quick-view', function (e) {
            e.preventDefault();
            zoo_close_quick_view();
        });
        //Close Quickview when click to compare/wish list.
        $(document).on('zoo_browse_wishlist', function () {
            zoo_close_quick_view();
        });
        $(document).on('zoo_browse_compare', function () {
            zoo_close_quick_view();
        });
        //Swatches gallery for quick view
        $(document).on('cleverswatch_update_gallery', function (event, response) {
            if ($('#zoo-quickview-lb')[0])
                zoo_quick_view_gal();
        });

        //Close Quickview;
        function zoo_close_quick_view() {
            $('.zoo-mask-close').removeClass('loading active mask-quick-view');
            $('#zoo-quickview-lb').css({'top': 'calc(50% + 150px)', 'opacity': '0'});
            setTimeout(function () {
                $('#zoo-quickview-lb').remove();
            }, 500)
        }

        //Quickview gallery
        function zoo_quick_view_gal() {
            if ($('.zoo-product-quick-view .wrap-main-product-gallery')[0]) {
                let thumb_num = $('.zoo-product-gallery.images').data('columns');
                if (typeof  $.fn.slick != 'undefined') {
                    $('.zoo-product-quick-view .wrap-main-product-gallery').slick({
                        slidesToShow: 1,
                        rows: 0,
                        slidesToScroll: 1,
                        focusOnSelect: true,
                        rtl: $('body.rtl')[0] ? true : false,
                        asNavFor: $('.wrap-list-thumbnail')[0] ? '.zoo-product-quick-view .wrap-list-thumbnail' : '',
                        prevArrow: '<span class="zoo-carousel-btn prev-item"><i class="zoo-icon-arrow-left"></i></span>',
                        nextArrow: '<span class="zoo-carousel-btn next-item"><i class="zoo-icon-arrow-right"></i></span>',
                    });
                    $('.zoo-product-quick-view .wrap-list-thumbnail').slick({
                        slidesToShow: thumb_num,
                        rows: 0,
                        slidesToScroll: 1,
                        focusOnSelect: true,
                        rtl: $('body.rtl')[0] ? true : false,
                        asNavFor: '.zoo-product-quick-view .wrap-main-product-gallery',
                        prevArrow: '<span class="zoo-carousel-btn prev-item"><i class="zoo-icon-arrow-left"></i></span>',
                        nextArrow: '<span class="zoo-carousel-btn next-item "><i class="zoo-icon-arrow-right"></i></span>',
                    });
                }
            }
        }

        /* End Quick view js */

        //Normally Ajax url, for multi language
        function normally_url_cart(url, parameterName, parameterValue, atStart) {
            var replaceDuplicates = true;
            var urlhash = '';
            var cl = url.length;
            if (url.indexOf('#') > 0) {
                cl = url.indexOf('#');
                urlhash = url.substring(url.indexOf('#'), url.length);
            }
            var sourceUrl = url.substring(0, cl);

            var urlParts = sourceUrl.split("?");
            var newQueryString = "";

            if (urlParts.length > 1) {
                var parameters = urlParts[1].split("&");
                for (var i = 0; (i < parameters.length); i++) {
                    var parameterParts = parameters[i].split("=");
                    if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                        if (newQueryString == "")
                            newQueryString = "?";
                        else
                            newQueryString += "&";
                        newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
                    }
                }
            }
            if (newQueryString == "")
                newQueryString = "?";

            if (atStart) {
                newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
            } else {
                if (newQueryString !== "" && newQueryString != '?')
                    newQueryString += "&";
                newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
            }
            return urlParts[0] + newQueryString + urlhash;
        }
    })
})(jQuery);