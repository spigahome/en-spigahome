jQuery(function ($) {
    "use strict";

    // Date pickers
    $(".date-picker").datepicker({
        dateFormat: "yy-mm-dd"
    });
    // Carousel Layout shortcode
    var input = $("#single-portfolio-layout"),
        carousel_layout = $(".carousel-layout-required select"),
        carousel_field = $(".carousel-layout-required "),
        filter = $('.filter-align'),
        carousel_height = $('.carousel-auto');
    if (input.val() == 'carousel') {
        carousel_field.show();
        filter.hide();
        if (carousel_layout.find('option:selected').val() == 'auto') {
            carousel_height.show()
        } else {
            carousel_height.hide()
        }
    } else {
        carousel_field.hide();
        filter.show();
    }
    carousel_layout.on('change', function () {
        if (carousel_layout.find('option:selected').val() == 'custom') {
            carousel_height.show()
        } else {
            carousel_height.hide()
        }
    });
    // Selective layout images.
    $(".select-img").click(function () {
        var layout = this.dataset.layout;
        $("#single-portfolio-layout").val(layout);
        $(".select-img").removeClass("selected-img");
        $(this).addClass("selected-img");
        switch (layout) {
            case 'masonry':
                $("#layout-mode").show();
                carousel_field.hide();
                filter.show();
                break;
            case 'carousel':
                carousel_field.show();
                filter.hide();
                break;
            default:
                carousel_field.hide();
                $("#layout-mode").hide();
                filter.show();
                break;
        }
    });

    // Selective style images.
    $(".select-style-img").click(function () {
        var style = this.dataset.style;
        $("#single-portfolio-style").val(style);
        $(".select-style-img").removeClass("selected-img");
        $(this).addClass("selected-img");
    });

    // Nav tabs.
    $(".nav-tab").click(function () {
        $(".nav-tab").removeClass("tab-active");
        $(this).addClass("tab-active");
        $(".meta-table").hide();
        $(this.dataset.tabId).show();
    });

    // Change meta fields base on Portfolio format
    $(function () {
        var portfolioFormat = $("#portfolio-format"),
            gallerySection = $(".gallery-meta-field"),
            videoSection = $(".video-meta-field");

        if (portfolioFormat.val() === "gallery") {
            videoSection.hide();
            gallerySection.show();
        } else {
            gallerySection.hide();
            videoSection.show();
        }

        portfolioFormat.change(function () {
            if (portfolioFormat.val() === "gallery") {
                videoSection.hide();
                gallerySection.show();
            } else {
                gallerySection.hide();
                videoSection.show();
            }
        });
    });

    // Conditional show metro columns width field
    $(function () {
        var galleryLayout = $("#gallery-layout"),
            colomnsWidth = $("#metro-columns-width");

        if ($("#portfolio-format").val() === "gallery") {
            if (galleryLayout.val() === "metro") {
                colomnsWidth.show();
            } else {
                colomnsWidth.hide();
            }
            galleryLayout.change(function () {
                if (galleryLayout.val() === "metro") {
                    colomnsWidth.show();
                } else {
                    colomnsWidth.hide();
                }
            });
        }
    });

    // Oembed AJAX preview
    $(function () {
        var btn = $("#oembed-preview-btn"),
            doc = $("#oembed-preview-container");

        btn.click(function (e) {
            e.preventDefault();

            var postData = {
                action: "preview_oembed_portfolio",
                porfolioOembedUrl: $("#portfolio-oembed-url").val()
            };

            $.ajax({
                url: ajaxurl,
                data: postData,
                method: "POST"
            })
                .done(function (r) {
                    doc.empty().html(r);
                })
                .fail(function (r) {
                    console.log(r);
                });
        });
    });

    // Enable extra information.
    $(function () {
        var shortcodeReadMore = $("#show-read-more-button"),
            shortcodeReadMoreText = $("#read-more-button-text-field");

        if (shortcodeReadMore.is(":checked")) {
            shortcodeReadMoreText.show()
        } else {
            shortcodeReadMoreText.hide()
        }

        shortcodeReadMore.change(function () {
            if (shortcodeReadMore.is(":checked")) {
                shortcodeReadMoreText.show()
            } else {
                shortcodeReadMoreText.hide()
            }
        });
    });

    // Add and Remove gallery
    $(function () {
        var frame,
            galleries = $("#galleries-data"),
            addGalleryBtn = $("#add-gallery-btn"),
            mediaContainer = $("#media-container"),
            resetGalleryBtn = $("#reset-gallery-btn");

        addGalleryBtn.click(function (e) {
            e.preventDefault();

            // If the media frame already exists, reopen it.
            if (frame) {
                frame.open();
                return;
            }

            // Create a new media frame
            frame = wp.media({
                title: cleverPortfolioSettings.wpMediaTitle,
                button: {
                    text: cleverPortfolioSettings.wpMediaButtonText
                },
                multiple: true  // Set to false to disallow multiple files to be selected
            });

            // When an image is selected in the media frame...
            frame.on("select", function () {
                var selection = frame.state().get('selection');

                selection.map(function (attachment) {
                    attachment = attachment.toJSON();
                    mediaContainer.append(' <li class="cp-gallery-item"><img class="gallery-thumbnail" src="' + attachment.url + '" width="150" height="150"> <span class="cp-remove-gallery-item" data-id="'+attachment.id+'"><i class="cs-font clever-icon-close"></i></span></li>');
                    galleries.val(galleries.val() + ',' + attachment.id);
                });
            });

            // Finally, open the modal on click
            frame.open();
        });


        // Remove gallery
        resetGalleryBtn.click(function (e) {
            e.preventDefault();
            galleries.val("");
            mediaContainer.empty();
        });
        $(document).on('click','.cp-remove-gallery-item',function () {
            var $this=$(this);
            var wrap=$this.parents('.cp-gallery-item');
            var index=wrap.index();
            var galleries_data=$('#galleries-data').val().split(",");
            delete galleries_data[index];
            galleries_data=galleries_data.filter(function(v){return v!==''}).toString();
            $('#galleries-data').val(galleries_data);
            wrap.remove();
        })
    });
});
