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

		loadMorePosts(){

			if( this.openedWorld && !this.openedWorld.loadingPosts ){
				this.openedWorld.getNextPosts()
			}
			
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

			start + 10 < postsKeys.length ? end = start + 10 : end = postsKeys.length

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

  	getNextPosts(){

  		if( this.app.postsPrinted < this.lastPostLoaded ){
  			this.app.showPosts( this.apiWorld.id , this.app.postsPrinted )
  		}else{
  			this._getPosts( this.lastPostLoaded, this.lastPostLoaded + 10 )
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

				if( error ){
					return console.error( error )
				}

				replies.forEach( function( reply ){
					this.comments[ reply.id ] = new Comment( this.app, reply )
				}.bind(this))

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