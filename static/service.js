var myContactID     = api.system.user().id;
var nNotifications  = 0;

api.cosmos.on( 'postAdded' , function( post ){

  if ( post.author === myContactID ) {
    return;
  }

  api.cosmos( post.worldId , function( e , world ){

    if (e) {console.log(e);return;}

    api.user( post.author , function( e , user ){

      if (e) {console.log(e);return;}

      var title;
      var text;
      if ( post.isReply ) {

        world.getPost( post.parent , function( e , postParent ){

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

            title = title.replace(/\n/g, "<br />");
            text = text.replace(/\n/g, "<br />");

            onclick = function(){
              api.app.openApp( 360 , { action: 'selectPost' , post: postParent.id , world: world.id , title: postParent.title } , function(){});
            }
            sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

          // Reply lvl 2
          }else{


            // Reply to MY comment
            if ( postParent.author === myContactID ) {
              world.getPost( postParent.parent , function( e , grandparent ){

                title = user.name + ' ' + lang.bannerReplyComment;
                text = post.content;
                title = title.replace(/\n/g, "<br />");
                text = text.replace(/\n/g, "<br />");
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

        title = title.replace(/\n/g, "<br />");
        text = text.replace(/\n/g, "<br />");

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

var sendBanner = function( info ){
  api.banner()
  .setTitle( info.title )
  .setText( info.text )
  .setIcon( info.image )
  .on( 'click' , info.onclick )
  .render();
}

var checkNotifications = function(){

  nNotifications = 0;

  wz.cosmos.getUserWorlds( myContactID , {from:0 , to:1000} , function( e , worlds ){

    worlds.forEach(function( world ){

      world.getPosts( {from: 0 , to: 1 } , function( e , lastPost ){

        if( lastPost.length === 0){
          wz.app.setBadge( parseInt(nNotifications) );
          return;
        }

        wql.selectLastRead( [ world.id , myContactID ] , function( e , lastPostReaded ){

          if ( lastPostReaded.length === 0 || lastPost[0].id != lastPostReaded[0].post ) {

            nNotifications = nNotifications + 1;
            wz.app.setBadge( parseInt(nNotifications) );

          }else{
            wz.app.setBadge( parseInt(nNotifications) );
          }

        });

      });

    });

  });

}

checkNotifications();
