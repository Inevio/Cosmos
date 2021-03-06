// Variables
var worldSelected;
var worldSelectedUsrs;
var me = api.system.workspace();
var nNotifications = 0;
var loadingPost = false;
var searchWorldQuery = 0;
var searchPostQuery = 0;
var animationEffect = 'cubic-bezier(.4,0,.2,1)';
var myWorlds = [];
var app = $(this);
var desktop = $(this).parent().parent();
var myContactID = api.system.workspace().idWorkspace;
var mobileView = 'worldSidebar'
var worldNotifications = [];
var postsNotifications = [];
var commentsNotifications = [];

//Albeniz*******************
var worldsScrollPageCount = 1
var loadingWorlds = false
//**************************


var URL_REGEX = /^http(s)?:\/\//i;
var colors = ['#4fb0c6', '#d09e88', '#b44b9f', '#1664a5', '#e13d35', '#ebab10', '#128a54', '#6742aa', '#fc913a', '#58c9b9']

var TYPES = {

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

//Pagination
var showingWorlds;
var paginationLimit = 20;
var filterActive;
var nPagesShowed = 4;
var totalPages;
var actualPageInterval;

// Prototypes
var worldPrototype = $('.sidebar .world.wz-prototype');
var worldCardPrototype = $('.world-card.wz-prototype');
var userCirclePrototype = $('.user-circle.wz-prototype');
var documentCardPrototype = $('.doc-card.wz-prototype');
var genericCardPrototype = $('.gen-card.wz-prototype');
var youtubeCardPrototype = $('.you-card.wz-prototype');
var friendPrototype = $('.friend.wz-prototype');
var memberPrototype = $('.member.wz-prototype');
var commentPrototype = $('.comment.wz-prototype');

// DOM CACHE ---

// Start
var startButton = $('.no-worlds .start-button-no-worlds');
var startButtonMobile = $('.no-worlds-mobile .start-button-no-worlds');

// Sidebar
var exploreButton = $('.explore-button');
var mobileWorldSidebar = $('.mobile-world-list');
var newWorldButton = $('.new-world-button, .new-world-button-mini');
var notifications = $('.notifications');
var worldCategory = $('.category .opener, .category .category-name');

// World selected
var noWorlds = $('.no-worlds');
var noWorldsMobile = $('.no-worlds-mobile');
var mobileWorldContent = $('.mobile-world-content');
var searchBar = $('.search-button');
var searchBarFigure = $('.search-button i');
var uiContent = $('.ui-content');
var worldSelectedDom = $('.world-selected');

// World header
var worldAvatar = $('.world-avatar');
var worldTitle = $('.world-title');
var worldMembersButton = $('.world-members-button');
var inviteUserButton = $('.invite-user-button');
var openChatButton = $('.open-chat-button');
var openFolderButton = $('.open-folder-button');
var searchPostInput = $('.search-post input, .mobile-world-content .search-bar input');
var cleanPostSearch = $('.search-post .delete-content');

// Posts
var newPostButton = $('.new-post-button, .no-post-new-post-button');
var cardsList = $('.cards-list');
var mobileWorldComments = $('.mobile-world-comments');
var attachCommentBut = $('.comments-footer .attachments, .comments-footer .attachments i, .comments-footer .attachments div');

// World users
var closeInviteUser = $('.close-invite-user, .cancel-invite-user');
var closeKickUsers = $('.close-kick-user');
var aceptInviteUser = $('.invite-user-container .invite-user');
var friendSearchBox = $('.invite-user-container .ui-input-search input');
var membersSearchBox = $('.kick-user-container .ui-input-search input');
var inviteByMail = $('.invite-by-mail');

// Explore
var searchWorldCard = $('.explore-container .search-bar input');
var mobileExplore = $('.mobile-explore');
var closeExplore = $('.close-explore');
var searchExplore = $('.explore-container .search-bar');

// New world
var mobileNewWorld = $('.mobile-new-world');
var newWorldButton = $('.new-world-button, .new-world-button-mini');
var closeNewWorld = $('.close-new-world');
var worldOptionsHelp = $('.privacy-options .option i');
var privacyOption = $('.privacy-options .option');

// New post
var mobileNewPost = $('.mobile-new-post');

// UI EVENTS
closeExplore.on('click', function () {

    exploreAnimationOut();

});

newWorldButton.on('click', function () {

    newWorldAnimationA();

});

closeNewWorld.on('click', function () {

    newWorldAnimationOut();
    $('.new-world-container').removeClass('editing');

});

notifications.on('click', function () {

    $('.notifications-container').toggleClass('popup');
    $('.notifications-container *').toggleClass('popup');


});

newPostButton.on('click', function () {

    if (isMobile()) {
        newPostMobile();
    } else {
        api.app.createView({type: 'manual', world: app.data('worldSelected')}, 'newPost');
    }

});

worldCategory.on('click', function () {

    var category = $(this).parent();
    category.toggleClass('closed');
    if (category.hasClass('closed')) {
        category.find('.world-list').css('height', category.find('.world-list').css('height'));
        category.find('.world-list').transition({
            'height': '0px'
        }, 200);
    } else {
        var height = category.find('.world').length * $('.world.wz-prototype').outerHeight();
        category.find('.world-list').transition({
            'height': height
        }, 200);

    }

});

searchBar.on('click', function () {

    if (!isMobile()) {
        $(this).addClass('popup');
        $(this).find('input').focus();
    } else {
        if (scrollableContent.scrollTop() <= 190) {
            $('.scrollable-content').animate({scrollTop: 191}, '200', 'swing', function () {
                uiContent.addClass('searching');
                $('.search-bar input').focus();
            });
        } else {
            uiContent.addClass('searching');
            $('.search-bar input').focus();
        }
    }

});

searchBarFigure.on('click', function () {

    if (!isMobile()) {
        $(this).parent().addClass('popup');
    } else {
        uiContent.addClass('searching');
        $('.search-bar input').focus();
    }
});

searchExplore.on('click', function () {

    $(this).addClass('popup');

});

worldOptionsHelp.on('mouseenter', function () {

    var popup = $(this).parent().find('.info-section');

    popup.show();
    popup.transition({

        'opacity': 1

    }, 200, animationEffect);

});

worldOptionsHelp.on('mouseleave', function () {

    var popup = $(this).parent().find('.info-section');

    popup.transition({

        'opacity': 0

    }, 200, animationEffect, function () {

        popup.hide();

    });

});

attachCommentBut.on('click', function () {

    $(this).parent().find('.attach-select').show();
    $(this).parent().find('.attach-select').addClass('popup');
    $(this).parent().find('.attach-select *').addClass('popup');

});

privacyOption.on('click', function () {

    $('.privacy-options .option').removeClass('active');
    $(this).addClass('active');

});

cardsList.on('mousewheel', '.comments-list', function (e) {

    if ($(this).scrollTop()) {
        e.stopPropagation();
    }

});

app

    .on('click', function (e) {

        if (!$(e.target).hasClass('popup') && !$(e.target).hasClass('popup-launcher')) {

            $('.popup').removeClass('popup');
            $(this).parent().find('.comments-footer .attach-select').hide();


        }

        var commentOnEditMode = $('.comment.editing');
        if (commentOnEditMode.length > 0 && !$(e.target).hasClass('comment-text-edit') && !$(e.target).hasClass('edit-button')) {
            commentOnEditMode.removeClass('editing');
            commentOnEditMode.data('reply').setContent(commentOnEditMode.find('.comment-text-edit').val());
            commentOnEditMode.find('.edit-button').removeClass('save');
            commentOnEditMode.find('.edit-button').text(lang.edit);
        }

    })

    .on('click', '.create-world-button.step-a', function () {

        if ($('.new-world-name input').val()) {

            newWorldAnimationB();
            if (uiContent.hasClass('compressed')) {
                decompressCover({instant: true, world: $('.world.active')});
            }

        }

    })

    .on('keyup', '.new-world-name input', function (e) {

        if (e.keyCode == 13 && $('.new-world-name input').val()) {

            $(this).blur();
            $(this).parent().parent().find('.create-world-button').click();

        }

    })

    .on('click', '.create-world-button.step-b , .delete-world-button', function () {

        newWorldAnimationOut();

    })

    .on('mouseenter', '.user-circle', function () {

        var position = $(this).position();

        $('.users-circles-container .user-hover span').text($(this).data('user').name);

        $('.users-circles-container .user-hover').css({
            'top': ( 89 + position.top ),
            'left': ( position.left - 29 ),
            'opacity': 0.9
        });

    })

    .on('click', '.card-options', function () {

        var post = $(this).closest('.card').data('post');

        $(this).parent().find('.card-options-section').addClass('popup');
        $(this).parent().find('.card-options-section *').addClass('popup');

    })

    .on('click', '.you-card .activate-preview, .you-card .triangle-down', function () {

        $(this).parent().find('.video-preview').toggleClass('hidden');

    })

    .on('click', '.comments-opener', function () {

        var card = $(this).parent().parent();
        var height = parseInt(card.find('.comments-list').css('height')) + 50;
        var commentsSection = card.find('.comments-section');

        if (isMobile()) {
            return;
        }

        if (commentsSection.hasClass('opened')) {

            commentsSection.css('height', height);
            card.removeClass('comments-open');
            commentsSection.transition({

                'height': 0

            }, 200, function () {

                commentsSection.removeClass('opened');

            });

        } else {

            card.addClass('comments-open');
            commentsSection.find('.comments-list').scrollTop(9999999);
            commentsSection.transition({

                'height': height

            }, 200, function () {

                commentsSection.addClass('opened');
                commentsSection.css('height', 'auto');
                commentsSection.find('textarea').focus();

            });


        }

    })

// END UI EVENTS


//Events
worldSelectedDom.on('scroll', function () {

    var scrollDiv = $(this);
    var scrollFinish = $('.world-selected')[0].scrollHeight - scrollDiv.height();

    if (scrollFinish - scrollDiv.scrollTop() < 300) {

        var lastCard = scrollDiv.data('lastCard');
        getWorldPostsAsync($('.world.active').data('world'), {init: lastCard, final: lastCard + 6}, function () {
        });
        loadingPost = true;

    }

});

searchWorldCard.on('input', function () {

    $('.explore-top-bar .search-bar input').val($(this).val());
    searchWorldQuery = searchWorldQuery + 1;
    var searchWorldQueryCopy = searchWorldQuery;
    filterWorldCards({
        filter: $(this).val(),
        searchWorldQueryCopy: searchWorldQueryCopy,
        'fromWorld': 0,
        'toWorld': paginationLimit
    });

});

closeInviteUser.on('click', function () {

    $('.invite-user-container').toggleClass('popup');
    $('.invite-user-container *').toggleClass('popup');
    $('.friend .ui-checkbox').removeClass('active');
    friendSearchBox.val('');
    filterFriends('');

});

closeKickUsers.on('click', function () {

    $('.kick-user-container').toggleClass('popup');
    $('.kick-user-container *').toggleClass('popup');
    friendSearchBox.val('');
    filterFriends('');

});

aceptInviteUser.on('click', function () {

    inviteUsers();
    $('.invite-user-container').toggleClass('popup');
    $('.invite-user-container *').toggleClass('popup');
    $('.friend .ui-checkbox').removeClass('active');

});

friendSearchBox.on('input', function () {
    filterFriends($(this).val());
});

membersSearchBox.on('input', function () {
    filterMembers($(this).val());
});

exploreButton.on('click', function () {

    if (isMobile()) {
        changeMobileView('explore');
    }
    $('.explore-container').scrollTop(0);

    filterActive = null;
    searchWorldCard.val('');

    cleanWorldCards();
    getPublicWorldsAsync({
        page: 1,
        withAnimation: true
    });

});

openChatButton.on('click', function () {

    if (desktop.find('.wz-app-14').length > 0) {
        desktop.trigger('message', ['open-world-chat', {'world': worldSelected}]);
    } else {
        wz.app.openApp(14, ['open-world-chat', {'world': worldSelected}, function (o) {
            console.log(o);
        }]);
    }

});

api.cosmos.on('worldCreated', function (world) {

    appendWorld(world);
    $('.new-world-name input').val('');
    $('.new-world-container').data('world', world);
    $('.wz-groupicon-uploader-start').attr('data-groupid', world.id);

    myWorlds.push(world.id);

    if (world.owner === myContactID) {
        selectWorld($('.world-' + world.id), function () {
        });
    }

});

api.cosmos.on('postAdded', function (post) {

    if (post.isReply) {

        var parent = $('.comment-' + post.parent);
        var grandparent = $('.post-' + post.parent);

        if (parent.length > 0) {

            var parentPost = parent.data('reply');
            grandparent = $('.post-' + parentPost.parent);

            if (worldSelected && worldSelected.id === post.worldId) {
                appendReplyComment(grandparent, parentPost, post);
            }

        } else {

            var ncomments = grandparent.find('.comments-text').data('num') + 1;
            if (ncomments === 1) {
                grandparent.find('.comments-text').text(ncomments + ' ' + lang.comment);
            } else {
                grandparent.find('.comments-text').text(ncomments + ' ' + lang.comments);
            }
            grandparent.find('.comments-text').data('num', ncomments);

            if (worldSelected && worldSelected.id === post.worldId) {
                appendReply(grandparent, post, function () {
                });
            }

        }

    } else {

        wz.user(post.author, function (e, user) {

            if (worldSelected && worldSelected.id === post.worldId) {

                wql.upsertLastRead([post.worldId, myContactID, post.id, post.id], function (err, o) {
                    if (err) {
                        return console.error(err);
                    }
                });

                var nCards = parseInt($('.world-event-number .subtitle').text()) + 1;
                $('.world-event-number .subtitle').text(nCards);

                if (post.metadata && post.metadata.operation && post.metadata.operation === 'remove') {

                    appendGenericCard(post, user, lang.postCreated, function () {
                    });

                } else if (post.metadata && post.metadata.fileType) {

                    switch (post.metadata.fileType) {

                        case 'document':
                        case 'image':
                            appendDocumentCard(post, user, lang.postCreated, function () {
                            });
                            break;

                        default:
                            appendGenericCard(post, user, lang.postCreated, function () {
                            });
                            break;

                    }

                } else if (post.metadata && post.metadata.linkType) {

                    switch (post.metadata.linkType) {

                        case 'youtube':
                            appendYoutubeCard(post, user, lang.postCreated);
                            break;

                    }

                } else {
                    appendNoFileCard(post, user, lang.postCreated);
                }


            } else {

                if (post.author === myContactID) {

                    wql.upsertLastRead([post.worldId, myContactID, post.id, post.id], function (err, o) {
                        if (err) {
                            console.error(err);
                        }
                    });

                }

            }

        });

    }

});

api.cosmos.on('userAdded', function (idWorkspace, world) {

    if (idWorkspace === myContactID) {

        myWorlds.push(world.id);
        appendWorld(world);

        if (noWorlds.css('display') != 'none') {

            noWorlds.transition({

                'opacity': 0

            }, 200, animationEffect, function () {

                noWorlds.hide();

                if ($('.world-' + world.id).length) {
                    selectWorld($('.world-' + world.id), function () {
                    });
                }

            });

        }

        if (noWorldsMobile.css('display') != 'none') {

            noWorldsMobile.transition({

                'opacity': 0

            }, 200, animationEffect, function () {

                noWorldsMobile.hide();

            });

        }

    }

    if (worldSelected && world.id === worldSelected.id) {

        getWorldUsersAsync(worldSelected);

    }

});

api.cosmos.on('userRemoved', function (idWorkspace, world) {

    if (idWorkspace != myContactID && world.id === worldSelected.id) {

        $('.user-circle').remove();
        getWorldUsersAsync(worldSelected);

    } else if (idWorkspace === myContactID) {

        if (isMobile() && worldSelected.id === world.id) {
            changeMobileView('worldSidebar');
        }

        var worldList = $('.world-' + world.id).parent();

        $('.world-' + world.id).parent().transition({

            'height': worldList.height() - $('.world.wz-prototype').outerHeight()

        }, 200);
        $('.world-' + world.id).remove();


        var index = myWorlds.indexOf(world.id);
        if (index > -1) {
            myWorlds.splice(index, 1);
        }

        $('.select-world').show();

        if ($('.worldDom').length === 0 && !isMobile()) {

            noWorlds.show();
            noWorlds.transition({

                'opacity': 1

            }, 200, animationEffect);

        }

        if ($('.worldDom').length === 0 && isMobile()) {

            noWorldsMobile.show();

            noWorldsMobile.transition({

                'opacity': 1

            }, 200, animationEffect);

        }

        if (desktop.find('.wz-app-14').length > 0) {
            desktop.trigger('message', ['remove-world-user-chat', {'world': world}]);
        } else {
            wz.app.openApp(14, ['remove-world-user-chat', {'world': world}, function (o) {
                console.log(o);
            }], 'hidden');
        }

    }

});

api.cosmos.on('nameSetted', function () {
    console.log('nameSetted');
})
api.cosmos.on('pictureSetted', function () {
    console.log('pictureSetted');
})
api.cosmos.on('postReplied', function () {
    console.log('postReplied');
})
api.cosmos.on('tagAdded', function () {
    console.log('tagAdded');
})
api.cosmos.on('userBanned', function () {
    console.log('userBanned');
})
api.cosmos.on('userUnbanned', function () {
    console.log('userUnbanned');
})
api.cosmos.on('worldPrivateSetted', function () {
    console.log('worldPrivatized');
})
api.cosmos.on('worldNameSetted', function () {
    console.log('worldNameSetted');
})

api.cosmos.on('postModified', function (post) {

    if (post.isReply) {
        $('.comment-' + post.id).find('.comment-text').html(post.content.replace(/\n/g, "<br />"));

    } else {

        if ($('.post-' + post.id).hasClass('editing')) {
            return;
        }

        if (worldSelected.id === post.worldId) {

            $('.post-' + post.id).remove();

            wz.user(post.author, function (e, user) {

                if (post.metadata && post.metadata.operation && post.metadata.operation === 'remove') {

                    appendGenericCard(post, user, lang.postCreated, function () {
                    });

                } else if (post.metadata && post.metadata.fileType) {

                    switch (post.metadata.fileType) {

                        case 'generic':
                            appendGenericCard(post, user, lang.postCreated, function () {
                            });
                            break;

                        case 'document':
                            appendDocumentCard(post, user, lang.postCreated, function () {
                            });
                            break;

                        case 'image':
                            appendDocumentCard(post, user, lang.postCreated, function () {
                            });
                            break;

                        case 'video':
                            appendGenericCard(post, user, lang.postCreated, function () {
                            });
                            break;

                        case 'music':
                            appendGenericCard(post, user, lang.postCreated, function () {
                            });
                            break;

                    }

                } else if (post.metadata && post.metadata.linkType) {

                    switch (post.metadata.linkType) {

                        case 'youtube':
                            appendYoutubeCard(post, user, lang.postCreated);
                            break;

                    }

                } else {
                    appendNoFileCard(post, user, lang.postCreated);
                }

            });

        }

    }

})

api.cosmos.on('worldNameSetted', function (worldApi) {

    var category = $('.world-' + worldApi.id).parent();
    $('.world-' + worldApi.id).remove();
    var height = category.find('.world').length * $('.world.wz-prototype').outerHeight();
    category.css({

        'height': height

    });

    appendWorld(worldApi);

    if (( worldSelected && worldApi.id === worldSelected.id ) || worldApi.owner === myContactID) {
        selectWorld($('.world-' + worldApi.id), function () {
        });
    }

});

api.cosmos.on('worldPrivateSetted', function (world) {

    console.log('asdasdasdasdasd', world);

});

api.cosmos.on('worldRemoved', function () {
    console.log('worldRemoved');
})

api.cosmos.on('postRemoved', function (postId, world) {

    var worldSelected = $('.world.active').data('world');
    if (worldSelected.id === world.id) {

        if ($('.post-' + postId)) {

            $('.post-' + postId).remove();
            if ($('.cardDom').length === 0) {

                $('.no-posts').css('opacity', '1');
                $('.no-posts').show();
                app.addClass('no-post');
                decompressCover();

            }

        }

        if ($('.comment-' + postId)) {

            var card;
            if (isMobile()) {
                card = $('.mobile-world-comments').data('card');
            } else {
                card = $('.comment-' + postId).closest('.card');
            }
            var commentsText = card.find('.comments-text');
            var ncomments = commentsText.data('num') - 1;
            if (ncomments === 1) {
                commentsText.text(ncomments + ' ' + lang.comment);
            } else {
                commentsText.text(ncomments + ' ' + lang.comments);
            }
            commentsText.data('num', ncomments);

            if (ncomments === 0) {

                var commentsSection = card.find('.comments-section');

                card.removeClass('comments-open');
                commentsSection.transition({

                    'height': 0

                }, 200, function () {

                    commentsSection.removeClass('opened');

                });

            }

            $('.comment-' + postId).remove();

        }

        if ($('.reply-' + postId)) {

            $('.reply-' + postId).remove();

        }

    }

});

searchPostInput.on('input', function () {

    searchPost($(this).val());

});

cleanPostSearch.on('click', function () {
    var searcher = $(this).closest('.search-button');
    searcher.find('input').val('')
    searchPost('');
});

openFolderButton.on('click', function () {

    wz.fs(worldSelected.volume, function (e, o) {

        o.open();

    });

});

api.upload.on('worldIconProgress', function (percent) {
    $('.loading-animation-container').show();
});

api.upload.on('fsnodeProgress', function (fsnode, percent) {
    var attachment = $('.attachment-fsnode-' + fsnode)
    attachment.find('.aux-title').text(lang.uploading + (percent.toFixed(2) * 100).toFixed() + ' %')
});

api.upload.on('fsnodeEnd', function (fsnode, fileId) {

    var attachment = $('.editing .attachment-' + fileId + ',.editing .attachment-fsnode-' + fsnode.id)

    if (attachment.length) {

        attachment.find('.attachment-title').text(fsnode.name)
        attachment.find('.icon').css('background-image', 'url(' + fsnode.icons.micro + ')');
        attachment.find('.aux-title').hide();
        attachment.addClass('from-pc').addClass('attachment-' + fileId).addClass('attachment-fsnode-' + fsnode.id);

        if ($('.attachment.uploading').length) {
            $('.uploading').removeClass('uploading')
        }

    }

});

api.upload.on('worldIconEnd', function (worldId) {

    $('.loading-animation-container').hide();
    $('.wz-groupicon-uploader-start').removeClass('non-icon');
    $('.wz-groupicon-uploader-start').addClass('custom-icon');

})

api.cosmos.on('worldIconSetted', function (world) {

    if ($('.world.active').hasClass('world-' + world.id)) {
        $('.wz-groupicon-uploader-start').css('background-image', 'url(' + world.icons.normal + '?token=' + Date.now() + ')');
        $('.world-avatar').css('background-image', 'url(' + world.icons.normal + '?token=' + Date.now() + ')');
    }

});

api.notification.on('new', function (notification) {
    checkNotifications();
})

api.notification.on('attended', function (list) {
    checkNotifications();
})

newWorldButton.on('click', function () {

    if (isMobile()) {
        changeMobileView('newWorld');
    }

});

closeNewWorld.on('click', function () {

    if (isMobile()) {

        if ($('.worldDom').length === 0) {
            noWorldsMobile.show();
            noWorldsMobile.transition({

                'opacity': 1

            }, 200, animationEffect);
        }

        mobileNewWorld.stop().clearQueue().transition({
            'transform': 'translateY(-100%)'
        }, 300, function () {
            mobileNewWorld.addClass('hide');
        });
    }

});

inviteByMail.on('click', function () {
    api.app.createView(worldSelected.id, 'inviteByMail');
});

startButton.on('click', function () {

    if (myWorlds.length < 1) {
        return $('.new-world-button').click();
    }

    noWorlds.transition({'opacity': 0}, 200, animationEffect, function () {
        noWorlds.hide();
    });

});

startButtonMobile.on('click', function () {

    noWorldsMobile.transition({'opacity': 0}, 200, animationEffect, function () {

        noWorldsMobile.hide();

        if (myWorlds.length < 1) {
            $('.new-world-button-mini').click();
        }

    });

});

app

    .on('requestPostCreate', function (e, newParams, callback) {

        if (newParams.queue) {

            var found = $('.attachment-' + newParams.queue.fsnode[newParams.fsnode.id].id + ', .attachment-fsnode-' + newParams.fsnode.id)

            if (found.length) {
                appendAttachment({fsnode: newParams.fsnode, uploaded: newParams.fsnode.fileId !== 'TO_UPDATE'}, found)
            }

            callback(found.length)

        } else {
            callback(false);
        }


    })

    .on('keydown', '.comment-text-edit', function (e) {

        var commentOnEditMode = $(this).parent();
        if (e.keyCode == 13) {

            if (!e.shiftKey) {
                commentOnEditMode.removeClass('editing');
                commentOnEditMode.data('reply').setContent(commentOnEditMode.find('.comment-text-edit').val());

                commentOnEditMode.find('.edit-button').removeClass('save');
                commentOnEditMode.find('.edit-button').text(lang.edit);
            }

        }

        if (e.keyCode == 27) {
            commentOnEditMode.removeClass('editing');
        }

    })

    .on('click', '.create-world-button.step-a', function () {

        createWorldAsync();

    })

    .on('click', '.delete-world-button', function () {

        unFollowWorld(worldSelected);
        $('.new-world-container').removeClass('editing');
        if (isMobile()) {
            changeMobileView('worldSidebar');
            mobileNewWorld.stop().clearQueue().transition({
                'transform': 'translateY(-100%)'
            }, 300, function () {
                mobileNewWorld.addClass('hide');
            });
        }

    })

    .on('click', '.create-world-button.step-b', function () {

        editWorldAsync();
        if (isMobile()) {
            mobileNewWorld.stop().clearQueue().transition({
                'transform': 'translateY(-100%)'
            }, 300, function () {
                mobileNewWorld.addClass('hide');
            });
        }
        $('.new-world-container').removeClass('editing');

    })

    .on('click', '.category-list .world', function () {

        selectWorld($(this), function () {
        });

    })

    .on('click', '.world-card.unfollowed .follow-button', function () {

        followWorldAsync($(this));

    })

    .on('click', '.invite-user-button', function () {

        $('.invite-user-container').toggleClass('popup');
        $('.invite-user-container *').toggleClass('popup');
        getFriendsAsync();

    })

    .on('click', '.world-members-button', function () {

        $('.kick-user-container').toggleClass('popup');
        $('.kick-user-container *').toggleClass('popup');
        if (worldSelected.owner === myContactID) {
            $('.kick-user-section').addClass('admin');
        } else {
            $('.kick-user-section').removeClass('admin');
        }

        getMembersAsync();

    })

    .on('click', '.card-options-section .delete', function () {

        var post = $(this).closest('.card').data('post');
        removePostAsync(post);

    })

    .on('click', '.card-options-section .edit', function () {

        if ($('.card.editing').length != 0) {
            alert(lang.editingOne);
            return;
        }
        $(this).closest('.card').addClass('editing');
        $(this).closest('.card').find('.popup').removeClass('popup');
        editPostAsync($(this).closest('.card'));

    })

    .on('click', '.delete-comment.parent', function () {

        var post = $(this).closest('.comment').data('reply');
        removePostAsync(post);

    })

    .on('click', '.delete-comment.child', function () {

        var post = $(this).closest('.replyDom').data('reply');
        removePostAsync(post);

    })

    .on('click', '.comments-footer .send-button', function () {

        addReplayAsync($(this).parent().parent().parent());

    })

    .on('click', '.replay-button', function () {

        prepareReplayComment($(this).parent());

    })

    .on('keypress', '.comments-footer .comment-input', function (e) {
        if (e.keyCode == 13) {
            if (!e.shiftKey) {
                addReplayAsync($(this).parent().parent().parent());
            }
        }
    })

    .on('focusout', '.comments-footer .comment-input', function () {
        if ($(this).val() === '') {
            $('.comments-footer .comment-input').attr('placeholder', lang.writeComment);
        }
    })

    .on('click', '.world-card-dom', function () {

        var world = $(this).data('world');
        var worldSelectable = $('.world-' + world.id);
        if (worldSelectable.length > 0) {

            if (isMobile()) {
                changeMobileView('worldSidebar');
            } else {
                $('.close-explore').click();
            }
            worldSelectable.click();

        }

    })

    .on('click', '.doc-preview', function () {

        var attachment = $(this);
        var fsnode = $(this).data('fsnode');
        var fsnodeList = [];
        $.each(attachment.closest('.card').find('.doc-preview:not(.wz-prototype)'), function (i, attachment) {
            fsnodeList.push($(attachment).data('fsnode'));
        });

        fsnode.open(fsnodeList.filter(function (item) {
            return item.type === fsnode.type;
        }).map(function (item) {
            return item.id;
        }), function (error) {

            if (error) {
                if (isMobile()) {
                    navigator.notification.alert('', function () {
                    }, lang.fileCanNotOpen);
                } else {
                    fsnode.openLocal();
                }
                console.log(error);
            }

        });

    })

    .on('contextmenu', '.doc-preview', function () {

        var fsnode = $(this).data('fsnode');
        var menu = api.menu();

        menu.addOption(lang.openFolder, function () {

            api.fs(fsnode.parent, function (error, node) {
                node.open();
            })

        })

        menu.addOption(lang.download, function () {

            fsnode.download();

        })

        menu.render();

    })

    .on('click', '.friend-list .friend', function () {

        $(this).find('.ui-checkbox').toggleClass('active');

    })

    .on('click', '.ui-checkbox', function (e) {

        e.stopPropagation();
        $(this).toggleClass('active');

    })

    .on('click', '.cancel-attachment', function () {
        $(this).closest('.attachment').remove();
    })

    .on('click', '.cancel-new-card', function () {

        $(this).closest('.card').removeClass('editing');
        $(this).closest('.card').find('.card-options').removeClass('hide');
    })

    .on('click', '.save-new-card', function () {

        if ($(this).closest('.card').hasClass('uploading')) {
            return;
        }

        var card = $(this).closest('.card');
        var post = card.data('post');

        var prevTitle = card.find('.title-input').data('prev');
        var newTitle = card.find('.title-input').val();

        var prevContent = card.find('.content-input').data('prev');
        var newContent = card.find('.content-input').val();

        var prevFsnode = card.find('.attach-list').data('prev');
        var newAttachments = card.find('.attachment:not(.wz-prototype)');
        var newFsnodeIds = [];
        var newFsnode = [];

        $.each(newAttachments, function (i, attachment) {
            newFsnodeIds.push(parseInt($(attachment).data('fsnode').id));
            newFsnode.push($(attachment).data('fsnode'));
        })

        var newMetadata = checkMetadata(newContent, newFsnode);
        if (wz.tool.arrayDifference(prevFsnode, newFsnodeIds).length || wz.tool.arrayDifference(newFsnodeIds, prevFsnode).length) {
            post.setFSNode(newFsnodeIds, function () {
                post.setMetadata(newMetadata, function () {
                    post.setTitle(newTitle, function () {
                        post.setContent(newContent, function (e, post) {
                            setPost(post);
                        });
                    });
                });
            });
        } else if (isYoutubePost(newContent)) {
            newMetadata.linkType = 'youtube';
            post.setMetadata(newMetadata, function () {
                post.setTitle(newTitle, function () {
                    post.setContent(newContent, function (e, post) {
                        setPost(post);
                    });
                });
            });
        } else if (prevTitle != newTitle || prevContent != newContent) {
            post.setTitle(newTitle, function () {
                post.setContent(newContent, function (e, post) {
                    setPost(post);
                });
            });
        } else {
            $(this).closest('.card').removeClass('editing');
            $(this).closest('.card').find('.card-options').removeClass('hide');
        }

    })

    .on('click', '.card-content.edit-mode .attachments, .card-content.edit-mode .attachments i, .card-content.edit-mode .attachments div', function () {
        if (isMobile()) {
            attachFromInevio();
        } else {
            $(this).closest('.card').find('.attach-select').addClass('popup');
        }
    })

    .on('click', '.attach-select .inevio', function () {
        attachFromInevio($(this).closest('.card'));
    })

    .on('upload-prepared', function (e, uploader) {

        uploader(worldSelected.volume, function (e, fsnode) {

            appendAttachment({fsnode: fsnode, uploaded: false, card: $('.card.editing')});

        });

    })

    .on('selectPost', function (e, params) {

        selectWorld($('.world-' + params.world), function () {
            $('.search-button').addClass('popup');
            $('.search-button input').val(params.title);
            searchPost(params.title);
        });

    })

    .on('contextmenu', '.worldDom', function () {

        var menu = api.menu();
        var worldDom = $(this);
        var world = worldDom.data('world');
        var isMine = world.owner === myContactID ? true : false;

        menu.addOption(lang.searchPost, function () {

            if (worldDom.hasClass('active')) {

                $('.search-button').click();

            } else {

                selectWorld(worldDom, function () {
                    $('.search-button').click();
                });

            }

        })

        if (isMine) {

            menu.addOption(lang.editWorld, function () {

                if (worldDom.hasClass('active')) {

                    $('.new-world-container').data('world', world);
                    editWorld(world);

                } else {

                    selectWorld(worldDom, function () {
                        editWorld(world);
                    });

                }

            });

        } else {

            menu.addOption(lang.abandonWorld, function () {

                unFollowWorld(world);

            }, 'warning');

        }

        menu.render();

    })

    .on('click', '.world-context-menu', function (e) {

        e.preventDefault();
        e.stopPropagation();
        var world = $(this).parent();
        world.find('.world-option:not(.wz-prototype)').remove();
        $('.world-options, .world-options *').removeClass('popup');
        world.find('.world-options, .world-options *').addClass('popup');
        var option = world.find('.world-option.wz-prototype').clone();
        option.removeClass('wz-prototype').addClass('popup');

        var isMine = $(this).parent().data('world').owner === myContactID ? true : false;
        if (isMine) {
            option.addClass('editWorldOption').find('span').text(lang.editWorld);
        } else {
            option.addClass('removeWorldOption').find('span').text(lang.abandonWorld);
        }

        $('.world-options').append(option);
    })

    .on('click', '.editWorldOption', function () {

        var world = $(this).closest('.worldDom').data('world');
        editWorld(world);
        $('.new-world-container').data('world', world);
        changeMobileView('newWorld');

    })

    .on('click', '.removeWorldOption', function () {
        unFollowWorld(worldSelected);
    })

    .on('swiperight', function () {
        if (isMobile() && mobileView == 'worldContent') {
            $('.mobile-world-content .go-back').click();
        }
    })

    .on('click', '.comments-opener', function () {
        if (isMobile()) {
            changeMobileView('worldComments');
            var card = $(this).closest('.card');
            var post = card.data('post');
            setRepliesAsyncOnlyAppendMobile(card, post);
            mobileWorldComments.data('post', post);
        }
        attendCommentNotification($(this).parent().parent().data('post'));

    })

    .on('click', '.close-comments', function () {
        changeMobileView('worldContent');
    })

    .on('click', '.mobile-explore .go-back', function () {
        changeMobileView('worldSidebar');
    })

    .on('click', '.mobile-world-content .go-back', function () {
        changeMobileView('worldSidebar');
    })

    .on('click', '.cancel-search', function () {
        $('.mobile-world-content').removeClass('searching');
    })

    .on('click', '.close-new-post', function () {
        if (isMobile()) {
            $('.attachment:not(.wz-prototype)').remove();
            changeMobileView('worldContent');
        }
    })

    .on('click', '.post-new-card', function () {
        if (isMobile()) {
            if ($('.new-card-input').val().trim() === '') {
                navigator.notification.alert('', function () {
                }, lang.noInfo);
            } else {
                changeMobileView('worldContent');
            }
        }
    })

    .on('focus', '.new-world-name input', function () {
        if (isMobile()) {
            $('.create-world-button').addClass('hide');
            $(this).closest('.mobile-new-world').addClass('reduce-margin');
        }
    })

    .on('blur', '.new-world-name input', function () {
        if (isMobile()) {
            $('.create-world-button').removeClass('hide');
            $(this).closest('.mobile-new-world').removeClass('reduce-margin');
        }
    })

    .on('backbutton', function (e) {

        e.stopPropagation();

        switch (mobileView) {

            case 'worldContent':
                var view = $('.mobile-world-content');
                if (view.hasClass('searching')) {
                    view.removeClass('searching');
                } else if (view.find('.editing').length > 0) {
                    view.find('.editing .cancel-new-card').click();
                } else {
                    changeMobileView('worldSidebar');
                }
                break;
            case 'worldComments':
                changeMobileView('worldContent');
                break;
            case 'newPost':
                changeMobileView('worldContent');
                break;
            case 'explore':
                changeMobileView('worldSidebar');
                break;
            case 'newWorld':
                mobileNewWorld.stop().clearQueue().transition({
                    'transform': 'translateY(-100%)'
                }, 300, function () {
                    mobileNewWorld.addClass('hide');
                });
                break;
        }

    })

    .on('app-parm', function () {
        console.log('he vuelto');
    })

    .on('click', '.notification', function () {

        var notification = $(this).data('notification');
        var world = $('.world-' + notification.data.world);

        world.data('world').getPost(notification.data.post, function (err, post) {
            console.log(err, post);
        })

        console.log(notification);

        selectWorld($('.world-' + notification.data.world), function () {
            //$( '.search-button' ).addClass( 'popup' );
            //$( '.search-button input' ).val( notification.data.parent );
            if (notification.data.type === 'reply') {
                searchPostForComment({
                    'world': notification.data.world,
                    'post': notification.data.parent,
                    'isReply': true
                });
            } else {
                searchPostForComment({
                    'world': notification.data.world,
                    'post': notification.data.post,
                    'isReply': false
                });
            }

        });

    })

    .on('click', '.page', function () {
        $('.page.active').removeClass('active');
        $(this).addClass('active');
        cleanWorldCards();
        getPublicWorldsAsync({
            page: $(this).find('span').text(),
            withAnimation: true
        });
    })

    .on('click', '.next-page', function () {
        nextPage();
    })

    .on('click', '.back-page', function () {
        prevPage();
    })

    .on('click', '.kick-out-button', function () {
        worldSelected.removeUser($(this).parent().data('user').id, function (err) {
            if (err) {
                console.error(err);
            }
            api.cosmos(worldSelected.id, function (err, worldApi) {
                closeKickUsers.click();
                $('.world-' + worldSelected.id).data('world', worldApi);
                worldMembersButton.text(worldApi.users + ' ' + lang.worldHeader.members);
                worldSelected = worldApi;
            });

        });
    })

$('.scrollable-content').on('scroll', function () {
    if (isMobile()) {
        app.find('.popup').removeClass('popup');
    }
})

$('.explore-container').on('scroll', function () {
    if ($(this).scrollTop() > 200) {
        $('.explore-top-bar').addClass('active');
    } else {
        $('.explore-top-bar').removeClass('active');
    }
});

$('.world-selected').on('scroll', function () {
    if ($(this).scrollTop() > 60) {
        $('.world-header-min').addClass('active');
    } else {
        $('.world-header-min').removeClass('active');
    }
});

$('.world-selected').on('touchmove', function () {
    console.log($(this).offset().top);
    if ($(this).offset().top < -60 && !$(this).hasClass('active')) {
        $('.world-header-min').addClass('active');
    } else if ($(this).hasClass('active')) {
        $('.world-header-min').removeClass('active');
    }
});

$('.explore-top-bar .search-bar input').on('input', function () {

    searchWorldCard.val($(this).val());
    searchWorldCard.trigger('input');

});

$('.activate-search-bar').on('click', function () {
    if (isMobile()) {
        $('.world-search-bar').addClass('active');
    }
});

$('.cancel-search').on('click', function () {
    if (isMobile()) {
        $('.world-search-bar').removeClass('active');
    }
});

//Functions
var initCosmos = function () {

    console.log(api.cosmos);

    if (!isMobile()) {
        app.css({'border-radius': '6px', 'background-color': '#2c3238'});
    } else {
        setMobile();
    }

    initTexts();
    wql.isFirstOpen([myContactID], function (e, o) {

        if (o.length === 0 && !isMobile()) {

            noWorlds.show();

            noWorlds.css({
                'opacity': 1
            });

            wql.firstOpenDone([myContactID], function (err, o) {
                if (err) console.error(err);
            });

        }

        if (( o.length === 0 || $('.worldDom').length === 0 ) && isMobile()) {

            noWorldsMobile.show();
            noWorldsMobile.css({
                'opacity': 1
            });

            wql.firstOpenDone([myContactID], function (err, o) {
                if (err) console.error(err);
            });

        }

    });

    getMyWorldsAsync();
    checkNotifications();

    if (params && params.action === 'selectPost') {
        selectWorld($('.world-' + params.world), function () {
            $('.search-button').addClass('popup');
            $('.search-button input').val(params.title);
            searchPost(params.title);
        });
    }

}

var initTexts = function () {

    console.log( 'CHECK IF PERSONAL' )
    console.log( api.system.workplace().type )
    if( api.system.workplace().type == 'personal' ){
        console.log( 'AÑADO LA CLASE A LA APP' )
        console.log( app )
        app.addClass( 'personal' )
      }

    //Start
    $('.no-worlds .title').text(lang.welcome);
    $('.no-worlds .subtitle').text(lang.intro);
    $('.no-worlds .subtitle2').text(lang.intro2);
    $('.no-worlds .chat-feature .description').html(lang.feature1);
    $('.no-worlds .files-feature .description').html(lang.feature2);
    $('.no-worlds .posts-feature .description').html(lang.feature3);
    $('.start-button-no-worlds span').text(lang.start);
    $('.new-world-button-no-worlds span, .new-world-button span').text(lang.createWorld);

    $('.no-worlds-mobile .title').text(lang.welcome);
    if (app.width() < 360) {
        $('.no-worlds-mobile .subtitle').html(lang.intro);
    } else {
        $('.no-worlds-mobile .subtitle').html(lang.introMobile);
    }
    $('.no-worlds-mobile .subtitle2').text(lang.intro2);
    $('.no-worlds-mobile .chat-feature .description').html(lang.feature1);
    $('.no-worlds-mobile .files-feature .description').html(lang.feature2);
    $('.no-worlds-mobile .posts-feature .description').html(lang.feature3);

    //Sidebar
    $('.notifications-title span').text(lang.activity);

    //World selected
    $('.select-world span').text(lang.selectWorld);

    //World header
    $('.invite-user-button').text(lang.worldHeader.invite);
    $('.open-chat-button span').text(lang.worldHeader.chatButton);
    $('.open-folder-button span').text(lang.worldHeader.folderButton);
    $('.search-post input').attr('placeholder', lang.worldHeader.searchPost);

    if (isMobile()) {
        $('.stop-follow span').text(lang.exit);
    } else {
        $('.stop-follow span').text(lang.unfollowWorld);
    }

    //Posts
    // $( '.new-post-button .my-avatar' ).css( 'background-image', 'url(' + me.avatar.tiny + ')' );
    //   card.find( '.card-user-avatar' ).css( 'background-image' , 'url(' + user.avatar.normal + ')' );
    $('.new-post-button .my-avatar').css('background-image', 'url(' + me.avatar.normal + ')');
    $('.new-post-button .something-to-say').text(lang.cardsList.somethingToSay);
    $('.no-posts .no-post-to-show').text(lang.cardsList.noPostToShow);
    $('.no-posts .left-side span').text(lang.noPosts);
    $('.no-posts .right-side span').text(lang.createNewPost);
    $('.card-options-section .delete span').text(lang.deletePost);
    $('.card-options-section .edit span').text(lang.editPost);
    $('.card-content.edit-mode .title-input').attr('placeholder', lang.writeTitle);
    $('.card-content.edit-mode .content-input').attr('placeholder', lang.writeDescription);
    $('.send-button span').text(lang.send);
    $('.comments-footer .comment-input').attr('placeholder', lang.writeComment);
    $('.cancel-new-card span').text(lang.cancel);
    $('.save-new-card span').text(lang.save);
    $('.attachments span').text(lang.addFiles);
    $('.attach-select .inevio span, .attach-select-new-post .inevio span').text(lang.uploadInevio);
    $('.attach-select .pc span, .attach-select-new-post .pc span').text(lang.uploadPC);
    $('.mobile-world-comments .comments-title').text(lang.comments);

    //World users
    $('.invite-user-container .ui-input-search input, .kick-user-container .ui-input-search input').attr('placeholder', lang.search);
    $('.cancel-invite-user span').text(lang.cancel);
    $('.invite-user span').text(lang.invite);
    $('.invite-by-mail span').text(lang.inviteByMail);
    $('.kick-out-button span').text(lang.worldUsers.kickOut);

    //Explore
    $('.explore-text, .search-title').text(lang.explore);
    $('.tend-text').text(lang.tend);
    $('.follow-button span').text(lang.follow);
    $('.search-bar input').attr('placeholder', lang.search);
    $('.next-page .next-text').text(lang.next);
    $('.back-page .back-text').text(lang.previous);

    //New world
    $('.new-world-title .title').text(lang.worldCreation);
    $('.category .public').text(lang.publics);
    $('.category .private').text(lang.privates);
    $('.new-world-title .step-a').text(lang.stepa);
    $('.new-world-title .step-b').text(lang.stepb);
    $('.new-world-name span').text(lang.worldName);
    $('.new-world-avatar > span').text(lang.avatarBack);
    $('.change-background-button span').text(lang.changeBack);
    $('.new-world-desc span').text(lang.worldDesc);
    $('.new-world-privacy > span').text(lang.privacy);
    $('.option.public .title').text(lang.publicWorld);
    $('.option.public .desc').text(lang.publicDesc);
    $('.option.hidden .title').text(lang.privateWorld);
    $('.option.hidden .desc').text(lang.privateDesc);
    $('.option.public > span').text(lang.public);
    $('.option.hidden > span').text(lang.private);
    $('.create-world-button.step-a span').text(lang.createWorldShort);

}

var getMyWorldsAsync = function (options) {

    var myWorldsApi = app.data('myWorlds');
    console.log(myWorldsApi);

    if (myWorldsApi) {

        $.each(myWorldsApi, function (i, world) {

            appendWorld(world);
            myWorlds.push(world.id);

        });

        $.each($('.category'), function (i, category) {

            if ($(category).find('.world-list .world').length === 0) {
                $(category).find('.world-list').transition({
                    'height': '0px'
                }, 200);
                $(category).addClass('closed');
            }


        });

    }

};


//Albeniz****************************************
$('.tend-list').on('scroll', function () {
    // checkScrollDistance()

    //Checks if worlds are being loaded
    // var loadingMoreWorlds = false

    //Total height of the scroll
    var totalHeight = $('.tend-list')[0].scrollHeight
    // console.log('Total Height: ' + totalHeight)

    //Distance scrolled from the top
    var distanceScrolled = $('.tend-list').scrollTop()
    // console.log('Distance Scrolled: ' + distanceScrolled)

    //Distance left to end of the scroll
    var remainingDistance = totalHeight - distanceScrolled
    // console.log('Distance remaining to the end: ' + remainingDistance)

    //Distance scrolled independently from the total height of the scroll
    // var totalDistance = distanceScrolled + remainingDistance

    console.log('LOADING WORLDS IS ' + loadingWorlds)

    if ((remainingDistance < 520) && (loadingWorlds === false)) {
        console.log('Displaying LOADING IMG')
        $('.loading-img').css('display', 'block')
        extendWorldListScroll()
    }

    if (loadingWorlds === true) {
        console.log('IM LOADING WORLDS! WAIT.....')
    }

})


var extendWorldListScroll = function () {

    //Im loading worlds, dont load more worlds yet
    loadingWorlds = true

    //Hide loading image
    $('.loading-img').css('display', 'none')

    //Next world page
    worldsScrollPageCount++
    console.log('page count is ' + worldsScrollPageCount)

    //Load 20 more worlds
    console.log('Load more worlds')
    getPublicWorldsAsync({
        page: worldsScrollPageCount,
        withAnimation: true
    })


    console.log('Worlds have loaded')
}

//Albeniz****************************************

var getPublicWorldsAsync = function (options) {


    var interval = {
        from: (options.page - 1) * paginationLimit,
        to: options.page * paginationLimit
    }

    api.cosmos.list(filterActive, null, {'from': interval.from, 'to': interval.to}, function (err, worlds, nResults) {

        console.log('Mundos!: ', worlds)
        if (err) {
            console.error(err);
            return;
        }

        // Query desfasada
        if (options.filtering && searchWorldQuery != options.searchWorldQueryCopy) {
            return;
        }

        if (options.page === 1) {
            totalPages = Math.ceil(nResults / paginationLimit);
            actualPageInterval = 1;
            addPages();
        }

        showingWorlds = {'from': interval.from, 'to': interval.to}

        /*worlds.reverse().forEach(function (world) {
            appendWorldCard(world);
        });*/

        appendWorldCards(worlds)

        if (options.withAnimation) {
            exploreAnimationIn();
        }

        loadingWorlds = false

    });


};

var appendWorld = function (worldApi) {

    if ($('.world-' + worldApi.id).length > 0) {
        return;
    }

    var world = worldPrototype.clone();
    world.removeClass('wz-prototype').addClass('world-' + worldApi.id).addClass('worldDom');
    world.find('.world-name').text(worldApi.name);

    if (worldApi.owner === myContactID) {
        world.addClass('editable')
    }

    if (isMobile()) {
        world.find('.world-icon').css('background-image', 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')');
    } else {
        world.find('.world-icon').css('border-color', colors[worldApi.id % colors.length]);
    }

    var category;

    if (worldApi.isPrivate) {
        category = $('.private-list');
    } else {
        category = $('.public-list');
    }

    appendWorldInOrder(category, world, worldApi);
    var height = category.find('.world').length * $('.world.wz-prototype').outerHeight();
    category.css({

        'height': height

    });

    world.data('world', worldApi);

}

var isYoutubePost = function (text) {
    var isYoutube = false;
    text.split(' ').forEach(function (word) {
        word.split('\n').forEach(function (word) {
            if (word.startsWith('www.youtu') || word.startsWith('youtu') || word.startsWith('https://www.youtu') || word.startsWith('https://youtu') || word.startsWith('http://www.youtu') || word.startsWith('http://youtu')) {
                isYoutube = true;
            }
        });
    });
    return isYoutube;
}

var appendWorldInOrder = function (category, world, worldApi) {

    var worlds = [];
    var worldsAppended = category.find('.world');

    if (worldsAppended.length === 0) {
        category.append(world);
    } else {

        var appended = false;
        for (var i = 0; i < worldsAppended.length; i++) {
            worlds.push($(worldsAppended[i]).data('world'));
        }

        worlds.forEach(function (worldAppended) {

            if (sortByName(worldApi, worldAppended) < 0 && !appended) {
                $('.world-' + worldAppended.id).before(world);
                appended = true;
            }

        });

        if (!appended) {
            category.append(world);
        }
    }
}

//NOT IN USE ANYMORE
// var appendWorldCard = function (worldApi) {
//
//     var world = worldCardPrototype.clone();
//     world.removeClass('wz-prototype').addClass('world-card-' + worldApi.id).addClass('world-card-dom');
//     var worldTitle = worldApi.name;
//     if (worldTitle.length > 32) {
//         worldTitle = worldTitle.substr(0, 29) + '...';
//     }
//     world.find('.world-title-min').text(worldTitle);
//     world.find('.world-avatar-min').css('background-image', 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')');
//
//     if (worldApi.users) {
//         world.find('.world-followers').text(worldApi.users + ' ' + lang.followers);
//     }
//
//     if (myWorlds.indexOf(worldApi.id) != -1) {
//
//         world.addClass('followed').removeClass('unfollowed');
//         world.find('.follow-button span').text(lang.following);
//
//     }
//
//     $('.world-card.wz-prototype').after(world);
//
//     world.data('world', worldApi);
//
// }

//ALBENIZ*****************************************************
//Instead of appending worlds into the HTML list one by one, gets all the new worlds, puts them in a list
//and appends the list into the HTML list at once.
var appendWorldCards = function (worlds) {

    var listToAppend = []

    if (!worlds) {
        return
    }

    worlds.forEach(function (worldApi, index) {

        var world = worldCardPrototype.clone();
        world.removeClass('wz-prototype').addClass('world-card-' + worldApi.id).addClass('world-card-dom');
        var worldTitle = worldApi.name;

        if (worldTitle.length > 32) {
            worldTitle = worldTitle.substr(0, 29) + '...';
        }
        world.find('.world-title-min').text(worldTitle);
        world.find('.world-avatar-min').css('background-image', 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')');

        if (worldApi.users) {
            world.find('.world-followers').text(worldApi.users + ' ' + lang.followers);
        }

        if (myWorlds.indexOf(worldApi.id) != -1) {

            world.addClass('followed').removeClass('unfollowed');
            world.find('.follow-button span').text(lang.following);
        }

        world.data('world', worldApi);

        listToAppend.push(world)

        if (index === worlds.length - 1) {
            $('.mobile-explore .tend-grid').append(listToAppend)
        }
    })
}
//ALBENIZ**********************************************************


var createWorldAsync = function () {

    var worldName = $('.new-world-name input').val();

    if (!worldName) {

        var dialog = api.dialog();

        dialog.setText(lang.worldTitleMandatory);
        dialog.setButton(0, lang.accept, 'red');
        dialog.render();

        return;
    }

    wz.cosmos.create(worldName, null, true, null, function (e, o) {

        if (e) {
            console.log(e);
        }
        createChat(o);

    });

}

var editWorldAsync = function () {

    var worldApi = $('.new-world-container').data('world');
    var isPrivate;
    if (api.system.workspace().username.indexOf('demo') === 0) {
        isPrivate = true;
    } else {
        isPrivate = $('.private-option').hasClass('active');
    }
    var editing = $('.new-world-container').hasClass('editing');
    var name = worldApi.name;
    $('.wz-groupicon-uploader-start').attr('data-groupid', worldApi.id);

    if (editing) {
        name = $('.new-world-name input').val();
    }

    if (!worldApi) {
        return;
    }

    worldApi.isPrivate = isPrivate;
    worldApi.description = $('.new-world-desc textarea').val();
    worldApi.name = name;

    worldApi.set(worldApi, function (err, o) {

        if (err) {
            return console.error(err);
        }
        /* COMENTAR LUEGO
    $( '.world-' + worldApi.id ).remove();
    appendWorld( worldApi );
    $( '.world-' + worldApi.id ).click();
    */
        $('.privacy-options .option').removeClass('active');
        $('.private-option').addClass('active');

    });

}

var selectWorld = function (world, callback) {

    //Not select allowed while animations
    if (app.hasClass('animated')) {
        return;
    }

    if (isMobile()) {
        changeMobileView('worldContent');
    }

    // Set initial status
    app.addClass('selectingWorld');
    $('.clean').remove();
    $('.category-list .world').removeClass('active');
    world.addClass('active');
    searchPostInput.val('');
    searchPost('');

    var worldApi = world.data('world');
    if (!worldApi) {
        return;
    }

    worldSelected = worldApi;
    app.data('worldSelected', worldSelected)

    // Set info
    worldTitle.text(worldApi.name);
    worldMembersButton.text(worldApi.users + ' ' + lang.worldHeader.members);
    worldAvatar.css('background-image', 'url(' + worldApi.icons.normal + '?token=' + Date.now() + ')');

    getWorldPostsAsync(worldApi, {init: 0, final: 6}, function () {
        attendWorldNotification(worldApi.id);
        callback();
        app.removeClass('selectingWorld');
    });

    $('.select-world').hide();

}

var appendUserCircle = function (i, user, inviteIndex) {

    var userCircle = userCirclePrototype.clone();
    userCircle.removeClass('wz-prototype').addClass('user-' + user.idWorkspace).addClass('clean');
    userCircle.css('background-image', 'url(' + user.avatar.tiny + ')');
    userCircle.data('user', user);

    if ($('.user-circle.user-' + user.idWorkspace).length === 0) {
        $('.user-circles-section').append(userCircle);
    }

    if (i == inviteIndex) {
        return;
    }

    if (user.idWorkspace === myContactID) {
        user.name = lang.me;
    }

    switch (i) {
        case 0:

            $('.user-preview.a').css('background-image', 'url(' + user.avatar.tiny + ')');
            $('.user-preview.a .user-hover span').text(user.name);
            break;

        case 1:

            $('.user-preview.b').css('background-image', 'url(' + user.avatar.tiny + ')');
            $('.user-preview.b .user-hover span').text(user.name);
            break;

        case 2:

            $('.user-preview.c').css('background-image', 'url(' + user.avatar.tiny + ')');
            $('.user-preview.c .user-hover span').text(user.name);
            break;

        case 3:

            $('.user-preview.d').css('background-image', 'url(' + user.avatar.tiny + ')');
            $('.user-preview.d .user-hover span').text(user.name);
            break;

    }

}

var filterWorldCards = function (options) {

    cleanWorldCards();
    filterActive = options.filter === '' ? null : options.filter;
    getPublicWorldsAsync({
        page: 1,
        filtering: true,
        searchWorldQueryCopy: options.searchWorldQueryCopy
    });

}

var startsWithWorldCards = function (wordToCompare) {

    return function (index, element) {

        return $(element).find('.world-title-min').text().toLowerCase().indexOf(wordToCompare.toLowerCase()) !== -1;

    }

}

var filterFriends = function (filter) {

    var friends = $('.friend');
    friends.show();
    var friendsToShow = friends.filter(startsWithFriends(filter));
    var friendsToHide = friends.not(friendsToShow);
    friendsToHide.hide();

}

var filterMembers = function (filter) {

    var members = $('.member');
    members.show();
    var membersToShow = members.filter(startsWithFriends(filter));
    var membersToHide = members.not(membersToShow);
    membersToHide.hide();

}

var startsWithFriends = function (wordToCompare) {

    return function (index, element) {

        return $(element).find('span').text().toLowerCase().indexOf(wordToCompare.toLowerCase()) !== -1;

    }

}

var followWorldAsync = function (worldCard) {

    var world = worldCard.parent().data('world');

    if (myWorlds.indexOf(world.id) != -1) {
        return;
    }

    if (api.system.workspace().username.indexOf('demo') === 0 && !world.isPrivate) {
        alert(lang.noPublicWorlds);
        return;
    }


    world.addUser(myContactID, function (e, o) {

        worldCard.find('span').text(lang.following);
        worldCard.parent().addClass('followed');

    });

}

var getFriendsAsync = function () {

    $('.invite-user-title').html('<i>' + lang.worldUsers.invitePeople + '</i>' + lang.worldUsers.to + '<figure>' + worldSelected.name + '</figure>');

    $('.friendDom').remove();
    friendSearchBox.val('');
    filterFriends('');

    api.user.friendList(false, function (error, friends) {

        friends.sort(function (a, b) {
            if (a.fullName < b.fullName) return -1;
            if (a.fullName > b.fullName) return 1;
            return 0;
        });

        $.each(friends, function (i, user) {

            appendFriend(user);

        });

    });

}

var getMembersAsync = function () {

    $('.kick-user-title').html('<i>' + lang.worldUsers.kickPeople + '</i>' + lang.worldUsers.from + '<figure>' + worldSelected.name + '</figure>');

    $('.memberDom').remove();
    membersSearchBox.val('');
    filterMembers('');

    var membersList = [];

    worldSelected.getUsers(function (error, members) {

        asyncEach(members, function (member, finish) {

            api.user(member.idWorkspace, function (err, user) {

                if (member.isAdmin) {
                    user.isAdmin = true;
                }

                membersList.push(user);
                finish();

            });

        }, function () {

            membersList.sort(function (a, b) {
                if (a.fullName < b.fullName) return -1;
                if (a.fullName > b.fullName) return 1;
                return 0;
            });

            $.each(membersList, function (i, member) {

                appendMember(member);

            });

        });

    });

}

var appendFriend = function (user) {

    var friend = friendPrototype.clone();
    friend.removeClass('wz-prototype').addClass('user-' + user.idWorkspace).addClass('friendDom');

    friend.find('span').text(user.fullName);
    friend.find('.avatar').css('background-image', 'url(' + user.avatar.normal + ')');

    var invited = false;
    $.each(worldSelectedUsrs, function (i, usr) {

        if (usr.idWorkspace == user.idWorkspace) {

            invited = true;

        }

    });

    if (!invited) {

        $('.friend-list').append(friend);

    }

    friend.data('user', user);

}

var appendMember = function (user) {

    var member = memberPrototype.clone();
    member.removeClass('wz-prototype').addClass('user-' + user.idWorkspace).addClass('memberDom');

    if (user.isAdmin) {
        member.addClass('isAdmin');
    }

    member.find('.member-name').text(user.fullName);
    member.find('.avatar').css('background-image', 'url(' + user.avatar.normal + ')');

    $('.members-list').append(member);
    member.data('user', user);

}

var inviteUsers = function () {

    var users = $('.friend .ui-checkbox.active').parent();

    asyncEach($.makeArray(users), function (usr, checkEnd) {

        var user = $(usr).data('user');

        worldSelected.addUser(user.idWorkspace, function (e, o) {

            checkEnd();

        });

    }, function () {

        api.cosmos(worldSelected.id, function (err, worldApi) {
            $('.world-' + worldSelected.id).data('world', worldApi);
            worldMembersButton.text(worldApi.users + ' ' + lang.worldHeader.members);
            worldSelected = worldApi;
        });

    });

}

var asyncEach = function (list, step, callback) {

    var position = 0;
    var closed = false;
    var checkEnd = function (error) {

        if (closed) {
            return;
        }

        position++;

        if (position === list.length || error) {

            closed = true;

            callback(error);

            // Nullify
            list = step = callback = position = checkEnd = closed = null;

        }

    };

    if (!list.length) {
        return callback();
    }

    list.forEach(function (item) {
        step(item, checkEnd);
    });

};

var checkContains = function (base, contains) {

    return base.indexOf(contains) != -1;

}

var getWorldPostsAsync = function (world, interval, callback) {

    if (interval.init === 0) {
        world.getPosts({from: 0, to: 100000}, function (e, posts) {
            $('.world-event-number .subtitle').text(posts.length);
        });
    }

    world.getPosts({from: interval.init, to: interval.final, withFullUsers: true}, function (e, posts) {

        if (interval.init === 0) {

            $('.cardDom').remove();

            if (posts.length > 0) {
                $('.no-posts').css('opacity', '0');
                $('.no-posts').hide();
                app.removeClass('no-post');
            } else {
                $('.no-posts').css('opacity', '1');
                $('.no-posts').show();
                app.addClass('no-post');
            }

        }

        worldSelectedDom.data('lastCard', interval.final);

        var postPromises = [];

        $.each(posts, function (i, post) {

            var promise = $.Deferred();
            postPromises.push(promise);

            if (post.metadata && post.metadata.operation === 'remove') {

                appendGenericCard(post, post.authorObject, lang.postCreated, function () {
                    promise.resolve();
                });

            } else if (post.metadata && post.metadata.fileType) {

                switch (post.metadata.fileType) {

                    case 'generic':
                        appendGenericCard(post, post.authorObject, lang.postCreated, function () {
                            promise.resolve();
                        });
                        break;

                    case 'document':
                        appendDocumentCard(post, post.authorObject, lang.postCreated, function () {
                            promise.resolve();
                        });
                        break;

                    case 'image':
                        appendDocumentCard(post, post.authorObject, lang.postCreated, function () {
                            promise.resolve();
                        });
                        break;

                    case 'video':
                        appendGenericCard(post, post.authorObject, lang.postCreated, function () {
                            promise.resolve();
                        });
                        break;

                    case 'music':
                        appendGenericCard(post, post.authorObject, lang.postCreated, function () {
                            promise.resolve();
                        });
                        break;

                }

            } else if (post.metadata && post.metadata.linkType) {

                switch (post.metadata.linkType) {

                    case 'youtube':
                        appendYoutubeCard(post, post.authorObject, lang.postCreated);
                        promise.resolve();
                        break;

                }

            } else {
                appendNoFileCard(post, post.authorObject, lang.postCreated);
                promise.resolve();
            }

        });

        loadingPost = false;

        $.when.apply(null, postPromises).done(function () {
            callback();
        });

    });

}

var appendNoFileCard = function (post, user, reason) {

    var card = genericCardPrototype.clone();
    card.removeClass('wz-prototype').addClass('post-' + post.id).addClass('cardDom');

    card.find('.doc-preview').hide();

    if (post.title === '') {
        card.find('.title').hide();
    } else {
        card.find('.title').text(post.title);
    }

    if (post.content === '') {
        card.find('.desc').hide();
    } else {
        card.find('.desc').html(post.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));
    }

    card.find('.desc').find('a').each(function () {

        if (!URL_REGEX.test($(this).attr('href'))) {
            $(this).attr('href', 'http://' + $(this).attr('href'));
        }

    });

    card.find('.card-user-avatar').css('background-image', 'url(' + user.avatar.normal + ')');
    card.find('.card-user-name').text(user.fullName);
    card.find('.time-text').text(timeElapsed(new Date(post.created)));


    if (!isMobile()) {
        setRepliesAsync(card, post);
    } else {
        setRepliesAsyncWithoutAppendMobile(card, post);
    }
    appendCard(card, post);

}

