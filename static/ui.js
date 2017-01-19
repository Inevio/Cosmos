// --- VARS ---
var animationEffect  = 'cubic-bezier(.4,0,.2,1)';
var animationEffect2 = 'cubic-bezier(.18,.48,.2,1)';
var showingUsers    = false;
var onTransition    = false;
var state           = 1;
var titleLength     = 0;
var worldRecortedName;
var worldCompleteName;
var app             = $( this );
var cover           = $( '.cover' );
var worldTitle      = $( '.world-title' );
var spotDesc        = $( '.spot-desc' );
var spotCover       = $( '.spot-cover' );
var goBack          = $( '.go-back' );
var moreInfo        = $( '.more-info' );
var uiContent       = $( '.ui-content' );
var cardList        = $( '.cards-list' );
var exploreButton   = $( '.explore-button, .explore-button-no-worlds' );
var closeExplore    = $( '.close-explore' );
var moreUsersButton = $( '.more-users' );
var arrowUp         = $( '.arrow-up' );
var newWorldButton  = $( '.new-world-button, .new-world-button-no-worlds, .new-world-button-mini' );
var closeNewWorld   = $( '.close-new-world' );
var notifications   = $( '.notifications' );
var newPostButton   = $( '.new-post, .no-post-new-post-button' );
var worldCategory   = $( '.category .opener, .category .category-name' );
var searchBar       = $( '.search-button' );
var searchBarFigure = $( '.search-button i' );
var searchExplore   = $( '.explore-container .search-bar' );
var worldOptionsHelp = $( '.privacy-options .option i' );
var attachCommentBut = $( '.comments-footer .attachments, .comments-footer .attachments i, .comments-footer .attachments div' );
var privacyOption    = $( '.privacy-options .option' );
var unFollowButton   = $( '.stop-follow' );
var selectWorld      = $( '.select-world' );
var noWorlds         = $( '.no-worlds' );
var starsCanvasContainer  = $( '.stars-canvas' );


// --- EVENTS ---
// SERVER EVENTS
api.cosmos.on( 'postRemoved', function( postId , world ){

  var worldSelected = $( '.world.active' ).data( 'world' );
  if ( worldSelected.id === world.id ) {

    if ( $( '.post-' + postId ) ) {

      $( '.post-' + postId ).remove();
      if ( $( '.cardDom' ).length === 0 ) {

        $( '.no-posts' ).css( 'opacity' , '1' );
        $( '.no-posts' ).show();
        app.addClass( 'no-post' );
        decompressCover();

      }

    }

    if ( $( '.comment-' + postId ) ) {

      var card = $( '.comment-' + postId ).closest('.card');
      var commentsText = card.find( '.comments-text' );
      var ncomments = commentsText.data( 'num' ) - 1;
      if ( ncomments === 1 ) {
        commentsText.text( ncomments + ' ' + lang.comment );
      }else{
        commentsText.text( ncomments + ' ' + lang.comments );
      }
      commentsText.data( 'num' , ncomments );

      if ( ncomments === 0 ) {

        var commentsSection = card.find( '.comments-section' );

        card.removeClass( 'comments-open' );
        commentsSection.transition({

          'height'         : 0

        }, 200, function(){

          commentsSection.removeClass('opened');

        });

      }

      $( '.comment-' + postId ).remove();

    }

    if ( $( '.reply-' + postId ) ) {

      $( '.reply-' + postId ).remove();

    }

  }

});
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
    usersGoesDownNoAnimation();
  }

  if ( state == 1 && !onTransition && y < 0) {

    compressCover();
    $('.cards-list').scrollTop( 6 );

  }

});

cover.on( 'mouseup' , function(){
  if(app.hasClass('wz-view-dragging')) return;
  decompressCover();
} );

cardList.on( 'mousewheel' , function( e ){

  if ( showingUsers ) {
    usersGoesDownNoAnimation();
  }

  var obj = $( this );

  if( onTransition ){

    e.preventDefault();
    e.stopPropagation();

  }

  if ( state == 1 && !onTransition ) {

    e.preventDefault();
    e.stopPropagation();
    compressCover();

  }

});

