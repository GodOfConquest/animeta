module.exports.keyComparator = function(keyFunc) {
    return (a, b) => {
        a = keyFunc(a);
        b = keyFunc(b);
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    };
};

var zerofill = module.exports.zerofill = function(n) {
    n = String(n);
    if (n.length === 1)
        n = '0' + n;
    return n;
};

module.exports.getTime = function(date) {
    return zerofill(date.getHours()) + ':' + zerofill(date.getMinutes());
};

var HOURS = [];
(function() {
    for (var h = 0; h < 24; h++) {
        var result;
        if (h < 12)
            result = '오전 ' + h + '시';
        else if (h === 12)
            result = '정오';
        else
            result = '오후 ' + (h - 12) + '시';
        HOURS[h] = result;
    }
})();

module.exports.formatTime = function(value) {
    var result = HOURS[value.getHours()];
    var m = value.getMinutes();
    if (m > 0) {
        result += ' ' + zerofill(m) + '분';
    }
    return result;
};

module.exports.debounce = function(fn, t) {
    var timer;
    return function() {
        var self = this;
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
            fn.call(self);
            timer = null;
        }, t);
    };
};

module.exports.plusOne = function(val) {
    var matches = val.match(/(\d+)[^\d]*$/);
    if (!matches)
        return val;
    var add1 = (parseInt(matches[1], 10) + 1).toString();
    var digits = matches[1].length;
    if (add1.length < digits)
        for (var i = 0; i < digits - add1.length; i++)
            add1 = '0' + add1;
    return val.replace(/(\d+)([^\d]*)$/, add1 + '$2');
};

function getStatusDisplay(record) {
    return record.status.trim().replace(/([0-9]+)$/, '$1화');
}

exports.getStatusDisplay = getStatusDisplay;

exports.STATUS_TYPE_TEXT = {
    watching: '보는 중',
    finished: '완료',
    interested: '볼 예정',
    suspended: '중단'
};

exports.getStatusText = function(record) {
    var status = getStatusDisplay(record);
    if (record.status_type !== 'watching' || status === '') {
        var statusTypeText = exports.STATUS_TYPE_TEXT[record.status_type];
        if (status !== '') {
            status += ' (' + statusTypeText + ')';
        } else {
            status = statusTypeText;
        }
    }
    return status;
};

exports.getWorkURL = function(title) {
    return '/works/' + encodeURIComponent(title) + '/';
};

exports.getPostURL = function(post) {
    return '/-' + post.id;
};

exports.getPostDeleteURL = function(user, post) {
    return '/users/' + user.name + '/history/' + post.id + '/delete/';
};

exports.SOURCE_TYPE_MAP = {
    'manga': '만화 원작',
    'original': '오리지널 작품',
    'lightnovel': '라노베 원작',
    'game': '게임 원작',
    '4koma': '4컷 만화 원작',
    'visualnovel': '비주얼 노벨 원작',
    'novel': '소설 원작'
};
