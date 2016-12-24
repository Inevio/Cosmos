
// Constants
var POPUP_MODE = 0;
var MANUALPOST_MODE = 1;
var TYPES = {

  "application/pdf"   : 'document',
  "application/zip"    : 'generic',
  "application/x-rar"  : 'generic',
  "application/x-gzip" : 'generic',
  "text/x-c"               : 'document',
  "text/x-c++"             : 'document',
  "text/x-php"             : 'document',
  "text/x-python"          : 'document',
  "application/json"       : 'document',
  "application/javascript" : 'document',
  "application/inevio-texts"                                                    : 'generic',
  "application/msword"                                                          : 'generic',
  "application/vnd.oasis.opendocument.text"                                     : 'generic',
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"     : 'generic',
  "application/inevio-grids"                                          : 'generic',
  "application/vnd.ms-excel"                                          : 'generic',
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : 'generic',
  "application/vnd.ms-powerpoint"                                             : 'generic',
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" : 'generic',
  "audio/mp4"          : 'music',
  "audio/mpeg"         : 'music',
  "audio/flac"         : 'music',
  "audio/x-vorbis+ogg" : 'music',
  "audio/x-wav"        : 'music',
  "image/gif"  : 'image',
  "image/jpeg" : 'image',
  "image/png"  : 'image',
  "image/tiff" : 'image',
  "image/vnd.adobe.photoshop" : 'generic',
  "text/html"    : 'generic',
  "text/plain"   : 'generic',
  "text/rtf"     : 'generic',
  "video/3gpp"         : 'video',
  "video/mp4"          : 'video',
  "video/quicktime"    : 'video',
  "video/webm"         : 'video',
  "video/x-flv"        : 'video',
  "video/x-matroska"   : 'video',
  "video/x-ms-asf"     : 'video',
  "video/x-ms-wmv"     : 'video',
  "video/x-msvideo"    : 'video',
  "video/x-theora+ogg" : 'video'

}

// Variables
var app = $(this);
var me = api.system.user();
var status;

// DOM Variables
var closeNewCard        = $( '.close-new-card' );
var attachNewPostBut    = $( '.new-card-section .attachments, .new-card-section .attachments i, .new-card-section .attachments div' );
var cancelNewCard       = $( '.cancel-new-card' );
var postNewCardButton   = $( '.post-new-card' );
var attachmentPrototype = $( '.attachment.wz-prototype' );

// Functions
var startManualPost = function(){

  $( '.new-card-title figure' ).text( params.world.name );
  $( '.new-card-avatar' ).css( 'background-image' , 'url(' + me.avatar.tiny + ')' );
  $( '.new-card-section .attachments' ).data( 'numAttachs' , 0 );
  $( '.new-card-section .attachments' ).removeClass( 'with-attach' );
  $( '.new-card-input' ).focus()

}

var startPopupPost = function(){

  $('.new-card-title figure').text( params.world.name )
  $('.new-card-avatar').css( 'background-image' , 'url(' + me.avatar.tiny + ')' );
  $('.new-card-section .attachments').data( 'withAttach' , true );
  appendAttachment( params.fsnode );
  $( '.new-card-section .attachments' ).addClass( 'with-attach' );
  $( '.new-card-section .attachments figure i' ).text( 1 );
  $( '.new-card-input' ).focus()

}

var postNewCardAsync = function(){

  var text = $( '.new-card-textarea' ).val();
  var tit = $( '.new-card-input' ).val();

  if ( tit === '' ) {
    return alert( lang.noInfo );
  }

  var withAttach = $( '.new-card-section .attachments' ).data( 'withAttach' );

  var addPost = function( o ){

    var attachment = [];

    if ( o.multifile ) {

      $.each( o.fsnode , function( i , fsnode ){
        attachment.push( $(fsnode).data( 'fsnode' ).id );
      });

    }else{
      // To Do -> Simplify this. Remove the anidated fsnode property inside other fsnode attribute
      attachment = o.fsnode ? ( o.fsnode.fsnode ? o.fsnode.fsnode.id || o.fsnode.fsnode : null ) || o.fsnode.id || o.fsnode : '';
    }

    if ( o.linkType ) {

      var res = { content: text, title: tit, metadata: { linkType : o.linkType } }
      params.world.addPost( { content: text, title: tit, metadata: { linkType : o.linkType } } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        wz.app.removeView( app );

      });

    }else if( o.fileType ){

      var res = { content: text , title: tit, fsnode: attachment, metadata: { fileType : o.fileType } }
      params.world.addPost( { content: text , title: tit, fsnode: attachment, metadata: { fileType : o.fileType } } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        $( '.new-card-section .attachments' ).data( 'withAttach' , '' );
        wz.app.removeView( app );

      });

    }else{

      var res = { content: text, title: tit }
      params.world.addPost( { content: text, title: tit } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        wz.app.removeView( app );

      });

    }

  }

  var checkTypePost = function( fsnode ){

    var fileType = 'generic';

    if ( fsnode.mime ) {
      fileType = guessType( fsnode.mime );
    }

    addPost( { fsnode: fsnode , fileType: fileType , multifile: false } );

  }

  if ( withAttach ) {

    var attachments = $('.attachment:not(.wz-prototype)');

    if ( attachments.length === 1 ) {
      checkTypePost( attachments.data('fsnode') );
    }else{
      addPost( { fsnode: attachments , fileType: 'generic' , multifile: true } );
    }

  }else if ( text.indexOf( 'www.youtube' ) != -1 ) {
    addPost( { fsnode: null , linkType: 'youtube' , multifile: false } );

  }else{
    addPost( { fsnode: null , multifile: false } );
  }

}

