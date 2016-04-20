// --- VARS ---
var transformed = false;
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


uiContent.on( 'scroll' , function(){

  var obj = $( this );
  transformCover( obj.scrollTop() );

  if ( !transformed && obj.scrollTop() >= 260 ) {

    transformed = true;
    uiContent.addClass( 'scrolled' );
    $( '.top-bar' ).stop().clearQueue().transition({

      'background-color' : '#fff',
      'box-shadow': '0 1px rgba(0,0,0,.05)'

    }, 350);
    $( '.search-button' ).stop().clearQueue().transition({

        'background-color' : '#f7f8fa'

    }, 350);

  }else if( obj.scrollTop() < 260 ){

    transformed = false;
    uiContent.removeClass( 'scrolled' );
    $( '.top-bar' ).stop().clearQueue().transition({

      'background-color' : 'transparent',
      'box-shadow': 'none'

    }, 350);
    $( '.search-button' ).stop().clearQueue().transition({

        'background-color' : 'rgba(0, 0, 0, 0.3)'

    }, 350);

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

var transformCover = function( scroll ){

  $('.world-title, .world-users-preview, .more-users, .more-info').css( 'opacity' , 1 - scroll / 100);

  $('.back-image, .shadow').css( 'opacity' , 1 - scroll / 300);

  var scale = 1 + scroll/3000;

  cover.find( '.back-image' ).css( 'transform' ,
  'translate3d(0px, -' + ( scroll/15 )  + 'px, 0px) scale(' + scale + ', ' + scale + ')' );

  // toDo hacer que se mueva hacia arriba
  $( '.world-avatar' ).css();

}

var transformScrolled = function(){

  uiContent.scrollTop(0);
  uiContent.removeClass( 'scrolled' );
  $( '.fixed' ).removeClass( 'fixed' );
  cover.stop().clearQueue().transition({

    'height' : '317px',
    'box-shadow': 'none',
    'background-color' : 'transparent'

  }, 200);

  $( '.back-image, .shadow' ).stop().clearQueue().transition({

    'opacity' : '1'

  }, 200);

  $( '.search-button' ).stop().clearQueue().transition({

    'background-color' : 'rgba(0, 0, 0, 0.3)'

  }, 200);

}

var strechCover = function( scrolled ){

  cover.css( 'height' , (parseInt(cover.css( 'height' )) - scrolled) + 'px' );


}
// INIT Chat
initCosmos();
