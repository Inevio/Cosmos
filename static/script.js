// Variables
var worldSelected;
var worldSelectedUsrs;
var animationEffect       = 'cubic-bezier(.4,0,.2,1)';
var myWorlds              = [];
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
var youtubeCardPrototype  = $( '.you-card.wz-prototype' );
var exploreButton         = $( '.explore-button' );
var unFollowButton        = $( '.stop-follow' );
var commentPrototype      = $( '.comment.wz-prototype' );
var openChatButton        = $( '.open-chat' );
var worldDescription      = $( '.world-desc' );
var searchPostInput       = $( '.pre-cover .search-button input' );
var newPostButton         = $( '.new-post' );

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

exploreButton.on( 'click' , function(){

  $( '.world-card-dom' ).remove();
  getPublicWorldsAsync();

});

unFollowButton.on( 'click' , function(){

  if ( ! $( this ).hasClass( 'editable' ) ) {

    unFollowWorld();

  }

});

api.cosmos.on( 'worldCreated' , function( world ){

  appendWorld( world );
  $( '.new-world-name input' ).val('');
  $( '.new-world-container' ).data( 'world' , world );
  $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id );
  myWorlds.push( world.id );

});

api.cosmos.on( 'postAdded' , function( post ){

  console.log( post );

  if ( worldSelected.id === post.worldId ) {

    wz.user( post.author , function( e , user ){

      switch (post.type) {

        case 1:

        appendGenericCard( post , user , lang.postCreated );
        break;

        case 8:

        appendYoutubeCard( post , user , lang.postCreated );
        break;

      }

    });

  }

});


api.cosmos.on( 'iconSetted', function(){console.log('iconSetted');})
api.cosmos.on( 'nameSetted', function(){console.log('nameSetted');})
api.cosmos.on( 'pictureSetted', function(){console.log('pictureSetted');})
api.cosmos.on( 'postContentSetted', function(){console.log('postContentSetted');})
api.cosmos.on( 'postFSNodeSetted', function(){console.log('postFSNodeSetted');})
api.cosmos.on( 'postRemoved', function(){console.log('postRemoved');})
api.cosmos.on( 'postReplied', function(){console.log('postReplied');})
api.cosmos.on( 'postTitleSetted', function(){console.log('postTitleSetted');})
api.cosmos.on( 'tagAdded', function(){console.log('tagAdded');})
api.cosmos.on( 'userAdded', function(){console.log('userAdded');})
api.cosmos.on( 'userBanned', function(){console.log('userBanned');})
api.cosmos.on( 'userRemoved', function(){console.log('userRemoved');})
api.cosmos.on( 'userUnbanned', function(){console.log('userUnbanned');})
api.cosmos.on( 'worldPrivatized', function(){console.log('worldPrivatized');})
api.cosmos.on( 'worldRemoved', function(){console.log('worldRemoved');})

openChatButton.on( 'click' , function(){

  wz.app.openApp( 14 , [ 'open-chat' , worldSelected , function( o ){

    console.log(o);

  }] , 'hidden' );

});

searchPostInput.on( 'input' , function(){

  if ( $( this ).val() === '' ) {
    $( '.card' ).show();
    return;
  }

  $( '.card' ).hide();

  worldSelected.searchPost( $( this ).val() , {from:0 , to:1000} , function( e , posts ){

    console.log( posts );

    $.each( posts , function( i , post ){

      var post;

      if ( post.isReply ) {

        post = $( '.post-' + post.parent );

      }else{

        post = $( '.post-' + post.id );

      }

      post.show();

    });

  });

});

newPostButton.on( 'click' , function(){

  $( '.new-card-title figure' ).text( worldSelected.name );

});

app

.on( 'click' , '.create-world-button.step-a' , function(){

  createWorldAsync();

})

.on( 'click' , '.delete-world-button' , function(){

  unFollowWorld();

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

})

.on( 'click' , '.card-options-section .delete' , function(){

  var card = $(this).parent().parent().parent();
  removeCardAsync( card );

})

.on( 'click' , '.attach-select.popup2 .inevio' , function(){

  attachFromInevio();

})

.on( 'click' , '.comments-footer .send-button' , function(){

  addReplayAsync( $( this ).parent().parent().parent() );

})

.on( 'click' , '.replay-button' , function(){

  prepareReplayComment( $( this ).parent() );

});

//Functions
var initCosmos = function(){

  initTexts();
  getMyWorldsAsync();

}

