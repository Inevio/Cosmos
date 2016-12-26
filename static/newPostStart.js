
if( params.type !== 'popup' ){
  return start()
}

var win = $( this );
var others = api.app.getViews('newPost').not( win )

if( !others.length ){
  return start()
}

var ended = 0
var found = false
var endHandler = function( success ){

  found = found || success

  if( ++ended < others.length ){
    return
  }

  if( found ){
    return api.view.remove( false )
  }

  start()

}

others.each( function(){
  $(this).trigger( 'requestPostCreate', [ params, endHandler ] )
})
