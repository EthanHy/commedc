/*
 * 主程序
 * 
 * @author : Ricky
 */

$(document).ready(function() {
    //加载模版
    $.Mustache.load("../../asset/tpl/main.html").done(function() {
        //session信息
        es.userName = $("#UserName").val();
        es.userId = $("#UserId").val();
        
        es.init();
    });
});
