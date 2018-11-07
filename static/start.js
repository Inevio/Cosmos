var app             = $( this );
var myContactID     = api.system.workspace().idWorkspace;
var noWorlds        = $( '.no-worlds' );
var parameters;
var window          = app.parents().slice( -1 )[ 0 ].parentNode.defaultView;

parameters = params

if( api.app.getViews('main').length === 1 || app.hasClass( 'wz-mobile-view' ) || !parameters ){

  api.cosmos.getUserWorlds( myContactID , {from:0 , to:1000}).then( o => {

    if ( o.length === 0 && !isMobile()) {

      noWorlds.show();
      noWorlds.css({ 'opacity' : 1 });

    }else{
      app.data( 'myWorlds', o );
    }

    console.log( api.app.getViews() , api.app.getViews( 'main' ) );
    start();

  });

}else{

  wz.view.remove( false );
  api.app.getViews( 'main' ).trigger( 'selectPost' , [ params ]);

}

var isMobile = function(){
  return app.hasClass( 'wz-mobile-view' );
}

//start()

$( '.onboarding-arrow.arrow-cosmos' , window.document ).remove();
