
var model = (function (view) {
  class Model {
    constructor (view) {
      this.view = view
      this.openedWorld
      this.myContactID = api.system.workspace().idWorkspace

      this.contacts = {}
      this.worlds = {}
      this.notifications = {}
      this.restOfUsers = {}

      this.showingNotification = false // Usado para desactivar carga por scroll si estamos en notificacion

      this.postsToLoad = []
      this.started = false // started to load posts fsnodes
      this.postsPrinted = 0
      this.filterActive = ''

      this.showingWorlds
      this.loadingPublicWorlds = false

      this._mainAreaMode
      this._prevMainAreaMode = MAINAREA_NULL

      this.apiFsCalls = 0

      this.isMobile = this.view.dom.hasClass('wz-mobile-view')

      // this.changeMainAreaMode( MAINAREA_NULL )
      this.fullLoad()
      this.updateNotificationIcon()
    }

    _compareTitle (query, title) {
      return (title.toLowerCase().indexOf(query) !== -1)
    }

    _loadFullContactList (callback) {
      callback = api.tool.secureCallback(callback)

      api.user.friendList(function (error, list) {
        if (error) {
          return this.view.launchAlert(error)
        }

        this.contacts = {}

        list.forEach(function (user) {
          api.user(user, function (error, userApi) {
            if (error) {
              return console.error
            }

            this.addContact(userApi)
          }.bind(this))
        }.bind(this))

        callback(null, list)
      }.bind(this))
    }

    _loadFullNotificationList (callback) {
      api.notification.list('cosmos', { 'includeUnattended': true }, function (error, notifications) {

        if (error) {
          return console.error(error)
        }

        if (notifications.length) {
          async.each(notifications, function (notification, checkEnd) {
            if (!notification.attended) {
              //console.log(notification)
            }

            if (!this.worlds[ notification.data.world ]) {
              return checkEnd()
            }

            this.notifications[ notification.id ] = notification
            this.notifications[ notification.id ].apiWorld = this.worlds[ notification.data.world ].apiWorld

            if (this.contacts[ notification.sender ]) {
              this.notifications[ notification.id ].apiSender = this.contacts[ notification.sender ]
              checkEnd()
            } else if (this.restOfUsers[ notification.sender ]) {
              this.notifications[ notification.id ].apiSender = this.restOfUsers[ notification.sender ]
              checkEnd()
            } else {
              api.user(notification.sender, function (error, user) {
                if (error) {
                  return console.error(error)
                }

                this.notifications[ notification.id ].apiSender = this.addToRestOfUsers(user)
                checkEnd()
              }.bind(this))
            }
          }.bind(this), function () {
            callback(null, notifications)
          })
        }
      }.bind(this))
    }

    _loadFullWorldsList (callback) {
      callback = api.tool.secureCallback(callback)

      api.cosmos.getUserWorlds(this.myContactID, {from: 0, to: 1000}, function (error, worlds) {
        if (error) {
          return this.view.launchAlert(error)
        }

        worlds.forEach(function (world, index) {
          this.addWorld(world)
        }.bind(this))

        callback(null, worlds)
      }.bind(this))
    }

    addContact (user) {
      if (this.contacts[ user.idWorkspace ]) {
        return this
      }

      this.contacts[ user.idWorkspace ] = user
      return this
    }

    addPost (post) {
      if (post.isReply) {
        this.addReplyFront(post)
      } else {
        this.worlds[post.worldId].posts[ post.id ] = new Post(this, post)
        if (this.openedWorld && this.openedWorld.apiWorld.id === post.worldId) {
          //this.showPosts(post.worldId, 0)
          this.view.prependPost(this.worlds[post.worldId].posts[ post.id ])
        }
        this.worlds[post.worldId].posts[ post.id ].loadPostFsnodes( function(updatedPost){
          this.updatePostFSNodes(updatedPost)
        }.bind(this))
      }
    }

    addReplyBack (post, message) {
      if (!this.openedWorld) {
        return
      }

      if (post.isReply) {
        if (!this.openedWorld.posts[ post.parent ] || !this.openedWorld.posts[ post.parent ].comments[ post.id ].apiComment) {
          return
        }

        this.openedWorld.posts[ post.parent ].comments[ post.id ].apiComment.reply({ content: message, notification: {} }, function (error, object) {
          if (error) {
            return console.error(error)
          }
        })
      } else {
        if (!this.openedWorld.posts[ post.id ] || !this.openedWorld.posts[ post.id ].apiPost) {
          return
        }

        this.openedWorld.posts[ post.id ].apiPost.reply({ content: message, notification: {} }, function (error, object) {
          if (error) {
            return console.error(error)
          }
        })
      }
    }

    addReplyFront (post) {
      var needToAppend = false
      if (this.openedWorld && this.openedWorld.apiWorld.id === post.worldId) {
        needToAppend = true
      }

      if (post.mainPost != post.parent) {
        this.worlds[ post.worldId ].posts[ post.mainPost ].comments[ post.parent ].replies[ post.id ] = post
        if (needToAppend) {
          this.view.updatePostComments(this.worlds[ post.worldId ].posts[ post.mainPost ])
        }
      } else {
        this.worlds[ post.worldId ].posts[ post.parent ].comments[ post.id ] = new Comment(this, post)
        if (needToAppend) {
          this.view.updatePostComments(this.worlds[ post.worldId ].posts[ post.parent ])
        }
      }
    }

    addToRestOfUsers (user) {
      if (this.restOfUsers[ user.idWorkspace ]) {
        return this.restOfUsers[ user.idWorkspace ]
      }

      this.restOfUsers[ user.idWorkspace ] = user
      return this.restOfUsers[ user.idWorkspace ]
    }

    addUserFront (idWorkspace, world) {
      if (idWorkspace === this.myContactID) {
        /* if( this.openedWorld.apiWorld.id == world.id ){
          view.toggleSelectWorld()
        } */

        this.addWorld(world)
      } else {
        this.worlds[ world.id ].apiWorld = world
        this.worlds[ world.id ].addMember(idWorkspace)
        this.view.closeInviteMembers()

        if (this.openedWorld && this.openedWorld.apiWorld.id === world.id) {
          this.openedWorld = this.worlds[ world.id ]
          this.view.openWorld(this.worlds[ world.id ], true)
        }
      }
    }

    addWorld (world, justCreated) {
      if (this.worlds[ world.id ]) {
        return this
      }

      if (!Object.keys(this.worlds).length) {
        this.view.hideNoWorlds()
      }

      this.worlds[ world.id ] = new World(this, world)
      this.updateWorldsListUI()

      if (justCreated) {
        this.openWorld(world.id, false)
      }

      return this
    }

    appendPublicWorldsAsync () {
      console.log('append', this.loadingPublicWorlds)
      if (this.loadingPublicWorlds) {
        return
      }

      this.loadingPublicWorlds = true

      if (!this.showingWorlds) {
        this.showingWorlds = { 'from': 0, 'to': 20 }
      } else {
        this.showingWorlds = { 'from': this.showingWorlds.to + 1, 'to': this.showingWorlds.to + 21 }
      }

      api.cosmos.list(null, null, this.showingWorlds, function (error, worlds, nResults) {
        if (error) {
          return console.error(error)
        }

        /* if( options.page === 1 ){

          this.totalPages = Math.ceil( nResults / 20 )
          this.actualPageInterval = 1
          //addPages()

        } */

        if (!worlds.length) {
          this.allPublicWorldsLoaded = true
          return
        }

        worlds.forEach(function (world, index) {
          var following = false
          if (this.worlds[world.id]) {
            following = true
          }
          view.appendWorldCard(world, following, this.showingWorlds.from !== 0)

          if (index === worlds.length - 1) {
            setTimeout(function () {
              this.loadingPublicWorlds = false
            }.bind(this), 3000)

            if (this.showingWorlds.from == 0) {
              this.view.animateCards()
            }
          }
        }.bind(this))
      }.bind(this))
    }

    checkMetadata (content, fsnode) {
      var newMetadata

      if (fsnode.length > 0) {
        if (fsnode.length === 1) {
          newMetadata = { fileType: this.checkTypePost(fsnode[0]) }
        } else {
          newMetadata = { fileType: 'generic' }
        }
      } else if (content.indexOf('www.youtube') !== -1) {
        newMetadata = { linkType: 'youtube' }
      } else {
        newMetadata = null
      }
      return newMetadata
    }

    checkTypePost (fsnode) {
      var fileType = 'generic';
      if (fsnode.mime) {
          fileType = this.guessType(fsnode.mime);
      }

      return fileType;
    }

    createWorld (worldName) {
      if (!worldName) {
        var dialog = api.dialog()

        dialog.setText(lang.worldTitleMandatory)
        dialog.setButton(0, lang.accept, 'red')
        dialog.render()

        return
      }

      api.cosmos.create(worldName, null, true, null, function (error, world) {
        if (error) {
          return console.error(error)
        }

        // this.addWorld( world )
        this.view.newWorldStep()
        // createChat( o )
      }.bind(this))
    }

    editWorld (world, isPrivate, name, description) {
      if (!this.worlds[ world.id ]) {
        return
      }

      world.isPrivate = isPrivate
      world.description = description
      world.name = name

      world.set(world, function (error, editedWorld) {
        if (error) {
          return error
        }
        console.log(editedWorld)
      })
    }

    followWorld (world) {
      if (api.system.workspace().username.indexOf('demo') === 0 && !world.isPrivate) {
        alert(lang.noPublicWorlds)
        return
      }

      world.addUser(this.myContactID, function (error, o) {
        if (error) {
          return console.error(error)
        }

        this.addWorld(world)
        this.view.updateWorldCard(world.id, true)
      }.bind(this))
    }

    fullLoad () {
      async.parallel({

        contacts: this._loadFullContactList.bind(this),
        worlds: this._loadFullWorldsList.bind(this)

      }, function (err, res) {
        if (err) {
          return this.view.launchAlert(err)
        }

        if (!res.worlds.length) {
          // Show no worlds
          // this.changeSidebarMode( SIDEBAR_CONVERSATIONS )
          this.view.showNoWorlds()
        }

        this._loadFullNotificationList(function (error, notifications) {
          if (notifications) {
            var notificationList = Object.values(this.notifications).reverse()
            this.view.updateNotificationsList(notificationList)
            //console.log(this.notifications)
            this.updateNotificationIcon()
          }
        }.bind(this))

        //console.log(this.worlds)
        // this.loadFSNodes()
      }.bind(this))

      return this
    }

    fastLoadFSNodes (post) {
      if (!post.readyToInsert) {
        post.loadPostFsnodes(function (updatedPost) {
          this.updatePostFSNodes(updatedPost)
        }.bind(this))
      }
    }

    guessType (mime) {
      return TYPES[mime] || 'generic';
    }

    inviteUsers (users) {
      // inviteUsers()

      if (!this.openedWorld || !users.length) {
        return
      }

      users.forEach(function (userDom, index) {
        var user = $(userDom).data('user')

        this.openedWorld.apiWorld.addUser(user.idWorkspace, function (error, o) {
          if (error) {
            console.error(error)
          }
        })
      }.bind(this))
    }

    isYoutubePost (text) {
      var isYoutube = false
      text.split(' ').forEach(function (word) {
        word.split('\n').forEach(function (word) {
          if (word.startsWith('www.youtu') || word.startsWith('youtu') || word.startsWith('https://www.youtu') || word.startsWith('https://youtu') || word.startsWith('http://www.youtu') || word.startsWith('http://youtu')) {
            isYoutube = true
          }
        })
      })
      return isYoutube
    }

    lazyLoadFSNodes () {
      // console.log( this.postsToLoad )

      if (this.postsToLoad.length) {
        var post = this.postsToLoad.pop()

        if (post.readyToInsert) {
          this.updatePostFSNodes(post)
          this.lazyLoadFSNodes()
          return
        }

        post.loadPostFsnodes(function (updatedPost) {
          this.updatePostFSNodes(updatedPost)

          setTimeout(function () {
            this.lazyLoadFSNodes()
          }.bind(this), 70)
        }.bind(this))
      }
    }

    leaveWorld (worldId) {
      if (!this.worlds[worldId]) {
        return
      }

      this.worlds[worldId].apiWorld.removeUser(this.myContactID, function (error, o) {
        if (error) {
          console.error(error)
        } else {

          // this.removeWorldFront( worldId )

          /* wql.deleteLastRead( [ world.id , myContactID ] , function( err ){
            if (err) {
              console.error(err)
            }
          }) */

        }
      })
    }

    loadMorePosts () {
      if (!this.showingNotification) {
        if (this.openedWorld && !this.openedWorld.loadingPosts) {
          this.openedWorld._getNextPosts()
        }
      }
    }

    notificationAdd (notificationUpdated) {
      this.notifications[ notificationUpdated.id ] = notificationUpdated
      var notificationList = Object.values(this.notifications).reverse()
      this.view.updateNotificationsList(notificationList)
      this.updateNotificationIcon()
    }

    notificationAttendedFront (notificationList) {
      if (!notificationList.length) {
        return
      }

      this.updateNotificationIcon()

      notificationList.forEach(function (notification) {
        if (!this.notifications[ notification ]) {
          return
        }

        // this.notifications[ notification.id ]
        this.view.updateNotificationStatus(notification, true)
        this.updateNotificationIcon()
      }.bind(this))
    }

    notificationAttendedBack (notificationId) {
      if (!this.notifications[ notificationId ]) {
        return
      }

      api.notification.markAsAttended('cosmos', notificationId, function (error) {
        if (error) {
          return console.error(error)
        }
      })
    }

    notificationOpen (notification) {
      var notificationData = notification.data

      if (!this.worlds[ notificationData.world ]) {
        return
      }

      if (notificationData.type === 'addedToWorld') {
        this.notificationAttendedBack(notification.id)
        return this.openWorld(notificationData.world)
      } else {
        var mainPostId = null
        if (notificationData.mainPost != notificationData.parent) {
          // Es una respuesta
          mainPostId = notificationData.mainPost
        } else {
          if (notificationData.parent) {
            // Es un comentario
            mainPostId = notificationData.parent
          } else {
            // Es un post
            mainPostId = notificationData.post
          }
        }
      }

      if (this.worlds[ notificationData.world ].posts[ mainPostId ]) {
        this.openWorld(notificationData.world, true)
        this.view.showNotificationPost(this.worlds[ notificationData.world ].posts[ mainPostId ], notificationData)
        this.fastLoadFSNodes(this.worlds[ notificationData.world ].posts[ mainPostId ])
        this.notificationAttendedBack(notification.id)
      } else {
        this.worlds[ notificationData.world ].apiWorld.getPost(mainPostId, { withFullUsers: true }, function (error, post) {
          if (error) {
            return console.error(error)
          }
          var postToShow = new Post(this, post)
          this.openWorld(notificationData.world, true)
          this.view.showNotificationPost(postToShow, notificationData)
          this.fastLoadFSNodes(postToShow)
          this.notificationAttendedBack(notification.id)
        }.bind(this))
      }
    }

    notificationMarkAllAsAttended () {
      var notifications = Object.values(this.notifications)

      notifications.forEach(function (notification) {
        if (!notification.attended) {
          api.notification.markAsAttended('cosmos', notification.id, function (error) {
            if (error) {
              console.error(error)
            }
          })
        }
      })
    }

    notificationNew (notification) {
      if (!notification || this.notifications[ notification.id ]) {
        return
      }

      if (this.worlds[ notification.data.world ]) {
        notification.apiWorld = this.worlds[ notification.data.world ].apiWorld
      }

      if (this.contacts[ notification.sender ]) {
        notification.apiSender = this.contacts[ notification.sender ]
        this.notificationAdd(notification)
      } else if (this.restOfUsers[ notification.sender ]) {
        notification.apiSender = this.restOfUsers[ notification.sender ]
        this.notificationAdd(notification)
      } else {
        api.user(notification.sender, function (error, user) {
          if (error) {
            return console.error(error)
          }

          notification.apiSender = this.addToRestOfUsers(user)
          this.notificationAdd(notification)
        }.bind(this))
      }
    }

    openExploreWorlds () {
      this.showingWorlds = null // nullify
      this.publicWorldsList = []
      this.allPublicWorldsLoaded = false
      view.openExploreWorlds()
      this.appendPublicWorldsAsync()
    }

    openFile (fsnode) {
      if (typeof fsnode === 'undefined') {
        return
      }

      fsnode.open()
    }

    openFolder () {
      if (!this.openedWorld) {
        return
      }

      api.fs(this.openedWorld.apiWorld.volume, function (error, folder) {
        folder.open()
      })
    }

    openInviteByMail () {
      if (!this.openedWorld) {
        return
      }

      api.app.createView(this.openedWorld.apiWorld.id, 'inviteByMail')
    }

    openInviteMembers () {
      if (!this.openedWorld) {
        return
      }

      this.searchMember(this.openedWorld.members, function (contactsToShow) {
        view.openInviteMembers(contactsToShow, this.openedWorld.apiWorld.name)
      }.bind(this))
    }

    openMembers () {
      if (!this.openedWorld) {
        return
      }

      view.openMembers(this.openedWorld)
    }

    openNewPost () {
      if (!this.openedWorld) {
        return
      }

      view.openNewPost(this.openedWorld.apiWorld)
    }

    openWorld (worldId, notificationOpen) {
      // app.addClass( 'selectingWorld' )
      if (!worldId && this.openedWorld) {
        worldId = this.openedWorld.apiWorld.id
      }

      if (!this.worlds[ worldId ]) {
        return console.error('Error al abrir mundo')
      }

      if (this.openedWorld && this.openedWorld.apiWorld.id === worldId && notificationOpen === this.showingNotification) {
        return
      }

      this.openedWorld = this.worlds[ worldId ]
      this.view.openWorld(this.worlds[ worldId ])

      if (!notificationOpen) {
        this.showingNotification = false
        this.view.hideNotificationMode()
        this.showPosts(worldId, 0)
      } else {
        this.showingNotification = true
        this.view.showNotificationMode()
      }
    }

    openWorldChat () {
      if (!this.openedWorld) {
        return
      }

      api.app.openApp(14, [ 'open-world-chat', { 'world': this.openedWorld.apiWorld }, function (o) {
        console.log(o)
      }])
    }

    removePostBack (post) {
      if (!this.openedWorld) {
        return
      }

      this.openedWorld.apiWorld.removePost(post.id, function (error, ok) {
        if (error) {
          return console.error(error)
        }
      })
    }

    removePostFront (post, world) {
      if (!this.worlds[ world.id ]) {
        return
      }

      var needToRemove = false
      if (this.openedWorld && this.openedWorld.apiWorld.id === world.id) {
        needToRemove = true
      }

      if (post.isReply) {
        if (post.mainPost != post.parent) {
          delete this.worlds[ world.id ].posts[ post.mainPost ].comments[ post.parent ].replies[ post.id ]

          if (needToRemove) {
            this.view.removeReply(post)
            this.view.updatePostComments(this.worlds[ world.id ].posts[ post.mainPost ])
          }
        } else {
          delete this.worlds[ world.id ].posts[ post.mainPost ].comments[ post.id ]
          if (needToRemove) {
            this.view.removeComment(post)
            this.view.updatePostComments(this.worlds[ world.id ].posts[ post.parent ])
          }
        }
      } else {
        delete this.worlds[ world.id ].posts[ post.id ]
        if (needToRemove) {
          this.view.removePost(post)
        }
      }
    }

    removeWorldBack () {
      if (!this.openedWorld) {
        return
      }

      this.leaveWorld(this.openedWorld.apiWorld.id)
    }

    removeWorldFront (worldId) {
      delete this.worlds[ worldId ]
      this.updateWorldsListUI()
    }

    removeUserBack (idWorkspace) {
      if (!this.openedWorld) {
        return
      }

      this.openedWorld.apiWorld.removeUser(idWorkspace, function (err) {
        if (err) {
          console.error(err)
        }
      })
    }

    removeUserFront (idWorkspace, world) {
      if (idWorkspace === this.myContactID) {
        if (this.openedWorld.apiWorld.id == world.id) {
          view.toggleSelectWorld(true)
          view.newWorldAnimationOut()
        }

        this.removeWorldFront(world.id)
      } else {
        this.worlds[ world.id ].apiWorld = world
        this.worlds[ world.id ].removeMember(idWorkspace)
        this.view.closeMembers()

        if (this.openedWorld && this.openedWorld.apiWorld.id === world.id) {
          this.openedWorld = this.worlds[ world.id ]
          this.view.openWorld(this.worlds[ world.id ], true)
        }
      }
    }

    searchMember (members, callback) {
      if (!members) {
        return callback(false)
      }

      var listToShow = JSON.parse(JSON.stringify(this.contacts))

      for (var j = 0; j < members.length; j++) {
        if (this.contacts[ members[j].id ]) {
          delete listToShow[ members[j].id ]
        }

        if (j === members.length - 1) {
          return callback(Object.values(listToShow))
        }
      }
    }

    searchLocalPost (query) {
      if (!this.openedWorld || (Object.keys(this.openedWorld.posts).length === 0 && this.openedWorld.posts.constructor === Object)) {
        return
      }

      if (!query) {
        return this.view.filterPosts(null)
      }

      var postsToShow = []

      var posts = Object.values(this.openedWorld.posts)

      posts.forEach(function (post, index) {
        if (this._compareTitle(query, post.apiPost.title)) {
          postsToShow.push(post.apiPost.id)
        }

        if (index == posts.length - 1) {
          return this.view.filterPosts(postsToShow)
        }
      }.bind(this))
    }

    showPosts (worldId, start) {
      if (!start) {
        start = 0
      }

      var list = []
      var id = null
      var postsKeys = Object.keys(this.worlds[ worldId ].posts).reverse()

      /* postsKeys.forEach( function( postKey ){

        list.push( this.worlds[ worldId ].posts[ postKey ] )
        if( this.worlds[ worldId ].posts[ postKey ].readyToInsert == false ){
          this.fastLoadFSNodes( this.worlds[ worldId ].posts[ postKey ] )
        }

      }.bind(this)) */

      if (start > postsKeys.length) {
        return
      }
      var end = start

      start + 5 < postsKeys.length ? end = start + 5 : end = postsKeys.length

      for (var i = start; i < end; i++) {
        list.push(this.worlds[ worldId ].posts[ postsKeys[i] ])
        if (this.worlds[ worldId ].posts[ postsKeys[i] ].readyToInsert == false) {
          this.fastLoadFSNodes(this.worlds[ worldId ].posts[ postsKeys[i] ])
        }
      }

      this.postsPrinted = end
      this.view.appendPostList(list, start > 0)
    }

    updateNotificationIcon () {
      api.notification.count('cosmos', function (error, notifications) {
        if (error) {
          return console.error(error)
        }

        if (notifications) {
          this.view.updateNotificationIcon(true)
        } else {
          this.view.updateNotificationIcon(false)
        }
      }.bind(this))
    }

    updatePost (post) {
      var world = this.worlds[ post.worldId ]
      var needToRefresh = false

      if (!world) {
        return
      }

      if (this.openedWorld && this.openedWorld.apiWorld.id === post.worldId) {
        needToRefresh = true
      }

      if (post.isReply) {
        if (post.parent === post.mainPost) {
          world.posts[ post.mainPost ].comments[ post.id ].apiComment = post
          if (needToRefresh) {
            view.updatePostComment(post)
          }
        } else {
          world.posts[ post.mainPost ].comments[ post.parent ].replies[ post.id ] = post
          if (needToRefresh) {
            view.updatePostReply(post)
          }
        }
      } else {

        console.log(world.posts[ post.id ].apiPost.metadata.fileType,post.metadata.fileType)
        var changePostType = world.posts[ post.id ].apiPost.metadata.fileType !== post.metadata.fileType

        world.posts[ post.id ].apiPost = post
        world.posts[ post.id ].loadPostFsnodes(function (modelPost) {
          if (needToRefresh) {
            view.updatePost(modelPost, changePostType)
            //view.updatePostFSNodes(modelPost,changePostType)
          }
        })
      }
    }

    updatePostFSNodes (post) {
      var world = this.worlds[ post.apiPost.worldId ]

      if (!world && !world.posts[ post.apiPost.id ]) {
        return
      }

      world.posts[ post.apiPost.id ] = post

      if (this.openedWorld && this.openedWorld.apiWorld.id == world.apiWorld.id) {
        this.view.updatePostFSNodes(post)
      }
    }

    updateWorld (world) {
      if (!this.worlds[ world.id ]) {
        return
      }

      this.worlds[ world.id ].apiWorld = world
      this.updateWorldsListUI()
      if (this.openedWorld && this.openedWorld.apiWorld.id === world.id) {
        this.view.openWorld(this.worlds[ world.id ])
      }
    }

    updateWorldsListUI () {
      var list = []
      var id = null

      for (var i in this.worlds) {
        list.push(this.worlds[ i ])
      }

      if (this.openedWorld) {
        id = this.openedWorld.apiWorld.id
      }

      this.view.updateWorldsListUI(list, id)
    }
  }

  class World {
    // Si se recibe un mundo, se crea un objeto. Si no, se creara el mundo en el api con la info recibida
    constructor (app, world, info) {
      this.app = app
      this.posts = {}
      this.members = []
      this.folder
      this.conversation
      this.lastPostLoaded
      this.loadingPosts = false

      if (world) {
        this.icon = world.icons.big
        this.apiWorld = world
      }

      this._loadMembers()
      this._getPosts(0, 10)
    }

    _addMember (member) {
      if (!member) {
        return
      }

      this.members.push(member)

      if (this.members.length === this.apiWorld.users) {
        this._sortMembers()
      }
    }

    _getNextPosts () {
      if (this.app.postsPrinted < this.lastPostLoaded) {
        this.app.showPosts(this.apiWorld.id, this.app.postsPrinted)
      } else {
        this._getPosts(this.lastPostLoaded, this.lastPostLoaded + 5)
      }
    }

    _getPosts (init, end) {
      this.lastPostLoaded = init
      this.loadingPosts = true

      this.apiWorld.getPosts({from: init, to: end, withFullUsers: true }, function (error, posts) {
        if (error) {
          return console.error(error)
        }

        this.lastPostLoaded = end
        this.loadingPosts = false

        posts.forEach(function (post, index) {
          this.posts[ post.id ] = new Post(this.app, post)
          if (index === posts.length - 1 && init !== 0) {
            this.app.showPosts(this.apiWorld.id, init)
          }
        }.bind(this))
      }.bind(this))
    }

    _loadMembers () {
      if (!this.apiWorld) {
        return
      }

      this.apiWorld.getUsers(function (error, members) {
        if (error) {
          // return this.app.view.launchAlert( error )
        }

        members.forEach(function (member) {
          if (this.app.contacts[ member.idWorkspace ]) {
            this._addMember(this.app.contacts[ member.idWorkspace ])
          } else {
            api.user(member.idWorkspace, function (err, user) {
              if (error) {
                return console.error(error)
              }
              this._addMember(user, member.idWorkspace)
            }.bind(this))
          }
        }.bind(this))
      }.bind(this))
    }

    _sortMembers () {
      this.members.sort(function (a, b) {
        if (a.fullName < b.fullName) return -1
        if (a.fullName > b.fullName) return 1
        return 0
      })
    }

    addMember (idWorkspace) {
      api.user(idWorkspace, function (error, user) {
        if (error) {
          return console.error(error)
        }

        this.members.push(user)
      }.bind(this))
    }

    removeMember (memberId) {
      this.members.forEach(function (member, index) {
        if (member.id === memberId) {
          this.members.splice(index, 1)
        }
      }.bind(this))
    }
  }

  class Post {
    // Si se recibe un apiPost, se crea un objeto. Si no, se creara el post en el api con la info recibida
    constructor (app, apiPost, info) {
      this.app = app
      this.apiPost = apiPost

      this.comments = {}
      this.fsnodes = []
      this.promise

      this.readyToInsert = false
      if (this.apiPost.fsnode.length == 0) {
        this.readyToInsert = true
      }

      this.commentsLoaded = false

      this._loadComments()
      this._addToQueue()
      // this._loadFsnodes()
    }

    _addToQueue () {
      this.app.postsToLoad.push(this)

      if (this.app.postsToLoad.length && !this.app.started) {
        this.app.started = true
        this.app.lazyLoadFSNodes()
      }
    }

    _loadComments () {
      this.apiPost.getReplies({ from: 0, to: 1000, withFullUsers: true }, function (error, replies) {
        this.commentsLoaded = true

        if (error) {
          return console.error(error)
        }

        replies.forEach(function (reply) {
          this.comments[ reply.id ] = new Comment(this.app, reply)
        }.bind(this))

        if (this.app.openedWorld && this.app.openedWorld.apiWorld.id == this.apiPost.worldId) {
          this.app.view.updatePostComments(this)
        }
      }.bind(this))
    }

    loadPostFsnodes (callback) {
      async.map(this.apiPost.fsnode, function (fsnodeId, cb) {
        api.fs(fsnodeId, function (error, fsnode) {
          if (error) {
            //console.log(fsnodeId, error)
            return cb(error, null)
          }

          return cb(null, fsnode)
        })
      }, function (error, finishedList) {
        this.readyToInsert = true
        this.fsnodes = finishedList
        return callback(this)
      }.bind(this))
    }
  }

  class Comment {
    constructor (app, apiComment) {
      this.app = app

      this.apiComment = apiComment
      this.replies = {}

      this.repliesLoaded = false

      this._loadReplies()
    }

    _loadReplies () {
      this.apiComment.getReplies({ from: 0, to: 1000, withFullUsers: true }, function (error, replies) {
        this.repliesLoaded = true

        if (error) {
          return console.error(error)
        }

        replies.forEach(function (reply) {
          this.replies[ reply.id ] = reply
          if (this.app.openedWorld && this.app.openedWorld.apiWorld.id == this.apiComment.worldId) {
            this.app.view.appendReplyComment(reply, null, true)
          }
        }.bind(this))
      }.bind(this))
    }
  }

  return new Model(view)
})(view)

