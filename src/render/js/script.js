(function($) {

    var Transformer = {};

    /**
     * Takes a given HTML `$content` and improves the markup of it by executing
     * the transformations.
     *
     * > See: [Transformer](#transformer)
     */
    Transformer.mangle = function($content) {
        this.addIDs($content);
        this.buttonize($content);
        //this.smartquotes($content);
    };

    /**
     * Adds IDs to headings.
     */

    Transformer.addIDs = function($content) {
        var slugs = ['', '', ''];
        $content.find('h1, h2, h3').each(function() {
            var $el = $(this);
            var num = parseInt(this.nodeName[1]);
            var text = $el.text();
            var slug = text; //Flatdoc.slugify(text);
            if (num > 1) slug = slugs[num - 2] + '-' + slug;
            slugs.length = num - 1;
            slugs = slugs.concat([slug, slug]);
            $el.attr('id', slug);
        });
    };

    /**
     * Returns menu data for a given HTML.
     *
     *     menu = Flatdoc.transformer.getMenu($content);
     *     menu == {
     *       level: 0,
     *       items: [{
     *         section: "Getting started",
     *         level: 1,
     *         items: [...]}, ...]}
     */

    Transformer.getMenu = function($content) {
        var root = { items: [], id: '', level: 0 };
        var cache = [root];

        function mkdir_p(level) {
            cache.length = level + 1;
            var obj = cache[level];
            if (!obj) {
                var parent = (level > 1) ? mkdir_p(level - 1) : root;
                obj = { items: [], level: level };
                cache = cache.concat([obj, obj]);
                parent.items.push(obj);
            }
            return obj;
        }

        $content.find('h1, h2, h3').each(function() {
            var $el = $(this);
            var level = +(this.nodeName.substr(1));

            var parent = mkdir_p(level - 1);

            var obj = { section: $el.text(), items: [], level: level, id: $el.attr('id') };
            parent.items.push(obj);
            cache[level] = obj;
        });

        return root;
    };

    /**
     * Changes "button >" text to buttons.
     */

    Transformer.buttonize = function($content) {
        $content.find('a').each(function() {
            var $a = $(this);

            var m = $a.text().match(/^(.*) >$/);
            if (m) $a.text(m[1]).addClass('button');
        });
    };

    var MenuView = function(menu) {
        var $el = $("<ul>");

        function process(node, $parent) {
            var id = node.id || 'root';

            var $li = $('<li>')
                .attr('id', id + '-item')
                .addClass('level-' + node.level)
                .appendTo($parent);

            if (node.section) {
                var $a = $('<a>')
                    .html(node.section)
                    .attr('id', id + '-link')
                    .attr('href', '#' + node.id)
                    .addClass('level-' + node.level)
                    .appendTo($li);
            }

            if (node.items.length > 0) {
                var $ul = $('<ul>')
                    .addClass('level-' + (node.level + 1))
                    .attr('id', id + '-list')
                    .appendTo($li);

                node.items.forEach(function(item) {
                    process(item, $ul);
                });
            }
        }

        process(menu, $el);
        return $el;
    };
    var $window = $(window);
    var $document = $(document);

    /*
     * Scrollspy.
     */

    $document.on('flatdoc:ready', function() {
        $("#docbody h1,#docbody h2,#docbody h3").scrollagent(function(cid, pid, currentElement, previousElement) {
            if (pid) {
                $("[href='#" + pid + "']").removeClass('active');
            }
            if (cid) {
                $("[href='#" + cid + "']").addClass('active');
            }
        });
    });

    /*
     * Anchor jump links.
     */

    $document.on('flatdoc:ready', function() {
        $('#toc a').anchorjump();
    });

    /*
     * Title card.
     */

    $(function() {
        var $card = $('.title-card');
        if (!$card.length) return;

        var $header = $('.header');
        var headerHeight = $header.length ? $header.outerHeight() : 0;

        $window
            .on('resize.title-card', function() {
                var windowWidth = $window.width();

                if (windowWidth < 480) {
                    $card.css('height', '');
                } else {
                    var height = $window.height();
                    $card.css('height', height - headerHeight);
                }
            })
            .trigger('resize.title-card');
    });
    /*
     * Sidebar stick.
     */
    $(document).ready(function() {
        $('#docbody').css('min-height', ($(window).height() - 51));
        var topHeight = $('.header').offset().top;
        // 滚动事件
        function scrollwindow() {
            if ($(window).scrollTop() > topHeight) {
                if ($('body').hasClass('fixed')) {
                    return;
                }
                $('body').addClass('fixed');
                $('body').removeClass('anima');
                var windowWidth = $window.width();
                var content_w = $('.content-root').width();
                if (windowWidth > 1160) {
                    $('body.fixed .menubar-right').css('left', content_w + 300 + 'px');
                } else {
                    $('body.fixed .menubar-right').css('left', content_w + 'px');
                }
            } else {
                $('body').removeClass('fixed');
                $('body').removeClass('anima');
                $('.menubar-right').css('left', 'inherit');
            }
        }
        // PC端滚动
        $(window).scroll(function(event) {
            scrollwindow();
        });
        // 移动端滚动
        $(document).bind("touchmove", function() {
            scrollwindow();
        });

        $('.sidebar-btn').click(function(event) {
            if ($(window).width() < 480) {
                $('.header .drop-menu').slideUp('fast');
            }
            if ($('.menubar-left').hasClass('menubar-o')) {
                $('.menubar-left').animate({
                    'left': '-300px'
                }, 'fast');
                $('.menubar-left').removeClass('menubar-o');
            } else {
                $('.menubar-left').animate({
                    'left': 0
                }, 'fast');
                $('.menubar-left').addClass('menubar-o');
            }
        });
        $('.header .navbar-btn').click(function(event) {
            $('.menubar-left').removeClass('menubar-o');
            $('.menubar-left').css('left', '-300px');
            $('.header .drop-menu').slideToggle('fast');
        });

        $('#docbody').find('h1, h2, h3').each(function(i, e) {
            $(this).attr('id', 'h-' + i);
        });

        hljs.configure({ useBR: false, tabReplace: '    ', languages: ['php', 'html', 'css', 'js', 'javascript', 'sql', 'sh'] });
        hljs.initHighlighting();

        var menu = Transformer.getMenu($('#docbody'));
        var menuhtml = MenuView(menu);
        $('#toc').html(menuhtml);
        $(document).trigger('flatdoc:ready');
    });

})(jQuery);
/*! jQuery.scrollagent (c) 2012, Rico Sta. Cruz. MIT License.
 *  https://github.com/rstacruz/jquery-stuff/tree/master/scrollagent */

