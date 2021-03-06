
if( params.type !== 'popup' ){
  return start()
}

if( api.app.storage('ignoreRemoveEvent').indexOf( params.fsnode.id ) !== -1 ){
  return api.view.remove( false )
}

var win = $( this );
var others = api.app.getViews().not( win ).filter('.wz-app-360-view-newPost')

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
