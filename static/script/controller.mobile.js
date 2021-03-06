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


      this.model = model
      this.view = view
      this._bindEvents()
    }

    _bindEvents () {


      this.dom.on('click', '.worldDom', function(){
        model.openWorld(parseInt($(this).attr('data-id')), false)
      })

      this.dom.on('click', '.mobile-world-content .go-back', function(){
        model.closeWorld()
      })

      this.dom.on('click', '.notification-opener', function(){
        view.openNotificationCenter()
      })

      this.dom.on('click', '.notifications-container-mobile .notification-header .notification-back', function(){
        view.closeNotificationCenter()
      })

      this.dom.on('click', '.notifications-container-mobile .notification-mark-all-as-read', function () {
        model.notificationMarkAllAsAttended()
      })

      /* New world */

      this.dom.on('click', '.sidebar-header .new-world-button-mini', function(){
        view.showNewWorldContainer()
      })

      this.dom.on('click', '.close-new-world', function(){
        view.closeNewWorld()
      })

      this.dom.on('click', '.create-world-button.step-a', function(){

        if($('.new-world-name input').val()){
          model.createWorld($('.new-world-name input').val())
        }

      })

      /* End of new world */

      /* Comments */

      this.dom.on('click', '.comments-opener', function () {

        /*changeMobileView('worldComments')
        var card = $(this).closest('.card')
        var post = card.data('post')
        setRepliesAsyncOnlyAppendMobile(card, post)
        mobileWorldComments.data('post', post)
        attendCommentNotification($(this).parent().parent().data('post'))*/
        model.openComments($(this).closest('.card').data('post').id)

      })

      this.dom.on('click', '.close-comments', function () {
        view.closeCommentsView()
      })

      this.dom.on('click', '.reply-button', function () {
        view.prepareReplyComment($(this).parent())
      })

      this.dom.on('click', '.comments-footer .send-button', function () {
        var post = $(this).parent().parent().data('post')
        var input = $(this).parent().parent().find('.comments-footer .comment-input')
        var message = $(this).parent().parent().find('.comments-footer .comment-input').val()

        if (input.attr('placeholder')[0] === '@') {
          post = input.data('reply')
          $('.comments-footer .comment-input').attr('placeholder', lang.writeComment)
        }

        model.addReplyBack(post, message)
        $(this).parent().parent().find('.comments-footer .comment-input').val('')
      })

      /* End of comments */

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

      this.dom.on('click', '.open-folder-button', function () {
        model.openFolder()
      })

      this.dom.on('click', '.new-post-button', function(){
        view.newPostMobile($('.world-header-min .world-title').text())
      })

      this.dom.on('click', '.close-new-post', function(){
        view.closeNewPost()
      })

      this.dom.on('click', '.activate-search-bar', function(){
        view.openSearchBar()
      })

      this.dom.on('blur', '.world-search-bar input', function(){
        console.log('blur')
        view.closeSearchBar()
      })

      this.dom.on('click', '.cancel-search', function(){
        console.log('click')
        view.closeSearchBar()
      })

      this.dom.on('click', '.world-search-bar .delete-content', function (e) {
        console.log('delete-content')
        model.searchLocalPost(null)
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
        //if (e.keyCode == 13) {
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
        //}
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

      this.dom.on('input', '.world-search-bar input', function (e) {
        // if (e.keyCode == 13) {
        model.searchLocalPost($(this).val())
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

      api.cosmos.on('userAdded', function (userId, world) {
        console.log('userAdded', userId, world)
        model.addUserFront(userId, world)
      })

      api.cosmos.on('userRemoved', function (userId, world) {
        console.log('userRemoved', userId, world)
        model.removeUserFront(userId, world)
      })

      api.cosmos.on('postAdded', function (post) {
        console.log('postAdded', post)
        model.addPost(post)
      })

      /*api.cosmos.on('postReplied', function (post, world) {
        console.log('postReplied', post, world)
        model.addPost(post)
      })*/

      api.cosmos.on('postRemoved', function (post, world) {
        console.log('postRemoved', post, world)
        model.removePostFront(post, world)
      })

      api.cosmos.on('postModified', function (post) {
        console.log('postModified', post)
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
