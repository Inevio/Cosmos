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

		appendGenericCard( post , reason , callback ){

		  var card = this._genericCardPrototype.clone()
		  var user = post.apiPost.authorObject
		  card.removeClass( 'wz-prototype' ).addClass( 'post-' + post.apiPost.id ).addClass( 'cardDom' )

		  /*var fsnodes = [];
		  post.fsnode.forEach(function( fsnode ){

		    var promise = $.Deferred();
		    fsnodes.push( promise );

		    api.fs( fsnode , function( e , fsnode ){
		      promise.resolve( e ? null: fsnode );
		    });

		  });*/

		  //$.when.apply( null, fsnodes ).done( function(){

		    //var fsnodes = arguments;

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
		        $(this).attr( 'href', 'http://' + $(this).attr('href') );
		      }

		    });

		    card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
		    card.find( '.card-user-name' ).text( user.fullName );
		    card.find( '.time-text' ).text( this.timeElapsed( new Date( post.apiPost.created ) ) );
		    card.data( 'time' , post.apiPost.created );

		    /*if (!isMobile()) {
		      setRepliesAsync( card , post )
		    }else{
		      setRepliesAsyncWithoutAppendMobile( card , post );
		    }
		    appendCard( card , post );*/
		    callback( card );

		  //}.bind(this));

		}

		appendPostList( list, interval ){

			var domList = []
			var postPromises = []

			if( list.length == 0 ){
				this._noPosts.css( 'opacity' , '1' );
				this._noPosts.show()
			}

  		list.forEach( function( post ){

  			if( post.apiPost && post.apiPost.metadata && post.apiPost.metadata.fileType == 'generic' ){

	  			var promise = $.Deferred()
	      	postPromises.push( promise )

  			}

  			this.appendPost( post, promise , function( postDom, promise ){

					domList.push( postDom )
  				promise.resolve()

  			})
		    
	    }.bind(this) )

	    $.when.apply( null, postPromises ).done( function(){

	    	if( domList.length ){

	 	    	this._noPosts.css( 'opacity' , '0' );
					this._noPosts.hide()
	      	this._domPostContainer.append( domList )
	      	//this._domPostContainer.scrollTop( this._domPostContainer[ 0 ].scrollHeight )

	    	}

    	}.bind(this));

		}

		appendPost( post, promise, callback ){

			//callback = api.tool.secureCallback()

      if( post.apiPost.metadata && post.apiPost.metadata.operation === 'remove' ){

        this.appendGenericCard( post , lang.postCreated , function( postDom ){
          return callback( postDom, promise )
        });

      }else if ( post.apiPost.metadata && post.apiPost.metadata.fileType ) {

        switch (post.apiPost.metadata.fileType) {

          case 'generic':
          this.appendGenericCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          });
          break;

          case 'document':
          /*this.appendDocumentCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          });*/
          break;

          case 'image':
          /*this.appendDocumentCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          });*/
          break;

          case 'video':
          this.appendGenericCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          });
          break;

          case 'music':
          this.appendGenericCard( post , lang.postCreated , function( postDom ){
            return callback( postDom, promise )
          });
          break;

        }

      }else if( post.apiPost.metadata && post.apiPost.metadata.linkType ){

        switch (post.apiPost.metadata.linkType) {

          case 'youtube':
          /*this.appendYoutubeCard( post , lang.postCreated );
          return callback( postDom, promise )*/
          break;

        }

      }else{
        /*this.appendNoFileCard( post , lang.postCreated );
        return callback( postDom, promise )*/
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

		  this._domWorldsPrivateList.empty().append( worldList.map( function( item ){ 

		  	var world = this._worldPrototype.clone();
				world.removeClass( 'wz-prototype' ).addClass( 'world-' + item.apiWorld.id ).addClass( 'worldDom' );
				world.find( '.world-name' ).text( item.apiWorld.name );

				if( item.apiWorld.owner === this.myContactID ){
				  world.addClass( 'editable' )
				}

				world.find( '.world-icon' ).css( 'border-color' , colors[ item.apiWorld.id % colors.length ] );
				world.attr( 'data-id', item.apiWorld.id )

		  	return world

		  }.bind(this)))


		  this._domWorldsPublicList.empty().append( publicWorlds.map( function( item ){ 

		  	var world = this._worldPrototype.clone();
				world.removeClass( 'wz-prototype' ).addClass( 'world-' + item.apiWorld.id ).addClass( 'worldDom' );
				world.find( '.world-name' ).text( item.apiWorld.name );

				if( item.apiWorld.owner === this.myContactID ){
				  world.addClass('editable')
				}

				world.find( '.world-icon' ).css( 'border-color' , colors[ item.apiWorld.id % colors.length ] );
				world.attr( 'data-id', item.apiWorld.id )

		  	return world

		  }.bind(this)))


		}
	}

	return new View()

})()

