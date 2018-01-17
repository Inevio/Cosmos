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
    		model.openWorld( $(this).attr( 'data-id' ) )
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

        var card = $(this).parent().parent();
        var height = parseInt(card.find('.comments-list').css('height')) + 50;
        var commentsSection = card.find( '.comments-section' );

        /*if (isMobile()) {
          return;
        }*/

        if (commentsSection.hasClass('opened')) {

          commentsSection.css('height', height);
          card.removeClass( 'comments-open' );
          commentsSection.transition({

            'height'         : 0

          }, 200, function(){

            commentsSection.removeClass('opened');

          });

        }else{

          card.addClass( 'comments-open' );
          commentsSection.find( '.comments-list' ).scrollTop(9999999);
          commentsSection.transition({

            'height'         : height

          }, 200, function(){

            commentsSection.addClass('opened');
            commentsSection.css('height', 'auto');
            commentsSection.find( 'textarea' ).focus();

          });


        }

      })

    }

	}

	return new Controller( model, view )

})( model, view )