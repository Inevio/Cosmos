// Variables
var worldSelected;
var worldSelectedUsrs;
var me;
var uploaderFunction;
var auxFunction;
var fsnodeId;
var loadingPost           = false;
var searchWorldQuery      = 0;
var searchPostQuery       = 0;
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
var documentCardPrototype = $( '.doc-card.wz-prototype' );
var genericCardPrototype  = $( '.gen-card.wz-prototype' );
var youtubeCardPrototype  = $( '.you-card.wz-prototype' );
var exploreButton         = $( '.explore-button, .explore-button-no-worlds' );
var unFollowButton        = $( '.stop-follow' );
var commentPrototype      = $( '.comment.wz-prototype' );
var openChatButton        = $( '.open-chat' );
var worldDescription      = $( '.world-desc' );
var searchPostInput       = $( '.pre-cover .search-button input' );
var newPostButton         = $( '.new-post, .no-post-new-post-button' );
var closeExplore          = $( '.close-explore' );
var noWorlds              = $( '.no-worlds' );
var starsCanvasContainer           = $( '.stars-canvas' );
var openFolder            = $( '.open-folder i' );
var cardsList             = $( '.cards-list' );

var colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]

var TYPES = {
  "application/pdf"   : 3,
  "application/zip"    : 2,
  "application/x-rar"  : 2,
  "application/x-gzip" : 2,
  "text/x-c"               : 3,
  "text/x-c++"             : 3,
  "text/x-php"             : 3,
  "text/x-python"          : 3,
  "application/json"       : 3,
  "application/javascript" : 3,
  "application/inevio-texts"                                                    : 3,
  "application/msword"                                                          : 5,
  "application/vnd.oasis.opendocument.text"                                     : 3,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"     : 2,
  "application/inevio-grids"                                          : 2,
  "application/vnd.ms-excel"                                          : 2,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : 2,
  "application/vnd.ms-powerpoint"                                             : 2,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" : 2,
  "audio/mp4"          : 6,
  "audio/mpeg"         : 6,
  "audio/flac"         : 6,
  "audio/x-vorbis+ogg" : 6,
  "audio/x-wav"        : 6,
  "image/gif"  : 4,
  "image/jpeg" : 4,
  "image/png"  : 4,
  "image/tiff" : 4,
  "image/vnd.adobe.photoshop" : 2,
  "text/html"    : 2,
  "text/plain"   : 2,
  "text/rtf"     : 2,
  "video/3gpp"         : 5,
  "video/mp4"          : 5,
  "video/quicktime"    : 5,
  "video/webm"         : 5,
  "video/x-flv"        : 5,
  "video/x-matroska"   : 5,
  "video/x-ms-asf"     : 5,
  "video/x-ms-wmv"     : 5,
  "video/x-msvideo"    : 5,
  "video/x-theora+ogg" : 5
}

//Events
cardsList.on( 'scroll' , function(){

  var scrollDiv = $( this );
  var scrollFinish = $( '.cards-grid' )[0].scrollHeight - scrollDiv.height();
  console.log( scrollFinish ,  scrollDiv.scrollTop() );

  if ( scrollFinish - scrollDiv.scrollTop() < 300 ) {

    var lastCard = scrollDiv.data( 'lastCard' );
    getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } );
    loadingPost = true;
    console.log( 'cargado mas' , lastCard );

  }

});

searchWorldCard.on( 'input' , function(){

  searchWorldQuery = searchWorldQuery + 1;
  var searchWorldQueryCopy = searchWorldQuery;
  filterWorldCards( $( this ).val() , searchWorldQueryCopy );

});

closeInviteUser.on( 'click' , function(){

  $( '.invite-user-container' ).toggleClass( 'popup' );
  $( '.invite-user-container *' ).toggleClass( 'popup' );
  $( '.friend .ui-checkbox' ).removeClass( 'active' );
  friendSearchBox.val('');
  filterFriends('');

});

aceptInviteUser.on( 'click' , function(){

  inviteUsers();
  $( '.invite-user-container' ).toggleClass( 'popup' );
  $( '.invite-user-container *' ).toggleClass( 'popup' );
  $( '.friend .ui-checkbox' ).removeClass( 'active' );

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
  cleanFilterWorldCards();
  getPublicWorldsAsync();

});

unFollowButton.on( 'click' , function(){

  if ( ! $( this ).hasClass( 'editable' ) ) {

    unFollowWorld();

  }else{

    $( '.new-world-container' ).data( 'world' , worldSelected );

  }

});

api.cosmos.on( 'worldCreated' , function( world ){

  appendWorld( world );
  $( '.new-world-name input' ).val('');
  $( '.new-world-container' ).data( 'world' , world );
  $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id );
  myWorlds.push( world.id );

  if ( world.owner === myContactID ) {
    selectWorld( $( '.world-' + world.id ) );
  }

});

