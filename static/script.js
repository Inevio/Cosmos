// --- VARS ---
var animationEffect  = 'cubic-bezier(.4,0,.2,1)';
var animationEffect2 = 'cubic-bezier(.18,.48,.2,1)';
var showingUsers    = false;
var onTransition    = false;
var state           = 1;
var titleLength     = 0;
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
var arrowUp         = $( '.arrow-up' );
var newWorldButton  = $( '.new-world-button, .new-world-button-mini' );
var closeNewWorld   = $( '.close-new-world' );
var notifications   = $( '.notifications' );
var newPostButton   = $( '.new-post' );
var closeNewCard    = $( '.close-new-card' );
var worldCategory   = $( '.category .opener, .category .category-name' );
var searchBar       = $( '.search-button' );
var searchBarFigure = $( '.search-button i' );
var commentsButtons = $( '.comments-text' );
var youtubePreviewButton = $( '.you-card .activate-preview, .you-card .triangle-down' );
var searchExplore   = $( '.explore-container .search-bar' );
var cardOptionsBut  = $( '.card-options' );
var worldOptionsHelp = $( '.privacy-options .option i' );

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

  if ( showingUsers ) {
    return;
  }

  if ( state == 1 && !onTransition && y < 0) {

    compressCover();
    $('.cards-list').scrollTop( 6 );

  }else if( state == 0 && !onTransition && y > 0 ){

    decompressCover();
    $('.cards-list').scrollTop( 0 );

  }

});

