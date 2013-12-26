/*
 * 全局统计
 * 
 * @author: Ricky
 */

es.Views.Stat = Backbone.View.extend({
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
        es.widgets.nav.setActive("stat");
    },
    
    render: function() {
        this.renderNav();
    }
});
