// --- VARS ---
var onTransition = false;
var state       = 1;
var app         = $( this );
var cover       = $( '.cover' );
var spotDesc    = $( '.spot-desc' );
var spotCover   = $( '.spot-cover' );
var goBack      = $( '.go-back' );
var moreInfo    = $( '.more-info' );
var uiContent   = $( '.ui-content' );

// --- EVENTS ---
// SERVER EVENTS

// END SERVER EVENTS

// UI EVENTS
spotDesc.on( 'click' ,function(){

  moveToDesc();

});

spotCover.on( 'click' , function(){

  moveToCover();

});

moreInfo.on( 'click' ,function(){

  moveToDesc();

});

goBack.on( 'click' , function(){

  moveToCover();

});

$( '.cover' ).on( 'mousewheel' , function( e , d , x , y ){

  if ( state == 1 && !onTransition && y < 0) {

    compressCover();
    $('.cards-list').scrollTop( 6 );

  }else if( state == 0 && !onTransition && y > 0 ){

    decompressCover();
    $('.cards-list').scrollTop( 0 );

  }

});

$( '.cards-list' ).on( 'scroll' , function(){

  var obj = $( this );

  if ( state == 1 && !onTransition && obj.scrollTop() > 5) {

    compressCover();

  }else if( state == 0 && !onTransition && obj.scrollTop() < 5 ){

    decompressCover();

  }

});

// END UI EVENTS

// APP EVENTS

// END APP EVENTS

// --- FUNCTIONS ---
var initCosmos = function(){

  app.css({'border-radius'    : '6px',
  'background-color' : '#2c3238'
  });

}

var moveToDesc = function(){

  $( '.search-button' ).stop().clearQueue().transition({

    'opacity' : '0'

  }, 200);

  $( '.cover-first' ).stop().clearQueue().transition({

    'margin-left' : '-50%'

  }, 800, function(){

    $( '.search-button' ).stop().clearQueue().transition({

      'opacity' : '1'

    }, 200);

  });

  $( '.spot-cover' ).stop().clearQueue().transition({

    'background-color' : 'transparent'

  }, 800);

  $( '.spot-desc' ).stop().clearQueue().transition({

    'background-color' : '#c8c9cc'

  }, 800);

}

var moveToCover = function(){

  $( '.search-button' ).stop().clearQueue().transition({

    'opacity' : '0'

  }, 200);

  $( '.cover-first' ).stop().clearQueue().transition({

    'margin-left' : '0'

  }, 800, function(){

    $( '.search-button' ).stop().clearQueue().transition({

      'opacity' : '1'

    }, 200);

  });

  $( '.spot-desc' ).stop().clearQueue().transition({

    'background-color' : 'transparent'

  }, 800);

  $( '.spot-cover' ).stop().clearQueue().transition({

    'background-color' : '#c8c9cc'

  }, 800);

}

var compressCover = function(){

  onTransition = true;
  $( '.ui-window' ).addClass( 'scrolled' );

  var avatar = $( '.world-avatar' );
  var avatarLeft = parseInt( avatar.css( 'margin-left' ) );
  var distance =  avatarLeft - 73;
  var interval = distance/6;

  console.log('1', avatarLeft, distance, interval );

  avatar.css( 'margin-left' , avatarLeft );

  // AVATAR
  $( '.world-avatar' ).transition({

    'width'   : '50px',
    'height'  : '50px',
    'margin-left'    : ( avatarLeft - interval ),
    'top'     : '80.4px'

  }, 166, 'in').transition({

    'width'   : '46px',
    'height'  : '46px',
    'margin-left'    : ( avatarLeft - interval*2 ),
    'top'     : '74.3px'


  }, 166, 'linear').transition({

    'width'   : '42px',
    'height'  : '42px',
    'margin-left'    : ( avatarLeft - interval*3 ),
    'top'     : '54.3px'


  }, 166, 'linear').transition({

    'width'   : '40px',
    'height'  : '40px',
    'margin-left'    : ( avatarLeft - interval*4 ),
    'top'     : '30.5px'


  }, 166, 'linear').transition({

    'width'   : '34px',
    'height'  : '34px',
    'margin-left'    : ( avatarLeft - interval*5 ),
    'top'     : '16.9px'


  }, 166, 'linear').transition({

    'width'   : '33px',
    'height'  : '33px',
    'margin-left'    : ( avatarLeft - interval*6 ),
    'top'     : '12px'

  }, 200, 'out');

  var title = $( '.world-title-small' );
  var titleLeft = parseInt( title.css( 'width' ) );
  console.log(title.css( 'width' ));

  // TITLE
  $( '.world-title-container' ).transition({

    'width'   : titleLeft,
    'left'    : 116,
    'top'     : 20

  }, 1000, 'out');

  $( '.world-title' ).transition({

    'color'     : '#545f65',
    'font-size' : '15px'

  }, 1000, 'out');

  // COVER
  $( '.cover' ).stop().clearQueue().transition({

      'height'            : 57

  }, 1000, function(){

    state = 0;
    onTransition = false;

  });

  // PRE-COVER
  $( '.pre-cover' ).stop().clearQueue().transition({

    'box-shadow'  : '1px 1px rgba(0,0,0,.05)'

  }, 500);

  // SHADOW AND IMAGE
  $( '.shadow, .back-image' ).stop().clearQueue().transition({

      'opacity' : '0'

  }, 1000);

  // CARD-LIST
  $( '.cards-list' ).stop().clearQueue().transition({

      'height' : 'calc(100% - 58px)',
      'top'    : 58

  }, 1000);

  // USER PREVIEW
  $( '.users-preview-container' ).stop().clearQueue().transition({

      'top'       : 85,
      'opacity'   : 0

  }, 300, 'linear').transition({

      'top'     : -45

  }, 250, function(){

      $( '.users-preview-container' ).css( 'top' , '85px' );

  });

  // SPOTS
  $( '.spot' ).stop().clearQueue().transition({

    'top'       : 150,
    'opacity'   : 0

  }, 300, 'linear').transition({

    'top'     : -45

  }, 250, function(){

    $( '.spot' ).css( 'top' , '150px' );

  });

}