var appendGenericCard = function (post, user, reason, callback) {

    var card = genericCardPrototype.clone();
    card.removeClass('wz-prototype').addClass('post-' + post.id).addClass('cardDom');

    var fsnodes = [];
    post.fsnode.forEach(function (fsnode) {

        var promise = $.Deferred();
        fsnodes.push(promise);

        wz.fs(fsnode, function (e, fsnode) {
            promise.resolve(e ? null : fsnode);
        });

    });

    $.when.apply(null, fsnodes).done(function () {

        var fsnodes = arguments;

        for (var i = 0; i < fsnodes.length; i++) {

            var fsnode = fsnodes[i];

            if (!fsnode) {
                break
            }

            if (card.find('.attachment-' + fsnode.id).length === 0) {

                var docPreview = card.find('.doc-preview.wz-prototype').clone();
                docPreview.removeClass('wz-prototype').addClass('attachment-' + fsnode.id);

                if (post.metadata && post.metadata.operation === 'remove') {
                    docPreview.find('.doc-icon img').attr('src', 'https://static.horbito.com/app/360/deleted.png');
                } else {
                    docPreview.find('.doc-icon img').attr('src', fsnode.icons.big);
                }


                if (fsnode.mime && fsnode.mime.indexOf('office') > -1) {
                    docPreview.find('.doc-icon').addClass('office');
                }

                docPreview.find('.doc-title').text(fsnode.name);
                docPreview.find('.doc-info').text(api.tool.bytesToUnit(fsnode.size));
                card.find('.desc').after(docPreview);
                docPreview.data('fsnode', fsnode);

            }

        }

        if (post.title === '') {

            card.find('.title').hide();

        } else {

            card.find('.title').text(post.title);

        }

        if (post.content === '') {

            card.find('.desc').hide();

        } else {

            card.find('.desc').html(post.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));

        }

        card.find('.desc').find('a').each(function () {

            if (!URL_REGEX.test($(this).attr('href'))) {
                $(this).attr('href', 'http://' + $(this).attr('href'));
            }

        });

        card.find('.card-user-avatar').css('background-image', 'url(' + user.avatar.normal + ')');
        card.find('.card-user-name').text(user.fullName);
        card.find('.time-text').text(timeElapsed(new Date(post.created)));

        if (!isMobile()) {
            setRepliesAsync(card, post);
        } else {
            setRepliesAsyncWithoutAppendMobile(card, post);
        }
        appendCard(card, post);
        callback();

    });

}

