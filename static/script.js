// Variables
var app                 = $( this );
var worldPrototype      = $( '.sidebar .world.wz-prototype' );
var worldTitle          = $( '.world-title' );

var colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]


//Events
app.

on( 'click' , '.create-world-button.step-a' , function(){

  createWorldAsync();

})

.on( 'click' , '.create-world-button.step-b' , function(){

  editWorldAsync();

})

.on( 'click' , '.category-list .world' , function(){

  selectWorld( $( this ) );

});

//Functions
var initCosmos = function(){

  getWorldsAsync();

}

var getWorldsAsync = function(){

  wz.cosmos.getUserWorlds( 5148, {from:1 , to:1000} , function( e , o ){

    console.log( 'mis worlds:' , o );

    $.each( o , function( i , world ){

      appendWorld( world );

    });

  });

};

var appendWorld = function( worldApi ){

  var world = worldPrototype.clone();
  world.removeClass( 'wz-prototype' ).addClass( 'world-' + worldApi.id );
  world.find( '.world-name' ).text( worldApi.name );
  world.find( '.world-icon' ).css( 'border-color' , colors[ worldApi.id % colors.length ] );

  if ( worldApi.isPrivate ) {

    $( '.private-list' ).append( world );

  }else{

    $( '.public-list' ).append( world );

  }

  world.data( 'world' , worldApi );

}

var createWorldAsync = function(){

  var worldName = $( '.new-world-name input' ).val();

  if (!worldName) {
    return;
  }

  wz.cosmos.create( worldName , null, false , null , function( e , o ){

    appendWorld( o );
    $( '.new-world-name input' ).val('');
    $( '.new-world-container' ).data( 'world' , o );

  });

}

var editWorldAsync = function(){

  var worldApi = $( '.new-world-container' ).data( 'world' );
  var isPrivate = $( '.private-option' ).hasClass( 'active' );

  if (!worldApi) {
    return;
  }

  worldApi.setPrivate( isPrivate , function( e , o ){

    $( '.world-' + worldApi.id ).remove();
    worldApi.isPrivate = isPrivate;
    appendWorld( worldApi );
    $( '.privacy-options .option' ).removeClass( 'active' );
    $( '.private-option' ).addClass( 'active' );

  });

}

var selectWorld = function( world ){

  $( '.category-list .world' ).removeClass( 'active' );
  world.addClass( 'active' );

  var worldApi = world.data( 'world' );


  worldTitle.text( worldApi.name );
  console.log(world);


}

initCosmos();
