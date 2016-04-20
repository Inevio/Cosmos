// --- VARS ---
var efectOne = false;
var efectTwo = false;
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

  console.log(obj.scrollTop());
  if ( !efectTwo && obj.scrollTop() > 10) {

    efectTwo = true;
    uiContent.addClass( 'scrolled' );

    // LA BOLITA
    $( '.world-avatar' ).stop().clearQueue().transition({

      'top' : '12px',
      'width': '33px',
      'height' : '33px',
      'margin-left' : 'calc(50% - 825px/2)'

    }, 1500);

    // EL TITULO
    $( '.world-title' ).stop().clearQueue().transition({

      'top' : '22px',
      'font-size': '15px',
      'color' : '#545f65',
      'margin-left'  : 'calc(50% - 713px/2)'

    }, 1500);

    // LA BARRA
    $( '.top-bar' ).stop().clearQueue().transition({

      'background-color' : '#fff',
      'box-shadow': '0 1px rgba(0,0,0,.05)',
      'height'  : '57px'

    }, 1500);

    // LA BOLITA DEL SEARCH
    $( '.search-button' ).stop().clearQueue().transition({

        'background-color' : '#f7f8fa'

    }, 1500);


    uiContent.animate({'scrollTop' : 260 },1500);



  }else if( obj.scrollTop() < 260 ){

    efectTwo = false;
    uiContent.removeClass( 'scrolled' );

    // LA BOLITA
    $( '.world-avatar' ).stop().clearQueue().transition({

      'top' : '80px',
      'width': '52px',
      'height' : '52px',
      'margin-left' : 'calc(50% - 325px/2)'

    }, 1500);

    // EL TITULO
    $( '.world-title' ).stop().clearQueue().transition({

      'top' : '154px',
      'font-size': '37px',
      'color' : '#fff',
      'margin-left'  : 'calc(50% - 413px/2)'

    }, 1500);

    // LA BARRA
    $( '.top-bar' ).stop().clearQueue().transition({

      'background-color' : 'transparent',
      'box-shadow': 'none'

    }, 1500);

    // LA BOLITA DEL SEARCH
    $( '.search-button' ).stop().clearQueue().transition({

        'background-color' : 'rgba(0, 0, 0, 0.3)'

    }, 1500);

    uiContent.animate({'scrollTop' : 0 },1500);


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
