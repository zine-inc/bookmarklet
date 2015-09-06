/**
 * html-highlighter.js
 * https://github.com/zine-inc/bookmarklet
 * (c) wata, MIT License.
 */

(function() {
    [
        { color: '#F44336', selector: 'h1' },
        { color: '#E91E63', selector: 'h2' },
        { color: '#9C27B0', selector: 'h3' },
        { color: '#673AB7', selector: 'h4' },
        { color: '#3F51B5', selector: 'h5' },
        { color: '#2196F3', selector: 'h6' }
    ].map(function(obj) {
        var list = document.querySelectorAll(obj.selector);
        for (var i=0, len=list.length; i<len; ++i) {
            var h = list[i];
            h.style.backgroundColor = obj.color;

            var span = document.createElement('span');
            span.innerHTML = ' | ' + obj.selector;
            h.appendChild(span);
        }
    });
})();