var model = ( function( view ){

	var async = {

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
	        list = step = callback = position = checkEnd = closed = null

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
	        result = list = step = callback = position = checkEnd = closed = null

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
	        list = callback = position = checkEnd = closed = null

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

	class Model{

  	constructor( view ){

  		this.view = view
  	  this.openedWorld
  	  this.myContactID = api.system.user().id
		  this.contacts = {}
		  this.worlds = {}
		  this._mainAreaMode
		  this._prevMainAreaMode = MAINAREA_NULL

		  this.apiFsCalls = 0

  		this.isMobile = this.view.dom.hasClass( 'wz-mobile-view' )

		  //this.changeMainAreaMode( MAINAREA_NULL )
  		this.fullLoad()

  	}

  	_loadFullContactList( callback ){

  		callback = api.tool.secureCallback( callback )

  		api.user.friendList( function( error, list ){

		    if( error ){
		    	return this.view.launchAlert( error )
		    }

		    this.contacts = {}

		    list.forEach( function( user ){
		      this.addContact( user )
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

		addWorld( world ){

		  if( this.worlds[ world.id ] ){
		    return this
		  }

		  this.worlds[ world.id ] = new World( this, world )
		  this.updateWorldsListUI()

		  return this

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

		    }

		    console.log(this.worlds)

		  }.bind( this ))

		  return this

		}

		leaveWorld( worldId ){

			

		}

		openWorld( worldId ){

		  //app.addClass( 'selectingWorld' );

		  if( !this.worlds[worldId] ){
		  	return console.error('Error al abrir mundo')
		  }

		  this.openedWorld = this.worlds[worldId];
		  this.view.openWorld( this.worlds[worldId] )

			var list = []
		  var id = null

		  for( var i in this.worlds[ worldId ].posts ){
		  	list.push( this.worlds[ worldId ].posts[ i ] )
		  }

		  var i = 0
		  async.map( list, function( post, callback ){

		  	post.getPostReadyToInsert( function( post ){
		  		//console.log( i++ )
		  		return callback( null, post )
		  	})

		  }, function( error, finishedList ){

		  	this.view.appendPostList( finishedList )

		  }.bind(this))

		    

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

  }

  class World{

  	//Si se recibe un mundo, se crea un objeto. Si no, se creara el mundo en el api con la info recibida
  	constructor( app, world, info ){

  		this.app = app
		  this.posts = {}
		  this.members = []
		  this.folder
		  this.conversation

  		if( world ){

			  this.icon = world.icons.big
			  this.apiWorld = world

  		}else{
  			this._createWorld( info )
  		}

  		this._loadMembers()
  		this._getPosts()

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

  	_getPosts(){

  		this.apiWorld.getPosts( {from: 0 , to: 10 , withFullUsers: true } , function( error , posts ){

  		 	if( error ){
  		 		return console.error( error )
  		 	}

				posts.forEach( function( post ){
					this.posts[ post.id ] = new Post( this.app, post )
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

  		this._loadComments()
  		this._loadFsnodes()

  	}

  	_loadComments(){

			this.apiPost.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( error , replies ){

				if( error ){
					return console.error( error )
				}

				replies.forEach( function( reply ){
					this.comments[ reply.id ] = new Comment( this.app, reply )
				}.bind(this))

			}.bind(this))

  	}

  	_loadFsnodes(){

  		this.promise = $.Deferred()

		  this.apiPost.fsnode.forEach(function( fsnode ){

		    api.fs( fsnode , function( error , fsnode ){

		    	console.log( this.app.apiFsCalls++ )
		    	if( error ){
		    		return console.error( error );
		    	}

		      this.fsnodes.push( fsnode );

		      if( this.fsnodes.length == this.apiPost.fsnode.length ){

						this.readyToInsert = true
						this.promise.resolve( null )

		      }

		    }.bind(this));

		  }.bind(this));

  	}

  	getPostReadyToInsert( callback ){

  		if( this.readyToInsert || !this.apiPost.fsnode.length ){
  			callback(this)
  		}else{

  			$.when( this.promise ).done( function( message ){
  				callback(this)
  			}.bind(this))

  		}

  	}

  }

  class Comment{

  	constructor( app, apiComment, info ){

  		this.app = app

  		this.apiComment = apiComment
  		this.replies = {}

  		this._loadReplies()

  	}

  	_loadReplies(){

  		this.apiComment.getReplies( { from : 0, to : 1000 , withFullUsers: true }, function( error , replies ){

				if( error ){
					return console.error( error )
				}

				replies.forEach( function( reply ){
					this.replies[ reply.id ] = reply
				}.bind(this))

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
			  category.toggleClass('closed');

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
			    	$(this).css('height', 'initial')
			    });

			  }

    	})

    	this.dom.on( 'click' , '.category-list .world' , function(){

    		model.openWorld( $(this).attr('data-id') )

    	})

      $('.world-selected').on('scroll', function(){

        if ( $(this).scrollTop() > 60 ) {
          $('.world-header-min').addClass('active')
        }else{
          $('.world-header-min').removeClass('active')
        }
        
      })

    }

	}

	return new Controller( model, view )

})( model, view )