var appendDocumentCard = function (post, user, reason, callback) {

    var card = documentCardPrototype.clone();
    card.removeClass('wz-prototype').addClass('post-' + post.id).addClass('cardDom');

    api.fs(post.fsnode[0], function (e, fsNode) {

        if (!e) {

            if (fsNode.mime.indexOf('image') === 0 || fsNode.mime === 'application/pdf') {
                card.find('.doc-preview img').attr('src', fsNode.thumbnails['1024']);
                card.find('.doc-preview-bar').hide();
            } else {
                // To Do -> Is this really neccesary? background with a micro thumb is added a few lines after this
                card.find('.doc-preview img').attr('src', fsNode.thumbnails.big);
            }

            card.find('.preview-title').text(fsNode.name);
            card.find('.preview-info').text(wz.tool.bytesToUnit(fsNode.size, 1));
            card.find('.doc-preview').data('fsnode', fsNode);
            card.find('.doc-preview-bar i').css('background-image', 'url( ' + fsNode.icons.micro + ' )');

        }

        if (post.title === '') {
            card.find('.title').hide();
        } else {
            card.find('.title').text(post.title);
        }

        if (post.content === '') {
            card.find('.desc').hide();
        } else {
            card.find('.desc').html(post.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));
        }

        card.find('.desc').find('a').each(function () {

            if (!URL_REGEX.test($(this).attr('href'))) {
                $(this).attr('href', 'http://' + $(this).attr('href'));
            }

        });

        card.find('.card-user-avatar').css('background-image', 'url(' + user.avatar.normal + ')');
        card.find('.card-user-name').text(user.fullName);
        card.find('.time-text').text(timeElapsed(new Date(post.created)));

        if (!isMobile()) {
            setRepliesAsync(card, post);
        } else {
            setRepliesAsyncWithoutAppendMobile(card, post);
        }
        appendCard(card, post);
        callback();

    });

}

