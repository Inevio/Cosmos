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
        view.openMembers()
      })

      /* World explore */

      this.dom.on( 'click' , '.explore-button', function(){
        view.openExploreWorlds()
      })

      this.dom.on( 'click' , '.close-explore', function(){
        view.closeExploreWorlds()
      })

      /* enf od world explore */

      /* Context menu */

      this.dom.on( 'contextmenu', '.doc-preview', function(){
        view.fileContextMenu( $( this ).data( 'fsnode' ) )
      })

      this.dom.on( 'contextmenu' , '.worldDom' , function(){
        view.worldContextMenu( $(this), $(this).data( 'world' ) )
      })

      /* end of context menu */

      //Search posts
      this.dom.on( 'input' , '.world-header .search-post' , function( e ){

        //if (e.keyCode == 13) {
          model.searchPost( $( this ).find( 'input' ).val() )
        //}

      })

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

      });

    }

	}

	return new Controller( model, view )

})( model, view )