// Call $(...).scrollagent() with a callback function.
//
// The callback will be called everytime the focus changes.
//
// Example:
//
//      $("h2").scrollagent(function(cid, pid, currentElement, previousElement) {
//        if (pid) {
//          $("[href='#"+pid+"']").removeClass('active');
//        }
//        if (cid) {
//          $("[href='#"+cid+"']").addClass('active');
//        }
//      });

(function($) {

    $.fn.scrollagent = function(options, callback) {
        // Account for $.scrollspy(function)
        if (typeof callback === 'undefined') {
            callback = options;
            options = {};
        }

        var $sections = $(this);
        var $parent = options.parent || $(window);

        // Find the top offsets of each section
        var offsets = [];
        $sections.each(function(i) {
            var offset = $(this).attr('data-anchor-offset') ?
                parseInt($(this).attr('data-anchor-offset'), 10) :
                (options.offset || 0);

            offsets.push({
                id: $(this).attr('id'),
                index: i,
                el: this,
                offset: offset
            });
        });

        // State
        var current = null;
        var height = null;
        var range = null;

        // Save the height. Do this only whenever the window is resized so we don't
        // recalculate often.
        $(window).on('resize', function() {
            height = $parent.height();
            range = $(document).height();
        });

        // Find the current active section every scroll tick.
        $parent.on('scroll', function() {
            var y = $parent.scrollTop();
            y += height * (0.3 + 0.7 * Math.pow(y / range, 2));

            var latest = null;

            for (var i in offsets) {
                if (offsets.hasOwnProperty(i)) {
                    var offset = offsets[i];
                    if ($(offset.el).offset().top + offset.offset < y) latest = offset;
                }
            }

            if (latest && (!current || (latest.index !== current.index))) {
                callback.call($sections,
                    latest ? latest.id : null,
                    current ? current.id : null,
                    latest ? latest.el : null,
                    current ? current.el : null);
                current = latest;
            }
        });

        $(window).trigger('resize');
        $parent.trigger('scroll');

        return this;
    };

})(jQuery);
/*! Anchorjump (c) 2012, Rico Sta. Cruz. MIT License.
 *   http://github.com/rstacruz/jquery-stuff/tree/master/anchorjump */

// Makes anchor jumps happen with smooth scrolling.
//
//    $("#menu a").anchorjump();
//    $("#menu a").anchorjump({ offset: -30 });
//
//    // Via delegate:
//    $("#menu").anchorjump({ for: 'a', offset: -30 });
//
// You may specify a parent. This makes it scroll down to the parent.
// Great for tabbed views.
//
//     $('#menu a').anchorjump({ parent: '.anchor' });
//
// You can jump to a given area.
//
//     $.anchorjump('#bank-deposit', options);

(function($) {
    var defaults = {
        'speed': 500,
        'offset': 0,
        'for': null,
        'parent': null
    };

    $.fn.anchorjump = function(options) {
        options = $.extend({}, defaults, options);

        if (options['for']) {
            this.on('click', options['for'], onClick);
        } else {
            this.on('click', onClick);
        }

        function onClick(e) {
            var $a = $(e.target).closest('a');
            if (e.ctrlKey || e.metaKey || e.altKey || $a.attr('target')) return;

            e.preventDefault();
            var href = $a.attr('href');

            $.anchorjump(href, options);
        }
    };

    // Jump to a given area.
    $.anchorjump = function(href, options) {
        options = $.extend({}, defaults, options);

        var top = 0;

        if (href != '#') {
            var $area = $(href);
            // Find the parent
            if (options.parent) {
                var $parent = $area.closest(options.parent);
                if ($parent.length) { $area = $parent; }
            }
            if (!$area.length) { return; }

            // Determine the pixel offset; use the default if not available
            var offset =
                $area.attr('data-anchor-offset') ?
                parseInt($area.attr('data-anchor-offset'), 10) :
                options.offset;

            top = Math.max(0, $area.offset().top + offset);
        }

        $('html, body').animate({ scrollTop: top }, options.speed);
        $('body').trigger('anchor', href);

        // Add the location hash via pushState.
        if (window.history.pushState) {
            window.history.pushState({ href: href }, "", href);
        }
    };
})(jQuery);