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

      this._translateInterface()
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

    closeNotificationCenter(){
      
      $('.notifications-container-mobile').transition({
        'x' : '100%'
      }, 1000, function(){
        $('.notifications-container-mobile').show()
      })

    }

    hideNoWorlds () {
      /*$('.no-worlds').transition({
        'opacity': 0
      }, 200, this.animationEffect, function () {
        $('.no-worlds').hide()
      })*/
    }

    openWorld (world, updatingHeader) {

      $('.clean').remove()
      $('.world').removeClass('active')
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

      if(world.apiWorld.isPrivate){
        $('.world-header .invite-user-button').css('opacity', 1)
      }else{
        $('.world-header .invite-user-button').css('opacity', 0)
      }

      if (!updatingHeader) {
        $('.cardDom').remove()
      }

    }

    openNotificationCenter(){
      $('.notifications-container-mobile').show()
      $('.notifications-container-mobile').transition({
        'x' : 0
      }, 1000)
    }

    showWorldDot (worldId) {
      $('.world-' + worldId).addClass('with-notification')
    }

    updateNotificationIcon (showIcon) {
      if (showIcon) {
        $('.notification-opener').addClass('with-notification')
      } else {
        $('.notification-opener').removeClass('with-notification')
      }
    }

    updateNotificationsList (notificationList) {
      $('.notificationDom').remove()
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

      }.bind(this))
    }

    updateNotificationStatus(notificationId, attended) {
      if (attended) {
        $('.notification-' + notificationId).removeClass('unattended')
      } else {
        $('.notification-' + notificationId).addClass('unattended')
      }
    }

    updateWorldsListUI (worldList) {

      if (worldList.length === 0) {
        return this.toggleNoWorlds(true)
      }

      worldList = worldList.sort(function (a, b) {
        return a.apiWorld.name.localeCompare(b.apiWorld.name)
      })

      var publicWorlds = []

      function isPrivate (world) {
        if (!world.apiWorld.isPrivate) {
          publicWorlds.push(world)
        }

        return world.apiWorld.isPrivate
      }

      worldList = worldList.filter(isPrivate)

      // console.log( publicWorlds, worldList )
      function worldSidebarDom (item) {
        var world = $('.sidebar .world.wz-prototype').clone()
        world.removeClass('wz-prototype').addClass('world-' + item.apiWorld.id).addClass('worldDom')
        world.find('.world-name').text(item.apiWorld.name)

        if (item.apiWorld.owner === api.system.workspace().idWorkspace) {
          world.addClass('editable')
        }

        world.find('.world-icon').css('border-color', colors[ item.apiWorld.id % colors.length ])
        world.data('world', item.apiWorld)
        world.attr('data-id', item.apiWorld.id)

        return world
      }

      this._domWorldsPrivateList.empty().append(worldList.map(function (item) {
        return worldSidebarDom(item)
      }))

      this._domWorldsPublicList.empty().append(publicWorlds.map(function (item) {
        return worldSidebarDom(item)
      }))

    }

  }

  return new View()
})()