var appendYoutubeCard = function (post, user, reason) {

    var card = youtubeCardPrototype.clone();
    card.removeClass('wz-prototype').addClass('post-' + post.id).addClass('cardDom');

    var youtubeCode = getYoutubeCode(post.content);

    if (isMobile()) {
        card.find('.video-preview').attr('src', 'https://www.youtube.com/embed/' + youtubeCode);
    } else {
        card.find('.video-preview').attr('src', 'https://www.youtube.com/embed/' + youtubeCode + '?autoplay=0&html5=1&rel=0');
    }

    card.find('.card-user-avatar').css('background-image', 'url(' + user.avatar.normal + ')');
    card.find('.card-user-name').text(user.fullName);
    card.find('.time-text').text(timeElapsed(new Date(post.created)));
    card.find('.desc').html(post.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));
    card.find('.title').text(post.title);
    card.find('.activate-preview').text(lang.preview);

    card.find('.desc').find('a').each(function () {

        if (!URL_REGEX.test($(this).attr('href'))) {
            $(this).attr('href', 'http://' + $(this).attr('href'));
        }

    });

    if (!isMobile()) {
        setRepliesAsync(card, post);
    } else {
        setRepliesAsyncWithoutAppendMobile(card, post);
    }
    appendCard(card, post);

}

