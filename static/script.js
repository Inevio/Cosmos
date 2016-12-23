// Variables
var worldSelected;
var worldSelectedUsrs;
var me;
var uploaderFunction;
var auxFunction;
var fsnodeId;
var nNotifications        = 0;
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
var starsCanvasContainer  = $( '.stars-canvas' );
var openFolder            = $( '.open-folder' );
var cardsList             = $( '.cards-list' );

var TYPES = {

  "application/pdf"   : 'document',
  "application/zip"    : 'generic',
  "application/x-rar"  : 'generic',
  "application/x-gzip" : 'generic',
  "text/x-c"               : 'document',
  "text/x-c++"             : 'document',
  "text/x-php"             : 'document',
  "text/x-python"          : 'document',
  "application/json"       : 'document',
  "application/javascript" : 'document',
  "application/inevio-texts"                                                    : 'generic',
  "application/msword"                                                          : 'generic',
  "application/vnd.oasis.opendocument.text"                                     : 'generic',
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"     : 'generic',
  "application/inevio-grids"                                          : 'generic',
  "application/vnd.ms-excel"                                          : 'generic',
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : 'generic',
  "application/vnd.ms-powerpoint"                                             : 'generic',
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" : 'generic',
  "audio/mp4"          : 'music',
  "audio/mpeg"         : 'music',
  "audio/flac"         : 'music',
  "audio/x-vorbis+ogg" : 'music',
  "audio/x-wav"        : 'music',
  "image/gif"  : 'image',
  "image/jpeg" : 'image',
  "image/png"  : 'image',
  "image/tiff" : 'image',
  "image/vnd.adobe.photoshop" : 'generic',
  "text/html"    : 'generic',
  "text/plain"   : 'generic',
  "text/rtf"     : 'generic',
  "video/3gpp"         : 'video',
  "video/mp4"          : 'video',
  "video/quicktime"    : 'video',
  "video/webm"         : 'video',
  "video/x-flv"        : 'video',
  "video/x-matroska"   : 'video',
  "video/x-ms-asf"     : 'video',
  "video/x-ms-wmv"     : 'video',
  "video/x-msvideo"    : 'video',
  "video/x-theora+ogg" : 'video'

}


var colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]

