/*
 * 头部
 * 
 * @author: Ricky
 */

es.Views.Head = Backbone.View.extend({
    el: "#Head",
    
    events: {
        
    },
    
    initialize: function() {
        this.render();
    },
    
    render: function() {
        this.$el.html($.Mustache.render("tpl-head", {
            userName: es.userName
        }));
    }
});
