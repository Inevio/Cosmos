/*!
 * jQuery Textarea AutoSize plugin
 * Author: Javier Julio
 * Licensed under the MIT license
 */
var app = $( this );
var pluginName = "textareaAutoSize";
var pluginDataName = "plugin_" + pluginName;

var isMobile = function(){
  return app.hasClass( 'wz-mobile-view' );
}

var containsText = function (value) {
  return (value.replace(/\s/g, '').length > 0);
};

function Plugin(element, options) {
  this.element = element;
  this.$element = $(element);
  this.init();
}

Plugin.prototype = {
  init: function() {
    var diff = parseInt(this.$element.css('paddingBottom')) +
               parseInt(this.$element.css('paddingTop')) +
               parseInt(this.$element.css('borderTopWidth')) +
               parseInt(this.$element.css('borderBottomWidth')) || 0;

    if (containsText(this.element.value)) {
      this.$element.height(this.element.scrollHeight - diff);
    }

    // keyup is required for IE to properly reset height when deleting text
    this.$element.on('input keyup', function(event) {
      var $window = $(window);
      var currentScrollPosition = $window.scrollTop();

      $(this)
        .height(0)
        .height(this.scrollHeight - diff);

      $window.scrollTop(currentScrollPosition);
    });
  }
};

$.fn[pluginName] = function (options) {
  this.each(function() {
    if (!$.data(this, pluginDataName)) {
      $.data(this, pluginDataName, new Plugin(this, options));
    }
  });
  return this;
};

app.on( 'click' , '.comments-opener' , function(){
  if (isMobile()) {
    $( '.comment-input' ).textareaAutoSize();
  }else{
    $( this ).closest( '.card' ).find( '.comment-input' ).textareaAutoSize();
  }
});

app.on( 'click' , '.edit-button' , function(){

  var button = $( this );
  var comment = $( this ).parent();

  if ( button.hasClass( 'save' ) ) {
    comment.removeClass( 'editing' );
    comment.data( 'reply' ).setContent( comment.find( '.comment-text-edit' ).val() );
    button.removeClass( 'save' );
    button.text( lang.edit );
  }else{

    button.text( lang.save );
    button.addClass( 'save' );

    comment.addClass( 'editing' );
    comment.find( '.comment-text-edit' ).textareaAutoSize();
    var oldText = comment.find( '.comment-text' ).html();
    if ( oldText ) {
      comment.find( '.comment-text-edit' ).val( oldText.replace(  /<br\s*[\/]?>/gi , "\n" ) ).trigger('input');
    }
    comment.find( '.comment-text-edit' ).attr( 'placeholder' , lang.writeComment );

  }
});