var decompressCover = function(){

  onTransition = true;
  $( '.ui-window' ).removeClass( 'scrolled' );

  var avatar = $( '.world-avatar' );
  var avatarLeft = ( parseInt( $('.cover-first').css( 'width' ) ) - 52 ) / 2;
  var avatarTop = parseInt( avatar.css( 'top' ) );
  var distance = avatarLeft - 73;
  var interval = distance/6;


  console.log('2', avatarLeft, distance, interval );

  // AVATAR
  $( '.world-avatar' ).transition({

    'width'   : '34px',
    'height'  : '34px',
    'margin-left'    : ( 73 + interval ),
    'top'     : '16.9px'

  }, 166, 'in').transition({

    'width'   : '40px',
    'height'  : '40px',
    'margin-left'    : ( 73 + interval*2 ),
    'top'     : '30.5px'

  }, 166, 'linear').transition({

    'width'   : '42px',
    'height'  : '42px',
    'margin-left'    : ( 73 + interval*3 ),
    'top'     : '54.3px'

  }, 166, 'linear').transition({

    'width'   : '46px',
    'height'  : '46px',
    'margin-left'    : ( 73 + interval*4 ),
    'top'     : '74.3px'

  }, 166, 'linear').transition({

    'width'   : '50px',
    'height'  : '50px',
    'margin-left'    : ( 73 + interval*5 ),
    'top'     : '80.4px'

  }, 166, 'linear').transition({

    'width'   : '52px',
    'height'  : '52px',
    'margin-left'    : ( 73 + interval*6 ),
    'top'     : '80.4px'

  }, 200, 'out');

  var title = $( '.world-title-small' );
  var titleLeft = parseInt( title.css( 'width' ) );
  console.log(title.css( 'width' ));

  // TITLE
  $( '.world-title-container' ).transition({

    'width'   : '100%',
    'left'    : 0,
    'top'     : 154

  }, 1000, 'out');

  $( '.world-title' ).transition({

    'color'     : '#fff',
    'font-size' : '37px'

  }, 1000, 'out');

  // COVER
  $( '.cover' ).stop().clearQueue().transition({

      'height'            : 317

  }, 1000, function(){

    state = 1;
    onTransition = false;

    avatar.css({

      'margin'  : '0 auto'

    })


  });

  // PRE-COVER
  $( '.pre-cover' ).stop().clearQueue().transition({

    'box-shadow'        : 'none'

  }, 1000);;

  // SHADOW AND IMAGE
  $( '.shadow, .back-image' ).stop().clearQueue().transition({

      'opacity' : '1'

  }, 1000);;

  // CARD-LIST
  $( '.cards-list' ).stop().clearQueue().transition({

      'height' : 'calc(100% - 317px)',
      'top'    : 317

  }, 1000);

  // USER PREVIEW
  console.log($( '.users-preview-container' ).css('top'));
  $( '.users-preview-container' ).stop().clearQueue().transition({

    delay : 350,
    'top' : 229,
    'opacity' : 1

  }, 500);

  // SPOTS
  $( '.spot' ).stop().clearQueue().transition({

    delay     : 350,
    'top'     : 294,
    'opacity' : 1

  }, 500);

}

// INIT Chat
initCosmos();
