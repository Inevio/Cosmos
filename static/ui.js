// --- VARS ---
var animationEffect  = 'cubic-bezier(.4,0,.2,1)';
var animationEffect2 = 'cubic-bezier(.18,.48,.2,1)';
var showingUsers    = false;
var onTransition    = false;
var state           = 1;
var titleLength     = 0;
var worldRecortedName;
var worldCompleteName;
var myContactID     = api.system.user().id;
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
var newWorldButton  = $( '.new-world-button, .new-world-button-mini' );
var closeNewWorld   = $( '.close-new-world' );
var notifications   = $( '.notifications' );
var newPostButton   = $( '.new-post-button, .no-post-new-post-button' );
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
var scrollableContent = $('.scrollable-content');

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

      var card;
      if (isMobile()) {
        card = $( '.mobile-world-comments' ).data( 'card' );
      }else{
        card = $( '.comment-' + postId ).closest('.card');
      }
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

cover.on( typeof cordova === 'undefined' ? 'mouseup' : 'touchend' , function(){
  if(app.hasClass('wz-view-dragging')) return;
  if(uiContent.hasClass('compressed')){
    console.log('click');
    decompressCover();
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
    var height = category.find( '.world' ).length * $( '.world.wz-prototype' ).outerHeight();
    category.find( '.world-list' ).transition({
      'height'         : height
    }, 200);

  }

});

searchBar.on( 'click' , function(){

  if (!isMobile()) {
    $( this ).addClass( 'popup' );
    $( this ).find( 'input' ).focus();
  }else{
    if ( scrollableContent.scrollTop() <= 190 ) {
      $('.scrollable-content').animate( {scrollTop:191} , '200', 'swing', function() {
        uiContent.addClass('searching');
        $('.search-bar input').focus();
      });
    }else{
      uiContent.addClass('searching');
      $('.search-bar input').focus();
    }
  }

});

searchBarFigure.on( 'click' , function(){

  if (!isMobile()) {
    $( this ).parent().addClass( 'popup' );
  }else{
    uiContent.addClass('searching');
    $('.search-bar input').focus();
  }
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
    $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'url(' + world.icons.normal + '?token=' + Date.now() + ')' );
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
    if(uiContent.hasClass('compressed')){
      decompressCover( { instant : true , world : $('.world.active') } );
    }

  }

})

.on( 'keyup' , '.new-world-name input' , function( e ){

  if (e.keyCode == 13 && $( '.new-world-name input' ).val() ) {

    $( this ).blur();
    $( this ).parent().parent().find( '.create-world-button' ).click();

  }

})

.on( 'click' , '.create-world-button.step-b , .delete-world-button' , function(){

  newWorldAnimationOut();

})

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

  if (isMobile()) {
    return;
  }

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
    commentsSection.find( '.comments-list' ).scrollTop(9999999);
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

  //Not select allowed while animations
  if (app.hasClass('animated')) {
    return;
  }

  if ( app.hasClass( 'user-animation' ) ) {
    usersGoesDown();
  }else if( app.hasClass( 'desc-animation' ) ){
    moveToCover();
  }else if( app.hasClass( 'cover-animation' ) ){
    decompressCover( { instant : true , world : $(this) } );
  }


})


// END UI EVENTS

// APP EVENTS

// END APP EVENTS

