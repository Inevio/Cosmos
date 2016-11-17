var myContactID     = api.system.user().id;

api.cosmos.on( 'postAdded' , function( post ){

  if ( post.author != myContactID ) {

    wz.user( post.author , function( e , user ){

      api.banner()
      .setTitle( user.name + ' ' + lang.hasComment + ' ' + lang.post )
      .setText( post.content )
      .setIcon( user.avatar.tiny )
      .render();

    });

  }

});
