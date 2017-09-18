var myContactID    = api.system.user().id;
var nNotifications = 0;
var window = $(this)[0];
var mobile = $(this).hasClass('wz-mobile-view');

if( !api.app.storage('ignoreRemoveEvent') ){
  api.app.storage( 'ignoreRemoveEvent', [] )
}

api.cosmos.on( 'postAdded', function( post ){

  if ( post.author === myContactID ) {
    return;
  }

  api.cosmos( post.worldId , function( err , world ){

    if (err) {
      return console.error(err);
    }

    api.user( post.author , function( err , user ){

      if (err) {
        return console.error(err);
      }

      var title;
      var text;
      if ( post.isReply ) {

        world.getPost( post.parent , function( err , postParent ){

          if (err) {
            return console.error(err);
          }

          var onclick;
          // Reply lvl 1
          if (!postParent.isReply) {

            // Reply to MY post
            if ( postParent.author === myContactID ) {
              title = user.name + ' ' + lang.bannerReplyPost;
              text = post.content;
              // Reply to a post
            }else{
              title = lang.bannerNewComment + world.name;
              text = user.name + ': ' + post.content;
            }
            title = title.replace(/<br\s*[\/]?>/gi, "\n");
            text = text.replace(/<br\s*[\/]?>/gi, "\n");

            onclick = function(){
              api.app.openApp( 360 , { action: 'selectPost' , post: postParent.id , world: world.id , title: postParent.title } , function(){});
            }
            sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

          // Reply lvl 2
          }else{


            // Reply to MY comment
            if ( postParent.author === myContactID ) {
              world.getPost( postParent.parent , function( err , grandparent ){

                if (err) {
                  return console.error(err);
                }

                title = user.name + ' ' + lang.bannerReplyComment;
                text = post.content;
                title = title.replace(/<br\s*[\/]?>/gi, "\n");
                text = text.replace(/<br\s*[\/]?>/gi, "\n");
                onclick = function(){
                  api.app.openApp( 360 , { action: 'selectPost' , post: grandparent.id , world: world.id , title: grandparent.title } , function(){});
                }
                sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

              });
            }
          }
        });

      }else{

        title = lang.bannerNewPost + world.name;
        text = user.name + ': ' + post.title;

        title = title.replace(/<br\s*[\/]?>/gi, "\n");
        text = text.replace(/<br\s*[\/]?>/gi, "\n");

        var onclick = function(){
          api.app.openApp( 360 , { action: 'selectPost' , post: post.id , world: world.id , title: post.title } , function(){});
        }
        sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

        if ( api.app.getViews( 'main' ).length === 0 ) {
          checkNotifications();
        }

      }

    });

  });

});

api.notification.on( 'new', function( notification ){
  checkNotifications();
})

api.notification.on( 'attended', function( list ){
  checkNotifications();
})

var sendBanner = function( info ){
  api.banner()
  .setTitle( info.title )
  .setText( info.text )
  .setIcon( info.image )
  .on( 'click' , info.onclick )
  .render();
}

var checkNotifications = function(){

  api.notification.list( 'cosmos' , function( err , notifications ){
    if (err) {
      return console.error(err);
    }
    wz.app.setBadge( notifications.length );
  });

}

var addArrow = function( appName, text, position ){

  var arrow = $( '<div class="onboarding-arrow"><figure></figure><span></span></div>' );
  arrow.find( 'span' ).text( text );
  arrow.addClass( 'arrow-' + appName );

  var top = 32 + position*44 - 20;

  arrow.css({

    'position': 'absolute',
    'top': top,
    'left': $( '#wz-taskbar', window.document ).width(),
    'margin-left' : '10px',
    'box-sizing' : 'border-box',
    'z-index' : -1,
    'display' : 'none'

  });

  arrow.find('figure').css({

    'width': '55px',
    'height' : '43px',
    'background-image' : 'url("https://static.horbito.com/app/357/flecha-dock.png")',
    'background-size' : '55px 43px',
    'float' : 'left'

  })

  arrow.find('span').css({

    'margin-left': '16px',
    'margin-top' : '4px',
    'font-family' : 'Lato',
    'font-size' : '21px',
    'font-weight' : 'bold',
    'color' : '#fff',
    'float' : 'left',
    'text-shadow' : '0 5px 10px rgba(0,0,0,.3)'

  })

  $( 'body', window.document ).append( arrow );

}


console.log('cosmos',typeof cordova == 'undefined')
if( typeof cordova == 'undefined' ){

  wql.isFirstOpen( [ api.system.user().id ] , function( err , o ){

    if (err) {
      return console.error(err);
    }

    if ( o.length === 0 ){

      addArrow( 'cosmos', lang.onboarding.arrow ,3 )

    }

  });

}

checkNotifications();
