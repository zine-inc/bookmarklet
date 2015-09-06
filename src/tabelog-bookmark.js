/**
 * tabelog-bookmark.js
 * https://github.com/zine-inc/bookmarklet
 * (c) wata, MIT License.
 */

// Usage:
// 1. visit http://tabelog.com/bookmark/
// 2. run

// SEE ALSO:
// http://qiita.com/koyopro/items/d8b259f1eb75a01d3a0b

(function($) {
    'use strict';

    var defaults = {
        modal   : '#___modal',
        filename: 'tabelog_bookmark_' + formatDate(new Date(), 'YYYYMMDD')
    };

    var TabelogBookmark = function(opts) {
        this.opts = opts;
        this.currentPage = 1;
        this.bookmarks = [];
        this.$modal = undefined;
        this.nextUrl = undefined;
    };

    TabelogBookmark.prototype.export = function() {
        if (!window.confirm('食べログ「行った・行きたい」をエクスポートします')) return;
        var that = this;
        that.$modal = that.showModal();
        that.crawl();
    };

    TabelogBookmark.prototype.crawl = function() {
        var that = this;
        that.$modal.text('読み込み中... / ' + (that.currentPage) + 'ページ目');

        that.paging()
            .then(function($html) {
                that.nextUrl = that.getNextUrl($html);
                return that.load($html);
            })
            .done(function() {
                if (that.nextUrl) {
                    that.currentPage++;
                    that.crawl();
                } else {
                    alert('エクスポート完了: ' + that.bookmarks.length + '件\n\n続いてダウンロードされるCSVをGoogleマイマップからインポートしてください\nhttps://www.google.com/mymaps');
                    that.hideModal();
                };
            })
            .fail(function() {
                alert('読み込みに失敗しました :(');
                that.hideModal();
            });
    };

    TabelogBookmark.prototype.paging = function() {
        var that = this, d = $.Deferred();
        if (that.currentPage === 1) {
            d.resolve($('html'));
        } else {
            $.ajax({ url: that.nextUrl, dataType: 'html' })
                .done(function(data) { d.resolve($(data)); })
                .fail(function() { d.reject(); });
        }
        return d.promise();
    };

    TabelogBookmark.prototype.load = function($html) {
        var that = this, entries = that.getEntries($html);
        return $.when.apply($, entries.map(function(url) {
            return $.ajax({ url: url, dataType: 'html' })
                .done(function(data) { that.extract(url, $(data)); });
        }));
    };

    TabelogBookmark.prototype.extract = function(url, $html) {
        var that = this, bookmark = {};
        var h1 = $html.find('#headline h1').text().trim().split(' - ');
        bookmark.name = h1[0];
        bookmark.areaCategory = h1[1];
        bookmark.address = $html.find('#rstdata-wrap .address td > p').text().trim();
        bookmark.rating = $html.find('#rdhead-detail .score span').text().trim();
        bookmark.tel = $html.find('#visit-action-wrap .tel').text().trim();
        bookmark.url = url;
        that.bookmarks.push(bookmark);
        console.log(bookmark);
    };

    TabelogBookmark.prototype.getEntries = function($html) {
        var entries = [];
        $html.find('.js-bookmark').each(function() {
            var url = $(this).find('.js-rstname a').attr('href') ||
                $(this).find('.bm-rstname a').attr('href');
            entries.push(url);
        });
        return entries;
    };

    TabelogBookmark.prototype.getNextUrl = function($html) {
        var $next = $html.find('.page-move__target--next');
        return $next.length > 0 ? $next.attr('href') : false;
    };

    TabelogBookmark.prototype.showModal = function() {
        if ($(this.opts.modal).length === 0) {
            $('<div/>')
                .attr('id', this.opts.modal.replace('#', ''))
                .css({
                    position       : 'fixed',
                    left           : 0,
                    top            : 0,
                    width          : '100%',
                    height         : '100%',
                    zIndex         : 9999,
                    backgroundColor: 'rgba(0, 0, 0, .7)',
                    color          : '#fff',
                    fontSize       : 30,
                    textAlign      : 'center',
                    paddingTop     : '15em'
                })
                .appendTo('body');
        }
        return $(this.opts.modal);
    };

    TabelogBookmark.prototype.hideModal = function() {
        this.downloadCsv(this.createCsv(this.bookmarks));
        this.$modal.remove();
    };

    TabelogBookmark.prototype.createCsv = function(bookmarks) {
        return '"お店","エリア","住所","点数","TEL","URL"\n' +
            bookmarks.map(function(b) {
                return Object.keys(b).map(function(k) {
                    return '"' + b[k] + '"';
                }).join(',');
            }).join('\n');
    };

    TabelogBookmark.prototype.downloadCsv = function(csv) {
        var uri = 'data:text/csv,' + encodeURIComponent(csv),
            link = document.createElement('a');
        link.download = this.opts.filename;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function formatDate(date, format) {
        if (typeof date !== 'object') date = new Date(date);
        if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
        format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
        format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
        if (format.match(/S/g)) {
            var milliSeconds = ('00' + date.getMilliseconds()).slice(-3),
                length = format.match(/S/g).length;
            for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
        return format;
    };

    (new TabelogBookmark(defaults)).export();

})(artoo.$); // depending on artoo
