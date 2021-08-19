jQuery(function($) {
    "use strict";

    // Nav tabs.
    $(".nav-tab").click(function() {
        $(".nav-tab").removeClass("tab-active");
        $(this).addClass("tab-active");
        $(".settings-tab").hide();
        $(this.dataset.tabId).show();
    });

    // Selective layout images.
    $(".select-img").on('click',function() {
        var layout = this.dataset.layout;
        $("#archive-portfolio-layout").val(layout);
        $(".select-img").removeClass("selected-img");
        $(this).addClass("selected-img");
        if ("masonry" === layout) {
            $("#archive-layout-mode").show();
        } else {
            $("#archive-layout-mode").hide();
        }
    });
    if($('#clever-single-gallery-layout option:selected').attr('value')=='slider'){
        $('#clever-single-gallery-thumb').show()
    }else{
        $('#clever-single-gallery-thumb').hide()
    }
    $('#clever-single-gallery-layout').on('change',function() {
        if($('#clever-single-gallery-layout option:selected').attr('value')=='slider'){
            $('#clever-single-gallery-thumb').show()
        }else{
            $('#clever-single-gallery-thumb').hide()
        }
    });
    // Enable extra information tab.
    $(function() {
        var extraFields = $("#clever-portfolio-available-extra-fields"),
            extraInfoField = $(".clever-portfolio-extra-info-field"),
            extraInfoTab = $("#clever-portfolio-single-enable-extra-info"),
            addExtraFieldBtn = $("#clever-portfolio-add-extra-field-btn");

        if (extraInfoTab.is(":checked")) {
          extraInfoField.show()
        } else {
          extraInfoField.hide()
        }

        extraInfoTab.on('change',function() {
            if (extraInfoTab.is(":checked")) {
              extraInfoField.show()
            } else {
              extraInfoField.hide()
            }
        });

        addExtraFieldBtn.click(function(e) {
            var key=0;
            $('#clever-portfolio-available-extra-fields tr').each(function () {
                if($(this).data('key-index')>key){
                    key=$(this).data('key-index');
                }
            });
            key=key+1;
            e.preventDefault();
            extraFields.append('<tr data-key-index="'+key+'"><td><input type="text" name="' + cleverPortfolioSettings.extraFieldID + '[extra-field-' + key + '][label]" placeholder="' + cleverPortfolioSettings.extraPlaceholder + '&hellip;" value=""><label class="ri-wrap-select"> <select name="' + cleverPortfolioSettings.extraFieldID + '[extra-field-' + key + '][type]"><option value="text">' + cleverPortfolioSettings.textTypeLabel + '</option><option value="link">' + cleverPortfolioSettings.linkTypeLabel + '</option><option value="email">' + cleverPortfolioSettings.emailTypeLabel + '</option><option value="number">' + cleverPortfolioSettings.numberTypeLabel + '</option><option value="textarea">' + cleverPortfolioSettings.textareaTypeLabel + '</option><option value="datetime">' + cleverPortfolioSettings.datetimeTypeLabel + '</option></select></label><button class="button button-secondary clever-portfolio-remove-extra-field-btn" type="button">' + cleverPortfolioSettings.removeBtnText + '</button></td></tr>');
            return false;
        });

        $(document).on('click',".clever-portfolio-remove-extra-field-btn",function(e) {
            e.preventDefault();

            $(this).closest("tr").remove();

            return false;
        });
    });

    // Enable custom style.
    $(function() {
        var customStyle = $("#enable-custom-style"),
            customStyleSettings = $(".custom-style-setting");

        if (customStyle.is(":checked")) {
          customStyleSettings.show()
        } else {
          customStyleSettings.hide()
        }

        customStyle.change(function() {
            if (customStyle.is(":checked"))
            {
              customStyleSettings.show()
            } else {
              customStyleSettings.hide()
            }
        });
    });

    // Color pickers.
    $(document).ready(function() {
        // Color picker init.
        $(".cp-color-picker").spectrum({preferredFormat: "rgb",showInput: true,showAlpha: true });
    });
    // Button loadmore
    $(function() {
        var btn_show = $("#clever_btn_readmore"),
            btn_text=$("#clever_archive_readmore_text");
        if (btn_show.is(":checked")) {
            btn_text.show();
        }else{
            btn_text.hide();
        }
        btn_show.on('change',function () {
            if (btn_show.is(":checked")) {
                btn_text.show();
            }else{
                btn_text.hide();
            }
        })
    });
    // Paging types
    $(function() {
        var pagingType = $("#paging-type"),
            ajaxLoader = $("#clever-portfolio-ajax-loader"),
            pagingIcon = $("#archive_paging_icon"),
            loadMoreButtonText = $("#load-more-button-text");

        if (pagingType.val() === "loadmore") {
            ajaxLoader.hide();
            pagingIcon.show();
            loadMoreButtonText.show();
        } else if (pagingType.val() === "infinite"){
            ajaxLoader.show();
            pagingIcon.show();
            loadMoreButtonText.hide();
        } else {
            ajaxLoader.hide();
            pagingIcon.hide();
            loadMoreButtonText.hide();
        }

        pagingType.change(function() {
            if (pagingType.val() === "loadmore") {
                ajaxLoader.hide();
                pagingIcon.show();
                loadMoreButtonText.show();
            } else if (pagingType.val() === "infinite"){
                ajaxLoader.show();
                pagingIcon.show();
                loadMoreButtonText.hide();
            } else {
                ajaxLoader.hide();
                pagingIcon.hide();
                loadMoreButtonText.hide();
            }
        });
    });

    // AJAX loader.
    $(function() {
        var frame, loader = $("#ajax-loader-image"),
            loaderVal = $("#ajax-loader-image-value"),
            addGalBtn = $("#upload-new-ajax-loader"),
            delGalBtn = $("#use-default-ajax-loader");

        addGalBtn.click(function(e) {
            e.preventDefault();

            // If the media frame already exists, reopen it.
            if (frame) {
                frame.open();
                return false;
            }

            // Create a new media frame
            frame = wp.media({
                title: cleverPortfolioSettings.wpMediaTitle,
                button: {
                    text: cleverPortfolioSettings.wpMediaButtonText
                },
                multiple: false  // Set to true to allow multiple files to be selected
            });

            // When an image is selected in the media frame...
            frame.on("select", function() {
                // Get media attachment details from the frame state
                var attachment = frame.state().get("selection").first().toJSON();

                loader.attr("src", attachment.url);
                loaderVal.val(attachment.url);
            });

            // Finally, open the modal on click
            frame.open();
        });

        // Reset AJAX loader
        delGalBtn.click(function(e) {
            e.preventDefault();

            loader.attr("src", cleverPortfolioSettings.defaultAjaxLoader);

            loaderVal.val(cleverPortfolioSettings.defaultAjaxLoader);
        });
    });
});
