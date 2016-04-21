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


$( '.cards-list' ).on( 'scroll' , function(){

  var obj = $( this );
  //transformCover( obj.scrollTop() );

  if ( state == 1 && !onTransition && obj.scrollTop() > 10) {

    console.log(obj.scrollTop());
    onTransition = true;
    $( '.ui-window' ).addClass( 'scrolled' );

    // AVATAR
    $( '.world-avatar' ).transition({

      'width': '50px',
      'height' : '50px',
      'left'  : '583.3px',
      'top' : '80.4px'

    }, 166, 'in').transition({

      'width': '46px',
      'height' : '46px',
      'left'  : '508.8px',
      'top' : '74.3px'

    }, 166, 'linear').transition({

      'width': '42px',
      'height' : '42px',
      'left'  : '427.3px',
      'top' : '54.3px'

    }, 166, 'linear').transition({

      'width': '40px',
      'height' : '40px',
      'left'  : '373.4px',
      'top' : '30.5px'

    }, 166, 'linear').transition({

      'width': '34px',
      'height' : '34px',
      'left'  : '349.8px',
      'top' : '16.9px'

    }, 166, 'linear').transition({

      'width': '33px',
      'height' : '33px',
      'left'  : '343px',
      'top' : '12px'

    }, 200, 'out');

    // EL TITULO
    $( '.world-title' ).stop().clearQueue().transition({

      'top' : '22px',
      'font-size': '15px',
      'color' : '#545f65',

    }, 1500);

    // LA BOLITA DEL SEARCH
    $( '.search-button' ).stop().clearQueue().transition({

        'background-color' : '#f7f8fa'

    }, 1500);

    // LA COVER
    $( '.cover' ).stop().clearQueue().transition({

        'opacity' : '0'

    }, 1500);

    // LAS BOLITAS, BOTON Y BOLITAS PEQUEÑAS
    $( '.world-users-preview, .more-users, .spot' ).stop().clearQueue().transition({

        'opacity' : '0'

    }, 1500);

    uiContent.animate({'scrollTop' : 260 },1500,function(){

      onTransition = false;
      state = 0;

      $( '.top-bar' ).css( 'opacity' , '1' );

    });



  }else if( state == 0 && !onTransition && obj.scrollTop() < 260 ){

    $( '.ui-window' ).removeClass( 'scrolled' );
    console.log(obj.scrollTop());
    onTransition = true;
    $( '.top-bar' ).css( 'opacity' , '0' );

    // AVATAR
    $( '.world-avatar' ).transition({

      'width': '34px',
      'height' : '34px',
      'left'  : '349.8px',
      'top' : '16.9px'

    }, 166, 'in').transition({

      'width': '40px',
      'height' : '40px',
      'left'  : '373.4px',
      'top' : '30.5px'

    }, 166, 'linear').transition({

      'width': '42px',
      'height' : '42px',
      'left'  : '427.3px',
      'top' : '54.3px'

    }, 166, 'linear').transition({

      'width': '46px',
      'height' : '46px',
      'left'  : '508.8px',
      'top' : '74.3px'

    }, 166, 'linear').transition({

      'width': '50px',
      'height' : '50px',
      'left'  : '583.3px',
      'top' : '80.4px'

    }, 166, 'linear').transition({

      'width': '52px',
      'height' : '52px',
      'left'  : '609px',
      'top' : '80px'

    }, 200, 'out');

    // EL TITULO
    $( '.world-title' ).stop().clearQueue().transition({

      'top' : '154px',
      'font-size': '37px',
      'color' : '#fff',

    }, 1500);

    // LA BOLITA DEL SEARCH
    $( '.search-button' ).stop().clearQueue().transition({

        'background-color' : 'rgba(0, 0, 0, 0.3)'

    }, 1500);

    // LA COVER
    $( '.cover' ).stop().clearQueue().transition({

        'opacity' : '1'

    }, 1500);

    // LAS BOLITAS, BOTON Y BOLITAS PEQUEÑAS
    $( '.world-users-preview, .more-users, .spot' ).stop().clearQueue().transition({

        'opacity' : '1'

    }, 1500);

    uiContent.animate({'scrollTop' : 0 },1500,function(){
      onTransition = false;
      state = 1;
    });


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

  $('.world-users-preview, .more-users, .more-info, .spot').css( 'opacity' , 1 - scroll / 100);

  $('.back-image, .shadow').css( 'opacity' , 1 - scroll / 300);

  var scale = 1 + scroll/3000;

  cover.find( '.back-image' ).css( 'transform' ,
  'translate3d(0px, -' + ( scroll/15 )  + 'px, 0px) scale(' + scale + ', ' + scale + ')' );

}

// INIT Chat
initCosmos();