cardList.on( 'scroll' , function( e ){

  e.preventDefault();
  e.stopPropagation();

  if ( showingUsers ) {
    usersGoesDownNoAnimation();
  }
  var obj = $( this );
  if ( state == 1 && !onTransition ) {
    e.preventDefault();
    e.stopPropagation();
    compressCover();
  }

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
  $( '.new-world-container' ).removeClass( 'editing' );

});

notifications.on( 'click' , function(){

  $( '.notifications-container' ).toggleClass( 'popup' );
  $( '.notifications-container *' ).toggleClass( 'popup' );


});

newPostButton.on( 'click' , function(){

  api.app.createView( { type: 'manual' , world: app.data( 'worldSelected' ) } , 'newPost' );

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

});

searchBarFigure.on( 'click' , function(){

  $( this ).parent().addClass( 'popup' );

});

searchExplore.on( 'click' , function(){

  $(this).addClass('popup');

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

attachCommentBut.on( 'click' , function(){

  $( this ).parent().find( '.attach-select' ).show();
  $( this ).parent().find( '.attach-select' ).addClass( 'popup' );
  $( this ).parent().find( '.attach-select *' ).addClass( 'popup' );

});

privacyOption.on( 'click' , function(){

  $( '.privacy-options .option' ).removeClass( 'active' );
  $( this ).addClass( 'active' );

});

unFollowButton.on( 'click' , function(){

  $( '.new-world-title input' ).val('');

  if ( $( this ).hasClass( 'editable' ) ) {

    $( '.new-world-container' ).addClass( 'editing' );
    $( '.delete-world-button' ).removeClass( 'hide' );

    newWorldAnimationB();

    var world = app.data( 'worldSelected' );
    if (world.hasCustomIcon) {
      $( '.wz-groupicon-uploader-start' ).removeClass('non-icon');
      $( '.wz-groupicon-uploader-start' ).addClass('custom-icon');
    }else{
      $( '.wz-groupicon-uploader-start' ).removeClass('custom-icon');
      $( '.wz-groupicon-uploader-start' ).addClass('non-icon');
    }

    $( '.new-world-desc textarea' ).val( world.description );
    $( '.new-world-name input' ).val( world.name );
    $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'url(' + world.icons.normal + '?' + Date.now() + ')' );
    $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id );
    $( '.privacy-options .option' ).removeClass( 'active' );
    if ( world.isPrivate ) {
      $( '.privacy-options .hidden' ).addClass( 'active' );
    }else{
      $( '.privacy-options .public' ).addClass( 'active' );
    }

  }

});

cardList.on( 'mousewheel' , '.comments-list' , function( e ){

  if ( $(this).scrollTop() ) {
    e.stopPropagation();
  }

});

app

.on( 'click' , function( e ){

  if ( ! $( e.target ).hasClass( 'popup' ) && ! $( e.target ).hasClass( 'popup-launcher' ) ) {

    $( '.popup' ).removeClass( 'popup' );
    $( this ).parent().find( '.comments-footer .attach-select' ).hide();


  }

  var commentOnEditMode = $( '.comment.editing' );
  if ( commentOnEditMode.length > 0 && ! $( e.target ).hasClass( 'comment-text-edit' ) && ! $( e.target ).hasClass( 'edit-button' )) {
    commentOnEditMode.removeClass( 'editing' );
    commentOnEditMode.data( 'reply' ).setContent( commentOnEditMode.find( '.comment-text-edit' ).val() );
    commentOnEditMode.find('.edit-button').removeClass( 'save' );
    commentOnEditMode.find('.edit-button').text( lang.edit );
  }

})

.on( 'click' , '.create-world-button.step-a' , function(){

  if ( $( '.new-world-name input' ).val() ) {

    newWorldAnimationB();

  }

})

.on( 'keyup' , '.new-world-name input' , function( e ){

  if (e.keyCode == 13 && $( '.new-world-name input' ).val() ) {

    $( this ).parent().parent().find( '.create-world-button' ).click();

  }

})

.on( 'click' , '.create-world-button.step-b , .delete-world-button' , function(){

  newWorldAnimationOut();

})
/*
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
*/
.on( 'mouseenter' , '.user-circle' , function(){

  var position = $(this).position();

  $( '.users-circles-container .user-hover span' ).text( $( this ).data( 'user' ).name );

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

})

