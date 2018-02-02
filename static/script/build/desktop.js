var win = $(this)
// Static values
const MAINAREA_NULL = 0
const MAINAREA_CONVERSATION = 1
const MAINAREA_GROUPMODE = 2
const SIDEBAR_NULL = 0
const SIDEBAR_CONVERSATIONS = 1
const SIDEBAR_CONTACTS = 2
const GROUP_NULL = 0
const GROUP_CREATE = 1
const GROUP_EDIT = 2

const async = {

  each : function( list, step, callback ){

    var position = 0
    var closed   = false
    var checkEnd = function( error ){

      if( closed ){
        return
      }

      position++

      if( position === list.length || error ){

        closed = true

        callback( error )

        // Nullify
        list = step = callback = position = checkEnd = null

      }

    }

    if( !list.length ){
      return callback()
    }

    list.forEach( function( item ){
      step( item, checkEnd )
    })

  },

  map : function( list, step, callback ){

    var position = 0
    var closed   = false
    var result   = []
    var checkEnd = function( index, error, data ){

      if( closed ){
        return
      }

      position++

      result[ index ] = data

      if( position === list.length || error ){

        closed = true

        callback( error, result )

        // Nullify
        result = list = step = callback = position = checkEnd = null

      }

    }

    if( !list.length ){
      return callback()
    }

    list.forEach( function( item, index ){
      step( item, checkEnd.bind( null, index ) )
    })

  },

  parallel : function( fns, callback ){

    var list     = Object.keys( fns )
    var position = 0
    var closed   = false
    var res      = {}
    var checkEnd = function( i, error, value ){

      if( closed ){
        return
      }

      res[ i ] = value
      position++

      if( position === list.length || error ){

        closed = true

        callback( error, res )

        // Nullify
        list = callback = position = checkEnd = null

      }

    }

    if( !list.length ){
      return callback()
    }

    list.forEach( function( fn ){
      fns[ fn ]( checkEnd.bind( null, fn ) )
    })

  }

}

