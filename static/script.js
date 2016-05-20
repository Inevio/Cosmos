// Variables
var worldSelected;
var worldSelectedUsrs;
var app                   = $( this );
var myContactID           = api.system.user().id;
var worldPrototype        = $( '.sidebar .world.wz-prototype' );
var worldTitle            = $( '.world-title' );
var worldCardPrototype    = $( '.world-card.wz-prototype' );
var searchWorldCard       = $( '.explore-container .search-bar input' );
var userCirclePrototype   = $( '.user-circle.wz-prototype' );
var closeInviteUser       = $( '.close-invite-user, .cancel-invite-user' );
var aceptInviteUser       = $( '.invite-user-container .invite-user' );
var friendPrototype       = $( '.friend.wz-prototype' );
var friendSearchBox       = $( '.invite-user-container .ui-input-search input' );
var cancelNewCard         = $( '.cancel-new-card' );
var postNewCardButton     = $( '.post-new-card' );
var genericCardPrototype  = $( '.gen-card.wz-prototype' );

var colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]

//Events
searchWorldCard.on( 'input' , function(){

  filterWorldCards( $( this ).val() );

});

closeInviteUser.on( 'click' , function(){

  $( '.invite-user-container' ).toggleClass( 'popup' );
  $( '.invite-user-container *' ).toggleClass( 'popup' );
  $( '.friend .ui-checkbox' ).removeClass( 'active' );

});

aceptInviteUser.on( 'click' , function(){

  inviteUsers();
  $( '.invite-user-container' ).toggleClass( 'popup' );
  $( '.invite-user-container *' ).toggleClass( 'popup' );
  $( '.friend .ui-checkbox' ).removeClass( 'active' );
  $( '.world.active' ).click();

});

friendSearchBox.on( 'input' , function(){

  filterFriends( $( this ).val() );

});

cancelNewCard.on( 'click' , function(){

  $( '.new-card-container' ).toggleClass( 'popup' );
  $( '.new-card-container *' ).toggleClass( 'popup' );

});

postNewCardButton.on( 'click' , function(){

  postNewCardAsync();
  $( '.new-card-container' ).toggleClass( 'popup' );
  $( '.new-card-container *' ).toggleClass( 'popup' );

});

api.cosmos.on( 'worldCreated' , function(){
  console.log( arguments )
});

app.

on( 'click' , '.create-world-button.step-a' , function(){

  createWorldAsync();

})

.on( 'click' , '.create-world-button.step-b' , function(){

  editWorldAsync();

})

.on( 'click' , '.category-list .world' , function(){

  selectWorld( $( this ) );

})

.on( 'click' , '.world-card.unfollowed .follow-button' , function(){

  followWorldAsync( $( this ) );

})

.on( 'click' , '.user-preview.invite-user' , function(){

  $( '.invite-user-container' ).toggleClass( 'popup' );
  $( '.invite-user-container *' ).toggleClass( 'popup' );
  getFriendsAsync();

});

//Functions
var initCosmos = function(){

  initTexts();
  getMyWorldsAsync();
  getPublicWorldsAsync();

}

var initTexts = function(){

  $( '.category .public' ).text( lang.publics );
  $( '.category .private' ).text( lang.privates );
  $( '.explore-text' ).text( lang.explore );
  $( '.invite-user-container .ui-input-search input' ).attr(  'placeholder' , lang.search );

}

var getMyWorldsAsync = function(){

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , o ){

    console.log( 'mis worlds:' , o );

    $.each( o , function( i , world ){

      appendWorld( world );

    });

  });

};

var getPublicWorldsAsync = function(){

  wz.cosmos.list( null , null , {from:0 , to:1000} , function( e , o ){

    console.log( 'todos los worlds:' , o );

    $.each( o , function( i , world ){

      world.getUsers(function( e , users ){

        appendWorldCard( world , users );

      });

    });

  });

};

var appendWorld = function( worldApi ){

  var world = worldPrototype.clone();
  world.removeClass( 'wz-prototype' ).addClass( 'world-' + worldApi.id );
  world.find( '.world-name' ).text( worldApi.name );
  world.find( '.world-icon' ).css( 'border-color' , colors[ worldApi.id % colors.length ] );

  if ( worldApi.isPrivate ) {

    $( '.private-list' ).append( world );

  }else{

    $( '.public-list' ).append( world );

  }

  world.data( 'world' , worldApi );

}

