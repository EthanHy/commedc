/*
 * 图片上传
 * 
 * @author: Ricky
 */

es.Views.Upload = Backbone.View.extend({
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
        es.widgets.nav.setActive("upload");
    },
    
    render: function() {
        this.renderNav();
    }
});
