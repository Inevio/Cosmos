var controller = (function (model, view) {
  class Controller {
    constructor (model, view) {
      this.dom = win
      /* this._domContactsList = $( '.contact-list', this.dom)
      this._domConversationsList = $( '.channel-list', this.dom)
      this._domMessageContainer = $( '.message-container', this.dom)
      this._domMessageMePrototype = $( '.message-me.wz-prototype', this._domMessageContainer)
      this._domMessageOtherPrototype = $( '.message-other.wz-prototype', this._domMessageContainer)
      this._domCurrentConversation */

      this._domWorldCategory = $('.category .opener, .category .category-name', this.dom)

      this.model = model
      this.view = view
      this._bindEvents()
    }

    _bindEvents () {

      this._domWorldCategory.on('click', function () {
        var category = $(this).parent()
        category.toggleClass('closed')

        if (category.hasClass('closed')) {
          category.find('.world-list').css('height', category.find('.world-list').css('height'))
          category.find('.world-list').transition({
            'height': '0px'
          }, 200)
        } else {
          var height = category.find('.world').length * $('.world.wz-prototype').outerHeight()
          category.find('.world-list').transition({
            'height': height
          }, 200, function () {
            $(this).css('height', 'initial')
          })
        }
      })

      this.dom.on('click', function (event) {
        if (!$(event.target).hasClass('popup') && !$(event.target).hasClass('popup-launcher')) {
          $('.popup').removeClass('popup')
          $(this).parent().find('.comments-footer .attach-select').hide()
        }
      })

      this.dom.on('click', '.category-list .world', function () {
        model.openWorld(parseInt($(this).attr('data-id')), false)
      })

      this.dom.on('click', '.open-folder-button', function () {
        model.openFolder()
      })

      this.dom.on('click', '.cardDom:not(.loading) .doc-preview', function () {
        var attachment = $(this)
        var fsnode = $(this).data('fsnode')
        var fsnodeList = []
        $.each(attachment.closest('.card').find('.doc-preview:not(.wz-prototype)'), function (i, attachment) {
          fsnodeList.push($(attachment).data('fsnode'))
        })

        fsnode.open(fsnodeList.filter(function (item) { return item.type === fsnode.type }).map(function (item) { return item.id }), function (error) {
          if (error) {
            fsnode.openLocal()
          }
        })
      })

      this.dom.on('click', '.comments-opener', function () {
        var card = $(this).parent().parent()
        view.toggleReplies(card)
      })

      this.dom.on('click', '.world-members-button', function () {
        model.openMembers()
      })

      /* World explore */

      this.dom.on('click', '.explore-button', function () {
        model.openExploreWorlds()
      })

      this.dom.on('click', '.close-explore', function () {
        view.closeExploreWorlds()
      })

      /* enf od world explore */

      this.dom.on('click', '.world-card.unfollowed .follow-button', function () {
        model.followWorld($(this).parent().data('world'))
      })

      this.dom.on('click', '.new-post-button, .no-post-new-post-button', function () {
        model.openNewPost()
      })

      this.dom.on('click', '.new-world-button, .new-world-button-mini', function () {
        view.openNewWorld()
      })

      this.dom.on('click', '.close-new-world', function () {
        view.closeNewWorld()
      })

      this.dom.on('click', '.create-world-button.step-a', function () {
        if ($('.new-world-name input').val()) {
          model.createWorld($('.new-world-name input').val())
        }
      })

      this.dom.on('click', '.create-world-button.step-b', function () {
        var worldApi = $('.new-world-container').data('world')
        var isPrivate

        if (api.system.workspace().username.indexOf('demo') === 0) {
          isPrivate = true
        } else {
          isPrivate = $('.private-option').hasClass('active')
        }

        var editing = $('.new-world-container').hasClass('editing')
        var name = worldApi.name
        $('.wz-groupicon-uploader-start').attr('data-groupid', worldApi.id)

        if (editing) {
          name = $('.new-world-name input').val()
        }
        var description = $('.new-world-desc textarea').val()

        model.editWorld(worldApi, isPrivate, name, description)
        view.newWorldAnimationOut()
      })

      this.dom.on('click', '.delete-world-button', function () {
        var dialog = api.dialog()

        dialog.setTitle(lang.unfollowWorld)
        dialog.setText(lang.confirmExit)

        dialog.setButton(0, wzLang.core.dialogCancel, 'black')
        dialog.setButton(1, wzLang.core.dialogAccept, 'red')

        dialog.render(function (ok) {
          if (!ok) {
            return
          }

          model.removeWorldBack()
          $('.new-world-container').removeClass('editing')
          // view.newWorldAnimationOut()

          /* if (isMobile()) {
            changeMobileView( 'worldSidebar' )
            mobileNewWorld.stop().clearQueue().transition({
              'transform' : 'translateY(-100%)'
            }, 300, function(){
              mobileNewWorld.addClass( 'hide' )
            })
          } */
        })
      })

      this.dom.on('click', '.close-kick-user', function () {
        view.closeMembers()
      })

      this.dom.on('click', '.kick-out-button', function () {
        model.removeUserBack($(this).parent().data('user').idWorkspace)
      })

      this.dom.on('click', '.invite-user-button', function () {
        model.openInviteMembers()
      })

      this.dom.on('click', '.cancel-invite-user, .close-invite-user', function () {
        view.closeInviteMembers()
      })

      this.dom.on('click', '.invite-user-container .friendDom', function () {
        $(this).find('.ui-checkbox').toggleClass('active')
      })

      this.dom.on('click', '.invite-user-container .friendDom .ui-checkbox', function (event) {
        $(this).toggleClass('active')
        event.stopPropagation()
      })

      this.dom.on('click', '.invite-user-container .invite-user', function () {
        var users = $('.friend .ui-checkbox.active').parent()
        model.inviteUsers($.makeArray(users))
      })

      this.dom.on('click', '.world-card-dom.followed', function () {
        $('.close-explore').click()
        model.openWorld($(this).data('world').id)
      })

      this.dom.on('click', '.open-chat-button', function () {
        model.openWorldChat()
      })

      this.dom.on('click', '.privacy-options .option', function () {
        $('.privacy-options .option').removeClass('active')
        $(this).addClass('active')
      })

      this.dom.on('click', '.comments-footer .send-button', function () {
        var post = $(this).parent().parent().parent().data('post')
        var input = $(this).parent().parent().parent().find('.comments-footer .comment-input')
        var message = $(this).parent().parent().parent().find('.comments-footer .comment-input').val()

        if (input.attr('placeholder')[0] === '@') {
          post = input.data('reply')
          $('.comments-footer .comment-input').attr('placeholder', lang.writeComment)
        }

        model.addReplyBack(post, message)
        $(this).parent().parent().parent().find('.comments-footer .comment-input').val('')
      })

      this.dom.on('click', '.card-options', function () {
        var post = $(this).closest('.card').data('post')

        $(this).parent().find('.card-options-section').addClass('popup')
        $(this).parent().find('.card-options-section *').addClass('popup')
      })

      this.dom.on('click', '.delete-comment.parent', function () {
        var post = $(this).closest('.comment').data('reply')
        var confirmText = lang.comfirmDeletePost

        if (post.isReply) {
          confirmText = lang.comfirmDeleteComment
        }

        var dialog = api.dialog()

        dialog.setTitle(lang.deletePost)
        dialog.setText(confirmText)

        dialog.setButton(0, wzLang.core.dialogCancel, 'black')
        dialog.setButton(1, lang.delete, 'red')

        dialog.render(function (ok) {
          if (!ok) {
            return
          }

          model.removePostBack(post)
        })
      })

      this.dom.on('click', '.delete-comment.child', function () {
        var post = $(this).closest('.replyDom').data('reply')
        var confirmText = lang.comfirmDeletePost

        if (post.isReply) {
          confirmText = lang.comfirmDeleteComment
        }

        var dialog = api.dialog()

        dialog.setTitle(lang.deletePost)
        dialog.setText(confirmText)

        dialog.setButton(0, wzLang.core.dialogCancel, 'black')
        dialog.setButton(1, lang.delete, 'red')

        dialog.render(function (ok) {
          if (!ok) {
            return
          }

          model.removePostBack(post)
        })
      })

      this.dom.on('click', '.card-options-section .delete', function () {
        var post = $(this).closest('.card').data('post')
        var confirmText = lang.comfirmDeletePost

        if (post.isReply) {
          confirmText = lang.comfirmDeleteComment
        }

        var dialog = api.dialog()

        dialog.setTitle(lang.deletePost)
        dialog.setText(confirmText)

        dialog.setButton(0, wzLang.core.dialogCancel, 'black')
        dialog.setButton(1, lang.delete, 'red')

        dialog.render(function (ok) {
          if (!ok) {
            return
          }

          model.removePostBack(post)
        })
      })

      this.dom.on('click', '.invite-by-mail', function () {
        model.openInviteByMail()
      })

      this.dom.on('click', '.reply-button', function () {
        var comment = $(this).parent()
        var post = comment.data('reply')
        var name = comment.data('name')
        var input = comment.parent().parent().find('.comments-footer .comment-input')

        view.prepareReplyComment(post, name, input)
      })

      this.dom.on('click', '.notifications', function () {
        view.openNotificationPopup()
      })

      this.dom.on('click', '.notification', function () {
        console.log($(this).data('notification'))
        /* if( typeof $(this).data( 'notification' ).data.mainPost == 'undefined' ){
          return alert( 'Notificacion pendiente de migrar' )
        } */
        model.notificationOpen($(this).data('notification'))
      })

      this.dom.on('click', '.notification .notification-blue-dot', function (event) {
        model.notificationAttendedBack($(this).parents('.notification').data('notification').id)
        event.stopPropagation()
        /* console.log( $(this).data( 'notification-data' ) )
        model.notificationOpen( $(this).data( 'notification-data' ) ) */
      })

      this.dom.on('click', '.go-back-button', function () {
        model.openWorld()
      })

      this.dom.on('click', '.card-options-section .edit', function () {
        if ($('.card.editing').length != 0) {
          return alert(lang.editingOne)
        }
        $(this).closest('.card').addClass('editing')
        $(this).closest('.card').find('.popup').removeClass('popup')
        view.editPost($(this).closest('.card'))
      })

      this.dom.on('click', '.cancel-new-card', function () {
        $(this).closest('.card').removeClass('editing')
        $(this).closest('.card').find('.card-options').removeClass('hide')
      })

      this.dom.on('click', '.notifications-header .mark-as-attended', function () {
        model.notificationMarkAllAsAttended()
      })

      this.dom.on('click', '.you-card .activate-preview, .you-card .triangle-down', function () {
        $(this).parent().find('.video-preview').toggleClass('hidden')
      })

      this.dom.on('click', '.cancel-attachment', function () {
        $(this).closest('.attachment').remove()
      })

      this.dom.on('click', '.save-new-card', function () {
        if ($(this).closest('.card').hasClass('uploading')) {
          return
        }

        var card = $(this).closest('.card')
        var post = card.data('post')

        var prevTitle = card.find('.title-input').data('prev')
        var newTitle = card.find('.title-input').val()

        var prevContent = card.find('.content-input').data('prev')
        var newContent = card.find('.content-input').val()

        var prevFsnode = card.find('.attach-list').data('prev')
        var newAttachments = card.find('.attachment:not(.wz-prototype)')
        var newFsnodeIds = []
        var newFsnode = []

        $.each(newAttachments, function (i, attachment) {
          newFsnodeIds.push(parseInt($(attachment).data('fsnode').id))
          newFsnode.push($(attachment).data('fsnode'))
        })

        var newMetadata = model.checkMetadata(newContent, newFsnode)

        if( newMetadata == null ) newMetadata = {}

        if (api.tool.arrayDifference(prevFsnode, newFsnodeIds).length || api.tool.arrayDifference(newFsnodeIds, prevFsnode).length) {

          post.modify({
            content: newContent,
            title: newTitle,
            metadata: newMetadata,
            fsnode: newFsnodeIds
          }, function (error, post) {
            if (error) {
              return console.error(error)
            }
          })

          /* post.setFSNode( newFsnodeIds , function(){

            post.setMetadata( newMetadata , function(){

              post.setTitle( newTitle , function(){

                post.setContent( newContent , function( e , post ){
                  setPost( post )
                })

              })

            })

          }) */
        } else if (model.isYoutubePost(newContent)) {
          newMetadata.linkType = 'youtube'

          post.modify({
            content: newContent,
            title: newTitle,
            metadata: newMetadata
          }, function (error, post) {
            if (error) {
              return console.error(error)
            }
          })
          /* post.setMetadata( newMetadata , function(){

            post.setTitle( newTitle , function(){

              post.setContent( newContent , function( e , post ){
                setPost( post )
              })

            })

          }); */
        } else if (prevTitle != newTitle || prevContent != newContent) {
          post.modify({
            content: newContent,
            title: newTitle
          }, function (error, post) {
            if (error) {
              return console.error(error)
            }
          })

          /* post.setTitle( newTitle , function(){

            post.setContent( newContent , function( e , post ){
              setPost( post )
            })

          }) */
        }

        $(this).closest('.card').removeClass('editing')
        $(this).closest('.card').find('.card-options').removeClass('hide')
      })

      this.dom.on('click', '.card-content.edit-mode .attachments, .card-content.edit-mode .attachments i, .card-content.edit-mode .attachments div', function () {
        /* if (isMobile()) {
          attachFromInevio();
        }else{ */
        $(this).closest('.card').find('.attach-select').addClass('popup')
        // }
      })

      this.dom.on('click', '.attach-select .inevio', function () {
        var card = $(this).closest('.card')
        api.fs.selectSource({ 'title': lang.selectFile, 'mode': 'file', 'multiple': true }, function (error, s) {
          if (error) {
            return console.error(error)
          }

          $('.attach-select').removeClass('popup')

          s.forEach(function (attach) {
            api.fs(attach, function (error, fsnode) {
              if (error) {
                console.error(error)
              } else {
                view.appendAttachment({ fsnode: fsnode, uploaded: true, card: card })
              }
            })
          })
        })
      })

      this.dom.on('click', '.start-button-no-worlds', function () {
        view.hideNoWorlds()
      })

      /* Mouse enter */

      this.dom.on('mouseenter', '.privacy-options .option i', function () {
        var popup = $(this).parent().find('.info-section')

        popup.show()
        popup.transition({
          'opacity': 1
        }, 200, 'cubic-bezier(.4,0,.2,1)')
      })

      this.dom.on('mouseleave', '.privacy-options .option i', function () {
        var popup = $(this).parent().find('.info-section')

        popup.transition({
          'opacity': 0
        }, 200, 'cubic-bezier(.4,0,.2,1)', function () {
          popup.hide()
        })
      })

      /* Keypress */

      this.dom.on('keypress', '.comments-footer .comment-input', function (e) {
        if (e.keyCode == 13) {
          if (!e.shiftKey) {
            var post = $(this).parent().parent().parent().data('post')
            var input = $(this).parent().parent().parent().find('.comments-footer .comment-input')
            var message = input.val()

            if (input.attr('placeholder')[0] === '@') {
              post = input.data('reply')
              $('.comments-footer .comment-input').attr('placeholder', lang.writeComment)
            }

            model.addReplyBack(post, message)
            input.val('')
            e.preventDefault()
          }
        }
      })

      /* Context menu */

      this.dom.on('contextmenu', '.doc-preview', function () {
        view.fileContextMenu($(this).data('fsnode'))
      })

      this.dom.on('contextmenu', '.worldDom', function () {
        view.worldContextMenu($(this), $(this).data('world'))
      })

      /* end of context menu */

      // Input events

      this.dom.on('input', '.world-header .search-post', function (e) {
        // if (e.keyCode == 13) {
        model.searchLocalPost($(this).find('input').val())
        // }
      })

      this.dom.on('input', '.kick-user-container .ui-input-search input', function () {
        view.filterElements($(this).val(), '.member')
      })

      this.dom.on('input', '.invite-user-container .ui-input-search input', function () {
        view.filterElements($(this).val(), '.friend')
      })

      this.dom.on('input', '.explore-container .search-bar input', function () {
        view.filterElements($(this).val(), '.world-card-dom')
      })

      this.dom.on('input', '.explore-top-bar .search-bar input', function () {
        view.filterElements($(this).val(), '.world-card-dom')
      })

      // End of input events

      /* this.dom.on( 'click' , '.world-header .search-post .delete-content' , function( e ){
        model.searchLocalPost( null )
      }) */

      $('.world-selected').on('scroll', function () {
        if ($(this).scrollTop() > 60) {
          $('.world-header-min').addClass('active')
        } else {
          $('.world-header-min').removeClass('active')
        }

        var scrollDiv = $(this)
        var scrollFinish = $('.world-selected')[0].scrollHeight - scrollDiv.height()

        if (scrollFinish - scrollDiv.scrollTop() < 300) {
          // var lastCard = scrollDiv.data( 'lastCard' )
          // getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){})
          // loadingPost = true
          model.loadMorePosts()
        }
      })

      $('.explore-container').on('scroll', function () {
        if ($(this).scrollTop() > 200) {
          view.showExploreTopBar()
        } else {
          view.hideExploreTopBar()
        }

        var scrollDiv = $(this)
        var scrollFinish = $('.explore-container')[0].scrollHeight - scrollDiv.height()

        if (scrollFinish - scrollDiv.scrollTop() < 200) {
          // var lastCard = scrollDiv.data( 'lastCard' )
          // getWorldPostsAsync( $( '.world.active' ).data( 'world' ) , { init: lastCard , final: lastCard + 6 } , function(){})
          // loadingPost = true
          model.appendPublicWorldsAsync()
          // console.log( 'scrolled' )
        }
      })

      // COSMOS EVENTS

      api.cosmos.on('userAdded', function (idWorkspace, world) {
        console.log('userAdded', idWorkspace, world)
        model.addUserFront(idWorkspace, world)
      })

      api.cosmos.on('userRemoved', function (idWorkspace, world) {
        console.log('userRemoved', idWorkspace, world)
        model.removeUserFront(idWorkspace, world)
      })

      api.cosmos.on('postAdded', function (post) {
        console.log('postAdded', post)
        model.addPost(post)
      })

      api.cosmos.on('postRemoved', function (post, world) {
        console.log('postRemoved', post, world)
        model.removePostFront(post, world)
      })

      api.cosmos.on('postModified', function (post) {
        console.log('postModified', post)
        model.updatePost(post)
      })

      console.log('bind event')
      api.cosmos.on('postContentSet', function (post) {
        console.log('postContentSet', post)
        model.updatePost(post)
      })

      api.cosmos.on('postTitleSet', function (post) {
        console.log('postTitleSet', post)
        model.updatePost(post)
      })

      api.cosmos.on('postFSNodeSet', function (post) {
        console.log('postFSNodeSet', post)
        model.updatePost(post)
      })

      api.cosmos.on('postMetadataSet', function (post) {
        console.log('postMetadataSet', post)
        model.updatePost(post)
      })      

      api.cosmos.on('worldChanged', function (world) {
        console.log('worldChanged', world)
        model.updateWorld(world)
      })

      api.cosmos.on('worldCreated', function (world) {
        console.log('worldCreated', world)
        model.addWorld(world, true)
        $('.new-world-container').data( 'world', world )
        $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id )
        $( '.new-world-name input' ).val( '' )
        $( '.new-world-container' ).data( 'world' , world )
        /* $( '.new-world-name input' ).val( '' )
        $( '.new-world-container' ).data( 'world' , world )
        $( '.wz-groupicon-uploader-start' ).attr( 'data-groupid' , world.id )

        myWorlds.push( world.id )

        if ( world.owner === myContactID ) {
          selectWorld( $( '.world-' + world.id ) , function(){})
        } */
      })

      api.cosmos.on('worldIconSetted', function (world) {
        console.log('worldIconSetted', world)
        if ($('.world.active').hasClass('world-' + world.id)) {
          $('.wz-groupicon-uploader-start').css('background-image', 'url(' + world.icons.normal + '?token=' + Date.now() + ')')
          $('.world-avatar').css('background-image', 'url(' + world.icons.normal + '?token=' + Date.now() + ')')
        }
      })

      // END OF COSMOS EVENTS

      // NOTIFICATION EVENTS

      api.notification.on('new', function (notification) {
        console.log('notificationNew', notification)
        if(notification.protocol === 'cosmos'){
          model.notificationNew(notification)
        }
      })

      api.notification.on('attended', function (list) {
        console.log('notificationAttended', list)
        model.notificationAttendedFront(list)
      })

      // UPLOAD EVENTS

      api.upload.on('worldIconProgress', function (percent) {
        $('.loading-animation-container').show()
        console.log('uploading avatar ', percent)
      })

      api.upload.on('worldIconEnd', function (worldId) {
        console.log('avatar uploaded')
        $('.loading-animation-container').hide()
        $('.wz-groupicon-uploader-start').removeClass('non-icon')
        $('.wz-groupicon-uploader-start').addClass('custom-icon')
      })

      api.upload.on('fsnodeProgress', function (fsnode, percent) {
        var attachment = $('.attachment-fsnode-' + fsnode)
        attachment.find('.aux-title').text(lang.uploading + (percent.toFixed(2) * 100).toFixed() + ' %')
      })

      api.upload.on('fsnodeEnd', function (fsnode, fileId) {
        var attachment = $('.editing .attachment-' + fileId + ',.editing .attachment-fsnode-' + fsnode.id)

        if (attachment.length) {
          attachment.find('.attachment-title').text(fsnode.name)
          attachment.find('.icon').css('background-image', 'url(' + fsnode.icons.micro + ')')
          attachment.find('.aux-title').hide()
          attachment.addClass('from-pc').addClass('attachment-' + fileId).addClass('attachment-fsnode-' + fsnode.id)
          attachment.data('fsnode', fsnode)

          if ($('.attachment.uploading').length) {
            $('.uploading').removeClass('uploading')
          }
        }
      })

      this.dom.on('upload-prepared', function (e, uploader) {

        uploader(this.model.openedWorld.apiWorld.volume, function (e, uploadQueueItem) {
          view.appendAttachment({fsnode: uploadQueueItem, uploaded: false, card: $('.card.editing')});
        })
      }.bind(this))

    }
  }

  return new Controller(model, view)
})(model, view)
