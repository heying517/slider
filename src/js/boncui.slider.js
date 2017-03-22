/**
 * Created by hy on 2016/10/11.
 * 滑动条插件
 */
;+function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define(["jquery"], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    'use strict';
    if (typeof $ === 'undefined') {
        throw new Error('BoncUI\'s JavaScript requires jQuery');
    }
    window.BoncUI = (window.BoncUI || function () {
    });

    function slider(dom, options) {
        this.content = $(dom);//需要出滑动条的内容
        this.contentSubject = null;//包裹this.content
        this.barWrap = null;//包裹this.contentSubject
        this.scrollBoxX = null;//水平滚动条容器
        this.scrollBarX = null;//水平滚动条
        this.scrollBoxY = null;//竖直滚动条容器
        this.scrollBarY = null;//竖直滚动条
        this.scaleX = 1;
        this.scaleY = 1;
        this.width = null;
        this.height = null;
        this.left = 0;
        this.top = 0;
        this.maxTop = 0;
        this.maxLeft = 0;
        this.settings = $.extend({
            width: '100%',
            height: '100%',
            scrollBoxYWidth: 8,
            scrollBoxXHeight: 8,
            scrollBoxColor: 'transparent',
            scrollBarColor: '#a3becc',
            gotoTop: '',
            gotoLeft: ''
        }, options);
        this.init();
    }

    slider.prototype = {
        constructor: slider,
        init: function () {
            this.barWrap = $('<div/>').css({
                'width': this.settings.width,
                'height': this.settings.height,
                'position': 'relative',
                'overflow': 'hidden'
            }).addClass('bonc-slider');
            this.contentSubject = $('<div/>').addClass('bonc-content-subject');
            this.content.before(this.barWrap.append(this.contentSubject)).appendTo(this.contentSubject);
            this.scrollBoxX = $('<div/>').addClass('bonc-scroll-box-x').css({
                'height':'0',
                backgroundColor: this.settings.scrollBoxColor
            }).appendTo(this.barWrap);
            this.scrollBarX = $('<div/>').addClass('bonc-scroll-bar-x').css({
                backgroundColor: this.settings.scrollBarColor
            }).appendTo(this.scrollBoxX);
            this.scrollBoxY = $('<div/>').addClass('bonc-scroll-box-y').css({
                'width':'0',
                backgroundColor: this.settings.scrollBoxColor
            }).appendTo(this.barWrap);
            this.scrollBarY = $('<div/>').addClass('bonc-scroll-bar-y').css({
                backgroundColor: this.settings.scrollBarColor
            }).appendTo(this.scrollBoxY);
            var self=this;
            this.content.mouseover(function(){
                self.scaleX = self.barWrap.innerWidth() / self.content.outerWidth(true);
                self.scaleY = self.barWrap.innerHeight() / self.content.outerHeight(true);
                if (self.scaleX >= 1) {
                    self.scaleX = 1;
                    self.scrollBoxX.css('height','0px');
                    self.width = null;
                    self.maxLeft = 0;
                    self.scrollBarX.css('width', self.width + 'px');
                }else{
                    self.scrollBoxX.css('height',self.settings.scrollBoxXHeight + 'px');
                    self.width = self.barWrap.innerWidth() * self.scaleX;
                    self.maxLeft = self.scrollBoxX.outerWidth(true) - self.width;
                    self.scrollBarX.css('width', self.width + 'px');
                    self.scrollIn(self.scrollBoxX);
                    self.clickBoxX();
                    self.eventBindX();
                    self.gotoZero(self.settings.gotoLeft, self.scrollBarX);
                }
                if (self.scaleY >= 1) {
                    self.scaleY = 1;
                    self.scrollBoxY.css('width', '0');
                    self.height = null;
                    self.maxTop = 0;
                    self.scrollBarY.css('height', self.height+'px');
                } else {
                    self.scrollBoxY.css('width',self.settings.scrollBoxYWidth + 'px');
                    self.height = self.barWrap.innerHeight() * self.scaleY;
                    self.maxTop = self.scrollBoxY.outerHeight(true) - self.height;
                    self.scrollBarY.css('height', self.height + 'px');
                    self.scrollIn(self.scrollBoxY);
                    self.clickBoxY();
                    self.eventBindY();
                    self.gotoZero(self.settings.gotoTop, self.scrollBarY);
                    self.goToAnchor();
                }
            });
            this.barWrap.bind('mousewheel', function () {
                self.wheelEvent();
            });
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                this.barWrap[0].addEventListener('DOMMouseScroll', function (event) {
                    self.wheelEvent(event);
                }, false);
            }
        },
        /**
         * 鼠标放进作用域出现滑动条，移开隐藏滑动条，鼠标不动过一点时间滑动条消失
         * @param elem 水平或竖直滚动条容器
         * */
        scrollIn: function (elem) {
            var imouse = 0;
            var timer;
            this.barWrap.hover(mouseIn, mouseOut);
            this.barWrap.mousemove(mouseMove);
            this.barWrap.bind('mousewheel', mouseMove);
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                this.barWrap[0].addEventListener('DOMMouseScroll', mouseMove, false);
            }
            function mouseIn() {
                timer = window.setInterval(foo, 1000);
            }

            function mouseOut() {
                elem.removeClass('bonc-scroll-fadein');
                window.clearInterval(timer);
            }

            function mouseMove() {
                imouse = 1;
                elem.addClass('bonc-scroll-fadein');
            }

            var foo = function () {
                if (imouse == 0) {
                    elem.removeClass('bonc-scroll-fadein');
                }
                imouse = 0;
            }

        },
        /**
         * 横向滑动条拖动
         * */
        eventBindX: function () {
            var self = this;
            this.scrollBarX.mousedown(function (event) {
                event = event || window.event;
                var orginX = event.clientX - $(this).position().left;
                $(document).mousemove(function (event) {
                    event = event || window.event;
                    window.event ? window.event.returnValue = false : event.preventDefault();
                    self.barWrap.addClass('bonc-no-select');
                    self.left = event.clientX - orginX;
                    self.left = Math.max(0, Math.min(self.maxLeft, self.left));
                    self.contenScrollX();
                });
                $(document).mouseup(function () {
                    self.barWrap.removeClass('bonc-no-select');
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                });
            });
        },
        /**
         * 纵向滑动条拖动
         * */
        eventBindY: function () {
            var self = this;
            this.scrollBarY.mousedown(function (event) {
                event = event || window.event;
                var orginY = event.clientY - $(this).position().top;
                $(document).mousemove(function (event) {
                    event = event || window.event;
                    window.event ? window.event.returnValue = false : event.preventDefault();
                    self.barWrap.addClass('bonc-no-select');
                    self.top = event.clientY - orginY;
                    self.top = Math.max(0, Math.min(self.maxTop, self.top));
                    self.contenScrollY();
                });
                $(document).mouseup(function () {
                    self.barWrap.removeClass('bonc-no-select');
                    $(document).unbind('mousemove');
                    $(document).unbind('mouseup');
                });
            });
        },
        /**
         * 点击包裹横向滑动条的box容器，滑动条滑到对应的位置
         * */
        clickBoxX: function () {
            var self = this;
            this.scrollBoxX.click(function (event) {
                event = event || window.event;
                var orginX = self.width;
                window.event ? window.event.returnValue = false : event.preventDefault();
                var target = event.srcElement || event.target;
                if (target == self.scrollBoxX[0]) {
                    self.left = event.offsetX - orginX / 2;
                    self.left = Math.max(0, Math.min(self.maxLeft, self.left));
                    self.contenScrollX();
                }
            });
        },
        /**
         * 点击包裹纵向滑动条的box容器，滑动条滑到对应的位置
         * */
        clickBoxY: function () {
            var self = this;
            this.scrollBoxY.click(function (event) {
                event = event || window.event;
                var orginY = self.height;
                window.event ? window.event.returnValue = false : event.preventDefault();
                var target = event.srcElement || event.target;
                if (target == self.scrollBoxY[0]) {
                    self.top = event.offsetY - orginY / 2;
                    self.top = Math.max(0, Math.min(self.maxTop, self.top));
                    self.contenScrollY();
                }
            });
        },
        /**
         * 回到顶部
         * @param elem 触发回到顶部事件的元素
         * @param scrollBar 横向或纵向滑动条
         * */
        gotoZero: function (elem, scrollBar) {
            var self = this;
            elem = $(elem);
            elem.click(function () {
                if (scrollBar === self.scrollBarX && self.left != 0) {
                    self.scrollBarX.animate({left: 0}, 1000);
                    self.contentSubject.animate({left: 0}, 1000);
                    self.left = 0;
                }
                if (scrollBar === self.scrollBarY && self.top != 0) {
                    self.scrollBarY.animate({top: 0}, 1000);
                    self.contentSubject.animate({top: 0}, 1000);
                    self.top = 0;
                }
            });
        },
        /**
         * 绑定锚点
         * */
        goToAnchor: function () {
            var self = this;
            var aname = [], ahref = [];
            var aList = $(document).find('a');
            $.each(aList, function (i, v) {
                if (typeof($(v).attr('name')) != 'undefined') {
                    aname.push($(v).attr('name'));
                }
            });
            $.each(aname, function (i, destination) {
                ahref.push($(document).find('a[href="#' + destination + '"]'))
            });
            $.each(ahref, function (i, anchor) {
                anchor.click(function () {
                    var href = anchor.attr('href').substr(1);
                    var elem = $('a[name="' + href + '"]') || $('#'+href);
                    self.top = self.getTop(elem).sum * self.scaleY;
                    self.getTop(elem).elemSubject.siblings('.bonc-scroll-box-y').children().css('top', self.top + 'px');
                    self.getTop(elem).elemSubject.css('top', -self.top / self.scaleY + 'px');
                });
            });
        },
        /**
         * 返回作用移动的元素（class为bonc-content-subject，包裹this.content）和要调整的距离
         * @param elem 跳转的相应位置的元素
         * @return sum 移动元素要调整的距离
         * @return elemSubject 移动元素（class为bonc-content-subject，包裹this.content）
         * */
        getTop: function (elem) {
            var anchorPos = elem.offset().top;
            while (elem.parent().attr('class') != 'bonc-content-subject') {
                elem = elem.parent();
            }
            var sum = anchorPos - elem.parent().offset().top;
            var elemSubject = elem.parent();
            return {
                sum: sum,
                elemSubject: elemSubject
            }
        },
        /**
         * 鼠标滚动垂直滑动条跟着移动的事件
         * */
        wheelEvent: function (event) {
            event = event || window.event;
            var self = this,
                wheel = event.wheelDelta || event.detail,
                isDown = true;
            window.event ? window.event.returnValue = false : event.preventDefault();
            event.wheelDelta ? (isDown = wheel < 0 ? true : false) : (isDown = wheel > 0 ? true : false);
            isDown ? self.top += 10 : self.top -= 10;
            self.contenScrollY();
        },
        /**
         * 水平滑动条移动距离，内容移动距离
         * */
        contenScrollX: function () {
            this.left = Math.max(0, Math.min(this.maxLeft, this.left));
            this.scrollBarX.css('left', this.left + 'px');
            this.contentSubject.css('left', -this.left / this.scaleX + 'px');
        },
        /**
         * 垂直滑动条移动距离，内容移动距离
         * */
        contenScrollY: function () {
            this.top = Math.max(0, Math.min(this.maxTop, this.top));
            this.scrollBarY.css('top', this.top + 'px');
            this.contentSubject.css('top', -this.top / this.scaleY + 'px');
        }
    };

    BoncUI.slider = function (dom, options) {
        if (dom.nodeType == 1) {
            return new slider(dom, options);
        } else {
            throw new Error(dom + '不是一个dom对象');
        }
    }
});