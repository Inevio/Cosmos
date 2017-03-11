var app             = $( this );
var myContactID     = api.system.user().id;
var noWorlds        = $( '.no-worlds' );
var starsCanvasContainer  = $( '.stars-canvas' );
var parameters;

parameters = params

if( api.app.getViews('main').length === 1 || app.hasClass( 'wz-mobile-view' ) ){

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , o ){

    if ( o.length === 0 ) {

      noWorlds.show();
      starsCanvasContainer.removeClass( 'no-visible' );
      starsCanvasContainer.css( 'opacity' , 1 );
      noWorlds.css({ 'opacity' : 1 });

    }else{
      app.data( 'myWorlds', o );
    }

    console.log( api.app.getViews() , api.app.getViews( 'main' ) );
    start();

  });

}else{

  if (params[0] === 'focus') {
    api.app.viewToFront( api.app.getViews('main')[0] );
  }else{
    wz.view.remove( false );
    api.app.getViews( 'main' ).trigger( 'selectPost' , [ params ]);
  }

}
