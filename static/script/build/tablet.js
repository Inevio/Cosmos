
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

  		this.isMobile = this.view.dom.hasClass( 'wz-mobile-view' )

		  this.changeMainAreaMode( MAINAREA_NULL )
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
		      this.changeSidebarMode( SIDEBAR_CONVERSATIONS )

		    }

		  }.bind( this ))

		  return this

		}

  }

  class World{

  	//Si se recibe un mundo, se crea un objeto. Si no, se creara el mundo en el api con la info recibida
  	constructor( app, world, info ){

  		this.app = app
		  this.posts = {}
		  this.members = [] //Miembros que son contactos
		  this.moreMembers = [] //Miembros que no son contactos
		  this.admins = []
		  this.folder
		  this.conversation

  		if( world ){

  			this.worldId = world.id
			  this.name = world.name
			  this.icon = world.icon

  		}else{

  			this._createWorld( info )

  		}

  		this.loadMoreInfo()

  	}

  }

  class Post{

  	//Si se recibe un apiPost, se crea un objeto. Si no, se creara el post en el api con la info recibida
  	constructor( app, apiPost, info ){

  		this.app = app

  		this.title
  		this.description
  		this.creator
  		this.date 
  		this.attachments = []

  		this.loadMoreInfo()

  	}

  }

  class Comment{

  	constructor( app, apiPost, info ){

  		this.app = app

  		this.text
  		this.date
  		this.creator
  		this.parent
  		this.isReply

  		this.loadMoreInfo()

  	}

  }

  return new Model( view )

})( view )