var attachFromInevio = function(){

  api.fs.selectSource( { 'title' : 'Selecciona!' , 'mode' : 'file' , 'multiple': true } , function( e , s ){

    if (e) {
      console.log( e );
      return;
    }

    $( '.attach-select' ).removeClass( 'popup' );

    var numAttachs = $( '.new-card-section .attachments' ).data( 'numAttachs' );
    if ( !numAttachs ) {
      numAttachs = 0;
    }

    if ( s.constructor === Array ) {
      numAttachs += s.length;
    }else{
      numAttachs++;
    }

    console.log( numAttachs, s );
    $( '.new-card-section .attachments' ).data( 'withAttach' , true );

    s.forEach(function( attach ){

      api.fs( attach , function( e , fsnode ){

        if (e) {
          console.log(e);
        }else{
          appendAttachment( fsnode );
        }

      });

    });

    if ( numAttachs > 0) {
      $( '.new-card-section .attachments' ).addClass( 'with-attach' );
      $( '.new-card-section .attachments figure i' ).text( numAttachs );
    }

  })

}

var guessType = function( mime ){
  return TYPES[ mime ] || 'generic';
}

var appendAttachment = function( o ){

  var fsnode = o.fsnode || o
  var attachment = attachmentPrototype.clone();
  attachment.removeClass( 'wz-prototype' ).addClass( 'attachment-' + fsnode.id );
  attachment.find( '.title' ).text( fsnode.name );

  if ( o.uploading ) {
    attachment.find( '.aux-title' ).show().text( lang.uploading );
    $('.new-card-section').addClass( 'uploading' );
  }else{
    attachment.find( '.icon' ).css( 'background-image' , 'url(' + fsnode.icons.micro + ')' );
  }

  attachmentPrototype.after( attachment );
  attachment.data( 'fsnode' , o );

}

var removeAttachments = function(){

  var attachments = $('.attachment.from-pc');

  $.each( attachments , function( i , attachment ){

    var fsnode = $( attachment ).data( 'fsnode' );
    fsnode.remove( function( e ){
      if (e) {
        console.log(e);
      }
    })

  });

}

var start = function(){

  translate()

  if( !params || !params.type ){
    return warn('NO_PARAMS_NEW_POST');
  }

  if( params.type === 'popup' ) {

    status = POPUP_MODE;
    startPopupPost();

  }else if( params.type === 'manual' ){

    status = MANUALPOST_MODE;
    startManualPost();

  }else{
    warn('NO_PARAMS_NEW_POST');
  }

}

var translate = function(){

  $( '.new-card-title' ).html( '<i>' + lang.newPost + '</i>' + lang.for + '<figure></figure>' );
  $( '.cancel-new-card span' ).text( lang.cancel );
  $( '.post-new-card span' ).text( lang.postit );
  $( '.attach-select .inevio span' ).text( lang.uploadInevio );
  $( '.attach-select .pc span' ).text( lang.uploadPC );
  $( '.new-card-input' ).attr( 'placeholder' , lang.writeTitle );
  $( '.new-card-textarea' ).attr( 'placeholder' , lang.writeDescription );

}

// API Events
api.upload.on( 'fsnodeProgress', function( fsnode , percent ){

  //console.log( arguments );

});

api.upload.on( 'fsnodeEnd', function( fsnode , fileId ){

  var attachment = $( '.attachment-' + fileId );
  if ( attachment.length != -1 ) {
    attachment.find( '.icon' ).css( 'background-image' , 'url(' + fsnode.icons.micro + ')' );
    attachment.find( '.aux-title' ).hide();
    attachment.addClass( 'from-pc' ).removeClass( 'attachment-' + fileId ).addClass( 'attachment-' + fsnode.id );
    attachment.data( 'fsnode' , fsnode );
    $('.new-card-section').removeClass( 'uploading' );
  }

});

// DOM Events
closeNewCard.on( 'click' , function(){

  removeAttachments();
  if ( !$('.new-card-section').hasClass( 'uploading' ) ) {
    wz.app.removeView( app );
  }

});

cancelNewCard.on( 'click' , function(){

  removeAttachments();
  if ( !$('.new-card-section').hasClass( 'uploading' ) ) {
    wz.app.removeView( app );
  }

});

postNewCardButton.on( 'click' , function(){

  if ( !$('.new-card-section').hasClass( 'uploading' ) ) {
    postNewCardAsync();
  }

});

attachNewPostBut.on( 'click' , function(){
  $( '.attach-select' ).addClass( 'popup' );
});

app
.on( 'click' , function( e ){

  if ( ! $( e.target ).hasClass( 'popup' ) && ! $( e.target ).hasClass( 'popup-launcher' ) ) {
    $( '.popup' ).removeClass( 'popup' );
  }

})
.on( 'click' , '.attach-select .inevio' , function(){

  attachFromInevio();

})
.on( 'upload-prepared' , function( e , uploader ){

  $( '.popup' ).removeClass( 'popup2' );
  $( this ).parent().find( '.new-card-section .attach-select' ).hide();

  $( '.new-card-section .attachments' ).data( 'withAttach' , true );

  uploader( params.world.volume , function( e , fsnode ){
    appendAttachment( { fsnode: fsnode , uploading: true } );
  });

})
.on( 'click', '.cancel-attachment' , function(){

  $(this).closest('.attachment').remove();

  if ($('.attachment:not(.wz-prototype)').length === 0) {
    attachNewPostBut.removeClass('with-attach');
  }

});

// Start
start();
