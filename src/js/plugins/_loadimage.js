var loadImg = function ($img) {
    var imgsrc = $img.data('img');
    if (!imgsrc) {
        return;
    } else {
        $img.removeAttr('data-img');
        $img.data('img', null);
    }
    if ($img.is('img')) {
        $img.one('load', function () {
            $img.off('error');
            $img.addClass('data-img-load-success');
            $(document).trigger('img.load.success', [$img]);
        });
        $img.one('error', function () {
            $img.off('load');
            $img.attr('src', 'data:image/gif;base64,R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==');
            $img.addClass('data-img-load-error');
            $(document).trigger('img.load.error', [$img]);
        });
        $img.attr('src', imgsrc);
    } else {
        $img.css({
            backgroundImage: 'url(' + imgsrc + ')'
        });
        $img.addClass('data-img-load-success');
        $(document).trigger('img.load.success', [$img]);
    }
    $img.attr('data-img-load', '');
}
export default {
    name: 'loadimage',
    defaultOpt: {
        buffer: 0,
        delay: 100
    },
    init: function ($this, opt, exportObj) {
        var $window = $(window);
        var _load = exportObj._load = function () {
            var height = $window.outerHeight();
            var top = $window.scrollTop() - height * opt.buffer;
            var bottom = top + height * (1 + opt.buffer);
            var width = $window.outerWidth();
            var left = $window.scrollLeft() - width * opt.buffer;
            var right = left + width * (1 + opt.buffer);
            $this.find('[data-img]').each(function (index, item) {
                var $img = $(item);
                var offset = $img.offset();
                var baseY = offset.top;
                var baseX = offset.left;
                if (baseY < bottom && (baseY + $img.height()) > top && baseX < right && (baseX + $img.width()) > left && !$img.is(':hidden')) {
                    loadImg($img);
                } 
            });
        };
        $(document).on('dom.load.image dom.resize.image', _load);
        $this.is('body') ? $(document).on('dom.scroll.image', _load) : $this.on('scroll', $.throttle(_load, opt.delay));
    },
    setOptionsBefore: null,
    setOptionsAfter: null,
    initBefore: null,
    initAfter: null,
    destroyBefore: null
};