//Events
cardsList.on( 'scroll' , function(){

  var scrollDiv = $( this );
  var scrollFinish = $( '.cards-grid' )[0].scrollHeight - scrollDiv.height();

  if ( scrollFinish - scrollDiv.scrollTop() < 300 ) {

    var lastCard = scrollDiv.data( 'lastCard' );
    getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){});
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

exploreButton.on( 'click' , function(){

  $('.explore-container').scrollTop(0);
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
    selectWorld( $( '.world-' + world.id ) , function(){});
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

      if ( worldSelected && worldSelected.id === post.worldId ) {
        appendReplyComment( grandparent , parentPost , post );
      }

    }else{

      var ncomments = grandparent.find( '.comments-text' ).data( 'num' ) + 1;
      grandparent.find( '.comments-text' ).text( ncomments + ' ' + lang.comments );
      grandparent.find( '.comments-text' ).data( 'num' , ncomments );

      if ( worldSelected && worldSelected.id === post.worldId ) {
        appendReply( grandparent , post , function(){});
      }

    }

  }else{

    wz.user( post.author , function( e , user ){

      if ( worldSelected && worldSelected.id === post.worldId ) {

        wql.upsertLastRead( [ post.worldId , myContactID , post.id , post.id ] , function( e , o ){
          if (e) {
            console.log(e);
          }
        });

        var nCards = parseInt( $( '.world-event-number .subtitle' ).text() ) + 1;
        $( '.world-event-number .subtitle' ).text( nCards );


        if ( post.metadata && post.metadata.fileType ) {

          switch (post.metadata.fileType) {

            case 'generic':
            appendGenericCard( post , user , lang.postCreated , function(){});
            break;

            case 'document':
            appendDocumentCard( post , user , lang.postCreated , function(){});
            break;

            case 'image':
            appendDocumentCard( post , user , lang.postCreated , function(){});
            break;

            case 'video':
            appendGenericCard( post , user , lang.postCreated , function(){});
            break;

            case 'music':
            appendGenericCard( post , user , lang.postCreated , function(){});
            break;

          }

        }else if( post.metadata && post.metadata.linkType ){

          switch (post.metadata.linkType) {

            case 'youtube':
            appendYoutubeCard( post , user , lang.postCreated );
            break;

          }

        }else{
          appendNoFileCard( post , user , lang.postCreated );
        }


      }else{

        checkNotifications();
        $( '.world-' + post.worldId ).addClass( 'with-notification' );

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
api.cosmos.on( 'postReplied', function(){console.log('postReplied');})
api.cosmos.on( 'tagAdded', function(){console.log('tagAdded');})
api.cosmos.on( 'userBanned', function(){console.log('userBanned');})
api.cosmos.on( 'userUnbanned', function(){console.log('userUnbanned');})
api.cosmos.on( 'worldPrivateSetted', function(){console.log('worldPrivatized');})
api.cosmos.on( 'worldNameSetted', function(){console.log('worldNameSetted');})

api.cosmos.on( 'postModified', function( post ){

  if ( $( '.post-' + post.id ).hasClass( 'editing' ) ) {
    return;
  }

  if ( worldSelected.id === post.worldId ) {

    $( '.post-' + post.id ).remove();

    wz.user( post.author , function( e , user ){

      if ( post.metadata && post.metadata.fileType ) {

        switch (post.metadata.fileType) {

          case 'generic':
          appendGenericCard( post , user , lang.postCreated , function(){});
          break;

          case 'document':
          appendDocumentCard( post , user , lang.postCreated , function(){});
          break;

          case 'image':
          appendDocumentCard( post , user , lang.postCreated , function(){});
          break;

          case 'video':
          appendGenericCard( post , user , lang.postCreated , function(){});
          break;

          case 'music':
          appendGenericCard( post , user , lang.postCreated , function(){});
          break;

        }

      }else if( post.metadata && post.metadata.linkType ){

        switch (post.metadata.linkType) {

          case 'youtube':
          appendYoutubeCard( post , user , lang.postCreated );
          break;

        }

      }else{
        appendNoFileCard( post , user , lang.postCreated );
      }

    });

  }

})

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

searchPostInput.on( 'input' , function(){

  searchPost( $( this ).val() );

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

  var attachment = $( '.attach-list .attachment-' + fsnode.id );
  if ( attachment.length != -1 ) {
    attachment.find( '.icon' ).css( 'background-image' , 'url(' + fsnode.icons.micro + ')' );
    attachment.find( '.aux-title' ).hide();
    attachment.data( 'fsnode' , fsnode );
    $('.new-card-section').removeClass( 'uploading' );
  }

});

api.cosmos.on( 'worldIconSetted', function( o ){

  $( '.loading-animation-container' ).hide();
  $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'url(' + o.icons.normal + '?' + Date.now() + ')' );
  $( '.wz-groupicon-uploader-start' ).removeClass('non-icon');
  $( '.wz-groupicon-uploader-start' ).addClass('custom-icon');

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

  selectWorld( $( this ) , function(){});

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

  var post = $(this).closest('.card').data('post');
  removePostAsync( post );

})

.on( 'click' , '.card-options-section .edit' , function(){

  if ( $('.card.editing').length != 0 ) {
    alert( lang.editingOne );
    return;
  }
  $( this ).closest( '.card' ).addClass( 'editing' );
  $( this ).closest( '.card' ).find( '.popup' ).removeClass( 'popup' );
  editPostAsync( $( this ).closest( '.card' ) );

})

.on( 'click' , '.delete-comment' , function(){

  var post = $(this).closest('.comment').data('reply');
  removePostAsync( post );

})

.on( 'click' , '.comments-footer .send-button' , function(){

  addReplayAsync( $( this ).parent().parent().parent() );

})

.on( 'click' , '.replay-button' , function(){

  prepareReplayComment( $( this ).parent() );

})

.on( 'click' , '.edit-button' , function(){

  editComment( $( this ).parent() );

})

.on( 'keyup' , '.comments-footer .comment-input' , function( e ){

  if (e.keyCode == 13) {

    if (! e.shiftKey ) {

      e.stopPropagation();
      e.preventDefault();
      addReplayAsync( $( this ).parent().parent().parent() );

    }else{
      adjustHeight( $(this) );
    }

  }else if(e.keyCode == 27){
    if ( $(this).val() === '' ) {
      adjustHeight( $(this) );
      $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment );
    }
  }else{
    adjustHeight( $(this) );
  }

})

.on( 'focusout' , '.comments-footer .comment-input' , function(){
  if ( $(this).val() === '' ) {
    adjustHeight( $(this) );
    $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment );
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

  $( this ).data( 'fsnode' ).open();

})

.on( 'click' , '.friend-list .friend' , function(){

  $(this).find( '.ui-checkbox' ).toggleClass( 'active' );

})

.on( 'click' , '.ui-checkbox' , function( e ){

  e.stopPropagation();
  $(this).toggleClass( 'active' );

})

.on( 'keydown' , '.comment.editing .comment-text' , function( e ){

  var commentOnEditMode = $( this ).parent();
  if (e.keyCode == 13) {
    commentOnEditMode.find( '.comment-text' ).attr( 'contenteditable' , false );
    commentOnEditMode.removeClass( 'editing' );
    commentOnEditMode.data( 'reply' ).setContent( commentOnEditMode.find( '.comment-text' ).text() );
  }

  if (e.keyCode == 27) {
    commentOnEditMode.find( '.comment-text' ).attr( 'contenteditable' , false );
    commentOnEditMode.removeClass( 'editing' );
    commentOnEditMode.find( '.comment-text' ).text( commentOnEditMode.data( 'oldText' ) );
  }


})

.on( 'click' , '.cancel-attachment' , function(){
  $(this).closest('.attachment').remove();
})

.on( 'click' , '.cancel-new-card' , function(){
  $( this ).closest( '.card' ).removeClass( 'editing' );
  $( this ).closest( '.card' ).find( '.card-options' ).removeClass( 'hide' );

})

.on( 'click' , '.save-new-card' , function(){

  var card = $( this ).closest( '.card' );
  var post = card.data( 'post' );

  var prevTitle = card.find( '.title-input' ).data( 'prev' );
  var newTitle = card.find( '.title-input' ).val();

  var prevContent = card.find( '.content-input' ).data( 'prev' );
  var newContent = card.find( '.content-input' ).val();

  var prevFsnode = card.find( '.attach-list' ).data( 'prev' );
  var newAttachments = card.find( '.attachment:not(.wz-prototype)' );
  var newFsnodeIds = [];
  var newFsnode    = [];

  $.each( newAttachments , function( i , attachment ){
    newFsnodeIds.push( $(attachment).data( 'fsnode' ).id );
    newFsnode.push( $(attachment).data( 'fsnode' ) );
  })

  var newMetadata = checkMetadata( newContent , newFsnode );

  if ( wz.tool.arrayDifference( prevFsnode, newFsnodeIds ).length || wz.tool.arrayDifference( newFsnodeIds, prevFsnode ).length ){
    post.setFSNode( newFsnodeIds , function(){
      post.setMetadata( newMetadata , function(){
        post.setTitle( newTitle , function(){
          post.setContent( newContent , function( e , post ){
            setPost( post );
          });
        });
      });
    });
  }else{

    if ( prevTitle != newTitle || prevContent != newContent) {
      post.setTitle( newTitle , function(){
        post.setContent( newContent , function( e , post ){
          setPost( post );
        });
      });
    }

  }

})

.on( 'click' , '.card-content.edit-mode .attachments, .card-content.edit-mode .attachments i, .card-content.edit-mode .attachments div' , function(){
  $(this).closest( '.card' ).find( '.attach-select' ).addClass( 'popup' );
})

.on( 'click' , '.attach-select .inevio' , function(){
  attachFromInevio( $(this).closest( '.card' ) );
})

.on( 'upload-prepared' , function( e , uploader ){

  uploader( worldSelected.volume , function( e , fsnode ){

    appendAttachment( { fsnode: fsnode[0] , uploading: true , card: $('.card.editing') } );

  });

})

.on( 'selectPost' , function( e , params ){

  selectWorld( $( '.world-' + params.world ) , function(){
    $( '.search-button' ).addClass( 'popup' );
    $( '.search-button input' ).val( params.title );
    searchPost( params.title );
  });

})

//Functions
var initCosmos = function(){

  app.css({'border-radius'    : '6px', 'background-color' : 'transparent'});

  initTexts();
  getMyWorldsAsync();
  starsCanvas( 'stars-canvas' );

  if ( params && params.action === 'selectPost') {
    selectWorld( $( '.world-' + params.world ) , function(){
      $( '.search-button' ).addClass( 'popup' );
      $( '.search-button input' ).val( params.title );
      searchPost( params.title );
    });
  }

  checkNotifications();

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
  $( '.card-options-section .edit span' ).text( lang.editPost );
  $( '.card-content.edit-mode .title-input' ).attr( 'placeholder' , lang.writeTitle );
  $( '.card-content.edit-mode .content-input' ).attr( 'placeholder' , lang.writeDescription );
  $( '.send-button span' ).text( lang.send );
  $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment );
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
  $( '.cancel-invite-user span' ).text( lang.cancel );
  $( '.invite-user span' ).text( lang.invite );
  $( '.cancel-new-card span' ).text( lang.cancel );
  $( '.save-new-card span' ).text( lang.save );
  $( '.attachments span' ).text( lang.addFiles );
  $( '.attach-select .inevio span' ).text( lang.uploadInevio );
  $( '.attach-select .pc span' ).text( lang.uploadPC );
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

  layer1.src = 'https://static.inevio.com/app/360/starlayer1.png';
  layer2.src = 'https://static.inevio.com/app/360/starlayer2.png';
  layer3.src = 'https://static.inevio.com/app/360/starlayer3.png';

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

var getMyWorldsAsync = function( options ){

  var myWorldsApi = app.data( 'myWorlds' );
  console.log(myWorldsApi);

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

var selectWorld = function( world , callback ){

  $( '.clean' ).remove();
  $( '.category-list .world' ).removeClass( 'active' );
  world.addClass( 'active' );
  $( '.scrolled' ).removeClass( 'scrolled' );
  searchPostInput.val('');
  searchPost( '' );

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
  getWorldPostsAsync( worldApi , { init: 0 , final: 6 } , function(){

    if ( $( '.world.active' ).hasClass( 'with-notification' ) ) {
      updateNotifications( worldApi );
    }

    callback();
  });
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

var checkContains = function( base , contains ){

  return base.indexOf( contains ) != -1;

}

var getWorldPostsAsync = function( world , interval , callback ){

  if ( interval.init === 0 ) {
    world.getPosts( {from: 0 , to: 100000 } , function( e , posts ){
      $( '.world-event-number .subtitle' ).text( posts.length );
    });
  }

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

    $( '.cards-list' ).data( 'lastCard' , interval.final );

    var postPromises = [];

    $.each( posts , function( i , post ){

      var promise = $.Deferred();
      postPromises.push( promise );

      wz.user( post.author , function( e , user ){

        if ( post.metadata && post.metadata.fileType ) {

          switch (post.metadata.fileType) {

            case 'generic':
            appendGenericCard( post , user , lang.postCreated , function(){
              promise.resolve();
            });
            break;

            case 'document':
            appendDocumentCard( post , user , lang.postCreated , function(){
              promise.resolve();
            });
            break;

            case 'image':
            appendDocumentCard( post , user , lang.postCreated , function(){
              promise.resolve();
            });
            break;

            case 'video':
            appendGenericCard( post , user , lang.postCreated , function(){
              promise.resolve();
            });
            break;

            case 'music':
            appendGenericCard( post , user , lang.postCreated , function(){
              promise.resolve();
            });
            break;

          }

        }else if( post.metadata && post.metadata.linkType ){

          switch (post.metadata.linkType) {

            case 'youtube':
            appendYoutubeCard( post , user , lang.postCreated );
            promise.resolve();
            break;

          }

        }else{
          appendNoFileCard( post , user , lang.postCreated );
          promise.resolve();
        }

      });

    });

    loadingPost = false;

    $.when.apply( null, postPromises ).done( function(){
      callback();
    });

  });

}

var appendNoFileCard = function( post , user , reason ){

  var card = genericCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  card.find( '.doc-preview' ).hide();

  if ( post.title === '' ) {

    card.find( '.title' ).hide();

  }else{

    card.find( '.title' ).text( post.title );

  }

  if ( post.content === '' ) {

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

var appendGenericCard = function( post , user , reason , callback ){

  var card = genericCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  var fsnodes = [];
  post.fsnode.forEach(function( fsnode ){

    var promise = $.Deferred();
    fsnodes.push( promise );

    wz.fs( fsnode , function( e , fsnode ){
      promise.resolve( e ? null: fsnode );
    });

  });

  $.when.apply( null, fsnodes ).done( function(){

    var fsnodes = arguments;

    for (var i = 0; i < fsnodes.length; i++) {

      var fsnode = fsnodes[i];

      if ( card.find( '.attachment-' + fsnode.id ).length === 0 ){

        var docPreview = card.find( '.doc-preview.wz-prototype' ).clone();
        docPreview.removeClass( 'wz-prototype' ).addClass( 'attachment-' + fsnode.id );
        docPreview.find( '.doc-icon img' ).attr( 'src' , fsnode.icons.small );
        if ( fsnode.mime.indexOf( 'office' ) > -1 ) {
          docPreview.find( '.doc-icon' ).addClass( 'office' );
        }
        docPreview.find( '.doc-title' ).text( fsnode.name );
        docPreview.find( '.doc-info' ).text( fsnode.mime );
        card.find( '.desc' ).after( docPreview );
        docPreview.data( 'fsnode' , fsnode );

      }

    }

    if ( post.title === '' ) {

      card.find( '.title' ).hide();

    }else{

      card.find( '.title' ).text( post.title );

    }

    if ( post.content === '' ) {

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
    callback();

  });

}

var appendDocumentCard = function( post , user , reason , callback ){

  var card = documentCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  api.fs( post.fsnode[ 0 ], function( e , fsNode ){

    console.log( fsNode , 'imagen!');

    card.find( '.doc-preview' ).css( 'background-image' , 'url( '+ fsNode.thumbnails.big +' )' );
    card.find( '.preview-title' ).text( fsNode.name );
    card.find( '.preview-info' ).text( wz.tool.bytesToUnit( fsNode.size, 1 ) );
    card.find( '.doc-preview' ).data( 'fsnode' , fsNode );
    card.find( '.doc-preview-bar i' ).css( 'background-image' , 'url( '+ fsNode.icons.micro +' )' );;

    if ( post.title === '' ) {
      card.find( '.title' ).hide();
    }else{
      card.find( '.title' ).text( post.title );
    }

    if ( post.content === '' ) {
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
    callback();

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

  post.getReplies( { from : 0, to : 1000 }, function( e , replies ){

    replies = replies.reverse();
    card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    card.find( '.comments-text' ).data( 'num' , replies.length );

    $.each( replies , function( i , reply ){

      appendReply( card , reply , function(){

        reply.getReplies( { from : 0 , to : 1000 }, function( e , responses ){

          responses = responses.reverse();

          $.each( responses , function( i , response ){

            appendReplyComment( card , reply , response );

          });

        });

      });

    });

  });

}

var appendReply = function( card , reply , callback ){

  var comment = commentPrototype.eq(0).clone();
  comment.removeClass( 'wz-prototype' ).addClass( 'commentDom comment-' + reply.id );
  comment.find( '.replay-button' ).text( lang.reply );
  comment.find( '.edit-button' ).text( lang.edit );

  wz.user( reply.author , function( e , user ){

    if ( reply.author === myContactID ) {
      comment.addClass('mine');
    }

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
    card.find( '.comments-list' ).scrollTop( comment[0].offsetTop );

    comment.data( 'reply' , reply );
    comment.data( 'name' , user.name.split( ' ' )[0] );

    callback();

  });

}

var appendCard = function( card , post ){

  var worldActive = $( '.world.active' ).data( 'world' );
  if ( post.worldId != worldActive.id ) {
    return;
  }
  if ( $( '.post-' + post.id ).length != 0 ) {
    $( '.post-' + post.id ).remove();
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

var removePostAsync = function( post ){

  var confirmText = lang.comfirmDeletePost;
  if ( post.isReply ) {
    confirmText = lang.comfirmDeleteComment;
  }
  confirm( confirmText , function(o){
    if(o){

      worldSelected.removePost( post.id , function( e , o ){

        if (e) {
          alert( lang.notAllowedDeletePost );
        }

      });

    }
  });

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

  });

}

var addReplayAsync = function( card ){

  var post  = card.data( 'post' );
  var msg   = card.find( '.comments-footer .comment-input' ).val();
  var input = card.find( '.comments-footer .comment-input' );

  if ( input.attr( 'placeholder' )[0] === '@' ) {
    post = input.data( 'reply' );
    $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment );
  }

  post.reply( { content: msg }, function( e, o ){
    input.val('');
    adjustHeight( input );
  });

}

var exploreAnimationIn = function(){

  var exploreSection = $( '.explore-section' );

  exploreSection.css( 'display' , 'block');
  starsCanvasContainer.removeClass( 'no-visible' );
  starsCanvasContainer.stop().clearQueue().transition({

    'opacity' : 1


  }, 300, function(){
    $('.explore-container').scrollTop(0);
  });

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
  var input = comment.parent().parent().find( '.comments-footer .comment-input' );

  input.attr( 'placeholder' ,  '@' + name + ' ');
  input.focus();
  input.data( 'reply' , post );

}

var editComment = function( comment ){

  comment.data( 'oldText' , comment.find( '.comment-text' ).text() );
  comment.find( '.comment-text' ).attr( 'contenteditable' , true );
  comment.find( '.comment-text' ).attr( 'placeholder' , lang.writeComment );
  comment.find( '.comment-text' ).focus();
  comment.addClass( 'editing' );

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
    reply.find( '.replay-text' ).html( response.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    reply.find( '.replay-text' ).find('a').each( function(){

      if( !(/^http(s)?:\/\//i).test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    comment.find( '.replay-list' ).append( reply );
    card.find( '.comments-list' ).scrollTop( reply[0].offsetTop );

    reply.data( 'reply' , response );

  });

}

var cleanFilterWorldCards = function(){

  searchWorldCard.val( '' );
  filterWorldCards( '' );

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

var searchPost = function( filter ){

  searchPostQuery = searchPostQuery + 1;
  var searchPostQueryCopy = searchPostQuery;

  if ( filter === '' ) {
    $( '.card' ).show();
    return;
  }

  $( '.card' ).hide();

  worldSelected.searchPost( filter , {from:0 , to:1000} , function( e , posts ){

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

}

var editPostAsync = function( card ){

  var post = card.data( 'post' );
  console.log(post);
  card.find( '.title-input' ).val( post.title );
  card.find( '.title-input' ).data( 'prev' , post.title );
  card.find( '.content-input' ).val( post.content );
  card.find( '.content-input' ).data( 'prev' , post.content );
  card.find( '.card-options' ).addClass( 'hide' );

  card.find( '.attach-list' ).data( 'prev' , post.fsnode );
  if ( post.fsnode.length != 0 ) {

    post.fsnode.forEach(function( fsnodeId ){
      var fsnode;
      if ( post.fsnode.length === 1 ) {
        fsnode = card.find( '.doc-preview' ).data( 'fsnode' );
      }else{
        fsnode = card.find( '.attachment-' + fsnodeId ).data( 'fsnode' );
      }

      appendAttachment( { fsnode: fsnode , uploading: false , card: card  } );

    });

  }
}

var appendAttachment = function( info ){

  if ( info.card.find( '.attach-list .attachment-' + info.fsnode.id ).length != 0 ) {
    return;
  }

  var attachment = info.card.find( '.attachment.wz-prototype' ).clone();
  attachment.removeClass( 'wz-prototype' ).addClass( 'attachment-' + info.fsnode.id );
  attachment.find( '.attachment-title' ).text( info.fsnode.name );
  if ( info.uploading ) {
    attachment.find( '.aux-title' ).show().text( lang.uploading );
    $('.new-card-section').addClass( 'uploading' );
  }else{
    attachment.find( '.icon' ).css( 'background-image' , 'url(' + info.fsnode.icons.micro + ')' );
  }
  info.card.find( '.attachment.wz-prototype' ).after( attachment );
  attachment.data( 'fsnode' , info.fsnode );

}

var attachFromInevio = function( card ){

  api.fs.selectSource( { 'title' : 'Selecciona!' , 'mode' : 'file' , 'multiple': true } , function( e , s ){

    if (e) {
      console.log( e );
      return;
    }

    $( '.attach-select' ).removeClass( 'popup' );

    s.forEach(function( attach ){

      api.fs( attach , function( e , fsnode ){

        if (e) {
          console.log(e);
        }else{
          appendAttachment( { fsnode: fsnode , uploading: false , card: card } );
        }

      });

    });

  })

}

var updateNotifications = function( world ){

  var lastPost = $( '.cardDom' );
  if ( lastPost ) {
    lastPost = lastPost.eq(0).data( 'post' );
    wql.upsertLastRead( [ world.id , myContactID , lastPost.id , lastPost.id ] , function( e , o ){
      checkNotifications();
      $( '.world-' + world.id ).removeClass( 'with-notification' );
    });
  }

}

var checkNotifications = function(){

  nNotifications = 0;

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , worlds ){

    worlds.forEach(function( world ){

      world.getPosts( {from: 0 , to: 1 } , function( e , lastPost ){

        if( lastPost.length === 0){
          wz.app.setBadge( parseInt(nNotifications) );
          return;
        }

        wql.selectLastRead( [ world.id , myContactID ] , function( e , lastPostReaded ){

          if ( lastPostReaded.length === 0 || lastPost[0].id != lastPostReaded[0].post ) {

            $( '.world-' + world.id ).addClass( 'with-notification' );
            nNotifications = nNotifications + 1;
            wz.app.setBadge( parseInt(nNotifications) );

          }else{
            wz.app.setBadge( parseInt(nNotifications) );
          }

        });

      });

    });

  });

}

var checkMetadata = function( content , fsnode ){

  var newMetadata;

  if ( fsnode.length > 0 ) {
    if ( fsnode.length === 1 ) {
      newMetadata = { fileType: checkTypePost( fsnode[0] ) };
    }else{
      newMetadata = { fileType: 'generic' };
    }
  }else if( content.indexOf( 'www.youtube' ) != -1 ){
    newMetadata = { linkType: 'youtube' };
  }else{
    newMetadata = null;
  }
  return newMetadata;
}

var checkTypePost = function( fsnode ){
  var fileType = 'generic';
  if ( fsnode.mime ) {
    fileType = guessType( fsnode.mime );
  }

  return fileType;
}

var guessType = function( mime ){
  return TYPES[ mime ] || 'generic';
}

var setPost = function( post ){

  if ( worldSelected.id === post.worldId ) {

    $( '.post-' + post.id ).remove();

    wz.user( post.author , function( e , user ){

      if ( post.metadata && post.metadata.fileType ) {

        switch (post.metadata.fileType) {

          case 'generic':
          appendGenericCard( post , user , lang.postCreated , function(){});
          break;

          case 'document':
          appendDocumentCard( post , user , lang.postCreated , function(){});
          break;

          case 'image':
          appendDocumentCard( post , user , lang.postCreated , function(){});
          break;

          case 'video':
          appendGenericCard( post , user , lang.postCreated , function(){});
          break;

          case 'music':
          appendGenericCard( post , user , lang.postCreated , function(){});
          break;

        }

      }else if( post.metadata && post.metadata.linkType ){

        switch (post.metadata.linkType) {

          case 'youtube':
          appendYoutubeCard( post , user , lang.postCreated );
          break;

        }

      }else{
        appendNoFileCard( post , user , lang.postCreated );
      }

    });

  }

}

var adjustHeight = function( textarea ){
  textarea[0].style.height = "1px";
  textarea[0].style.height = (textarea[0].scrollHeight - 5 )+"px";
}

initCosmos();
