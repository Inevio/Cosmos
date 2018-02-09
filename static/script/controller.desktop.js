var controller = ( function( model, view ){

  class Controller{

    constructor( model, view ){

      this.dom = win
      /*this._domContactsList = $( '.contact-list', this.dom)
      this._domConversationsList = $( '.channel-list', this.dom)
      this._domMessageContainer = $( '.message-container', this.dom)
      this._domMessageMePrototype = $( '.message-me.wz-prototype', this._domMessageContainer)
      this._domMessageOtherPrototype = $( '.message-other.wz-prototype', this._domMessageContainer)
      this._domCurrentConversation*/

      this._domWorldCategory = $( '.category .opener, .category .category-name', this.dom )

      this.model = model
      this.view = view
      this._bindEvents()

    }

    _bindEvents(){

    	this._domWorldCategory.on( 'click', function(){

    		var category = $(this).parent()
			  category.toggleClass( 'closed' )

			  if ( category.hasClass( 'closed' ) ) {

			    category.find( '.world-list' ).css( 'height' , category.find( '.world-list' ).css( 'height' ) )
			    category.find( '.world-list' ).transition({
			      'height'         : '0px'
			    }, 200)

			  }else{

			    var height = category.find( '.world' ).length * $( '.world.wz-prototype' ).outerHeight()
			    category.find( '.world-list' ).transition({
			      'height'         : height
			    }, 200, function(){
			    	$(this).css( 'height' , 'initial' )
			    })

			  }

    	})

      this.dom.on( 'click', function( event ){

        if( !$( event.target ).hasClass( 'popup' ) && ! $( event.target ).hasClass( 'popup-launcher' ) ){

          $( '.popup' ).removeClass( 'popup' )
          $( this ).parent().find( '.comments-footer .attach-select' ).hide()

        }

      })

    	this.dom.on( 'click' , '.category-list .world' , function(){
    		model.openWorld( parseInt( $(this).attr( 'data-id' ) ), false )
    	})

      this.dom.on( 'click', '.open-folder-button' ,function(){
        model.openFolder()
      })

      this.dom.on( 'click', '.cardDom:not(.loading) .doc-preview' ,function(){

        var attachment = $( this )
        var fsnode =  $( this ).data( 'fsnode' )
        var fsnodeList = []
        $.each( attachment.closest( '.card' ).find( '.doc-preview:not(.wz-prototype)' ) , function( i , attachment ){
          fsnodeList.push( $( attachment ).data( 'fsnode' ) )
        })

        fsnode.open( fsnodeList.filter(function( item ){ return item.type === fsnode.type }).map( function( item ){ return item.id }), function( error ){

          if( error ){
            fsnode.openLocal()
          }

        })

      })

      this.dom.on( 'click' , '.comments-opener' , function(){

        var card = $(this).parent().parent()
        view.toggleReplies( card )

      })

      this.dom.on( 'click' , '.world-members-button', function(){
        model.openMembers()
      })

      /* World explore */

      this.dom.on( 'click' , '.explore-button', function(){
        model.openExploreWorlds()
      })

      this.dom.on( 'click' , '.close-explore', function(){
        view.closeExploreWorlds()
      })

      /* enf od world explore */

      this.dom.on( 'click' , '.world-card.unfollowed .follow-button' , function(){
        model.followWorld( $( this ).parent().data( 'world' ) )
      })

      this.dom.on( 'click' , '.new-post-button, .no-post-new-post-button', function(){
        model.openNewPost()
      })

      this.dom.on( 'click' , '.new-world-button, .new-world-button-mini', function(){
        view.openNewWorld()
      })

      this.dom.on( 'click' , '.close-new-world', function(){
        view.closeNewWorld()
      })

      this.dom.on( 'click' , '.create-world-button.step-a', function(){

        if ( $( '.new-world-name input' ).val() ) {
          model.createWorld( $( '.new-world-name input' ).val() )
        }

      })

      this.dom.on( 'click', '.create-world-button.step-b', function(){

        var worldApi = $( '.new-world-container' ).data( 'world' )
        var isPrivate

        if( api.system.user().user.indexOf( 'demo' ) === 0 ){
          isPrivate = true
        }else{
          isPrivate = $( '.private-option' ).hasClass( 'active' )
        }

        var editing = $( '.new-world-container' ).hasClass( 'editing' )
        var name = worldApi.name
        $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , worldApi.id )

        if ( editing ) {
          name = $( '.new-world-name input' ).val()
        }
        var description = $( '.new-world-desc textarea' ).val()

        model.editWorld( worldApi, isPrivate, name, description )
        view.newWorldAnimationOut()

      })

      this.dom.on( 'click', '.delete-world-button', function(){

        var dialog = api.dialog()

        dialog.setTitle( lang.unfollowWorld )
        dialog.setText( lang.confirmExit )

        dialog.setButton( 0, wzLang.core.dialogCancel, 'black' )
        dialog.setButton( 1, wzLang.core.dialogAccept, 'red' )

        dialog.render( function( ok ){

          if( !ok ){
            return
          }

          model.removeWorldBack()
          $( '.new-world-container' ).removeClass( 'editing' )
          //view.newWorldAnimationOut()

          /*if (isMobile()) {
            changeMobileView( 'worldSidebar' )
            mobileNewWorld.stop().clearQueue().transition({
              'transform' : 'translateY(-100%)'
            }, 300, function(){
              mobileNewWorld.addClass( 'hide' )
            })
          }*/

        })

      })

      this.dom.on( 'click' , '.close-kick-user', function(){
        view.closeMembers()
      })

      this.dom.on( 'click' , '.kick-out-button', function(){
        model.removeUserBack( $(this).parent().data( 'user' ).id )
      })

      this.dom.on( 'click' , '.invite-user-button' , function(){
        model.openInviteMembers()
      })

      this.dom.on( 'click' , '.cancel-invite-user, .close-invite-user', function(){
        view.closeInviteMembers()
      })

      this.dom.on( 'click' , '.invite-user-container .invite-user', function(){

        var users = $( '.friend .ui-checkbox.active' ).parent()
        model.inviteUsers( $.makeArray( users ) )

      })

      this.dom.on( 'click', '.world-card-dom.followed', function(){

        $( '.close-explore' ).click()
        model.openWorld( $( this ).data( 'world' ).id )

      })

      this.dom.on( 'click', '.open-chat-button', function(){
        model.openWorldChat()
      })

      this.dom.on( 'click', '.privacy-options .option', function(){

        $( '.privacy-options .option' ).removeClass( 'active' )
        $( this ).addClass( 'active' )

      })

      this.dom.on( 'click', '.comments-footer .send-button', function(){

        var post = $( this ).parent().parent().parent().data( 'post' )
        var input = $( this ).parent().parent().parent().find( '.comments-footer .comment-input' )
        var message = $( this ).parent().parent().parent().find( '.comments-footer .comment-input' ).val()

        if( input.attr( 'placeholder' )[0] === '@' ){

          post = input.data( 'reply' )
          $( '.comments-footer .comment-input' ).attr( 'placeholder' , lang.writeComment )

        }

        model.addReplyBack( post , message )

      })

      this.dom.on( 'click', '.card-options', function(){

        var post = $( this ).closest( '.card' ).data( 'post' )

        $( this ).parent().find( '.card-options-section' ).addClass( 'popup' )
        $( this ).parent().find( '.card-options-section *' ).addClass( 'popup' )

      })

      this.dom.on( 'click' , '.delete-comment.parent' , function(){

        var post = $( this ).closest( '.comment' ).data( 'reply' )
        var confirmText = lang.comfirmDeletePost
        if ( post.isReply ) {
          confirmText = lang.comfirmDeleteComment
        }

        /*if (isMobile()) {

          worldSelected.removePost( post.id , function( err, o ){
            if (err) {
              navigator.notification.alert( '', function(){},lang.notAllowedDeletePost )
            }
          })

        }else{*/

          confirm( confirmText , function( ok ){

            if( ok ){

              model.removePostBack( post )
              /*worldSelected.removePost( post.id , function( err, o ){

                if( error ){
                  alert( lang.notAllowedDeletePost )
                }

              })*/

            }

          })

        //}

      })

      this.dom.on( 'click' , '.delete-comment.child' , function(){

        var post = $( this ).closest( '.replyDom' ).data( 'reply' )
        var confirmText = lang.comfirmDeletePost
        if ( post.isReply ) {
          confirmText = lang.comfirmDeleteComment
        }

        /*if (isMobile()) {

          worldSelected.removePost( post.id , function( err, o ){
            if (err) {
              navigator.notification.alert( '', function(){},lang.notAllowedDeletePost )
            }
          })

        }else{*/

          confirm( confirmText , function( ok ){

            if( ok ){

              model.removePostBack( post )
              /*worldSelected.removePost( post.id , function( err, o ){

                if( error ){
                  alert( lang.notAllowedDeletePost )
                }

              })*/

            }
            
          })

        //}

      })

      .on( 'click' , '.card-options-section .delete' , function(){

        var post = $(this).closest( '.card' ).data( 'post' )
        var confirmText = lang.comfirmDeletePost
        if ( post.isReply ) {
          confirmText = lang.comfirmDeleteComment
        }

        /*if (isMobile()) {

          worldSelected.removePost( post.id , function( err, o ){
            if (err) {
              navigator.notification.alert( '', function(){},lang.notAllowedDeletePost )
            }
          })

        }else{*/

          confirm( confirmText , function( ok ){

            if( ok ){

              model.removePostBack( post )
              /*worldSelected.removePost( post.id , function( err, o ){

                if( error ){
                  alert( lang.notAllowedDeletePost )
                }

              })*/

            }
            
          })

        //}

      })

      this.dom.on( 'click', '.invite-by-mail', function(){
        model.openInviteByMail()
      })

      this.dom.on( 'click' , '.reply-button' , function(){

        var comment = $( this ).parent()
        var post = comment.data( 'reply' )
        var name = comment.data( 'name' )
        var input = comment.parent().parent().find( '.comments-footer .comment-input' )

        view.prepareReplyComment( post, name, input )

      })

      this.dom.on( 'click', '.notifications', function(){
        view.openNotificationPopup()
      })

      this.dom.on( 'click', '.notification', function(){

        console.log( $(this).data( 'notification' ) )
        model.notificationOpen( $(this).data( 'notification' ) )

      })

      this.dom.on( 'click', '.notification .notification-blue-dot', function( event ){

        model.notificationAttendedBack( $(this).parents('.notification').data( 'notification' ).id )
        event.stopPropagation()
        /*console.log( $(this).data( 'notification-data' ) )
        model.notificationOpen( $(this).data( 'notification-data' ) )*/

      })

      this.dom.on( 'click', '.go-back-button', function(){
        model.openWorld()
      })

      this.dom.on( 'click', '.card-options-section .edit', function(){

        $( this ).closest( '.card' ).addClass( 'editing' )
        $( this ).closest( '.card' ).find( '.popup' ).removeClass( 'popup' )
        //editPostAsync( $( this ).closest( '.card' ) )

      })

      this.dom.on( 'click' , '.cancel-new-card' , function(){

        $( this ).closest( '.card' ).removeClass( 'editing' )
        $( this ).closest( '.card' ).find( '.card-options' ).removeClass( 'hide' )

      })

      this.dom.on( 'click', '.notifications-header .mark-as-attended', function(){
        model.notificationMarkAllAsAttended()
      })

      /* Keypress */

      this.dom.on( 'keypress' , '.comments-footer .comment-input' , function( e ){

        if( e.keyCode == 13 ){

          if ( !e.shiftKey ) {

            var post = $( this ).parent().parent().parent().data( 'post' )
            var message = $( this ).parent().parent().parent().find( '.comments-footer .comment-input' ).val()

            model.addReplyBack( post, message )

          }

        }

      })

      /* Context menu */

      this.dom.on( 'contextmenu', '.doc-preview', function(){
        view.fileContextMenu( $( this ).data( 'fsnode' ) )
      })

      this.dom.on( 'contextmenu' , '.worldDom' , function(){
        view.worldContextMenu( $(this), $(this).data( 'world' ) )
      })

      /* end of context menu */

      // Input events

      this.dom.on( 'input' , '.world-header .search-post' , function( e ){

        //if (e.keyCode == 13) {
          model.searchLocalPost( $( this ).find( 'input' ).val() )
        //}

      })

      this.dom.on( 'input', '.kick-user-container .ui-input-search input', function(){
        view.filterElements( $(this).val(), '.member' )
      })

      this.dom.on( 'input', '.invite-user-container .ui-input-search input', function(){
        view.filterElements( $(this).val(), '.friend' )
      })

      this.dom.on( 'input', '.explore-container .search-bar input', function(){
        view.filterElements( $(this).val(), '.world-card-dom' )
      })

      this.dom.on( 'input', '.explore-top-bar .search-bar input', function(){
        view.filterElements( $(this).val(), '.world-card-dom' )
      })

      // End of input events

      /*this.dom.on( 'click' , '.world-header .search-post .delete-content' , function( e ){
        model.searchLocalPost( null )
      })*/

      $( '.world-selected' ).on( 'scroll' , function(){

        if ( $(this).scrollTop() > 60 ) {
          $( '.world-header-min' ).addClass( 'active' )
        }else{
          $( '.world-header-min' ).removeClass( 'active' )
        }

        var scrollDiv = $( this )
        var scrollFinish = $( '.world-selected' )[0].scrollHeight - scrollDiv.height()

        if ( scrollFinish - scrollDiv.scrollTop() < 300 ) {

          //var lastCard = scrollDiv.data( 'lastCard' )
          //getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){})
          //loadingPost = true
          model.loadMorePosts()

        }

      })

      $( '.explore-container' ).on( 'scroll' , function(){

        if ( $(this).scrollTop() > 200 ) {
          view.showExploreTopBar()
        }else{
          view.hideExploreTopBar()
        }

        var scrollDiv = $( this )
        var scrollFinish = $( '.explore-container' )[0].scrollHeight - scrollDiv.height()

        if( scrollFinish - scrollDiv.scrollTop() < 200 ){

          //var lastCard = scrollDiv.data( 'lastCard' )
          //getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){})
          //loadingPost = true
          model.appendPublicWorldsAsync()
          //console.log( 'scrolled' )

        }

      })

      // COSMOS EVENTS

      api.cosmos.on( 'worldCreated' , function( world ){

        model.addWorld( world, true )
        $( '.new-world-container' ).data( 'world' , world )
        /*$( '.new-world-name input' ).val( '' )
        $( '.new-world-container' ).data( 'world' , world )
        $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id )

        myWorlds.push( world.id )

        if ( world.owner === myContactID ) {
          selectWorld( $( '.world-' + world.id ) , function(){})
        }*/

      })

      api.cosmos.on( 'userAdded', function( userId, world ){
        model.addUserFront( userId, world )
      })

      api.cosmos.on( 'userRemoved', function( userId, world ){
        model.removeUserFront( userId, world )
      })

      api.cosmos.on( 'postAdded', function( post ){
        model.addPost( post )
      })

      api.cosmos.on( 'postRemoved', function( postId , world ){
        model.removePostFront( postId, world )
      })

      api.cosmos.on( 'postModified', function( post ){
        console.log( post )
      })

      // END OF COSMOS EVENTS

      // NOTIFICATION EVENTS

      api.notification.on( 'new', function( notification ){
        model.notificationNew( notification )
      })

      api.notification.on( 'attended', function( list ){
        model.notificationAttendedFront( list )
      })

      //

    }

	}

	return new Controller( model, view )

})( model, view )