
// Constants
var OPERATION_SAMPLE_RANGE = 10000
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
var app = $(document.body);
var automaticPopupQueue = null
var lastOperationSample = Date.now()

// DOM Variables
var closeNewCard        = $('.mobile-new-post .close-new-card');
var attachNewPostButton = $('.mobile-new-post .attachments');
var cancelNewCard       = $('.mobile-new-post .cancel-new-card');
var attachmentPrototype = $('.mobile-new-post .attachment.wz-prototype');
var myContactID         = api.system.workspace().idWorkspace;

// Functions
var addAttachment = function( attach, useItem ){

  var attachment = useItem || attachmentPrototype.clone()

  attachment.removeClass('wz-prototype')
  attachment.find('.title').text( attach.fsnode ? attach.fsnode.name : attach.name )

  if( typeof attach.id !== 'undefined' ){
    attachment.addClass( 'attachment-' + attach.id )
  }

  if( attach.fsnode && attach.fsnode.id ){
    attachment.addClass( 'attachment-fsnode-' + attach.fsnode.id )
  }

  if( !attach.uploaded ){

    attachment.addClass('from-pc uploading')
    attachment.find('.aux-title').show().text( lang.uploading )
    app.addClass('uploading')

  }else{
    attachment.find('.icon').css( 'background-image', 'url(' + attach.fsnode.icons.micro + ')' );
  }

  attachmentPrototype.after( attachment );
  attachment.data( 'attachment', attach );

  if ( attach.pending ) {
    attachment.data( 'mime', attach.type );
  }
  /*
  var nAttachs = $( '.attachment:not(.wz-prototype)' ).length;
  switch (nAttachs) {
    case 0:
      app.css( 'height' ,  '360px' );
      break;
    case 1:
      app.css( 'height' ,  '390px' );
      break;
    case 2:
      app.css( 'height' ,  '420px' );
      break;
    case 3:
      app.css( 'height' ,  '450px' );
      break;
    default:
      app.css( 'height' ,  '490px' );
  }

  */
  updateAttachmentCounter()

}

var attachFromInevio = function(){

  hideAttachSelect()
  $( '.attachment:not(.wz-prototype)').remove();

  api.app.openApp( 1 , [ 'select-source' , function( o ){

    $( '.attach-select-new-post' ).removeClass( 'popup' );

    o.forEach(function( fsnode ){

      addAttachment( { fsnode : fsnode, uploaded : fsnode.fileId !== 'TO_UPDATE' } )

    });

  }] , 'selectSource');

}

var postNewCardAsync = function(){

  var text  = $( '.new-card-textarea' ).val().trim();
  var title = $( '.new-card-input' ).val().trim();
  var worldSelected = app.data( 'worldSelected' );

  if ( title === '' ) {
    return;
  }

  var attachments = $('.attach-list .attachment').not('.wz-prototype');
  var metadata = {};

  var addPost = function( o ){

    var attachment = [];
    if ( o.fsnode ) {
      $.each( o.fsnode, function(){
        attachment.push( $( this ).data('attachment').fsnode.id )
      })
    }


    if ( o.linkType ) {

      metadata.linkType = o.linkType;
      worldSelected.addPost( { content: text, title: title, metadata: metadata })
      .then( object => {

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        $( '.attachment:not(.wz-prototype)').remove();
        closeNewPost()

      })

    }else if( o.fileType ){

      metadata.fileType = o.fileType;
      metadata.fsnode = attachment;
      worldSelected.addPost( { content: text, title: title, fsnode: attachment, metadata: metadata })
      .then( object => {

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        $( '.attachment:not(.wz-prototype)').remove();
        closeNewPost()

      })

    }else{

      worldSelected.addPost({ content: text, title: title })
      .then( object => {

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        $( '.attachment:not(.wz-prototype)').remove();
        closeNewPost()

      })

    }

  }

  if( attachments && attachments.length ){

    if( attachments.length === 1 ){
      var mime = attachments.data('attachment').fsnode.mime ? attachments.data('attachment').fsnode.mime : attachments.data('mime');
      addPost( { fsnode : attachments, fileType: guessType( mime ), multifile: false } )
    }else{
      addPost( { fsnode : attachments, fileType : 'generic', multifile : true } );
    }

  }else if( isYoutubePost(text) ){
    addPost( { fsnode : null, linkType : 'youtube', multifile : false } );

  }else{
    addPost( { fsnode : null, multifile : false } );
  }

}

var isYoutubePost = function( text ){
  var isYoutube = false;
  text.split(' ').forEach( function( word ){
    word.split('\n').forEach( function( word ){
      if ( word.startsWith( 'www.youtu' ) || word.startsWith( 'youtu' ) || word.startsWith( 'https://www.youtu' ) || word.startsWith( 'https://youtu' ) || word.startsWith( 'http://www.youtu' ) || word.startsWith( 'http://youtu' )) {
        isYoutube = true;
      }
    });
  });
  return isYoutube;
}

var guessType = function( mime ){
  return TYPES[ mime ] || 'generic';
}

var hideAttachSelect = function(){
  $('.attach-select-new-post').removeClass('popup')
}

