/*
 * 病例列表
 * 
 * @author: Ricky
 */

es.Views.List = Backbone.View.extend({
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
        es.widgets.nav.setActive("list");
    },
    
    render: function() {
        this.renderNav();
    }
});
