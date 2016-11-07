EditProfileCtrl = ($http, $state, Upload, $rootScope) ->
  vm = this

  $http.get('/api/profile/edit')
    .then (response) ->
      vm.user = response.data
      vm.user.remove_avatar = false

      vm.avatar = vm.makeAvatarLink(vm.user.avatar) # for delete_avatar directive
    , (error) ->
      vm.error = error.data

  vm.update = () ->
    avatar = vm.user.avatar

    if vm.user.avatar == '/images/default_avatar.jpg'
      vm.user.avatar = 'default_avatar.jpg' # todo hz may be for delete
      avatar = 'default_avatar.jpg'
    vm.data =
      avatar: avatar
      remove_avatar: vm.user.remove_avatar
      name: vm.user.name
      last_name: vm.user.last_name
      initials: vm.user.initials
      bday: vm.user.bday
      email: vm.user.email
      phone: vm.user.phone
      job_title: vm.user.job_title
      country: vm.user.country
      city: vm.user.city

    Upload.upload(
      url: '/api/profile/' + vm.user.id
      method: 'Post'
      data: vm.data
    ).then ((response) ->
      fileName = response.data
      console.log(fileName, vm.user.remove_avatar);
      storage = localStorage.getItem('user')
      storage = JSON.parse(storage)

      # Default avatar
      if typeof fileName == 'boolean' && vm.user.remove_avatar
        storage.avatar = 'default_avatar.jpg'
        $rootScope.currentUser.avatar =  'default_avatar.jpg'
      # Update storage
      else if typeof fileName == 'string' && !vm.user.remove_avatar
        storage.avatar = fileName
        $rootScope.currentUser.avatar = vm.makeAvatarLink(storage.avatar)
        storage.avatar = fileName

      localStorage.setItem('user', JSON.stringify(storage))

      $state.go 'profile', { flashSuccess: 'Profile updated!' }
    ), ((error) ->
      vm.error = error.data
      console.log(vm.error);
      return
    )

  vm.makeAvatarLink = (avatarName) ->
    if avatarName == 'default_avatar.jpg'
      avatarName = '/images/' + avatarName
    else
      avatarName = '/uploads/avatars/' + avatarName

    return avatarName

  return

'use strict'
angular
  .module('app')
  .controller('EditProfileCtrl', EditProfileCtrl)