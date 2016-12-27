
// Constants
var TYPES = {

  'application/pdf'    : 'document',
  'audio/mp4'          : 'music',
  'audio/mpeg'         : 'music',
  'audio/flac'         : 'music',
  'audio/x-vorbis+ogg' : 'music',
  'audio/x-wav'        : 'music',
  'image/gif'          : 'image',
  'image/jpeg'         : 'image',
  'image/png'          : 'image',
  'image/tiff'         : 'image',
  'video/3gpp'         : 'video',
  'video/mp4'          : 'video',
  'video/quicktime'    : 'video',
  'video/webm'         : 'video',
  'video/x-flv'        : 'video',
  'video/x-matroska'   : 'video',
  'video/x-ms-asf'     : 'video',
  'video/x-ms-wmv'     : 'video',
  'video/x-msvideo'    : 'video',
  'video/x-theora+ogg' : 'video'

}

// Variables
var app = $(this);
var automaticPopupQueue = null

// DOM Variables
var closeNewCard        = $('.close-new-card');
var attachNewPostButton = $('.new-card-section .attachments');
var cancelNewCard       = $('.cancel-new-card');
var postNewCardButton   = $('.post-new-card');
var attachmentPrototype = $('.attachment.wz-prototype');

// Functions
/*
var startManualPost = function(){

  $( '.new-card-section .attachments' ).data( 'numAttachs', 0 );
  $( '.new-card-section .attachments' ).removeClass( 'with-attach' );
  $( '.new-card-input' ).focus()

}

var startPopupPost = function(){

  $('.new-card-section .attachments').data( 'withAttach', true );
  addAttachment( params.fsnode );
  $( '.new-card-section .attachments' ).addClass( 'with-attach' );
  $( '.new-card-input' ).focus()

}
*/

var addAttachment = function( attach ){

  var attachment = attachmentPrototype.clone()

  attachment.removeClass('wz-prototype')
  attachment.find('.title').text( attach.fsnode ? attach.fsnode.name : attach.name )

  if( typeof attach.id !== 'undefined' ){
    attachment.addClass( 'attachment-' + attach.id )
  }

  if( attach.fsnode && attach.fsnode.id ){
    attachment.addClass( 'attachment-fsnode-' + attach.fsnode.id )
  }

  if( !attach.uploaded ){

    attachment.addClass('from-pc')
    attachment.find('.aux-title').show().text( lang.uploading )
    //$('.new-card-section').addClass('uploading')

  }else{
    attachment.find('.icon').css( 'background-image', 'url(' + attach.fsnode.icons.micro + ')' );
  }

  attachmentPrototype.after( attachment );
  attachment.data( 'attachment', attach );

}

var attachFromInevio = function(){

  hideAttachSelect()

  // To Do -> Translate
  api.fs.selectSource( { 'title' : 'Selecciona!', 'mode' : 'file', 'multiple': true }, function( err, list ){

    if( err ){
      return console.log( err )
    }

    /*
    var numAttachs = $( '.new-card-section .attachments' ).data( 'numAttachs' );
    if ( !numAttachs ) {
      numAttachs = 0;
    }

    if ( s.constructor === Array ) {
      numAttachs += s.length;
    }else{
      numAttachs++;
    }
    */

    /*
    console.log( numAttachs, s );
    $( '.new-card-section .attachments' ).data( 'withAttach', true );
    */

    list.forEach(function( fsnodeId ){

      api.fs( fsnodeId, function( err, fsnode ){

        if( err ) {
          return console.log( err )
        }

        addAttachment( { fsnode : fsnode, uploaded : fsnode.fileId !== 'TO_UPDATE' } )

      })

    })

    /*
    if ( numAttachs > 0) {
      $( '.new-card-section .attachments' ).addClass( 'with-attach' );
    }
    */

  })

}

var postNewCardAsync = function(){

  var text  = $( '.new-card-textarea' ).val();
  var title = $( '.new-card-input' ).val();

  if ( title === '' ) {
    return alert( lang.noInfo );
  }

  var attachments = $('.attach-list .attachment').not('.wz-prototype');

  var addPost = function( o ){

    console.log( o )

    var attachment = [];

    $.each( o.fsnode, function(){
      attachment.push( $( this ).data('attachment').fsnode.id )
    })

    console.log( attachment )

    if ( o.linkType ) {

      var res = { content: text, title: title, metadata: { linkType : o.linkType } }
      params.world.addPost( { content: text, title: title, metadata: { linkType : o.linkType } }, function( e, o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        wz.app.removeView( app );

      });

    }else if( o.fileType ){

      var res = { content: text, title: title, fsnode: attachment, metadata: { fileType : o.fileType } }
      params.world.addPost( { content: text, title: title, fsnode: attachment, metadata: { fileType : o.fileType } }, function( e, o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        //$( '.new-card-section .attachments' ).data( 'withAttach', '' );
        wz.app.removeView( app );

      });

    }else{

      var res = { content: text, title: title }
      params.world.addPost( { content: text, title: title }, function( e, o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        wz.app.removeView( app );

      });

    }

  }

  if( attachments.length ){

    if( attachments.length === 1 ){
      addPost( { fsnode : attachments, fileType: guessType( attachments.data('attachment').fsnode.mime ), multifile: false } )
    }else{
      addPost( { fsnode : attachments, fileType : 'generic', multifile : true } );
    }

  }else if( text.indexOf( 'www.youtube' ) !== -1 ){
    addPost( { fsnode : null, linkType : 'youtube', multifile : false } );

  }else{
    addPost( { fsnode : null, multifile : false } );
  }

}