api.cosmos.on( 'postAdded' , function( post ){

  console.log( 'ME HA LLEGADO UN POST!' , post );

  if ( post.isReply ) {

    var parent = $( '.comment-' + post.parent );
    var grandparent = $( '.post-' + post.parent );

    if ( parent.length > 0 ) {

      var parentPost = parent.data( 'reply' );
      grandparent = $( '.post-' + parentPost.parent );

      if ( worldSelected.id === post.worldId ) {
        appendReplyComment( grandparent , parentPost , post );
      }

    }else{

      var ncomments = grandparent.find( '.comments-text' ).data( 'num' ) + 1;
      grandparent.find( '.comments-text' ).text( ncomments + ' ' + lang.comments );
      grandparent.find( '.comments-text' ).data( 'num' , ncomments );

      if ( worldSelected.id === post.worldId ) {
        appendReply( grandparent , post );
      }

    }

  }else{

    wz.user( post.author , function( e , user ){

      if ( worldSelected.id === post.worldId ) {
        switch (post.type) {

          case 1:

          appendNoFileCard( post , user , lang.postCreated );
          break;

          case 2:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 3:

          appendDocumentCard( post , user , lang.postCreated );
          break;

          case 4:

          appendDocumentCard( post , user , lang.postCreated );
          break;

          case 5:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 6:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 8:

          appendYoutubeCard( post , user , lang.postCreated );
          break;

        }
      }


    });

  }

});

api.cosmos.on( 'userAdded', function( userId , world ){

  if ( userId === myContactID ) {

    myWorlds.push( world.id );
    appendWorld( world );

  }

  if( world.id === worldSelected.id ){

    getWorldUsersAsync( worldSelected );

  }

});

api.cosmos.on( 'userRemoved', function( userId , world ){

  if ( userId != myContactID  && world.id === worldSelected.id ) {

    $( '.user-circle' ).remove();
    getWorldUsersAsync( worldSelected );

  }

});

app.on( 'ui-view-resize' , function(){

  var name = worldTitle.data( 'name' );
  var winWidth = parseInt(app.css( 'width' ));
  var textWidth = Math.floor( winWidth * 0.032 );

  if ( name.length > textWidth ) {

    worldTitle.text( name.substr(0 , textWidth - 3) + '...' );

  }else{

    worldTitle.text( name );

  }

});

api.cosmos.on( 'nameSetted', function(){console.log('nameSetted');})
api.cosmos.on( 'pictureSetted', function(){console.log('pictureSetted');})
api.cosmos.on( 'postContentSetted', function(){console.log('postContentSetted');})
api.cosmos.on( 'postFSNodeSetted', function(){console.log('postFSNodeSetted');})
api.cosmos.on( 'postReplied', function(){console.log('postReplied');})
api.cosmos.on( 'postTitleSetted', function(){console.log('postTitleSetted');})
api.cosmos.on( 'tagAdded', function(){console.log('tagAdded');})
api.cosmos.on( 'userBanned', function(){console.log('userBanned');})
api.cosmos.on( 'userUnbanned', function(){console.log('userUnbanned');})
api.cosmos.on( 'worldPrivateSetted', function(){console.log('worldPrivatized');})
api.cosmos.on( 'worldNameSetted', function(){console.log('worldNameSetted');})

api.cosmos.on( 'worldNameSetted' , function( worldApi ){

  var category = $( '.world-' + worldApi.id ).parent();
  $( '.world-' + worldApi.id ).remove();
  var height = category.find( '.world' ).length * 28;
  category.css({

    'height'         : height

  });

  appendWorld( worldApi );

  if ( worldSelected && worldApi.id === worldSelected.id ) {

    $( '.world-' + worldApi.id ).click();

  }

});

api.cosmos.on( 'worldPrivateSetted' , function( world ){

  console.log('asdasdasdasdasd',world);

});

api.cosmos.on( 'worldRemoved', function(){console.log('worldRemoved');})

openChatButton.on( 'click' , function(){

  alert('not supported yet');
  /*
  wz.app.openApp( 14 , [ 'open-chat' , worldSelected , function( o ){

  console.log(o);

  }] , 'hidden' );
  */

});

