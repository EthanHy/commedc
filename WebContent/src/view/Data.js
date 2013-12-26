/*
 * 数据管理
 * 
 * @author: Ricky
 */

es.Views.Data = Backbone.View.extend({
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
        es.widgets.nav.setActive("data");
    },
    
    render: function() {
        this.renderNav();
    }
});
