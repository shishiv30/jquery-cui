import _ from 'lodash';
import _trigger from '../core/_trigger';
export default {
    name: 'view',
    defaultOpt: {
        direction: 'x',
        limitation: 0.5,
        onovertop: 'onovertop',
        onoverbottom: 'onoverbottom',
        onoverleft: 'onoverleft',
        onoverright: 'onoverright',
        onpushtop: 'onpushtop',
        onpushbottom: 'onpushbottom',
        onpushleft: 'onpushleft',
        onpushright: 'onpushright',
        onchange: 'onchange',
        oninital: 'oninital',
        scrollable: true,
        snapable: true,
        jumpback: true,
        vitualized: false,
        index: 0,
    },
    init: function ($this, opt, exportObj) {
        var $wrapper = $this.children('ul');
        var $slides = $wrapper.children('li');
        var prePos = 0;
        var currPos = 0;
        var info = null;
        var isAnimating = false;
        var animateTime = 0.2;
        var slidesInfo = [];
        var _updateInfo = exportObj.updateInfo = function () {
            var outerHeight = $this.outerHeight();
            var outerWidth = $this.outerWidth();
            var max = opt.direction === 'x' ? $wrapper.outerWidth() - outerWidth : $wrapper.outerHeight() - outerHeight;
            var limitation = (opt.direction === 'x' ? outerWidth : outerHeight) * opt.limitation;
            info = {
                max: max,
                swidth: $slides.outerWidth(),
                sheight: $slides.outerHeight(),
                cWidth: outerWidth,
                cHeight: outerHeight,
                maxLimit: limitation,
                minLimit: (limitation * -1) - max,
                scroll: [0, 0],
            };
            if (opt.direction === 'x') {
                info.scroll = [prePos * -1, 0];
                info.index = Math.round(prePos * -1 / info.swidth);
            } else {
                info.index = Math.round(prePos * -1 / info.sheight);
            }
        };
        //todo here
        var _updateIndex = exportObj.updateIndex = function(){
            slidesInfo = $slides.map(function(index,item){
                return {
                    index:index,
                    item:{
                        
                    }
                }
            });
        }
        var dfd;
        var _scroll = exportObj.scroll = function (distance, animation) {
            dfd = $.Deferred();
            if (isAnimating) {
                dfd.reject();
                return dfd;
            }
            var animateFrame = opt.direction === 'x' ? {
                transform: 'translateX(' + distance + 'px)'
            } : {
                transform: 'translateY(' + distance + 'px)'
            };
            if (animation) {
                isAnimating = true;
                $wrapper.addClass('animating');
                $wrapper.css(animateFrame);
                setTimeout(function () {
                    isAnimating = false;
                    $wrapper.removeClass('animating');
                    dfd && dfd.resolve();
                }, 210);
            } else {
                $wrapper.css(animateFrame);
                dfd.resolve();
            }
            return dfd;
        };
        exportObj.geInfo = function () {
            return info;
        };
        var _go = function(index){
            opt
        }
        var _next = function() {
            if(opt.index < (opt.length-1){
                _go(opt.index+1);
            }
        }
        var _prev = function() {
            if(opt.index > 0){
                _go(opt.index-1);
            }
        }
        var _onMoving = function (moved) {
            var eventName = '';
            if (currPos > 0) {
                if (moved) {
                    eventName = opt.direction === 'x' ? opt.onpushleft : opt.onpushtop;
                } else {
                    eventName = opt.direction === 'x' ? opt.onoverleft : opt.onovertop;
                }
                if (_.isFunction(eventName)) {
                    eventName(currPos, prePos, info);
                } else if (eventName) {
                    $(document).trigger(eventName, [currPos, prePos, info]);
                }
                return true;
            } else if (Math.abs(currPos) > info.max) {
                if (moved) {
                    eventName = opt.direction === 'x' ? opt.onpushright : opt.onpushbottom;
                } else {
                    eventName = opt.direction === 'x' ? opt.onoverright : opt.onoverbottom;
                }
                if (_.isFunction(eventName)) {
                    eventName(currPos, prePos, info);
                } else if (eventName) {
                    $(document).trigger(eventName, [currPos, prePos, info]);
                }
                return true;
            }
            return false;
        };
        var _scrollWithInertia = function (distance, time) {
            var inertia = distance / (time / 1000) * animateTime;
            if (Math.abs(inertia) > 50) {
                currPos -= inertia;
            }
        };
        var _limitation = function (direction) {
            if ('left' === direction || 'up' === direction) {
                currPos = Math.min(currPos, info.maxLimit);
            } else {
                currPos = Math.max(currPos, info.minLimit);
            }
        };
        var _moving = function (direction, distance, isRelativeValue) {
            $wrapper.addClass('dragging');
            if (isRelativeValue) {
                currPos = currPos - distance;
            } else {
                currPos = prePos - distance;
            }
            _limitation(direction);
            _scroll(currPos, false).then(_.throttle(function () {
                _onMoving(false);
            }, 200));
        };
        var _moved = function (direction, distance, time) {
            $wrapper.removeClass('dragging');
            var origin = currPos;
            var width = info.swidth;
            var height = info.sheight;
            if (opt.snapable) {
                if (time) {
                    _scrollWithInertia(distance, time);

                    if (Math.abs(distance) / time > 0.1) {
                        if (opt.direction === 'x') {
                            offset = currPos % width;
                            currPos = direction === 'left' ? currPos - (width + offset) : currPos - offset;
                        } else {
                            offset = currPos % height;
                            currPos = direction === 'up' ? currPos - offset : currPos - (height + offset);
                        }
                    } else {
                        var offset;
                        if (opt.direction === 'x') {
                            offset = currPos % width;
                            currPos = Math.abs(offset) > width / 2 ? currPos - (width + offset) : currPos - offset;
                        } else {
                            offset = currPos % height;
                            currPos = Math.abs(offset) > height / 2 ? currPos - (height + offset) : currPos - offset;
                        }
                    }
                } else {
                    if (opt.direction === 'x') {
                        offset = currPos % width;
                        currPos = direction === 'left' ? currPos - (width + offset) : currPos - offset;
                    } else {
                        offset = currPos % height;
                        currPos = direction === 'up' ? currPos - offset : currPos - (height + offset);
                    }
                }
            }

            _limitation(direction);
            if (_onMoving(true)) {
                if (opt.jumpback) {
                    if (currPos >= 0 || info.max <= 0) {
                        currPos = 0;
                    } else if ((info.max + currPos) <= 0) {
                        currPos = info.max * -1;
                    }
                }
            }
            if (currPos !== origin) {
                _scroll(currPos, true).then(function () {
                    prePos = currPos;
                    _updateInfo();
                    opt.onchange && _trigger(opt.onchange,$this, opt, exportObj, currPos, prePos, info);
                }).always(function () {
                    $(document).trigger('dom.scroll');
                });
            } else {
                $(document).trigger('dom.scroll');
            }
        };
        $this.on('drag', function () {
            info || _updateInfo();
        });
        var wheeling = null;
        $this.on('mousewheel', function (event) {
            //donot support
            event.preventDefault();
            var delta = opt.direction === 'x' ? event.deltaX : event.deltaY;
            if (delta === undefined) {
                $this.off('mousewheel');
                return;
            }

            var distance = null;
            var direction = null;
            // Webkit
            if (opt.direction === 'x') {
                distance = info.swidth * event.deltaX / 120;
                direction = distance < 0 ? 'left' : 'right';
            } else {
                distance = info.sheight * event.deltaY / 120 * -1;
                direction = distance < 0 ? 'up' : 'down';
            }
            _moving(direction, distance, true);
            if (currPos > info.minLimit && currPos < info.maxLimit) {
                wheeling && clearTimeout(wheeling);
                wheeling = setTimeout(function () {
                    _moved(direction, distance, null);
                }, 1000);
            }
            return false;
        });
        $this.on('dragging', function (e, dir, dist) {

            var distance = opt.direction === 'x' ? dist[0] : dist[1];
            var direction = opt.direction === 'x' ? dir[0] : dir[1];
            _moving(direction, distance, false);
        });
        $this.on('dragged', function (e, dir, dist, time) {
            var distance = opt.direction === 'x' ? dist[0] : dist[1];
            var direction = opt.direction === 'x' ? dir[0] : dir[1];
            _moved(direction, distance, time);
        });
        $(document).on('dom.resize', _updateInfo);
        _updateInfo();
        opt.oninital && _trigger(opt.oninital,$this, opt, exportObj, [info]);
    },
    setOptionsBefore: null,
    setOptionsAfter: null,
    initBefore: null,
    initAfter: null,
    destroyBefore: null
};
// $.cui.plugin(viewConfig);
// $(document).on('dom.load.view', function () {
//     $('[data-view]').each(function (index, item) {
//         var $this = $(item);
//         var data = $this.data();
//         $this.removeAttr('data-view');
//         $this.attr('data-view-load', '');
//         $this.view(data);
//     });
// });
