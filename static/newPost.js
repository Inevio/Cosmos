
// Constants
var OPERATION_SAMPLE_RANGE = 10000
var TYPES = {

  'application/pdf': 'document',
  'audio/mp4': 'music',
  'audio/mpeg': 'music',
  'audio/flac': 'music',
  'audio/x-vorbis+ogg': 'music',
  'audio/x-wav': 'music',
  'image/gif': 'image',
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/tiff': 'image',
  'video/3gpp': 'video',
  'video/mp4': 'video',
  'video/quicktime': 'video',
  'video/webm': 'video',
  'video/x-flv': 'video',
  'video/x-matroska': 'video',
  'video/x-ms-asf': 'video',
  'video/x-ms-wmv': 'video',
  'video/x-msvideo': 'video',
  'video/x-theora+ogg': 'video'

}

// Variables
var app = $(this)
var automaticPopupQueue = null
var lastOperationSample = Date.now()

// DOM Variables
var closeNewCard = $('.close-new-card')
var attachNewPostButton = $('.new-card-section .attachments')
var cancelNewCard = $('.cancel-new-card')
var postNewCardButton = $('.post-new-card')
var attachmentPrototype = $('.attachment.wz-prototype')
var myContactID = api.system.workspace().idWorkspace

// Functions
var addAttachment = function (attach, useItem) {
  var attachment = useItem || attachmentPrototype.clone()

  attachment.removeClass('wz-prototype')
  attachment.find('.title').text(attach.fsnode ? attach.fsnode.name : attach.name)

  if (typeof attach.id !== 'undefined') {
    attachment.addClass('attachment-' + attach.id)
  }

  if (attach.fsnode && attach.fsnode.id) {
    attachment.addClass('attachment-fsnode-' + attach.fsnode.id)
  }

  if (!attach.uploaded) {
    attachment.addClass('from-pc uploading')
    attachment.find('.aux-title').show().text(lang.uploading)
    app.addClass('uploading')
  } else {
    attachment.find('.icon').css('background-image', 'url(' + attach.fsnode.icons.micro + ')')
  }

  if (params.operation === 'remove') {
    attachment.find('.cancel-attachment').hide()
  }

  attachmentPrototype.after(attachment)
  attachment.data('attachment', attach)

  if (attach.pending) {
    attachment.data('mime', attach.type)
  }

  var nAttachs = $('.attachment:not(.wz-prototype)').length
  switch (nAttachs) {
    case 0:
      app.css('height', '360px')
      break
    case 1:
      app.css('height', '390px')
      break
    case 2:
      app.css('height', '420px')
      break
    case 3:
      app.css('height', '450px')
      break
    default:
      app.css('height', '490px')
  }

  updateAttachmentCounter()
}

var attachFromInevio = function () {
  hideAttachSelect()

  // To Do -> Translate
  api.fs.selectSource({ 'title': lang.selectFile, 'mode': 'file', 'multiple': true }, function (err, list) {
    if (err) {
      return console.error(err)
    }

    list.forEach(function (fsnodeId) {
      api.fs(fsnodeId, function (err, fsnode) {
        if (err) {
          return console.error(err)
        }

        addAttachment({ fsnode: fsnode, uploaded: fsnode.fileId !== 'TO_UPDATE' })
      })
    })
  })
}

var postNewCardAsync = function () {
  var text = $('.new-card-textarea').val().trim()
  var title = $('.new-card-input').val().trim()

  if (title === '') {
    return alert(lang.noInfo)
  }

  var attachments = $('.attach-list .attachment').not('.wz-prototype')
  var metadata = { operation: params.operation }

  var addPost = function (o) {
    var attachment = []
    if (o.fsnode) {
      $.each(o.fsnode, function () {
        attachment.push($(this).data('attachment').fsnode.id)
      })
    }

    if (o.linkType) {
      metadata.linkType = o.linkType
      params.world.addPost({ content: text, title: title, metadata: metadata, notification: {} }, function (e, o) {
        $('.new-card-input').val('')
        $('.new-card-textarea').val('')
        api.app.removeView(app)
      })
    } else if (o.fileType) {
      metadata.fileType = o.fileType
      metadata.fsnode = attachment
      params.world.addPost({ content: text, title: title, fsnode: attachment, metadata: metadata, notification: {} }, function (e, o) {
        $('.new-card-input').val('')
        $('.new-card-textarea').val('')
        api.app.removeView(app)
      })
    } else {
      params.world.addPost({ content: text, title: title, notification: {} }, function (e, o) {
        $('.new-card-input').val('')
        $('.new-card-textarea').val('')
        api.app.removeView(app)
      })
    }
  }

  if (attachments.length) {
    if (attachments.length === 1) {
      var mime = attachments.data('attachment').fsnode.mime ? attachments.data('attachment').fsnode.mime : attachments.data('mime')
      addPost({ fsnode: attachments, fileType: guessType(mime), multifile: false })
    } else {
      addPost({ fsnode: attachments, fileType: 'generic', multifile: true })
    }
  } else if (isYoutubePost(text)) {
    addPost({ fsnode: null, linkType: 'youtube', multifile: false })
  } else {
    addPost({ fsnode: null, multifile: false })
  }
}

