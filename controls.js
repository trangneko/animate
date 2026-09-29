$(function(){
    var doMouseEnter = false;
    $(window).on("load", function(){
        groupMenu();
        menuSearchList();
        exOpenMegaMenu();
        rankingSlider();
        totopBtn();
        selectUi();
        modalOpen();
        searchModuleStorage();
        sideSticker();
    })

    function groupMenu(){
        $("#header_group .groupmenu_btn").hover(function(){
            $("#header_group .groupmenu_btn #groupmenu").stop().fadeIn(300);
        },function(){
            $("#header_group .groupmenu_btn #groupmenu").stop().fadeOut(300);
        })
    }

    function totopBtn(){
        $(window).on("scroll", function(){
            if($(this).scrollTop() > 1200){
                $("#totop").stop().fadeIn(100);
            }else{
                $("#totop").stop().fadeOut(100);
            }
        })
        $("#totop,a.to-top").click(function(){
            $('body,html').animate({scrollTop: 0}, 400);
        })
    }

    function menuSearchList(){
        var search_list = $("#header_group .search_list p");
        var titles = $("#header_group .search_inner .titles li a");
        var sub = $("#header_group .search_inner .sub");
        search_list.mouseenter(function(){
            if(typeof(megamenu) != 'undefined' && megamenu.initLoaded == false){
                megamenu.initLoaded = true;
                setTimeout(()=>{
                    megamenu.searchAnimeitem('q0', 1, 5, 'json_sakuhin');
                    megamenu.searchAnimeitem('q0', 1, 5, 'json_artist');
                    megamenu.searchAnimeitem('q0', 1, 5, 'json_author');
                },100)
            }

            if(doMouseEnter || $(this).hasClass("current")){
                doMouseEnter = false;
                return;
            }
            search_list.removeClass("current");
            $(this).addClass("current");
            $("#header_group .search_inner").fadeOut(200);

            var this_id = $(this).attr("content-id");
            var this_target = $("#header_group .search_inner[content-id='" + this_id + "']");

            this_target.stop().fadeIn(200);
            sub.children(".default").css("display", "block");
            if(this_id == "search_category"){
                calcInnerTitlesContent(this_id);
            }
            focusOut(this_target, $(this).parents(".search_list"));
        })
        function focusOut(t, pt){
            $(t).mouseleave(function(a){
                innerClose(a);
            })
            $(pt).mouseleave(function(a){
                innerClose(a);
            })
            function innerClose(a){
                if(typeof(a) != 'undefined'){
                    var area = $(a.relatedTarget).attr("class");
                }
                if(!area || area.indexOf("search_list") == -1 && area.indexOf("inner") == -1 && area.indexOf("sub") == -1){
                    t.stop().fadeOut(200);
                    pt.children("p").removeClass("current");
                }
                sub.children(".sub_inner").css("display", "none");
                sub.children(".default").css("display", "block");
            }
        }

        function calcInnerTitlesContent(this_id){
            var s = $("#header_group .search_inner[content-id='" + this_id + "'] .titles").outerHeight();
            $("#header_group .search_inner[content-id='" + this_id + "']").css("height", s);
            $("#header_group .search_inner[content-id='" + this_id + "'] .inner").css("height", s);
            $("#header_group .search_inner[content-id='" + this_id + "'] .sub").css("min-height", s);
            $("#header_group .search_inner[content-id='" + this_id + "'] .sub_inner").css("min-height", s);
        }

        titles.mouseenter(function(){
            var this_id = $(this).attr("sub-id");
            if(this_id){
                sub.children(".sub_inner").css("display", "none");
                sub.children(".sub_inner[sub-id='" + this_id + "']").css("display", "block");
            }else{
                sub.children(".sub_inner").css("display", "none");
                sub.children(".default").css("display", "block");
            }
        })
    }

    function exOpenMegaMenu(){
        var hash = location.hash;
        var urlAnchor = hash.substr( 4 );
        if($('p[content-id="'+urlAnchor+'"]')[0]){
            var search_list_elm = '#header_group .search_list p';
            var sub_elm = $("#header_group .search_inner .sub");
            $(search_list_elm).removeClass("current");
            $('p[content-id="'+urlAnchor+'"]').addClass("current");
            $("#header_group .search_inner").fadeOut(200);

            var this_id = urlAnchor;
            var this_target = $("#header_group .search_inner[content-id='" + this_id + "']");

            this_target.stop().fadeIn(200);
            sub_elm.children(".default").css("display", "block");
            if(this_id == "search_category"){
                var s = $("#header_group .search_inner[content-id='" + this_id + "'] .titles").outerHeight();
                $("#header_group .search_inner[content-id='" + this_id + "']").css("height", s);
                $("#header_group .search_inner[content-id='" + this_id + "'] .inner").css("height", s);
                $("#header_group .search_inner[content-id='" + this_id + "'] .sub").css("min-height", s);
                $("#header_group .search_inner[content-id='" + this_id + "'] .sub_inner").css("min-height", s);
            }
            doMouseEnter = false;
        }
    }

    function rankingSlider(){
        if(!$(".ranking_item_list")[0]){
            return;
        }
        var slider_data = new Array;
        var sliders = $(".ranking_item_list");
        rankingSliderSet();

        function rankingSliderSet(){
            for(var i = 0; sliders.length > i; i++){
                var this_slider = $(sliders[i]);
                var this_id = this_slider.attr("slide-id");
                var view_slide = Math.ceil(this_slider.width() / 168);
                this_slider.find("ul").css("width", 168 * this_slider.find("li").length - 30);
                slider_data[this_id] = new Array;
                slider_data[this_id]["selector"] = this_slider;
                slider_data[this_id]["width"] = this_slider.width();
                slider_data[this_id]["length"] = this_slider.find("li").length;
                slider_data[this_id]["now_count"] = 0;
                slider_data[this_id]["max_count"] = Math.ceil((this_slider.find("li").length) / view_slide) - 1;

                if(slider_data[this_id]["max_count"] <= 0){
                    $(".ranking_control[slide-id='" + this_id + "']").addClass("disible");
                }else{
                    $(".ranking_control[slide-id='" + this_id + "'] .prev").addClass("disible");
                }
            }
        }
        $(".ranking_control .prev").click(function(){
            var this_id = $(this).parents(".ranking_control").attr("slide-id");
            if($(this).hasClass("disible")||$(this).parents(".ranking_control").hasClass("disible")){
                return;
            }
            var this_slider = slider_data[this_id]["selector"].find("ul");
            var move_width = slider_data[this_id]["width"] + 17;
            var now_position = this_slider.css("margin-left");
            --slider_data[this_id]["now_count"];
            this_slider.stop().animate({"margin-left": - move_width * slider_data[this_id]["now_count"]}, 300, "easeOutQuart");
            if(slider_data[this_id]["now_count"] <= 0){
                $(this).addClass("disible");
            }
            $(this).next(".next").removeClass("disible");
        })
        $(".ranking_control .next").click(function(){
            var this_id = $(this).parents(".ranking_control").attr("slide-id");
            if($(this).hasClass("disible")||$(this).parents(".ranking_control").hasClass("disible")){
                return;
            }
            var this_slider = slider_data[this_id]["selector"].find("ul");
            var move_width = slider_data[this_id]["width"] + 17;
            var now_position = this_slider.css("margin-left");
            ++slider_data[this_id]["now_count"];
            this_slider.stop().animate({"margin-left": - move_width * slider_data[this_id]["now_count"]}, 300, "easeOutQuart");
            if(slider_data[this_id]["now_count"] >= slider_data[this_id]["max_count"]){
                $(this).addClass("disible");
            }
            $(this).prev(".prev").removeClass("disible");
        })
    }

    function selectUi(){
        $(".input_select_option").on("change", function(){
            var text = $(this).find("select option:selected").text();
            $(this).find("p").text(text);
        })
    }

    function modalOpen(){
        $(".modalOpen").click(function(){
            var modal_target = $(this).attr("target-modal");
            $("#" + modal_target).stop().fadeIn(300);
            return false;
        })
        modalClose();
    }
    function modalClose(){
        $(".modalClose").click(function(){
            $(".modal_content").fadeOut(200);
        })
    }
    function searchModuleStorage(){
        $(".search_module_storage .search_module_open_btn").click(function(){
            if($(this).hasClass("open")){
                $(this).next(".search_module").stop().slideUp(200);
                $(this).removeClass("open");
                return;
            }
            $(this).addClass("open");
            $(this).next(".search_module").stop().slideDown(200);
        })
    }

    function sideSticker(){
        var sticker = $(".side_sticker");
        sticker.css("position", "absolute");
        if(sticker.length){
            var sticker_x = sticker.offset().left;
            var sticker_y = sticker.offset().top;
            var wrapper = sticker.parents(".contents_wrap");
            var wrapper_h = wrapper.height();
            var sticker_domain = wrapper_h - sticker.outerHeight();
            $(window).on("resize", function(){
                sticker_x = sticker.offset().left;
            })
            var timer;
            $(window).on("load scroll", function(){
                var st = window.pageYOffset;
                if(timer){
                    clearTimeout(timer);
                }
                timer = setTimeout(function(){
                    if(st > sticker_y && st <= sticker_y + sticker_domain){
                        sticker.stop().animate({"top": st - sticker_y}, 300);
                    }else if(st > sticker_domain && st > sticker_y){
                        wrapper_h = wrapper.height();
                        sticker_domain = wrapper_h - sticker.outerHeight();
                        sticker.stop().animate({"top": sticker_domain}, 300);
                    }else{
                        sticker.stop().animate({"top": 0}, 300);
                    }
                    lock = false;
                }, 300);
            });
        }
    }

    var onHtmlSubmit = true;
    window.addEventListener('pageshow', function (event) {
        // ページがキャッシュから復元された場合でもフラグをリセット
        onHtmlSubmit = true;
    });
    var timeIdHtmlSubmit = 0;
    if(typeof(window.jqSubmitAlert) === 'undefined'){
        window.jqSubmitAlert = window.alert;
        window.alert = function(msg){
            onHtmlModeSubmit = true;
            onFnHtmlSubmit = true;
            if(typeof(onHtmlSubmit) != 'undefined'){
                onHtmlSubmit = true;
            }
            window.jqSubmitAlert(msg);
        }
    }
    $('form').on('submit', function(e){
        var id = $(this).attr('id');
        var is_already_cancel = (typeof(e.defaultPrevented) != 'undefined' && e.defaultPrevented) ? true : false;
        var r = is_already_cancel ? false : onHtmlSubmit;
        if ( is_already_cancel === false && id != 'form_search' && id != 'login_form' && id != 'member_form' && id != 'login_mypage1' ){
            if(onHtmlSubmit == false){
                if( timeIdHtmlSubmit > 0 ){ clearTimeout(timeIdHtmlSubmit); }
                window.alert = function(msg){};
                window.jqSubmitAlert("只今処理中です。\nしばらくお待ちください。");
                timeIdHtmlSubmit = setTimeout(function(){
                    window.alert = window.jqSubmitAlert;
                }, 1000);
            }
            onHtmlSubmit = false;
        }
        return r;
    });
});

function pageJump( url, window){
    if(window === 1){
        open( url , "_blank" ) ;
    }else{
        document.location.href = url;
    }
}
