var myContactID     = api.system.user().id;

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

        world.getPost( post.parent , function( e , parent ){

          var onclick;
          // Reply lvl 1
          if (!parent.isReply) {

            // Reply to MY post
            if ( parent.author === myContactID ) {
              title = lang.bannerNewCommentPostMine;
              text = post.content;
              // Reply to a post
            }else{
              title = lang.bannerNewCommentPostMine;
              text = post.content;
            }

            onclick = function(){
              api.app.openApp( 360 , { action: 'selectPost' , post: parent.id } , function(){});
            }
            sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

          // Reply lvl 2
          }else{


            // Reply to MY comment
            if ( parent.author === myContactID ) {
              world.getPost( post.parent , function( e , grandparent ){

                title = author.name + lang.bannerReplyComment;
                text = post.content;
                onclick = function(){
                  api.app.openApp( 360 , { action: 'selectPost' , post: grandparent.id } , function(){});
                }
                sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

              });
            }
          }
        });

      }else{
        title = lang.bannerNewPost + world.name;
        text = user.name + ': ' + post.title;

        onclick = function(){
          api.app.openApp( 360 , { action: 'selectPost' , post: post.id , world: world.id } , function(){});
        }
        sendBanner( { title: title , text: text , image: world.icons.tiny , onclick: onclick } );

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
