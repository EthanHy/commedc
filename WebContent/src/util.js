/*
 * 工具
 * 
 * @author: Ricky
 */

var util = {};

/*
 * 使IE6缓存背景
 */
util.enableBgCache = function(e) {
    if (T.ie == 6) {
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch(e) {}
    }
};

/*
 * 阻止默认
 * @param {Event} e 原生事件
 */
util.stopDefault = function(e) {
    var e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};

/*
 * 阻止冒泡
 * @param {Event} e 原生事件
 */
util.stopBubble = function(e) {
    var e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
};
