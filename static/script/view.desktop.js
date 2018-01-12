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

var view = ( function(){

	const colors = [ '#4fb0c6' , '#d09e88' , '#b44b9f' , '#1664a5' , '#e13d35', '#ebab10', '#128a54' , '#6742aa', '#fc913a' , '#58c9b9' ]

	class View{

		constructor(){

			this.dom = win

			this.isMobile = this.dom.hasClass( 'wz-mobile-view' )

			this.myContactID = api.system.user().id
			this._domWorldsPrivateList 		= $( '.private-list' )
			this._domWorldsPublicList 		= $( '.public-list' )
			this._domPostContainer 				= $( '.cards-list' )
			this._worldPrototype      		= $( '.sidebar .world.wz-prototype' )
			this._noPosts									= $( '.cards-list .no-posts' )

			this._genericCardPrototype 		= $( '.gen-card.wz-prototype' )
			this._documentCardPrototype 	= $( '.doc-card.wz-prototype' );
			this._youtubeCardPrototype  	= $( '.you-card.wz-prototype' );

			this._translateInterface()

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
	    card.find( '.time-text' ).text( this.timeElapsed( new Date( post.apiPost.created ) ) )

	    /*if (!isMobile()) {
	      setRepliesAsync( card , post.apiPost );
	    }else{
	      setRepliesAsyncWithoutAppendMobile( card , post.apiPost );
	    }
	    appendCard( card , post.apiPost );*/
	    
	    return callback( card )

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
	    card.find( '.time-text' ).text( this.timeElapsed( new Date( post.apiPost.created ) ) )
	    card.data( 'time' , post.apiPost.created )

	    /*if (!isMobile()) {
	      setRepliesAsync( card , post )
	    }else{
	      setRepliesAsyncWithoutAppendMobile( card , post );
	    }
	    appendCard( card , post );*/
	    return callback( card )

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

		  card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' )
		  card.find( '.card-user-name' ).text( user.fullName )
		  card.find( '.time-text' ).text( this.timeElapsed( new Date( post.apiPost.created ) ) )

		  /*if (!isMobile()) {
		    setRepliesAsync( card , post.apiPost );
		  }else{
		    setRepliesAsyncWithoutAppendMobile( card , post.apiPost );
		  }
		  appendCard( card , post.apiPost );*/

		  return callback( card )

		}

		appendYoutubeCard( post , user , reason, callback ){

		  var card = this._youtubeCardPrototype.clone();
		  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.apiPost.id ).addClass( 'cardDom' );

		  var youtubeCode = getYoutubeCode( post.apiPost.content );

		  /*if (isMobile()) {
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

		  /*if (!isMobile()) {
		    setRepliesAsync( card , post.apiPost );
		  }else{
		    setRepliesAsyncWithoutAppendMobile( card , post.apiPost );
		  }
		  appendCard( card , post.apiPost );*/

		  return callback( card )

		}

		getYoutubeCode( text ){

		  var youtubeId = false;
		  text.split(' ').forEach( function( word ){

		    if ( word.startsWith( 'www.youtu' ) || word.startsWith( 'youtu' ) || word.startsWith( 'https://www.youtu' ) || word.startsWith( 'https://youtu' ) || word.startsWith( 'http://www.youtu' ) || word.startsWith( 'http://youtu' )) {

		      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		      var match = word.match(regExp);
		      youtubeId = (match&&match[7].length==11)? match[7] : false;

		    }

		  });

		  return youtubeId;

		}

		appendPostList( list, interval ){

			var domList = []
			var postPromises = []

			if( list.length == 0 ){
				this._noPosts.css( 'opacity' , '1' );
				this._noPosts.show()
			}

  		list.forEach( function( post ){

  			var promise = $.Deferred()
	      postPromises.push( promise )

  			this.appendPost( post, promise , function( postDom ){

					domList.push( postDom )
  				promise.resolve()

  			})
		    
	    }.bind(this) )

	    $.when.apply( null, postPromises ).done( function(){

	    	if( domList.length ){

					this._domPostContainer.scrollTop(0)
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

		openWorld( world ){

			$( '.clean' ).remove()
		  $( '.category-list .world' ).removeClass( 'active' )
		  $( '.world-' + world.apiWorld.id ).addClass( 'active' )
		  $( '.search-post input, .mobile-world-content .search-bar input' ).val('')
		  $( '.world-title' ).text( world.apiWorld.name )
		  $( '.world-members-button' ).text( world.apiWorld.users + ' ' + lang.worldHeader.members )
		  $( '.world-avatar' ).css( 'background-image' , 'url(' + world.apiWorld.icons.normal + '?token=' + Date.now() + ')' )
		  $( '.select-world' ).hide()
		  $( '.cardDom' ).remove()

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

		updateWorldsListUI( worldList ){

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

		  	var world = $( '.sidebar .world.wz-prototype' ).clone();
				world.removeClass( 'wz-prototype' ).addClass( 'world-' + item.apiWorld.id ).addClass( 'worldDom' );
				world.find( '.world-name' ).text( item.apiWorld.name );

				if( item.apiWorld.owner === api.system.user().id ){
				  world.addClass( 'editable' )
				}

				world.find( '.world-icon' ).css( 'border-color' , colors[ item.apiWorld.id % colors.length ] );
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


		//Date functions

		getStringHour( date ){

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

		timeElapsed( lastTime ){

		  var now = new Date();
		  var last = new Date( lastTime );
		  var message;
		  var calculated = false;

		  if( now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth() ){

		    if( now.getDate() === last.getDate() ){

		      message = this.getStringHour( lastTime );
		      calculated = true;

		    }else if( new Date ( now.setDate( now.getDate() - 1 ) ).getDate() === last.getDate() ){

		      message = lang.lastDay + ' ' + lang.at + ' ' + this.getStringHour( lastTime );
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

		    message = day + '/' + month + '/' + last.getFullYear().toString().substring( 2 , 4 ) + ' ' + lang.at + ' ' + this.getStringHour( lastTime );
		    calculated = true;

		  }

		  return message;

		}


	}

	return new View()

})()