var removeAttachment = function( options ){

  if( automaticPopupQueue ){
    return
  }

  var attachments;
  if ( options.selection === 'all' ) {
    attachments = $('.attachment.from-pc');
  }else{
    attachments = $('.attachment-fsnode-' + options.selection + '.from-pc');
  }

  $.each( attachments, function(){

    var fsnode = $(this).data( 'attachment' ).fsnode;

    if( fsnode ){

      api.app.storage('ignoreRemoveEvent').push( fsnode.id )
      fsnode.remove( function( err ){

        if( err ){
          console.error( err );
        }

      })

    }

  });

}

var showAttachSelect = function(){
  attachFromInevio();
}

var updateAttachmentCounter = function(){

  if( $('.attachment:not(.wz-prototype)').length ){
    attachNewPostButton.addClass('with-attach')
    attachNewPostButton.closest( '.new-card-section' ).addClass('with-attach');
  }else{
    attachNewPostButton.removeClass('with-attach')
    attachNewPostButton.closest( '.new-card-section' ).removeClass('with-attach');
  }

}

var closeNewPost = function(){

  $('.attachment:not(.wz-prototype)').remove()
  $('.mobile-world-content').removeClass('hide')
  $('.mobile-new-post').stop().clearQueue().transition({
    'transform': 'translateY(-100%)'
  }, 300, function () {
    $(this).addClass('hide');
  })

}

// API Events
api.upload.on( 'fsnodeProgress', function( fsnode, percent ){
  var attachment = $( '.attachment-fsnode-' + fsnode )
  attachment.find('.aux-title').text( lang.uploading + (percent.toFixed(2) * 100).toFixed() + ' %')
});

api.upload.on( 'fsnodeEnd', function( fsnode, fileId ){

  var attachment = $( '.attachment-' + fileId + ', .attachment-fsnode-' + fsnode.id )

  if( attachment.length ){

    attachment.find('.title').text( fsnode.name )
    attachment.find('.icon').css( 'background-image', 'url(' + fsnode.icons.micro + ')' );
    attachment.find('.aux-title').hide();
    attachment.addClass('from-pc').addClass( 'attachment-' + fileId ).addClass( 'attachment-fsnode-' + fsnode.id );

    if( $('.attachment.uploading').length ){
      app.removeClass('uploading')
    }

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
.on( 'click', '.attach-select-new-post .inevio', attachFromInevio )
.on( 'upload-prepared', function( e, uploader ){

  hideAttachSelect()

  uploader( params.world.volume, function( e, uploadQueueItem ){
    addAttachment( uploadQueueItem )
  })

})
.on( 'click' , '.new-post .cancel-attachment', function(){

  var attachment = $(this).closest('.attachment')

  removeAttachment( { selection: attachment.data('attachment').fsnode.id } )
  attachment.remove()
  updateAttachmentCounter()
  var nAttachs = $( '.attachment:not(.wz-prototype)' ).length;
  switch (nAttachs) {
    case 0:
      app.css( 'height' ,  '360px' );
      break;
    case 1:
      app.css( 'height' ,  '390px' );
      break;
    case 2:
      app.css( 'height' ,  '420px' );
      break;
    case 3:
      app.css( 'height' ,  '450px' );
      break;
    default:
      app.css( 'height' ,  '490px' );
  }

})
.on( 'click' , '.post-new-card' , function(){
  if( !app.hasClass('uploading') ){
    postNewCardAsync()
  }
})
.on( 'requestPostCreate', function( e, newParams, callback ){

  if( automaticPopupQueue && automaticPopupQueue === newParams.queue ){

    addAttachment( { fsnode : newParams.fsnode, uploaded : newParams.fsnode.fileId !== 'TO_UPDATE' })
    callback( true )

  }else if( newParams.queue ){

    var found = $( '.attachment-' + newParams.queue.fsnode[ newParams.fsnode.id ].id + ', .attachment-fsnode-' + newParams.fsnode.id )

    if( found.length ){
      addAttachment( { fsnode : newParams.fsnode, uploaded : newParams.fsnode.fileId !== 'TO_UPDATE' }, found )
    }

    callback( found.length )

  }else if(
    !newParams.queue &&
    params.operation === newParams.operation &&
    params.world.id === newParams.world.id &&
    lastOperationSample >= ( Date.now() - OPERATION_SAMPLE_RANGE )
  ){

    var found = $( '.attachment-fsnode-' + newParams.fsnode.id )

    if( found.length ){
      addAttachment( { fsnode : newParams.fsnode, uploaded : newParams.fsnode.fileId !== 'TO_UPDATE' }, found )
    }else{
      addAttachment( { fsnode : newParams.fsnode, uploaded : newParams.fsnode.fileId !== 'TO_UPDATE' } )
    }

    lastOperationSample = Date.now()

    callback( true )

  }else{

    var found = $( '.attachment-fsnode-' + newParams.fsnode.id )

    if( found.length ){
      addAttachment( { fsnode : newParams.fsnode, uploaded : newParams.fsnode.fileId !== 'TO_UPDATE' }, found )
    }

    callback( found.length )

  }

})
// .on( 'focus' , '.new-card-input,.new-card-textarea' , function(){
//   $('.mobile-new-post .attachments, .mobile-new-post .attach-list, .post-new-card').addClass('hide');
// })
// .on( 'blur' , '.new-card-input,.new-card-textarea' , function(){
//   $('.mobile-new-post .attachments, .mobile-new-post .attach-list, .post-new-card').removeClass('hide');
// })