var initTexts = function(){

  $( '.category .public' ).text( lang.publics );
  $( '.category .private' ).text( lang.privates );
  $( '.explore-text' ).text( lang.explore );
  $( '.invite-user-container .ui-input-search input' ).attr(  'placeholder' , lang.search );
  $( '.card-options-section .delete span' ).text( lang.deletePost );
  $( '.send-button span' ).text( lang.send );
  $( '.comments-footer input' ).attr(  'placeholder' , lang.writeComment );
  $( '.world-users-number .title' ).text( lang.users );
  $( '.world-event-number .title' ).text( lang.posts );
  $( '.world-files-number .title' ).text( lang.files );
  $( '.new-world-title .title' ).text( lang.worldCreation );
  $( '.delete-world-button span' ).text( lang.unfollowWorld );

}

var getMyWorldsAsync = function(){

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , o ){

    console.log( 'mis worlds:' , o );

    $.each( o , function( i , world ){

      appendWorld( world );
      myWorlds.push( world.id );

    });

  });

};

var getPublicWorldsAsync = function(){

  wz.cosmos.list( null , null , {from:0 , to:1000} , function( e , o ){

    console.log( 'todos los worlds:' , o );

    $.each( o , function( i , world ){

      appendWorldCard( world );

    });

    exploreAnimationIn();

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

var appendWorldCard = function( worldApi ){

  var world = worldCardPrototype.clone();
  world.removeClass( 'wz-prototype' ).addClass( 'world-card-' + worldApi.id ).addClass( 'world-card-dom' );
  world.find( '.world-title-min' ).text( worldApi.name );

  if ( myWorlds.indexOf( worldApi.id ) != -1 ) {

    world.addClass( 'followed' ).removeClass( 'unfollowed' );
    world.find( '.follow-button span' ).text( lang.following );

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

    if ( e ) {
      console.log( e );
    }

    createChat( o );

  });

}

var editWorldAsync = function(){

  var worldApi = $( '.new-world-container' ).data( 'world' );
  var isPrivate = $( '.private-option' ).hasClass( 'active' );

  if (!worldApi) {
    return;
  }

  worldApi.setDescription( $( '.new-world-desc textarea' ).val() , function( e , o ){

    console.log(e,o);

  });

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
  worldDescription.text( worldApi.description );

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

    $( '.world-users-number .subtitle' ).text( o.length );

    $.each( o , function( i , user ){

      wz.user( user.userId , function( e , usr ){


        $( '.stop-follow' ).removeClass( 'editable' );
        $( '.stop-follow span' ).text( lang.unfollowWorld );
        if ( user.isAdmin && user.userId === myContactID ) {
          $( '.stop-follow' ).addClass( 'editable' );
          $( '.stop-follow span' ).text( lang.editWorld );
        }

        appendUserCircle( i , usr );

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

  if ( filter === '' ) {

    worldCards.show();
    return;

  }

  wz.cosmos.list( filter , null , {from:0 , to:1000} , function( e , worlds ){

    worldCards.hide();

    $.each( worlds , function( i , world ){

      $( '.world-card-' + world.id ).show();

    });


  });

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
    myWorlds.push( world.id );
    worldCard.find( 'span' ).text( lang.following );
    worldCard.parent().addClass( 'followed' );

  });

  wz.app.openApp( 14 , [ 'join-chat' , world , function( o ){

    console.log(o);

  }] , 'hidden' );

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
  var cardType = 1;
  var tit = $( '.new-card-input' ).val();

  if ( text.indexOf( 'www.youtube' ) != -1 ) {
    cardType = 8;
  }

  worldSelected.addPost( { content: text , type: cardType, title: tit } , function( e , o ){

    $( '.new-card-textarea' ).val('');

  });

}

var getWorldPostsAsync = function( world ){

  world.getPosts( {from:0 , to:1000} , function( e , posts ){

    $( '.cardDom' ).remove();

    $( '.world-event-number .subtitle' ).text( posts.length );

    $.each( posts , function( i , post ){

      wz.user( post.author , function( e , user ){

        switch (post.type) {

          case 1:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 8:

          appendYoutubeCard( post , user , lang.postCreated );
          break;

        }

      });

    });

  });

}

var appendGenericCard = function( post , user , reason ){

  var card = genericCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  if( post.fsnode == 0 ){

    card.find( '.doc-preview' ).hide();

  }

  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.shared-text' ).text( reason );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );
  card.find( '.desc' ).text( post.content );
  card.find( '.title' ).text( post.title );

  setRepliesAsync( card , post );
  appendCard( card , post );

}

var appendYoutubeCard = function( post , user , reason ){

  var card = youtubeCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  var youtubeCode = post.content.match(/v=([A-z0-9-_]+)/)[1];

  card.find( '.video-preview' ).attr( 'src' , 'https://www.youtube.com/embed/' + youtubeCode + '?autoplay=0&html5=1' );
  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.shared-text' ).text( reason );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );
  card.find( '.desc' ).text( post.content );

  setRepliesAsync( card , post );
  appendCard( card , post );

}

var setRepliesAsync = function( card , post ){

  post.getReplies( {from:0 , to:1000} , function( e , replies ){

    card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    card.find( '.comments-text' ).data( 'num' , replies.length );
    $( '.commentDom' ).remove();

    $.each( replies , function( i , reply ){

      appendReply( card , reply );

      reply.getReplies( {from:0 , to:1000} , function( e , responses ){

        $.each( responses , function( i , response ){

          appendReplyComment( card , reply , response );

        });

      });

    });

  });

}

var appendReply = function( card , reply ){

  var comment = commentPrototype.eq(0).clone();
  comment.removeClass( 'wz-prototype' ).addClass( 'commentDom comment-' + reply.id );

  wz.user( reply.author , function( e , user ){

    comment.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
    comment.find( '.name' ).text( user.fullName );
    comment.find( '.time' ).text( timeElapsed( new Date( reply.created ) ) );
    comment.find( '.comment-text' ).text( reply.content );

    card.find( '.comments-list' ).append( comment );

    comment.data( 'reply' , reply );
    comment.data( 'name' , user.name );

  });

}

var appendCard = function( card , post ){

  var cardsAppended = $( '.cardDom' );

  if ( !cardsAppended.length ) {

    $( '.cards-grid' ).append( card );

  }else{

    var inserted = false;
    $.each( cardsAppended , function( index , cardAppended ){

      var time = $( cardAppended ).data( 'time' );
      if (!inserted && post.created > time ) {

        $( cardAppended ).before( card );
        inserted = true;

      }
      if ( !inserted && index+1 == cardsAppended.length ) {

        $( cardAppended ).after( card );
        inserted = true;

      }

    });

  }

  card.data( 'time' , post.created );
  card.data( 'post' , post );

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

var removeCardAsync = function( card ){

  confirm( lang.comfirmDeletePost , function(o){
    if(o){

      var post = card.data( 'post' );
      card.remove();

      worldSelected.removePost( post.id , function( e , o ){

        console.log( e , o );

      });

    }
  });

}

var attachFromInevio = function(){

  wz.fs.selectFile('', '', function(e,o){

    console.log('ATTACH',e,o);

  });

}

var unFollowWorld = function(){

  worldSelected.removeUser( myContactID , function( e , o ){

    console.log('he salido',e,o);
    $( '.world.active' ).remove();
    var index = myWorlds.indexOf( worldSelected.id );
    if (index > -1) {
      myWorlds.splice(index, 1);
    }

    wz.app.openApp( 14 , [ 'remove-chat' , worldSelected , function( o ){

      console.log(o);
      worldSelected = null;

    }] , 'hidden' );

  });

}

var addReplayAsync = function( card ){

  var post = card.data( 'post' );
  var msg = card.find( '.comments-footer input' ).val();
  var input = card.find( '.comments-footer input' );

  if ( msg[0] === '@' ) {

    console.log('es un doble reply!');
    post = input.data( 'reply' );

  }

  post.reply( { content: input.val() , author: myContactID , worldId: post.worldId , title: card.find( '.card-content .title' ).text() } , function(e,o){

    input.val('');

  });

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

var createChat = function( world ){

  wz.app.openApp( 14 , [ 'new-chat' , world , function( o ){

    console.log(o);

  }] , 'hidden' );

}

var prepareReplayComment = function( comment ){

  var post = comment.data( 'reply' );
  var name = comment.data( 'name' );
  var input = comment.parent().parent().find( '.comments-footer input' );

  input.val( '@' + name + ' ');
  input.focus();
  input.data( 'reply' , post );

}

var appendReplyComment = function( card , reply , response ){

  var comment = card.find( '.comment-' + reply.id );

  comment.find( '.replay-list' ).show();
  var reply = comment.find( '.replay.wz-prototype' ).clone();
  reply.removeClass( 'wz-prototype' ).addClass( 'replyDom reply-' + response.id );

  wz.user( response.author , function( e , user ){

    reply.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
    reply.find( '.name' ).text( user.fullName );
    reply.find( '.time' ).text( timeElapsed( new Date( response.created ) ) );
    reply.find( '.replay-text' ).text( response.content.substr(response.content.indexOf(" ") + 1) );

    comment.find( '.replay-list' ).append( reply );

    reply.data( 'reply' , response );

  });

}

initCosmos();