var view = ( function(){

	const colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]
	const URL_REGEX = /^http(s)?:\/\//i

	class View{

		constructor(){

			this.dom = win

			this.isMobile = this.dom.hasClass( 'wz-mobile-view' )

			this.myContactID 							= api.system.user().id
			this._domWorldsPrivateList 		= $( '.private-list' )
			this._domWorldsPublicList 		= $( '.public-list' )
			this._domPostContainer 				= $( '.cards-list' )
			this._worldPrototype      		= $( '.sidebar .world.wz-prototype' )
			this._noPosts									= $( '.cards-list .no-posts' )

			this._genericCardPrototype 		= $( '.gen-card.wz-prototype' )
			this._documentCardPrototype 	= $( '.doc-card.wz-prototype' )
			this._youtubeCardPrototype  	= $( '.you-card.wz-prototype' )

			this.animationEffect 					= 'cubic-bezier(.4,0,.2,1)'

			this.noWorlds  								= $( '.no-worlds' )

			this._translateInterface()

		}

		_getYoutubeCode( text ){

		  var youtubeId = false
		  text.split(' ').forEach( function( word ){

		    if ( word.startsWith( 'www.youtu' ) || word.startsWith( 'youtu' ) || word.startsWith( 'https://www.youtu' ) || word.startsWith( 'https://youtu' ) || word.startsWith( 'http://www.youtu' ) || word.startsWith( 'http://youtu' )) {

		      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		      var match = word.match(regExp)
		      youtubeId = (match&&match[7].length==11)? match[7] : false

		    }

		  });

		  return youtubeId

		}

		_translateInterface(){

			//Start
		  $( '.no-worlds .title' ).text( lang.welcome )
		  $( '.no-worlds .subtitle' ).text( lang.intro )
		  $( '.no-worlds .subtitle2' ).text( lang.intro2 )
		  $( '.no-worlds .chat-feature .description' ).html( lang.feature1 )
		  $( '.no-worlds .files-feature .description' ).html( lang.feature2 )
		  $( '.no-worlds .posts-feature .description' ).html( lang.feature3 )
		  $( '.start-button-no-worlds span' ).text( lang.start )
		  $( '.new-world-button-no-worlds span, .new-world-button span' ).text( lang.createWorld )

		  $( '.no-worlds-mobile .title' ).text( lang.welcome )
		  if ( this.dom.width() < 360 ){
		    $( '.no-worlds-mobile .subtitle' ).html( lang.intro )
		  }else{
		    $( '.no-worlds-mobile .subtitle' ).html( lang.introMobile  )
		  }
		  $( '.no-worlds-mobile .subtitle2' ).text( lang.intro2 )
		  $( '.no-worlds-mobile .chat-feature .description' ).html( lang.feature1 )
		  $( '.no-worlds-mobile .files-feature .description' ).html( lang.feature2 )
		  $( '.no-worlds-mobile .posts-feature .description' ).html( lang.feature3 )

		  //Sidebar
		  $( '.notifications-title span' ).text( lang.activity )

		  //World selected
		  $( '.select-world span' ).text( lang.selectWorld )

		  //World header
		  $( '.invite-user-button' ).text( lang.worldHeader.invite )
		  $( '.open-chat-button span' ).text( lang.worldHeader.chatButton )
		  $( '.open-folder-button span' ).text( lang.worldHeader.folderButton )
		  $( '.search-post input' ).attr( 'placeholder', lang.worldHeader.searchPost )

		  if( this.isMobile ){
		    $( '.stop-follow span' ).text( lang.exit )
		  }else{
		    $( '.stop-follow span' ).text( lang.unfollowWorld )
		  }

		  //Posts
		  $( '.new-post-button .my-avatar' ).css( 'background-image', 'url(' + api.system.user().avatar.tiny + ')' )
		  $( '.new-post-button .something-to-say' ).text( lang.cardsList.somethingToSay )
		  $( '.no-posts .no-post-to-show' ).text( lang.cardsList.noPostToShow )
		  $( '.no-posts .left-side span' ).text( lang.noPosts )
		  $( '.no-posts .right-side span' ).text( lang.createNewPost )
		  $( '.card-options-section .delete span' ).text( lang.deletePost )
		  $( '.card-options-section .edit span' ).text( lang.editPost )
		  $( '.card-content.edit-mode .title-input' ).attr( 'placeholder' , lang.writeTitle )
		  $( '.card-content.edit-mode .content-input' ).attr( 'placeholder' , lang.writeDescription )
		  $( '.send-button span' ).text( lang.send )
		  $( '.comments-footer .comment-input' ).attr(  'placeholder' , lang.writeComment )
		  $( '.cancel-new-card span' ).text( lang.cancel )
		  $( '.save-new-card span' ).text( lang.save )
		  $( '.attachments span' ).text( lang.addFiles )
		  $( '.attach-select .inevio span, .attach-select-new-post .inevio span' ).text( lang.uploadInevio )
		  $( '.attach-select .pc span, .attach-select-new-post .pc span' ).text( lang.uploadPC )

		  //World users
		  $( '.invite-user-container .ui-input-search input, .kick-user-container .ui-input-search input' ).attr(  'placeholder' , lang.search )
		  $( '.cancel-invite-user span' ).text( lang.cancel )
		  $( '.invite-user span' ).text( lang.invite )
		  $( '.invite-by-mail span' ).text( lang.inviteByMail )
		  $( '.kick-out-button span' ).text( lang.worldUsers.kickOut )

		  //Explore
		  $( '.explore-text, .search-title' ).text( lang.explore )
		  $( '.tend-text' ).text( lang.tend )
		  $( '.follow-button span' ).text( lang.follow )
		  $( '.search-bar input' ).attr('placeholder', lang.search)
		  $( '.next-page .next-text' ).text( lang.next )
		  $( '.back-page .back-text' ).text( lang.previous )

		  //New world
		  $( '.new-world-title .title' ).text( lang.worldCreation )
		  $( '.category .public' ).text( lang.publics )
		  $( '.category .private' ).text( lang.privates )
		  $( '.new-world-title .step-a' ).text( lang.stepa )
		  $( '.new-world-title .step-b' ).text( lang.stepb )
		  $( '.new-world-name span' ).text( lang.worldName )
		  $( '.new-world-avatar > span' ).text( lang.avatarBack )
		  $( '.change-background-button span' ).text( lang.changeBack )
		  $( '.new-world-desc span' ).text( lang.worldDesc )
		  $( '.new-world-privacy > span' ).text( lang.privacy )
		  $( '.option.public .title' ).text( lang.publicWorld )
		  $( '.option.public .desc' ).text( lang.publicDesc )
		  $( '.option.hidden .title' ).text( lang.privateWorld )
		  $( '.option.hidden .desc' ).text( lang.privateDesc )
		  $( '.option.public > span' ).text( lang.public )
		  $( '.option.hidden > span' ).text( lang.private )
		  $( '.create-world-button.step-a span' ).text( lang.createWorldShort )

		}

		/* Date functions */

		_getStringHour( date ){

		  var now = new Date()

		  var hh = date.getHours()
		  var mm = date.getMinutes()

		  if(hh<10) {
		    hh='0'+hh
		  }

		  if(mm<10) {
		    mm='0'+mm
		  }

		  return hh + ':' + mm

		}

		_timeElapsed( lastTime ){

		  var now = new Date()
		  var last = new Date( lastTime )
		  var message
		  var calculated = false;

		  if( now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth() ){

		    if( now.getDate() === last.getDate() ){

		      message = this._getStringHour( lastTime )
		      calculated = true

		    }else if( new Date ( now.setDate( now.getDate() - 1 ) ).getDate() === last.getDate() ){

		      message = lang.lastDay + ' ' + lang.at + ' ' + this._getStringHour( lastTime )
		      calculated = true

		    }

		  }

		  if ( !calculated ) {

		    var day = last.getDate()
		    var month = last.getMonth()+1

		    if(day<10) {
		      day='0'+day
		    }

		    if(month<10) {
		      month='0'+month
		    }

		    message = day + '/' + month + '/' + last.getFullYear().toString().substring( 2 , 4 ) + ' ' + lang.at + ' ' + this._getStringHour( lastTime );
		    calculated = true

		  }

		  return message;

		}

		/* End of date functions */


		animateCards(){

		  // World cards appears and goes up
		  var firstCards = $( '.tend-list .world-card' )
		  var restOfCards = firstCards.splice(10, firstCards.length - 10)
		  firstCards.each( function( i , card ){

		    var d = i * 150;

		    $( card ).transition({

		      delay       : (550 + d),
		      'opacity'   : 1,
		      'transform' : 'translateY(0px)'

		    }, 1000, function(){

		      restOfCards.forEach(function(card){

		        $( card ).css({
		          'opacity'   : 1,
		          'transform' : 'translateY(0px)'
		        })

		      })

		    })

		  })

		}

		/* Type of cards */

		appendDocumentCard( post , reason , callback ){

		  var card = this._documentCardPrototype.clone()
		  var user = post.apiPost.authorObject
		  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.apiPost.id ).addClass( 'cardDom' )

		  if( post.fsnodes.length ){

		  	var fsnode = post.fsnodes[0]
	
	      if( fsnode.mime.indexOf( 'image' ) === 0 || fsnode.mime === 'application/pdf' ){
	        card.find( '.doc-preview img' ).attr( 'src' , fsnode.thumbnails['1024'] )
	        card.find( '.doc-preview-bar' ).hide()
	      }else{
	        // To Do -> Is this really neccesary? background with a micro thumb is added a few lines after this
	        card.find( '.doc-preview img' ).attr( 'src',  fsnode.thumbnails.big )
	      }

	      card.find( '.preview-title' ).text( fsnode.name )
	      card.find( '.preview-info' ).text( api.tool.bytesToUnit( fsnode.size, 1 ) )
	      card.find( '.doc-preview' ).addClass( 'attachment-' + fsnode.id ).data( 'fsnode' , fsnode )
	      card.find( '.doc-preview-bar i' ).css( 'background-image' , 'url( '+ fsnode.icons.micro +' )' )

		  }else{
		  	card.addClass('loading')
		  }

	    if ( post.apiPost.title === '' ) {
	      card.find( '.title' ).hide()
	    }else{
	      card.find( '.title' ).text( post.apiPost.title )
	    }

	    if ( post.apiPost.content === '' ) {
	      card.find( '.desc' ).hide()
	    }else{
	      card.find( '.desc' ).html( post.apiPost.content.replace(/\n/g, "<br />").replace( /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>' ) )
	    }

	    card.find( '.desc' ).find('a').each( function(){

	      if( !URL_REGEX.test( $(this).attr('href') ) ){
	        $(this).attr( 'href', 'http://' + $(this).attr('href') )
	      }

	    });

	    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' )
	    card.find( '.card-user-name' ).text( user.fullName )
	    card.find( '.time-text' ).text( this._timeElapsed( new Date( post.apiPost.created ) ) )

	    /*if (!this.isMobile) {
	      setRepliesAsync( card , post.apiPost );
	    }else{
	      setRepliesAsyncWithoutAppendMobile( card , post.apiPost );
	    }
	    appendCard( card , post.apiPost );*/
	    
		  this.appendComments( card, post, function( cardToInsert ){
		  	return callback( cardToInsert )
		  })

		}

		appendGenericCard( post , reason , callback ){

		  var card = this._genericCardPrototype.clone()
		  var user = post.apiPost.authorObject
		  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.apiPost.id ).addClass( 'cardDom' )

	    if( post.fsnodes.length ){

	    	for (var i = 0; i < post.fsnodes.length; i++) {

		      var fsnode = post.fsnodes[i]

		      if (!fsnode) {
		        break
		      }

		      if ( card.find( '.attachment-' + fsnode.id ).length === 0 ){

		        var docPreview = card.find( '.doc-preview.wz-prototype' ).clone()
		        docPreview.removeClass( 'wz-prototype' ).addClass( 'attachment-' + fsnode.id )

		        if (post.apiPost.metadata && post.apiPost.metadata.operation === 'remove') {
		          docPreview.find( '.doc-icon img' ).attr( 'src' , 'https://static.horbito.com/app/360/deleted.png' )
		        }else{
		          docPreview.find( '.doc-icon img' ).attr( 'src' , fsnode.icons.big )
		        }


		        if ( fsnode.mime && fsnode.mime.indexOf( 'office' ) > -1 ) {
		          docPreview.find( '.doc-icon' ).addClass( 'office' )
		        }

		        docPreview.find( '.doc-title' ).text( fsnode.name )
		        docPreview.find( '.doc-info' ).text( api.tool.bytesToUnit( fsnode.size ) )
		        card.find( '.desc' ).after( docPreview )
		        docPreview.data( 'fsnode' , fsnode )

		      }

		    }

	    }else{

	    	card.addClass('loading')

				for (var i = 0; i < post.apiPost.fsnode.length; i++) {

		      var fsnode = post.apiPost.fsnode[i]

		      if (!fsnode) {
		        break
		      }

		      if ( card.find( '.attachment-' + fsnode.id ).length === 0 ){

		        var docPreview = card.find( '.doc-preview.wz-prototype' ).clone()
		        docPreview.removeClass( 'wz-prototype' ).addClass( 'attachment-' + fsnode )
		        card.find( '.desc' ).after( docPreview )

		      }

		    }

	    }

	    if ( post.apiPost.title === '' ) {
	      card.find( '.title' ).hide()
	    }else{
	      card.find( '.title' ).text( post.apiPost.title )
	    }

	    if ( post.apiPost.content === '' ) {
	      card.find( '.desc' ).hide()
	    }else{
	      card.find( '.desc' ).html( post.apiPost.content.replace(/\n/g, "<br />").replace( /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>' ) )
	    }

	    card.find( '.desc' ).find('a').each( function(){

	      if( !URL_REGEX.test( $(this).attr('href') ) ){
	        $(this).attr( 'href', 'http://' + $(this).attr('href') )
	      }

	    });

	    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' )
	    card.find( '.card-user-name' ).text( user.fullName )
	    card.find( '.time-text' ).text( this._timeElapsed( new Date( post.apiPost.created ) ) )
	    card.data( 'time' , post.apiPost.created )

	    /*if (!this.isMobile) {
	      setRepliesAsync( card , post )
	    }else{
	      setRepliesAsyncWithoutAppendMobile( card , post );
	    }
	    appendCard( card , post );*/
		  this.appendComments( card, post, function( cardToInsert ){
		  	return callback( cardToInsert )
		  })

		}

		appendNoFileCard( post , reason, callback ){

		  var card = this._genericCardPrototype.clone()
		  var user = post.apiPost.authorObject
		  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.apiPost.id ).addClass( 'cardDom' )
		  card.find( '.doc-preview' ).hide()

		  if ( post.apiPost.title === '' ) {
		    card.find( '.title' ).hide()
		  }else{
		    card.find( '.title' ).text( post.apiPost.title )
		  }

		  if ( post.apiPost.content === '' ) {
		    card.find( '.desc' ).hide()
		  }else{
		    card.find( '.desc' ).html( post.apiPost.content.replace(/\n/g, "<br />").replace( /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>' ) )
		  }

		  card.find( '.desc' ).find('a').each( function(){

		    if( !URL_REGEX.test( $(this).attr('href') ) ){
		      $(this).attr( 'href', 'http://' + $(this).attr('href') )
		    }

		  })

		  if( user ){
			  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' )
		  	card.find( '.card-user-name' ).text( user.fullName )
		  }

		  card.find( '.time-text' ).text( this._timeElapsed( new Date( post.apiPost.created ) ) )

		  /*if (!this.isMobile) {
		    setRepliesAsync( card , post.apiPost );
		  }else{
		    setRepliesAsyncWithoutAppendMobile( card , post.apiPost );
		  }
		  appendCard( card , post.apiPost );*/

		  this.appendComments( card, post, function( cardToInsert ){
		  	return callback( cardToInsert )
		  })

		}

		appendYoutubeCard( post , user , reason, callback ){

		  var card = this._youtubeCardPrototype.clone();
		  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.apiPost.id ).addClass( 'cardDom' );

		  var youtubeCode = this._getYoutubeCode( post.apiPost.content );

		  /*if (this.isMobile) {
		    card.find( '.video-preview' ).attr( 'src' , 'https://www.youtube.com/embed/' + youtubeCode );
		  }else{*/
		    card.find( '.video-preview' ).attr( 'src' , 'https://www.youtube.com/embed/' + youtubeCode + '?autoplay=0&html5=1&rel=0' );
		  //}

		  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
		  card.find( '.card-user-name' ).text( user.fullName );
		  card.find( '.time-text' ).text( timeElapsed( new Date( post.apiPost.created ) ) );
		  card.find( '.desc' ).html( post.apiPost.content.replace(/\n/g, "<br />").replace( /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>' ) );
		  card.find( '.title' ).text( post.apiPost.title );
		  card.find( '.activate-preview' ).text( lang.preview );

		  card.find( '.desc' ).find('a').each( function(){

		    if( !URL_REGEX.test( $(this).attr('href') ) ){
		      $(this).attr( 'href', 'http://' + $(this).attr('href') );
		    }

		  });

		  /*if (!this.isMobile) {
		    setRepliesAsync( card , post.apiPost );
		  }else{
		    setRepliesAsyncWithoutAppendMobile( card , post.apiPost );
		  }
		  appendCard( card , post.apiPost );*/

		  this.appendComments( card, post, function( cardToInsert ){
		  	return callback( cardToInsert )
		  })
  
		}

		/* End of type of cards */

		appendPostList( list, loadingMorePosts ){

			var domList = []
			var postPromises = []

			if( list.length == 0 && !loadingMorePosts ){
				this._noPosts.css( 'opacity' , '1' );
				this._noPosts.show()
			}

			if( !loadingMorePosts ){
				$( '.cardDom' ).remove()
			}

  		list.forEach( function( post ){

  			var promise = $.Deferred()
	      postPromises.push( promise )

  			this.appendPost( post, promise , function( postDom ){

  				if( post.apiPost.author === this.myContactID ){
  					postDom.addClass( 'mine' )
  				}
  				postDom.data( 'post', post )
					domList.push( postDom )
  				promise.resolve()

  			}.bind(this))
		    
	    }.bind(this) )

	    $.when.apply( null, postPromises ).done( function(){

	    	if( domList.length ){

	    		if( !loadingMorePosts ){
	    			this._domPostContainer.scrollTop(0)
	    		}
	 	    	this._noPosts.css( 'opacity' , '0' );
					this._noPosts.hide()
	      	this._domPostContainer.append( domList )
	      	//this._domPostContainer.scrollTop( this._domPostContainer[ 0 ].scrollHeight )

	    	}

    	}.bind(this));

		}

		appendPost( post, promise, callback ){

      if( post.apiPost.metadata && post.apiPost.metadata.operation === 'remove' ){

        this.appendGenericCard( post , lang.postCreated , function( postDom ){
          return callback( postDom, promise )
        });

      }else if ( post.apiPost.metadata && post.apiPost.metadata.fileType ) {

        switch( post.apiPost.metadata.fileType ){

          case 'generic':
          this.appendGenericCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          })
          break

          case 'document':
          this.appendDocumentCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          })
          break

          case 'image':
          this.appendDocumentCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          })
          break

          case 'video':
          this.appendGenericCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          })
          break

          case 'music':
          this.appendGenericCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          })
          break

        }

      }else if( post.apiPost.metadata && post.apiPost.metadata.linkType ){

        switch( post.apiPost.metadata.linkType ){

          case 'youtube':
          this.appendYoutubeCard( post , lang.postCreated, function( postDom ){
          	return callback( postDom, promise )
          })
          break

        }

      }else{

        this.appendNoFileCard( post , lang.postCreated, function( postDom ){
         	return callback( postDom, promise )
        })

      }

		}

		appendComments( card, post, callback ){

			if( !post.commentsLoaded ){
				card.find( '.comments-text' ).text( lang.loading + ' ' + lang.comments )
				return callback( card )
			}

			var comments = post.comments

			if( Object.keys( comments ).length === 0 && comments.constructor === Object ){
				card.find( '.comments-text' ).text( '0 ' + lang.comments )
				return callback( card )
		  }

			comments = Object.values( comments )
	    card.find( '.comments-text' ).text( comments.length + ' ' + lang.comments )

	    if ( comments.length === 1 ) {
	      card.find( '.comments-text' ).text( comments.length + ' ' + lang.comment )
	    }else{
	      card.find( '.comments-text' ).text( comments.length + ' ' + lang.comments )
	    }
	    card.find( '.comments-text' ).data( 'num' , comments.length )

	    var listToAppend = []

	    async.each( comments, function( comment, checkEnd ){

	    	this.appendComment( comment, function( commentDom ){
	    		listToAppend.push( commentDom )
	    		checkEnd()
	    	})

	    }.bind(this), function(){

	      card.find( '.comments-list' ).append( listToAppend )
      	//card.find( '.comments-list' ).scrollTop( commentDom[0].offsetTop )
      	return callback( card )

	    })

		}

		appendComment( comment, callback, appending ){

			var commentDom = $( '.comment.wz-prototype' ).eq(0).clone()
			commentDom.removeClass( 'wz-prototype' ).addClass( 'commentDom comment-' + comment.apiComment.id )
		  /*if (this.isMobile) {
		    commentDom.find( '.reply-button' ).text( '-   ' + lang.reply )
		  }else{*/
		    commentDom.find( '.reply-button' ).text( lang.reply )
		  //}
		  commentDom.find( '.edit-button' ).text( lang.edit )

		  if ( comment.apiComment.author === this.myContactID ) {
		    commentDom.addClass('mine')
		  }

      commentDom.find( '.avatar' ).css( 'background-image' , 'url(' + comment.apiComment.authorObject.avatar.tiny + ')' )
      commentDom.find( '.name' ).text( comment.apiComment.authorObject.fullName )
      commentDom.find( '.time' ).text( this._timeElapsed( new Date( comment.apiComment.created ) ) )
      commentDom.find( '.comment-text' ).html( comment.apiComment.content.replace(/\n/g, "<br />").replace( /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>' ) )

      commentDom.find( '.comment-text' ).find('a').each( function(){

        if( !URL_REGEX.test( $(this).attr('href') ) ){
          $(this).attr( 'href', 'http://' + $(this).attr('href') )
        }

      })

      /*var container
      if (this.isMobile) {
        container = mobileWorldComments
      }else{
        container = card
      }*/

      commentDom.data( 'reply' , comment.apiComment )
      commentDom.data( 'name' , comment.apiComment.authorObject.name.split( ' ' )[0] )

      if( Object.keys( comment.replies ).length === 0 && comment.replies.constructor === Object ){

      	if( appending ){
      		$( '.post-' + comment.parent ).find( '.comments-list' ).append( comment )
      	}
				return callback( commentDom )
		  }

		  var repliesDom = []
		  commentDom.find( '.reply-list' ).show()

		  var replies = Object.values( comment.replies )
		  replies.forEach( function( reply, index ){

		  	var replyDom = this.appendReplyComment( reply, commentDom )

		  	repliesDom.push( replyDom )
		  	if( index === replies.length - 1 ){

			    commentDom.find( '.reply-list' ).append( repliesDom )
			    //card.find( '.comments-list' ).scrollTop( reply[0].offsetTop );
			    return callback( commentDom )

		  	}

		  }.bind(this))

		}

		appendReplyComment( response, comment, appending ){

		  var reply = comment.find( '.reply.wz-prototype' ).clone()
		  reply.removeClass( 'wz-prototype' ).addClass( 'replyDom reply-' + response.id )

		  if ( response.author === this.myContactID ) {
		    reply.addClass('mine')
		  }

	    reply.find( '.avatar' ).css( 'background-image' , 'url(' + response.authorObject.avatar.tiny + ')' )
	    reply.find( '.name' ).text( response.authorObject.fullName )
	    reply.find( '.time' ).text( this._timeElapsed( new Date( response.created ) ) )
	    reply.find( '.reply-text' ).html( response.content.replace(/\n/g, "<br />").replace( /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>' ) )

	    reply.find( '.reply-text' ).find('a').each( function(){

	      if( !URL_REGEX.test( $(this).attr('href') ) ){
	        $(this).attr( 'href', 'http://' + $(this).attr('href') )
	      }

	    });

	    //comment.find( '.reply-list' ).append( reply );
	    /*if (!this.isMobile) {
	      card.find( '.comments-list' ).scrollTop( reply[0].offsetTop );
	    }*/

	    reply.data( 'reply' , response )
	    if( appending ){
	    	comment.find( '.reply-list' ).append( reply )
	    }

	    return reply

		}

		/*appendWorldCards( worlds, myWorlds ){

			var cardsList = []

			worlds.forEach( function( worldApi , index){

			  var world = $( '.world-card.wz-prototype' ).clone();
			  world.removeClass( 'wz-prototype' ).addClass( 'world-card-' + worldApi.id ).addClass( 'world-card-dom' );
			  var worldTitle = worldApi.name;
			  if ( worldTitle.length > 32 ) {
			    worldTitle = worldTitle.substr(0 , 29) + '...';
			  }
			  world.find( '.world-title-min' ).text( worldTitle );
			  world.find( '.world-avatar-min' ).css( 'background-image' , 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')' );

			  if( worldApi.users ){
			    world.find( '.world-followers' ).text( worldApi.users + ' ' + lang.followers );
			  }

			  if( myWorlds.indexOf( worldApi.id ) !== -1 ){

			    world.addClass( 'followed' ).removeClass( 'unfollowed' );
			    world.find( '.follow-button span' ).text( lang.following );

			  }

			  world.data( 'world' , worldApi );
			  cardsList.push( world )

			  if( index === worlds.length - 1 ){
			  	$( '.world-card.wz-prototype' ).after( cardsList );
			  }

			})

		}*/

		appendWorldCard( worldApi, following ){

		  var world = $( '.world-card.wz-prototype' ).clone();
		  world.removeClass( 'wz-prototype' ).addClass( 'world-card-' + worldApi.id ).addClass( 'world-card-dom' );
		  var worldTitle = worldApi.name;
		  if ( worldTitle.length > 32 ) {
		    worldTitle = worldTitle.substr(0 , 29) + '...';
		  }
		  world.find( '.world-title-min' ).text( worldTitle );
		  world.find( '.world-avatar-min' ).css( 'background-image' , 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')' );

		  if( worldApi.users ){
		    world.find( '.world-followers' ).text( worldApi.users + ' ' + lang.followers );
		  }

		  if( following ){

		    world.addClass( 'followed' ).removeClass( 'unfollowed' );
		    world.find( '.follow-button span' ).text( lang.following );

		  }


		  //$( '.world-card.wz-prototype' ).after( world );
		  $( '.explore-container .tend-grid' ).append( world )

		  world.data( 'world' , worldApi );

		}

		closeExploreWorlds(){

			this.toggleNoWorlds()
		  var exploreSection = $( '.explore-section' );

		  // Fade out blue background
		  exploreSection.stop().clearQueue().transition({

		    'opacity' : 0

		  }, 300, function(){

		    exploreSection.css( 'display' , 'none' );

		    $( '.new-world-button, .close-explore' ).css({
		      'transform' : 'translateY(10px)',
		      'opacity'   : 0
		    });

		  });

		  // Stars goes down
		  $( '.search-title, .search-bar, .tend-text' ).stop().clearQueue().transition({

		    'opacity'   : 0,
		    'transform' : 'translateY(20px)'

		  }, 300);

		  // New world button goes down
		  $( '.new-world-button, .close-explore' ).stop().clearQueue().transition({

		    'opacity'   : 0,
		    'transform' : 'translateY(10px)'

		  }, 300);

		  // World cards button goes down
		  $( '.world-card' ).stop().clearQueue().transition({

		    'opacity'   : 0,
		    'transform' : 'translateY(40px)'

		  }, 300);

		}

		closeInviteMembers(){

		  $( '.invite-user-container' ).removeClass( 'popup' )
		  $( '.invite-user-container *' ).removeClass( 'popup' )
		  $( '.friend .ui-checkbox' ).removeClass( 'active' )
		  $( '.invite-user-container .ui-input-search input' ).val('')
		  this.filterElements( '', '.friend' )

		}

		closeMembers(){

		  $( '.kick-user-container' ).removeClass( 'popup' )
		  $( '.kick-user-container *' ).removeClass( 'popup' )
		  $( '.invite-user-container .ui-input-search input' ).val('')
		  this.filterElements( '', '.friend' )

		}

		closeNewWorld(){

			var newWorldContainer = $( '.new-world-container-wrap' )

  		$( '.new-world-container' ).css( 'height' , '100%' )

		  // Fade out White background
		  newWorldContainer.stop().clearQueue().transition({

		    'opacity' : 0

		  }, 200, function(){

		    newWorldContainer.css( 'display' , 'none' )
		    $( '.new-world-avatar' ).hide()
		    $( '.new-world-desc' ).hide()
		    $( '.new-world-privacy' ).hide()
		    $( '.new-world-title' ).removeClass( 'second' )
		    $( '.create-world-button' ).removeClass( 'step-b' )
		    $( '.create-world-button' ).addClass( 'step-a' )
		    $( '.new-world-title .step-b' ).removeClass( 'hide' )
		    $( '.new-world-title .title' ).text( lang.worldCreation )
		    $( '.delete-world-button' ).addClass( 'hide' )

		    $( '.new-world-title, .new-world-name, .create-world-button, .new-world-avatar, .new-world-desc, .new-world-privacy, .delete-world-button' ).css({
		      'transform' : 'translateY(20px)',
		      'opacity'   : 0
		    });

		    $( '.close-new-world' ).css({
		      'transform' : 'translateY(10px)',
		      'opacity'   : 0
		    });

		    //if (!this.isMobile) {
		      $( '.create-world-button' ).css( {


		        'top'       : '400px',
		        'transform' : 'translateY(20px)',
		        'left'      : 'calc((50% - 236px) + 307px)'


		      } ).find( 'span' ).text( lang.createWorldShort )
		    //}

		    //this.closeExploreWorlds()
		    this.toggleNoWorlds()

		  }.bind(this))

  		$( '.new-world-container' ).removeClass( 'editing' )

		}

		newWorldAnimationB(){

			var editing = $( '.new-world-container' ).hasClass( 'editing' )

		  if ( editing ) {

		    //var height = this.isMobile ? '800px' : '770px'
		    var height = '770px'
		    $( '.new-world-container' ).css( 'height' , height )
		    this.newWorldAnimationBEditing()

		  }else{

		    //var height = this.isMobile ? '720px' : '770px'
		    var height = '770px'
		    $( '.new-world-container' ).css( 'height' , height )
		    this.newWorldAnimationBNormal()

		  }

		}

		newWorldAnimationBNormal(){

		  $( '.new-world-avatar' ).show()
		  $( '.new-world-desc' ).show()
		  $( '.new-world-privacy' ).show()
		  $( '.new-world-title' ).addClass( 'second' )
		  $( '.create-world-button' ).addClass( 'step-b' )
		  $( '.create-world-button' ).removeClass( 'step-a' )
		  $( '.option.private-option' ).addClass( 'active' )
		  $( '.option.public' ).removeClass( 'active' )


		  $( '.new-world-desc textarea' ).val('')

		  $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'none' )

		  // Fade in and goes up title (animation)
		  var translate = this.isMobile ? '0px' : '-67px'
		  $( '.new-world-title' ).stop().clearQueue().transition({
		    'transform' : 'translateY('+translate+')'
		  }, 1000, this.animationEffect)

		  // Fade in and goes up name (animation)
		  $( '.new-world-name' ).stop().clearQueue().transition({
		    'opacity'   : 0,
		    'transform' : 'translateX(-200px)'
		  }, 1000, this.animationEffect)


		  // Fade in and goes up button (animation)
		  //if (!this.isMobile) {
		    $( '.create-world-button , .delete-world-button' ).stop().clearQueue().transition({

		      'opacity'   : 0

		    }, 800, this.animationEffect, function(){

		      $( this ).css( {

		        'top'       : '640px',
		        'transform' : 'translateY(20px)',
		        'right'     : '0',
		        'left'      : 'calc(50% - 472px/2 + 150px)'

		      } ).find( 'span' ).text( lang.accept )


		    })
		 	//}

		  // Fade in and goes up avatar (animation)
		  $( '.new-world-avatar' ).stop().clearQueue().transition({

		    delay       : 500,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 1000)

		  // Fade in and goes up desc (animation)
		  $( '.new-world-desc' ).stop().clearQueue().transition({

		    delay       : 650,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 1000)

		  // Fade in and goes up privacy (animation)
		  $( '.new-world-privacy' ).stop().clearQueue().transition({

		    delay       : 800,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 1000)

		  // Fade in and goes up privacy (animation)
		  $( '.create-world-button' ).transition({

		    delay       : 950,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 1000)
		  $( '.delete-world-button' ).transition({

		    delay       : 950,
		    'opacity'   : 0.5,
		    'transform' : 'translateY(0px)'

		  }, 1000)

		}

		newWorldAnimationBEditing(){

		  //bypassNewWorldAnimationA()
	    $( '.new-world-container-wrap' ).css({

		    'display' : 'block',

		  }) 

		  $( '.new-world-container-wrap' ).transition({

		    'opacity' : 1

		  }, 300)

		  $( '.new-world-title' ).css({

		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  })

		  $( '.close-new-world' ).css({

		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  })

		  $( '.create-world-button' ).css( 'left' , 'calc((50% - 236px) + 55px)' ).find( 'span' ).text( lang.accept )
		  var text = this.isMobile ? lang.exit : lang.unfollowWorld
		  $( '.delete-world-button' ).css( 'left' , 'calc((50% - 135px) + 142px)' ).find( 'span' ).text( text )
		  $( '.create-world-button , .delete-world-button' ).css( {

		    'top'       : '640px',
		    'transform' : 'translateY(20px)',
		    'right'     : '0',
		    'opacity'   : '0'

		  })
		  $( '.new-world-name' ).css({

		    'opacity'   : '0'

		  })

		  $( '.new-world-title .title' ).text( lang.worldEdit )
		  $( '.new-world-title .step-b' ).addClass( 'hide' )

		  $( '.new-world-avatar' ).show()
		  $( '.new-world-desc' ).show()
		  $( '.new-world-privacy' ).show()
		  $( '.new-world-title' ).addClass( 'second' )
		  $( '.create-world-button' ).addClass( 'step-b' )
		  $( '.create-world-button' ).removeClass( 'step-a' )

		  $('.new-world-container-wrap').scrollTop(0)

		  // Fade in and goes up title (animation)
		  var translate = this.isMobile ? '0px' : '-67px'
		  $( '.new-world-title' ).stop().clearQueue().transition({
		    'transform' : 'translateY('+translate+')'
		  }, 1000)


		  // Fade in and goes up name (animation)
		  var translate = this.isMobile ? '-15px' : '-58px'
		  $( '.new-world-name' ).stop().clearQueue().transition({

		    delay       : 100,
		    'opacity'   : 1,
		    'transform' : 'translateY('+translate+')'

		  }, 1000)

		  // Fade in and goes up avatar (animation)
		  var translate = this.isMobile ? '50px' : '120px'
		  $( '.new-world-avatar' ).css( 'transform' , 'translateY(158px)' )
		  $( '.new-world-avatar' ).stop().clearQueue().transition({

		    delay       : 300,
		    'opacity'   : 1,
		    'transform' : 'translateY('+translate+')'

		  }, 1000)

		  // Fade in and goes up desc (animation)
		  var translate = this.isMobile ? '50px' : '120px'
		  $( '.new-world-desc' ).css( 'transform' , 'translateY(158px)' )
		  $( '.new-world-desc' ).stop().clearQueue().transition({

		    delay       : 500,
		    'opacity'   : 1,
		    'transform' : 'translateY('+translate+')'

		  }, 1000)

		  // Fade in and goes up privacy (animation)
		  var translate = this.isMobile ? '50px' : '120px'
		  $( '.new-world-privacy' ).css( 'transform' , 'translateY(158px)' )
		  $( '.new-world-privacy' ).stop().clearQueue().transition({

		    delay       : 700,
		    'opacity'   : 1,
		    'transform' : 'translateY('+translate+')'

		  }, 1000)


		  // Fade in and goes up privacy (animation)
		  var translate = this.isMobile ? '80px' : '120px'
		  $( '.create-world-button, .delete-world-button' ).css( 'transform' , 'translateY(158px)' )
		  $( '.create-world-button' ).transition({

		    delay       : 900,
		    'opacity'   : 1,
		    'transform' : 'translateY('+translate+')'

		  }, 1000)
		  $( '.delete-world-button' ).transition({

		    delay       : 900,
		    'opacity'   : 0.5,
		    'transform' : 'translateY('+translate+')'

		  }, 1000)

		}

		newWorldAnimationOut(){

		  var newWorldContainer = $( '.new-world-container-wrap' );

		  $( '.new-world-container' ).css( 'height' , '100%' );

		  // Fade out White background
		  newWorldContainer.stop().clearQueue().transition({
		    'opacity' : 0
		  }, 200, function(){

		    newWorldContainer.css( 'display' , 'none' )
		    $( '.new-world-avatar' ).hide()
		    $( '.new-world-desc' ).hide()
		    $( '.new-world-privacy' ).hide()
		    $( '.new-world-title' ).removeClass( 'second' )
		    $( '.create-world-button' ).removeClass( 'step-b' )
		    $( '.create-world-button' ).addClass( 'step-a' )
		    $( '.new-world-title .step-b' ).removeClass( 'hide' )
		    $( '.new-world-title .title' ).text( lang.worldCreation )
		    $( '.delete-world-button' ).addClass( 'hide' )

		    $( '.new-world-title, .new-world-name, .create-world-button, .new-world-avatar, .new-world-desc, .new-world-privacy, .delete-world-button' ).css({
		      'transform' : 'translateY(20px)',
		      'opacity'   : 0
		    })

		    $( '.close-new-world' ).css({
		      'transform' : 'translateY(10px)',
		      'opacity'   : 0
		    })

		    if( !this.isMobile ){

		      $( '.create-world-button' ).css({

		        'top'       : '400px',
		        'transform' : 'translateY(20px)',
		        'left'      : 'calc((50% - 236px) + 307px)'

		      }).find( 'span' ).text( lang.createWorldShort )

		    }

		    this.closeExploreWorlds()

		  }.bind(this))

		}

		newWorldStep(){

	    this.newWorldAnimationB()
	    /*if(uiContent.hasClass('compressed')){
	      decompressCover( { instant : true , world : $('.world.active') } )
	    }*/

		}

		fileContextMenu( fsnode ){

      var menu = api.menu()

      menu.addOption( lang.openFolder , function(){

        api.fs( fsnode.parent, function( error , node ){
          node.open()
        })

      })

      menu.addOption( lang.download , function(){
        fsnode.download()
      })

      menu.render()

		}

		filterElements( filter, elementQuery ){

			var list = $( elementQuery )
			list.show()
		  var listToShow = list.filter( this.startsWith( filter ) );
		  var listToHide = list.not( listToShow );
		  listToHide.hide();	

		}

		filterPosts( list ){

			if( list ){

				$( '.cardDom' ).removeClass( 'filtered' )
				list.forEach( function( id ){
					$( '.post-' + id ).addClass( 'filtered' )
				})

				$( '.cardDom:not(.filtered)' ).hide()
				$( '.cardDom.filtered' ).show()

			}else{
				$( '.cardDom' ).removeClass( 'filtered' ).show()
			}

		}		

		hideExploreTopBar(){
			$( '.explore-top-bar' ).removeClass( 'active' )
		}

		hideNoWorlds(){

			$( '.no-worlds' ).transition({
	      'opacity'         : 0
	    }, 200, this.animationEffect , function(){
	      $( '.no-worlds' ).hide()
	    })

		}

		leaveWorldDialog( worldId ){

			var dialog = api.dialog()

	    dialog.setTitle( lang.unfollowWorld )
	    dialog.setText( lang.confirmExit )

	    dialog.setButton( 0, wzLang.core.dialogCancel, 'black' )
	    dialog.setButton( 1, wzLang.core.dialogAccept, 'red' )

      dialog.render( function( doIt ){

	      if( !doIt ){
	        return
	      }

	      model.leaveWorld( worldId )

	    })

		}

		openEditWorld( world ){

			$( '.new-world-title input' ).val('');
		  $( '.new-world-container' ).addClass( 'editing' );
		  $( '.delete-world-button' ).removeClass( 'hide' );

		  this.newWorldAnimationB();

		  if (world.hasCustomIcon) {
		    $( '.wz-groupicon-uploader-start' ).removeClass('non-icon');
		    $( '.wz-groupicon-uploader-start' ).addClass('custom-icon');
		  }else{
		    $( '.wz-groupicon-uploader-start' ).removeClass('custom-icon');
		    $( '.wz-groupicon-uploader-start' ).addClass('non-icon');
		  }

		  $( '.new-world-desc textarea' ).val( world.description );
		  $( '.new-world-name input' ).val( world.name );
		  $( '.wz-groupicon-uploader-start' ).css( 'background-image' , 'url(' + world.icons.normal + '?token=' + Date.now() + ')' );
		  $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id );
		  $( '.privacy-options .option' ).removeClass( 'active' );
		  if ( world.isPrivate ) {
		    $( '.privacy-options .hidden' ).addClass( 'active' );
		  }else{
		    $( '.privacy-options .public' ).addClass( 'active' );
		  }

		}

		openExploreWorlds(){

		  $( '.explore-container' ).scrollTop(0)
		  //filterActive = null
		  $( '.explore-container .search-bar input' ).val('')
		  $('.world-card-dom').remove()

	    var exploreSection = $( '.explore-section' )

		  exploreSection.css( 'display' , 'block')
		  $('.explore-container').scrollTop(0)

		  // Fade in blue background
		  exploreSection.stop().clearQueue().transition({
		    'opacity' : 1
		  }, 300, this.animationEffect , function(){
		  	this.toggleNoWorlds( true )
		  }.bind(this))

		  // Stars appears and goes up
		  $( '.search-title, .search-bar, .tend-text' ).stop().clearQueue().transition({

		    delay       : 550,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 500, this.animationEffect)

		  // New world button appears and goes up
		  $( '.new-world-button, .close-explore' ).stop().clearQueue().transition({

		    delay       : 800,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 450, this.animationEffect)

		}

		openInviteMembers( friends, worldName ){

	    $( '.invite-user-container' ).addClass( 'popup' )
    	$( '.invite-user-container *' ).addClass( 'popup' )

			$( '.invite-user-title' ).html( '<i>' + lang.worldUsers.invitePeople + '</i>' + lang.worldUsers.to + '<figure>' + worldName + '</figure>' )

		  $( '.friendDom' ).remove()
		  $( '.invite-user-container .ui-input-search input' ).val('')
		  this.filterElements( '' , '.friend' )

		  friends.sort(function(a , b){
	      if(a.fullName < b.fullName) return -1
	      if(a.fullName > b.fullName) return 1
	      return 0
	    })

	    var friendDomList = []

	    friends.forEach( function( friendApi, index ){

    	  var friend = $( '.friend.wz-prototype' ).clone()
			  friend.removeClass( 'wz-prototype' ).addClass( 'user-' + friendApi.id ).addClass( 'friendDom' )

			  friend.find( 'span' ).text( friendApi.fullName )
			  friend.find( '.avatar' ).css( 'background-image' , 'url(' + friendApi.avatar.normal + ')' )
			  friend.data( 'user' , friendApi )
			  friendDomList.push( friend )

			  if( index === friends.length - 1 ){

			  	$( '.friend-list' ).scrollTop(0)
			  	$( '.friend-list' ).append( friendDomList )
			  	
			  }

	    })

		}

		openMembers( world ){

			$( '.kick-user-container' ).addClass( 'popup' )
		  $( '.kick-user-container *' ).addClass( 'popup' )

		  if ( world.apiWorld.owner === this.myContactID ) {
		    $('.kick-user-section').addClass('admin')
		    $( '.kick-user-title' ).html( '<i>' + lang.worldUsers.kickPeople + '</i>' + lang.worldUsers.from + '<figure>' + world.apiWorld.name + '</figure>' )
		  }else{
		    $('.kick-user-section').removeClass('admin')
		    $( '.kick-user-title' ).html( '<i>' + lang.worldUsers.listPeople + '</i>' + lang.worldUsers.from + '<figure>' + world.apiWorld.name + '</figure>' )
		  }

		  $( '.memberDom' ).remove()
		  $( '.kick-user-container .ui-input-search input' ).val('')
		  this.filterElements( '', '.member' )

		  world.members.sort(function(a , b){
        if(a.fullName < b.fullName) return -1
        if(a.fullName > b.fullName) return 1
        return 0
      })

      var memberDomList = []

      world.members.forEach( function( user, index ){

			  var member = $( '.member.wz-prototype' ).clone()
			  member.removeClass( 'wz-prototype' ).addClass( 'user-' + user.id ).addClass( 'memberDom' )

			  if ( user.id === world.apiWorld.owner ) {
			    member.addClass('isAdmin')
			  }

			  member.find( '.member-name' ).text( user.fullName )
			  member.find( '.avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' )

			  member.data( 'user' , user )
			  memberDomList.push( member )

			  if( index === world.members.length - 1 ){
					$( '.members-list' ).append( memberDomList )
			  } 

      })

		}

		openNewPost( world ){

			/*if( this.isMobile ){
		    newPostMobile()
		  }else{*/
		    api.app.createView( { type: 'manual' , world: world } , 'newPost' )
		  //}

		}

		openNewWorld(){

			var newWorldContainer = $( '.new-world-container-wrap' )

		  $( '.new-world-name input' ).val( '' )

		  newWorldContainer.css( 'display' , 'block')

		  // Fade in White background (animation)
		  newWorldContainer.stop().clearQueue().transition({
		    'opacity' : 1
		  }, 300)

		  // Fade in and goes up title (animation)
		  $( '.new-world-title' ).stop().clearQueue().transition({

		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 300)

		  // Fade in and goes up esc (animation)
		  $( '.close-new-world' ).stop().clearQueue().transition({

		    delay       : 250,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 300)

		  // Fade in and goes up name (animation)
		  $( '.new-world-name' ).stop().clearQueue().transition({

		    delay       : 250,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 300)

		  // Fade in and goes up button (animation)
		  $( '.create-world-button' ).stop().clearQueue().transition({

		    delay       : 250,
		    'opacity'   : 1,
		    'transform' : 'translateY(0px)'

		  }, 300)

		  $( '.delete-world-button' ).stop().clearQueue().transition({

		    delay       : 250,
		    'opacity'   : 0.5,
		    'transform' : 'translateY(0px)'

		  }, 300)

		}

		openWorld( world, updatingHeader ){

			$( '.clean' ).remove()
		  $( '.category-list .world' ).removeClass( 'active' )
		  $( '.world-' + world.apiWorld.id ).addClass( 'active' )
		  $( '.search-post input, .mobile-world-content .search-bar input' ).val('')
		  $( '.world-title' ).text( world.apiWorld.name )
		  if( world.apiWorld.users == 1 ){
				$( '.world-members-button' ).text( world.apiWorld.users + ' ' + lang.worldHeader.member )
		  }else{
				$( '.world-members-button' ).text( world.apiWorld.users + ' ' + lang.worldHeader.members )
		  }
		  $( '.world-avatar' ).css( 'background-image' , 'url(' + world.apiWorld.icons.normal + '?token=' + Date.now() + ')' )
		  this.toggleSelectWorld( false )

		  if( !updatingHeader ){
		  	$( '.cardDom' ).remove()
		  }

		}

		showExploreTopBar(){
			$( '.explore-top-bar' ).addClass( 'active' )
		}

		showNoWorlds(){

      $( '.no-worlds' ).show()
      $( '.no-worlds' ).transition({
        'opacity' : 1
      }, 200, this.animationEffect )

		}

		startsWith( wordToCompare ){

		  return function( index , element ) {
		    return $( element ).find( 'span' ).text().toLowerCase().indexOf( wordToCompare.toLowerCase() ) !== -1;
		  }

		}

		toggleNoWorlds( showNoWorlds ){

			if ( showNoWorlds || $( '.worldDom' ).length === 0 ) {

		    this.noWorlds.show()
		    this.noWorlds.transition({
		      'opacity' : 1
		    }, 200, this.animationEffect )

	  	}else{

		    this.noWorlds.transition({
		      'opacity' : 0
		    }, 200, this.animationEffect , function(){
		      this.noWorlds.hide()
		    }.bind(this))

	  	}

		}

		toggleReplies( card ){

      var height = parseInt( card.find( '.comments-list' ).css( 'height' ) ) + 50
      var commentsSection = card.find( '.comments-section' )

      /*if (this.isMobile) {
        return
      }*/

      if( commentsSection.hasClass( 'opened' ) ){

        commentsSection.css( 'height' , height )
        card.removeClass( 'comments-open' )
        commentsSection.transition({
          'height' : 0
        }, 200, function(){
          commentsSection.removeClass( 'opened' )
        })

      }else{

        card.addClass( 'comments-open' )
        commentsSection.find( '.comments-list' ).scrollTop(9999999)
        commentsSection.transition({
          'height' : height
        }, 200, function(){

          commentsSection.addClass( 'opened' )
          commentsSection.css( 'height', 'auto' )
          commentsSection.find( 'textarea' ).focus()

        })

      }

		}

		toggleSelectWorld( show ){

			if( show ){
				$( '.select-world' ).show()
			}else{
				$( '.select-world' ).hide()
			}

		}

		updateGenericCardFSNodes( post ){

			var card = $( '.post-' + post.apiPost.id )
			card.removeClass('loading')

			post.fsnodes.forEach( function( fsnode ){

		    if ( card.find( '.attachment-' + fsnode.id ).length != 0 ){

		      var docPreview = card.find( '.attachment-' + fsnode.id )

		      if (post.apiPost.metadata && post.apiPost.metadata.operation === 'remove') {
		        docPreview.find( '.doc-icon img' ).attr( 'src' , 'https://static.horbito.com/app/360/deleted.png' )
		      }else{
		        docPreview.find( '.doc-icon img' ).attr( 'src' , fsnode.icons.big )
		      }

		      if ( fsnode.mime && fsnode.mime.indexOf( 'office' ) > -1 ) {
		        docPreview.find( '.doc-icon' ).addClass( 'office' )
		      }

		      docPreview.find( '.doc-title' ).text( fsnode.name )
		      docPreview.find( '.doc-info' ).text( api.tool.bytesToUnit( fsnode.size ) )
		      //card.find( '.desc' ).after( docPreview )
		      docPreview.data( 'fsnode' , fsnode )

		    }

			})

		}

		updateDocumentCardFSNodes( post ){

			var card = $( '.post-' + post.apiPost.id )
			card.removeClass('loading')

			post.fsnodes.forEach( function( fsnode ){

	      if( fsnode.mime.indexOf( 'image' ) === 0 || fsnode.mime === 'application/pdf' ){
	        card.find( '.doc-preview img' ).attr( 'src' , fsnode.thumbnails['1024'] )
	        card.find( '.doc-preview-bar' ).hide()
	      }else{
	        // To Do -> Is this really neccesary? background with a micro thumb is added a few lines after this
	        card.find( '.doc-preview img' ).attr( 'src',  fsnode.thumbnails.big )
	      }

	      card.find( '.preview-title' ).text( fsnode.name )
	      card.find( '.preview-info' ).text( api.tool.bytesToUnit( fsnode.size, 1 ) )
	      card.find( '.doc-preview' ).data( 'fsnode' , fsnode )
	      card.find( '.doc-preview-bar i' ).css( 'background-image' , 'url( '+ fsnode.icons.micro +' )' )

			})

		}

		updatePostComments( post ){
			
			var card = $( '.post-' + post.apiPost.id )
			if( card.length ){
				this.appendComments( card, post, function(){} )				
			}

		}

		updatePostFSNodes( post ){

			if( post.apiPost.metadata && post.apiPost.metadata.operation === 'remove' ){

        this.updateGenericCardFSNodes( post )

      }else if ( post.apiPost.metadata && post.apiPost.metadata.fileType ) {

        switch( post.apiPost.metadata.fileType ){

          case 'generic':
					this.updateGenericCardFSNodes( post )
          break

          case 'document':
					this.updateDocumentCardFSNodes( post )
          break

          case 'image':
          this.updateDocumentCardFSNodes( post )
          break

          case 'video':
					this.updateGenericCardFSNodes( post )
          break

          case 'music':
					this.updateGenericCardFSNodes( post )
          break

        }

      }

		}

		updateWorldCard( worldId, toFollow ){

			if( toFollow ){

				$( '.world-card-' + worldId ).find( '.follow-button span' ).text( lang.following )
	    	$( '.world-card-' + worldId ).addClass( 'followed' )

			}else{

				$( '.world-card-' + worldId ).find( '.follow-button span' ).text( lang.follow )
				$( '.world-card-' + worldId ).removeClass( 'followed' )

			}

		}

		updateWorldsListUI( worldList ){

			if( worldList.length === 0 ){
				return this.toggleNoWorlds(true)
			}

			worldList = worldList.sort( function( a, b ){
		    return a.apiWorld.name.localeCompare( b.apiWorld.name )
		  })

			var publicWorlds = []

			function isPrivate( world ){

				if( !world.apiWorld.isPrivate ){
					publicWorlds.push( world )
				}

				return world.apiWorld.isPrivate

			}

			worldList = worldList.filter( isPrivate )

			//console.log( publicWorlds, worldList )
			function worldSidebarDom( item ){

		  	var world = $( '.sidebar .world.wz-prototype' ).clone()
				world.removeClass( 'wz-prototype' ).addClass( 'world-' + item.apiWorld.id ).addClass( 'worldDom' )
				world.find( '.world-name' ).text( item.apiWorld.name )

				if( item.apiWorld.owner === api.system.user().id ){
				  world.addClass( 'editable' )
				}

				world.find( '.world-icon' ).css( 'border-color' , colors[ item.apiWorld.id % colors.length ] )
				world.data( 'world', item.apiWorld )
				world.attr( 'data-id', item.apiWorld.id )

		  	return world

			}

		  this._domWorldsPrivateList.empty().append( worldList.map( function( item ){ 
		  	return worldSidebarDom( item )
		  }))


		  this._domWorldsPublicList.empty().append( publicWorlds.map( function( item ){ 
		  	return worldSidebarDom( item )
		  }))

		}

		worldContextMenu( worldDom , world ){

      var menu = api.menu()
      var isMine = world.owner === api.system.user().id ? true : false

      menu.addOption( lang.searchPost , function(){

        if ( worldDom.hasClass( 'active' ) ) {
          $( '.search-button' ).click()
        }else{

         	worldDom.trigger( 'click' )
         	/*selectWorld( worldDom , function(){
            $( '.search-button' ).click()
          })*/

        }

      })

      if( isMine ){

        menu.addOption( lang.editWorld , function(){

          if( worldDom.hasClass( 'active' ) ){
            $( '.new-world-container' ).data( 'world' , world )
          }else{
          	worldDom.trigger( 'click' )
          }
          this.openEditWorld( world )

        }.bind(this))

      }else{

        menu.addOption( lang.abandonWorld , function(){
          this.leaveWorldDialog( world.id )
        }.bind(this), 'warning')

      }

      menu.render()

		}

	}

	return new View()

})()

var model = ( function( view ){

	class Model{

  	constructor( view ){

  		this.view = view
  	  this.openedWorld
  	  this.myContactID = api.system.user().id
		  this.contacts = {}
		  this.worlds = {}

		  this.postsToLoad = []
		  this.started = false //started to load posts fsnodes
		  this.postsPrinted = 0
		  this.filterActive = ''

		  this.showingWorlds
		  this.loadingPublicWorlds = false

		  this._mainAreaMode
		  this._prevMainAreaMode = MAINAREA_NULL

		  this.apiFsCalls = 0

  		this.isMobile = this.view.dom.hasClass( 'wz-mobile-view' )

		  //this.changeMainAreaMode( MAINAREA_NULL )
  		this.fullLoad()

  	}

  	_compareTitle( query, title ){
			return ( title.toLowerCase().indexOf( query ) !== -1 )
		}

  	_loadFullContactList( callback ){

  		callback = api.tool.secureCallback( callback )

  		api.user.friendList( function( error, list ){

		    if( error ){
		    	return this.view.launchAlert( error )
		    }

		    this.contacts = {}

		    list.forEach( function( user ){

		    	api.user( user, function( error, userApi ){

		    		if( error ){
		    			return console.error
		    		}

		    		this.addContact( userApi )

		    	}.bind(this))
		      
		    }.bind( this ))

				callback( null, list )		

  		}.bind( this ) )

  	}

  	_loadFullWorldsList( callback ){

		  callback = api.tool.secureCallback( callback )

		  api.cosmos.getUserWorlds( this.myContactID , {from:0 , to:1000} , function( error , worlds ){

		  	// To Do -> Error
		    if( error ){
		    	return this.view.launchAlert( error )
		    }

		    worlds.forEach( function( world ){
		      this.addWorld( world )
		    }.bind( this ))

		    callback( null, worlds )

		  }.bind( this ))

		}

		addContact( user ){

		  if( this.contacts[ user.id ] ){
		    return this
		  }

		  this.contacts[ user.id ] = user;
		  return this

		}

		addPost( post ){

			if( post.isReply ){

				this.addReplyFront( post )

			}else{

				this.worlds[post.worldId].posts[ post.id ] = new Post( this, post )
				if( this.openedWorld && this.openedWorld.apiWorld.id === post.worldId ){
					this.showPosts( post.worldId , 0 )
				}

			}

		}

		addReplyBack( post, message ){

			if( !this.openedWorld || !this.openedWorld.posts[ post.apiPost.id ] ){
				return
			}

			this.openedWorld.posts[ post.apiPost.id ].apiPost.reply( { content: message }, function( error, object ){

				if( error ){
					return console.error( error )
				}

			})

		}

		addReplyFront( post ){

			var needToAppend = false
			if( this.openedWorld && this.openedWorld.apiWorld.id === post.worldId ){
				needToAppend = true
			}

			if( this.worlds[ post.worldId ].posts[ post.parent ] ){

				this.worlds[ post.worldId ].posts[ post.parent ].comments[ post.id ] = new Comment( this, post )
				if( needToAppend ){
					this.view.appendComment( this.worlds[ post.worldId ].posts[ post.parent ].comments[ post.id ], function(){}, true )
				}

			}else{

				//this.worlds[ post.worldId ].posts[ post.parent ].comments[ post.parent ].replies[ post.id ]
				/*if( needToAppend ){
					this.view.appendComment( this.worlds[ post.worldId ].posts[ post.parent ].comments[ post.id ], function(){}, true )
				}*/

			}

		}

		addUserFront( userId, world ){

			if( userId === this.myContactID ){

				/*if( this.openedWorld.apiWorld.id == world.id ){
					view.toggleSelectWorld()
				}*/

				this.addWorld( world )


			}else{

				this.worlds[ world.id ].apiWorld = world
				this.worlds[ world.id ].removeMember( userId )
				this.view.closeInviteMembers()

				if( this.openedWorld && this.openedWorld.apiWorld.id === world.id ){

					this.openedWorld = this.worlds[ world.id ]
					this.view.openWorld( this.worlds[ world.id ], true )

				}

			}			

		}

		addWorld( world ){

		  if( this.worlds[ world.id ] ){
		    return this
		  }

		  if( !Object.keys( this.worlds ).length ){
		  	this.view.hideNoWorlds()
		  }

		  this.worlds[ world.id ] = new World( this, world )
		  this.updateWorldsListUI()

		  return this

		}

		appendPublicWorldsAsync(){

			console.log( 'append',  this.loadingPublicWorlds )
			if( this.loadingPublicWorlds ){
				return
			}

			this.loadingPublicWorlds = true

    	if( !this.showingWorlds ){
				this.showingWorlds = { 'from': 0, 'to': 20 }
			}else{
				this.showingWorlds = { 'from': this.showingWorlds.to + 1, 'to': this.showingWorlds.to + 21 }
			}

		  api.cosmos.list( null , null , this.showingWorlds , function( error, worlds, nResults ){

		    if( error ){
		      return console.error( error )
		    }

		    /*if( options.page === 1 ){

		      this.totalPages = Math.ceil( nResults / 20 )
		      this.actualPageInterval = 1
		      //addPages()

		    }*/

		    if( !worlds.length ){
		    	this.allPublicWorldsLoaded = true
		    	return
		    }

		    worlds.forEach( function( world, index ){

		    	var following = false
		    	if( this.worlds[world.id] ){
		    		following = true
		    	}
		      view.appendWorldCard( world, following )

		      if( index === worlds.length - 1 ){

				    this.loadingPublicWorlds = false
				    this.view.animateCards()

		      }

		    }.bind(this))

		  }.bind(this))

		}

		createWorld( worldName ){

		  if ( !worldName ) {

		    var dialog = api.dialog()

		    dialog.setText( lang.worldTitleMandatory )
		    dialog.setButton( 0, lang.accept, 'red' )
		    dialog.render()

		    return

		  }

		  api.cosmos.create( worldName , null, true , null , function( error , world ){

		    if( error ){
		      return console.log( error )
		    }

		    this.addWorld( world )
		    this.view.newWorldStep()
		    //createChat( o )

		  }.bind(this));

		}

		editWorld( world, isPrivate, name, description ){

			if( !this.worlds[ world.id ] ){
				return
			}

			world.isPrivate = isPrivate
			world.description = description
			world.name = name

			world.set( world, function( error, editedWorld ){

				if( error ){
					return error
				}

				console.log( editedWorld )

			})

		}

		followWorld( world ){

		  if( api.system.user().user.indexOf('demo') === 0 && !world.isPrivate ){
		    alert(lang.noPublicWorlds);
		    return;
		  }

		  world.addUser( this.myContactID , function( error , o ){

		  	if( error ){
		  		return console.error( error )
		  	}

		  	this.addWorld( world )
		  	this.view.updateWorldCard( world.id, true )

		  }.bind(this))

		}

		fullLoad(){

		  async.parallel({

		    contacts : this._loadFullContactList.bind(this),
		    worlds : this._loadFullWorldsList.bind(this)

		  }, function( err, res ){

		    if( err ){
		    	return this.view.launchAlert( err )
		    }

		    if( !res.worlds.length ){

		    	//Show no worlds
		      //this.changeSidebarMode( SIDEBAR_CONVERSATIONS )
		      this.view.showNoWorlds()

		    }

		    console.log(this.worlds)
		    //this.loadFSNodes()

		  }.bind( this ))

		  return this

		}

		fastLoadFSNodes( post ){

			if( !post.readyToInsert ){

				post.loadPostFsnodes( function( updatedPost ){
					this.updatePost(updatedPost)
				}.bind(this))

			}

		}

		inviteUsers( users ){

		  //inviteUsers()

		  if( !this.openedWorld || !users.length ){
		  	return
		  }

		  users.forEach( function( userDom, index ){

		  	var user = $( userDom ).data( 'user' )

		  	this.openedWorld.apiWorld.addUser( user.id, function( error, o ){

		  		if( error ){
		  			console.error( error )
		  		}

		  	})

		  }.bind(this))

		}

		lazyLoadFSNodes(){

			//console.log( this.postsToLoad )

			if( this.postsToLoad.length ){

				var post = this.postsToLoad.pop()

				if( post.readyToInsert ){
					this.updatePost(post)
					this.lazyLoadFSNodes()
					return
				}

				post.loadPostFsnodes( function( updatedPost ){

					this.updatePost(updatedPost)

					setTimeout( function(){
						this.lazyLoadFSNodes()
					}.bind(this),70 )

				}.bind(this))

			}

		}

		leaveWorld( worldId ){

			if( !this.worlds[worldId] ){
				return
			}

      this.worlds[worldId].apiWorld.removeUser( this.myContactID , function( error , o ){

        if( error ){
          console.error( error );
        }else{

        	//this.removeWorldFront( worldId )

          /*wql.deleteLastRead( [ world.id , myContactID ] , function( err ){
            if (err) {
              console.error(err);
            }
          });*/

        }
        
      }.bind(this));

		}

		loadMorePosts(){

			if( this.openedWorld && !this.openedWorld.loadingPosts ){
				this.openedWorld._getNextPosts()
			}
			
		}

		openExploreWorlds(){

			this.showingWorlds = null //nullify
		  this.publicWorldsList = []
		  this.allPublicWorldsLoaded = false
  		view.openExploreWorlds()
  		this.appendPublicWorldsAsync()

		}

		openFile( fsnode ){

			if( typeof fsnode == 'undefined' ){
				return
			}

			fsnode.open()

		}

		openFolder(){

			if( !this.openedWorld ){
				return
			}

		  api.fs( this.openedWorld.apiWorld.volume , function( error , folder ){
		    folder.open();
		  });

		}

		openInviteMembers(){

			if( !this.openedWorld ){
				return
			}

			var contacts = Object.values( this.contacts )

			this.searchMember( contacts, this.openedWorld.members, function( contactsToShow ){

				view.openInviteMembers( contactsToShow, this.openedWorld.apiWorld.name )

			}.bind(this))

		}

		openMembers(){

			if( !this.openedWorld ){
				return
			}

			view.openMembers( this.openedWorld )

		}

		openNewPost(){

			if( !this.openedWorld ){
				return
			}

			view.openNewPost( this.openedWorld.apiWorld )

		}

		openWorld( worldId ){

		  //app.addClass( 'selectingWorld' );

		  if( !this.worlds[worldId] ){
		  	return console.error( 'Error al abrir mundo' )
		  }

		  if( this.openedWorld && this.openedWorld.apiWorld.id === worldId ){
		  	return
		  }

		  this.openedWorld = this.worlds[worldId];
		  this.view.openWorld( this.worlds[worldId] )

		  this.showPosts( worldId, 0 )

		}

		openWorldChat(){

			if( !this.openedWorld ){
				return
			}

	    api.app.openApp( 14 , [ 'open-world-chat' , { 'world' : this.openedWorld.apiWorld } , function( o ){
      	console.log(o);
  		}]);

		}

		searchMember( contacts, members, callback ){

			if( !contacts || !members ){
				return callback( false )
			}

			var listToShow = contacts

			for( var i = 0; i < contacts.length; i++ ){

				for( var j = 0; j < members.length; j++ ){

					if( contacts[i].id === members[j].id ){
						listToShow.splice( i,1 )
					}

				}

			}

			return callback( listToShow )

		}

		showPosts( worldId, start ){

			if( !start ){
				start = 0
			}

			var list = []
		  var id = null
		  var postsKeys = Object.keys( this.worlds[ worldId ].posts ).reverse()

		  /*postsKeys.forEach( function( postKey ){

		  	list.push( this.worlds[ worldId ].posts[ postKey ] )
		  	if( this.worlds[ worldId ].posts[ postKey ].readyToInsert == false ){
		  		this.fastLoadFSNodes( this.worlds[ worldId ].posts[ postKey ] )
		  	}

		  }.bind(this))*/

			if( start > postsKeys.length ){
				return
			}
			var end = start;

			start + 5 < postsKeys.length ? end = start + 5 : end = postsKeys.length

		  for( var i = start; i < end; i++ ){

		  	list.push( this.worlds[ worldId ].posts[ postsKeys[i] ] )
		  	if( this.worlds[ worldId ].posts[ postsKeys[i] ].readyToInsert == false ){
		  		this.fastLoadFSNodes( this.worlds[ worldId ].posts[ postsKeys[i] ] )
		  	}

		  }

		  this.postsPrinted = end
		  this.view.appendPostList( list, start > 0 )

		}

		searchPost( query ){

			if( !this.openedWorld || (Object.keys( this.openedWorld.posts ).length === 0 && this.openedWorld.posts.constructor === Object) ){
				return
			}

			if( !query ){
				return this.view.filterPosts( null )
			}

			var postsToShow = []

			var posts = Object.values( this.openedWorld.posts )

			posts.forEach( function( post, index ){

    	  if( this._compareTitle( query, post.apiPost.title ) ){
    	  	postsToShow.push( post.apiPost.id )
    	  }

	      if( index == posts.length - 1 ){
	      	return this.view.filterPosts( postsToShow )
	      }

	    }.bind(this))


		}

		updatePost( post ){

			var world = this.worlds[ post.apiPost.worldId ]

			if( !world && !world.posts[ post.apiPost.id ] ){
				return
			}

			world.posts[ post.apiPost.id ] = post

			if( this.openedWorld && this.openedWorld.apiWorld.id == world.apiWorld.id ){
				this.view.updatePostFSNodes( post )
			}

		}

		updateWorldsListUI(){

			var list = []
		  var id = null

		  for( var i in this.worlds ){
		    list.push( this.worlds[ i ] )
		  }

		  if( this.openedWorld ){
		  	id = this.openedWorld.apiWorld.id
		  }

			this.view.updateWorldsListUI( list, id )

		}

		removePostBack( post ){

			if( !this.openedWorld ){
				return
			}

			this.openedWorld.removePost( post.id, function( error, ok ){

				if( error ){
					return console.error( error )
				}

			})

		}

		removePostFront( postId, world ){

			if( !this.worlds[ world.id ] ){
				return
			}

			if( this.openedWorld && this.openedWorld.apiWorld.id === world.id ){
				view.removePost( postId )
			}

			//this.worlds[ world.id ]

		}

		removeWorldBack(){

			if( !this.openedWorld ){
				return
			}

			this.leaveWorld( this.openedWorld.apiWorld.id )

		}

		removeWorldFront( worldId ){

    	delete this.worlds[ worldId ]
    	this.updateWorldsListUI()

		}

		removeUserBack( userId ){

			if( !this.openedWorld ){
				return
			}

		  this.openedWorld.apiWorld.removeUser( userId, function( err ){

		    if( err ){
		      console.error(err)
		    }

		  })

		}

		removeUserFront( userId, world ){

			if( userId === this.myContactID ){

				if( this.openedWorld.apiWorld.id == world.id ){

					view.toggleSelectWorld( true )
					view.newWorldAnimationOut()

				}

				this.removeWorldFront( world.id )

			}else{

				this.worlds[ world.id ].apiWorld = world
				this.worlds[ world.id ].removeMember( userId )
				this.view.closeMembers()

				if( this.openedWorld && this.openedWorld.apiWorld.id === world.id ){

					this.openedWorld = this.worlds[ world.id ]
					this.view.openWorld( this.worlds[ world.id ], true )

				}

			}

		}

  }

  class World{

  	//Si se recibe un mundo, se crea un objeto. Si no, se creara el mundo en el api con la info recibida
  	constructor( app, world, info ){

  		this.app = app
		  this.posts = {}
		  this.members = []
		  this.folder
		  this.conversation
		  this.lastPostLoaded
		  this.loadingPosts = false

  		if( world ){

			  this.icon = world.icons.big
			  this.apiWorld = world

  		}else{
  			this._createWorld( info )
  		}

  		this._loadMembers()
  		this._getPosts(0,10)

  	}

  	_addMember( member ){

  		if( !member ){
  			return
  		}

  		this.members.push( member )

  		if( this.members.length === this.apiWorld.users ){
  			this._sortMembers()
  		}

  	}

  	_getNextPosts(){

  		if( this.app.postsPrinted < this.lastPostLoaded ){
  			this.app.showPosts( this.apiWorld.id , this.app.postsPrinted )
  		}else{
  			this._getPosts( this.lastPostLoaded, this.lastPostLoaded + 5 )
  		}
  		
  	} 

  	_getPosts( init, end ){

  		this.lastPostLoaded = init
  		this.loadingPosts = true

  		this.apiWorld.getPosts( {from: init , to: end , withFullUsers: true } , function( error , posts ){

  		 	if( error ){
  		 		return console.error( error )
  		 	}

  		 	this.lastPostLoaded = end
				this.loadingPosts = false

				posts.forEach( function( post, index ){

					this.posts[ post.id ] = new Post( this.app, post )
					if( index === posts.length - 1 && init !== 0 ){

						this.app.showPosts( this.apiWorld.id , init )

					}

				}.bind(this))

  		}.bind(this))

  	}

  	_loadMembers(){

  		if( !this.apiWorld ){
  			return
  		}

		  this.apiWorld.getUsers( function( error, members ){

		  	if( error ){
		  		//return this.app.view.launchAlert( error )
		  	}

		  	members.forEach( function( member ){

		    	if( this.app.contacts[ member.userId ] ){
		    		this._addMember( this.app.contacts[ member.userId ] )
		    	}else{

			      api.user( member.userId, function( err, user ){

			      	if( error ){
			      		return console.error( error )
			      	}
			        this._addMember( user, member.userId )

			      }.bind(this));

		    	}

		  	}.bind(this))

		  }.bind(this));

  	}

  	_sortMembers(){

  		this.members.sort(function(a , b){

        if(a.fullName < b.fullName) return -1
        if(a.fullName > b.fullName) return 1
        return 0

      }.bind(this))

  	}

  	removeMember( memberId ){

  		this.members.forEach( function( member, index ){

  			if( member.id === memberId ){
  				this.members.splice( index, 1 )
  			}

  		}.bind(this))

  	}

  }

  class Post{

  	//Si se recibe un apiPost, se crea un objeto. Si no, se creara el post en el api con la info recibida
  	constructor( app, apiPost, info ){

  		this.app = app
  		this.apiPost = apiPost

  		this.comments = {}
  		this.fsnodes = []
  		this.promise 

  		this.readyToInsert = false
  		if( this.apiPost.fsnode.length == 0 ){
  			this.readyToInsert = true
  		}

  		this.commentsLoaded = false

  		this._loadComments()
  		this._addToQueue()
  		//this._loadFsnodes()

  	}

  	_addToQueue(){

  		this.app.postsToLoad.push( this )

  		if( this.app.postsToLoad.length && !this.app.started ){
  			this.app.started = true
  			this.app.lazyLoadFSNodes()
  		}

  	}

  	_loadComments(){

			this.apiPost.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( error , replies ){

				this.commentsLoaded = true

				if( error ){
					return console.error( error )
				}

				replies.forEach( function( reply ){
					this.comments[ reply.id ] = new Comment( this.app, reply )
				}.bind(this))

				if( this.app.openedWorld && this.app.openedWorld.apiWorld.id == this.apiPost.worldId ){
					this.app.view.updatePostComments( this )
				}

			}.bind(this))

  	}

  	loadPostFsnodes( callback ){

  		async.map( this.apiPost.fsnode, function( fsnodeId, cb ){

		    api.fs( fsnodeId , function( error , fsnode ){

		    	if( error ){
		    		console.log( fsnodeId, error )
		    		return cb(error, null);
		    	}

		      return cb(null, fsnode)

		    }.bind(this));

		  }, function( error, finishedList ){

		  	this.readyToInsert = true
		  	this.fsnodes = finishedList
		  	return callback( this )

		  }.bind(this))

  	}

  	/*getPostReadyToInsert( callback ){

  		if( this.readyToInsert || !this.apiPost.fsnode.length ){
  			callback(this)
  		}else{

  			this._loadFsnodes()
  			$.when( this.promise ).done( function( message ){
  				callback(this)
  			}.bind(this))

  		}

  	}*/

  }

  class Comment{

  	constructor( app, apiComment ){

  		this.app = app

  		this.apiComment = apiComment
  		this.replies = {}

  		this.repliesLoaded = false

  		this._loadReplies()

  	}

  	_loadReplies(){

  		this.apiComment.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( error , replies ){

  			this.repliesLoaded = true

				if( error ){
					return console.error( error )
				}

				replies.forEach( function( reply ){
					this.replies[ reply.id ] = reply
				}.bind(this))

				/*if( this.app.openedWorld && this.app.openedWorld.apiWorld.id == this.apiPost.worldId ){
					this.app.view.updatePostComments( this )
				}*/

			}.bind(this))
  		
  	}

  }

  return new Model( view )

})( view )
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

      this.dom.on( 'click', function( event ){

        if( !$( event.target ).hasClass( 'popup' ) && ! $( event.target ).hasClass( 'popup-launcher' ) ){

          $( '.popup' ).removeClass( 'popup' );
          $( this ).parent().find( '.comments-footer .attach-select' ).hide();

        }

      })

    	this.dom.on( 'click' , '.category-list .world' , function(){
    		model.openWorld( parseInt( $(this).attr( 'data-id' ) ) )
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
          model.createWorld( $( '.new-world-name input' ).val() )
        }

      })

      this.dom.on( 'click', '.create-world-button.step-b', function(){

        var worldApi = $( '.new-world-container' ).data( 'world' )
        var isPrivate

        if( api.system.user().user.indexOf('demo') === 0 ){
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
            changeMobileView('worldSidebar');
            mobileNewWorld.stop().clearQueue().transition({
              'transform' : 'translateY(-100%)'
            }, 300, function(){
              mobileNewWorld.addClass('hide');
            });
          }*/

        })

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

      this.dom.on( 'click', '.open-chat-button', function(){
        model.openWorldChat()
      })

      this.dom.on( 'click', '.privacy-options .option', function(){

        $( '.privacy-options .option' ).removeClass( 'active' )
        $( this ).addClass( 'active' )

      })

      this.dom.on( 'click', '.comments-footer .send-button', function(){

        var post = $( this ).parent().parent().parent().data( 'post' )
        var message = $( this ).parent().parent().parent().find( '.comments-footer .comment-input' ).val()

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
              navigator.notification.alert( '', function(){},lang.notAllowedDeletePost );
            }
          });

        }else{*/

          confirm( confirmText , function( ok ){

            if( ok ){

              model.removeComment( post )
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
              navigator.notification.alert( '', function(){},lang.notAllowedDeletePost );
            }
          });

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

        if ( $(this).scrollTop() > 60 ) {
          $( '.world-header-min' ).addClass( 'active' )
        }else{
          $( '.world-header-min' ).removeClass( 'active' )
        }

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
        $( '.new-world-container' ).data( 'world' , world )
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
        model.removePostFront( postId, world )
      })

      // END OF COSMOS EVENTS

    }

	}

	return new Controller( model, view )

})( model, view )