cardList.on( 'mousewheel' , function( e , d , x , y ){

  if ( showingUsers ) {
    return;
  }

  var obj = $( this );

  console.log( state , onTransition , y );

  if( onTransition ){

    e.preventDefault();
    e.stopPropagation();

  }

  if ( state == 1 && !onTransition && y < 0) {

    e.preventDefault();
    e.stopPropagation();
    compressCover();

  }else if( state == 0 && !onTransition && obj.scrollTop() < 5 && y > 0 ){

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

arrowUp.on( 'click', function(){

  usersGoesDown();

});

newWorldButton.on( 'click' , function(){

  newWorldAnimationA();

});

closeNewWorld.on( 'click' , function(){

  newWorldAnimationOut();

});

notifications.on( 'click' , function(){

  $( '.notifications-container' ).toggleClass( 'popup' );
  $( '.notifications-container *' ).toggleClass( 'popup' );


});

newPostButton.on( 'click' , function(){

  $( '.new-card-container' ).toggleClass( 'popup' );
  $( '.new-card-container *' ).toggleClass( 'popup' );

});

closeNewCard.on( 'click' , function(){

  $( '.new-card-container' ).toggleClass( 'popup' );
  $( '.new-card-container *' ).toggleClass( 'popup' );

});

worldCategory.on( 'click' , function(){

  var category = $(this).parent();
  category.toggleClass('closed');
  if ( category.hasClass( 'closed' ) ) {
    category.find( '.world-list' ).css( 'height' , category.find( '.world-list' ).css( 'height' ) );
    category.find( '.world-list' ).transition({

      'height'         : '0px'

    }, 200);
  }else{
    var height = category.find( '.world' ).length * 28;
    category.find( '.world-list' ).transition({

      'height'         : height

    }, 200);


  }

});

searchBar.on( 'click' , function(){

  $( this ).addClass( 'popup' );
  $( this ).find( 'input' ).focus();
  $( this ).find( 'input' ).val('');


});

searchBarFigure.on( 'click' , function(){

  $( this ).parent().addClass( 'popup' );

});

commentsButtons.on( 'click' , function(){

  var card = $(this).parent().parent();
  var height = parseInt(card.find('.comments-list').css('height')) + 50;
  var commentsSection = card.find( '.comments-section' );

  if (commentsSection.hasClass('opened')) {

    commentsSection.css('height', height);
    commentsSection.transition({

      'height'         : 0

    }, 200, function(){

      commentsSection.removeClass('opened');

    });

  }else{

    commentsSection.transition({

      'height'         : height

    }, 200, function(){

      commentsSection.addClass('opened');
      commentsSection.css('height', 'auto');

    });


  }



});

youtubePreviewButton.on( 'click' , function(){

  $(this).parent().find( '.video-preview' ).toggleClass( 'hidden' );

});

searchExplore.on( 'click' , function(){

  $(this).addClass('popup');

});

cardOptionsBut.on( 'click' , function(){

  $( this ).parent().find( '.card-options-section' ).addClass( 'popup' );
  $( this ).parent().find( '.card-options-section *' ).addClass( 'popup' );

});

worldOptionsHelp.on( 'mouseenter' , function(){

  var popup = $( this ).parent().find( '.info-section' );

  popup.show();
  popup.transition({

    'opacity'         : 1

  }, 200, animationEffect);

});

worldOptionsHelp.on( 'mouseleave' , function(){

  var popup = $( this ).parent().find( '.info-section' );

  popup.transition({

    'opacity'         : 0

  }, 200, animationEffect, function(){

    popup.hide();

  });

});

app

.on( 'click' , function( e ){

  if ( ! $( e.target ).hasClass( 'popup' ) && ! $( e.target ).hasClass( 'popup-launcher' ) ) {

    $( '.popup' ).removeClass( 'popup' );

  }

})

.on( 'click' , '.create-world-button.step-a' , function(){

  newWorldAnimationB();

})

.on( 'ui-view-resize', function(){

  $('.cards-grid').isotope({
    itemSelector: '.card',
    masonry: {
      columnWidth: 551,
      fitWidth: true
    }
  });

})

.on( 'ui-view-maximize', function(){

  $('.cards-grid').isotope({
    itemSelector: '.card',
    masonry: {
      columnWidth: 551,
      fitWidth: true
    }
  });

})

.on( 'ui-view-unmaximize', function(){

  $('.cards-grid').isotope({
    itemSelector: '.card',
    masonry: {
      columnWidth: 551,
      fitWidth: true
    }
  });

})

.on( 'mouseenter' , '.user-circle' , function(){

  var position = $(this).position();

  $( '.users-circles-container .user-hover' ).css({
    'top'     : ( 89 + position.top ),
    'left'    : ( position.left - 29 ),
    'opacity' : 0.9
  });

})

.on( 'mouseleave' , '.user-circle' , function(){

  console.log($(this).offset());

  $( '.users-circles-container .user-hover' ).css({
    'opacity' : 0
  });

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

  $( '.cover-first' ).stop().clearQueue().transition({

    'margin-left' : '-50%'

  }, 800);

  $( '.spot-cover' ).stop().clearQueue().transition({

    'background-color' : 'transparent'

  }, 800);

  $( '.spot-desc' ).stop().clearQueue().transition({

    'background-color' : '#c8c9cc'

  }, 800);

}

var moveToCover = function(){

  $( '.cover-first' ).stop().clearQueue().transition({

    'margin-left' : '0'

  }, 800);

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
  var avatarLeftM = parseInt( avatar.css( 'margin-left' ) );
  var avatarLeft = (parseInt($('.cover-first').css( 'width' )) - parseInt(avatar.css( 'width' )))/2;

  if(avatarLeftM){

    avatar.css( 'margin-left' , avatarLeftM );

  }else{

    avatar.css( 'margin-left' , avatarLeft );


  }

  var distance =  ( avatarLeft || avatarLeftM ) - 73;
  var interval = distance/6;

  // Avatar goes up (animation)
  $( '.world-avatar' ).transition({

    'width'         : '33px',
    'height'        : '33px',
    'transform'     : 'translateY( -72px )',
    'margin-left'   : 73

  }, 1000, animationEffect);

  var title = $( '.world-title' );

  var titleLeftM = parseInt($( '.world-title' ).css( 'margin-left' ));
  titleLength = parseInt(title.css( 'width' ));
  var titleLeft = (parseInt($('.cover-first').css( 'width' )) - titleLength)/2;

  if(titleLeftM){

    title.css( 'margin-left' , titleLeftM );

  }else{

    title.css( 'margin-left' , titleLeft );

  }

  var distance = ( titleLeft || titleLeftM ) - 116;


  // Title goes up (animation)
  $( '.world-title' ).transition({

    'transform'     : 'translateY( -107px )',
    'margin-left'   : 116,
    'font-size'     : '15px',
    'color'         : '#545f65'

  }, 1000, animationEffect);

  // Cover compress (animation)
  $( '.cover' ).stop().clearQueue().transition({

      'height'       : 57,
      'background-color'  : '#fff'

  }, 1000, animationEffect , function(){

    state = 0;
    onTransition = false;

  });

  // Appear cover box-shadow (animation)
  $( '.pre-cover' ).stop().clearQueue().transition({

    'box-shadow'  : '1px 1px rgba(0,0,0,.05)'

  }, 500 , animationEffect);

  // Shadow and image dissappear (animation)
  $( '.shadow, .back-image' ).stop().clearQueue().transition({

      'opacity' : '0'

  }, 1000, animationEffect);

  // Card list gets bigger (animation)
  $( '.cards-list' ).stop().clearQueue().transition({

      'height' : 'calc(100% - 58px)',
      'top'    : 58

  }, 1000, animationEffect);

  // User preview circles goes up (animation)
  $( '.users-preview-container' ).stop().clearQueue().transition({

      'top'       : 85,
      'opacity'   : 0

  }, 370, 'in').transition({

      'top'     : -45

  }, 250, function(){

      $( '.users-preview-container' ).css( 'top' , '85px' );

  });

  // Slider spots goes up (animation)
  $( '.spot' ).stop().clearQueue().transition({

    'top'       : 150,
    'opacity'   : 0

  }, 370, 'in').transition({

    'top'     : -45

  }, 250, function(){

    $( '.spot' ).css( 'top' , '150px' );

  });

  // Search background changes (animation)
  $( '.search-button' ).stop().clearQueue().transition({

    'background-color'       : '#f7f8fa'

  }, 1000, animationEffect);

  // Search background changes (animation)
  $( '.app-buttons' ).stop().clearQueue().transition({

    'border-color'       : 'rgba( 204, 211, 213, 0.5 )'

  }, 1000, animationEffect);


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

    'width'         : '52px',
    'height'        : '52px',
    'transform'     : 'translateY( 0px )',
    'margin-left'   : avatarLeft

  }, 1000, animationEffect);

  var title = $( '.world-title' );
  var titleLeft = (parseInt($('.cover-first').css( 'width' )) - titleLength)/2;
  console.log(parseInt($('.cover-first').css( 'width' )), parseInt(title.css( 'width' )), titleLeft);

  // Title goes down (animation)
  $( '.world-title' ).transition({

    'transform'     : 'translateY( 0px )',
    'font-size'     : '37px',
    'color'         : '#fff',
    'margin-left'   : titleLeft

  }, 1000, animationEffect);

  // Cover decompress (animation)
  $( '.cover' ).stop().clearQueue().transition({

      'height'      : 317,
      'background-color'  : 'transparent'

  }, 1000, animationEffect , function(){

    state = 1;
    onTransition = false;

    avatar.css({

      'transform' : 'translate(0,0)',
      'margin'    : '0 auto'

    })

    $( '.world-title' ).css({

      'transform' : 'translate(0,0)',
      'margin'    : '0 auto'

    })


  });

  // Disappear cover box-shadow (animation)
  $( '.pre-cover' ).stop().clearQueue().transition({

    'box-shadow'        : 'none'

  }, 1000, animationEffect );

  // Shadow and image appear (animation)
  $( '.shadow, .back-image' ).stop().clearQueue().transition({

      'opacity' : '1'

  }, 1000 , animationEffect );

  // Card list gets smaller (animation)
  $( '.cards-list' ).stop().clearQueue().transition({

      'height' : 'calc(100% - 317px)',
      'top'    : 317

  }, 1000, animationEffect );

  // User preview circles goes down (animation)
  console.log($( '.users-preview-container' ).css('top'));
  $( '.users-preview-container' ).stop().clearQueue().transition({

    delay : 320,
    'top' : 229,
    'opacity' : 1

  }, 535, 'cubic-bezier(0,0,.5,1)' );

  // Slider spots goes down (animation)
  $( '.spot' ).stop().clearQueue().transition({

    delay     : 320,
    'top'     : 294,
    'opacity' : 1

  }, 535, 'cubic-bezier(0,0,.5,1)');

  // Search background changes (animation)
  $( '.search-button' ).stop().clearQueue().transition({

    'background-color'       : 'rgba(0, 0, 0, 0.3)'

  }, 1000, animationEffect );

  // Search background changes (animation)
  $( '.app-buttons' ).stop().clearQueue().transition({

    'border-color'       : '#83878d'

  }, 1000, animationEffect);

}

var exploreAnimationIn = function(){

  var exploreSection = $( '.explore-section' );

  exploreSection.css( 'display' , 'block');

  // Fade in blue background
  exploreSection.stop().clearQueue().transition({

    'opacity' : 1

  }, 300, animationEffect);

  // New world button appears and goes up
  $( '.planet' ).stop().clearQueue().transition({

    delay       : 440,
    'opacity'   : 1,
    'transform' : 'translate(0px,0px)'

  }, 1300, 'out');

  // Stars appears and goes up
  $( '.stars, .search-title, .search-bar, .tend-text' ).stop().clearQueue().transition({

    delay       : 550,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 500, animationEffect);

  // New world button appears and goes up
  $( '.new-world-button, .close-explore' ).stop().clearQueue().transition({

    delay       : 800,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 450, animationEffect);

  // World cards appears and goes up
  var cards = $( '.tend-list .world-card' );
  $.each( cards , function( i , card ){

    var d = i * 150;

    $( card ).transition({

      delay       : (550 + d),
      'opacity'   : 1,
      'transform' : 'translateY(0px)'

    }, 1000);

  });

}

var exploreAnimationOut = function(){

  var exploreSection = $( '.explore-section' );

  // Fade out blue background
  exploreSection.stop().clearQueue().transition({

    'opacity' : 0

  }, 300, function(){

    exploreSection.css( 'display' , 'none' );

    $( '.new-world-button, .close-explore' ).css({
      'transform' : 'translateY(10px)',
      'opacity'   : 0
    });

    $( '.planet' ).css({
      'transform' : 'translate( 120px , 100px )',
      'opacity'   : 0
    });

  });

  // Stars goes down
  $( '.stars, .search-title, .search-bar, .tend-text' ).stop().clearQueue().transition({

    'opacity'   : 0,
    'transform' : 'translateY(20px)'

  }, 300);

  // New world button goes down
  $( '.new-world-button, .close-explore' ).stop().clearQueue().transition({

    'opacity'   : 0,
    'transform' : 'translateY(10px)'

  }, 300);

  // World cards button goes down
  $( '.world-card' ).stop().clearQueue().transition({

    'opacity'   : 0,
    'transform' : 'translateY(40px)'

  }, 300);

}

var usersGoesUp = function(){

  showingUsers = true;

  $( '.world-avatar, .world-title, .users-preview-container, .spot' ).stop().clearQueue().transition({

    'transform' : 'translateY(-310px)'

  }, 1000);

  $( '.users-circles-container' ).stop().clearQueue().transition({

    'transform' : 'translateY(0px)'

  }, 1000);

  $( '.more-info' ).stop().clearQueue().transition({

    'opacity' : '0'

  }, 1000);

}

var usersGoesDown = function(){

  showingUsers = false;

  $( '.world-avatar, .world-title, .users-preview-container, .spot' ).stop().clearQueue().transition({

    'transform' : 'translateY(0px)'

  }, 1000);

  $( '.users-circles-container' ).stop().clearQueue().transition({

    'transform' : 'translateY(350px)'

  }, 1000);

  $( '.more-info' ).stop().clearQueue().transition({

    'opacity' : '0.7'

  }, 1000);


}

var newWorldAnimationA = function(){

  var newWorldContainer = $( '.new-world-container' );

  newWorldContainer.css( 'display' , 'block');

  // Fade in White background (animation)
  newWorldContainer.stop().clearQueue().transition({

    'opacity' : 1

  }, 1000);

  // Fade in and goes up title (animation)
  $( '.new-world-title' ).stop().clearQueue().transition({

    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up esc (animation)
  $( '.close-new-world' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up name (animation)
  $( '.new-world-name' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up button (animation)
  $( '.create-world-button' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);


}

var newWorldAnimationB = function(){

  $( '.new-world-avatar' ).show();
  $( '.new-world-desc' ).show();
  $( '.new-world-privacy' ).show();
  $( '.new-world-title' ).addClass( 'second' );
  $( '.create-world-button' ).addClass( 'step-b' );
  $( '.create-world-button' ).removeClass( 'step-a' );

  // Fade in and goes up title (animation)
  $( '.new-world-title' ).stop().clearQueue().transition({

    'transform' : 'translateY(-67px)'

  }, 1000, animationEffect);

  // Fade in and goes up name (animation)
  $( '.new-world-name' ).stop().clearQueue().transition({

    'opacity'   : 0,
    'transform' : 'translateX(-200px)'

  }, 1000, animationEffect);

  // Fade in and goes up button (animation)
  $( '.create-world-button' ).stop().clearQueue().transition({

    'opacity'   : 0

  }, 1000, animationEffect, function(){

    $( this ).css( {

      'top'       : '819px',
      'transform' : 'translateY(20px)',
      'right'     : '0',
      'left'      : 'calc(50% - 472px/2 + 150px)'

    } ).find( 'span' ).text( 'Crear mundo' );

  });

  // Fade in and goes up avatar (animation)
  $( '.new-world-avatar' ).stop().clearQueue().transition({

    delay       : 1250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up desc (animation)
  $( '.new-world-desc' ).stop().clearQueue().transition({

    delay       : 1500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up privacy (animation)
  $( '.new-world-privacy' ).stop().clearQueue().transition({

    delay       : 1750,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up privacy (animation)
  $( '.create-world-button' ).transition({

    delay       : 2000,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);


}

var newWorldAnimationOut = function(){

  var newWorldContainer = $( '.new-world-container' );

  // Fade out White background
  newWorldContainer.stop().clearQueue().transition({

    'opacity' : 0

  }, 1000, function(){

    newWorldContainer.css( 'display' , 'none' );
    $( '.new-world-avatar' ).hide();
    $( '.new-world-desc' ).hide();
    $( '.new-world-privacy' ).hide();
    $( '.new-world-title' ).removeClass( 'second' );
    $( '.create-world-button' ).removeClass( 'step-b' );
    $( '.create-world-button' ).addClass( 'step-a' );

    $( '.new-world-title, .new-world-name, .create-world-button, .new-world-avatar, .new-world-desc, .new-world-privacy' ).css({
      'transform' : 'translateY(20px)',
      'opacity'   : 0
    });

    $( '.close-new-world' ).css({
      'transform' : 'translateY(10px)',
      'opacity'   : 0
    });

    $( '.create-world-button' ).css( {

      'top'       : '383px',
      'transform' : 'translateY(20px)',
      'left'      : 'calc((50% - 236px) + 298px)'

    } ).find( 'span' ).text( 'Siguiente' );


  });

}

// INIT Chat
initCosmos();