searchPostInput.on( 'input' , function(){

  searchPostQuery = searchPostQuery + 1;
  var searchPostQueryCopy = searchPostQuery;

  if ( $( this ).val() === '' ) {
    $( '.card' ).show();
    return;
  }

  $( '.card' ).hide();

  worldSelected.searchPost( $( this ).val() , {from:0 , to:1000} , function( e , posts ){

    // Query desfasada
    if ( searchPostQuery != searchPostQueryCopy ) {
      return;
    }

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
  $( '.new-card-avatar' ).css( 'background-image' , 'url(' + me.avatar.tiny + ')' );
  $( '.new-card-section .attachments' ).data( 'numAttachs' , 0 );
  $( '.new-card-section .attachments' ).removeClass( 'with-attach' );

});

openFolder.on( 'click' , function(){

  wz.fs( worldSelected.volume , function( e , o ){

    o.open();

  });

});

api.upload.on( 'avatarProgress', function( percent ){

  $( '.loading-animation-container' ).show();

});

api.upload.on( 'fsnodeEnd', function( fsnode ){

  if ( fsnode.id === fsnodeId ) {

    auxFunction( fsnode );

  }

});

api.cosmos.on( 'worldIconSetted', function( o ){

  $( '.loading-animation-container' ).hide();
  $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'url(' + o.icons.normal + '?' + Date.now() + ')' );

})

app

.on( 'click' , '.create-world-button.step-a' , function(){

  createWorldAsync();

})

.on( 'click' , '.delete-world-button' , function(){

  unFollowWorld();
  $( '.new-world-container' ).removeClass( 'editing' );

})

.on( 'click' , '.create-world-button.step-b' , function(){

  editWorldAsync();
  $( '.new-world-container' ).removeClass( 'editing' );

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

})

.on( 'keyup' , '.comments-footer input' , function( e ){

  if (e.keyCode == 13) {

    addReplayAsync( $( this ).parent().parent().parent() );

  }

})

.on( 'click' , '.world-card-dom' , function(){

  var world = $( this ).data( 'world' );
  var worldSelectable = $( '.world-' + world.id );
  if ( worldSelectable.length > 0 ) {

    $( '.close-explore' ).click();
    worldSelectable.click();

  }

})

.on( 'click' , '.doc-preview' , function(){

  $( this ).data( 'fsNode' ).open();

})

.on( 'upload-prepared' , function( e , uploader ){

  uploaderFunction = uploader;

  $( '.popup' ).removeClass( 'popup2' );
  $( this ).parent().find( '.new-card-section .attach-select' ).hide();

  $( '.new-card-section .attachments' ).data( 'attachs' , 'fromPc' );

  $( '.new-card-section .attachments' ).addClass( 'with-attach' );

})

.on( 'click' , '.friend-list .friend' , function(){

  $(this).find( '.ui-checkbox' ).toggleClass( 'active' );

})

.on( 'click' , '.ui-checkbox' , function( e ){

  e.stopPropagation();
  $(this).toggleClass( 'active' );

});

//Functions
var initCosmos = function(){

  app.css({'border-radius'    : '6px',
  'background-color' : 'transparent'
  });

  initTexts();
  getMyWorldsAsync();
  starsCanvas( 'stars-canvas' );

  wz.user( myContactID , function( e , user ){

    me = user;

  });

}

var initTexts = function(){

  $( '.category .public' ).text( lang.publics );
  $( '.category .private' ).text( lang.privates );
  $( '.explore-text, .search-title' ).text( lang.explore );
  $( '.invite-user-container .ui-input-search input' ).attr(  'placeholder' , lang.search );
  $( '.card-options-section .delete span' ).text( lang.deletePost );
  $( '.send-button span' ).text( lang.send );
  $( '.comments-footer input' ).attr(  'placeholder' , lang.writeComment );
  $( '.world-users-number .title' ).text( lang.users );
  $( '.world-event-number .title' ).text( lang.posts );
  $( '.world-files-number .title' ).text( lang.files );
  $( '.new-world-title .title' ).text( lang.worldCreation );
  $( '.delete-world-button span' ).text( lang.unfollowWorld );
  $( '.select-world span' ).text( lang.selectWorld );
  $( '.no-posts .left-side span' ).text( lang.noPosts );
  $( '.no-posts .right-side span' ).text( lang.createNewPost );
  $( '.no-worlds .title' ).text( lang.welcome );
  $( '.no-worlds .subtitle' ).text( lang.intro );
  $( '.explore-button-no-worlds span' ).text( lang.explore );
  $( '.new-world-button-no-worlds span, .new-world-button span' ).text( lang.createWorld );
  $( '.tend-text' ).text( lang.tend );
  $( '.follow-button span' ).text( lang.follow );
  $( '.new-world-title .step-a' ).text( lang.stepa );
  $( '.new-world-title .step-b' ).text( lang.stepb );
  $( '.new-world-name span' ).text( lang.worldName );
  $( '.new-world-avatar > span' ).text( lang.avatarBack );
  $( '.change-background-button span' ).text( lang.changeBack );
  $( '.new-world-desc span' ).text( lang.worldDesc );
  $( '.new-world-privacy > span' ).text( lang.privacy );
  $( '.option.public .title' ).text( lang.publicWorld );
  $( '.option.public .desc' ).text( lang.publicDesc );
  $( '.option.hidden .title' ).text( lang.privateWorld );
  $( '.option.hidden .desc' ).text( lang.privateDesc );
  $( '.option.public > span' ).text( lang.public );
  $( '.option.hidden > span' ).text( lang.private );
  $( '.create-world-button.step-a span' ).text( lang.createWorldShort );
  $( 'new-card-title' ).html( '<i>' + lang.newPost + '</i>' + lang.for + '<figure></figure>' );
  $( '.attach-select .inevio span' ).text( lang.uploadInevio );
  $( '.attach-select .pc span' ).text( lang.uploadPC );
  $( '.cancel-new-card span' ).text( lang.cancel );
  $( '.post-new-card span' ).text( lang.postit );
  $( '.cancel-invite-user span' ).text( lang.cancel );
  $( '.invite-user span' ).text( lang.invite );

}

var starsCanvas = function( stars ){

  var canvas = $('.' + stars );
  var ctx = canvas[0].getContext('2d');
  var initial = Date.now();

  var layer1 = new Image();
  var layer2 = new Image();
  var layer3 = new Image();
  var speed1 = 2 / 75;
  var speed2 = 2 / 125;
  var speed3 = 2 / 175;
  var padding1 = 0;
  var padding2 = 0;
  var padding3 = 0;

  layer1.src = 'https://staticbeta.inevio.com/app/360/starlayer1.png';
  layer2.src = 'https://staticbeta.inevio.com/app/360/starlayer2.png';
  layer3.src = 'https://staticbeta.inevio.com/app/360/starlayer3.png';

  var draw = function(){

    var current = initial - Date.now();

    ctx.clearRect( 0, 0, canvas.width(), canvas.height() );

    // LAYER 1
    ctx.drawImage( layer1, 0, current * speed1 + padding1 );

    if( current * speed1 + padding1 < canvas.height - layer1.height ){
      ctx.drawImage( layer1, 0, current * speed1 + padding1 + layer1.height );
    }

    if( current * speed1 + padding1 < -layer1.height ){
      padding1 += layer1.height;
    }

    // LAYER 2
    ctx.drawImage( layer2, 0, current * speed2 + padding2 );

    if( current * speed2 + padding2 < canvas.height - layer2.height ){
      ctx.drawImage( layer2, 0, current * speed2 + padding2 + layer2.height );
    }

    if( current * speed2 + padding2 < -layer2.height ){
      padding2 += layer2.height;
    }

    // LAYER 3
    ctx.drawImage( layer3, 0, current * speed3 + padding3 );

    if( current * speed3 + padding3 < canvas.height - layer3.height ){
      ctx.drawImage( layer3, 0, current * speed3 + padding3 + layer3.height );
    }

    if( current * speed3 + padding3 < -layer3.height ){
      padding3 += layer3.height;
    }

    requestAnimationFrame( draw );

  }

  draw();

}

var getMyWorldsAsync = function(){

  var myWorldsApi = app.data( 'myWorlds' );

  if ( myWorldsApi ) {

    $.each( myWorldsApi , function( i , world ){

      appendWorld( world );
      myWorlds.push( world.id );

    });

  }

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
  world.removeClass( 'wz-prototype' ).addClass( 'world-' + worldApi.id ).addClass( 'worldDom' );
  world.find( '.world-name' ).text( worldApi.name );
  world.find( '.world-icon' ).css( 'border-color' , colors[ worldApi.id % colors.length ] );

  var category;

  if ( worldApi.isPrivate ) {

    category = $( '.private-list' );

  }else{

    category = $( '.public-list' );

  }

  appendWorldInOrder( category , world , worldApi );
  var height = category.find( '.world' ).length * 28;
  category.css({

    'height'         : height

  });

  world.data( 'world' , worldApi );

}

var appendWorldInOrder = function( category , world , worldApi ){

  var worlds = [];
  var worldsAppended = category.find( '.world' );

  if ( worldsAppended.length === 0 ) {
    category.append( world );
  }else{

    var appended = false;
    for (var i = 0; i < worldsAppended.length; i++) {
      worlds.push( $(worldsAppended[i]).data( 'world' ));
    }

    worlds.forEach(function( worldAppended ){

      if ( sortByName( worldApi , worldAppended ) < 0 && !appended ) {
        $( '.world-' + worldAppended.id ).before( world );
        appended = true;
      }

    });

    if (!appended) {
      category.append( world );
    }
  }
}

var appendWorldCard = function( worldApi ){

  var world = worldCardPrototype.clone();
  world.removeClass( 'wz-prototype' ).addClass( 'world-card-' + worldApi.id ).addClass( 'world-card-dom' );
  world.find( '.world-title-min' ).text( worldApi.name );
  world.find( '.world-avatar-min' ).css( 'background-image' , 'url(' + worldApi.icons.normal + '?' + Date.now() + ')' );;

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

    //createChat( o );

  });

}

