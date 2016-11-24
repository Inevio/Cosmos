
var app = $(this)
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
