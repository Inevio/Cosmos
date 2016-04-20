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

  if ( !transformed ) {

    transformed = true;
    transformCover();

  }else if( $(this).scrollTop() == 0 ){

    transformed = false;
    transformScrolled();

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

var transformCover = function(){

  //uiContent.scrollTop(0);
  uiContent.addClass( 'scrolled' );
  cover.stop().clearQueue().transition({

    'height' : '57px',
    'box-shadow': '0 1px rgba(0,0,0,.05)',
    'background-color' : '#fff',

  }, 200, function(){

    console.log('lo hago estrecho');
    cover.addClass( 'fixed' );
    $( '.search-button' ).addClass( 'fixed' );
    $( '.app-buttons' ).addClass( 'fixed' );
    $( '.cosmos-buttons' ).addClass( 'fixed' );


  });

  $( '.back-image, .shadow' ).stop().clearQueue().transition({

    'opacity' : '0'

  }, 200);

  $( '.search-button' ).stop().clearQueue().transition({

    'background-color' : '#f7f8fa'

  }, 200);


}

var transformScrolled = function(){

  uiContent.scrollTop(0);
  uiContent.removeClass( 'scrolled' );
  $( '.fixed' ).removeClass( 'fixed' );
  cover.stop().clearQueue().transition({

    'height' : '317px',
    'box-shadow': 'none',
    'background-color' : 'transparent',

  }, 200);

  $( '.back-image, .shadow' ).stop().clearQueue().transition({

    'opacity' : '1'

  }, 200);

  $( '.search-button' ).stop().clearQueue().transition({

    'background-color' : 'rgba(0, 0, 0, 0.3)'

  }, 200);

}
// INIT Chat
initCosmos();