// --- FUNCTIONS ---
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

  });

  // Stars goes down
  $( '.search-title, .search-bar, .tend-text' ).stop().clearQueue().transition({

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
  $( '.create-world-button' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 300);
  $( '.delete-world-button' ).stop().clearQueue().transition({

    delay       : 250,
    'opacity'   : 0.5,
    'transform' : 'translateY(0px)'

  }, 300);


}

var newWorldAnimationB = function(){

  var editing = $( '.new-world-container' ).hasClass( 'editing' );

  if ( editing ) {

    var height = isMobile() ? '800px' : '770px';
    $( '.new-world-container' ).css( 'height' , height );
    newWorldAnimationBEditing();

  }else{
    var height = isMobile() ? '720px' : '770px';
    $( '.new-world-container' ).css( 'height' , height );
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
  var translate = isMobile() ? '0px' : '-67px';
  $( '.new-world-title' ).stop().clearQueue().transition({

    'transform' : 'translateY('+translate+')'

  }, 1000, animationEffect);

  // Fade in and goes up name (animation)
  $( '.new-world-name' ).stop().clearQueue().transition({

    'opacity'   : 0,
    'transform' : 'translateX(-200px)'

  }, 1000, animationEffect);


  // Fade in and goes up button (animation)
  if (!isMobile()) {
    $( '.create-world-button , .delete-world-button' ).stop().clearQueue().transition({

      'opacity'   : 0

    }, 800, animationEffect, function(){

      $( this ).css( {

        'top'       : '640px',
        'transform' : 'translateY(20px)',
        'right'     : '0',
        'left'      : 'calc(50% - 472px/2 + 150px)'

      } ).find( 'span' ).text( lang.accept );


    });
  }

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
  $( '.create-world-button' ).transition({

    delay       : 950,
    'opacity'   : 1,
    'transform' : 'translateY(0px)'

  }, 1000);
  $( '.delete-world-button' ).transition({

    delay       : 950,
    'opacity'   : 0.5,
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
  var translate = isMobile() ? '0px' : '-67px';
  $( '.new-world-title' ).stop().clearQueue().transition({

    'transform' : 'translateY('+translate+')'

  }, 1000);


  // Fade in and goes up name (animation)
  var translate = isMobile() ? '-15px' : '-58px';
  $( '.new-world-name' ).stop().clearQueue().transition({

    delay       : 100,
    'opacity'   : 1,
    'transform' : 'translateY('+translate+')'

  }, 1000);

  // Fade in and goes up avatar (animation)
  var translate = isMobile() ? '50px' : '120px';
  $( '.new-world-avatar' ).css( 'transform' , 'translateY(158px)' );
  $( '.new-world-avatar' ).stop().clearQueue().transition({

    delay       : 300,
    'opacity'   : 1,
    'transform' : 'translateY('+translate+')'

  }, 1000);

  // Fade in and goes up desc (animation)
  var translate = isMobile() ? '50px' : '120px';
  $( '.new-world-desc' ).css( 'transform' , 'translateY(158px)' );
  $( '.new-world-desc' ).stop().clearQueue().transition({

    delay       : 500,
    'opacity'   : 1,
    'transform' : 'translateY('+translate+')'

  }, 1000);

  // Fade in and goes up privacy (animation)
  var translate = isMobile() ? '50px' : '120px';
  $( '.new-world-privacy' ).css( 'transform' , 'translateY(158px)' );
  $( '.new-world-privacy' ).stop().clearQueue().transition({

    delay       : 700,
    'opacity'   : 1,
    'transform' : 'translateY('+translate+')'

  }, 1000);


  // Fade in and goes up privacy (animation)
  var translate = isMobile() ? '80px' : '120px';
  $( '.create-world-button, .delete-world-button' ).css( 'transform' , 'translateY(158px)' );
  $( '.create-world-button' ).transition({

    delay       : 900,
    'opacity'   : 1,
    'transform' : 'translateY('+translate+')'

  }, 1000);
  $( '.delete-world-button' ).transition({

    delay       : 900,
    'opacity'   : 0.5,
    'transform' : 'translateY('+translate+')'

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
  var text = isMobile() ? lang.exit : lang.unfollowWorld;
  $( '.delete-world-button' ).css( 'left' , 'calc((50% - 135px) + 142px)' ).find( 'span' ).text( text );
  $( '.create-world-button , .delete-world-button' ).css( {

    'top'       : '640px',
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

    if (!isMobile()) {
      $( '.create-world-button' ).css( {


        'top'       : '400px',
        'transform' : 'translateY(20px)',
        'left'      : 'calc((50% - 236px) + 307px)'


      } ).find( 'span' ).text( lang.createWorldShort );
    }

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

var isMobile = function(){
  return app.hasClass( 'wz-mobile-view' );
}
