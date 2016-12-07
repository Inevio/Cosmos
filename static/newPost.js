var POPUP_MODE = 0;
var MANUALPOST_MODE = 1;

var app = $(this);
var status;
var me;
var TYPES = {

  "application/pdf"   : 3,
  "application/zip"    : 2,
  "application/x-rar"  : 2,
  "application/x-gzip" : 2,
  "text/x-c"               : 3,
  "text/x-c++"             : 3,
  "text/x-php"             : 3,
  "text/x-python"          : 3,
  "application/json"       : 3,
  "application/javascript" : 3,
  "application/inevio-texts"                                                    : 2,
  "application/msword"                                                          : 2,
  "application/vnd.oasis.opendocument.text"                                     : 2,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"     : 2,
  "application/inevio-grids"                                          : 2,
  "application/vnd.ms-excel"                                          : 2,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : 2,
  "application/vnd.ms-powerpoint"                                             : 2,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" : 2,
  "audio/mp4"          : 6,
  "audio/mpeg"         : 6,
  "audio/flac"         : 6,
  "audio/x-vorbis+ogg" : 6,
  "audio/x-wav"        : 6,
  "image/gif"  : 4,
  "image/jpeg" : 4,
  "image/png"  : 4,
  "image/tiff" : 4,
  "image/vnd.adobe.photoshop" : 2,
  "text/html"    : 2,
  "text/plain"   : 2,
  "text/rtf"     : 2,
  "video/3gpp"         : 5,
  "video/mp4"          : 5,
  "video/quicktime"    : 5,
  "video/webm"         : 5,
  "video/x-flv"        : 5,
  "video/x-matroska"   : 5,
  "video/x-ms-asf"     : 5,
  "video/x-ms-wmv"     : 5,
  "video/x-msvideo"    : 5,
  "video/x-theora+ogg" : 5

}

var closeNewCard    = $( '.close-new-card' );
var attachNewPostBut = $( '.new-card-section .attachments, .new-card-section .attachments i, .new-card-section .attachments div' );
var cancelNewCard         = $( '.cancel-new-card' );
var postNewCardButton     = $( '.post-new-card' );

closeNewCard.on( 'click' , function(){

  wz.app.removeView( app );

});

cancelNewCard.on( 'click' , function(){

  wz.app.removeView( app );

});

postNewCardButton.on( 'click' , function(){

  postNewCardAsync();
  wz.app.removeView( app );

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

  uploaderFunction = uploader;

  $( '.popup' ).removeClass( 'popup2' );
  $( this ).parent().find( '.new-card-section .attach-select' ).hide();

  $( '.new-card-section .attachments' ).data( 'attachs' , 'fromPc' );

  $( '.new-card-section .attachments' ).addClass( 'with-attach' );

})

var startNewPost = function(){
  if (!params) {
    warn('NO_PARAMS_NEW_POST');
    return;
  }

  wz.user( api.system.user().id , function( e , user ){

    me = user;

    translate();

    if ( params.type === 'popup' ) {
      status = POPUP_MODE;
      startPopupPost();
    }else if( params.type === 'manual' ){
      status = MANUALPOST_MODE;
      startManualPost();
    }

  });

}

var translate = function(){
  $( '.new-card-title' ).html( '<i>' + lang.newPost + '</i>' + lang.for + '<figure></figure>' );
  $( '.cancel-new-card span' ).text( lang.cancel );
  $( '.post-new-card span' ).text( lang.postit );
  $( '.attach-select .inevio span' ).text( lang.uploadInevio );
  $( '.attach-select .pc span' ).text( lang.uploadPC );
}

var startManualPost = function(){

  $( '.new-card-title figure' ).text( params.world.name );
  $( '.new-card-avatar' ).css( 'background-image' , 'url(' + me.avatar.tiny + ')' );
  $( '.new-card-section .attachments' ).data( 'numAttachs' , 0 );
  $( '.new-card-section .attachments' ).removeClass( 'with-attach' );

}

var startPopupPost = function(){

  $('.file-info i').text( params.fsnode.name )
  $('.cosmos-info i').text( params.world.name )
  $('.post-title input').focus()
  $('.file-icon img').attr('src', params.fsnode.icons.small );

  $('.post-button').on( 'click' , function(){

    params.callback( $('.post-title input').val().trim(), $('.post-desc textarea').val().trim(), TYPES[ params.fsnode.mime ] || 1 )
    api.app.removeView( app )

  })

  $('.omit-button').on( 'click' , function(){
    api.app.removeView( app )
  })

  $('.close-popup').on( 'click' , function(){
    api.app.removeView( app )
  })

}

var postNewCardAsync = function(){

  var text = $( '.new-card-textarea' ).val() ? $( '.new-card-textarea' ).val() : 'none';
  var tit = $( '.new-card-input' ).val() ? $( '.new-card-input' ).val() : 'none';

  if ( text === 'none' && tit === 'none' ) {
    alert( lang.noInfo );
    return;
  }

  var attach = $( '.new-card-section .attachments' ).data( 'attachs' );

  var addPost = function( node , type ){

    if ( type === 1 || type === 7 || type === 8 ) {

      params.world.addPost( { content: text , type: type, title: tit } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');

      });

    }else{

      params.world.addPost( { content: text , type: type, title: tit, fsnode: node.id } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        $( '.new-card-section .attachments' ).data( 'attachs' , '');

      });

    }

  }

  var checkTypePost = function( fsnode ){

    var fileType = 1;

    if ( fsnode.mime ) {

      fileType = guessType( fsnode.mime );

    }


    addPost( fsnode , fileType );

  }

  if ( attach ) {

    if ( attach === 'fromPc' ) {

      uploaderFunction( worldSelected.volume , function( e , fsNode ){

        auxFunction = checkTypePost;
        fsnodeId = fsNode[0].id;

      });

    }else{

      api.fs( attach[0] , function( e , fsNode ){

        checkTypePost( fsNode );

      });

    }

  }else if ( text.indexOf( 'www.youtube' ) != -1 ) {

    addPost( 0 , 8 );

  }else{

    addPost( 0 , 1 );

  }

}

var attachFromInevio = function(){

  api.fs.selectSource( { 'title' : 'Selecciona!' , 'mode' : 'file' } , function( e , s ){

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
    $( '.new-card-section .attachments' ).data( 'numAttachs' , numAttachs );
    $( '.new-card-section .attachments' ).data( 'attachs' , s );

    if ( numAttachs > 0) {
      $( '.new-card-section .attachments' ).addClass( 'with-attach' );
      $( '.new-card-section .attachments figure i' ).text( numAttachs );
    }

  })

}

var guessType = function( mime ){
  return TYPES[ mime ] || 1
}

startNewPost();