var guessType = function( mime ){
  return TYPES[ mime ] || 'generic';
}

var hideAttachSelect = function(){
  $('.attach-select').removeClass('popup')
}

var removeAttachment = function( options ){

  if( automaticPopupQueue ){
    return
  }

  var attachments;
  if ( options.selection === 'all' ) {
    attachments = $('.attachment.from-pc');
  }else{
    attachments = $('.attachment-' + options.selection + '.from-pc');
  }


  $.each( attachments, function(){

    var fsnode = $(this).data( 'attachment' ).fsnode;

    if( fsnode ){

      fsnode.remove( function( err ){

        if( err ){
          console.log( err );
        }

      })

    }

  });

}

var showAttachSelect = function(){
  $('.attach-select').addClass('popup')
}

var start = function(){

  if( !params || !params.type ){
    return warn('NO_PARAMS_NEW_POST');
  }

  // Set popup private info
  automaticPopupQueue = params.queue

  // Set popup texts and info
  $('.new-card-avatar').css( 'background-image', 'url(' + api.system.user().avatar.tiny + ')' )
  translateUI()

  // Add files if any
  if( params.fsnode ){
    addAttachment({ fsnode : params.fsnode, uploaded : params.fsnode.fileId !== 'TO_UPDATE' });
  }

  // Focus title
  $( '.new-card-input' ).focus()

}

var translateUI = function(){

  $( '.new-card-title' ).html( '<i class="wz-dragger">' + lang.newPost + '</i>' + lang.for + '<figure class="wz-dragger ellipsis">' + params.world.name + '</figure>' );
  $( '.cancel-new-card span' ).text( lang.cancel );
  $( '.post-new-card span' ).text( lang.postit );
  $( '.attach-select .inevio span' ).text( lang.uploadInevio );
  $( '.attach-select .pc span' ).text( lang.uploadPC );
  $( '.new-card-input' ).attr( 'placeholder', lang.writeTitle );
  $( '.new-card-textarea' ).attr( 'placeholder', lang.writeDescription );

}

// API Events
api.upload.on( 'fsnodeProgress', function( fsnode, percent ){
  //console.log( arguments );
});

api.upload.on( 'fsnodeEnd', function( fsnode, fileId ){

  var attachment = $( '.attachment-' + fileId + ', .attachment-fsnode-' + fsnode.id )

  if( attachment.length ){

    attachment.find('.title').text( fsnode.name )
    attachment.find('.icon').css( 'background-image', 'url(' + fsnode.icons.micro + ')' );
    attachment.find('.aux-title').hide();
    attachment.addClass('from-pc').addClass( 'attachment-' + fileId ).addClass( 'attachment-fsnode-' + fsnode.id );
    //attachment.data( 'fsnode', fsnode );
    //$('.new-card-section').removeClass( 'uploading' );

  }

});

// DOM Events
closeNewCard.add( cancelNewCard ).on( 'click', function(){

  removeAttachment( { selection: 'all' } )

  if ( !$('.new-card-section').hasClass('uploading') ) {
    wz.app.removeView( app )
  }

})

postNewCardButton.on( 'click', function(){

  if ( !$('.new-card-section').hasClass('uploading') ) {
    postNewCardAsync();
  }

});

attachNewPostButton.on( 'click', function(){
  showAttachSelect()
});

app
.on( 'click', function( e ){

  if( !$( e.target ).hasClass('popup') && !$( e.target ).hasClass('popup-launcher') ){
    hideAttachSelect()
  }

})
.on( 'click', '.attach-select .inevio', attachFromInevio )
.on( 'upload-prepared', function( e, uploader ){

  hideAttachSelect()
  //$( '.new-card-section .attachments' ).data( 'withAttach', true )

  uploader( params.world.volume, function( e, uploadQueueItem ){
    addAttachment( uploadQueueItem )
  })

})
.on( 'click', '.cancel-attachment', function(){

  var attachment = $(this).closest('.attachment')
  removeAttachment( { selection: attachment.data( 'attachment' ).fsnode.id } )
  attachment.remove();

  if ($('.attachment:not(.wz-prototype)').length === 0) {
    attachNewPostButton.removeClass('with-attach');
  }

})

.on( 'requestPostCreate', function( e, newParams, callback ){

  if( automaticPopupQueue === newParams.queue ){
    addAttachment( { fsnode : newParams.fsnode, uploaded : newParams.fsnode.fileId === 'TO_UPDATE' })
    callback( true )
  }else if( newParams.queue ){
    callback( $( '.attachment-' + newParams.queue.fsnode[ newParams.fsnode.id ].id + ', .attachment-fsnode-' + newParams.fsnode.id ).length )
  }else{
    callback( $( '.attachment-fsnode-' + newParams.fsnode.id ).length )
  }

})

// Start
start();
