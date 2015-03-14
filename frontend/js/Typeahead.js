var _ = require('lodash');
var $ = require('jquery');
var React = require('react');
if (process.env.CLIENT) {
    var _jQuery = global.jQuery;
    global.jQuery = $;
    require('typeahead.js');
    global.jQuery = _jQuery;
}

function cachingSource(source, maxSize) {
    var cache = [];
    return function(q, cb) {
        for (var i = cache.length - 1; i >= 0; i--) {
            if (cache[i][0] === q) {
                cb(cache[i][1]);
                return;
            }
        }
        source(q, function(data) {
            cache.push([q, data]);
            if (cache.length >= maxSize) {
                cache.shift();
            }
            cb(data);
        });
    };
}

var searchSource = cachingSource(_.throttle(function (q, cb) {
    $.getJSON('/search/', {q: q}, cb);
}, 200), 20);

var templates = {
    suggestion: function(item) {
        return React.renderToStaticMarkup(<div>
            <span className="title">{item.title}</span>
            {' '}
            <span className="count">{item.n}명 기록</span>
        </div>);
    }
};

function init(node, viewOptions, sourceOptions) {
    return $(node).typeahead(viewOptions, sourceOptions);
}

function initSuggest(node) {
    return init(node, null, {
        source: cachingSource(_.throttle(function (q, cb) {
            $.getJSON('/search/suggest/', {q: q}, cb);
        }, 200), 20),
        displayKey: 'title',
        templates: templates
    });
}

module.exports = {
    init,
    initSuggest,
    searchSource,
    templates
};
