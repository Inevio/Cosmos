!function(t,e,i,n){function s(e,i){this.element=e,this.$element=t(e),this.init()}var h="textareaAutoSize",o="plugin_"+h,r=function(t){return t.replace(/\s/g,"").length>0};s.prototype={init:function(){var i=parseInt(this.$element.css("paddingBottom"))+parseInt(this.$element.css("paddingTop"))+parseInt(this.$element.css("borderTopWidth"))+parseInt(this.$element.css("borderBottomWidth"))||0;r(this.element.value)&&this.$element.height(this.element.scrollHeight-i),this.$element.on("input keyup",function(n){var s=t(e),h=s.scrollTop();t(this).height(0).height(this.scrollHeight-i),s.scrollTop(h)})}},t.fn[h]=function(e){return this.each(function(){t.data(this,o)||t.data(this,o,new s(this,e))}),this}}(jQuery,window,document);
var win = $(document.body)

const TYPES = {

    "application/pdf": 'document',
    "application/zip": 'generic',
    "application/x-rar": 'generic',
    "application/x-gzip": 'generic',
    "text/x-c": 'document',
    "text/x-c++": 'document',
    "text/x-php": 'document',
    "text/x-python": 'document',
    "application/json": 'document',
    "application/javascript": 'document',
    "application/inevio-texts": 'generic',
    "application/msword": 'generic',
    "application/vnd.oasis.opendocument.text": 'generic',
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 'generic',
    "application/inevio-grids": 'generic',
    "application/vnd.ms-excel": 'generic',
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 'generic',
    "application/vnd.ms-powerpoint": 'generic',
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": 'generic',
    "audio/mp4": 'music',
    "audio/mpeg": 'music',
    "audio/flac": 'music',
    "audio/x-vorbis+ogg": 'music',
    "audio/x-wav": 'music',
    "image/gif": 'image',
    "image/jpeg": 'image',
    "image/png": 'image',
    "image/tiff": 'image',
    "image/vnd.adobe.photoshop": 'generic',
    "text/html": 'generic',
    "text/plain": 'generic',
    "text/rtf": 'generic',
    "video/3gpp": 'video',
    "video/mp4": 'video',
    "video/quicktime": 'video',
    "video/webm": 'video',
    "video/x-flv": 'video',
    "video/x-matroska": 'video',
    "video/x-ms-asf": 'video',
    "video/x-ms-wmv": 'video',
    "video/x-msvideo": 'video',
    "video/x-theora+ogg": 'video'

}

const async = {

  each: function (list, step, callback) {
    var position = 0
    var closed = false
    var checkEnd = function (error) {
      if (closed) {
        return
      }

      position++

      if (position === list.length || error) {
        closed = true

        callback(error)

        // Nullify
        list = step = callback = position = checkEnd = null
      }
    }

    if (!list.length) {
      return callback()
    }

    list.forEach(function (item) {
      step(item, checkEnd)
    })
  },

  map: function (list, step, callback) {
    var position = 0
    var closed = false
    var result = []
    var checkEnd = function (index, error, data) {
      if (closed) {
        return
      }

      position++

      result[ index ] = data

      if (position === list.length || error) {
        closed = true

        callback(error, result)

        // Nullify
        result = list = step = callback = position = checkEnd = null
      }
    }

    if (!list.length) {
      return callback()
    }

    list.forEach(function (item, index) {
      step(item, checkEnd.bind(null, index))
    })
  },

  parallel: function (fns, callback) {
    var list = Object.keys(fns)
    var position = 0
    var closed = false
    var res = {}
    var checkEnd = function (i, error, value) {
      if (closed) {
        return
      }

      res[ i ] = value
      position++

      if (position === list.length || error) {
        closed = true

        callback(error, res)

        // Nullify
        list = callback = position = checkEnd = null
      }
    }

    if (!list.length) {
      return callback()
    }

    list.forEach(function (fn) {
      fns[ fn ](checkEnd.bind(null, fn))
    })
  }

}

const colors = [ '#4fb0c6', '#d09e88', '#b44b9f', '#1664a5', '#e13d35', '#ebab10', '#128a54', '#6742aa', '#fc913a', '#58c9b9' ]