var editWorldAsync = function(){

  var worldApi = $( '.new-world-container' ).data( 'world' );
  var isPrivate = $( '.private-option' ).hasClass( 'active' );
  var editing = $( '.new-world-container' ).hasClass( 'editing' );
  var name = worldApi.name;
  $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , worldApi.id );

  if ( editing ) {
    name = $( '.new-world-name input' ).val();
  }

  if (!worldApi) {
    return;
  }

  worldApi.isPrivate = isPrivate;
  worldApi.description = $( '.new-world-desc textarea' ).val();
  worldApi.name = name;

  worldApi.set( worldApi , function( e , o ){

    if(e){
      console.log( e );
    }
    /* COMENTAR LUEGO
    $( '.world-' + worldApi.id ).remove();
    appendWorld( worldApi );
    $( '.world-' + worldApi.id ).click();
    */
    $( '.privacy-options .option' ).removeClass( 'active' );
    $( '.private-option' ).addClass( 'active' );

  });

}

var selectWorld = function( world ){

  $( '.clean' ).remove();
  $( '.category-list .world' ).removeClass( 'active' );
  world.addClass( 'active' );
  $( '.scrolled' ).removeClass( 'scrolled' );

  var worldApi = world.data( 'world' );
  worldSelected = worldApi;
  app.data( 'worldSelected' , worldSelected )


  var name = worldApi.name;
  var winWidth = parseInt(app.css( 'width' ));
  var textWidth = Math.floor( winWidth * 0.032 );

  if ( name.length > textWidth ) {

    worldTitle.text( name.substr(0 , textWidth - 3) + '...' );

  }else{

    worldTitle.text( name );

  }

  $( '.world-avatar' ).css( 'background-image' , 'url(' + worldApi.icons.normal + ')' );

  worldTitle.data( 'name' , name );

  worldDescription.text( worldApi.description );

  getWorldUsersAsync( worldApi );
  getWorldPostsAsync( worldApi , { init: 0 , final: 6 } );
  $( '.select-world' ).hide();

}

