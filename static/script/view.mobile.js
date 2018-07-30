var win = $(document.body)
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

var view = (function () {

  class View {

    constructor () {
      this.dom = win

      this.isMobile = this.dom.hasClass('wz-mobile-view')

      this.myContactID              = api.system.user().id
      this._domWorldsPrivateList    = $('.private-list')
      this._domWorldsPublicList     = $('.public-list')
      this._domPostContainer        = $('.cards-list')
      this._worldPrototype = $('.sidebar .world.wz-prototype')
      this._noPosts                 = $('.cards-list .no-posts')

      this._genericCardPrototype    = $('.gen-card.wz-prototype')
      this._documentCardPrototype   = $('.doc-card.wz-prototype')
      this._youtubeCardPrototype = $('.you-card.wz-prototype')

      this.animationEffect          = 'cubic-bezier(.4,0,.2,1)'

      this.noWorlds = $('.no-worlds')

      this._translateInterface()
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

  }

  return new View()
})()