.on( 'click' , '.card-options' , function(){

  var post = $( this ).closest( '.card' ).data( 'post' );

  $( this ).parent().find( '.card-options-section' ).addClass( 'popup' );
  $( this ).parent().find( '.card-options-section *' ).addClass( 'popup' );

})

.on( 'click' , '.you-card .activate-preview, .you-card .triangle-down' , function(){

  $(this).parent().find( '.video-preview' ).toggleClass( 'hidden' );

})

.on( 'click' , '.comments-opener' , function(){

  var card = $(this).parent().parent();
  var height = parseInt(card.find('.comments-list').css('height')) + 50;
  var commentsSection = card.find( '.comments-section' );

  if (commentsSection.hasClass('opened')) {

    commentsSection.css('height', height);
    card.removeClass( 'comments-open' );
    commentsSection.transition({

      'height'         : 0

    }, 200, function(){

      commentsSection.removeClass('opened');

    });

  }else{

    card.addClass( 'comments-open' );
    commentsSection.transition({

      'height'         : height

    }, 200, function(){

      commentsSection.addClass('opened');
      commentsSection.css('height', 'auto');
      commentsSection.find( 'textarea' ).focus();

    });


  }

})

.on( 'click' , '.world' , function(){

  if ( app.hasClass( 'user-animation' ) ) {
    usersGoesDown();
  }else if( app.hasClass( 'desc-animation' ) ){
    moveToCover();
  }else if( app.hasClass( 'cover-animation' ) ){
    decompressCover( true );
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

  $( '.cover-first' ).stop().clearQueue().transition({

    'margin-left' : '-50%'

  }, 800);

  $( '.spot-cover' ).stop().clearQueue().transition({

    'background-color' : 'transparent'

  }, 800);

  $( '.spot-desc' ).stop().clearQueue().transition({

    'background-color' : '#c8c9cc'

  }, 800);

  app.addClass( 'desc-animation' );


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

  app.removeClass( 'desc-animation' );

}

// Compress de cover to show better the cards
var compressCover = function(){

  $( '.cover' ).addClass( 'compresed' );

  if ( app.hasClass( 'no-post' ) ) {
    return;
  }

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

  }, 1000, animationEffect , function(){

    worldRecortedName = $( '.world-title' ).text();
    worldCompleteName = $( '.world.active' ).data( 'world' ).name;
    $( '.world-title' ).text( worldCompleteName );

  });

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

  app.addClass( 'cover-animation' );

}

// Decompress de cover to show better the cards
var decompressCover = function( instant ){

  $( '.cover' ).removeClass( 'compresed' );

  var name = worldTitle.data( 'name' );
  var winWidth = parseInt(app.css( 'width' ));
  var textWidth = Math.floor( winWidth * 0.032 );
  if ( name.length > textWidth ) {
    worldTitle.text( name.substr(0 , textWidth - 3) + '...' );
  }else{
    worldTitle.text( name );
  }

  if ( instant ) {

    $( '.world-avatar' ).css({

      'width'         : '52px',
      'height'        : '52px',
      'transform'     : 'translate(0,0)',
      'margin'        : '0 auto'

    });

    $( '.world-title' ).css({

      'font-size'     : '37px',
      'color'         : '#fff',
      'transform'     : 'translate(0,0)',
      'margin'        : '0 auto'

    });

    $( '.cover' ).css({

        'height'      : 317,
        'background-color'  : 'transparent'

    });

    $( '.pre-cover' ).css({

      'box-shadow'        : 'none'

    });

    $( '.shadow, .back-image' ).css({

        'opacity' : '1'

    });

    $( '.cards-list' ).css({

        'height' : 'calc(100% - 317px)',
        'top'    : 317

    });

    $( '.users-preview-container' ).css({

      delay : 320,
      'top' : 229,
      'opacity' : 1

    });

    $( '.spot' ).css({

      delay     : 320,
      'top'     : 294,
      'opacity' : 1

    });

    $( '.search-button' ).css({

      'background-color'       : 'rgba(0, 0, 0, 0.3)'

    });

    $( '.app-buttons' ).css({

      'border-color'       : '#83878d'

    });

    app.removeClass( 'cover-animation' );
    state = 1;
    onTransition = false;
    return;

  }

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

  app.removeClass( 'cover-animation' );


}

