'use strict'

angular
  .module('app.pusherNotifications', [
    'notification'
  ])
  .run ($notification, $rootScope) ->
    # console.log('run');
    # Pusher.log = (msg) ->
    #   console.log(msg)
    newRouteMessage = 'YOU HAVE A NEW ROUTE.'
    redTruckIcon = 'images/balloon.png'

    pusher = new Pusher('6b58c1243df82028a788', {
      cluster: 'eu',
      encrypted: true
    });

    channel = pusher.subscribe('new-route-channel');

    channel.bind('App\\Events\\NewRoute', (data)->
      if ($rootScope.currentUser.id == data.userId)
        $notification('New message!', {
          body: newRouteMessage
          icon: redTruckIcon
          vibrate: [200, 100, 200]
        })
    );

    return
