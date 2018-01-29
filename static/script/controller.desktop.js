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

    		var category = $(this).parent();
			  category.toggleClass( 'closed' );

			  if ( category.hasClass( 'closed' ) ) {

			    category.find( '.world-list' ).css( 'height' , category.find( '.world-list' ).css( 'height' ) );
			    category.find( '.world-list' ).transition({
			      'height'         : '0px'
			    }, 200);

			  }else{

			    var height = category.find( '.world' ).length * $( '.world.wz-prototype' ).outerHeight();
			    category.find( '.world-list' ).transition({
			      'height'         : height
			    }, 200, function(){
			    	$(this).css( 'height' , 'initial' )
			    });

			  }

    	})

    	this.dom.on( 'click' , '.category-list .world' , function(){
    		model.openWorld( parseInt( $(this).attr( 'data-id' ) ) )
    	})

      $( '.world-selected' ).on( 'scroll' , function(){

        if ( $(this).scrollTop() > 60 ) {
          $( '.world-header-min' ).addClass( 'active' )
        }else{
          $( '.world-header-min' ).removeClass( 'active' )
        }
        
      })

      this.dom.on( 'click', '.open-folder-button' ,function(){
        model.openFolder()
      })

      this.dom.on( 'click', '.cardDom:not(.loading) .doc-preview' ,function(){

        var attachment = $( this );
        var fsnode =  $( this ).data( 'fsnode' );
        var fsnodeList = [];
        $.each( attachment.closest( '.card' ).find( '.doc-preview:not(.wz-prototype)' ) , function( i , attachment ){
          fsnodeList.push( $( attachment ).data( 'fsnode' ) );
        });

        fsnode.open( fsnodeList.filter(function( item ){ return item.type === fsnode.type; }).map( function( item ){ return item.id; }), function( error ){

          if( error ){
            fsnode.openLocal();
          }

        });

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
        model.followWorld( $( this ).parent().data( 'world' ) );
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
          view.newWorldStep()
        }

      })

      this.dom.on( 'click' , '.close-kick-user', function(){
        view.closeMembers()
      })

      this.dom.on( 'click' , '.kick-out-button', function(){
        model.removeUserBack( $(this).parent().data('user').id )
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
          model.searchPost( $( this ).find( 'input' ).val() )
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

      // End of input events

      /*this.dom.on( 'click' , '.world-header .search-post .delete-content' , function( e ){
        model.searchPost( null )
      })*/

      $( '.world-selected' ).on( 'scroll' , function(){

        var scrollDiv = $( this );
        var scrollFinish = $( '.world-selected' )[0].scrollHeight - scrollDiv.height();

        if ( scrollFinish - scrollDiv.scrollTop() < 300 ) {

          //var lastCard = scrollDiv.data( 'lastCard' );
          //getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){});
          //loadingPost = true;
          model.loadMorePosts()

        }

      })

      $( '.explore-container' ).on( 'scroll' , function(){

        if ( $(this).scrollTop() > 200 ) {
          view.showExploreTopBar()
        }else{
          view.hideExploreTopBar()
        }

        var scrollDiv = $( this );
        var scrollFinish = $( '.explore-container' )[0].scrollHeight - scrollDiv.height();

        if( scrollFinish - scrollDiv.scrollTop() < 200 ){

          //var lastCard = scrollDiv.data( 'lastCard' );
          //getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){});
          //loadingPost = true;
          model.appendPublicWorldsAsync()
          //console.log('scrolled')

        }

      })

      // COSMOS EVENTS

      api.cosmos.on( 'worldCreated' , function( world ){

        model.addWorld( world )
        /*$( '.new-world-name input' ).val('');
        $( '.new-world-container' ).data( 'world' , world );
        $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id );

        myWorlds.push( world.id );

        if ( world.owner === myContactID ) {
          selectWorld( $( '.world-' + world.id ) , function(){});
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

      })

      // END OF COSMOS EVENTS

    }

	}

	return new Controller( model, view )

})( model, view )