var getYoutubeCode = function (text) {

    var youtubeId = false;
    text.split(' ').forEach(function (word) {

        if (word.startsWith('www.youtu') || word.startsWith('youtu') || word.startsWith('https://www.youtu') || word.startsWith('https://youtu') || word.startsWith('http://www.youtu') || word.startsWith('http://youtu')) {

            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = word.match(regExp);
            youtubeId = (match && match[7].length == 11) ? match[7] : false;

        }

    });

    return youtubeId;

}

var setRepliesAsyncWithoutAppendMobile = function (card, post) {

    post.getReplies({from: 0, to: 1000, withFullUsers: true}, function (e, replies) {

        replies = replies.reverse();
        card.find('.comments-text').text(replies.length + ' ' + lang.comments);
        if (replies.length === 1) {
            card.find('.comments-text').text(replies.length + ' ' + lang.comment);
        } else {
            card.find('.comments-text').text(replies.length + ' ' + lang.comments);
        }
        card.find('.comments-text').data('num', replies.length);

    });

}

var setRepliesAsyncOnlyAppendMobile = function (card, post) {

    $('.mobile-world-comments .commentDom, .mobile-world-comments .replyDom ').remove();
    $('.mobile-world-comments').data('card', card);

    post.getReplies({from: 0, to: 1000, withFullUsers: true}, function (e, replies) {

        replies = replies.reverse();

        $.each(replies, function (i, reply) {

            appendReply(card, reply, function () {

                reply.getReplies({from: 0, to: 1000, withFullUsers: true}, function (e, responses) {

                    responses = responses.reverse();

                    $.each(responses, function (i, response) {

                        appendReplyComment(card, reply, response);

                    });

                });

            });

        });

    });

}

