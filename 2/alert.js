
String.prototype.jstpl_format = function (ns) {
    function fn(w, g) {
        if (g in ns) {
            return ns[g];
        } else {
            return '';
        }
    };
    return this.replace(/%\(([A-Za-z0-9_|.]+)\)/g, fn);
};


var config = {
    tpl: {
        _alerttpl: [
            '<div id="js_mod_dialog" class="mod-popup %(popupClass)">',
            '  <div class="popup-body">',
            '    <h3 class="popup-title">%(title)</h3>',
            '    <div class="popup-cont">%(message)</div>',
            '    <div class="popup-btn">%(btnhtml)</div>',
            '  </div>',
            '</div>',
        ].join('')
    }
};

function close() {
    var d = document.getElementById('js_mod_dialog');
    if (d) {
        document.body.removeChild(d);
        d = null;
    }
};

function makePopupType(opt) {
    var type = 'single-btn-popup';
    if (opt && opt.btn && typeof opt.btn !== 'string' && opt.btn.length > 1 && typeof opt.btn.push ===
        'function') {
        type = 'double-btn-popup';
    }
    return type;
}

var g_js_dialogCb = null;
var g_js_cancel_dialogCb = null;
window.g_js_dialog = function (type) {
    close();
    if (typeof g_js_dialogCb === 'function') {
        g_js_dialogCb(type);
    }
};
window.g_js_cancel_dialog = function (type) {
    close();
    if (typeof g_js_cancel_dialogCb === 'function') {
        g_js_cancel_dialogCb(type);
    }
};

function confirm(p) {
    close();
    g_js_dialogCb = null;
    g_js_cancel_dialogCb = null;
    var opt = {
        title: '温馨提示',
        message: '',
        btn: ['取消', '确定'],
        cb: null,
        cancelCb: null,
        href: ''
    };

    if (typeof p === 'string') {
        opt.message = p;
    } else if (typeof p === 'object') {
        opt = $.extend(opt, p);
    } else {
        return;
    }

    opt.btnhtml = '<a class="js_global_dialog_cancel_btn" href="javascript:;"><span>' + opt.btn[0] +
        '</span></a>';
    opt.btnhtml += '<a class="' + (opt.href ? '' : 'js_global_dialog_submit_btn') + '" href="' + (opt.href ?
        opt.href : 'javascript:;') + '" data-value="1"><span>' + (opt.btn[1]) + '</span></a>';

    opt.popupClass = makePopupType(opt);
    var html = config.tpl._alerttpl.jstpl_format(opt);
    g_js_dialogCb = opt.cb;
    g_js_cancel_dialogCb = opt.cancelCb;

    setTimeout(function () {
        document.body.insertAdjacentHTML("beforeEnd", html);
    }, 200);
};

function alert(p) {

    close();
    g_js_dialogCb = null;

    var opt = {
        title: '温馨提示',
        message: '',
        btn: '知道了',
        cb: null
    };

    if (typeof p === 'string') {
        opt.message = p;
    } else if (typeof p === 'object') {
        opt = $.extend(opt, p);
    } else {
        opt.message = typeof p;
        if (opt.message === 'boolean') {
            if (p) {
                opt.message = 'true';
            } else {
                opt.message = 'false';
            }
        }
    }

    opt.btnhtml = '<a class="js_global_dialog_submit_btn" href="javascript:;" data-value="0"><span>' + (opt.btn) +
        '</span></a>';

    opt.popupClass = makePopupType(opt);
    var html = config.tpl._alerttpl.jstpl_format(opt);
    g_js_dialogCb = opt.cb;
    setTimeout(function () {
        document.body.insertAdjacentHTML("beforeEnd", html);
    }, 200);
};


$(function () {

    $(document.body).on('click', '.js_global_dialog_cancel_btn', function (event) {
        event.preventDefault();
        g_js_cancel_dialog(0);
        return false;
    });

    $(document.body).on('click', '.js_global_dialog_submit_btn', function (event) {
        event.preventDefault();
        var $this = $(this);
        var value = parseInt($this.attr('data-value'));
        g_js_dialog(value);
        return false;
    });


});