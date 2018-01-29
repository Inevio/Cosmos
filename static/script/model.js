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

			var needToAppend = false
			if( this.openedWorld && this.openedWorld.apiWorld.id === post.worldId ){
				needToAppend = true
			}

			if( post.isReply ){

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

			}else{

				this.worlds[post.worldId].posts[ post.id ] = new Post( this, post )
				if( needToAppend ){
					this.showPosts( post.worldId , 0 )
				}

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

        	this.removeWorldFront( worldId )

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

			var contactsToShow = []
			for( var i in this.contacts ){

				if( !this.searchMember( this.contacts[i].id, this.openedWorld.members ) ){
					contactsToShow.push( this.contacts[i] )
				}

			}

			view.openInviteMembers( contactsToShow, this.openedWorld.apiWorld.name )

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

		searchMember( idToSearch, array ){

			if( !idToSearch || !array.length ){
				return false
			}

			array.forEach( function( element, index ){

				if( element.id === idToSearch ){
					return true
				}

				if( index === array.length - 1 ){
					return false
				}

			})

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

		removeWorldFront( worldId ){

    	delete this.worlds[ worldId ]
    	this.updateWorldsListUI()

		}

		removeUserBack( userId ){

			if( !this.openedWorld ){
				return
			}

		  this.openedWorld.apiWorld.removeUser( userId, function( err ){

		    if (err) {
		      console.error(err);
		    }

		  });

		}

		removeUserFront( userId, world ){

			if( userId === this.myContactID ){

				if( this.openedWorld.apiWorld.id == world.id ){
					view.toggleSelectWorld()
				}

				this.removeWorldFront()

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

  	constructor( app, apiComment ){

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