var isYoutubePost = function (text) {
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

var guessType = function (mime) {
  return TYPES[ mime ] || 'generic'
}

var hideAttachSelect = function () {
  $('.attach-select').removeClass('popup')
}

var removeAttachment = function (options) {
  if (automaticPopupQueue) {
    return
  }

  var attachments
  if (options.selection === 'all') {
    attachments = $('.attachment.from-pc')
  } else {
    attachments = $('.attachment-fsnode-' + options.selection + '.from-pc')
  }

  $.each(attachments, function () {
    var fsnode = $(this).data('attachment').fsnode

    if (fsnode) {
      api.app.storage('ignoreRemoveEvent').push(fsnode.id)
      fsnode.remove(function (err) {
        if (err) {
          console.error(err)
        }
      })
    }
  })
}

var showAttachSelect = function () {
  $('.attach-select').addClass('popup')
}

var start = function () {
  if (!params || !params.type) {
    return warn('NO_PARAMS_NEW_POST')
  }

  // Set popup private info
  automaticPopupQueue = params.queue

  // Set popup texts and info
  $('.new-card-avatar').css('background-image', 'url(' + api.system.workspace().avatar.tiny + ')')
  setTexts()
  translateUI()

  // Add files if any
  if (params.fsnode) {
    addAttachment({ fsnode: params.fsnode, uploaded: params.fsnode.fileId !== 'TO_UPDATE' })
  }

  // Focus title
  $('.new-card-input').focus()
}

var translateUI = function () {
  if (params.operation) {
    $('.cancel-new-card span').text(lang.omit)
    $('.post-new-card span').text(lang.publishChanges)
  } else {
    $('.cancel-new-card span').text(lang.cancel)
    $('.post-new-card span').text(lang.publishPost)
  }

  $('.attach-select .inevio span').text(lang.uploadInevio)
  $('.attach-select .pc span').text(lang.uploadPC)
  $('.new-card-input').attr('placeholder', lang.writeTitle)
  $('.new-card-textarea').attr('placeholder', lang.writeDescription)
}

var updateAttachmentCounter = function () {
  if ($('.attachment:not(.wz-prototype)').length) {
    attachNewPostButton.addClass('with-attach')
    attachNewPostButton.closest('.new-card-section').addClass('with-attach')
  } else {
    attachNewPostButton.removeClass('with-attach')
    attachNewPostButton.closest('.new-card-section').removeClass('with-attach')
  }
}

var setTexts = function () {
  if (params.operation) {
    var multipost = !!(params.queue && params.queue.pending.length > 0)
    var text

    switch (params.operation) {
      case 'enqueue':
        text = multipost ? lang.hadAddedFiles : lang.hadAddedFile
        break
      case 'modified':
        text = lang.hadModifiedFile
        break
      case 'copy':
        text = multipost ? lang.hadAddedFiles : lang.hadAddedFile
        break
      case 'moveIn':
        text = multipost ? lang.hadAddedFiles : lang.hadAddedFile
        break
      case 'moveOut':
        text = multipost ? lang.hadRemovedFiles : lang.hadRemovedFile
        break
      case 'remove':
        text = multipost ? lang.hadRemovedFiles : lang.hadRemovedFile
        break
    }

    $('.new-card-title').html('<i class="wz-dragger">' + text + '</i>' + '<figure class="wz-dragger ellipsis">' + params.world.name + '</figure>')
    $('.new-card-section').addClass('autopost')
  } else {
    $('.new-card-title').html('<i class="wz-dragger">' + lang.newPost + '</i>' + lang.for + '<figure class="wz-dragger ellipsis">' + params.world.name + '</figure>')
  }
}
// API Events
api.upload.on('fsnodeProgress', function (fsnode, percent) {
  var attachment = $('.attachment-fsnode-' + fsnode)
  attachment.find('.aux-title').text(lang.uploading + (percent.toFixed(2) * 100).toFixed() + ' %')
})

api.upload.on('fsnodeEnd', function (fsnode, fileId) {
  var attachment = $('.attachment-' + fileId + ', .attachment-fsnode-' + fsnode.id)

  if (attachment.length) {
    attachment.find('.title').text(fsnode.name)
    attachment.find('.icon').css('background-image', 'url(' + fsnode.icons.micro + ')')
    attachment.find('.aux-title').hide()
    attachment.addClass('from-pc').addClass('attachment-' + fileId).addClass('attachment-fsnode-' + fsnode.id)

    if ($('.attachment.uploading').length) {
      app.removeClass('uploading')
    }
  }
})

// DOM Events
closeNewCard.add(cancelNewCard).on('click', function () {
  if (!app.hasClass('uploading')) {
    removeAttachment({ selection: 'all' })
    api.app.removeView(app)
  }
})

postNewCardButton.on('click', function () {
  if (!app.hasClass('uploading')) {
    postNewCardAsync()
  }
})

attachNewPostButton.on('click', function () {
  showAttachSelect()
})

app
  .on('click', function (e) {
    if (!$(e.target).hasClass('popup') && !$(e.target).hasClass('popup-launcher')) {
      hideAttachSelect()
    }
  })
  .on('click', '.attach-select .inevio', attachFromInevio)
  .on('upload-prepared', function (e, uploader) {
    hideAttachSelect()

    uploader(params.world.volume, function (e, uploadQueueItem) {
      addAttachment(uploadQueueItem)
    })
  })
  .on('click', '.cancel-attachment', function () {
    var attachment = $(this).closest('.attachment')

    removeAttachment({ selection: attachment.data('attachment').fsnode.id })
    attachment.remove()
    updateAttachmentCounter()
    var nAttachs = $('.attachment:not(.wz-prototype)').length
    switch (nAttachs) {
      case 0:
        app.css('height', '360px')
        break
      case 1:
        app.css('height', '390px')
        break
      case 2:
        app.css('height', '420px')
        break
      case 3:
        app.css('height', '450px')
        break
      default:
        app.css('height', '490px')
    }
  })

  .on('requestPostCreate', function (e, newParams, callback) {
    if (automaticPopupQueue && automaticPopupQueue === newParams.queue) {
      addAttachment({ fsnode: newParams.fsnode, uploaded: newParams.fsnode.fileId !== 'TO_UPDATE' })
      callback(true)
    } else if (newParams.queue) {
      var found = $('.attachment-' + newParams.queue.fsnode[ newParams.fsnode.id ].id + ', .attachment-fsnode-' + newParams.fsnode.id)

      if (found.length) {
        addAttachment({ fsnode: newParams.fsnode, uploaded: newParams.fsnode.fileId !== 'TO_UPDATE' }, found)
      }

      callback(found.length)
    } else if (
      !newParams.queue &&
    params.operation === newParams.operation &&
    params.world.id === newParams.world.id &&
    lastOperationSample >= (Date.now() - OPERATION_SAMPLE_RANGE)
    ) {
      var found = $('.attachment-fsnode-' + newParams.fsnode.id)

      if (found.length) {
        addAttachment({ fsnode: newParams.fsnode, uploaded: newParams.fsnode.fileId !== 'TO_UPDATE' }, found)
      } else {
        addAttachment({ fsnode: newParams.fsnode, uploaded: newParams.fsnode.fileId !== 'TO_UPDATE' })
      }

      lastOperationSample = Date.now()

      callback(true)
    } else {
      var found = $('.attachment-fsnode-' + newParams.fsnode.id)

      if (found.length) {
        addAttachment({ fsnode: newParams.fsnode, uploaded: newParams.fsnode.fileId !== 'TO_UPDATE' }, found)
      }

      callback(found.length)
    }
  })

// Start
start()