var appendWorldCard = function( worldApi , users ){

  var world = worldCardPrototype.clone();
  world.removeClass( 'wz-prototype' ).addClass( 'world-card-' + worldApi.id );
  world.find( '.world-title-min' ).text( worldApi.name );

  var found = false;
  $.each( users , function( i , user ){

    if ( user.userId == myContactID ) {

      found = true;

    }

  });

  if ( found ) {

    world.addClass( 'followed' ).removeClass( 'unfollowed' );
    world.find( '.follow-button span' ).text( 'Siguiendo' );

  }

  $( '.tend-grid' ).append( world );

  world.data( 'world' , worldApi );

}

var createWorldAsync = function(){

  var worldName = $( '.new-world-name input' ).val();

  if (!worldName) {
    return;
  }

  wz.cosmos.create( worldName , null, false , null , function( e , o ){

    appendWorld( o );
    $( '.new-world-name input' ).val('');
    $( '.new-world-container' ).data( 'world' , o );

  });

}

var editWorldAsync = function(){

  var worldApi = $( '.new-world-container' ).data( 'world' );
  var isPrivate = $( '.private-option' ).hasClass( 'active' );

  if (!worldApi) {
    return;
  }

  worldApi.setPrivate( isPrivate , function( e , o ){

    $( '.world-' + worldApi.id ).remove();
    worldApi.isPrivate = isPrivate;
    appendWorld( worldApi );
    $( '.privacy-options .option' ).removeClass( 'active' );
    $( '.private-option' ).addClass( 'active' );

  });

}

var selectWorld = function( world ){

  $( '.clean' ).remove();
  $( '.category-list .world' ).removeClass( 'active' );
  world.addClass( 'active' );

  var worldApi = world.data( 'world' );
  worldSelected = worldApi;
  worldTitle.text( worldApi.name );

  getWorldUsersAsync( worldApi );
  getWorldPostsAsync( worldApi );

}

var getWorldUsersAsync = function( worldApi ){

  worldApi.getUsers(function( e , o ){

    worldSelectedUsrs = o;

    $( '.user-preview.invite-user' ).removeClass( 'invite-user' );
    $( '.user-preview' ).show();
    if (o.length < 3) {
      $( '.user-preview' ).slice( 0 , ( 3 - o.length ) ).hide();
    }
    $( '.followers-number' ).text( o.length + ' ' + lang.followers );

    if ( worldSelected.isPrivate ) {

      if (o.length < 3) {

        $( '.user-preview' ).eq( ( 3 - o.length  ) ).addClass( 'invite-user popup-launcher' ).css( 'background-image' , 'url(https://static.inevio.com/app/360/bola-invitar.png)' ).find( '.user-hover span' ).text( lang.inviteUser );

      }else{

        $( '.user-preview.d' ).addClass( 'invite-user popup-launcher' ).css( 'background-image' , 'url(https://static.inevio.com/app/360/bola-invitar.png)' ).find( '.user-hover span' ).text( lang.inviteUser );

      }

    }else{

      $( '.user-preview' ).eq( ( 3 - o.length  ) ).hide();

    }

    if ( o.length <= 3 ) {

      $( '.more-users-text' ).text( lang.seeAll );

    }else{

      $( '.more-users-text' ).text( '+ ' + ( o.length - 3 ) + ' '  + lang.more );

    }


    $.each( o , function( i , user ){

      wz.user( user.userId , function( e , user ){

        appendUserCircle( i , user );

      })

    });

  });

}

