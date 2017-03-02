// Variables
var worldSelected;
var worldSelectedUsrs;
var me;
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
var exploreButton         = $( '.explore-button' );
var unFollowButton        = $( '.stop-follow' );
var commentPrototype      = $( '.comment.wz-prototype' );
var openChatButton        = $( '.open-chat' );
var worldDescription      = $( '.world-desc' );
var searchPostInput       = $( '.pre-cover .search-button input, .mobile-world-content .search-bar input' );
var cleanPostSearch       = $( '.search-button .clean-search' );
//var newPostButton       = $( '.new-post, .no-post-new-post-button' );
//var closeExplore        = $( '.close-explore' );
var noWorlds              = $( '.no-worlds' );
var starsCanvasContainer  = $( '.stars-canvas' );
var openFolder            = $( '.open-folder' );
var cardsList             = $( '.cards-list' );
var mobileView              = 'worldSidebar'
var mobileWorldContent      = $( '.mobile-world-content' );
var mobileWorldSidebar      = $( '.mobile-world-list' );
var mobileWorldComments     = $( '.mobile-world-comments' );
var mobileNewWorld          = $( '.mobile-new-world' );
var mobileExplore           = $( '.mobile-explore' );
var mobileNewPost           = $( '.mobile-new-post' );
var newWorldButton  = $( '.new-world-button, .start-button-no-worlds, .new-world-button-mini' );
var closeNewWorld   = $( '.close-new-world' );
var searchBar       = $( '.search-button' );
var searchBarFigure = $( '.search-button i' );


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

var URL_REGEX = /^http(s)?:\/\//i;
var colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]

//Events
cardsList.on( 'scroll' , function(){

  var scrollDiv = $( this );
  var scrollFinish = $( '.cards-grid' )[0].scrollHeight - scrollDiv.height();

  if ( scrollFinish - scrollDiv.scrollTop() < 300 ) {

    var lastCard = scrollDiv.data( 'lastCard' );
    getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){});
    loadingPost = true;

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

  if (isMobile()) {
    changeMobileView('explore');
  }
  $('.explore-container').scrollTop(0);
  $( '.world-card-dom' ).remove();
  cleanFilterWorldCards();
  getPublicWorldsAsync();

});

unFollowButton.on( 'click' , function(){

  if ( ! $( this ).hasClass( 'editable' ) ) {

    unFollowWorld( worldSelected );

  }else{

    $( '.new-world-container' ).data( 'world' , worldSelected );
    if (isMobile()) {
      changeMobileView('newWorld');
    }

  }

});

openChatButton.on( 'click' , function(){
  wz.app.openApp( 14 , [ 'open-world-chat' , world , function( o ){
    console.log(o);
  }]);
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
      if ( ncomments === 1 ) {
        grandparent.find( '.comments-text' ).text( ncomments + ' ' + lang.comment );
      }else{
        grandparent.find( '.comments-text' ).text( ncomments + ' ' + lang.comments );
      }
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

            case 'document':
            case 'image':
            appendDocumentCard( post , user , lang.postCreated , function(){});
            break;
            /*case 'generic':
            case 'video':
            case 'music':*/
            default:
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
    checkNotifications();

    if ( noWorlds.css( 'display' ) != 'none' ) {

      noWorlds.transition({

        'opacity'         : 0

      }, 200, animationEffect , function(){

        noWorlds.hide();
        starsCanvasContainer.stop().clearQueue().transition({

          'opacity' : 0


        }, 300 , function(){

          starsCanvasContainer.addClass( 'no-visible' );
          if ( $( '.world-' + world.id ).length ) {
            selectWorld( $( '.world-' + world.id ) , function(){});
          }

        });

      });

    }

  }

  if( worldSelected && world.id === worldSelected.id ){

    getWorldUsersAsync( worldSelected );

  }

});

api.cosmos.on( 'userRemoved', function( userId , world ){

  if ( userId != myContactID  && world.id === worldSelected.id ) {

    $( '.user-circle' ).remove();
    getWorldUsersAsync( worldSelected );

  }else if( userId === myContactID ){

    var worldList = $( '.world-' + world.id ).parent();

    $( '.world-' + world.id ).parent().transition({

      'height'         : worldList.height() - $( '.world.wz-prototype' ).outerHeight()

    }, 200);
    $( '.world-' + world.id ).remove();


    var index = myWorlds.indexOf( world.id );
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

  }

});