var setRepliesAsync = function (card, post) {

    post.getReplies({from: 0, to: 1000, withFullUsers: true}, function (err, replies) {

        if (err) {
            console.log('Err: ', err, replies);
        }

        replies = replies.reverse();
        card.find('.comments-text').text(replies.length + ' ' + lang.comments);
        if (replies.length === 1) {
            card.find('.comments-text').text(replies.length + ' ' + lang.comment);
        } else {
            card.find('.comments-text').text(replies.length + ' ' + lang.comments);
        }
        card.find('.comments-text').data('num', replies.length);

        $.each(replies, function (i, reply) {

            appendReply(card, reply, function () {

                reply.getReplies({from: 0, to: 1000, withFullUsers: true}, function (e, responses) {

                    responses = responses.reverse();

                    $.each(responses, function (i, response) {

                        appendReplyComment(card, reply, response);

                    });

                });

            });

        });

    });

}

var appendReply = function (card, reply, callback) {

    var comment = commentPrototype.eq(0).clone();
    comment.removeClass('wz-prototype').addClass('commentDom comment-' + reply.id);
    if (isMobile()) {
        comment.find('.replay-button').text('-   ' + lang.reply);
    } else {
        comment.find('.replay-button').text(lang.reply);
    }
    comment.find('.edit-button').text(lang.edit);

    if (reply.author === myContactID) {
        comment.addClass('mine');
    }

    //parche hasta #1356 fix
    if (!reply.authorObject) {
        var userReady = $.Deferred();
        wz.user(reply.author, function (e, user) {
            userReady.resolve(user);
        });
    }

    if (userReady) {

        $.when(userReady).done(function (user) {

            comment.find('.avatar').css('background-image', 'url(' + user.avatar.tiny + ')');
            comment.find('.name').text(user.fullName);
            comment.find('.time').text(timeElapsed(new Date(reply.created)));
            comment.find('.comment-text').html(reply.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));

            comment.find('.comment-text').find('a').each(function () {

                if (!URL_REGEX.test($(this).attr('href'))) {
                    $(this).attr('href', 'http://' + $(this).attr('href'));
                }

            });

            var container;
            if (isMobile()) {
                container = mobileWorldComments;
            } else {
                container = card;
            }

            container.find('.comments-list').append(comment);
            container.find('.comments-list').scrollTop(comment[0].offsetTop);

            comment.data('reply', reply);
            comment.data('name', user.name.split(' ')[0]);

            callback();

        })

    } else {

        comment.find('.avatar').css('background-image', 'url(' + reply.authorObject.avatar.tiny + ')');
        comment.find('.name').text(reply.authorObject.fullName);
        comment.find('.time').text(timeElapsed(new Date(reply.created)));
        comment.find('.comment-text').html(reply.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));

        comment.find('.comment-text').find('a').each(function () {

            if (!URL_REGEX.test($(this).attr('href'))) {
                $(this).attr('href', 'http://' + $(this).attr('href'));
            }

        });

        var container;
        if (isMobile()) {
            container = mobileWorldComments;
        } else {
            container = card;
        }

        container.find('.comments-list').append(comment);
        container.find('.comments-list').scrollTop(comment[0].offsetTop);

        comment.data('reply', reply);
        comment.data('name', reply.authorObject.name.split(' ')[0]);

        callback();

    }

}

var appendCard = function (card, post) {

    var worldActive = $('.world.active').data('world');
    if (post.worldId != worldActive.id) {
        return;
    }

    if ($('.post-' + post.id).length != 0) {
        $('.post-' + post.id).remove();
    }

    $('.no-posts').css('opacity', '0');
    $('.no-posts').hide();

    card.find('.delete span').text(lang.deletePost);

    var multipost = card.find('.doc-preview:not(.wz-prototype)').length > 1 ? true : false;
    var reason = lang.postCreated;
    if (post.metadata) {

        switch (post.metadata.operation) {
            case 'enqueue':
                reason = multipost ? lang.filesAdded : lang.fileAdded;
                break;
            case 'modified':
                reason = multipost ? lang.filesModified : lang.fileModified;
                break;
            case 'copy':
                reason = multipost ? lang.filesAdded : lang.fileAdded;
                break;
            case 'moveIn':
                reason = multipost ? lang.filesAdded : lang.fileAdded;
                break;
            case 'moveOut':
                reason = multipost ? lang.filesRemoved : lang.fileRemoved;
                break;
            case 'remove':
                reason = multipost ? lang.filesRemoved : lang.fileRemoved;
                break;

        }

    }

    card.find('.shared-text').text(reason);

    app.removeClass('no-post');

    var cardsAppended = $('.cardDom');

    if (post.author === myContactID) {
        card.addClass('mine');
    }

    if (!cardsAppended.length) {

        $('.cards-list').append(card);

    } else {

        var inserted = false;
        $.each(cardsAppended, function (index, cardAppended) {

            var time = $(cardAppended).data('time');
            if (!inserted && post.created > time) {

                $(cardAppended).before(card);
                inserted = true;

            }
            if (!inserted && index + 1 == cardsAppended.length) {

                $(cardAppended).after(card);
                inserted = true;

            }

        });

    }

    card.data('time', post.created);
    card.data('post', post);

}

var timeElapsed = function (lastTime) {

    var now = new Date();
    var last = new Date(lastTime);
    var message;
    var calculated = false;

    if (now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth()) {

        if (now.getDate() === last.getDate()) {

            message = getStringHour(lastTime);
            calculated = true;

        } else if (new Date(now.setDate(now.getDate() - 1)).getDate() === last.getDate()) {

            message = lang.lastDay + ' ' + lang.at + ' ' + getStringHour(lastTime);
            calculated = true;

        }

    }

    if (!calculated) {

        var day = last.getDate();
        var month = last.getMonth() + 1;

        if (day < 10) {
            day = '0' + day
        }

        if (month < 10) {
            month = '0' + month
        }

        message = day + '/' + month + '/' + last.getFullYear().toString().substring(2, 4) + ' ' + lang.at + ' ' + getStringHour(lastTime);
        calculated = true;

    }

    return message;

}

var getStringHour = function (date) {

    var now = new Date();

    var hh = date.getHours();
    var mm = date.getMinutes();

    if (hh < 10) {
        hh = '0' + hh
    }

    if (mm < 10) {
        mm = '0' + mm
    }


    return hh + ':' + mm;

}

var removePostAsync = function (post) {

    var confirmText = lang.comfirmDeletePost;
    if (post.isReply) {
        confirmText = lang.comfirmDeleteComment;
    }

    if (isMobile()) {

        worldSelected.removePost(post.id, function (err, o) {
            if (err) {
                navigator.notification.alert('', function () {
                }, lang.notAllowedDeletePost);
            }
        });

    } else {

        confirm(confirmText, function (o) {
            if (o) {

                worldSelected.removePost(post.id, function (err, o) {

                    if (err) {
                        alert(lang.notAllowedDeletePost);
                    }

                });

            }
        });

    }
}

