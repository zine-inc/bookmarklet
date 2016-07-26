/**
 * safe-search.js
 * https://github.com/zine-inc/bookmarklet
 * (c) wata, MIT License.
 */

(function($) {
    'use strict';

    var SafeSearch = function() {
        this.documents = document.body.innerText;
        this.start();
    };

    SafeSearch.prototype.start = function() {
        var that = this, req = that.fetchGoogleSpreadSheet();

        req.done(function(entries) {
            var list = entries.map(function(entry) {
                return entry['content']['$t'];
            });
            that.crawl(list);
        });
        req.fail(function() {
            alert('Oops :(');
        });
    };

    SafeSearch.prototype.crawl = function(blacklist) {
        var that = this, hits = blacklist.filter(function(word) {
            return that.documents.indexOf(word) !== -1;
        });

        alert(hits.length > 0 ? hits.join(', ') : 'OK!');
    };

    SafeSearch.prototype.fetchGoogleSpreadSheet = function() {
        var that = this, d = $.Deferred(), ajaxOpts = {
            url     : '//spreadsheets.google.com/feeds/cells/195SSJA5tG9VwDeq20uuzOb35txQbHdby8S9hT6yBhF0/od6/public/values?alt=json',
            cache   : false,
            dataType: 'json'
        };

        $.ajax(ajaxOpts)
            .done(function(data, status, xhr) {
                d.resolve(data['feed']['entry']);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                d.reject();
            });

        return d.promise();
    };

    new SafeSearch();

})(artoo.$); // depending on artoo