app.on( 'ui-view-resize ui-view-maximize ui-view-unmaximize' , function(){

  if(isMobile()){
    return;
  }

  var name = worldTitle.data( 'name' );
  var winWidth = parseInt(app.find('.cover-first').css( 'width' )) - 50;
  var textWidth = Math.floor( winWidth * 0.054 );

  if ( name.length > textWidth ) {

    worldTitle.css('font-size' , '27px');
    textWidth = Math.floor( winWidth * 0.07 );
    if ( !isMobile() && name.length > textWidth ) {
      worldTitle.text( name.substr(0 , textWidth - 3) + '...' );
    }else{
      worldTitle.text( name );
    }
  }else{
    worldTitle.css('font-size' , '37px');
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

  if ( post.isReply ) {
    $( '.comment-' + post.id ).find( '.comment-text' ).html( post.content.replace(/\n/g, "<br />") );

  }else{

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

  }

})

api.cosmos.on( 'worldNameSetted' , function( worldApi ){

  var category = $( '.world-' + worldApi.id ).parent();
  $( '.world-' + worldApi.id ).remove();
  var height = category.find( '.world' ).length * $( '.world.wz-prototype' ).outerHeight();
  category.css({

    'height'         : height

  });

  appendWorld( worldApi );

  if ( ( worldSelected && worldApi.id === worldSelected.id ) || worldApi.owner === myContactID ){
    selectWorld( $( '.world-' + worldApi.id ) , function(){});
  }

});

api.cosmos.on( 'worldPrivateSetted' , function( world ){

  console.log('asdasdasdasdasd',world);

});

api.cosmos.on( 'worldRemoved', function(){console.log('worldRemoved');})

searchPostInput.on( 'input' , function(){

  searchPost( $( this ).val() );

});

cleanPostSearch.on( 'click' , function(){
  var searcher = $(this).closest('.search-button');
  searcher.find('input').val('')
  searchPost('');
});

openFolder.on( 'click' , function(){

  wz.fs( worldSelected.volume , function( e , o ){

    o.open();

  });

});

api.upload.on( 'worldIconProgress', function( percent ){
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

api.upload.on( 'worldIconEnd', function( worldId ){

  $( '.loading-animation-container' ).hide();
  $( '.wz-groupicon-uploader-start' ).removeClass('non-icon');
  $( '.wz-groupicon-uploader-start' ).addClass('custom-icon');

})

api.cosmos.on( 'worldIconSetted' , function( world ){

  if ( $( '.world.active' ).hasClass( 'world-' + world.id ) ) {
    $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'url(' + world.icons.normal + '?token=' + Date.now() + ')' );
    $( '.world-avatar' ).css( 'background-image' , 'url(' + world.icons.normal + '?token=' + Date.now() + ')' );
  }

});

newWorldButton.on( 'click' , function(){

  if (isMobile()) {
    changeMobileView('newWorld');
  }

});

closeNewWorld.on( 'click' , function(){

  if (isMobile()) {
    mobileNewWorld.stop().clearQueue().transition({
      'transform' : 'translateY(-100%)'
    }, 300, function(){
      mobileNewWorld.addClass('hide');
    });
  }

});

app

.on( 'keydown' , '.comment-text-edit' , function( e ){

  var commentOnEditMode = $( this ).parent();
  if (e.keyCode == 13) {

    if (! e.shiftKey) {
      commentOnEditMode.removeClass( 'editing' );
      commentOnEditMode.data( 'reply' ).setContent( commentOnEditMode.find( '.comment-text-edit' ).val() );

      commentOnEditMode.find('.edit-button').removeClass( 'save' );
      commentOnEditMode.find('.edit-button').text( lang.edit );
    }

  }

  if (e.keyCode == 27) {
    commentOnEditMode.removeClass( 'editing' );
  }

})

.on( 'click' , '.create-world-button.step-a' , function(){

  createWorldAsync();

})

.on( 'click' , '.delete-world-button' , function(){

  unFollowWorld( worldSelected );
  $( '.new-world-container' ).removeClass( 'editing' );
  if (isMobile()) {
    changeMobileView('worldSidebar');
    mobileNewWorld.stop().clearQueue().transition({
      'transform' : 'translateY(-100%)'
    }, 300, function(){
      mobileNewWorld.addClass('hide');
    });
  }

})

.on( 'click' , '.create-world-button.step-b' , function(){

  editWorldAsync();
  if (isMobile()) {
    mobileNewWorld.stop().clearQueue().transition({
      'transform' : 'translateY(-100%)'
    }, 300, function(){
      mobileNewWorld.addClass('hide');
    });
  }
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

.on( 'click' , '.delete-comment.parent' , function(){

  var post = $(this).closest('.comment').data('reply');
  removePostAsync( post );

})

.on( 'click' , '.delete-comment.child' , function(){

  var post = $(this).closest('.replyDom').data('reply');
  removePostAsync( post );

})

.on( 'click' , '.comments-footer .send-button' , function(){

  addReplayAsync( $( this ).parent().parent().parent() );

})

.on( 'click' , '.replay-button' , function(){

  prepareReplayComment( $( this ).parent() );

})

.on( 'keypress' , '.comments-footer .comment-input' , function( e ){
  if (e.keyCode == 13) {
    if (! e.shiftKey ) {
      addReplayAsync( $( this ).parent().parent().parent() );
    }
  }
})

.on( 'focusout' , '.comments-footer .comment-input' , function(){
  if ( $(this).val() === '' ) {
    $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment );
  }
})

.on( 'click' , '.world-card-dom' , function(){

  var world = $( this ).data( 'world' );
  var worldSelectable = $( '.world-' + world.id );
  if ( worldSelectable.length > 0 ) {

    if (isMobile()) {
      changeMobileView('worldSidebar');
    }else{
      $( '.close-explore' ).click();
    }
    worldSelectable.click();

  }

})

.on( 'click' , '.doc-preview' , function(){

  var attachment = $( this );
  var fsnode =  $( this ).data( 'fsnode' );
  var fsnodeList = [];
  $.each( attachment.closest( '.card' ).find( '.doc-preview:not(.wz-prototype)' ) , function( i , attachment ){
    fsnodeList.push( $( attachment ).data( 'fsnode' ) );
  });

  fsnode.open( fsnodeList.filter(function( item ){ return item.type === fsnode.type; }).map( function( item ){ return item.id; }), function( error ){

    if( error ){
      console.log( error );
      fsnode.openLocal();
    }

  });

})

.on( 'click' , '.friend-list .friend' , function(){

  $(this).find( '.ui-checkbox' ).toggleClass( 'active' );

})

.on( 'click' , '.ui-checkbox' , function( e ){

  e.stopPropagation();
  $(this).toggleClass( 'active' );

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
    newFsnodeIds.push( parseInt($(attachment).data( 'fsnode' ).id) );
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
  }else if ( newContent.indexOf( 'www.youtube' ) !== -1 ) {
    newMetadata.linkType = 'youtube';
    post.setMetadata( newMetadata , function(){
      post.setTitle( newTitle , function(){
        post.setContent( newContent , function( e , post ){
          setPost( post );
        });
      });
    });
  }else if ( prevTitle != newTitle || prevContent != newContent) {
    post.setTitle( newTitle , function(){
      post.setContent( newContent , function( e , post ){
        setPost( post );
      });
    });
  }else{
    $( this ).closest( '.card' ).removeClass( 'editing' );
    $( this ).closest( '.card' ).find( '.card-options' ).removeClass( 'hide' );
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

.on( 'contextmenu' , '.worldDom' , function(){

  var menu = api.menu();
  var worldDom = $( this );
  var world = worldDom.data( 'world' );
  var isMine = world.owner === myContactID ? true : false;

  menu.addOption( lang.searchPost , function(){

    if ( worldDom.hasClass( 'active' ) ) {

      $( '.search-button' ).click();

    }else{

      selectWorld( worldDom , function(){
        $( '.search-button' ).click();
      });

    }

  })

  if ( isMine ) {

    menu.addOption( lang.editWorld , function(){

      if ( worldDom.hasClass( 'active' ) ) {

        unFollowButton.click();

      }else{

        selectWorld( worldDom , function(){
          unFollowButton.click();
        });

      }

    });

  }else{

    menu.addOption( lang.abandonWorld , function(){

      unFollowWorld( world );

    }, 'warning');

  }

  menu.render();

})

.on( 'click' , '.world-context-menu' , function(){

  $('.world-option:not(.wz-prototype)').remove();
  $('.world-options, .world-options *').addClass('popup');
  var option = $('.world-option.wz-prototype').clone();
  option.removeClass('wz-prototype').addClass('popup');

  var isMine = worldSelected.owner === myContactID ? true : false;
  if ( isMine ) {
    option.addClass('editWorldOption').find('span').text( lang.editWorld );
  }else{
    option.addClass('removeWorldOption').find('span').text( lang.abandonWorld );
  }

  $('.world-options').append(option);
})

.on( 'click' , '.editWorldOption' , function(){
  unFollowButton.click();
})

.on( 'click' , '.removeWorldOption' , function(){
  unFollowWorld( worldSelected );
})

.on( 'swiperight' , function(){
  if (isMobile() && mobileView == 'worldContent') {
    $('.mobile-world-content .go-back').click();
  }
})

.on( 'click' , '.comments-opener' , function(){
  if (isMobile()) {
    changeMobileView('worldComments');
    var card = $(this).closest('.card');
    var post = card.data('post');
    setRepliesAsyncOnlyAppendMobile( card , post );
    mobileWorldComments.data( 'post' , post );
  }
})

.on( 'click' , '.close-comments' , function(){
  changeMobileView('worldContent');
})

.on( 'click' , '.mobile-explore .go-back' , function(){
  changeMobileView('worldSidebar');
})

.on( 'click' , '.mobile-world-content .go-back' , function(){
  changeMobileView('worldSidebar');
})

.on( 'click' , '.cancel-search' , function(){
  $('.mobile-world-content').removeClass('searching');
})

.on( 'click' , '.new-post-mobile' , function(){
  if (isMobile()) {
    newPostMobile();
  }
})

.on( 'click' , '.close-new-post' , function(){
  if (isMobile()) {
    $( '.attachment:not(.wz-prototype)').remove();
    changeMobileView('worldContent');
  }
})

.on( 'click' , '.post-new-card' , function(){
  if (isMobile()) {
    if ( $( '.new-card-input' ).val().trim() === '' ) {
      navigator.notification.alert( '', function(){},lang.noInfo );
    }else{
      changeMobileView('worldContent');
    }
  }
})

.on( 'focus' , '.new-world-name input' , function(){
  if (isMobile()) {
    $('.create-world-button').addClass('hide');
    $(this).closest('.mobile-new-world').addClass('reduce-margin');
  }
})

.on( 'blur' , '.new-world-name input' , function(){
  if (isMobile()) {
    $('.create-world-button').removeClass('hide');
    $(this).closest('.mobile-new-world').removeClass('reduce-margin');
  }
})

.on( 'backbutton' , function( e ){

  e.stopPropagation();

  switch (mobileView) {

    case 'worldContent':
      var view = $('.mobile-world-content');
      if (view.hasClass('searching')) {
        view.removeClass('searching');
      }else if(view.find('.editing').length > 0){
        view.find('.editing .cancel-new-card').click();
      }else{
        changeMobileView('worldSidebar');
      }
      break;
    case 'worldComments':
      changeMobileView('worldContent');
      break;
    case 'newPost':
      changeMobileView('worldContent');
      break;
    case 'explore':
      changeMobileView('worldSidebar');
      break;
    case 'newWorld':
      mobileNewWorld.stop().clearQueue().transition({
        'transform' : 'translateY(-100%)'
      }, 300, function(){
        mobileNewWorld.addClass('hide');
      });
      break;
  }

})

//Functions
var initCosmos = function(){

  if (!isMobile()) {
    app.css({'border-radius'    : '6px', 'background-color' : '#2c3238'});
    starsCanvas( 'stars-canvas' );
  }else{
    setMobile();
  }

  initTexts();
  wql.isFirstOpen( [ myContactID ] , function( e , o ){
    if ( o.length === 0 ) {
      noWorlds.show();
      starsCanvasContainer.removeClass( 'no-visible' );
      starsCanvasContainer.css({
        'opacity' : 1
      });
      noWorlds.css({
        'opacity'         : 1
      });
      wql.firstOpenDone( [ myContactID ] , function( e , o ){
        if(e) console.log(e);
      });
    }
  });

  getMyWorldsAsync();

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
  if (isMobile()) {
    $( '.stop-follow span' ).text( lang.exit );
  }else{
    $( '.stop-follow span' ).text( lang.unfollowWorld );
  }
  $( '.select-world span' ).text( lang.selectWorld );
  $( '.no-posts .left-side span' ).text( lang.noPosts );
  $( '.no-posts .right-side span' ).text( lang.createNewPost );
  $( '.no-worlds .title' ).text( lang.welcome );
  $( '.no-worlds .subtitle' ).text( lang.intro );
  $( '.no-worlds .subtitle2' ).text( lang.intro2 );
  $( '.no-worlds .chat-feature .description' ).html( lang.feature1 );
  $( '.no-worlds .files-feature .description' ).html( lang.feature2 );
  $( '.no-worlds .posts-feature .description' ).html( lang.feature3 );
  $( '.start-button-no-worlds span' ).text( lang.start );
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
  $( '.attach-select .inevio span, .attach-select-new-post .inevio span' ).text( lang.uploadInevio );
  $( '.attach-select .pc span, .attach-select-new-post .pc span' ).text( lang.uploadPC );
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

    $.each( $('.category') , function( i , category ){

      if ( $(category).find('.world-list .world').length === 0 ) {
        $(category).find( '.world-list' ).transition({
          'height'         : '0px'
        }, 200);
        $(category).addClass('closed');
      }


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
  if (isMobile()) {
    world.find( '.world-icon' ).css( 'background-image' , 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')' );
  }else{
    world.find( '.world-icon' ).css( 'border-color' , colors[ worldApi.id % colors.length ] );
  }

  var category;

  if ( worldApi.isPrivate ) {

    category = $( '.private-list' );

  }else{

    category = $( '.public-list' );

  }

  appendWorldInOrder( category , world , worldApi );
  var height = category.find( '.world' ).length * $( '.world.wz-prototype' ).outerHeight();
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
  var worldTitle = worldApi.name;
  if ( worldTitle.length > 32 ) {
    worldTitle = worldTitle.substr(0 , 29) + '...';
  }
  world.find( '.world-title-min' ).text( worldTitle );
  world.find( '.world-avatar-min' ).css( 'background-image' , 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')' );

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

  wz.cosmos.create( worldName , null, true , null , function( e , o ){

    if ( e ) {
      console.log( e );
    }
    createChat( o );

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

  //Not select allowed while animations
  if (app.hasClass('animated')) {
    return;
  }

  if (isMobile()) {
    changeMobileView('worldContent');
  }

  app.addClass( 'selectingWorld' );
  $( '.clean' ).remove();
  $( '.category-list .world' ).removeClass( 'active' );
  world.addClass( 'active' );
  searchPostInput.val('');
  searchPost( '' );

  var worldApi = world.data( 'world' );
  worldSelected = worldApi;
  app.data( 'worldSelected' , worldSelected )

  var name = worldApi.name;
  var winWidth = parseInt(app.find('.cover-first').css( 'width' )) - 50;
  var textWidth = Math.floor( winWidth * 0.054 );

  if ( name.length > textWidth ) {
    worldTitle.css('font-size' , '27px');
    textWidth = Math.floor( winWidth * 0.07 );
    if ( !isMobile() && name.length > textWidth ) {
      worldTitle.text( name.substr(0 , textWidth - 3) + '...' );
    }else{
      worldTitle.text( name );
    }
  }else{
    worldTitle.css('font-size' , '37px');
    worldTitle.text( name );
  }

  $( '.world-avatar' ).css( 'background-image' , 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')' );

  worldTitle.data( 'name' , name );

  worldDescription.text( worldApi.description );

  getWorldUsersAsync( worldApi );
  getWorldPostsAsync( worldApi , { init: 0 , final: 6 } , function(){

    if ( $( '.world.active' ).hasClass( 'with-notification' ) ) {
      updateNotifications( worldApi );
    }

    callback();
    app.removeClass( 'selectingWorld' );
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
    if (isMobile()) {
      $( '.stop-follow span' ).text( lang.exit );
    }else{
      $( '.stop-follow span' ).text( lang.unfollowWorld );
    }
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
  friendSearchBox.val('');
  filterFriends('');

  api.user.friendList( false, function( error, friends ){

    friends.sort(function(a , b){
      if(a.fullName < b.fullName) return -1;
      if(a.fullName > b.fullName) return 1;
      return 0;
    });

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

  world.getPosts( {from: interval.init , to: interval.final , withFullUsers: true } , function( e , posts ){

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

      if( post.metadata && post.metadata.operation === 'remove' ){

        appendGenericCard( post , post.authorObject , lang.postCreated , function(){
          promise.resolve();
        });

      }else if ( post.metadata && post.metadata.fileType ) {

        switch (post.metadata.fileType) {

          case 'generic':
          appendGenericCard( post , post.authorObject , lang.postCreated , function(){
            promise.resolve();
          });
          break;

          case 'document':
          appendDocumentCard( post , post.authorObject , lang.postCreated , function(){
            promise.resolve();
          });
          break;

          case 'image':
          appendDocumentCard( post , post.authorObject , lang.postCreated , function(){
            promise.resolve();
          });
          break;

          case 'video':
          appendGenericCard( post , post.authorObject , lang.postCreated , function(){
            promise.resolve();
          });
          break;

          case 'music':
          appendGenericCard( post , post.authorObject , lang.postCreated , function(){
            promise.resolve();
          });
          break;

        }

      }else if( post.metadata && post.metadata.linkType ){

        switch (post.metadata.linkType) {

          case 'youtube':
          appendYoutubeCard( post , post.authorObject , lang.postCreated );
          promise.resolve();
          break;

        }

      }else{
        appendNoFileCard( post , post.authorObject , lang.postCreated );
        promise.resolve();
      }

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

    if( !URL_REGEX.test( $(this).attr('href') ) ){
      $(this).attr( 'href', 'http://' + $(this).attr('href') );
    }

  });

  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );


  if (!isMobile()) {
    setRepliesAsync( card , post );
  }else{
    setRepliesAsyncWithoutAppendMobile( card , post );
  }
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
        docPreview.find( '.doc-icon img' ).attr( 'src' , fsnode.icons.big );

        if ( fsnode.mime && fsnode.mime.indexOf( 'office' ) > -1 ) {
          docPreview.find( '.doc-icon' ).addClass( 'office' );
        }
        docPreview.find( '.doc-title' ).text( fsnode.name );
        docPreview.find( '.doc-info' ).text( api.tool.bytesToUnit( fsnode.size ) );
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

      if( !URL_REGEX.test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
    card.find( '.card-user-name' ).text( user.fullName );
    card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );

    if (!isMobile()) {
      setRepliesAsync( card , post );
    }else{
      setRepliesAsyncWithoutAppendMobile( card , post );
    }
    appendCard( card , post );
    callback();

  });

}

var appendDocumentCard = function( post , user , reason , callback ){

  var card = documentCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  api.fs( post.fsnode[ 0 ], function( e , fsNode ){

    if (!e) {

      if( fsNode.mime.indexOf( 'image' ) != -1 ){
        card.find( '.doc-preview img' ).attr( 'src' , 'https://download.inevio.com/' + fsNode.id );
      }else{
        card.find( '.doc-preview img' ).attr( 'src' ,  fsNode.thumbnails.big );
      }

      card.find( '.preview-title' ).text( fsNode.name );
      card.find( '.preview-info' ).text( wz.tool.bytesToUnit( fsNode.size, 1 ) );
      card.find( '.doc-preview' ).data( 'fsnode' , fsNode );
      card.find( '.doc-preview-bar i' ).css( 'background-image' , 'url( '+ fsNode.icons.micro +' )' );

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

      if( !URL_REGEX.test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
    card.find( '.card-user-name' ).text( user.fullName );
    card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );

    if (!isMobile()) {
      setRepliesAsync( card , post );
    }else{
      setRepliesAsyncWithoutAppendMobile( card , post );
    }
    appendCard( card , post );
    callback();

  });

}

var appendYoutubeCard = function( post , user , reason ){

  var card = youtubeCardPrototype.clone();
  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.id ).addClass( 'cardDom' );

  var youtubeCode = post.content.match(/v=([A-z0-9-_]+)/)[1];

  if (isMobile()) {
    card.find( '.video-preview' ).attr( 'src' , 'https://www.youtube.com/embed/' + youtubeCode );
  }else{
    card.find( '.video-preview' ).attr( 'src' , 'https://www.youtube.com/embed/' + youtubeCode + '?autoplay=0&html5=1&rel=0' );
  }

  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
  card.find( '.card-user-name' ).text( user.fullName );
  card.find( '.time-text' ).text( timeElapsed( new Date( post.created ) ) );
  card.find( '.desc' ).html( post.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );
  card.find( '.title' ).text( post.title );
  card.find( '.activate-preview' ).text( lang.preview );

  card.find( '.desc' ).find('a').each( function(){

    if( !URL_REGEX.test( $(this).attr('href') ) ){
      $(this).attr( 'href', 'http://' + $(this).attr('href') );
    }

  });

  if (!isMobile()) {
    setRepliesAsync( card , post );
  }else{
    setRepliesAsyncWithoutAppendMobile( card , post );
  }
  appendCard( card , post );

}

var setRepliesAsyncWithoutAppendMobile = function( card , post ){

  post.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( e , replies ){

    replies = replies.reverse();
    card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    if ( replies.length === 1 ) {
      card.find( '.comments-text' ).text( replies.length + ' ' + lang.comment );
    }else{
      card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    }
    card.find( '.comments-text' ).data( 'num' , replies.length );

  });

}

var setRepliesAsyncOnlyAppendMobile = function( card , post ){

  $( '.mobile-world-comments .commentDom, .mobile-world-comments .replyDom ').remove();
  $( '.mobile-world-comments' ).data( 'card' , card );

  post.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( e , replies ){

    replies = replies.reverse();

    $.each( replies , function( i , reply ){

      appendReply( card , reply , function(){

        reply.getReplies( { from : 0 , to : 1000 , withFullUsers: true }, function( e , responses ){

          responses = responses.reverse();

          $.each( responses , function( i , response ){

            appendReplyComment( card , reply , response );

          });

        });

      });

    });

  });

}

var setRepliesAsync = function( card , post ){

  post.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( e , replies ){

    replies = replies.reverse();
    card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    if ( replies.length === 1 ) {
      card.find( '.comments-text' ).text( replies.length + ' ' + lang.comment );
    }else{
      card.find( '.comments-text' ).text( replies.length + ' ' + lang.comments );
    }
    card.find( '.comments-text' ).data( 'num' , replies.length );

    $.each( replies , function( i , reply ){

      appendReply( card , reply , function(){

        reply.getReplies( { from : 0 , to : 1000 , withFullUsers: true }, function( e , responses ){

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
  if (isMobile()) {
    comment.find( '.replay-button' ).text( '-   ' + lang.reply );
  }else{
    comment.find( '.replay-button' ).text( lang.reply );
  }
  comment.find( '.edit-button' ).text( lang.edit );

  if ( reply.author === myContactID ) {
    comment.addClass('mine');
  }

  //parche hasta #1356 fix
  if (! reply.authorObject ) {
    var userReady = $.Deferred();
    wz.user( reply.author , function( e , user ){
      userReady.resolve( user );
    });
  }

  if (userReady) {

    $.when( userReady ).done(function( user ){

      comment.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
      comment.find( '.name' ).text( user.fullName );
      comment.find( '.time' ).text( timeElapsed( new Date( reply.created ) ) );
      comment.find( '.comment-text' ).html( reply.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

      comment.find( '.comment-text' ).find('a').each( function(){

        if( !URL_REGEX.test( $(this).attr('href') ) ){
          $(this).attr( 'href', 'http://' + $(this).attr('href') );
        }

      });

      var container;
      if (isMobile()) {
        container = mobileWorldComments;
      }else{
        container = card;
      }

      container.find( '.comments-list' ).append( comment );
      container.find( '.comments-list' ).scrollTop( comment[0].offsetTop );

      comment.data( 'reply' , reply );
      comment.data( 'name' , user.name.split( ' ' )[0] );

      callback();

    })

  }else{

    comment.find( '.avatar' ).css( 'background-image' , 'url(' + reply.authorObject.avatar.tiny + ')' );
    comment.find( '.name' ).text( reply.authorObject.fullName );
    comment.find( '.time' ).text( timeElapsed( new Date( reply.created ) ) );
    comment.find( '.comment-text' ).html( reply.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    comment.find( '.comment-text' ).find('a').each( function(){

      if( !URL_REGEX.test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    var container;
    if (isMobile()) {
      container = mobileWorldComments;
    }else{
      container = card;
    }

    container.find( '.comments-list' ).append( comment );
    container.find( '.comments-list' ).scrollTop( comment[0].offsetTop );

    comment.data( 'reply' , reply );
    comment.data( 'name' , reply.authorObject.name.split( ' ' )[0] );

    callback();

  }

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

  var multipost = card.find( '.doc-preview:not(.wz-prototype)' ).length > 1 ? true : false;
  var reason = lang.postCreated;
  if ( post.metadata ) {

    switch ( post.metadata.operation ) {
      case 'enqueue':
      reason = multipost ? lang.filesAdded : lang.fileAdded;
      break;
      case 'modified':
      reason = multipost ? lang.filesModified : lang.fileModified ;
      break;
      case 'copy':
      reason = multipost ? lang.filesAdded : lang.fileAdded;
      break;
      case 'moveIn':
      reason = multipost ? lang.filesAdded : lang.fileAdded;
      break;
      case 'moveOut':
      reason = multipost ? lang.filesRemoved : lang.fileRemoved;
      break;
      case 'remove':
      reason = multipost ? lang.filesRemoved : lang.fileRemoved;
      break;

    }

  }

  card.find( '.shared-text' ).text( reason );

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

      message = lang.lastDay + ' ' + lang.at + ' ' + getStringHour( lastTime );
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

    message = day + '/' + month + '/' + last.getFullYear().toString().substring( 2 , 4 ) + ' ' + lang.at + ' ' + getStringHour( lastTime );
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

  if (isMobile()) {

    worldSelected.removePost( post.id , function( e , o ){
      if (e) {
        navigator.notification.alert( '', function(){},lang.notAllowedDeletePost );
      }
    });

  }else{

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
}

var unFollowWorld = function( world ){

  world.removeUser( myContactID , function( e , o ){
    if (e) {
      console.log(e);
    }else{
      wql.deleteLastRead( [ world.id , myContactID ] , function( e ){
        if (e) {
          console.log(e);
        }
      });
    }
  });

}

var addReplayAsync = function( card ){

  var post;
  var msg;
  var input;
  if (isMobile()) {
    post  = mobileWorldComments.data('post');
    msg   = mobileWorldComments.find( '.comments-footer .comment-input' ).val();
    input = mobileWorldComments.find( '.comments-footer .comment-input' );
  }else{
    post  = card.data( 'post' );
    msg   = card.find( '.comments-footer .comment-input' ).val();
    input = card.find( '.comments-footer .comment-input' );
  }

  if ( input.attr( 'placeholder' )[0] === '@' ) {
    post = input.data( 'reply' );
    $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment );
  }

  post.reply( { content: msg }, function( e, o ){
    input.val('');
    input.css('height','20px');
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

  wz.app.openApp( 14 , [ 'new-world-chat' , world , function( o ){

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

var appendReplyComment = function( card , reply , response ){

  var comment;
  if (isMobile()) {
    comment = mobileWorldComments.find( '.comment-' + reply.id );
  }else{
    comment = card.find( '.comment-' + reply.id );
  }

  comment.find( '.replay-list' ).show();
  var reply = comment.find( '.replay.wz-prototype' ).clone();
  reply.removeClass( 'wz-prototype' ).addClass( 'replyDom reply-' + response.id );

  if ( response.author === myContactID ) {
    reply.addClass('mine');
  }

  //parche hasta #1356 fix
  if (! response.authorObject ) {
    var userReady = $.Deferred();
    wz.user( response.author , function( e , user ){
      userReady.resolve( user );
    });
  }

  if (userReady) {

    $.when( userReady ).done(function( user ){

      reply.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.tiny + ')' );
      reply.find( '.name' ).text( user.fullName );
      reply.find( '.time' ).text( timeElapsed( new Date( response.created ) ) );
      reply.find( '.replay-text' ).html( response.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

      reply.find( '.replay-text' ).find('a').each( function(){

        if( !URL_REGEX.test( $(this).attr('href') ) ){
          $(this).attr( 'href', 'http://' + $(this).attr('href') );
        }

      });

      comment.find( '.replay-list' ).append( reply );
      if (!isMobile()) {
        card.find( '.comments-list' ).scrollTop( reply[0].offsetTop );
      }

      reply.data( 'reply' , response );


    });

  }else{

    reply.find( '.avatar' ).css( 'background-image' , 'url(' + response.authorObject.avatar.tiny + ')' );
    reply.find( '.name' ).text( response.authorObject.fullName );
    reply.find( '.time' ).text( timeElapsed( new Date( response.created ) ) );
    reply.find( '.replay-text' ).html( response.content.replace(/\n/g, "<br />").replace( /((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/ig, '<a href="$1" target="_blank">$1</a>' ) );

    reply.find( '.replay-text' ).find('a').each( function(){

      if( !URL_REGEX.test( $(this).attr('href') ) ){
        $(this).attr( 'href', 'http://' + $(this).attr('href') );
      }

    });

    comment.find( '.replay-list' ).append( reply );
    if (!isMobile()) {
      card.find( '.comments-list' ).scrollTop( reply[0].offsetTop );
    }

    reply.data( 'reply' , response );

  }

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

var isMobile = function(){
  return app.hasClass( 'wz-mobile-view' );
}

var attachFromInevio = function( card ){

  if ( isMobile() ) {

    wz.app.openApp( 1 , [ 'select-source' , function( o ){

      $( '.attach-select' ).removeClass( 'popup' );

      o.forEach(function( fsnode ){

        appendAttachment( { fsnode: fsnode , uploading: false , card: card } );

      });

    }] , 'selectSource');

  }else{
    api.fs.selectSource( { 'title' : lang.selectFile , 'mode' : 'file' , 'multiple': true } , function( e , s ){

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
  $( '.with-notification' ).removeClass( 'with-notification' );

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , worlds ){

    worlds.forEach(function( world ){

      world.getPosts( {from: 0 , to: 1 } , function( e , lastPost ){

        if( lastPost.length === 0){
          wz.app.setBadge( parseInt(nNotifications) );
          return;
        }

        wql.selectLastRead( [ world.id , myContactID ] , function( e , lastPostReaded ){

          var lastPostReadedTime = lastPostReaded[0] && lastPostReaded[0].time ? new Date( lastPostReaded[0].time ) : false;
          var lastPostTime = new Date( lastPost[0].created );
          if ( ( lastPostReaded.length === 0 || lastPost[0].id != lastPostReaded[0].post ) && ( !lastPostReadedTime || lastPostReadedTime < lastPostTime ) ) {

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

          case 'document':
          case 'image':
          appendDocumentCard( post , user , lang.postCreated , function(){});
          break;

          /*case 'generic':
          case 'video':
          case 'music':*/
          default:
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

var changeMobileView = function( view ){

  switch (view) {

    case 'worldContent':

      switch (mobileView) {

        case 'worldSidebar':

          mobileWorldContent.removeClass('hide');
          mobileWorldContent.stop().clearQueue().transition({
            'transform' : 'translateX(0%)'
          }, 300, function(){
            mobileWorldSidebar.addClass('hide');
          });
          break;

        case 'worldComments':

          mobileWorldContent.removeClass('hide');
          mobileWorldComments.stop().clearQueue().transition({
            'transform' : 'translateY(100%)'
          }, 300, function(){
            mobileWorldComments.addClass('hide');
          });
          break;

        case 'newPost':

          mobileWorldContent.removeClass('hide');
          mobileNewPost.stop().clearQueue().transition({
            'transform' : 'translateY(-100%)'
          }, 300, function(){
            mobileNewPost.addClass('hide');
          });
          break;

      }
      mobileView = 'worldContent'
      break;

    case 'worldSidebar':

      switch (mobileView) {

        case 'worldContent':

          mobileWorldSidebar.removeClass('hide');
          mobileWorldContent.stop().clearQueue().transition({
            'transform' : 'translateX(100%)'
          }, 300, function(){
            mobileWorldContent.addClass('hide');
          });
          break;

        case 'explore':

          mobileWorldSidebar.removeClass('hide');
          mobileExplore.stop().clearQueue().transition({
            'transform' : 'translateY(100%)'
          }, 300, function(){
            mobileExplore.addClass('hide');
          });
          break;

      }
      StatusBar.backgroundColorByHexString("#272c34");
      $('.world.active').removeClass('active');
      mobileView = 'worldSidebar'
      break;

    case 'worldComments':

      mobileWorldComments.removeClass('hide');
      mobileWorldComments.stop().clearQueue().transition({
        'transform' : 'translateY(0%)'
      }, 300, function(){
        mobileWorldContent.addClass('hide');
        mobileView = 'worldComments'
      });
      break;

    case 'newWorld':

      mobileNewWorld.removeClass('hide');
      mobileNewWorld.stop().clearQueue().transition({
        'transform' : 'translateY(0%)'
      }, 300);
      break;

    case 'explore':

      mobileExplore.removeClass('hide');
      StatusBar.backgroundColorByHexString("#0f141c");
      mobileExplore.stop().clearQueue().transition({
        'transform' : 'translateY(0%)'
      }, 300, function(){
        mobileWorldSidebar.addClass('hide');
        mobileView = 'explore'
      });
      break;

    case 'newPost':

      mobileNewPost.removeClass('hide');
      mobileNewPost.stop().clearQueue().transition({
        'transform' : 'translateY(0%)'
      }, 300, function(){
        mobileWorldContent.addClass('hide');
        mobileView = 'newPost'
      });
      break;

  }

}

var setMobile = function(){
  StatusBar.backgroundColorByHexString("#272c34");
  $('input, textarea').on('focus', function(){
    Keyboard.shrinkView(true);
  })
  .on('blur', function(){
    Keyboard.shrinkView(false);
  });
  $('.app-title').text(lang.yourWorlds);
  $('.cancel-search').text(lang.cancel);
  $('.search-bar input').attr( 'placeholder' , lang.search );
}

var newPostMobile = function(){
  changeMobileView('newPost');
  $( '.mobile-new-post .new-card-title' ).html( '<i class="wz-dragger">' + lang.newPost + '</i>' + lang.for + '<figure class="wz-dragger ellipsis">' + worldSelected.name + '</figure>' );
  $( '.mobile-new-post .post-new-card span' ).text( lang.publishPost );
  $( '.mobile-new-post .new-card-input' ).attr( 'placeholder', lang.title );
  $( '.mobile-new-post .new-card-textarea' ).attr( 'placeholder', lang.description );
  $( '.mobile-new-post .new-card-input' ).val('');
  $( '.mobile-new-post .new-card-textarea' ).val('');
}

initCosmos();
