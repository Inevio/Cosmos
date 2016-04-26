// --- VARS ---
var onTransition    = false;
var state           = 1;
var app             = $( this );
var cover           = $( '.cover' );
var spotDesc        = $( '.spot-desc' );
var spotCover       = $( '.spot-cover' );
var goBack          = $( '.go-back' );
var moreInfo        = $( '.more-info' );
var uiContent       = $( '.ui-content' );
var cardList        = $( '.cards-list' );
var exploreButton   = $( '.explore-button' );
var closeExplore    = $( '.close-explore' );
var moreUsersButton = $( '.more-users' );

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

moreUsersButton.on( 'click', function(){

  usersGoesUp();

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

// Compress de cover to show better the cards
var compressCover = function(){

  onTransition = true;
  $( '.ui-window' ).addClass( 'scrolled' );

  var avatar = $( '.world-avatar' );
  var avatarLeft = parseInt( avatar.css( 'margin-left' ) );
  var distance =  avatarLeft - 73;
  var interval = distance/6;

  avatar.css( 'margin-left' , avatarLeft );

  // Avatar goes up (animation)
  $( '.world-avatar' ).transition({

    'width'         : '50px',
    'height'        : '50px',
    'transform'     : 'translate( ' + ( - interval ) + 'px , -4px )'

  }, 120, 'in').transition({

    'width'         : '46px',
    'height'        : '46px',
    'transform'     : 'translate( ' + ( - interval*2 ) + 'px , -5.7px )'

  }, 120, 'linear').transition({

    'width'         : '42px',
    'height'        : '42px',
    'transform'     : 'translate( ' + ( - interval*3 ) + 'px , -25.7px )'

  }, 120, 'linear').transition({

    'width'         : '40px',
    'height'        : '40px',
    'transform'     : 'translate( ' + ( - interval*4 ) + 'px , -49.5px )'

  }, 120, 'linear').transition({

    'width'         : '34px',
    'height'        : '34px',
    'transform'     : 'translate( ' + ( - interval*5 ) + 'px , -63.1px )'

  }, 120, 'linear').transition({

    'width'         : '33px',
    'height'        : '33px',
    'transform'     : 'translate( ' + ( - interval*6 ) + 'px , -68px )'

  }, 120, 'out');

  var title = $( '.world-title' );
  var titleLeft = parseInt($( '.world-title' ).css( 'margin-left' ));
  var distance = titleLeft - 116;

  title.css( 'margin-left' , titleLeft );

  // Title goes up (animation)
  $( '.world-title' ).transition({

    'transform'     : 'translate( ' + ( - distance ) + 'px , -116px )',
    'font-size'     : '15px',
    'color'         : '#545f65'

  }, 1000);

  // Cover compress (animation)
  $( '.cover' ).stop().clearQueue().transition({

      'height'       : 57

  }, 1000, function(){

    state = 0;
    onTransition = false;

  });

  // Appear cover box-shadow (animation)
  $( '.pre-cover' ).stop().clearQueue().transition({

    'box-shadow'  : '1px 1px rgba(0,0,0,.05)'

  }, 500);

  // Shadow and image dissappear (animation)
  $( '.shadow, .back-image' ).stop().clearQueue().transition({

      'opacity' : '0'

  }, 1000);

  // Card list gets bigger (animation)
  $( '.cards-list' ).stop().clearQueue().transition({

      'height' : 'calc(100% - 58px)',
      'top'    : 58

  }, 1000);

  // User preview circles goes up (animation)
  $( '.users-preview-container' ).stop().clearQueue().transition({

      'top'       : 85,
      'opacity'   : 0

  }, 300, 'linear').transition({

      'top'     : -45

  }, 250, function(){

      $( '.users-preview-container' ).css( 'top' , '85px' );

  });

  // Slider spots goes up (animation)
  $( '.spot' ).stop().clearQueue().transition({

    'top'       : 150,
    'opacity'   : 0

  }, 300, 'linear').transition({

    'top'     : -45

  }, 250, function(){

    $( '.spot' ).css( 'top' , '150px' );

  });

  // Search background changes (animation)
  $( '.search-button' ).stop().clearQueue().transition({

    'background-color'       : '#f7f8fa'

  }, 1000);


}

// Decompress de cover to show better the cards
var decompressCover = function(){

  onTransition = true;
  $( '.ui-window' ).removeClass( 'scrolled' );

  var avatar = $( '.world-avatar' );
  var avatarLeft = ( parseInt( $('.cover-first').css( 'width' ) ) - 52 ) / 2;
  var distance = avatarLeft - 73;
  var interval = distance/6;

  // Avatar goes down (animation)
  $( '.world-avatar' ).transition({

    'width'         : '34px',
    'height'        : '34px',
    'transform'     : 'translate( ' + ( - interval*5 ) + 'px , -63.1px )'

  }, 120, 'in').transition({

    'width'         : '40px',
    'height'        : '40px',
    'transform'     : 'translate( ' + ( - interval*4 ) + 'px , -49.5px )'

  }, 120, 'linear').transition({

    'width'         : '42px',
    'height'        : '42px',
    'transform'     : 'translate( ' + ( - interval*3 ) + 'px , -25.7px )'

  }, 120, 'linear').transition({

    'width'         : '46px',
    'height'        : '46px',
    'transform'     : 'translate( ' + ( - interval*2 ) + 'px , -5.7px )'

  }, 120, 'linear').transition({

    'width'         : '50px',
    'height'        : '50px',
    'transform'     : 'translate( ' + ( - interval ) + 'px , -4px )'

  }, 120, 'linear').transition({

    'width'         : '52px',
    'height'        : '52px',
    'transform'     : 'translate( 0px , 0px )'

  }, 150, 'out');

  // Title goes down (animation)
  $( '.world-title' ).transition({

    'transform'     : 'translate( 0px , 0px )',
    'font-size'     : '37px',
    'color'         : '#fff'

  }, 1000);

  // Cover decompress (animation)
  $( '.cover' ).stop().clearQueue().transition({

      'height'      : 317

  }, 1000, function(){

    state = 1;
    onTransition = false;

    avatar.css({

      'transform' : 'translate(0,0)',
      'margin'    : '0 auto'

    })


  });

  // Disappear cover box-shadow (animation)
  $( '.pre-cover' ).stop().clearQueue().transition({

    'box-shadow'        : 'none'

  }, 1000);;

  // Shadow and image appear (animation)
  $( '.shadow, .back-image' ).stop().clearQueue().transition({

      'opacity' : '1'

  }, 1000);;

  // Card list gets smaller (animation)
  $( '.cards-list' ).stop().clearQueue().transition({

      'height' : 'calc(100% - 317px)',
      'top'    : 317

  }, 1000);

  // User preview circles goes down (animation)
  console.log($( '.users-preview-container' ).css('top'));
  $( '.users-preview-container' ).stop().clearQueue().transition({

    delay : 350,
    'top' : 229,
    'opacity' : 1

  }, 500);

  // Slider spots goes down (animation)
  $( '.spot' ).stop().clearQueue().transition({

    delay     : 350,
    'top'     : 294,
    'opacity' : 1

  }, 500);

  // Search background changes (animation)
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
  $( '.stars, .search-title, .search-bar, .tend-text, .world-card:nth-child(1)' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // New world button appears and goes up
  $( '.new-world-button, .close-explore' ).stop().clearQueue().transition({

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

    $( '.stars, .search-title, .search-bar, .close-explore, .tend-text, .world-card' ).css({
      'transform' : 'translateY(20px)',
      'opacity'   : 0
    });

    $( '.new-world-button, .close-explore' ).css({
      'transform' : 'translateY(10px)',
      'opacity'   : 0
    });

    $( '.planet' ).css({
      'transform' : 'translate( 40px , 40px )',
      'opacity'   : 0
    });

  });

}

var usersGoesUp = function(){

  $( '.world-avatar, .world-title, .users-preview-container, .spot' ).stop().clearQueue().transition({

    'transform' : 'translateY(-310px)'

  }, 1000);

}

// INIT Chat
initCosmos();
