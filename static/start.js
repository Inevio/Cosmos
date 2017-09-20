var app             = $( this );
var myContactID     = api.system.user().id;
var noWorlds        = $( '.no-worlds' );
var starsCanvasContainer  = $( '.stars-canvas' ); 
var parameters;
var window          = app.parents().slice( -1 )[ 0 ].parentNode.defaultView;

parameters = params

if( api.app.getViews('main').length === 1 || app.hasClass( 'wz-mobile-view' ) || !parameters ){

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , o ){

    if ( o.length === 0 && !isMobile()) {

      noWorlds.show();
      starsCanvasContainer.removeClass( 'no-visible' ); 
      starsCanvas( 'stars-canvas' );
      starsCanvasContainer.css( 'opacity' , 1 ); 
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

var starsCanvas = function( stars ){

  if (isMobile()) {
    return;
  }

  var canvas = $('.' + stars );
  var ctx = canvas[0].getContext('2d');
  var initial = Date.now();

  var layer1 = new Image();
  var layer2 = new Image();
  var layer3 = new Image();
  var speed1 = 2 / 75;
  var speed2 = 2 / 125;
  var speed3 = 2 / 175;
  var padding1 = 0;
  var padding2 = 0;
  var padding3 = 0;

  layer1.src = 'https://static.horbito.com/app/360/starlayer1.png';
  layer2.src = 'https://static.horbito.com/app/360/starlayer2.png';
  layer3.src = 'https://static.horbito.com/app/360/starlayer3.png';

  var draw = function(){

    var current = initial - Date.now();

    ctx.clearRect( 0, 0, canvas.width(), canvas.height() );

    // LAYER 1
    ctx.drawImage( layer1, 0, current * speed1 + padding1 );

    if( current * speed1 + padding1 < canvas.height - layer1.height ){
      ctx.drawImage( layer1, 0, current * speed1 + padding1 + layer1.height );
    }

    if( current * speed1 + padding1 < -layer1.height ){
      padding1 += layer1.height;
    }

    // LAYER 2
    ctx.drawImage( layer2, 0, current * speed2 + padding2 );

    if( current * speed2 + padding2 < canvas.height - layer2.height ){
      ctx.drawImage( layer2, 0, current * speed2 + padding2 + layer2.height );
    }

    if( current * speed2 + padding2 < -layer2.height ){
      padding2 += layer2.height;
    }

    // LAYER 3
    ctx.drawImage( layer3, 0, current * speed3 + padding3 );

    if( current * speed3 + padding3 < canvas.height - layer3.height ){
      ctx.drawImage( layer3, 0, current * speed3 + padding3 + layer3.height );
    }

    if( current * speed3 + padding3 < -layer3.height ){
      padding3 += layer3.height;
    }

    if (!starsCanvasContainer.hasClass( 'no-visible' )) {
      requestAnimationFrame( draw );
    }

  }

  draw();

}

var isMobile = function(){
  return app.hasClass( 'wz-mobile-view' );
}

$( '.onboarding-arrow.arrow-cosmos' , window.document ).remove();