var getWorldUsersAsync = function( worldApi ){

  worldApi.getUsers(function( e , o ){

    worldSelectedUsrs = o;

    $( '.user-preview.invite-user' ).removeClass( 'invite-user' );
    $( '.user-preview' ).show();

    $( '.followers-number' ).text( o.length + ' ' + lang.followers );

    if ( worldSelected.isPrivate ) {

      var inviteIndex = -1;

      for (var i = o.length + 1; i < 4 ; i++) {

        $( '.user-preview' ).eq( 3 - i ).hide();

      }

      if (o.length > 3) {

        $( '.user-preview.d' ).addClass( 'invite-user popup-launcher' ).css( 'background-image' , 'url(https://static.inevio.com/app/360/bola-invitar.png)' ).find( '.user-hover span' ).text( lang.inviteUser );

        $( '.more-users-text' ).text( '+ ' + ( o.length - 3 ) + ' '  + lang.more );
        inviteIndex = 3;

      }else{

        $( '.user-preview' ).eq( 3 - o.length ).addClass( 'invite-user popup-launcher' ).css( 'background-image' , 'url(https://static.inevio.com/app/360/bola-invitar.png)' ).find( '.user-hover span' ).text( lang.inviteUser );

        $( '.more-users-text' ).text( lang.seeAll );
        inviteIndex = o.length;

      }

    }else{

      for (var i = o.length ; i < 4 ; i++) {

        $( '.user-preview' ).eq( 3 - i ).hide();

      }

      if ( o.length > 4 ) {

        $( '.more-users-text' ).text( '+ ' + ( o.length - 3 ) + ' '  + lang.more );

      }else{

        $( '.more-users-text' ).text( lang.seeAll );

      }

    }


    $( '.world-users-number .subtitle' ).text( o.length );
    $( '.stop-follow' ).removeClass( 'editable' );
    $( '.stop-follow span' ).text( lang.unfollowWorld );
    $( '.user-circle.clean' ).remove();

    $.each( o , function( i , user ){

      if ( user.isAdmin && user.userId === myContactID ) {
        $( '.stop-follow' ).addClass( 'editable' );
        $( '.stop-follow span' ).text( lang.editWorld );
      }

      wz.user( user.userId , function( e , usr ){

        appendUserCircle( i , usr , inviteIndex );

      })

    });

  });

}

var appendUserCircle = function( i , user , inviteIndex ){

  var userCircle = userCirclePrototype.clone();
  userCircle.removeClass( 'wz-prototype' ).addClass( 'user-' + user.id ).addClass( 'clean' );
  userCircle.css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
  userCircle.data( 'user' , user );

  if ( $( '.user-circle.user-' + user.id ).length === 0 ) {
    $( '.user-circles-section' ).append( userCircle );
  }

  if( i == inviteIndex ){
    return;
  }

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

    case 3:

    $( '.user-preview.d' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
    $( '.user-preview.d .user-hover span' ).text( user.name );
    break;

  }

}

