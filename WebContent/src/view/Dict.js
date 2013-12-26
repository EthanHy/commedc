/*
 * 数据字典
 * 
 * @author: Ricky
 */

es.Views.Dict = Backbone.View.extend({
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
        es.widgets.nav.setActive("dict");
    },
    
    render: function() {
        this.renderNav();
    }
});
