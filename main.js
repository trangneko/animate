$(function(){
    var wW;
    var wh;
    var st;
    var contentWrap = $('.wrapper > .contentWrap');
    var menu = $('nav.slideMenu');
    var menuB = $('#menu_btn');
    var menuBW = menuB.outerWidth();
    var menuCloseB = $('#menuClose');
    var menuW;
    var totopB = $('#totop');

    var topSlideArea = $('#top #topSlideArea');
    var topSlideUl = $('#top #topSlideArea .listWrapper ul');
    var topSlideLi = $('#top #topSlideArea .listWrapper ul > li');
    var topSlidePrevNext = $('#top #topSlideArea .listWrapper > .button');
    var kana = $('#top .animeigo #kana');
    var kanaPrevNext = $('#top .animeigo .button');
    var kanaAnchor = $('top .animaigo ul .anchor');
    var kanaAnchorPosition = [];

    $(window).on('load resize', function(){
        wW = $(window).width();
        wh = $(window).height();
        /*menuW = wW - menuBW;*/ /* ウィンドウサイズに合わせて可変にする場合 */
        menuW = 280; /* ウィンドウサイズに合わせず固定にする場合 */
        menu.css({width: menuW, height: wh});
        topSlideLi.css({width: wW});
    })
    
    var onHtmlSubmit = true;
    window.addEventListener('pageshow', function (event) {
        // ページがキャッシュから復元された場合でもフラグをリセット
        onHtmlSubmit = true;
    });
    
    var timeIdHtmlSubmit = 0;
    if(typeof(window.jqSubmitSpAlert) === 'undefined'){
        window.jqSubmitSpAlert = window.alert;
        window.alert = function(msg){
            onHtmlSubmit = true;
            window.jqSubmitSpAlert(msg);
        }
    }
    $('form').on('submit', function(e){
        var id = $(this).attr('id');
        var is_already_cancel = (typeof(e.defaultPrevented) != 'undefined' && e.defaultPrevented) ? true : false;
        var r = is_already_cancel ? false : onHtmlSubmit;
        if(is_already_cancel === false && id != 'searchform1'){
            if(onHtmlSubmit == false){
                if( timeIdHtmlSubmit > 0 ){ clearTimeout(timeIdHtmlSubmit); }
                window.alert = function(msg){};
                window.jqSubmitSpAlert("只今処理中です。\nしばらくお待ちください。");
                timeIdHtmlSubmit = setTimeout(function(){
                    window.alert = window.jqSubmitSpAlert;
                }, 1000);
            }
            onHtmlSubmit = false;
        }
        return r;
    });

    totopB.click(function(){
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    })

    menuB.click(function(){
        wh = $(window).height();
        menuW = 280; /* ウィンドウサイズに合わせず固定にする場合 */
        menu.css({width: menuW, height: wh});
        menuCloseB.fadeIn(300);
        st = $(window).scrollTop();
        menu.css({'top': $('#html_top').height(), 'height': wh-$('#html_top').height()+st, 'overflow-y': 'scroll', 'z-index': 99998 });
        menu.scrollTop(0);
        menu.animate({ left: 0 }, 300);
        contentWrap.animate({ marginLeft: menuW }, 300);
        contentWrap.css({'height': wh, 'overflow-y': 'hidden'});
        // スクロールを無効にする(iOS)
        $('body').css({'height': $(window).height(),'overflow': 'hidden'});
        $(window).on('touchmove.is-fixed', function(e) {
            e.preventDefault();
        });
        $('#flw-cart').hide();
        return false;
    })
    menuCloseB.click(function(){
        menuCloseB.fadeOut(300);
        menu.animate({ left: -menuW}, 300);
        contentWrap.animate({ marginLeft: 0 }, 300);
        // 詳細検索画面が表示されている時はスクロール無効は解除しない
        if (!$(".section_keywords").hasClass("scroll-on")) {
            contentWrap.css({'height': '', 'overflow-y': ''});
            // スクロール無効を解除する
            $('body').css({'height': '', 'overflow': ''});
            $(window).off('.is-fixed');
        }
        $('#flw-cart').show();
    })


// TOP PAGE FREE AREA SLIDER
  window.startTopSlider = function () {
    topSlideLi = topSlideUl.children('li');
    var slideLength = topSlideLi.length;
    var firstLi = topSlideLi.filter(':first');
    var lastLi = topSlideLi.filter(':last');
    topSlideUl.prepend(lastLi.clone(true));
    topSlideUl.append(firstLi.clone(true));
    topSlideArea.append('<div id="slideControl" />')
    topSlideLi = topSlideUl.children('li');
    var slideM = 0;
    var sc = $('#slideControl');
    topSlideUl.css({width: 100 * (slideLength + 2) + '%', left: "-100%"});
    for (var i=1 ; i<=slideLength ; i++){
        sc.append('<span />');
    }
    var sliderNav=$('#slideControl > span');
    setTimeout(function(){
        sliderNav = $('#slideControl > span');
        sliderNav.eq(0).addClass('current');
    }, 100);
    function topSlideChangePart(){
        var normalizedSlideM = slideM < 0 ? slideLength - 1 : slideLength <= slideM ? 0 : slideM;
        topSlideUl.stop().animate({left: 0, marginLeft: -100 -100 * slideM + '%'}, 600, function () { topSlideUl.css({left:0, marginLeft: -100 - 100 * normalizedSlideM + '%'}); });
        slideM = normalizedSlideM;
        sliderNav.removeClass();
        sliderNav.eq(slideM).addClass('current');
    }
    var checkTop = $('.wrapper').attr('id');
    if(checkTop == 'top'){
        var topSlideChange = function(){
            if(slideLength == 1){
                clearInterval(topSlideAnimation);
                return;
            }
            if(slideM < slideLength - 1){
                ++slideM
            }else{
                slideM = 0;
            }
            topSlideChangePart();
        }
    }
    function resetSlideTime(){
        clearInterval(topSlideAnimation);
        topSlideAnimation =  setInterval(topSlideChange, 3000);
    }
    topSlidePrevNext.click(function(){
        if($(this).hasClass('prev')){
            --slideM
            if(slideM < 0){
                slideM = slideLength - 1;
            }
        }else{
            ++slideM
            if(slideM > slideLength - 1){
                slideM = 0;
            }
        }
        resetSlideTime();
        topSlideChangePart();
    });
    sliderNav.click(function(){
        slideM = sliderNav.index(this);
        resetSlideTime();
        topSlideChangePart();
    })
    var topSlideAnimation =  setInterval(topSlideChange, 3000);

    var swipe = function ($elm) {
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.elementX = 0;
        this.elementY = 0;
        this.isInTouch = false;
        this.isInSwipe = false;
        var self = this;
        var getX, getY;
        $elm.css('position', 'relative');
        if ('ontouchstart' in window) {
            getX = function (e) {
                return e.originalEvent.changedTouches[0].pageX;
            };
            getY = function (e) {
                return e.originalEvent.changedTouches[0].pageY;
            };
        }

        $elm.on('touchstart mousedown', function (e) {
            clearInterval(topSlideAnimation);
            self.startX = self.currentX = getX(e);
            self.startY = self.currentY = getY(e);
            self.elementX = $elm.position().left;
            self.elementY = $elm.position().top;
            self.isInTouch = true;
        });

        var maxOffset = $(document).width();
        var offsetThreshold = 40;
        var oobThreshold = 20;
        var slideThreshold = maxOffset / 4.0;
        $elm.on('touchmove mousemove', function (e) {
            if (!self.isInTouch) return;
            self.currentX = getX(e);
            self.currentY = getY(e);
            var offsetX = self.currentX - self.startX;
            var offsetY = self.currentY - self.startY;
            if (offsetThreshold < Math.abs(offsetX)) {
                self.isInSwipe = true;
            }
            if (self.isInSwipe) {
                $elm.css({left: self.elementX + Math.min(Math.max(-maxOffset, offsetX), maxOffset)});
            } else if (oobThreshold < Math.abs(offsetY)) {
                self.isInTouch = false;
            }
        });

        $elm.on('touchend mouseup', function (e) {
            self.isInTouch = self.isInSwipe = false;
            var offsetX = self.currentX - self.startX;
            if (offsetX < -slideThreshold) {
                ++slideM;
            } else if (slideThreshold < offsetX) {
                --slideM;
            }
            topSlideChangePart();
            resetSlideTime();
        });
    };
    var topSliderSwipe = new swipe(topSlideUl);

  };
// TOP PAGE ANIMEIGO SCROLL
    var kanaM = 0;
    var kanaSetW = 230;
    var kanaUlW = kana.width();
    kanaPrevNext.click(function(){
        if($(this).hasClass('prev')){
            var sum = kanaM + kanaSetW;
            if(sum > 0){
                return false;
            }else{
                kana.stop().animate({marginLeft: sum}, 200);
                kanaM = sum;
            }
        }else{
            var sum = kanaM - kanaSetW;
            if(kanaUlW + sum - kanaSetW< 0){
                return false;
            }else{
                kana.stop().animate({marginLeft: sum}, 200);
                kanaM = sum;
            }
        }
        return false;
    })

// ITEM PAGE THUMBNAIL SLIDER
    var itemThumbSlideUl = $('#itemsingle .itemThumbnails #upperThumnbails ul');
    var itemThumbSlideLi = $('#itemsingle .itemThumbnails #upperThumnbails ul li');
    var default_slide_w = true;
    if(typeof(itemThumbSlideLi) != 'undefined'){
        if(getComputedStyle && typeof(itemThumbSlideLi.get(0)) != 'undefined' ){
            style = getComputedStyle(itemThumbSlideLi.get(0), '');
            if( typeof(style) != 'undefined' && typeof(style.getPropertyValue('width')) != 'undefined' ){
                var itwq = Math.ceil(parseFloat(style.getPropertyValue('width')));
                itemThumbSlideUl.css({width: (itwq * itemThumbSlideLi.length) + 'px'});
                default_slide_w = false;
            }
        }
        if(default_slide_w){
            itemThumbSlideUl.css({width: 100 * itemThumbSlideLi.length + '%'});
        }
    }

// ITEM PAGE CORD POPUP
    var itempopup = $('#itemsingle #popupCord');
    var itempopupB = $('#itemsingle .itemCord #opener');
    var itempopupcloseB = $('#itemsingle #popupCord > p .close');
    itempopupB.click(function(){
        itempopup.fadeIn(200);
        return false;
    })
    itempopupcloseB.click(function(){
        itempopup.fadeOut(200);
        return false;
    })
})
