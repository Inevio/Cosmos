var app = $(this);

app.css({'border-radius'    : '6px',
'background-color' : '#fff'
});


$( '.post-button, .omit-button' ).on( 'click' , function(){

  wz.app.removeView( app );

});