var view = (function () {

  class View {

    constructor () {

      this.dom = win

      this.isMobile = this.dom.hasClass('wz-mobile-view')

      this.myContactID              = api.system.user().id
      this._domWorldsPrivateList    = $('.private-list')
      this._domWorldsPublicList     = $('.public-list')
      this._domPostContainer        = $('.cards-list')
      this._worldPrototype          = $('.sidebar .world.wz-prototype')
      this._noPosts                 = $('.cards-list .no-posts')

      this._genericCardPrototype    = $('.gen-card.wz-prototype')
      this._documentCardPrototype   = $('.doc-card.wz-prototype')
      this._youtubeCardPrototype    = $('.you-card.wz-prototype')

      this.animationEffect          = 'cubic-bezier(.4,0,.2,1)'

      this.noWorlds = $('.no-worlds')

      this.openedPostComments

      this._translateInterface()
      this._textareaAutoSize()

    }

    _getStringHour (date) {

      var now = new Date()

      var hh = date.getHours()
      var mm = date.getMinutes()

      if (hh < 10) {
        hh = '0' + hh
      }

      if (mm < 10) {
        mm = '0' + mm
      }

      return hh + ':' + mm

    }

    _timeElapsed (lastTime) {

      var now = new Date()
      var last = new Date(lastTime)
      var message
      var calculated = false

      if (now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth()) {
        if (now.getDate() === last.getDate()) {
          message = this._getStringHour(lastTime)
          calculated = true
        } else if (new Date(now.setDate(now.getDate() - 1)).getDate() === last.getDate()) {
          message = lang.lastDay + ' ' + lang.at + ' ' + this._getStringHour(lastTime)
          calculated = true
        }
      }

      if (!calculated) {
        var day = last.getDate()
        var month = last.getMonth() + 1

        if (day < 10) {
          day = '0' + day
        }

        if (month < 10) {
          month = '0' + month
        }

        message = day + '/' + month + '/' + last.getFullYear().toString().substring(2, 4) + ' ' + lang.at + ' ' + this._getStringHour(lastTime)
        calculated = true
      }

      return message

    }

    _textareaAutoSize(){

      var interval = setInterval(function(){

        if( typeof $().textareaAutoSize == 'function' ){
          $( '.comments-footer textarea' ).textareaAutoSize();
          clearInterval(interval)
        }

      }, 500);

    }

    _translateInterface () {
      // Start
      $('.no-worlds .title').text(lang.welcome)
      $('.no-worlds .subtitle').text(lang.intro)
      $('.no-worlds .subtitle2').text(lang.intro2)
      $('.no-worlds .chat-feature .description').html(lang.feature1)
      $('.no-worlds .files-feature .description').html(lang.feature2)
      $('.no-worlds .posts-feature .description').html(lang.feature3)
      $('.start-button-no-worlds span').text(lang.start)
      $('.new-world-button-no-worlds span, .new-world-button span').text(lang.createWorld)

      $('.no-worlds-mobile .title').text(lang.welcome)
      if (this.dom.width() < 360) {
        $('.no-worlds-mobile .subtitle').html(lang.intro)
      } else {
        $('.no-worlds-mobile .subtitle').html(lang.introMobile)
      }
      $('.no-worlds-mobile .subtitle2').text(lang.intro2)
      $('.no-worlds-mobile .chat-feature .description').html(lang.feature1)
      $('.no-worlds-mobile .files-feature .description').html(lang.feature2)
      $('.no-worlds-mobile .posts-feature .description').html(lang.feature3)

      // Sidebar
      $('.notifications-header .title').text(lang.activity)

      // World selected
      $('.select-world span').text(lang.selectWorld)

      // World header
      $('.invite-user-button').text(lang.worldHeader.invite)
      $('.open-chat-button span').text(lang.worldHeader.chatButton)
      $('.open-folder-button span').text(lang.worldHeader.folderButton)
      $('.search-post input').attr('placeholder', lang.worldHeader.searchPost)

      if (this.isMobile) {
        $('.stop-follow span').text(lang.exit)
      } else {
        $('.stop-follow span').text(lang.unfollowWorld)
      }

      // Posts
      $('.new-post-button .my-avatar').css('background-image', 'url( ' + api.system.user().avatar.tiny + ' )')
      $('.new-post-button .something-to-say').text(lang.cardsList.somethingToSay)
      $('.no-posts .no-post-to-show').text(lang.cardsList.noPostToShow)
      $('.no-posts .left-side span').text(lang.noPosts)
      $('.no-posts .right-side span').text(lang.createNewPost)
      $('.card-options-section .delete span').text(lang.deletePost)
      $('.card-options-section .edit span').text(lang.editPost)
      $('.card-content.edit-mode .title-input').attr('placeholder', lang.writeTitle)
      $('.card-content.edit-mode .content-input').attr('placeholder', lang.writeDescription)
      $('.send-button span').text(lang.send)
      $('.comments-footer .comment-input').attr('placeholder', lang.writeComment)
      $('.cancel-new-card span').text(lang.cancel)
      $('.save-new-card span').text(lang.save)
      $('.attachments span').text(lang.addFiles)
      $('.attach-select .inevio span, .attach-select-new-post .inevio span').text(lang.uploadInevio)
      $('.attach-select .pc span, .attach-select-new-post .pc span').text(lang.uploadPC)

      // World users
      $('.invite-user-container .ui-input-search input, .kick-user-container .ui-input-search input').attr('placeholder', lang.search)
      $('.cancel-invite-user span').text(lang.cancel)
      $('.invite-user span').text(lang.invite)
      $('.invite-by-mail span').text(lang.inviteByMail)

      //TODO
      /*if(api.system.fullMode()){
        $('.invite-by-mail span').text(lang.inviteByMail);
      }else{
        $('.invite-by-mail').remove()
      }*/

      $('.mobile-world-comments .comments-title').text(lang.comments)

      $('.kick-out-button span').text(lang.worldUsers.kickOut)

      // Explore
      $('.explore-text, .search-title').text(lang.explore)
      $('.tend-text').text(lang.tend)
      $('.follow-button span').text(lang.follow)
      $('.search-bar input').attr('placeholder', lang.search)
      $('.next-page .next-text').text(lang.next)
      $('.back-page .back-text').text(lang.previous)

      // New world
      $('.new-world-title .title').text(lang.worldCreation)
      $('.category .public').text(lang.publics)
      $('.category .private').text(lang.privates)
      $('.new-world-title .step-a').text(lang.stepa)
      $('.new-world-title .step-b').text(lang.stepb)
      $('.new-world-name span').text(lang.worldName)
      $('.new-world-avatar > span').text(lang.avatarBack)
      $('.change-background-button span').text(lang.changeBack)
      $('.new-world-desc span').text(lang.worldDesc)
      $('.new-world-privacy > span').text(lang.privacy)
      $('.option.public .title').text(lang.publicWorld)
      $('.option.public .desc').text(lang.publicDesc)
      $('.option.hidden .title').text(lang.privateWorld)
      $('.option.hidden .desc').text(lang.privateDesc)
      $('.option.public > span').text(lang.public)
      $('.option.hidden > span').text(lang.private)
      $('.create-world-button.step-a span').text(lang.createWorldShort)

      // Notifications
      $('.mark-as-attended').text(lang.markAsRead)
      $('.go-back-button .text').text(lang.backToTimeline)
    }

    /* Type of cards */

    appendDocumentCard (post, reason, callback) {
      var card = this._documentCardPrototype.clone()
      var user = post.apiPost.authorObject
      card.removeClass('wz-prototype').addClass('post-' + post.apiPost.id).addClass('cardDom')

      if (post.fsnodes.length) {
        var fsnode = post.fsnodes[0]

        if (fsnode.mime.indexOf('image') === 0 || fsnode.mime === 'application/pdf') {
          card.find('.doc-preview img').attr('src', fsnode.thumbnails['1024'])
          card.find('.doc-preview-bar').hide()
        } else {
          // To Do -> Is this really neccesary? background with a micro thumb is added a few lines after this
          card.find('.doc-preview img').attr('src', fsnode.thumbnails.big)
        }

        card.find('.preview-title').text(fsnode.name)
        card.find('.preview-info').text(api.tool.bytesToUnit(fsnode.size, 1))
        card.find('.doc-preview').addClass('attachment-' + fsnode.id).data('fsnode', fsnode)
        card.find('.doc-preview-bar i').css('background-image', 'url( ' + fsnode.icons.micro + ' )')
      } else {
        card.addClass('loading')
      }

      if (post.apiPost.title === '') {
        card.find('.title').hide()
      } else {
        card.find('.title').text(post.apiPost.title)
      }

      if (post.apiPost.content === '') {
        card.find('.desc').hide()
      } else {
        card.find('.desc').html(post.apiPost.content.replace(/\n/g, '<br />').replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi, '<a href="$1" target="_blank">$1</a>'))
      }

      card.find('.desc').find('a').each(function () {
        if (!URL_REGEX.test($(this).attr('href'))) {
          $(this).attr('href', 'http://' + $(this).attr('href'))
        }
      })

      card.find('.card-user-avatar').css('background-image', 'url( ' + user.avatar.normal + ' )')
      card.find('.card-user-name').text(user.fullName)
      card.find('.time-text').text(this._timeElapsed(new Date(post.apiPost.created)))
      card.data('post', post.apiPost)

      this.appendComments(card, post, function (cardToInsert) {
        return callback(cardToInsert)
      })
    }

    appendGenericCard (post, reason, callback) {
      var card = this._genericCardPrototype.clone()
      var user = post.apiPost.authorObject
      card.removeClass('wz-prototype').addClass('post-' + post.apiPost.id).addClass('cardDom')

      if (post.fsnodes.length) {
        for (var i = 0; i < post.fsnodes.length; i++) {
          var fsnode = post.fsnodes[i]

          if (!fsnode) {
            break
          }

          if (card.find('.attachment-' + fsnode.id).length === 0) {
            var docPreview = card.find('.doc-preview.wz-prototype').clone()
            docPreview.removeClass('wz-prototype').addClass('attachment-' + fsnode.id)

            if (post.apiPost.metadata && post.apiPost.metadata.operation === 'remove') {
              docPreview.find('.doc-icon img').attr('src', 'https://static.horbito.com/app/360/deleted.png')
            } else {
              docPreview.find('.doc-icon img').attr('src', fsnode.icons.big)
            }

            if (fsnode.mime && fsnode.mime.indexOf('office') > -1) {
              docPreview.find('.doc-icon').addClass('office')
            }

            docPreview.find('.doc-title').text(fsnode.name)
            docPreview.find('.doc-info').text(api.tool.bytesToUnit(fsnode.size))
            card.find('.desc').after(docPreview)
            docPreview.data('fsnode', fsnode)
          }
        }
      } else {
        card.addClass('loading')

        for (var i = 0; i < post.apiPost.fsnode.length; i++) {
          var fsnode = post.apiPost.fsnode[i]

          if (!fsnode) {
            break
          }

          if (card.find('.attachment-' + fsnode.id).length === 0) {
            var docPreview = card.find('.doc-preview.wz-prototype').clone()
            docPreview.removeClass('wz-prototype').addClass('attachment-' + fsnode)
            card.find('.desc').after(docPreview)
          }
        }
      }

      if (post.apiPost.title === '') {
        card.find('.title').hide()
      } else {
        card.find('.title').text(post.apiPost.title)
      }

      if (post.apiPost.content === '') {
        card.find('.desc').hide()
      } else {
        card.find('.desc').html(post.apiPost.content.replace(/\n/g, '<br />').replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi, '<a href="$1" target="_blank">$1</a>'))
      }

      card.find('.desc').find('a').each(function () {
        if (!URL_REGEX.test($(this).attr('href'))) {
          $(this).attr('href', 'http://' + $(this).attr('href'))
        }
      })

      card.find('.card-user-avatar').css('background-image', 'url( ' + user.avatar.normal + ' )')
      card.find('.card-user-name').text(user.fullName)
      card.find('.time-text').text(this._timeElapsed(new Date(post.apiPost.created)))
      card.data('time', post.apiPost.created)
      card.data('post', post.apiPost)

      this.appendComments(card, post, function (cardToInsert) {
        return callback(cardToInsert)
      })
    }

    appendNoFileCard (post, reason, callback) {
      var card = this._genericCardPrototype.clone()
      var user = post.apiPost.authorObject
      card.removeClass('wz-prototype').addClass('post-' + post.apiPost.id).addClass('cardDom')
      card.find('.doc-preview').hide()

      if (post.apiPost.title === '') {
        card.find('.title').hide()
      } else {
        card.find('.title').text(post.apiPost.title)
      }

      if (post.apiPost.content === '') {
        card.find('.desc').hide()
      } else {
        card.find('.desc').html(post.apiPost.content.replace(/\n/g, '<br />').replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi, '<a href="$1" target="_blank">$1</a>'))
      }

      card.find('.desc').find('a').each(function () {
        if (!URL_REGEX.test($(this).attr('href'))) {
          $(this).attr('href', 'http://' + $(this).attr('href'))
        }
      })

      if (user) {
        card.find('.card-user-avatar').css('background-image', 'url( ' + user.avatar.normal + ' )')
        card.find('.card-user-name').text(user.fullName)
      }

      card.find('.time-text').text(this._timeElapsed(new Date(post.apiPost.created)))
      card.data('post', post.apiPost)

      this.appendComments(card, post, function (cardToInsert) {
        return callback(cardToInsert)
      })
    }

    appendYoutubeCard (post, reason, callback) {
      var card = this._youtubeCardPrototype.clone()
      card.removeClass('wz-prototype').addClass('post-' + post.apiPost.id).addClass('cardDom')
      var user = post.apiPost.authorObject

      var youtubeCode = this._getYoutubeCode(post.apiPost.content)
      card.find('.video-preview').attr('src', 'https://www.youtube.com/embed/' + youtubeCode + '?autoplay=0&html5=1&rel=0')

      card.find('.card-user-avatar').css('background-image', 'url( ' + user.avatar.normal + ' )')
      card.find('.card-user-name').text(user.fullName)
      card.find('.time-text').text(this._timeElapsed(new Date(post.apiPost.created)))
      card.find('.desc').html(post.apiPost.content.replace(/\n/g, '<br />').replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi, '<a href="$1" target="_blank">$1</a>'))
      card.find('.title').text(post.apiPost.title)
      card.find('.activate-preview').text(lang.preview)
      card.data('post', post.apiPost)

      card.find('.desc').find('a').each(function () {
        if (!URL_REGEX.test($(this).attr('href'))) {
          $(this).attr('href', 'http://' + $(this).attr('href'))
        }
      })

      this.appendComments(card, post, function (cardToInsert) {
        return callback(cardToInsert)
      })
    }

    /* End of type of cards */

    appendPostList (list, loadingMorePosts){
      var domList = []
      var postPromises = []

      if (list.length == 0 && !loadingMorePosts) {
        this._noPosts.css('opacity', '1')
        this._noPosts.show()
      }

      if (!loadingMorePosts) {
        $('.cardDom').remove()
      }

      list.forEach(function (post) {
        var promise = $.Deferred()
        postPromises.push(promise)

        this.appendPost(post, promise, function (postDom) {
          if (post.apiPost.author === this.myContactID) {
            postDom.addClass('mine')
          }
          postDom.data('post', post.apiPost)
          domList.push(postDom)
          promise.resolve()
        }.bind(this))
      }.bind(this))

      $.when.apply(null, postPromises).done(function () {
        if (domList.length) {
          if (!loadingMorePosts) {
            this._domPostContainer.scrollTop(0)
          }
          this._noPosts.css('opacity', '0')
          this._noPosts.hide()
          this._domPostContainer.append(domList)
          // this._domPostContainer.scrollTop( this._domPostContainer[ 0 ].scrollHeight )
        }
      }.bind(this))
    }

    appendPost (post, promise, callback) {
      if (post.apiPost.metadata && post.apiPost.metadata.operation === 'remove') {
        this.appendGenericCard(post, lang.postCreated, function (postDom) {
          return callback(postDom, promise)
        })
      } else if (post.apiPost.metadata && post.apiPost.metadata.fileType) {
        switch (post.apiPost.metadata.fileType) {
          case 'generic':
            this.appendGenericCard(post, lang.postCreated, function (postDom) {
              return callback(postDom, promise)
            })
            break

          case 'document':
            this.appendDocumentCard(post, lang.postCreated, function (postDom) {
              return callback(postDom, promise)
            })
            break

          case 'image':
            this.appendDocumentCard(post, lang.postCreated, function (postDom) {
              return callback(postDom, promise)
            })
            break

          case 'video':
            this.appendGenericCard(post, lang.postCreated, function (postDom) {
              return callback(postDom, promise)
            })
            break

          case 'music':
            this.appendGenericCard(post, lang.postCreated, function (postDom) {
              return callback(postDom, promise)
            })
            break
        }
      } else if (post.apiPost.metadata && post.apiPost.metadata.linkType) {
        switch (post.apiPost.metadata.linkType) {
          case 'youtube':
            this.appendYoutubeCard(post, lang.postCreated, function (postDom) {
              return callback(postDom, promise)
            })
            break
        }
      } else {
        this.appendNoFileCard(post, lang.postCreated, function (postDom) {
          return callback(postDom, promise)
        })
      }
    }

    /* Comments */

    appendComments (card, post, callback) {

      console.log(card, post)
      if (!post.commentsLoaded) {
        card.find('.comments-text').text(lang.loading + ' ' + lang.comments)
        return callback(card)
      }

      card.find('.commentDom').remove()

      var comments = post.comments

      if (Object.keys(comments).length === 0 && comments.constructor === Object) {
        card.find('.comments-text').text('0 ' + lang.comments)
        return callback(card)
      }

      comments = Object.values(comments)
      card.find('.comments-text').text(comments.length + ' ' + lang.comments)

      if (comments.length === 1) {
        card.find('.comments-text').text(comments.length + ' ' + lang.comment)
      } else {
        card.find('.comments-text').text(comments.length + ' ' + lang.comments)
      }
      card.find('.comments-text').data('num', comments.length)

      if( post.apiPost.id === this.openedPostComments ){
        this.insertComments(post)
      }

      return callback(card)

      /*var listToAppend = []

      async.each(comments, function (comment, checkEnd) {
        this.appendComment(comment, function (commentDom) {
          listToAppend.push(commentDom)
          checkEnd()
        })
      }.bind(this), function () {
        card.find('.comments-list').append(listToAppend)
        card.find('.comments-list').scrollTop(999999999999999)
        return callback(card)
      })*/

    }

    appendComment (comment, callback, appending) {
      var commentDom = $('.comment.wz-prototype').eq(0).clone()
      commentDom.removeClass('wz-prototype').addClass('commentDom comment-' + comment.apiComment.id)

      commentDom.find('.reply-button').text(lang.reply)
      commentDom.find('.edit-button').text(lang.edit)

      if (comment.apiComment.author === this.myContactID) {
        commentDom.addClass('mine')
      }

      commentDom.find('.avatar').css('background-image', 'url( ' + comment.apiComment.authorObject.avatar.tiny + ' )')
      commentDom.find('.name').text(comment.apiComment.authorObject.fullName)
      commentDom.find('.time').text(this._timeElapsed(new Date(comment.apiComment.created)))
      commentDom.find('.comment-text').html(comment.apiComment.content.replace(/\n/g, '<br />').replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi, '<a href="$1" target="_blank">$1</a>'))

      commentDom.find('.comment-text').find('a').each(function () {
        if (!URL_REGEX.test($(this).attr('href'))) {
          $(this).attr('href', 'http://' + $(this).attr('href'))
        }
      })

      commentDom.data('reply', comment.apiComment)
      commentDom.data('name', comment.apiComment.authorObject.name.split(' ')[0])

      if (Object.keys(comment.replies).length === 0 && comment.replies.constructor === Object) {
        if (appending) {
          $('.post-' + comment.parent).find('.comments-list').append(comment)
        }
        return callback(commentDom)
      }

      var repliesDom = []
      commentDom.find('.reply-list').show()

      var replies = Object.values(comment.replies)
      replies.forEach(function (reply, index) {
        var replyDom = this.appendReplyComment(reply, commentDom)

        repliesDom.push(replyDom)
        if (index === replies.length - 1) {
          commentDom.find('.reply-list').append(repliesDom)
          // card.find( '.comments-list' ).scrollTop( reply[0].offsetTop )
          return callback(commentDom)
        }
      }.bind(this))
    }

    appendReplyComment (response, comment, appending) {
      if (!comment) {
        comment = $('.comment-' + response.parent)
      }
      var reply = comment.find('.reply.wz-prototype').clone()
      reply.removeClass('wz-prototype').addClass('replyDom reply-' + response.id)

      if (response.author === this.myContactID) {
        reply.addClass('mine')
      }

      reply.find('.avatar').css('background-image', 'url( ' + response.authorObject.avatar.tiny + ' )')
      reply.find('.name').text(response.authorObject.fullName)
      reply.find('.time').text(this._timeElapsed(new Date(response.created)))
      reply.find('.reply-text').html(response.content.replace(/\n/g, '<br />').replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/gi, '<a href="$1" target="_blank">$1</a>'))

      reply.find('.reply-text').find('a').each(function () {
        if (!URL_REGEX.test($(this).attr('href'))) {
          $(this).attr('href', 'http://' + $(this).attr('href'))
        }
      })

      reply.data('reply', response)
      if (appending) {
        comment.find('.reply-list').show()
        comment.find('.reply-list').append(reply)
      }

      return reply
    }

    closeNotificationCenter(){

      $('.notifications-container-mobile').transition({
        'x' : '100%'
      }, 300, function(){
        $('.notifications-container-mobile').show()
      })

    }

    filterPosts (list) {
      if (list) {
        $('.cardDom').removeClass('filtered')
        list.forEach(function (id) {
          $('.post-' + id).addClass('filtered')
        })

        $('.cardDom:not(.filtered)').hide()
        $('.cardDom.filtered').show()
      } else {
        $('.cardDom').removeClass('filtered').show()
      }
    }

    insertComments(post){

      let comments = Object.values(post.comments)

      $('.mobile-world-comments .commentDom, .mobile-world-comments .replyDom ').remove()
      $('.mobile-world-comments').data('post', post.apiPost )

      if(!comments || !comments.length) return this.openCommentsView(post.apiPost.id)

      var commentList = []
      console.log(comments)

      comments.forEach( function(commentModel, index){

        var comment = $('.mobile-world-comments .comment.wz-prototype').clone()
        comment.removeClass('wz-prototype').addClass('commentDom comment-' + commentModel.apiComment.id)
        comment.find('.reply-button').text('-   ' + lang.reply)
        if (commentModel.apiComment.authorObject === this.myContactID) {
          comment.addClass('mine')
        }

        comment.find('.avatar').css('background-image', 'url(' + commentModel.apiComment.authorObject.avatar.tiny + ')')
        comment.find('.name').text(commentModel.apiComment.authorObject.fullName)
        comment.find('.time').text(this._timeElapsed(new Date(commentModel.apiComment.created)))
        comment.find('.comment-text').html(commentModel.apiComment.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));

        comment.find('.comment-text').find('a').each(function () {

          if (!URL_REGEX.test($(this).attr('href'))) {
            $(this).attr('href', 'http://' + $(this).attr('href'))
          }

        })

        comment.data('reply', commentModel.apiComment)
        comment.data('name', commentModel.apiComment.authorObject.name.split(' ')[0])

        var replies = Object.values(commentModel.replies)
        console.log(replies)

        if( replies.length ){

          var repliesList = []
          comment.find('.reply-list').show()

          replies.forEach( function( response, index ){

            var reply = comment.find('.reply.wz-prototype').clone()
            reply.removeClass('wz-prototype').addClass('replyDom reply-' + response.id)
            if (response.author === this.myContactID) {
              reply.addClass('mine')
            }

            reply.find('.avatar').css('background-image', 'url(' + response.authorObject.avatar.tiny + ')')
            reply.find('.name').text(response.authorObject.fullName)
            reply.find('.time').text(this._timeElapsed(new Date(response.created)))
            reply.find('.reply-text').html(response.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'))

            reply.find('.reply-text').find('a').each(function () {

              if (!URL_REGEX.test($(this).attr('href'))) {
                $(this).attr('href', 'http://' + $(this).attr('href'))
              }

            })

            repliesList.push(reply)

            if( index === replies.length - 1 ){
              comment.find('.reply-list').append(repliesList)
            }

          }.bind(this))

        }

        commentList.push(comment)

        if( index === comments.length - 1 ){
          $('.mobile-world-comments .comments-list').append(commentList)
          $('.mobile-world-comments .comments-list').scrollTop(999999999)
          this.openCommentsView(post.apiPost.id)
        }

      }.bind(this))

    }

    openCommentsView(postId){

      $('.mobile-world-comments').show().stop().clearQueue().transition({
        'transform': 'translateY(0)'
      }, 300, function () {
        $('.mobile-world-content').hide()
        this.openedPostComments = postId
      }.bind(this))

    }

    closeCommentsView(){

      $('.mobile-world-content').show()
      $('.mobile-world-comments').stop().clearQueue().transition({
        'transform': 'translateY(100%)'
      }, 300, function () {
        $(this).hide();
      })

    }

    /* End of comments */

    closeNewPost(){

      $('.attachment:not(.wz-prototype)').remove()
      $('.mobile-world-content').removeClass('hide')
      $('.mobile-new-post').stop().clearQueue().transition({
        'transform': 'translateY(-100%)'
      }, 300, function () {
        $(this).addClass('hide');
      })

    }

    closeNewWorld(){

      var newWorldContainer = $('.new-world-container-wrap')
      $('.new-world-container').css('height', '100%')

      // Fade out White background
      newWorldContainer.stop().clearQueue().transition({
        'opacity': 0
      }, 200, function(){

          newWorldContainer.css('display', 'none')
          $('.new-world-avatar').hide()
          $('.new-world-desc').hide()
          $('.new-world-privacy').hide()
          $('.new-world-title').removeClass('second')
          $('.create-world-button').removeClass('step-b')
          $('.create-world-button').addClass('step-a')
          $('.new-world-title .step-b').removeClass('hide')
          $('.new-world-title .title').text(lang.worldCreation)
          $('.delete-world-button').addClass('hide')


          $('.new-world-title, .new-world-name, .create-world-button, .new-world-avatar, .new-world-desc, .new-world-privacy, .delete-world-button').css({
              'transform': 'translateY(20px)',
              'opacity': 0
          })

          $('.close-new-world').css({
              'transform': 'translateY(10px)',
              'opacity': 0
          })

          /*if ($('.worldDom').length === 0) {

              noWorlds.show();
              noWorlds.transition({

                  'opacity': 1

              }, 200, this.animationEffect);

          } else {

              noWorlds.transition({

                  'opacity': 0

              }, 200, this.animationEffect, function () {

                  noWorlds.hide();

              });

          }*/

      })

      $('.new-world-container').removeClass('editing')

    }

    closeSearchBar(){
      $('.world-search-bar').removeClass('active')
    }

    closeWorld(){

      $('.world').removeClass('active')
      $('.mobile-world-content').transition({
        'x' : '100%'
      }, 300, function(){
        $(this).addClass('hide')
      })

    }

    /*hideGoBackButton () {
      $('.cards-list .go-back-button').hide()
    }*/

    hideNotificationMode () {
      /*this.hideGoBackButton()
      this.showNewPostButton()*/
    }

    hideNoWorlds () {
      /*$('.no-worlds').transition({
        'opacity': 0
      }, 200, this.animationEffect, function () {
        $('.no-worlds').hide()
      })*/
    }

    launchAlert( error ){
      return alert(error)
    }

    newPostMobile(worldName){

      $('.mobile-new-post').removeClass('hide')
      $('.mobile-new-post').stop().clearQueue().transition({
          'transform': 'translateY(0%)'
      }, 200, function () {
          $('.mobile-world-content').addClass('hide')
      })
      $('.mobile-new-post .new-card-title').html('<i class="wz-dragger">' + lang.newPost + '</i>' + '<span>' + lang.for + '</span>' + '<figure class="wz-dragger ellipsis">' + worldName + '</figure>')
      $('.mobile-new-post .post-new-card span').text(lang.publishPost)
      $('.mobile-new-post .new-card-input').attr('placeholder', lang.title)
      $('.mobile-new-post .new-card-textarea').attr('placeholder', lang.description)
      $('.mobile-new-post .new-card-input').val('')
      $('.mobile-new-post .new-card-textarea').val('')

    }

    newWorldStep(){

      this.closeNewWorld()

      /*$('.new-world-avatar').show()
      $('.new-world-desc').show()
      $('.new-world-privacy').show()
      $('.new-world-title').addClass('second')
      $('.create-world-button').addClass('step-b')
      $('.create-world-button').removeClass('step-a')
      $('.option.private-option').addClass('active')
      $('.option.public').removeClass('active')

      $('.new-world-desc textarea').val('')

      $('.wz-groupicon-uploader-start').css('background-image', 'none')

      // Fade in and goes up title (animation)
      var translate = '0px'

      $('.new-world-title').stop().clearQueue().transition({
        'transform': 'translateY(' + translate + ')'
      }, 1000, this.animationEffect)

      // Fade in and goes up name (animation)
      $('.new-world-name').stop().clearQueue().transition({
        'opacity': 0,
        'transform': 'translateX(-200px)'
      }, 1000, this.animationEffect)

      // Fade in and goes up avatar (animation)
      $('.new-world-avatar').stop().clearQueue().transition({
        delay: 500,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 1000)

      // Fade in and goes up desc (animation)
      $('.new-world-desc').stop().clearQueue().transition({
        delay: 650,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 1000)

      // Fade in and goes up privacy (animation)
      $('.new-world-privacy').stop().clearQueue().transition({
        delay: 800,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 1000)

      // Fade in and goes up privacy (animation)
      $('.create-world-button').transition({
          delay: 950,
          'opacity': 1,
          'transform': 'translateY(0px)'
      }, 1000)

      $('.delete-world-button').transition({
        delay: 950,
        'opacity': 0.5,
        'transform': 'translateY(0px)'
      }, 1000)*/

    }

    openExploreWorlds(){}

    openSearchBar(){
      $('.world-search-bar').addClass('active')
      $('.world-search-bar input').focus()
    }

    openWorld (world, updatingHeader) {

      console.log(world)
      $('.clean').remove()
      $('.world').removeClass('active')
      this.dom.data('worldSelected', world.apiWorld)
      $('.world-' + world.apiWorld.id).addClass('active')
      $('.world-' + world.apiWorld.id).removeClass('with-notification')
      $('.search-post input, .mobile-world-content .search-bar input').val('')
      $('.world-title').text(world.apiWorld.name)
      if (world.apiWorld.users === 1) {
        $('.world-members-button').text(world.apiWorld.users + ' ' + lang.worldHeader.member)
      } else {
        $('.world-members-button').text(world.apiWorld.users + ' ' + lang.worldHeader.members)
      }
      $('.world-avatar').css('background-image', 'url( ' + world.apiWorld.icons.normal + '?token=' + Date.now() + ' )')
      this.toggleSelectWorld(false)

      /*if(world.apiWorld.isPrivate){
        $('.world-header .invite-user-button').css('opacity', 1)
      }else{
        $('.world-header .invite-user-button').css('opacity', 0)
      }*/

      if (!updatingHeader) {
        $('.cardDom').remove()
      }

      $('.mobile-world-content').removeClass('hide').transition({
        'x' : 0
      }, 300)

    }

    openNotificationCenter(){
      $('.notifications-container-mobile').show()
      $('.notifications-container-mobile').transition({
        'x' : 0
      }, 300)
    }

    prepareReplyComment(comment) {

      var post = comment.data('reply')
      var name = comment.data('name')
      var input = comment.parent().parent().find('.comments-footer .comment-input')

      input.attr('placeholder', '@' + name + ' ')
      input.focus()
      input.data('reply', post)

    }

    prependPost (post) {
      this.appendPost( post, null, function(postDom){
        $('.you-card.wz-prototype').after(postDom)
      })
    }

    /*showNewPostButton () {
      $('.new-post-button').show()
    }*/

    showNewWorldContainer(){

      var mobileNewWorld = $('.mobile-new-world')
      $('.new-world-name input').val('')
      mobileNewWorld.css('display', 'block').removeClass('hide')
      $('.new-world-avatar').show()
      $('.wz-groupicon-uploader-start').css('background-image', 'none')

      // Fade in White background (animation)
      mobileNewWorld.stop().clearQueue().transition({
        'opacity': 1,
        'transform': 'translateY(0%)'
      }, 300)

      // Fade in and goes up title (animation)
      $('.new-world-title').stop().clearQueue().transition({
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 300)

      // Fade in and goes up esc (animation)
      $('.close-new-world').stop().clearQueue().transition({
        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 300)

      // Fade in and goes up name (animation)
      $('.new-world-name').stop().clearQueue().transition({
        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 300)

      $('.new-world-avatar').stop().clearQueue().transition({
        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 1000)

      // Fade in and goes up button (animation)
      $('.create-world-button').stop().clearQueue().transition({
        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'
      }, 300)

      $('.delete-world-button').stop().clearQueue().transition({
        delay: 250,
        'opacity': 0.5,
        'transform': 'translateY(0px)'
      }, 300)

    }

    showNoWorlds(){}

    showWorldDot (worldId) {
      $('.world-' + worldId).addClass('with-notification')
    }

    toggleReplies(card){

      console.log(card)
      var height = parseInt(card.find('.comments-list').css('height')) + 50
      var commentsSection = card.find('.comments-section')

      if (commentsSection.hasClass('opened')) {

        commentsSection.css('height', height)
        card.removeClass('comments-open')
        commentsSection.transition({
          'height': 0
        }, 200, function () {
          commentsSection.removeClass('opened')
        });

      } else {

        card.addClass('comments-open')
        commentsSection.find('.comments-list').scrollTop(9999999)
        commentsSection.transition({

            'height': height

        }, 200, function () {

            commentsSection.addClass('opened')
            commentsSection.css('height', 'auto')
            commentsSection.find('textarea').focus()

        });

      }

    }

    toggleSelectWorld (show){}

    updateGenericCardFSNodes (post, edited) {
      var card = $('.post-' + post.apiPost.id)
      card.removeClass('loading')

      post.fsnodes.forEach(function (fsnode, index) {
        var docPreview = null
        var needToInsert = false
        if (card.find('.attachment-' + fsnode.id).length !== 0) {
          docPreview = card.find('.attachment-' + fsnode.id)
        }else if( edited ){
          docPreview = card.find('.doc-preview.wz-prototype').clone().removeClass('wz-prototype').addClass('attachment-' + fsnode.id)
          needToInsert = true
        }

        if( docPreview ){

          if (post.apiPost.metadata && post.apiPost.metadata.operation === 'remove') {
            docPreview.find('.doc-icon img').attr('src', 'https://static.horbito.com/app/360/images/deleted.png')
          } else {
            docPreview.find('.doc-icon img').attr('src', fsnode.icons.big)
          }

          if (fsnode.mime && fsnode.mime.indexOf('office') > -1) {
            docPreview.find('.doc-icon').addClass('office')
          }

          docPreview.find('.doc-title').text(fsnode.name)
          docPreview.find('.doc-info').text(api.tool.bytesToUnit(fsnode.size))
          docPreview.data('fsnode', fsnode)

          if(needToInsert){
            card.find( '.desc' ).after( docPreview )
          }

          if( edited ){
            docPreview.addClass('dontDelete')

            if( index === post.fsnodes.length - 1 ){
              card.find('.doc-preview').not('.dontDelete').not('.wz-prototype').remove()
              card.find('.doc-preview').removeClass('dontDelete')
            }

          }
        }
      })
    }

    updateNotificationIcon (showIcon) {
      if (showIcon) {
        $('.notification-opener').addClass('with-notification')
      } else {
        $('.notification-opener').removeClass('with-notification')
      }
    }

    updateNotificationsList (notificationList) {
      /*$('.notificationDom').remove()
      var notificationDomList = []
      //console.log(notificationList)

      notificationList.forEach(function (notification, index) {

        var notificationDom = $('.notification-mobile.wz-prototype').clone().removeClass('wz-prototype')

        notificationDom.addClass('notification-' + notification.id)
        notificationDom.addClass('notificationDom')
        if (!notification.attended) {
          notificationDom.addClass('unattended')
        }

        notificationDom.data('notification', notification)

        notificationDom.find('.notification-avatar').css('background-image', 'url( ' + notification.apiSender.avatar.tiny + ' )')
        if (notification.apiWorld) {
          notificationDom.find('.notification-world-avatar').css('background-image', 'url( ' + notification.apiWorld.icons.tiny + ' )')
        }

        if (notification.data.type == 'post') {
          if (!notification.attended) {
            this.showWorldDot(notification.apiWorld.id)
          }
          notificationDom.addClass('isPost')
          notificationDom.find('.notification-action').html('<i>' + notification.apiSender.fullName + '</i>' + lang.postCreated + ' ' + lang.in + ' ' + notification.apiWorld.name)
        } else if (notification.data.type == 'reply') {
          notificationDom.find('.notification-action').html('<i>' + notification.apiSender.fullName + '</i>' + lang.hasComment2 + ' ' + notification.apiWorld.name)
        } else if (notification.data.type == 'addedToWorld') {
          notificationDom.addClass('isAdded')
          notificationDom.find('.notification-action').html('<i>' + notification.apiSender.fullName + '</i>' + lang.addedToWorld + ' ' + notification.apiWorld.name)
        }

        notificationDom.find('.notification-time').html('<i></i>' + this._timeElapsed(new Date(notification.time)))
        notificationDomList.push(notificationDom)

        if (index === notificationList.length - 1) {
          $('.notifications-list').append(notificationDomList)
        }

      }.bind(this))*/
    }

    updateNotificationStatus(notificationId, attended) {
      if (attended) {
        $('.notification-' + notificationId).removeClass('unattended')
      } else {
        $('.notification-' + notificationId).addClass('unattended')
      }
    }

    updatePostComments (post) {
      var card = $('.post-' + post.apiPost.id)
      if (card.length) {
        this.appendComments(card, post, function () {
          card.find('.comments-list').scrollTop(99999999)
        })
      }
    }

    updatePostComment (comment) {
      var commentDom = $('.comment-' + comment.id)
      commentDom.find('.comment-text').html(comment.content.replace(/\n/g, '<br />'))
    }

    updatePostReply (reply) {
      var replyDom = $('.reply-' + reply.id)
      replyDom.find('.reply-text').text(reply.content)
    }

    updatePost (post, changePostType) {
      var postDom = $('.post-' + post.apiPost.id)
      postDom.find('.title').text(post.apiPost.title)
      postDom.find('.desc').text(post.apiPost.content)
      postDom.data('post', post.apiPost)
      this.updatePostFSNodes(post, changePostType)
    }

    updatePostFSNodes (post, changePostType) {
      if (post.apiPost.metadata && post.apiPost.metadata.operation === 'remove') {
        this.updateGenericCardFSNodes(post, true)
      }else if( changePostType ){

        this.appendPost( post, null, function( postDom ){
          if (post.apiPost.author === this.myContactID) {
            postDom.addClass('mine')
          }
          postDom.data('post', post.apiPost)
          var oldPost = $('.post-' + post.apiPost.id)
          oldPost.after( postDom )
          oldPost.remove()
        }.bind(this))

      }else if (post.apiPost.metadata && post.apiPost.metadata.fileType) {

        switch (post.apiPost.metadata.fileType) {
          case 'generic':
            this.updateGenericCardFSNodes(post, true)
            break

          case 'document':
            this.updateDocumentCardFSNodes(post, true)
            break

          case 'image':
            this.updateDocumentCardFSNodes(post, true)
            break

          case 'video':
            this.updateGenericCardFSNodes(post, true)
            break

          case 'music':
            this.updateGenericCardFSNodes(post, true)
            break
        }

      }
    }

    updateWorldsListUI (worldList) {

      console.log(worldList)
      if (worldList.length === 0) {
        return this.toggleNoWorlds(true)
      }

      worldList = worldList.sort(function (a, b) {
        return a.apiWorld.name.localeCompare(b.apiWorld.name)
      })

      var publicWorlds = []

      /*function isPrivate (world) {
        if (!world.apiWorld.isPrivate) {
          publicWorlds.push(world)
        }

        return world.apiWorld.isPrivate
      }

      worldList = worldList.filter(isPrivate)*/

      // console.log( publicWorlds, worldList )
      function worldSidebarDom (item) {
        var world = $('.sidebar .world.wz-prototype').clone()
        world.removeClass('wz-prototype').addClass('world-' + item.apiWorld.id).addClass('worldDom')
        world.find('.world-name').text(item.apiWorld.name)

        if (item.apiWorld.owner === api.system.workspace().idWorkspace) {
          world.addClass('editable')
        }

        if( item.apiWorld.icons ){
          world.find('.world-icon').css('background-image', 'url(' + item.apiWorld.icons.small + '?token=' + Date.now() + ')')
        }

        world.data('world', item.apiWorld)
        world.attr('data-id', item.apiWorld.id)

        return world
      }

      console.log('actualizo lista de mundos', this._domWorldsPrivateList, worldList)
      this._domWorldsPrivateList.empty().append(worldList.map(function (item) {
        return worldSidebarDom(item)
      }))

      /*this._domWorldsPublicList.empty().append(publicWorlds.map(function (item) {
        return worldSidebarDom(item)
      }))*/

    }

    worldContextMenu (worldDom, world) {

      var menu = api.menu()
      var isMine = world.owner === api.system.workspace().idWorkspace

      menu.addOption(lang.searchPost, function () {
        if (worldDom.hasClass('active')) {
          $('.search-button').click()
        } else {
          worldDom.trigger('click')
        }
      })

      if (isMine) {
        menu.addOption(lang.editWorld, function () {
          if (worldDom.hasClass('active')) {
            $('.new-world-container').data('world', world)
          } else {
            worldDom.trigger('click')
          }
          this.openEditWorld(world)
        }.bind(this))
      } else {
        menu.addOption(lang.abandonWorld, function () {
          this.leaveWorldDialog(world.id)
        }.bind(this), 'warning')
      }

      menu.render()

    }

  }

  return new View()
})()

var model = (function (view) {
  class Model {
    constructor (view) {
      this.view = view
      this.openedWorld
      this.myContactID = api.system.workspace().idWorkspace
      this.myUserObject

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

      /*this._mainAreaMode
      this._prevMainAreaMode = MAINAREA_NULL*/

      this.apiFsCalls = 0

      this.isMobile = this.view.dom.hasClass('wz-mobile-view')

      // this.changeMainAreaMode( MAINAREA_NULL )
      this.fullLoad()
      this.updateNotificationIcon()
    }

    _compareTitle (query, title) {
      return (title.toLowerCase().indexOf(query.toLowerCase()) !== -1)
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
                  checkEnd()
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

    _loadUserObject (callback) {

      api.user( this.myContactID, (error,user) => {

        if(error) return console.error(error)

        this.myUserObject = user
        return callback(null, null)

      })

    }

    _loadFullWorldsList (callback) {
      callback = api.tool.secureCallback(callback)

      api.cosmos.list({from: 0, to: 1000})
      .then( worlds => {
        console.log('list', worlds)

        worlds.forEach(function (world, index) {
          this.addWorld(world)
        }.bind(this))

        callback(null, worlds)
      })
      .catch( error => {
        this.view.launchAlert(error)
      })

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

      console.log('addReplyBack', post, message)
      if (!this.openedWorld) {
        return
      }

      if (post.isReply) {

        if (!this.openedWorld.posts[ post.parent ] || !this.openedWorld.posts[ post.parent ].comments[ post.id ].apiComment) {
          return
        }

        this.openedWorld.posts[ post.parent ].comments[ post.id ].apiComment.reply({ content: message, notification: {} })
        .catch( error => console.error(error))

      } else {

        if (!this.openedWorld.posts[ post.id ] || !this.openedWorld.posts[ post.id ].apiPost) {
          return
        }

        this.openedWorld.posts[ post.id ].apiPost.reply({ content: message, notification: {} })
        .catch( error => console.error(error))

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

      api.cosmos.list(null, null, this.showingWorlds)
      .then( (worlds,nResults) => {

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
        })

      })
      .catch( error => {
        return console.error(error)
      })

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

    closeWorld(){
      this.openedWorld = null
      this.view.closeWorld()
    }

    createWorld (worldName) {

      if (!worldName) {
        var dialog = api.dialog()

        dialog.setText(lang.worldTitleMandatory)
        dialog.setButton(0, lang.accept, 'red')
        dialog.render()

        return
      }

      api.cosmos.create(worldName, null, true, null)
      .then( world => {
        this.view.newWorldStep()
      })
      .catch( error => {
        return console.error(error)
      })

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

      world.addUser(this.myContactID)
      .then( user => {
        this.addWorld(world)
        this.view.updateWorldCard(world.id, true)
      })
      .catch( error => console.error(error) )

    }

    fullLoad () {
      async.parallel({

        contacts: this._loadFullContactList.bind(this),
        worlds: this._loadFullWorldsList.bind(this),
        user: this._loadUserObject.bind(this)

      }, function (err, res) {
        if (err) {
          return this.view.launchAlert(err)
        }

        wql.isFirstOpen([this.myContactID], function (e, o) {

          if (!res.worlds.length || !o.length) {
            // Show no worlds
            // this.changeSidebarMode( SIDEBAR_CONVERSATIONS )
            this.view.showNoWorlds()

            if( !o.length ){
              wql.firstOpenDone([this.myContactID], function (err, o) {
                if (err) console.error(err)
              })
            }
            
          }

        }.bind(this))

        this._loadFullNotificationList(function (error, notifications) {

          console.log('load full notifications', notifications)
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

        this.openedWorld.apiWorld.addUser(user.idWorkspace)
        .catch( error => console.error(error) )

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

      this.worlds[worldId].apiWorld.removeUser(this.myContactID)
      .catch( error => console.error(error) )

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

        this.worlds[ notificationData.world ].apiWorld.getPost(mainPostId, { withFullUsers: true })
        .then( post => {

          var postToShow = new Post(this, post)
          this.openWorld(notificationData.world, true)
          this.view.showNotificationPost(postToShow, notificationData)
          this.fastLoadFSNodes(postToShow)
          this.notificationAttendedBack(notification.id)

        })
        .catch( error => console.error(error) )

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

    openComments( postId ){

      if( !this.openedWorld || !this.openedWorld.posts[postId] ) return
      view.insertComments(this.openedWorld.posts[postId])

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

      console.log(fsnode)
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

      console.log(worldId, this.openedWorld)
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

      this.openedWorld.apiWorld.removePost(post.id)
      .catch( error => console.error(error) )

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

      this.openedWorld.apiWorld.removeUser(idWorkspace)
      .catch( error => console.error(error) )

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
        if (this.contacts[ members[j].idWorkspace ]) {
          delete listToShow[ members[j].idWorkspace ]
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

      if( !post.authorObject ){

        if( post.author === this.myContactID ){
          post.authorObject = this.myUserObject
        }else if( this.contacts[post.author] ){
          post.authorObject = this.contacts[post.author]
        }else if( this.restOfUsers[post.author] ){
          post.authorObject = this.restOfUsers[post.author]
        }

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

        let changePostType = false
        if( world.posts[ post.id ].apiPost.metadata && post.metadata ){
          changePostType = world.posts[ post.id ].apiPost.metadata.fileType !== post.metadata.fileType
        }else if( world.posts[ post.id ].apiPost.metadata || post.metadata ){
          changePostType = true
        }

        world.posts[ post.id ].apiPost = post

        if(changePostType){
          world.posts[ post.id ].loadPostFsnodes(function (modelPost) {
            if (needToRefresh) {
              view.updatePost(modelPost, changePostType)
              //view.updatePostFSNodes(modelPost,changePostType)
            }
          })
        }else{
          view.updatePost(world.posts[ post.id ], changePostType)
        }

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
        console.log(world)
        if(world.icons){
          this.icon = world.icons.big
        }
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

      this.apiWorld.getPosts({from: init, to: end, withFullUsers: true })
      .then( posts => {

        this.lastPostLoaded = end
        this.loadingPosts = false

        posts.forEach(function (post, index) {
          this.posts[ post.id ] = new Post(this.app, post)
          if (index === posts.length - 1 && init !== 0) {
            this.app.showPosts(this.apiWorld.id, init)
          }
        }.bind(this))

      })
      .catch( error => console.error(error) )

    }

    _loadMembers () {
      if (!this.apiWorld) return

      this.apiWorld.getUsers()
      .then( members => {

        members.forEach(function (member) {

          if(!member){
            console.log('undefined member in world', this.apiWorld)
          }

          if (this.app.contacts[ member.idWorkspace ]) {
            this._addMember(this.app.contacts[ member.idWorkspace ])
          }else if(this.app.restOfUsers[ member.idWorkspace ]){
            this._addMember(this.app.restOfUsers[ member.idWorkspace ])
          }else {
            api.user(member.idWorkspace, function (error, user) {
              if (error) {
                return console.error(error)
              }
              if(!user){
                console.log('undefined user in world', member.idWorkspace)
                return
              }

              this._addMember(this.app.addToRestOfUsers(user))
            }.bind(this))
          }
        }.bind(this))

      })
      .catch( error => console.error(error) )

    }

    _sortMembers () {
      this.members.sort(function (a, b) {
        if (a.fullName < b.fullName) return -1
        if (a.fullName > b.fullName) return 1
        return 0
      })
    }

    addMember (user) {

      if(typeof user === 'number'){

        if (this.app.contacts[ user ]) {
          this.members.push(this.app.contacts[ user ])
        }else if(this.app.restOfUsers[ user ]){
          this.members.push(this.app.restOfUsers[ user ])
        }else {
          api.user(user, function (error, user) {
            if (error) {
              return console.error(error)
            }

            this.members.push(this.app.addToRestOfUsers(user))
          }.bind(this))
        }

      }else if(typeof user === 'object'){

        if (this.app.contacts[ user.idWorkspace ]) {
          this.members.push(this.app.contacts[ user.idWorkspace ])
        }else if(this.app.restOfUsers[ user.idWorkspace ]){
          this.members.push(this.app.restOfUsers[ user.idWorkspace ])
        }else {
          this.members.push(this.app.addToRestOfUsers(user.idWorkspace))
        }

      }

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

      if( this.apiPost.worldId === 294 ){
        console.log(this)
      }

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

      this.apiPost.getReplies({ from: 0, to: 1000, withFullUsers: true })
      .then( replies => {

        this.commentsLoaded = true
        replies.forEach(function (reply) {
          this.comments[ reply.id ] = new Comment(this.app, reply)
        }.bind(this))

        if (this.app.openedWorld && this.app.openedWorld.apiWorld.id == this.apiPost.worldId) {
          this.app.view.updatePostComments(this)
        }

      })
      .catch( error => console.error(error) )

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
      this.apiComment.getReplies({ from: 0, to: 1000, withFullUsers: true })
      .then( replies => {

        this.repliesLoaded = true
        replies.forEach(function (reply) {
          this.replies[ reply.id ] = reply
          if (this.app.openedWorld && this.app.openedWorld.apiWorld.id == this.apiComment.worldId) {
            this.app.view.appendReplyComment(reply, null, true)
          }
        }.bind(this))

      })
      .catch( error => console.error(error) )

    }
  }

  return new Model(view)
})(view)
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
