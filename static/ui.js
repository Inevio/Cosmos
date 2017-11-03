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
var exploreButton   = $( '.explore-button, .explore-button-no-worlds' );
var moreUsersButton = $( '.more-users' );
var arrowUp         = $( '.arrow-up' );


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



// APP EVENTS

// END APP EVENTS

// --- FUNCTIONS ---


var isMobile = function(){
  return app.hasClass( 'wz-mobile-view' );
}