var unFollowWorld = function (world) {

    if (typeof wzLang !== 'undefined') {

        var dialog = api.dialog();

        dialog.setTitle(lang.unfollowWorld);
        dialog.setText(lang.confirmExit);

        dialog.setButton(0, wzLang.core.dialogCancel, 'black');
        dialog.setButton(1, wzLang.core.dialogAccept, 'red');

        dialog.render(function (doIt) {

            if (!doIt) {
                return;
            }

            world.removeUser(myContactID, function (err, o) {
                if (err) {
                    console.error(err);
                } else {
                    wql.deleteLastRead([world.id, myContactID], function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });

        });

    } else {

        world.removeUser(myContactID, function (err, o) {
            if (err) {
                console.error(err);
            } else {
                wql.deleteLastRead([world.id, myContactID], function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });

    }

}

var addReplayAsync = function (card) {

    var post;
    var msg;
    var input;
    if (isMobile()) {
        post = mobileWorldComments.data('post');
        msg = mobileWorldComments.find('.comments-footer .comment-input').val();
        input = mobileWorldComments.find('.comments-footer .comment-input');
    } else {
        post = card.data('post');
        msg = card.find('.comments-footer .comment-input').val();
        input = card.find('.comments-footer .comment-input');
    }

    if (input.attr('placeholder')[0] === '@') {
        post = input.data('reply');
        $('.comments-footer .comment-input').attr('placeholder', lang.writeComment);
    }

    post.reply({content: msg}, function (e, o) {
        input.val('');
        input.css('height', '20px');
    });

}

var exploreAnimationIn = function () {

    var exploreSection = $('.explore-section');

    exploreSection.css('display', 'block');
    $('.explore-container').scrollTop(0);

    // Fade in blue background
    exploreSection.stop().clearQueue().transition({

        'opacity': 1

    }, 300, animationEffect, function () {

        noWorlds.transition({

            'opacity': 0

        }, 200, animationEffect, function () {

            noWorlds.hide();

        });

    });

    // Stars appears and goes up
    $('.search-title, .search-bar, .tend-text').stop().clearQueue().transition({

        delay: 550,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 500, animationEffect);

    // New world button appears and goes up
    $('.new-world-button, .close-explore').stop().clearQueue().transition({

        delay: 800,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 450, animationEffect);

    // World cards appears and goes up
    var firstCards = $('.tend-list .world-card');
    var restOfCards = firstCards.splice(10, firstCards.length - 10);
    firstCards.each(function (i, card) {

        var d = i * 150;

        $(card).transition({

            delay: (550 + d),
            'opacity': 1,
            'transform': 'translateY(0px)'

        }, 1000, function () {

            restOfCards.forEach(function (card) {
                $(card).css({
                    'opacity': 1,
                    'transform': 'translateY(0px)'
                });
            });

        });

    });

}

var createChat = function (world) {

    if (desktop.find('.wz-app-14').length > 0) {
        desktop.trigger('message', ['new-world-chat', {'world': world}]);
    } else {
        wz.app.openApp(14, ['new-world-chat', {'world': world}, function (o) {
            console.log(o);
        }], 'hidden');
    }

}

var prepareReplayComment = function (comment) {

    var post = comment.data('reply');
    var name = comment.data('name');
    var input = comment.parent().parent().find('.comments-footer .comment-input');

    input.attr('placeholder', '@' + name + ' ');
    input.focus();
    input.data('reply', post);

}

var appendReplyComment = function (card, reply, response) {

    var comment;
    if (isMobile()) {
        comment = mobileWorldComments.find('.comment-' + reply.id);
    } else {
        comment = card.find('.comment-' + reply.id);
    }

    comment.find('.replay-list').show();
    var reply = comment.find('.replay.wz-prototype').clone();
    reply.removeClass('wz-prototype').addClass('replyDom reply-' + response.id);

    if (response.author === myContactID) {
        reply.addClass('mine');
    }

    //parche hasta #1356 fix
    if (!response.authorObject) {
        var userReady = $.Deferred();
        wz.user(response.author, function (e, user) {
            userReady.resolve(user);
        });
    }

    if (userReady) {

        $.when(userReady).done(function (user) {

            reply.find('.avatar').css('background-image', 'url(' + user.avatar.tiny + ')');
            reply.find('.name').text(user.fullName);
            reply.find('.time').text(timeElapsed(new Date(response.created)));
            reply.find('.replay-text').html(response.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));

            reply.find('.replay-text').find('a').each(function () {

                if (!URL_REGEX.test($(this).attr('href'))) {
                    $(this).attr('href', 'http://' + $(this).attr('href'));
                }

            });

      comment.find( '.replay-list' ).append( reply );
      if (!isMobile()) {
        card.find( '.comments-list' ).scrollTop( reply[0].offsetTop );
      }

            reply.data('reply', response);


        });

    } else {

        reply.find('.avatar').css('background-image', 'url(' + response.authorObject.avatar.tiny + ')');
        reply.find('.name').text(response.authorObject.fullName);
        reply.find('.time').text(timeElapsed(new Date(response.created)));
        reply.find('.replay-text').html(response.content.replace(/\n/g, "<br />").replace(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/, '<a href="$1" target="_blank">$1</a>'));

        reply.find('.replay-text').find('a').each(function () {

            if (!URL_REGEX.test($(this).attr('href'))) {
                $(this).attr('href', 'http://' + $(this).attr('href'));
            }

        });

        comment.find('.replay-list').append(reply);
        if (!isMobile()) {
            card.find('.comments-list').scrollTop(reply[0].offsetTop);
        }

        reply.data('reply', response);

    }

}

var cleanWorldCards = function () {
    $('.world-card-dom').remove();
}

var sortByName = function (nameA, nameB) {

    nameA = nameA.name;
    nameB = nameB.name;

    var a1, b1, i = 0, n, L,

        rx = /(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;

    if (nameA === nameB) return 0;

    nameA = nameA.toLowerCase().match(rx) || [];
    nameB = nameB.toLowerCase().match(rx) || [];

    L = nameA.length;

    while (i < L) {
        if (!nameB[i]) return 1;
        a1 = nameA[i],
            b1 = nameB[i++];
        if (a1 !== b1) {
            n = a1 - b1;
            if (!isNaN(n)) return n;
            return a1 > b1 ? 1 : -1;
        }
    }
    return nameB[i] ? -1 : 0;

}

var searchPostForComment = function (info) {

    console.log(info);
    $('.world-' + info.world).data('world').getPost(info.post, function (e, post) {

        console.log(post);
        if (post.isReply) {
            $('.world-' + info.world).data('world').getPost(post.parent, function (e, post) {
                hideAndShowPost(post, info.isReply);
            });
        } else {
            hideAndShowPost(post, info.isReply);
        }

    });

}

var hideAndShowPost = function (post, showReply) {

    $('.cardDom').remove();

    wz.user(post.author, function (e, user) {

        if (worldSelected && worldSelected.id === post.worldId) {

            if (post.metadata && post.metadata.operation && post.metadata.operation === 'remove') {

                appendGenericCard(post, user, lang.postCreated, function () {
                });

            } else if (post.metadata && post.metadata.fileType) {

                switch (post.metadata.fileType) {

                    case 'document':
                    case 'image':
                        appendDocumentCard(post, user, lang.postCreated, function () {
                        });
                        break;
                    /*case 'generic':
          case 'video':
          case 'music':*/
                    default:
                        appendGenericCard(post, user, lang.postCreated, function () {
                        });
                        break;

                }

            } else if (post.metadata && post.metadata.linkType) {

                switch (post.metadata.linkType) {

                    case 'youtube':
                        appendYoutubeCard(post, user, lang.postCreated);
                        break;

                }

            } else {
                appendNoFileCard(post, user, lang.postCreated);
            }


        }

        $('.post-' + post.id).show();
        if (showReply) {
            $('.post-' + post.id + ' .comments-opener').click();
        }

    });

}

var searchPost = function (filter) {

    searchPostQuery = searchPostQuery + 1;
    var searchPostQueryCopy = searchPostQuery;

    if (filter === '') {
        $('.card').show();
        return;
    }

    $('.card').hide();

    worldSelected.searchPost(filter, {from: 0, to: 1000}, function (e, posts) {

        // Query desfasada
        if (searchPostQuery != searchPostQueryCopy) {
            return;
        }

        console.log(posts);

        $.each(posts, function (i, post) {

            var post;

            if (post.isReply) {

                post = $('.post-' + post.parent);

            } else {

                post = $('.post-' + post.id);

            }

            post.show();

        });

    });

}

var editPostAsync = function (card) {

    var post = card.data('post');
    console.log(post);
    card.find('.title-input').val(post.title);
    card.find('.title-input').data('prev', post.title);
    card.find('.content-input').val(post.content);
    card.find('.content-input').data('prev', post.content);
    card.find('.card-options').addClass('hide');
    card.find('.attachment:not(.wz-prototype)').remove();

    card.find('.attach-list').data('prev', post.fsnode);
    if (post.fsnode.length != 0) {

        post.fsnode.forEach(function (fsnodeId) {
            var fsnode;
            if (post.fsnode.length === 1) {
                fsnode = card.find('.doc-preview').data('fsnode');
            } else {
                fsnode = card.find('.attachment-' + fsnodeId).data('fsnode');
            }

            appendAttachment({fsnode: fsnode, uploaded: true, card: card});

        });

    }
}

var appendAttachment = function (info, useItem) {

    var attachment = useItem || $('.editing .attachment.wz-prototype').clone();

    attachment.removeClass('wz-prototype')
    attachment.find('.attachment-title').text(info.fsnode.name)

    if (typeof info.fsnode.id !== 'undefined') {
        attachment.addClass('attachment-' + info.fsnode.id)
    }

    if (info.fsnode && info.fsnode.id) {
        attachment.addClass('attachment-fsnode-' + info.fsnode.id)
    }

    if (!info.uploaded) {

        attachment.addClass('from-pc uploading')
        attachment.find('.aux-title').show().text(lang.uploading)
        $('.editing').addClass('uploading')

    } else {
        attachment.find('.icon').css('background-image', 'url(' + info.fsnode.icons.micro + ')');
    }

    $('.editing').find('.attachment.wz-prototype').after(attachment);
    attachment.data('fsnode', info.fsnode);

    if (info.fsnode.pending) {
        attachment.data('mime', info.fsnode.type);
    }
}

var isMobile = function () {
    return app.hasClass('wz-mobile-view');
}

var attachFromInevio = function (card) {

    if (isMobile()) {

        wz.app.openApp(1, ['select-source', function (o) {

            $('.attach-select').removeClass('popup');

            o.forEach(function (fsnode) {

                appendAttachment({fsnode: fsnode, uploaded: true, card: card});

            });

        }], 'selectSource');

    } else {
        api.fs.selectSource({'title': lang.selectFile, 'mode': 'file', 'multiple': true}, function (err, s) {

            if (err) {
                console.error(err);
                return;
            }

            $('.attach-select').removeClass('popup');

            s.forEach(function (attach) {

                api.fs(attach, function (err, fsnode) {

                    if (err) {
                        console.error(err);
                    } else {
                        appendAttachment({fsnode: fsnode, uploaded: true, card: card});
                    }

                });

            });

        })
    }
}

var updateBadges = function (world) {

    //World notifications
    worldNotifications.forEach(function (notification) {
        $('.world-' + notification.data.world).addClass('with-notification');
    });

    //Post notifications
    $('.worldDom').each(function (i, world) {
        $(world).data('notifications', 0);
    });
    postsNotifications.forEach(function (notification) {
        var domWorld = $('.world-' + notification.data.world);
        var nNotifications = domWorld.data('notifications') ? domWorld.data('notifications') + 1 : 1;
        domWorld.addClass('with-post-notification').find('.post-notifications').text(nNotifications);
        domWorld.data('notifications', nNotifications);
    });

    //Comments notifications
    $('.notification:not(.wz-prototype)').remove();
    if (commentsNotifications.length > 0) {
        $('.notifications').addClass('with-notification');
    } else {
        $('.notifications').removeClass('with-notification');
    }
    commentsNotifications.forEach(function (notification) {

        var world = $('.world-' + notification.data.world).data('world');
        if (!world) {
            api.notification.markAsAttended('cosmos', notification.id, function (err) {
                if (err) {
                    console.error(err);
                }
                checkNotifications();
            });
            return;
        }

        world.getPost(notification.data.parent, function (e, post) {
            api.user(notification.sender, function (e, user) {
                var notificationDom = $('.notification.wz-prototype').clone().removeClass('wz-prototype');
                notificationDom.addClass('notification-' + notification.id);
                notificationDom.data('notification', notification)
                notificationDom.find('.notification-avatar').css('background-image', 'url(' + user.avatar.tiny + ')');
                if (post.author === myContactID) {
                    if (!post.isReply) {
                        notificationDom.find('.notification-action').html('<i>' + user.fullName + '</i>' + lang.hasComment);
                    } else {
                        notificationDom.find('.notification-action').html('<i>' + user.fullName + '</i>' + lang.hasComment3);
                    }
                } else {
                    notificationDom.find('.notification-action').html('<i>' + user.fullName + '</i>' + lang.hasComment2 + ' ' + world.name);
                }
                notificationDom.find('.notification-time').html('<i></i>' + timeElapsed(new Date(notification.time)));
                if ($('.notification-' + notification.id).length === 0) {
                    $('.notifications-list').prepend(notificationDom);
                }
            });
        });
    });
}

var checkNotifications = function () {

    api.notification.list('cosmos', function (e, notifications) {
        worldNotifications = [];
        postsNotifications = [];
        commentsNotifications = [];
        notifications.forEach(function (notification) {

            if (notification.data.type === 'addedToWorld') {
                worldNotifications.push(notification)
            } else if (notification.data.type === 'post') {
                postsNotifications.push(notification)
            } else if (notification.data.type === 'reply') {
                commentsNotifications.push(notification)
            }

        });

        updateBadges();
        wz.app.setBadge(notifications.length);
        console.log('WorldNot:', worldNotifications, ' PostsNot:', postsNotifications, ' CommNot:', commentsNotifications)
        console.log(notifications);

    });

}

var attendWorldNotification = function (worldId) {

    worldNotifications.forEach(function (notification) {
        if (notification.data.world === worldId) {
            api.notification.markAsAttended('cosmos', notification.id, function (err) {

                if (err) {
                    console.error(err);
                }

                $('.world-' + worldId).removeClass('with-notification');
                $('.world-' + worldId).removeClass('with-post-notification');
                checkNotifications();
            });
        }
    });

    postsNotifications.forEach(function (notification) {
        if (notification.data.world === worldId) {
            api.notification.markAsAttended('cosmos', notification.id, function (err) {

                if (err) {
                    console.error(err);
                }

                $('.world-' + worldId).removeClass('with-notification');
                $('.world-' + worldId).removeClass('with-post-notification');
                checkNotifications();
            });
        }
    });
}

var attendCommentNotification = function (postClicked) {

    commentsNotifications.forEach(function (notification) {
        var world = $('.world-' + notification.data.world).data('world');
        world.getPost(notification.data.parent, function (e, post) {
            if (post.isReply) {
                world.getPost(post.parent, function (e, post) {
                    if (postClicked.id === post.id) {
                        api.notification.markAsAttended('cosmos', notification.id, function (err) {

                            if (err) {
                                console.error(err);
                            }

                            $('.notification-' + notification.id).remove();
                            checkNotifications();
                        });
                    }
                });
            } else {
                if (postClicked.id === post.id) {
                    api.notification.markAsAttended('cosmos', notification.id, function (err) {

                        if (err) {
                            console.error(err);
                        }

                        $('.notification-' + notification.id).remove();
                        checkNotifications();
                    });
                }
            }
        });
    });

}

var checkMetadata = function (content, fsnode) {

    var newMetadata;

    if (fsnode.length > 0) {
        if (fsnode.length === 1) {
            newMetadata = {fileType: checkTypePost(fsnode[0])};
        } else {
            newMetadata = {fileType: 'generic'};
        }
    } else if (content.indexOf('www.youtube') != -1) {
        newMetadata = {linkType: 'youtube'};
    } else {
        newMetadata = null;
    }
    return newMetadata;
}

var checkTypePost = function (fsnode) {
    var fileType = 'generic';
    if (fsnode.mime) {
        fileType = guessType(fsnode.mime);
    }

    return fileType;
}

var guessType = function (mime) {
    return TYPES[mime] || 'generic';
}

var setPost = function (post) {

    if (worldSelected.id === post.worldId) {

        $('.post-' + post.id).remove();

        wz.user(post.author, function (e, user) {

            if (post.metadata && post.metadata.operation && post.metadata.operation === 'remove') {

                appendGenericCard(post, user, lang.postCreated, function () {
                });

            } else if (post.metadata && post.metadata.fileType) {

                switch (post.metadata.fileType) {

                    case 'document':
                    case 'image':
                        appendDocumentCard(post, user, lang.postCreated, function () {
                        });
                        break;

                    /*case 'generic':
          case 'video':
          case 'music':*/
                    default:
                        appendGenericCard(post, user, lang.postCreated, function () {
                        });
                        break;

                }

            } else if (post.metadata && post.metadata.linkType) {

                switch (post.metadata.linkType) {

                    case 'youtube':
                        appendYoutubeCard(post, user, lang.postCreated);
                        break;

                }

            } else {
                appendNoFileCard(post, user, lang.postCreated);
            }

        });

    }

}

var changeMobileView = function (view) {

    switch (view) {

        case 'worldContent':

            switch (mobileView) {

                case 'worldSidebar':

                    mobileWorldContent.removeClass('hide');
                    mobileWorldContent.stop().clearQueue().transition({
                        'transform': 'translateX(0%)'
                    }, 300, function () {
                        mobileWorldSidebar.addClass('hide');
                    });
                    break;

                case 'worldComments':

                    mobileWorldContent.removeClass('hide');
                    mobileWorldComments.stop().clearQueue().transition({
                        'transform': 'translateY(100%)'
                    }, 300, function () {
                        mobileWorldComments.addClass('hide');
                    });
                    break;

                case 'newPost':

                    mobileWorldContent.removeClass('hide');
                    mobileNewPost.stop().clearQueue().transition({
                        'transform': 'translateY(-100%)'
                    }, 300, function () {
                        mobileNewPost.addClass('hide');
                    });
                    break;

            }
            mobileView = 'worldContent'
            StatusBar.backgroundColorByHexString("#fff");
            StatusBar.styleDefault();
            break;

        case 'worldSidebar':

            switch (mobileView) {

                case 'worldContent':

                    mobileWorldSidebar.removeClass('hide');
                    mobileWorldContent.stop().clearQueue().transition({
                        'transform': 'translateX(100%)'
                    }, 300, function () {
                        mobileWorldContent.addClass('hide');
                    });
                    break;

                case 'explore':

                    mobileWorldSidebar.removeClass('hide');
                    mobileExplore.stop().clearQueue().transition({
                        'transform': 'translateY(100%)'
                    }, 300, function () {
                        mobileExplore.addClass('hide');
                    });
                    break;

            }

            StatusBar.backgroundColorByHexString("#272c34");
            StatusBar.styleLightContent();

            $('.world.active').removeClass('active');
            mobileView = 'worldSidebar'
            break;

        case 'worldComments':

            mobileWorldComments.removeClass('hide');
            mobileWorldComments.stop().clearQueue().transition({
                'transform': 'translateY(0%)'
            }, 300, function () {
                mobileWorldContent.addClass('hide');
                mobileView = 'worldComments'
            });
            break;

        case 'newWorld':

            mobileNewWorld.removeClass('hide');
            mobileNewWorld.stop().clearQueue().transition({
                'transform': 'translateY(0%)'
            }, 300);
            break;

            StatusBar.backgroundColorByHexString("#fff");
            StatusBar.styleDefault();

        case 'explore':

            mobileExplore.removeClass('hide');

            StatusBar.backgroundColorByHexString("#0f141c");
            StatusBar.styleLightContent();

            mobileExplore.stop().clearQueue().transition({

                'transform': 'translateY(0%)'
            }, 300, function () {
                mobileWorldSidebar.addClass('hide');
                mobileView = 'explore'
            });
            break;

        case 'newPost':

            mobileNewPost.removeClass('hide');
            mobileNewPost.stop().clearQueue().transition({
                'transform': 'translateY(0%)'
            }, 300, function () {
                mobileWorldContent.addClass('hide');
                mobileView = 'newPost'
            });
            break;

    }

}

var setMobile = function () {

    StatusBar.backgroundColorByHexString("#272c34");
    StatusBar.styleLightContent();

    $('input, textarea').on('focus', function () {
        Keyboard.shrinkView(true);
    })
        .on('blur', function () {
            Keyboard.shrinkView(false);
        });
    $('.app-title').text(lang.yourWorlds);
    $('.cancel-search').text(lang.cancel);
    $('.search-bar input').attr('placeholder', lang.search);
}

var newPostMobile = function () {
    changeMobileView('newPost');
    $('.mobile-new-post .new-card-title').html('<i class="wz-dragger">' + lang.newPost + '</i>' + '<span>' + lang.for + '</span>' + '<figure class="wz-dragger ellipsis">' + worldSelected.name + '</figure>');
    $('.mobile-new-post .post-new-card span').text(lang.publishPost);
    $('.mobile-new-post .new-card-input').attr('placeholder', lang.title);
    $('.mobile-new-post .new-card-textarea').attr('placeholder', lang.description);
    $('.mobile-new-post .new-card-input').val('');
    $('.mobile-new-post .new-card-textarea').val('');
}

var nextPage = function () {
    actualPageInterval = actualPageInterval + nPagesShowed;
    addPages();
    cleanWorldCards();
    getPublicWorldsAsync({
        page: actualPageInterval,
        withAnimation: true
    });
}

var prevPage = function () {
    actualPageInterval = actualPageInterval - nPagesShowed;
    addPages();
    cleanWorldCards();
    getPublicWorldsAsync({
        page: actualPageInterval,
        withAnimation: true
    });
}

var addPages = function () {

    //Borro las paginas actuales
    $('.page:not(.wz-prototype)').remove();
    $('.back-page').removeClass('active');
    $('.next-page').removeClass('active');

    //Necesito boton de back
    if (actualPageInterval > 1) {
        $('.back-page').addClass('active');
    }

    for (var i = actualPageInterval; i < totalPages + 1; i++) {

        //Añado la pagina
        var page = $('.page.wz-prototype').clone();
        page.removeClass('wz-prototype').find('span').text(i);
        $('.next-page').before(page);

        //Marco activa la primera pagina
        if (i === actualPageInterval) {
            page.addClass('active');
        }

        //He llegado al final
        if (i === totalPages) {
            return;
        }

        //He pintado 4 paginas pero no he terminado, pinto siguiente y termino
        if (i === actualPageInterval + ( nPagesShowed - 1 ) && i < totalPages) {
            $('.next-page').addClass('active');
            return;
        }
    }
}

var exploreAnimationOut = function () {

    if ($('.worldDom').length === 0) {

        noWorlds.show();
        noWorlds.transition({

            'opacity': 1

        }, 200, animationEffect);

    } else {

        noWorlds.transition({

            'opacity': 0

        }, 200, animationEffect, function () {

            noWorlds.hide();

        });
    }

    var exploreSection = $('.explore-section');

    // Fade out blue background
    exploreSection.stop().clearQueue().transition({

        'opacity': 0

    }, 300, function () {

        exploreSection.css('display', 'none');

        $('.new-world-button, .close-explore').css({
            'transform': 'translateY(10px)',
            'opacity': 0
        });

    });

    // Stars goes down
    $('.search-title, .search-bar, .tend-text').stop().clearQueue().transition({

        'opacity': 0,
        'transform': 'translateY(20px)'

    }, 300);

    // New world button goes down
    $('.new-world-button, .close-explore').stop().clearQueue().transition({

        'opacity': 0,
        'transform': 'translateY(10px)'

    }, 300);

    // World cards button goes down
    $('.world-card').stop().clearQueue().transition({

        'opacity': 0,
        'transform': 'translateY(40px)'

    }, 300);

}

var newWorldAnimationA = function () {

    var newWorldContainer = $('.new-world-container-wrap');

    $('.new-world-name input').val('');

    newWorldContainer.css('display', 'block');

    // Fade in White background (animation)
    newWorldContainer.stop().clearQueue().transition({

        'opacity': 1

    }, 300);

    // Fade in and goes up title (animation)
    $('.new-world-title').stop().clearQueue().transition({

        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 300);

    // Fade in and goes up esc (animation)
    $('.close-new-world').stop().clearQueue().transition({

        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 300);

    // Fade in and goes up name (animation)
    $('.new-world-name').stop().clearQueue().transition({

        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 300);

    // Fade in and goes up button (animation)
    $('.create-world-button').stop().clearQueue().transition({

        delay: 250,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 300);
    $('.delete-world-button').stop().clearQueue().transition({

        delay: 250,
        'opacity': 0.5,
        'transform': 'translateY(0px)'

    }, 300);


}

var newWorldAnimationB = function () {

    var editing = $('.new-world-container').hasClass('editing');

    if (editing) {

        var height = isMobile() ? '800px' : '770px';
        $('.new-world-container').css('height', height);
        newWorldAnimationBEditing();

    } else {
        var height = isMobile() ? '720px' : '770px';
        $('.new-world-container').css('height', height);
        newWorldAnimationBNormal();
    }

}

var newWorldAnimationBNormal = function () {

    $('.new-world-avatar').show();
    $('.new-world-desc').show();
    $('.new-world-privacy').show();
    $('.new-world-title').addClass('second');
    $('.create-world-button').addClass('step-b');
    $('.create-world-button').removeClass('step-a');
    $('.option.private-option').addClass('active');
    $('.option.public').removeClass('active');


    $('.new-world-desc textarea').val('');

    $('.wz-groupicon-uploader-start').css('background-image', 'none');

    // Fade in and goes up title (animation)
    var translate = isMobile() ? '0px' : '-67px';
    $('.new-world-title').stop().clearQueue().transition({

        'transform': 'translateY(' + translate + ')'

    }, 1000, animationEffect);

    // Fade in and goes up name (animation)
    $('.new-world-name').stop().clearQueue().transition({

        'opacity': 0,
        'transform': 'translateX(-200px)'

    }, 1000, animationEffect);


    // Fade in and goes up button (animation)
    if (!isMobile()) {
        $('.create-world-button , .delete-world-button').stop().clearQueue().transition({

            'opacity': 0

        }, 800, animationEffect, function () {

            $(this).css({

                'top': '640px',
                'transform': 'translateY(20px)',
                'right': '0',
                'left': 'calc(50% - 472px/2 + 150px)'

            }).find('span').text(lang.accept);


        });
    }

    // Fade in and goes up avatar (animation)
    $('.new-world-avatar').stop().clearQueue().transition({

        delay: 500,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 1000);

    // Fade in and goes up desc (animation)
    $('.new-world-desc').stop().clearQueue().transition({

        delay: 650,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 1000);

    // Fade in and goes up privacy (animation)
    $('.new-world-privacy').stop().clearQueue().transition({

        delay: 800,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 1000);

    // Fade in and goes up privacy (animation)
    $('.create-world-button').transition({

        delay: 950,
        'opacity': 1,
        'transform': 'translateY(0px)'

    }, 1000);
    $('.delete-world-button').transition({

        delay: 950,
        'opacity': 0.5,
        'transform': 'translateY(0px)'

    }, 1000);

}

var newWorldAnimationBEditing = function () {

    bypassNewWorldAnimationA();

    $('.new-world-avatar').show();
    $('.new-world-desc').show();
    $('.new-world-privacy').show();
    $('.new-world-title').addClass('second');
    $('.create-world-button').addClass('step-b');
    $('.create-world-button').removeClass('step-a');

    $('.new-world-container-wrap').scrollTop(0);

    // Fade in and goes up title (animation)
    var translate = isMobile() ? '0px' : '-67px';
    $('.new-world-title').stop().clearQueue().transition({

        'transform': 'translateY(' + translate + ')'

    }, 1000);


    // Fade in and goes up name (animation)
    var translate = isMobile() ? '-15px' : '-58px';
    $('.new-world-name').stop().clearQueue().transition({

        delay: 100,
        'opacity': 1,
        'transform': 'translateY(' + translate + ')'

    }, 1000);

    // Fade in and goes up avatar (animation)
    var translate = isMobile() ? '50px' : '120px';
    $('.new-world-avatar').css('transform', 'translateY(158px)');
    $('.new-world-avatar').stop().clearQueue().transition({

        delay: 300,
        'opacity': 1,
        'transform': 'translateY(' + translate + ')'

    }, 1000);

    // Fade in and goes up desc (animation)
    var translate = isMobile() ? '50px' : '120px';
    $('.new-world-desc').css('transform', 'translateY(158px)');
    $('.new-world-desc').stop().clearQueue().transition({

        delay: 500,
        'opacity': 1,
        'transform': 'translateY(' + translate + ')'

    }, 1000);

    // Fade in and goes up privacy (animation)
    var translate = isMobile() ? '50px' : '120px';
    $('.new-world-privacy').css('transform', 'translateY(158px)');
    $('.new-world-privacy').stop().clearQueue().transition({

        delay: 700,
        'opacity': 1,
        'transform': 'translateY(' + translate + ')'

    }, 1000);


    // Fade in and goes up privacy (animation)
    var translate = isMobile() ? '80px' : '120px';
    $('.create-world-button, .delete-world-button').css('transform', 'translateY(158px)');
    $('.create-world-button').transition({

        delay: 900,
        'opacity': 1,
        'transform': 'translateY(' + translate + ')'

    }, 1000);
    $('.delete-world-button').transition({

        delay: 900,
        'opacity': 0.5,
        'transform': 'translateY(' + translate + ')'

    }, 1000);

}

var bypassNewWorldAnimationA = function () {

    $('.new-world-container-wrap').css({

        'display': 'block',

    });
    $('.new-world-container-wrap').transition({

        'opacity': 1

    }, 300);
    $('.new-world-title').css({

        'opacity': 1,
        'transform': 'translateY(0px)'

    });
    $('.close-new-world').css({

        'opacity': 1,
        'transform': 'translateY(0px)'

    });
    $('.create-world-button').css('left', 'calc((50% - 236px) + 55px)').find('span').text(lang.accept);
    var text = isMobile() ? lang.exit : lang.unfollowWorld;
    $('.delete-world-button').css('left', 'calc((50% - 135px) + 142px)').find('span').text(text);
    $('.create-world-button , .delete-world-button').css({

        'top': '640px',
        'transform': 'translateY(20px)',
        'right': '0',
        'opacity': '0'

    });
    $('.new-world-name').css({

        'opacity': '0'

    });
    $('.new-world-title .title').text(lang.worldEdit);
    $('.new-world-title .step-b').addClass('hide');

}


var newWorldAnimationOut = function () {

    var newWorldContainer = $('.new-world-container-wrap');

    $('.new-world-container').css('height', '100%');

    // Fade out White background
    newWorldContainer.stop().clearQueue().transition({

        'opacity': 0

    }, 200, function () {

        newWorldContainer.css('display', 'none');
        $('.new-world-avatar').hide();
        $('.new-world-desc').hide();
        $('.new-world-privacy').hide();
        $('.new-world-title').removeClass('second');
        $('.create-world-button').removeClass('step-b');
        $('.create-world-button').addClass('step-a');
        $('.new-world-title .step-b').removeClass('hide');
        $('.new-world-title .title').text(lang.worldCreation);
        $('.delete-world-button').addClass('hide');


        $('.new-world-title, .new-world-name, .create-world-button, .new-world-avatar, .new-world-desc, .new-world-privacy, .delete-world-button').css({
            'transform': 'translateY(20px)',
            'opacity': 0
        });

        $('.close-new-world').css({
            'transform': 'translateY(10px)',
            'opacity': 0
        });

        if (!isMobile()) {
            $('.create-world-button').css({


                'top': '400px',
                'transform': 'translateY(20px)',
                'left': 'calc((50% - 236px) + 307px)'


            }).find('span').text(lang.createWorldShort);
        }

        exploreAnimationOut();

        if ($('.worldDom').length === 0) {

            noWorlds.show();
            noWorlds.transition({

                'opacity': 1

            }, 200, animationEffect);

        } else {

            noWorlds.transition({

                'opacity': 0

            }, 200, animationEffect, function () {

                noWorlds.hide();

            });

        }

    });

}

var editWorld = function (world) {

    $('.new-world-title input').val('');
    $('.new-world-container').addClass('editing');
    $('.delete-world-button').removeClass('hide');

    newWorldAnimationB();

    if (world.hasCustomIcon) {
        $('.wz-groupicon-uploader-start').removeClass('non-icon');
        $('.wz-groupicon-uploader-start').addClass('custom-icon');
    } else {
        $('.wz-groupicon-uploader-start').removeClass('custom-icon');
        $('.wz-groupicon-uploader-start').addClass('non-icon');
    }

    $('.new-world-desc textarea').val(world.description);
    $('.new-world-name input').val(world.name);
    $('.wz-groupicon-uploader-start').css('background-image', 'url(' + world.icons.normal + '?token=' + Date.now() + ')');
    $('.wz-groupicon-uploader-start').attr('data-groupid', world.id);
    $('.privacy-options .option').removeClass('active');
    if (world.isPrivate) {
        $('.privacy-options .hidden').addClass('active');
    } else {
        $('.privacy-options .public').addClass('active');
    }

}

initCosmos();