var filterWorldCards = function( filter , searchWorldQueryCopy ){

  var worldCards = $( '.world-card' );

  if ( filter === '' ) {

    worldCards.show();
    return;

  }

  wz.cosmos.list( filter , null , {from:0 , to:1000} , function( e , worlds ){

    // Query desfasada
    if ( searchWorldQuery != searchWorldQueryCopy ) {
      return;
    }

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

  if ( myWorlds.indexOf( world.id ) != -1 ) {
    return;
  }

  world.addUser( myContactID , function( e , o ){

    worldCard.find( 'span' ).text( lang.following );
    worldCard.parent().addClass( 'followed' );

  });

  /*
  wz.app.openApp( 14 , [ 'join-chat' , world , function( o ){

  console.log(o);

  }] , 'hidden' );
  */

}

var getFriendsAsync = function(){

  $( '.invite-user-title' ).html( '<i>' + lang.invitePeople + '</i>' + lang.to + '<figure>' + worldSelected.name + '</figure>' );

  $( '.friendDom' ).remove();
  api.user.friendList( false, function( error, friends ){

    $.each( friends , function( i , user ){

      appendFriend( user );

    });

  });

}

var appendFriend = function( user ){

  var friend = friendPrototype.clone();
  friend.removeClass( 'wz-prototype' ).addClass( 'user-' + user.id ).addClass( 'friendDom' );

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

  asyncEach( $.makeArray( users ) , function( usr , checkEnd ){

    var user = $( usr ).data( 'user' );

    worldSelected.addUser( user.id , function( e , o ){

      checkEnd();

    });

  } , function(){


  });

}

var asyncEach = function( list, step, callback ){

  var position = 0;
  var closed   = false;
  var checkEnd = function( error ){

    if( closed ){
      return;
    }

    position++;

    if( position === list.length || error ){

      closed = true;

      callback( error );

      // Nullify
      list = step = callback = position = checkEnd = closed = null;

    }

  };

  if( !list.length ){
    return callback();
  }

  list.forEach( function( item ){
    step( item, checkEnd );
  });

};

var postNewCardAsync = function(){

  var text = $( '.new-card-textarea' ).val() ? $( '.new-card-textarea' ).val() : 'none';
  var tit = $( '.new-card-input' ).val() ? $( '.new-card-input' ).val() : 'none';

  if ( text === 'none' && tit === 'none' ) {
    alert( lang.noInfo );
    return;
  }

  var attach = $( '.new-card-section .attachments' ).data( 'attachs' );

  var addPost = function( node , type ){

    if ( type === 1 || type === 7 || type === 8 ) {

      worldSelected.addPost( { content: text , type: type, title: tit } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');

      });

    }else{

      worldSelected.addPost( { content: text , type: type, title: tit, fsnode: node.id } , function( e , o ){

        $( '.new-card-input' ).val('');
        $( '.new-card-textarea' ).val('');
        $( '.new-card-section .attachments' ).data( 'attachs' , '');

      });

    }

  }

  var checkTypePost = function( fsnode ){

    var fileType = 1;

    if ( fsnode.mime ) {

      fileType = guessType( fsnode.mime );

    }


    addPost( fsnode , fileType );

  }

  if ( attach ) {

    if ( attach === 'fromPc' ) {

      uploaderFunction( worldSelected.volume , function( e , fsNode ){

        auxFunction = checkTypePost;
        fsnodeId = fsNode[0].id;

      });

    }else{

      api.fs( attach[0] , function( e , fsNode ){

        checkTypePost( fsNode );

      });

    }

  }else if ( text.indexOf( 'www.youtube' ) != -1 ) {

    addPost( 0 , 8 );

  }else{

    addPost( 0 , 1 );

  }

}

var checkContains = function( base , contains ){

  return base.indexOf( contains ) != -1;

}

var getWorldPostsAsync = function( world , interval ){

  world.getPosts( {from: interval.init , to: interval.final } , function( e , posts ){

    if ( interval.init === 0 ) {

      $( '.cardDom' ).remove();

      if ( posts.length > 0 ) {
        $( '.no-posts' ).css( 'opacity' , '0' );
        $( '.no-posts' ).hide();
        app.removeClass( 'no-post' );
      }else{
        $( '.no-posts' ).css( 'opacity' , '1' );
        $( '.no-posts' ).show();
        app.addClass( 'no-post' );
      }

    }

    $( '.world-event-number .subtitle' ).text( posts.length );
    $( '.cards-list' ).data( 'lastCard' , interval.final );

    $.each( posts , function( i , post ){

      wz.user( post.author , function( e , user ){

        switch (post.type) {

          case 1:

          appendNoFileCard( post , user , lang.postCreated );
          break;

          case 2:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 3:

          appendDocumentCard( post , user , lang.postCreated );
          break;

          case 4:

          appendDocumentCard( post , user , lang.postCreated );
          break;

          case 5:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 6:

          appendGenericCard( post , user , lang.postCreated );
          break;

          case 8:

          appendYoutubeCard( post , user , lang.postCreated );
          break;

        }

      });

    });

    loadingPost = false;

  });

}

var appendNoFileCard = function( post , user , reason ){

  var card = genericCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  card.find( '.doc-preview' ).hide();

  if ( post.title === 'none' ) {

    card.find( '.title' ).hide();

  }else{

    card.find( '.title' ).text( post.title );

  }

  if ( post.content === 'none' ) {

    card.find( '.desc' ).hide();

  }else{

    card.find( '.desc' ).html( post.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

  }

  card.find( '.desc' ).find('a').each( function(){

    if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
      $(this).attr( 'href', 'http://' + $(this).attr('href') );
    }

  });

  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.shared-text' ).text( reason );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );


  setRepliesAsync( card , post );
  appendCard( card , post );

}

var appendGenericCard = function( post , user , reason ){

  var card = genericCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  wz.fs( post.fsnode , function( e , fsNode ){

    console.log( fsNode , 'imagen!');

    card.find( '.doc-icon' ).css( 'background-image' , 'url( ' + fsNode.icons['64'] + ' )' );
    card.find( '.doc-title' ).text( fsNode.name );
    card.find( '.doc-info' ).text( fsNode.mime );
    card.find( '.doc-preview' ).data( 'fsNode' , fsNode );

    if ( post.title === 'none' ) {

      card.find( '.title' ).hide();

    }else{

      card.find( '.title' ).text( post.title );

    }

    if ( post.content === 'none' ) {

      card.find( '.desc' ).hide();

    }else{

      card.find( '.desc' ).html( post.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    }

    card.find( '.desc' ).find('a').each( function(){

      if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
    card.find( '.card-user-name' ).text( user.fullName );
    card.find( '.shared-text' ).text( reason );
    card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );

    setRepliesAsync( card , post );
    appendCard( card , post );

  });

}

var appendDocumentCard = function( post , user , reason ){

  var card = documentCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  wz.fs( post.fsnode , function( e , fsNode ){

    console.log( fsNode , 'imagen!');

    card.find( '.doc-preview' ).css( 'background-image' , 'url( '+ fsNode.thumbnails['512'] +' )' );
    card.find( '.preview-title' ).text( fsNode.name );
    card.find( '.preview-info' ).text( wz.tool.bytesToUnit( fsNode.size, 1 ) );
    card.find( '.doc-preview' ).data( 'fsNode' , fsNode );
    card.find( '.doc-preview-bar i' ).css( 'background-image' , 'url( '+ fsNode.icons['16'] +' )' );;

    if ( post.title === 'none' ) {

      card.find( '.title' ).hide();

    }else{

      card.find( '.title' ).text( post.title );

    }

    if ( post.content === 'none' ) {

      card.find( '.desc' ).hide();

    }else{

      card.find( '.desc' ).html( post.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    }

    card.find( '.desc' ).find('a').each( function(){

      if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
    card.find( '.card-user-name' ).text( user.fullName );
    card.find( '.shared-text' ).text( reason );
    card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );

    setRepliesAsync( card , post );
    appendCard( card , post );

  });

}

var appendYoutubeCard = function( post , user , reason ){

  var card = youtubeCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  var youtubeCode = post.content.match(/v=([A-z0-9-_]+)/)[1];

  card.find( '.video-preview' ).attr( 'src' , 'https://www.youtube.com/embed/' + youtubeCode + '?autoplay=0&html5=1&rel=0' );
  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.shared-text' ).text( reason );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );
  card.find( '.desc' ).html( post.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );
  card.find( '.title' ).text( post.title );
  card.find( '.activate-preview' ).text( lang.preview );

  card.find( '.desc' ).find('a').each( function(){

    if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
      $(this).attr( 'href', 'http://' + $(this).attr('href') );
    }

  });

  setRepliesAsync( card , post );
  appendCard( card , post );

}

var setRepliesAsync = function( card , post ){

  post.getReplies( {from:0 , to:1000} , function( e , replies ){

    card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    card.find( '.comments-text' ).data( 'num' , replies.length );

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
  comment.find( '.replay-button' ).text( lang.reply );

  wz.user( reply.author , function( e , user ){

    comment.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
    comment.find( '.name' ).text( user.fullName );
    comment.find( '.time' ).text( timeElapsed( new Date( reply.created ) ) );
    comment.find( '.comment-text' ).html( reply.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    comment.find( '.comment-text' ).find('a').each( function(){

      if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    card.find( '.comments-list' ).append( comment );

    comment.data( 'reply' , reply );
    comment.data( 'name' , user.name );

  });

}

var appendCard = function( card , post ){

  var worldActive = $( '.world.active' ).data( 'world' );
  if ( post.worldId != worldActive.id ) {
    return;
  }

  $( '.no-posts' ).css( 'opacity' , '0' );
  $( '.no-posts' ).hide();
  card.find( '.delete span' ).text( lang.deletePost );

  app.removeClass( 'no-post' );

  var cardsAppended = $( '.cardDom' );

  if ( post.author === myContactID ) {
    card.addClass( 'mine' );
  }

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
      worldSelected.removePost( post.id , function( e , o ){

        if (e) {
          alert( lang.notAllowedDeletePost );
        }

      });

    }
  });

}

var attachFromInevio = function(){

  api.fs.selectSource( { 'title' : 'Selecciona!' , 'mode' : 'file' } , function( e , s ){

    $( '.popup' ).removeClass( 'popup2' );
    $( this ).parent().find( '.new-card-section .attach-select' ).hide();

    if (e) {
      console.log( e );
      return;
    }

    var numAttachs = $( '.new-card-section .attachments' ).data( 'numAttachs' );
    if ( !numAttachs ) {
      numAttachs = 0;
    }

    if ( s.constructor === Array ) {
      numAttachs += s.length;
    }else{
      numAttachs++;
    }

    console.log( numAttachs, s );
    $( '.new-card-section .attachments' ).data( 'numAttachs' , numAttachs );
    $( '.new-card-section .attachments' ).data( 'attachs' , s );

    if ( numAttachs > 0) {
      $( '.new-card-section .attachments' ).addClass( 'with-attach' );
      $( '.new-card-section .attachments figure i' ).text( numAttachs );
    }

  })

}

var unFollowWorld = function(){

  worldSelected.removeUser( myContactID , function( e , o ){

    var worldList = $( '.world.active' ).parent();

    $( '.world.active' ).parent().transition({

      'height'         : worldList.height() - 28

    }, 200);
    $( '.world.active' ).remove();


    var index = myWorlds.indexOf( worldSelected.id );
    if (index > -1) {
      myWorlds.splice(index, 1);
    }

    $( '.select-world' ).show();

    if( $( '.worldDom' ).length === 0 ){

      noWorlds.show();
      starsCanvasContainer.removeClass( 'no-visible' );
      starsCanvasContainer.stop().clearQueue().transition({

        'opacity' : 1


      }, 300);
      noWorlds.transition({

        'opacity'         : 1

      }, 200, animationEffect );

    }

    /*
    wz.app.openApp( 14 , [ 'remove-chat' , worldSelected , function( o ){

    console.log(o);
    worldSelected = null;

  }] , 'hidden' );
  */

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

  var str = card.find( '.card-content .title' ).text();
  if( str === '' ) str = input.val();

  post.reply( { content: input.val() , author: myContactID , worldId: post.worldId , title: str } , function(e,o){

    input.val('');

  });

}

var exploreAnimationIn = function(){

  var exploreSection = $( '.explore-section' );

  exploreSection.css( 'display' , 'block');
  starsCanvasContainer.removeClass( 'no-visible' );
  starsCanvasContainer.stop().clearQueue().transition({

    'opacity' : 1


  }, 300);

  // Fade in blue background
  exploreSection.stop().clearQueue().transition({

    'opacity' : 1

  }, 300, animationEffect , function(){

    noWorlds.transition({

      'opacity'         : 0

    }, 200, animationEffect , function(){

      noWorlds.hide();

    });

  });

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
    reply.find( '.replay-text' ).html( response.content.substr(response.content.indexOf(" ") + 1).replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    reply.find( '.replay-text' ).find('a').each( function(){

      if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    comment.find( '.replay-list' ).append( reply );

    reply.data( 'reply' , response );

  });

}

var cleanFilterWorldCards = function(){

  searchWorldCard.val( '' );
  filterWorldCards( '' );

}

var guessType = function( mime ){
  return TYPES[ mime ] || 1
}

var sortByName = function( nameA , nameB ){

  nameA = nameA.name;
  nameB = nameB.name;

  var a1, b1, i= 0, n, L,

  rx=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;

  if( nameA === nameB ) return 0;

  nameA = nameA.toLowerCase().match(rx);
  nameB = nameB.toLowerCase().match(rx);

  L= nameA.length;

  while(i<L){
      if(!nameB[i]) return 1;
      a1= nameA[i],
      b1= nameB[i++];
      if(a1!== b1){
          n= a1-b1;
          if(!isNaN(n)) return n;
          return a1>b1? 1:-1;
      }
  }
  return nameB[i]? -1:0;

}

initCosmos();
