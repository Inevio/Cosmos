var app             = $( this );
var myContactID     = api.system.user().id;
var noWorlds        = $( '.no-worlds' );

wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , o ){

  if ( o.length === 0 ) {

    noWorlds.show();
    noWorlds.css({ 'opacity' : 1 });

  }else{

    app.data( 'myWorlds' , o );

  }

  start();

});
