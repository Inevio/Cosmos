// --- VARS ---
var onTransition  = false;
var state         = 1;
var app           = $( this );
var cover         = $( '.cover' );
var spotDesc      = $( '.spot-desc' );
var spotCover     = $( '.spot-cover' );
var goBack        = $( '.go-back' );
var moreInfo      = $( '.more-info' );
var uiContent     = $( '.ui-content' );
var cardList      = $( '.cards-list' );
var exploreButton = $( '.explore-button' );
var closeExplore  = $( '.close-explore' );

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

cover.on( 'mousewheel' , function( e , d , x , y ){

  if ( state == 1 && !onTransition && y < 0) {

    compressCover();
    $('.cards-list').scrollTop( 6 );

  }else if( state == 0 && !onTransition && y > 0 ){

    decompressCover();
    $('.cards-list').scrollTop( 0 );

  }

});

cardList.on( 'scroll' , function(){

  var obj = $( this );

  if ( state == 1 && !onTransition && obj.scrollTop() > 5) {

    compressCover();

  }else if( state == 0 && !onTransition && obj.scrollTop() < 5 ){

    decompressCover();

  }

});

exploreButton.on( 'click' , function(){

  exploreAnimationIn();

});

closeExplore.on( 'click' , function(){

  exploreAnimationOut();

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

  // SEARCH
  $( '.search-button' ).stop().clearQueue().transition({

    'background-color'       : '#f7f8fa'

  }, 1000);


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

  // SEARCH
  $( '.search-button' ).stop().clearQueue().transition({

    'background-color'       : 'rgba(0, 0, 0, 0.3)'

  }, 1000);

}

var exploreAnimationIn = function(){

  var exploreSection = $( '.explore-section' );

  exploreSection.css( 'display' , 'block');

  // Fade in blue background
  exploreSection.stop().clearQueue().transition({

    'opacity' : 1

  }, 1000);

  // Stars appears and goes up
  $( '.stars' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Explore title appears and goes up
  exploreSection.find( '.search-title' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Search bar appears and goes up
  exploreSection.find( '.search-bar' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // New world button appears and goes up
  exploreSection.find( '.new-world-button' ).stop().clearQueue().transition({

    delay       : 1000,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 500);

  // Close explore button appears and goes up
  exploreSection.find( '.close-explore' ).stop().clearQueue().transition({

    delay       : 1000,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 500);

  // New world button appears and goes up
  $( '.planet' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translate(0px,0px)'

  }, 500);

  // Tend text appears and goes up
  $( '.tend-text' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // First world cover appers and goes up
  $( '.world-card:nth-child(1)' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Second world cover appers and goes up
  $( '.world-card:nth-child(2)' ).stop().clearQueue().transition({

    delay       : 750,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Third world cover appers and goes up
  $( '.world-card:nth-child(3)' ).stop().clearQueue().transition({

    delay       : 1000,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Third world cover appers and goes up
  $( '.world-card:nth-child(4)' ).stop().clearQueue().transition({

    delay       : 1250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

}

var exploreAnimationOut = function(){

  var exploreSection = $( '.explore-section' );

  // Fade out blue background
  exploreSection.stop().clearQueue().transition({

    'opacity' : 0

  }, 1000, function(){

    exploreSection.css( 'display' , 'none' );

    $( '.stars' ).css({
      'transform' : 'translateY(20px)',
      'opacity'   : 0
    });

    exploreSection.find( '.search-title' ).css({
      'transform' : 'translateY(20px)',
      'opacity'   : 0
    });

    exploreSection.find( '.search-bar' ).css({
      'transform' : 'translateY(20px)',
      'opacity'   : 0
    });

    exploreSection.find( '.new-world-button' ).css({
      'transform' : 'translateY(10px)',
      'opacity'   : 0
    });

    exploreSection.find( '.close-explore' ).css({
      'transform' : 'translateY(10px)',
      'opacity'   : 0
    });

    $( '.planet' ).css({
      'transform' : 'translate( 40px , 40px )',
      'opacity'   : 0
    });

    $( '.tend-text' ).css({
      'transform' : 'translateY( 20px )',
      'opacity'   : 0
    });

    $( '.world-card' ).css({
      'transform' : 'translateY( 20px )',
      'opacity'   : 0
    });


  });

}

// INIT Chat
initCosmos();
