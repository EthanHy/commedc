/*
 * 账户管理
 * 
 * @author: Ricky
 */

es.Views.Account = Backbone.View.extend({
    el: "#Main",
    
    events: {
        
    },
    
    initialize: function() {
        
    },
    
    destroy: function() {
        this.model.unbind();
        this.$el.unbind();
        this.$el.empty();
    },
    
    renderNav: function() {
        es.widgets.nav.setActive("account");
    },
    
    render: function() {
        this.renderNav();
    }
});