var exploreAnimationOut = function(){

  if ( $( '.worldDom' ).length === 0 ) {

    noWorlds.show();
    noWorlds.transition({

      'opacity'         : 1

    }, 200, animationEffect );

  }else{

    noWorlds.transition({

      'opacity'         : 0

    }, 200, animationEffect , function(){

      noWorlds.hide();
      starsCanvasContainer.stop().clearQueue().transition({

        'opacity' : 0


      }, 300 , function(){

        starsCanvasContainer.addClass( 'no-visible' );

      });

    });
  }

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

  app.addClass( 'user-animation' );

}

var usersGoesDownNoAnimation = function(){

  showingUsers = false;

  $( '.world-avatar, .world-title, .users-preview-container, .spot' ).css({

    'transform' : 'translateY(0px)'

  });

  $( '.users-circles-container' ).css({

    'transform' : 'translateY(350px)'

  });

  $( '.more-info' ).css({

    'opacity' : '0.7'

  });

  app.removeClass( 'user-animation' );

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

  app.removeClass( 'user-animation' );

}

var newWorldAnimationA = function(){

  var newWorldContainer = $( '.new-world-container-wrap' );

  $( '.new-world-name input' ).val( '' );

  newWorldContainer.css( 'display' , 'block');

  // Fade in White background (animation)
  newWorldContainer.stop().clearQueue().transition({

    'opacity' : 1

  }, 300);

  // Fade in and goes up title (animation)
  $( '.new-world-title' ).stop().clearQueue().transition({

    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 300);

  // Fade in and goes up esc (animation)
  $( '.close-new-world' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 300);

  // Fade in and goes up name (animation)
  $( '.new-world-name' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 300);

  // Fade in and goes up button (animation)
  $( '.create-world-button, .delete-world-button' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 300);


}

var newWorldAnimationB = function(){

  var editing = $( '.new-world-container' ).hasClass( 'editing' );

  $( '.new-world-container' ).css( 'height' , '933px' );

  if ( editing ) {

    newWorldAnimationBEditing();

  }else{

    newWorldAnimationBNormal();

  }

}

var newWorldAnimationBNormal = function(){

  $( '.new-world-avatar' ).show();
  $( '.new-world-desc' ).show();
  $( '.new-world-privacy' ).show();
  $( '.new-world-title' ).addClass( 'second' );
  $( '.create-world-button' ).addClass( 'step-b' );
  $( '.create-world-button' ).removeClass( 'step-a' );
  $( '.option.private-option' ).addClass( 'active' );
  $( '.option.public' ).removeClass( 'active' );


  $( '.new-world-desc textarea' ).val('');

  $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'none' );

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
  $( '.create-world-button , .delete-world-button' ).stop().clearQueue().transition({

    'opacity'   : 0

  }, 800, animationEffect, function(){

    $( this ).css( {

      'top'       : '819px',
      'transform' : 'translateY(20px)',
      'right'     : '0',
      'left'      : 'calc(50% - 472px/2 + 150px)'

    } ).find( 'span' ).text( lang.accept );


  });

  // Fade in and goes up avatar (animation)
  $( '.new-world-avatar' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up desc (animation)
  $( '.new-world-desc' ).stop().clearQueue().transition({

    delay       : 650,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up privacy (animation)
  $( '.new-world-privacy' ).stop().clearQueue().transition({

    delay       : 800,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

  // Fade in and goes up privacy (animation)
  $( '.create-world-button, .delete-world-button' ).transition({

    delay       : 950,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);

}

var newWorldAnimationBEditing = function(){

  bypassNewWorldAnimationA();

  $( '.new-world-avatar' ).show();
  $( '.new-world-desc' ).show();
  $( '.new-world-privacy' ).show();
  $( '.new-world-title' ).addClass( 'second' );
  $( '.create-world-button' ).addClass( 'step-b' );
  $( '.create-world-button' ).removeClass( 'step-a' );

  $('.new-world-container-wrap').scrollTop(0);

  // Fade in and goes up title (animation)
  $( '.new-world-title' ).stop().clearQueue().transition({

    'transform' : 'translateY(-67px)'

  }, 1000);
  // Fade in and goes up name (animation)
  $( '.new-world-name' ).stop().clearQueue().transition({

    delay       : 100,
    'opacity'   : 1,
    'transform' : 'translateY(-58px)'

  }, 1000);

  // Fade in and goes up avatar (animation)
  $( '.new-world-avatar' ).css( 'transform' , 'translateY(158px)' );
  $( '.new-world-avatar' ).stop().clearQueue().transition({

    delay       : 300,
    'opacity'   : 1,
    'transform' : 'translateY(120px)'

  }, 1000);

  // Fade in and goes up desc (animation)
  $( '.new-world-desc' ).css( 'transform' , 'translateY(158px)' );
  $( '.new-world-desc' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY(120px)'

  }, 1000);

  // Fade in and goes up privacy (animation)
  $( '.new-world-privacy' ).css( 'transform' , 'translateY(158px)' );
  $( '.new-world-privacy' ).stop().clearQueue().transition({

    delay       : 700,
    'opacity'   : 1,
    'transform' : 'translateY(120px)'

  }, 1000);

  // Fade in and goes up privacy (animation)
  $( '.create-world-button, .delete-world-button' ).css( 'transform' , 'translateY(158px)' );
  $( '.create-world-button, .delete-world-button' ).transition({

    delay       : 900,
    'opacity'   : 1,
    'transform' : 'translateY(120px)'

  }, 1000);

}

var bypassNewWorldAnimationA = function(){

  $( '.new-world-container-wrap' ).css({

    'display' : 'block',

  });  $( '.new-world-container-wrap' ).transition({

    'opacity' : 1

  }, 300);
  $( '.new-world-title' ).css({

    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  });
  $( '.close-new-world' ).css({

    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  });
  $( '.create-world-button' ).css( 'left' , 'calc((50% - 236px) + 55px)' ).find( 'span' ).text( lang.accept );
  $( '.delete-world-button' ).css( 'left' , 'calc((50% - 135px) + 142px)' ).find( 'span' ).text( lang.unfollowWorld );
  $( '.create-world-button , .delete-world-button' ).css( {

    'top'       : '819px',
    'transform' : 'translateY(20px)',
    'right'     : '0',
    'opacity'   : '0'

  });
  $( '.new-world-name' ).css({

    'opacity'   : '0'

  });
  $( '.new-world-title .title' ).text( lang.worldEdit );
  $( '.new-world-title .step-b' ).addClass( 'hide' );

}

var newWorldAnimationOut = function(){

  var newWorldContainer = $( '.new-world-container-wrap' );

  $( '.new-world-container' ).css( 'height' , '100%' );

  // Fade out White background
  newWorldContainer.stop().clearQueue().transition({

    'opacity' : 0

  }, 200, function(){

    newWorldContainer.css( 'display' , 'none' );
    $( '.new-world-avatar' ).hide();
    $( '.new-world-desc' ).hide();
    $( '.new-world-privacy' ).hide();
    $( '.new-world-title' ).removeClass( 'second' );
    $( '.create-world-button' ).removeClass( 'step-b' );
    $( '.create-world-button' ).addClass( 'step-a' );
    $( '.new-world-title .step-b' ).removeClass( 'hide' );
    $( '.new-world-title .title' ).text( lang.worldCreation );
    $( '.delete-world-button' ).addClass( 'hide' );


    $( '.new-world-title, .new-world-name, .create-world-button, .new-world-avatar, .new-world-desc, .new-world-privacy, .delete-world-button' ).css({
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

    } ).find( 'span' ).text( 'Crear mundo' );

    exploreAnimationOut();

    if ( $( '.worldDom' ).length === 0 ) {

      noWorlds.show();
      noWorlds.transition({

        'opacity'         : 1

      }, 200, animationEffect );

    }else{

      noWorlds.transition({

        'opacity'         : 0

      }, 200, animationEffect , function(){

        noWorlds.hide();

      });

    }

  });

}


// INIT Chat
initCosmos();