var appendUserCircle = function( i , user ){

  var userCircle = userCirclePrototype.clone();
  userCircle.removeClass( 'wz-prototype' ).addClass( 'user-' + user.id ).addClass( 'clean' );
  userCircle.css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
  userCircle.data( 'user' , user );
  $( '.user-circles-section' ).append( userCircle );

  switch (i) {
    case 0:

      $( '.user-preview.a' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
      $( '.user-preview.a .user-hover span' ).text( user.name );
      break;

    case 1:

      $( '.user-preview.b' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
      $( '.user-preview.b .user-hover span' ).text( user.name );
      break;

    case 2:

      $( '.user-preview.c' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
      $( '.user-preview.c .user-hover span' ).text( user.name );
      break;

  }

}

var filterWorldCards = function( filter ){

  var worldCards = $( '.world-card' );
  worldCards.show();
  var worldCardsToShow = worldCards.filter( startsWithWorldCards( filter ) );
  var worldCardsToHide = worldCards.not( worldCardsToShow );
  worldCardsToHide.hide();

}

var startsWithWorldCards = function( wordToCompare ){

  return function( index , element ) {

    return $( element ).find( '.world-title-min' ).text().toLowerCase().indexOf( wordToCompare.toLowerCase() ) !== -1;

  }

}

var filterFriends = function( filter ){

  var friends = $( '.friend' );
  friends.show();
  var friendsToShow = friends.filter( startsWithFriends( filter ) );
  var friendsToHide = friends.not( friendsToShow );
  friendsToHide.hide();

}

var startsWithFriends = function( wordToCompare ){

  return function( index , element ) {

    return $( element ).find( 'span' ).text().toLowerCase().indexOf( wordToCompare.toLowerCase() ) !== -1;

  }

}

var followWorldAsync = function( worldCard ){

  var world = worldCard.parent().data( 'world' );
  world.addUser( myContactID , function( e , o ){

    appendWorld( world );

  });

}

var getFriendsAsync = function(){

  $( '.invite-user-title' ).html( '<i>' + lang.invitePeople + '</i>' + lang.to + '<figure>' + worldSelected.name + '</figure>' );

  api.user.friendList( false, function( error, friends ){

    $.each( friends , function( i , user ){

      appendFriend( user );

    });

  });

}

var appendFriend = function( user ){

  var friend = friendPrototype.clone();
  friend.removeClass( 'wz-prototype' ).addClass( 'user-' + user.id );

  friend.find( 'span' ).text( user.fullName );
  friend.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );

  var invited = false;
  $.each( worldSelectedUsrs , function( i , usr ){

    if ( usr.userId == user.id ) {

      invited = true;

    }

  });

  if (! invited ) {

    $( '.friend-list' ).append( friend );

  }

  friend.data( 'user' , user );

}

var inviteUsers = function(){

  var users = $( '.friend .ui-checkbox.active' ).parent();

  $.each( users , function( i , usr ){

    var user = $( usr ).data( 'user' );

    worldSelected.addUser( user.id , function( e , o ){

      console.log(e,o);

    });

  });

}

var postNewCardAsync = function(){

  var text = $( '.new-card-textarea' ).val();
  worldSelected.addPost( { content: text } , function(){



  });

}

var getWorldPostsAsync = function( world ){

  world.getPosts( {from:0 , to:1000} , function( e , posts ){

    $.each( posts , function( i , post ){

      wz.user( post.author , function( e , user ){

        switch (post.type) {

          case 1:

            appendGenericCard( post , user , lang.postCreated );
            break;

        }

      });

    });

  });

}

var appendGenericCard = function( post , user , reason ){

  var card = genericCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id );

  if( post.fsnode == 0 ){

    card.find( '.doc-preview' ).hide();

  }

  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.shared-text' ).text( reason );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );
  card.find( '.desc' ).text( post.content );

  $( '.cards-grid' ).append( card );

}

var timeElapsed = function( lastTime ){

  var now = new Date();
  var last = new Date( lastTime );
  var message;
  var calculated = false;

  if( now.getFullYear() === last.getFullYear() ){

    if( now.getDate() === last.getDate() ){

      message = getStringHour( lastTime );
      calculated = true;

    }else if( new Date ( now.setDate( now.getDate() - 1 ) ).getDate() === last.getDate() ){

      message = lang.lastDay;
      calculated = true;

    }

  }

  if ( !calculated ) {

    var day = last.getDate();
    var month = last.getMonth()+1;

    if(day<10) {
      day='0'+day
    }

    if(month<10) {
      month='0'+month
    }

    message = day + '/' + month + '/' + last.getFullYear().toString().substring( 2 , 4 );
    calculated = true;

  }

  return message;

}

var getStringHour = function( date ){

  var now = new Date();

  var hh = date.getHours();
  var mm = date.getMinutes();

  if(hh<10) {
    hh='0'+hh
  }

  if(mm<10) {
    mm='0'+mm
  }



  return hh + ':' + mm;

}

initCosmos();
